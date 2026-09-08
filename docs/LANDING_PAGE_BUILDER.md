# Landing Page Builder Architecture

**Status:** Milestone 0 design

## Product boundary

The builder creates a campaign landing page quickly; it is not a general-purpose Webflow replacement. Templates provide a strong starting point, blocks are editable, and AI can generate a first draft from campaign context. Publishing is platform-controlled in MVP with a future custom-domain adapter.

## Data model

```ts
type LandingPageBlock = {
  id: string;
  landingPageId: string;
  versionId: string;
  type: BlockType;
  order: number;
  contentJson: unknown;
  settingsJson: unknown;
  styleJson: unknown;
  schemaVersion: number;
};
```

Initial block types are `Hero`, `Text`, `Image`, `ImageText`, `Benefits`, `Features`, `Stats`, `LogoCloud`, `Testimonials`, `Steps`, `FAQ`, `CTA`, `Form`, `Spacer`, and `Footer`. Each type has a Zod schema, a renderer, editor controls, safe defaults, and a migration path for future schema versions. The database stores structured blocks and ordering, not one arbitrary HTML blob.

`LandingPage` owns lifecycle and publication identity. `LandingPageVersion` is a draft or immutable published snapshot. Editing a published page creates or promotes a new version according to the publication policy. Campaign packages reference the exact landing-page version used for review and publishing.

## Editor architecture

The editor has three responsive regions:

- left: block library and template actions;
- center: renderer-backed live preview;
- right: selected block properties.

Block operations are commands: add, move, reorder, duplicate, delete, edit, undo, and restore. The preview uses the same renderer and content schema as the public page to avoid an editor-only representation. Desktop, tablet, and mobile previews use explicit viewport presets; mobile is a release gate because Meta traffic is frequently mobile.

Autosave is debounced, sends only changed blocks or a patch, handles optimistic concurrency with a version/revision number, and reports `Gespeichert` only after the server confirms persistence.

## Templates

Templates are predefined block structures plus safe defaults, not static HTML documents. Initial templates are Recruiting, Lead Generation, Product/Offer, Appointment/Consultation, and Lead Magnet. Template selection creates a new draft version whose blocks remain fully editable. Template schema changes are versioned so existing pages do not silently change.

## AI generation and consistency

AI page generation receives Campaign Strategy, Brand Brain, Campaign Brief, Ad Angles, Offer, and Campaign Goal through the AI context boundary. It returns structured blocks and an assumptions/warnings section. It may propose a recruiting sequence such as Hero, Benefits, workplace proof, application steps, FAQ, Form, and CTA, but user review is required.

Text blocks use the same transformation model as ad copy: shorter, emotional, direct, professional, new formulation, and custom instruction. A transformation targets one block/text field and creates a versioned revision rather than regenerating the page.

`CampaignQualityService` compares approved ad claims with landing-page content where technically possible. Contradictions, missing benefits, inconsistent application requirements, or mismatched destinations create warnings/errors with evidence; they are not hidden behind an AI score.

## Forms and leads

MVP field types are text, name, email, phone, textarea, select, checkbox, and radio. Each field has a stable key, label, order, required flag, options, and validation. A form stores thank-you copy and optional redirect URL. File upload is deferred until its validation, malware scanning, storage, and retention design is ready.

Submissions create scoped `Lead` records linked to organization, client, campaign, landing page, and page version. The dashboard can list and export leads as CSV through an authorized server-side use case. CRM integrations are later. Sensitive fields, consent, retention, deletion, and processor disclosures are covered by the security/privacy design.

## Publication and safety

MVP public pages use a platform-controlled URL such as `pages.product-domain.de/{organization}/{page-slug}`. Slugs are generated and collision-checked, and publication is an explicit state transition. Rendered output must sanitize URLs, HTML-like user input, embedded content, and CSS values. Do not allow arbitrary scripts or unsandboxed custom HTML in MVP.

Self-hosted installations use the configured installation domain through the same publication port. Custom domains are a later adapter, not a reason to duplicate the page model.

## Tests

Test block schema validation and migrations, renderer/editor parity, ordering and undo, autosave concurrency, mobile rendering constraints, template creation, AI structured output, ad/landing consistency, form validation, tenant isolation, CSV export authorization, safe publication, and lead retention/deletion behavior.
