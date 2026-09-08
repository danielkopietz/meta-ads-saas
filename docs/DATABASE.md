# Database and Domain Model

**Status:** Milestone 0 design
**Storage:** PostgreSQL via Prisma

## Modeling principles

The database separates organization-owned data, reusable knowledge, generated campaign drafts, external integrations, durable jobs, and measured outcomes. Flexible JSON is used only at stable extension points such as landing-page block content, provider metadata, and an immutable campaign package snapshot; core relationships and query fields remain typed columns.

Every organization-owned model is scoped to `organizationId` directly or through a mandatory parent relation. External IDs are namespaced by provider and account, never treated as globally unique. Timestamps are UTC. Monetary values use integer minor units plus an ISO currency code; rates and percentages use decimal types where precision matters.

## Identity and tenancy

### `User`

SaaS identity: id, email, display name, locale, timezone, status, createdAt, updatedAt.

### `Session`

Server-side session record or the persistence required by the selected auth library. Store hashed session identifiers, expiry, user relation, and revocation state. Never store provider credentials here.

### `Organization`

Tenant: name, slug, deployment metadata, default locale/timezone, branding settings, createdAt, updatedAt.

### `OrganizationMember`

User-to-organization membership: organizationId, userId, role (`OWNER | ADMIN | MEMBER`), status, invitedAt, joinedAt. Unique `(organizationId, userId)`.

### `Subscription`, `License`, `FeatureEntitlement`

Commercial state is separated from feature evaluation. A subscription stores provider-neutral plan and lifecycle state. A self-hosted license stores an opaque license reference, validity, and limits. `FeatureEntitlement` resolves organization, feature key, enabled state, source, limits, and effective dates. Plan names and prices are not used directly by product code.

## Client knowledge

### `Client`

Organization marketing client: name, slug, website URL, industry, status, default currency, createdBy, timestamps. Unique slug within an organization.

### `BrandBrain`

One current structured knowledge document per client, with revision metadata. Fields include company description, products/services, audiences, USPs, pain points, benefits, tone, terminology, forbidden terminology, forbidden claims, competitors, important URLs, colors, instructions, and a provenance marker per field (`USER`, `WEBSITE_ANALYSIS`, `IMPORTED`). Analysis suggestions remain separate until accepted.

### `BrandAsset`

Logo, reference creative, brand image, or other approved asset. Stores client and organization ownership, object-storage key, type, dimensions, content hash, approval state, and metadata.

## Meta integration

### `MetaConnection`

One connection record per organization/provider/account context: provider, Meta user/business references, encrypted access token ciphertext, encryption key version, token expiry when known, connection status, last validation, scopes granted, and failure metadata. The encryption service owns encryption/decryption; application code never handles plaintext longer than needed for one provider call.

### `MetaBusiness`, `MetaAdAccount`, `MetaPage`, `MetaInstagramAccount`, `MetaPixelOrDataset`

Discovered external assets cached for selection. Each stores organization ownership, external ID, name/status, provider payload version, last discovered timestamp, and an optional connection relation. Use a separate `ClientMetaAsset` mapping table to associate selected assets with a client. A client can have one default ad account and page only through an explicit, constrained relation; do not hide ambiguity in a JSON blob.

## Campaign domain

### `CampaignIntent`

Normalized creation input: organizationId, clientId, sourceType, campaignGoal, offer, audienceHints, budget, schedule, uploaded asset references, source URL, bullet points, blueprint version reference, additional instructions, and intent version. This is the durable input to orchestration and can be edited before generation.

### `CampaignGenerationJob`

Durable asynchronous generation state: intentId, status, currentStep, progress metadata, attempt count, error classification, startedAt, completedAt, requestedBy. Step events can be a child table if progress history is shown in the UI.

### `CampaignPackage`

A versioned, provider-independent snapshot assembled for review. It references or embeds the strategy, audience plan, ad sets, angles, text variants, creative references, landing-page version, tracking plan, naming decisions, and quality report. Keep immutable package versions so a user can compare or restore a reviewable draft.

### `CampaignStrategy`, `AdAngle`

Strategy is a structured plan containing goal, primary message, benefits, proof, risks, audience hypotheses, channel assumptions, and recommended testing plan. An angle belongs to a strategy/campaign and includes type, title, hook, core message, supporting points, target emotion, provenance, and status.

### `Campaign`, `AdSet`, `Ad`

Internal hierarchy with lifecycle status, target KPIs, budget/schedule, strategy/package references, naming snapshot, and provider IDs. `AdSet` stores audience and placement configuration in typed domain JSON where provider-neutral. `Ad` references a creative family/variant and selected copy variants. Do not make Meta’s object shape the schema.

