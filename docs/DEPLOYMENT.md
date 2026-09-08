# Deployment and Operations

**Status:** Milestone 0 design
**Target:** Hetzner infrastructure managed with Coolify

## Production topology

```text
Internet
  ↓ HTTPS / reverse proxy / Coolify
Next.js web container ─────── PostgreSQL
        │                         │
        ├────────────────────── Redis
        ├────────────────────── S3-compatible object storage
        └────────────────────── external Meta / AI / email / billing APIs

BullMQ worker container ───── PostgreSQL + Redis + S3 + external APIs
```

Web and worker use the same image and codebase with different start commands. The worker can scale independently. PostgreSQL is the business source of truth; Redis queue state may be rebuilt from durable job records where needed.

## Environments

Development uses local or isolated PostgreSQL, Redis, and S3-compatible storage with test credentials. Staging uses a separate Meta app/ad account and separate AI/storage credentials. Production uses dedicated credentials, restricted database access, encrypted backups, and an EU/Germany hosting plan when selected. Never point development tooling at production by default.

Configuration is documented in [`.env.example`](../.env.example). Startup validation checks URL formats, secret lengths, deployment mode, database/Redis reachability, and required provider configuration for enabled features. Optional providers do not prevent the core application from starting; their feature is reported unavailable.

## Coolify and container expectations

Provide a production `Dockerfile` after the application foundation exists, using a minimal supported Node runtime, deterministic lockfile install, a build stage, a non-root runtime user, and no development secrets. Coolify should run:

- web: Next.js server;
- worker: BullMQ worker bootstrap;
- migration/release task: Prisma migrations before web/worker rollout;
- optional scheduler: a small worker-owned scheduler or queue enqueue process, never cron logic inside React components.

The image must expose a liveness endpoint that does not require external provider calls and a readiness check that can report database/Redis dependency state without leaking credentials. Worker health should include last successful heartbeat and queue connectivity.

## Database changes and releases

Prisma migrations are reviewed, applied in an explicit release step, and are backward-compatible with the currently running web/worker during rolling deploys. Destructive changes require expand/migrate/contract sequencing and a backup/restore plan. Seed data is limited to safe system templates and entitlement definitions; it must not create fake client or Meta data.

## Background jobs

Queues are named and observable: `campaign-generation`, `meta-publishing`, `meta-sync`, `ai-generation`, `creative-generation`, `landingpage-generation`, `report-generation`, `performance-analysis`, and `email`. Job payloads contain IDs and non-sensitive parameters, not access tokens or large media. Handlers load current scoped records, use bounded retries with backoff, and persist step progress. Dead-letter or failed jobs remain inspectable and replayable after the root cause is fixed.

## Scheduled work

Scheduling enqueues durable jobs for insight synchronization, performance analysis, automated reports, and maintenance. Schedules are stored in the database with timezone/day/time and enabled state. A single scheduler process uses a distributed lock/idempotency key so multiple worker replicas do not enqueue duplicates. The frontend never owns scheduling.

## Storage and media delivery

Use private buckets for source assets, generated creatives, reports, and lead exports. Serve time-limited signed URLs after authorization. Public landing-page assets use a carefully separated public path or CDN policy that cannot expose private client data. Apply lifecycle rules and retention aligned with the privacy policy.

## Backups and recovery

Back up PostgreSQL on a defined schedule, encrypt backups, retain multiple restore points, and test restoration. Redis is recoverable queue infrastructure, not a backup of business state. Object storage requires versioning or a recoverable deletion policy for important assets. Document RPO/RTO targets before commercial launch.

## Monitoring

Track web error rate/latency, authentication failures, database health, queue depth/age, retry/dead-letter counts, Meta rate-limit/error classes, AI usage/cost, storage failures, report delivery, and activation/publishing outcomes. Alert on stuck jobs, repeated provider failures, failed backups, abnormal exports, and any evidence of cross-tenant authorization errors.

## Self-hosted mode

`DEPLOYMENT_MODE=SELF_HOSTED` uses the same containers, schema, queues, and domain modules. Provider endpoints, storage, email, and license validation are configuration/adapters. The system must remain useful if a central SaaS control plane is unavailable; core drafting, editing, local reporting data, and configured Meta/AI connections run on the installation. License enforcement is explicit, documented, and does not fork the application.
