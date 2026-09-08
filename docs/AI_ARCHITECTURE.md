# AI Provider and Usage Architecture

**Status:** Milestone 0 design

## Goals

AI increases speed and quality, but it does not become the system of record or an autonomous advertiser. The architecture must support multiple text, image, and analysis providers; make generated assumptions visible; enforce organization entitlements; track usage and cost; and preserve enough context to reproduce or audit a result.

## Provider ports

```ts
interface AITextProvider {
  generate(request: TextGenerationRequest): Promise<TextGenerationResult>;
  transform(request: TextTransformationRequest): Promise<TextGenerationResult>;
}

interface AIImageProvider {
  generate(request: ImageGenerationRequest): Promise<ImageGenerationResult>;
  vary(request: ImageVariationRequest): Promise<ImageGenerationResult>;
  edit(request: ImageEditRequest): Promise<ImageGenerationResult>;
}

interface AIAnalysisProvider {
  analyzeCreative(request: CreativeAnalysisRequest): Promise<CreativeAnalysisResult>;
  analyzeWebsite(request: WebsiteAnalysisRequest): Promise<WebsiteAnalysisResult>;
  explainPerformance(request: PerformanceExplanationRequest): Promise<PerformanceExplanationResult>;
}
```

These are ports, not provider SDK types. Adapter implementations translate provider-specific model names, safety settings, multimodal formats, retry behavior, and response metadata into internal results. Business modules depend on the ports and Zod-validated result schemas.

## Context assembly

The campaign engine builds a bounded, typed context from:

- CampaignIntent and campaign-specific brief;
- accepted Brand Brain facts and their provenance;
- Campaign Blueprint version;
- Campaign Strategy and selected AdAngle;
- creative analysis, when relevant;
- landing-page constraints and tracking requirements;
- user instruction and language/tone settings.

User-approved facts are distinguished from AI suggestions and untrusted website extraction. Forbidden terminology and claims are passed as hard constraints. The system must not present an inferred employer benefit, statistic, testimonial, or legal/compliance statement as fact without an explicit source or user approval.

## Strategy-first generation

The generation contract is staged:

1. Analyze and normalize the brief.
2. Produce a structured strategy with assumptions and missing-information warnings.
3. Produce a small set of relevant ad angles.
4. Generate copy and creative concepts per angle.
5. Validate outputs against Brand Brain, strategy, destination, and quality rules.

Copy buttons transform one selected variant only. The selected text, original version, transformation action, custom instruction, and new version are stored in `TextVersion`; the whole campaign is not regenerated.

## Structured output and validation

Every provider response is parsed at the boundary with Zod. Expected output includes explicit fields such as `content`, `assumptions`, `sourceReferences`, `warnings`, and `modelMetadata`. Invalid or incomplete output is retried only under a bounded policy; after exhaustion, the job is marked failed or needs review. Do not recover by silently accepting arbitrary text or inventing missing fields.

Prompt templates are versioned application assets. Persist template version, provider, model, temperature/safety configuration where applicable, input entity, and output entity on `AIJob`. Avoid storing raw prompts containing sensitive lead data by default; store a redacted context reference or a governed encrypted artifact only when reproducibility requires it.

## Entitlements and budgets

Before enqueuing work, the use case calls the entitlement service for a feature key such as `AI_TEXT`, `AI_IMAGE_GENERATION`, `AI_ANALYSIS`, or `PERFORMANCE_ASSISTANT`, then reserves or checks usage limits. Image generation is optional: when disabled, the UI and server reject only image-generation operations while upload, library reuse, analysis where entitled, and campaign creation remain functional.

Each completed operation records `AIUsage` with organization/user, usage type, provider/model, units, estimated cost, and timestamp. Usage accounting is idempotent by job/output ID. Provider billing is never exposed as an exact invoice unless the provider contract supports it; estimated cost is labeled as an estimate.

## Safety and privacy

- Keep provider keys server-side in secret management.
- Send the minimum context required for the task.
- Do not send lead submissions to a model unless a separately approved feature requires it.
- Redact access tokens, credentials, unnecessary personal data, and internal security metadata.
- Record provider data-retention and training-use assumptions in privacy documentation before enabling production traffic.
- Add output moderation and policy checks appropriate to the selected provider and advertising use case.
- Require user review before publishing AI-generated campaign or landing-page content.

## Failure behavior

AI jobs use durable queues, bounded retries, timeouts, and provider-specific error translation. A provider outage must leave existing drafts and uploaded creatives usable. The system can fall back to another configured provider only when output compatibility and cost/entitlement policy allow it; fallback is recorded in the job metadata. A missing optional provider must produce an explicit disabled/unavailable state, never a silent mock.

## Test priorities

Test context isolation between organizations, forbidden-claim enforcement, structured-output parsing, one-variant transformations, entitlement denial, usage idempotency, provider timeout/retry classification, fallback behavior, and persistence of assumptions versus approved facts.
