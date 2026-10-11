# AGENTS.md: UCR Filing Service

Read this first. It's the handoff doc for any agent working on this repo. Update the **Status** section when you finish work.

## What this is
A third-party UCR (Unified Carrier Registration) filing service. Customers enter their details, we pre-fill company data from FMCSA, they pay via Lemon Squeezy, and we file the UCR for them. We are **not** a government agency, and the UI must always say so.

## Stack
Next.js 15 App Router + Server Actions · TypeScript · Tailwind v4 + shadcn/ui (radix, `cn` from the `cn` package) · Prisma 6 + Neon Postgres · Lemon Squeezy · Resend + React Email · zod 4 · jose (admin session).

## Commands
```bash
npm run dev          # local dev
npm run build        # must pass before you finish
npm run lint         # must pass before you finish
npx tsc --noEmit     # type check
npm run db:migrate   # create a new migration after editing prisma/schema.prisma
npm run db:deploy    # apply migrations (Neon)
npm run db:studio    # browse data
```

## User flow
1. `/` lead form → `createFilingAction` creates `Filing` (DRAFT) → redirect `/file/[id]`
2. `/file/[id]` wizard: Company (FMCSA prefill via `/api/fmcsa/[dot]`) → Operation → Review. Each step saves via `src/app/actions/filing.ts`
3. `/file/[id]/confirm` checkboxes → `confirmAndPayAction` → Lemon Squeezy checkout (`custom_price`, `custom.filing_id`)
4. Webhook `/api/webhooks/lemonsqueezy` (`order_created`) → creates `Order` + `OrderEvent`, sends receipt email with tracking link
5. `/order/success?filing=id` polls until the order exists → `/track/[orderNumber]`
6. `/admin` (password + JWT cookie, `src/middleware.ts`) manages statuses, can email the customer

## Key files
- `src/config/fees.ts`: official UCR fees per year, entity types, service fee
- `src/lib/pricing.ts`: `quote()` / `getBracket()`, the single source of pricing
- `src/lib/validation/filing.ts`: zod schemas shared by client and server
- `src/lib/{db,fmcsa,lemonsqueezy,email,orders,order-number,site,admin-session}.ts`
- `prisma/schema.prisma`: `Filing` (pre-payment), `Order` (post-payment only), `OrderEvent` (history)
- `.env.example`: every required env var

## Status (last updated 2026-10-11)
Done: everything in the original plan. Builds and lints clean. Landing, validation, webhook signature rejection, and the admin redirect have been checked in the browser.

Not yet done / next up:
- [ ] Fill `.env` with real Neon / FMCSA / Lemon Squeezy / Resend credentials and run `npm run db:deploy`
- [ ] End-to-end test in Lemon Squeezy test mode via a tunnel (see README)
- [ ] Deploy to Vercel and configure the production webhook
- [ ] Replace placeholder company name/contact info; have the legal pages reviewed
- [ ] Ideas: abandoned-filing reminder emails, admin view of unpaid filings, rate limiting on public actions, Lemon Squeezy refunds from admin

## Rules for agents
See `.cursor/rules/`. In short: keep pricing on the server, keep the webhook idempotent, never trust client totals, keep the third-party disclaimer visible, and run lint + build before finishing.
