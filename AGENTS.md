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

## Status (last updated 2026-10-12)
Done: everything in the original plan. Builds and lints clean. Landing, validation, webhook signature rejection, and the admin redirect have been checked in the browser.
Landing copy now uses "digital service" wording: 100% online, auto-fill, fee calculated automatically, UCR delivered by email. Filing is still done by hand, so copy must not claim "instant" or "no humans" until filing is automated.
Test USDOT `000000` (`TEST_USDOT` in `src/lib/fmcsa.ts`) returns fake company data without calling FMCSA, but only while `FMCSA_WEBKEY` is empty.
Lemon Squeezy approval prep (2026-10-12): landing repositioned as "automated UCR filing software" (5-step flow, two-part pricing, visible "Important" block). Customer-facing fee label is now "Software fee". Terms / Privacy / Refund rewritten; refund policy = full refund only if we can't complete the filing (plus duplicate charges). The business is an Armenian Individual Entrepreneur: legal name, address, optional reg/tax ID, governing law (Republic of Armenia) and dispute venue (Yerevan) come from `NEXT_PUBLIC_LEGAL_*`, `NEXT_PUBLIC_GOVERNING_LAW`, `NEXT_PUBLIC_DISPUTE_VENUE` (`site.legal`). Don't reintroduce US-state wording in the Terms. The wizard shows non-blocking FMCSA mismatch warnings (`compareWithFmcsa` in `src/lib/filing-checks.ts`). The confirm page has a renewal-reminder opt-in saved to `Filing.remindRenewal`. Copy still says "we submit on your behalf", never "instant" or "no humans".

Payment flow check (2026-10-12): a signed fake `order_created` webhook against the real Neon DB created `Order` + `OrderEvent`, set `Filing` to PAID, rejected a bad signature, deduped a replay, and `/order/success` + `/track/[orderNumber]` rendered the order. Emails were failing with `render is not a function` because `@react-email/render` (an optional peer dependency of `resend`) wasn't installed; it is now a dependency and the receipt sends. Lemon Squeezy setup: one single-payment product with its one default variant; every checkout overrides the price with `customPrice`, so don't create variants per bracket. With the `LEMONSQUEEZY_*` keys filled in, confirm now redirects to the Lemon Squeezy test checkout. `FMCSA_WEBKEY` must stay empty (not `"000000"`) for the test USDOT to work. The Lemon Squeezy webhook URL must be exactly `https://www.getucrfiling.com/api/webhooks/lemonsqueezy`: no trailing slash and not the bare domain, because a redirect drops the event. `site.url` strips a trailing slash from `NEXT_PUBLIC_APP_URL`. The wizard's Review step always renders; the order summary falls back to a hint if the price preview can't be computed.

Not yet done / next up:
- [ ] Set `NEXT_PUBLIC_LEGAL_ENTITY_NAME`, `NEXT_PUBLIC_LEGAL_ADDRESS` (and optionally `NEXT_PUBLIC_LEGAL_REG_NUMBER`) before submitting the store for Lemon Squeezy review
- [ ] Send renewal reminders (cron or admin bulk email to orders with `remindRenewal = true`, with an unsubscribe link). The Terms and Privacy pages already promise an opt-out link in the email
- [ ] Fill `.env` with real Neon / FMCSA / Lemon Squeezy / Resend credentials
- [ ] End-to-end test in Lemon Squeezy test mode via a tunnel (see README)
- [ ] Deploy to Vercel and configure the production webhook
- [ ] Replace placeholder company name/contact info; have the legal pages reviewed by a lawyer
- [ ] Ideas: abandoned-filing reminder emails, admin view of unpaid filings, rate limiting on public actions, Lemon Squeezy refunds from admin

## Rules for agents
See `.cursor/rules/`. In short: keep pricing on the server, keep the webhook idempotent, never trust client totals, keep the third-party disclaimer visible, and run lint + build before finishing.
