# Implementation Plan

**Status:** Milestone 0 complete when this document set is reviewed and accepted
**Rule:** each milestone stops at its gate; no later milestone silently absorbs unresolved critical work

## Milestone 0 — Architecture first

Scope: repository inspection, domain model, module boundaries, queues, Meta adapter plan, AI abstraction, security model, deployment strategy, CampaignPackage, CampaignOrchestrator, landing-page schema, entitlements, and this documentation set.

Gate: documents are internally consistent, environment names are recorded, Meta-specific unknowns are explicit, and no feature implementation is started until review.

## Milestone 1 — Application foundation

Initialize Next.js/TypeScript/Tailwind/shadcn/ui, Prisma/PostgreSQL, Zod, authentication, design tokens, User/Organization/OrganizationMember, onboarding, dashboard shell, and tenant-aware authorization.

Tests: authentication, role policy, cross-tenant read/write denial, session security, and basic route protection.

Gate: format/lint/typecheck/tests pass; no known tenant or secret-handling issue.

## Milestone 2 — Clients and Brand Brain

Build client CRUD, client detail tabs, Brand Brain revisions/provenance, brand assets, website-analysis interface with explicit suggestions, and safe white-label branding basics.

Tests: ownership, revision restore, URL/upload validation, contrast handling, and website-analysis assumptions.

Gate: no client data crosses organizations; suggestions never silently become facts.

## Milestone 3 — Meta connection

Re-check current official Meta OAuth, permissions, asset endpoints, token lifecycle, access tier, and App Review requirements. Implement OAuth state/callback, encrypted token storage, connection health, asset discovery, selection, client mappings, reconnect, and human-readable errors. Do not publish campaigns.

Tests: OAuth state/CSRF, encryption/rotation, scope handling, asset ownership, reconnect, provider error translation, and token redaction.

Gate: endpoint contracts and final permission/version notes are recorded in `META_INTEGRATION.md`.

## Milestone 4 — Campaign domain

Implement CampaignIntent, CampaignPackage versions, Strategy, AdAngle, Blueprint/versioning, draft lifecycle, naming rules, creation-mode input foundations, and autosave.

Tests: normalization, mode convergence, blueprint overrides, naming, version restore, autosave concurrency, tenant isolation.

Gate: domain package is usable without Meta or AI.

## Milestone 5 — AI text

Implement provider ports/adapters, strategy-based copy and angle generation, text variants, single-variant transformations, version history, entitlements, AI jobs, and usage tracking.

Tests: structured output, context/tenant isolation, forbidden claims, transformations, retry classification, usage idempotency, and disabled-feature behavior.

Gate: uploaded/manual campaign content remains usable when AI is unavailable.

## Milestone 6 — Creative system

Implement private uploads, Creative Library, CreativeFamily, analysis abstraction, optional image generation/variation, format variants, metadata, and usage/entitlement controls.

Tests: MIME/content/size validation, signed URLs, family relationships, format handling, entitlement denial, job retries, and token/key redaction.

Gate: no fake image integration; any fixture is explicitly development-only.

## Milestone 7 — Landing-page builder

Implement templates, versioned blocks, renderer/editor, drag-and-drop commands, properties, responsive previews, AI generation, shared text transformations, forms, leads, safe publishing, and CSV export.

Tests: block schemas/migrations, renderer parity, mobile constraints, autosave, consistency validation, form validation, lead access/export/retention, and public/private asset boundaries.

Gate: page data remains structured and pages can be edited without raw HTML.

## Milestone 8 — Campaign orchestration

Connect intent, Brand Brain, blueprint, strategy, angles, copy, creatives, landing pages, tracking, assets, and quality checks through asynchronous CampaignOrchestrator jobs with persisted progress.

Tests: step ordering, resume/retry, job idempotency, package assembly, progress state, entitlement combinations, and partial failures.

Gate: generated packages are reviewable and traceable to their inputs.

## Milestone 9 — Quality engine

Implement factual validation, separate AI recommendations, review UI, evidence, critical blockers, warnings, and consistency checks.

Tests: required-field coverage, current Meta capability checks, URL/assets/budget, brand restrictions, creative coverage, and warning bypass policy.

Gate: critical errors block publish; recommendations are never presented as measured facts.

## Milestone 10 — Meta publishing

Re-check current official v26.0 endpoint contracts and access requirements. Implement versioned adapter, publishing job/steps, campaign/ad-set/creative/ad creation, uploads, verification, human-readable errors, idempotent retries, paused creation, and separate activation/pause commands.

Tests: duplicate prevention, partial failure/resume, provider retries, authorization, tenant isolation, paused invariant, activation audit, and external-ID persistence.

Gate: no unresolved high-risk publishing or spend-safety issue.

## Milestone 11 — Reporting

Implement scheduled Insights synchronization, local snapshots, campaign/client reports, date filters, dashboard metrics, and basic client-friendly reports.

Tests: pagination, late data, nullable metrics, attribution metadata, date scoping, rate-limit behavior, and tenant isolation.

Gate: dashboard reads local data by default and does not create live-call storms.

## Milestone 12 — Performance assistant

Implement rule-based alerts/recommendations with minimum sample thresholds, target KPIs, decline/winner detection, actionable actions, and then AI explanations.

Tests: realistic datasets, thresholds, evidence, objective-specific metrics, action payloads, and measured-versus-interpreted separation.

Gate: every actionable alert has a safe next step or is suppressed.

## Milestone 13 — Report automation

Implement report schedules, sync-before-report jobs, PDF generation when appropriate, email abstraction, recipients, language, and branding.

Tests: schedule/timezone behavior, duplicate prevention, delivery retry, artifact access, and report data watermarking.

## Milestone 14 — Licensing and billing

Implement entitlement resolution, plan limits, usage limits, SaaS subscription adapter, and self-hosted license adapter without coupling domain code to one provider.

Tests: entitlement precedence, expiry, limits, provider webhook idempotency, self-hosted offline behavior, and upgrade/downgrade transitions.

## Milestone 15 — Production hardening

Review security, tenant isolation, rate limits, uploads, encryption, logging, backups/restore, indexes, query performance, provider failures, retries, idempotency, Docker/Coolify, environment validation, and privacy documentation. Run the complete suite and a manual release review.

Gate: no failing business-critical tests, known critical security issues, broken migrations, unresolved spend-safety issue, or undocumented production dependency.

## Required validation loop for every milestone

1. Inspect the current repository and changed surface.
2. Implement only the milestone scope.
3. Run formatter, lint, TypeScript checks, and focused tests.
4. Fix failures and review security/tenant isolation.
5. Update architecture or operational documentation.
6. Summarize evidence and explicitly record remaining risks.
7. Continue only after the gate passes.
