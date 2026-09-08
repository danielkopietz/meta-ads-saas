# Meta Ads SaaS Architecture

**Status:** Milestone 0 architecture baseline
**Date:** 2026-09-08
**Audience:** Engineering, product, security, and operations

## Repository finding

The repository contained only an empty Git repository on the `main` branch. There was no package manifest, application code, database schema, dependency lockfile, deployment configuration, or existing design system. This document therefore records the initial architecture rather than a migration from an existing system.

## Architectural decisions

- Build a modular monolith in TypeScript with Next.js App Router, React, Tailwind, shadcn/ui, Zod, Prisma, PostgreSQL, Redis, BullMQ, and S3-compatible object storage.
- Keep web and worker processes in the same codebase and deployable as separate processes. Do not introduce microservices until an operational bottleneck justifies one.
- Keep domain concepts provider-independent. Meta Graph API objects, AI provider payloads, billing-provider objects, and storage-provider keys stay behind adapters.
- Use German UI copy for MVP and store user-facing strings through an i18n boundary so additional locales can be added later.
- Treat `CampaignPackage` as the reviewable source of truth before any external publication.
- Treat a publish operation as a durable, resumable job. Creating a campaign never implies activating spend.

## System boundaries

```text
Browser
  │ HTTPS, authenticated session, CSRF-protected mutations
  ▼
Next.js web application
  ├─ route handlers / server actions
  ├─ application use cases
  ├─ tenant-aware repositories
  └─ domain modules
       ├─ campaigns and orchestration
       ├─ clients and Brand Brain
       ├─ creatives
       ├─ landing pages and leads
       ├─ performance and reports
       ├─ entitlements, licensing, billing
       └─ audit
  │                         │
  │ PostgreSQL / Redis      │ outbound adapters
  ▼                         ▼
Worker process          Meta / AI / S3 / email / billing providers
```

The browser never calls Meta or an AI provider directly. It calls application use cases, which authenticate the user, resolve the active organization, check entitlements, validate input, and then call a domain service or enqueue a job.

## Runtime components

### Web process

Serves the UI and short-lived application requests. It may create database records and enqueue jobs but must not hold an HTTP request open for campaign generation, publishing, insight synchronization, report delivery, or image generation.

### Worker process

Consumes named BullMQ queues, loads durable job state, runs idempotent service steps, and writes progress, results, errors, and audit events. Worker handlers must be safe to retry and must never log access tokens or provider secrets.

### PostgreSQL

Stores tenant-owned domain data, encrypted provider credentials, normalized campaign packages, version history, job state, insights, leads, reports, entitlements, and audit records. Prisma is the data-access boundary; repositories require an organization scope for organization-owned records.

### Redis

Stores BullMQ queue state, retry/backoff metadata, and short-lived operational coordination. Redis is not the source of truth for business state.

### Object storage

Stores uploaded and generated creative files, logos, and report artifacts. Database records hold ownership, metadata, content hashes, and storage keys. User filenames are never used as storage keys.

## Module structure

```text
src/
  app/                         # routes, layouts, route handlers
  modules/
    auth/
    organizations/
    clients/
    brand/
    meta/
      auth/
      assets/
      adapters/
      campaigns/
      insights/
    campaigns/
      intent/
      strategy/
      blueprints/
      orchestration/
      validation/
      publishing/
    copy/
    creatives/
    landing-pages/
    performance/
    reporting/
    ai/
      providers/
      usage/
    entitlements/
    billing/
    licensing/
    audit/
  db/                          # Prisma client, repositories, transactions
  queue/                       # queue names, job contracts, worker bootstrap
  storage/                     # object storage port and adapters
  security/                    # crypto, validation, rate limits, headers
  lib/                         # small, genuinely shared infrastructure
```

Avoid catch-all files such as `utils.ts`, `services.ts`, or a single mega-orchestrator. A module owns its use cases, domain types, ports, persistence mapping, and tests unless a dependency is intentionally shared.

## Request and job rules

Every mutation follows this sequence:

