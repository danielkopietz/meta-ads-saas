# Kampagnenwerk

Kampagnenwerk is a German-language foundation for a multi-tenant Meta Ads automation platform. Milestone 1 contains the application shell, secure SaaS authentication foundation, organization onboarding, Prisma models for identity and tenancy, and reusable UI primitives. Campaign generation and Meta connections are intentionally not implemented yet.

## Local development

Requirements:

- Node.js 20 or newer
- npm
- PostgreSQL 14 or newer
- Redis/BullMQ are prepared for the future worker and are not required by the current UI shell

Copy the environment template and set local values:

```bash
cp .env.example .env
```

At minimum, set `DATABASE_URL` to a reachable PostgreSQL database and set `AUTH_SECRET` to a random value of at least 32 characters. Do not commit `.env` or real credentials.

Install dependencies and generate the Prisma client:

```bash
npm install
npm run db:generate
```

Validate the Prisma schema:

```bash
npm run db:validate
```

When PostgreSQL is available, create and apply the development migration:

```bash
npm run db:migrate -- --name foundation
```

Start the web app:

```bash
npm run dev
```

Open `http://localhost:3000`. Register a SaaS user, complete organization onboarding, and enter the dashboard shell. No Meta account is requested in this milestone.

## Validation commands

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

The current business-logic tests cover role policy, tenant query scopes, organization membership authorization, session policy, and password hashing. Visual components are intentionally not over-tested in Milestone 1.

## Production notes

The web process and future BullMQ worker share one codebase but run as separate processes. PostgreSQL is the durable source of truth. Redis, object storage, Meta, AI, email, and billing remain adapter boundaries described in `docs/`. Production secrets must be injected through the deployment secret manager.

See:

- `docs/ARCHITECTURE.md`
- `docs/DATABASE.md`
- `docs/SECURITY.md`
- `docs/DEPLOYMENT.md`
- `docs/IMPLEMENTATION_PLAN.md`
