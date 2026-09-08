# Security and Privacy Model

**Status:** Milestone 0 design
**Initial market:** DACH / EU-oriented deployment

## Security objectives

Protect tenant isolation, Meta credentials, AI/provider secrets, client creative assets, landing-page leads, and spend-affecting actions. Security decisions are enforced server-side and are observable through audit records and structured logs.

## Authentication and authorization

Use secure authentication with HttpOnly, Secure, SameSite cookies in production, short-lived sessions with revocation, password-reset protections if passwords are supported, and MFA readiness. Meta OAuth is never the primary SaaS login.

Every request resolves an active organization from the authenticated session and membership. All use cases perform authorization checks. Repositories require organization scope. Export, signed asset URLs, job status, and public-page administration receive the same tenant checks as ordinary records.

Roles are `OWNER`, `ADMIN`, and `MEMBER`. Members can create and manage campaigns, creatives, reports, and publishing actions according to entitlements. Owner-only actions include organization settings, billing, licensing, team membership, and destructive organization operations. Every policy is tested with a matrix of role, resource, tenant, and action.

## Meta token protection

Meta access tokens are encrypted at rest using a dedicated `TokenEncryptionService` backed by `TOKEN_ENCRYPTION_KEY` from secret management. Store ciphertext, nonce/IV, authentication tag, key version, token expiry, scopes, and provider/account metadata. Support key rotation by version. Plaintext exists only in server memory for the minimum duration of an adapter call.

Never expose tokens in HTML, client props, localStorage, query strings, logs, exceptions, analytics, backups without encryption, or audit metadata. Never log authorization headers. Revoke/delete credentials on disconnect according to the current Meta contract and retain only non-sensitive audit metadata.

## Secrets and configuration

AI keys, Meta app secret, database credentials, Redis credentials, storage credentials, email credentials, session secrets, and encryption keys are environment-injected or managed by the deployment secret store. `.env.example` contains placeholders only. Validate required variables at process startup and fail closed with a non-sensitive error.

## Input, output, and upload safety

- Parse all external input with Zod, including provider responses and webhook payloads.
- Use parameterized Prisma queries and narrow repository methods.
- Apply CSRF protection to cookie-authenticated state changes where the framework does not already provide it.
- Rate-limit login, OAuth initiation/callback, generation, uploads, exports, public forms, and spend-affecting actions by account/organization/IP as appropriate.
- Validate upload MIME type, detected content type, size, image/video dimensions, and allowed formats. Generate storage keys; never trust filenames. Scan or quarantine uploads as the deployment can support. Do not execute uploaded content.
- Sanitize public-page content and restrict arbitrary HTML, scripts, CSS URLs, and embeds.
- Validate redirects, destination URLs, webhook URLs, and CSV export parameters.

## Spend and publishing safety

Publishing and activation are distinct permissions and commands. A new campaign is created paused/non-spending wherever the current Meta adapter can guarantee it. Activation requires a fresh server-side authorization check, current validation, explicit user action, idempotency key, and audit event. If provider behavior is ambiguous, the adapter fails closed.

Publishing steps are idempotent and store external IDs. A retry resumes missing steps and cannot create duplicate campaigns, ad sets, creatives, or ads. Human-readable errors expose safe guidance and expandable redacted provider details.

## Data minimization and DACH privacy posture

Document the personal data stored: SaaS identities, organization membership, OAuth metadata, lead form submissions, audit actors, and operational logs. Record Meta and AI provider data flows, hosting region, retention, subprocessors, and whether provider data may be used for training according to the applicable contract. Do not make automatic legal compliance claims; obtain legal review for GDPR notices, processor agreements, consent, recruiting-related data, retention periods, and special-category advertising restrictions.

Lead data requires purpose limitation, access controls, export/deletion workflows, retention metadata, and least-privilege support access. AI features should send the minimum context and should not send lead submissions by default.

## Audit and observability

Audit integration connect/disconnect, asset selection, campaign creation/edit/budget changes, generation, publication, activation, pause, exports, branding/settings changes, and destructive operations. Audit values are redacted and append-only. Logs include request/job/campaign IDs and organization context but no secrets or unnecessary personal data. Critical worker failures produce alertable structured events.

## Resilience and operations

Use HTTPS-only production, secure headers, dependency scanning, database least privilege, encrypted backups, tested restore procedures, rotation runbooks, and separate development/test credentials. Define incident response for token exposure, cross-tenant access, lead exposure, accidental activation, provider outage, and queue duplication. Do not rely on frontend hiding or an untested backup as a control.

## Security acceptance gates

Before production: tenant-isolation tests pass; token encryption/rotation tests pass; uploads are validated; rate limits exist on abuse-sensitive paths; activation is separately authorized; publishing retries are idempotent; secrets are absent from bundles/logs; backups restore successfully; privacy documentation names providers and data flows; and a manual threat-model review is complete.