1. Authenticate the session.
2. Resolve the active organization from server-side membership, never from a client-supplied organization ID alone.
3. Authorize the action and check the feature entitlement.
4. Parse the request with Zod.
5. Load tenant-owned records through scoped repositories.
6. Run the use case in a transaction where state transitions must be atomic.
7. Write an audit event for important actions.
8. Enqueue durable work when the operation is long-running or retryable.

The UI may poll job status. It must not infer completion from a request returning successfully; completion is represented by persisted state.

## Tenant isolation

`Organization` is the SaaS tenant. `Client` is an organization’s marketing client. Every organization-owned table includes `organizationId` directly or through a relation whose scope is checked server-side. Repository APIs require a scope object, for example:

```ts
type OrganizationScope = { organizationId: string };
findCampaign(scope: OrganizationScope, campaignId: string): Promise<Campaign | null>;
```

Commands must re-check ownership at the point of mutation. IDs from the browser are references, not authorization. Tests must include cross-tenant read, update, publish, asset download, lead export, and job access attempts.

## Authentication and authorization

The SaaS account is the primary login. Milestone 1 uses email/password authentication with bcrypt password hashes and opaque random session tokens stored only as SHA-256 hashes in the `Session` table. The token is delivered through an HttpOnly, Secure-in-production, SameSite cookie; authentication state is never stored in localStorage. Meta OAuth is a separate integration connection. Initial organization roles are `OWNER`, `ADMIN`, and `MEMBER`; all authenticated members can operate campaigns, while organization settings, billing, licensing, team membership, and destructive organization actions are owner-only unless a later policy explicitly expands them. Authorization is enforced in use cases and repositories, not only in route layouts.

## External provider boundaries

- `modules/meta` exposes internal types and ports; only Meta adapters know Graph API field names.
- `modules/ai` exposes text, image, and analysis ports; business logic never imports a provider SDK directly.
- `storage` exposes upload, signed-read, delete, and metadata operations; generated keys and content validation are centralized.
- `billing` and `licensing` expose plan, subscription, license, and entitlement ports; commercial pricing is configuration, not domain logic.

## Deployment modes

The same application supports `DEPLOYMENT_MODE=SAAS` and `DEPLOYMENT_MODE=SELF_HOSTED`. SaaS mode may use central billing, email, and managed object storage. Self-hosted mode must be able to run the core application, PostgreSQL, Redis, worker, and storage against customer-controlled infrastructure, with licensing checks isolated behind a port. No module may require a permanent call to a central service for core campaign drafting, editing, or local publishing.

## Feature entitlements

Product code asks the entitlement service questions such as `hasFeature(organizationId, "AI_IMAGE_GENERATION")` and `getLimit(organizationId, "CLIENTS")`. It never compares a plan name directly. Plans, subscriptions, one-time licenses, grants, expiry dates, overrides, and usage limits resolve to a common entitlement decision containing enabled state, limit, reason, and effective dates. Initial feature keys include `META_PUBLISHING`, `AI_TEXT`, `AI_IMAGE_GENERATION`, `LANDING_PAGE_BUILDER`, `PERFORMANCE_ASSISTANT`, `REPORTING`, and `WHITE_LABEL`. Disabled optional features return an explicit product state and leave independent workflows usable.

## Observability

Use structured logs with request ID, organization ID, user ID where appropriate, job ID, and campaign ID. Redact tokens, cookies, authorization headers, prompts containing sensitive lead data, and provider secrets. Add health and readiness checks for the web process, worker, PostgreSQL, Redis, and storage at deployment time. Leave a narrow adapter boundary for an error-monitoring provider.

## Architectural invariants

- No raw Meta API calls from UI code.
- No raw Meta access tokens in browser storage, logs, URLs, or client props.
- No campaign activation as a side effect of publishing.
- No duplicate external entities on a retry.
- No AI-generated assumption becomes a factual brand claim without user visibility and editability.
- No feature gate is implemented as scattered plan-name comparisons.
- No cross-tenant record can be loaded or mutated with an unscoped ID.
