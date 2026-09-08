# Campaign Engine and Orchestration

**Status:** Milestone 0 design

## Domain pipeline

All creation modes produce the same normalized input and output types:

```text
Creation mode
  → CampaignIntent
  → CampaignOrchestrator
  → CampaignPackage version
  → CampaignQualityService
  → user review
  → MetaPublishingPipeline
```

The `sourceType` records whether the intent came from quick, guided, advanced, website, recruiting, creative-first, blueprint, or AI-first creation. The source changes how input is collected, not the downstream domain contract.

## CampaignIntent

The intent is the durable, editable brief:

```ts
type CampaignIntent = {
  organizationId: string;
  clientId: string;
  sourceType: CampaignSourceType;
  campaignGoal: CampaignGoal;
  offer?: OfferInput;
  audienceHints?: AudienceHints;
  budget?: BudgetInput;
  schedule?: ScheduleInput;
  uploadedAssetIds: string[];
  sourceUrl?: string;
  bulletPoints: string[];
  blueprintVersionId?: string;
  additionalInstructions?: string;
};
```

The exact TypeScript types will be introduced with Zod schemas at Milestone 4. Input is validated at the boundary, normalized to internal enums/value objects, and versioned. Provider-specific objective strings do not enter this model.

## CampaignPackage

`CampaignPackage` is the provider-independent review snapshot. It contains:

- client and campaign identity;
- goal, offer, budget, schedule, and tracking plan;
- strategy, audience plan, and selected ad angles;
- ad-set plans and ad combinations;
- text variants with version and provenance metadata;
- creative family/asset references and format coverage;
- landing-page version reference and form configuration;
- provider-neutral Meta asset selections;
- factual quality report and optional recommendations;
- naming snapshots and package/schema versions.

The package is generated as a new version. Manual review edits create a new version or an explicit draft mutation with history, so a published result can always be traced to the reviewed package that produced it.

## Orchestrator responsibilities

`CampaignOrchestrator` coordinates, but does not own the detailed rules. Its steps are:

1. Load and authorize the intent, client, Brand Brain, blueprint version, and uploaded assets.
2. Resolve entitlements and select available providers.
3. Analyze missing information and creative context.
4. Produce a Campaign Strategy.
5. Produce relevant Ad Angles.
6. Build audience and structure recommendations from the blueprint and goal.
7. Generate copy and creative concepts through AI ports where enabled.
8. Generate or attach a landing page where requested and entitled.
9. Build tracking and naming plans.
10. Assemble a CampaignPackage.
11. Run factual quality checks and store recommendations separately.
12. Mark the package `NEEDS_REVIEW` or `READY` according to policy.

The orchestrator delegates to `BrandContextService`, `CampaignStrategyService`, `CampaignBlueprintService`, `AudienceStrategyService`, `CreativeAnalysisService`, `CopyGenerationService`, `CreativeGenerationService`, `LandingPageGenerationService`, `TrackingService`, `MetaAssetService`, and `CampaignQualityService`. Each service has a narrow contract and test suite.

## Strategy and angles

Strategy precedes copy. For a recruiting campaign, for example, the engine may establish qualified applicants as the goal, work-life balance as the primary message, and the four-day work week as a benefit before producing angles such as benefit, trust, convenience, and career development. It should choose angles appropriate to the campaign rather than mechanically generating every angle type.

An angle includes type, title, hook, core message, supporting points, target emotion, provenance, status, and strategy relation. Copy and creative concepts reference an angle so performance can later be analyzed by idea/family rather than only by file.

## Blueprint and naming rules

Blueprint versions supply defaults for structure, ad-set count, placement, creative coverage, copy counts, landing-page template, tracking, and naming. Campaign-specific intent overrides are explicit and recorded. Published blueprint versions are immutable.

Naming uses a token resolver with an allowlist: `{client}`, `{campaignType}`, `{location}`, `{offer}`, `{date}`, `{angle}`, and `{audience}`. Campaign, ad-set, and ad rules are separate. Missing tokens produce a validation error or a visible fallback; they never render as an unexplained empty string.

## Asynchronous generation

`CampaignGenerationJob` runs on the `campaign-generation` queue. Progress is persisted as named steps such as:

```text
Briefing analysieren
Strategie erstellen
Anzeigentexte erstellen
Creatives vorbereiten
Landingpage erstellen
Kampagne prüfen
```

Each step has status, timestamps, retryability, and a redacted error. The UI may poll. A user can leave the page and return to the durable job. Autosave uses debounced, partial updates and displays the last persisted timestamp; it does not write the entire campaign on every keystroke.

## Quality engine contract

The quality engine has two outputs:

1. **Factual validation:** required assets, valid URLs, complete fields, supported formats, budget validity, brand restrictions, landing-page consistency, tracking, and current Meta capability checks. Critical errors block publishing.
2. **AI recommendations:** optional suggestions such as another format, a stronger hook, or an additional angle. These are clearly labeled as recommendations and may be bypassed when safe.

There is no fabricated overall score. The review screen shows required checks passed/failed and the evidence for each result.

## Domain tests before Meta publishing

Before Milestone 10, tests must cover all creation modes converging to the same package schema, strategy-before-copy sequencing, tenant scoping, blueprint overrides, naming tokens, autosave conflict handling, generation retry/resume, factual versus recommendation separation, forbidden claims, landing-page consistency, and package version restoration.
