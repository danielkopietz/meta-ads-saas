# Meta Integration Plan

**Status:** Milestone 0 integration boundary
**Verification date:** 2026-09-08
**Implementation rule:** re-check the exact endpoint contract immediately before writing adapter code

## What was verified

Meta’s official developer news identifies Graph API v26.0 and Marketing API v26.0 as the July 29, 2026 release and explicitly warns that the release includes capabilities, deprecations, and breaking changes. The implementation baseline is therefore **v26.0, pinned through configuration**, subject to confirming availability and endpoint support in Meta’s current official changelog and App Dashboard when Milestone 3/10 begins.

Meta also announced in May 2026 that the former Ads Management Standard Access feature is now called **Marketing API Access Tier**, with Limited Access and Full Access labels. The announcement distinguishes this access tier from the `ads_management` permission and documents qualification signals shown in the App Dashboard. The product must track access tier and permission state separately.

Official references used for this baseline:

- [Meta developer news: Graph API v26.0 and Marketing API v26.0](https://developers.facebook.com/blog/post/2026/07/29/introducing-graph-api-v26-and-marketing-api-v26/)
- [Meta developer news: Marketing API Access Tier changes](https://developers.meta.com/blog/updates-to-ads-management-standard-access-feature/)
- [Meta Marketing API documentation](https://developers.facebook.com/documentation/ads-commerce/marketing-api)
- [Meta permissions reference](https://developers.facebook.com/docs/permissions/reference/)
- [Meta Business Manager API getting started](https://developers.facebook.com/docs/marketing-api/business-manager-api/get-started/)
- [Meta campaign group reference](https://developers.facebook.com/docs/marketing-api/reference/ad-campaign-group/)
- [Meta Insights API documentation](https://developers.facebook.com/docs/marketing-api/insights/)
- [Meta access token guide](https://developers.facebook.com/docs/facebook-login/guides/access-tokens/)

The legacy `developers.facebook.com` pages were rate-limited during this inspection, so the official pages above are recorded as implementation sources rather than treating search snippets or third-party SDKs as authoritative. Any field or permission not confirmed from the live endpoint documentation remains provisional.

## Integration principles

- SaaS login and Meta connection are separate concerns.
- Meta tokens are server-side only and encrypted at rest.
- The UI talks to internal application use cases, never to Graph API endpoints.
- Provider IDs and raw payloads are retained only behind the Meta module; internal campaign types remain provider-independent.
- The adapter is versioned and emits capability/validation results instead of allowing unsupported combinations to reach publishing.
- Publishing defaults to paused/non-spending behavior wherever the current API supports it, and server-side activation is a separate authorized command.
- Insights are synchronized into local snapshots on a schedule; dashboard pages do not query Meta live by default.

## Services and ports

```text
MetaAuthService
MetaAssetService
MetaBusinessService
MetaAdAccountService
MetaCampaignService
MetaAdSetService
MetaCreativeService
MetaAdService
MetaInsightsService
MetaErrorTranslator
CurrentMetaAdapter (v26.0 baseline)
```

Only the adapter knows Graph paths, field names, request serialization, pagination, rate-limit headers, and provider error shapes. Services expose internal commands such as `discoverAssets`, `createCampaign`, `createAdSet`, `createCreative`, `createAd`, `fetchInsights`, `pauseCampaign`, and `activateCampaign`.

## OAuth and asset discovery

The connection flow is:

1. Authenticated organization member selects `Meta verbinden`.
2. Server creates a signed OAuth state containing organization, user, nonce, and expiry; no access token is placed in the browser.
3. User completes Meta authorization with the minimum scopes required for the selected product capabilities.
4. Callback validates state, exchanges the code server-side, encrypts the resulting token, and records granted scopes and expiry.
5. Server discovers only assets supported by the granted scopes and current API.
6. User selects businesses, ad accounts, pages, Instagram identities, pixels/datasets, and other supported assets for a Client.
7. The connection is marked healthy only after a small authenticated validation call succeeds.

Candidate permissions to validate at Milestone 3, per endpoint and use case, include `ads_read`, `ads_management`, `business_management`, page/account discovery permissions, and any insight or lead-retrieval permission required by the selected integration. The app must request the minimum set, record the exact granted set, show missing capability explanations, and block only the features that genuinely require a missing scope.

Do not assume that a user’s access to one business implies access to every shared ad account or page. Asset discovery must preserve the provider’s relationship and access information.

## Objective and field mapping

Internal campaign categories are user-friendly: `LEAD_GENERATION`, `RECRUITING`, `SALES`, `TRAFFIC`, `AWARENESS`, and `CUSTOM`. They are not Meta objective constants. A capability-driven mapping table in the adapter will map an internal goal plus destination, optimization goal, promoted object, conversion event, and account capabilities to the currently supported Meta configuration.

The adapter must validate, using current documentation and account metadata:

- supported objective/outcome and buying type;
- destination and conversion location;
- optimization goal and promoted object requirements;
- budget and schedule behavior;
- placement and creative-format compatibility;
- Page and Instagram identity requirements;
- pixel/dataset and event requirements;
- special category or recruiting-related restrictions where applicable;
- current campaign/ad-set/ad fields and deprecated fields.

Unsupported combinations become factual quality errors with a human-readable explanation. They are not silently coerced into a different campaign type.

## Publishing lifecycle

The application writes a `PublishingJob` and granular `PublishingStep` rows. The worker executes:

```text
READY
  → VALIDATING
  → CREATE_CAMPAIGN
  → CREATE_ADSETS
  → UPLOAD_ASSETS
  → CREATE_CREATIVES
  → CREATE_ADS
  → VERIFY
  → PUBLISHED_PAUSED
```

Each step stores local entity ID, external ID, adapter version, request fingerprint, attempt count, provider error classification, and completion time. On retry, a completed step with a matching fingerprint is skipped after verifying the external object when necessary. A later failed step resumes from the first incomplete step. The job and campaign are never marked `ACTIVE` during normal publishing.

Activation is a separate command with its own authorization, audit event, quality re-check, and idempotency key. If the current API cannot guarantee a paused creation state for a particular object, the adapter must fail closed and document the provider-specific safety procedure rather than claiming the invariant is met.

## Error translation and retries

`MetaErrorTranslator` converts provider errors into:

- stable internal error code;
- German explanation;
- suggested user action;
- retryability and backoff class;
- expandable redacted technical detail;
- provider trace/reference ID.

Retry transient network, rate-limit, and explicitly retryable provider failures with bounded exponential backoff and jitter. Do not retry validation, permission, policy, malformed creative, or destination errors without a state change. Respect rate-limit headers and use a per-organization/provider concurrency budget.

## Insights synchronization

The sync worker uses the Insights API through `MetaInsightsService`, stores normalized nullable metrics, records the provider version and attribution settings, and advances a durable sync watermark only after a complete page/range is persisted. It must handle pagination, partial ranges, late-arriving data, and metric availability by objective. Dashboards read local snapshots. A manual refresh enqueues a bounded sync job rather than issuing unbounded live calls.

## App Review and operational checklist

Before production access:

- register the Meta app and configure the exact OAuth redirect URIs;
- confirm app mode, business verification, Marketing API product, access tier, and App Review requirements;
- produce reviewer flows for connecting, selecting assets, publishing paused, activating, pausing, and reporting;
- verify data-use disclosures and retention for client data and leads;
- run endpoint contract tests against a dedicated test business/ad account;
- record the final API version, permissions, objective mappings, required fields, rate-limit behavior, token lifecycle, and known limitations in this document.

## Open Meta questions before implementation

- Which exact Meta login product and authorization flow is current for this app type and multi-client agency model?
- Which permissions are required for each discovered asset and each write/read/reporting capability after App Review?
- Which v26.0 campaign outcomes, destinations, optimization goals, promoted objects, and creative formats are available for the first supported goals?
- Does the current API guarantee paused creation for every object in our pipeline, or are there object-specific safeguards?
- What token expiry, long-lived-token, revocation, and reconnect behavior applies to the chosen OAuth flow?
- What rate-limit headers and retry semantics are available for the selected endpoints?

No Meta publishing code should be written until these questions are answered from current official endpoint documentation and recorded here.