### `CampaignBlueprint`, `CampaignBlueprintVersion`

Reusable organization knowledge. A blueprint has identity and lifecycle; each version stores goal defaults, ad-set count, targeting logic, budget/placement rules, creative requirements, copy counts, landing-page template, tracking defaults, naming rules, and a schema version. Published versions are immutable.

### `TextVariant`, `TextVersion`

Generated or user-authored copy is separated from its revisions. Store field type, content, angle, tone, length, hook type, provenance, provider/model metadata, generation job, and selected status. Transformations create a new version rather than overwriting history.

## Creative system

### `CreativeAsset`

Organization/client-owned media with object-storage key, source (`UPLOAD | AI_GENERATED | LIBRARY | DERIVED`), format, dimensions, MIME type, content hash, tags, campaign relation where applicable, and approval state.

### `CreativeFamily`

Groups an original concept with format variants and generated variations. Store the family’s source asset, concept metadata, and client/organization ownership. Performance data later rolls up to this level.

### `CreativeGeneration`, `CreativeAnalysis`

Durable job/result records. Analysis stores structured observations such as detected subject, visible text, aspect ratio, visual style, readability warnings, format warnings, and campaign relevance. It must not imply a fabricated numeric performance score.

## Landing pages and leads

### `LandingPage`, `LandingPageVersion`, `LandingPageBlock`

A landing page has lifecycle and publication identity. Versions are draft/published snapshots. Blocks store stable type, order, `contentJson`, `settingsJson`, `styleJson`, and a schema version. The page is never persisted as one arbitrary HTML blob.

### `LandingPageForm`, `FormField`, `Lead`

Forms belong to a page version or page according to the publication model. Fields store type, label, key, order, required state, options, and validation. Leads store client/campaign/page ownership, consent metadata where applicable, submitted values encrypted or minimized according to field sensitivity, and retention/deletion metadata. CSV export is a scoped use case, not direct table access.

## Publishing, measurement, and reporting

### `PublishingJob`, `PublishingStep`

The job stores campaign/package reference, requestedBy, state, idempotency key, provider adapter version, and error summary. Each step stores step type, local entity ID, external ID, status, attempt count, request fingerprint, safe provider reference, error code/message, timestamps, and retryability. Unique constraints prevent a second successful step for the same job/entity/step type.

### `InsightSnapshot`

Append-only or upsertable measured data at campaign, ad-set, ad, and creative-family granularity. Store date grain, provider account, dimensions, raw provider metric names/version, normalized nullable metrics, currency, attribution metadata, and sync batch reference. Do not assume every objective provides every metric.

### `PerformanceAlert`, `PerformanceRecommendation`

Alerts reference measured snapshots and rule version/sample thresholds. Recommendations store a clear action key, action payload, severity, status, evidence references, and optional AI explanation. Measured evidence and AI interpretation are separate fields.

### `ReportConfiguration`, `GeneratedReport`

Configuration stores organization/client scope, recipients, frequency, local day/time, language, branding snapshot, and enabled state. Generated reports store date range, source sync watermark, artifact key, delivery state, and immutable content metadata.

## AI, audit, and operations

### `AIJob`, `AIUsage`

`AIJob` tracks operation type, entity, status, provider/model, prompt-template version, input reference, output reference, and error classification. `AIUsage` stores organization/user, usage type, provider/model, units, estimated cost, and createdAt. Avoid storing full prompts or sensitive lead data unless required and governed.

### `AuditLog`

Append-only record with organizationId, userId/service actor, action, entity type/id, redacted old/new values where appropriate, metadata, request ID, and timestamp. Important actions include integration changes, campaign edits, spend-affecting transitions, publishing, activation, pause, settings, exports, and destructive operations.

## Constraints and indexes

Start with indexes driven by known access paths:

- membership `(organizationId, userId)` and organization slug;
- client `(organizationId, status, createdAt)`;
- campaigns `(organizationId, clientId, status, createdAt)`;
- external IDs `(provider, externalId)` plus organization/connection scope;
- jobs `(organizationId, status, createdAt)` and publishing steps `(jobId, status)`;
- insight snapshots `(organizationId, campaignId, date)` and reporting dimensions used by date-range queries;
- leads `(organizationId, clientId, campaignId, createdAt)`.

Add unique constraints only where the business invariant is real. Use partial or compound constraints for one default client asset and one active published version. Revisit indexes after query instrumentation rather than indexing every foreign key blindly.
