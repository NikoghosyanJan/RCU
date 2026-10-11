# UCR Filing Service

A Next.js app for a third-party Unified Carrier Registration (UCR) filing service.

**Flow:** landing page lead form → multi-step filing form (pre-filled from FMCSA by USDOT number) → confirmation checkboxes → Lemon Squeezy checkout → webhook creates the order → Resend emails a receipt with a tracking link → customer tracks the order at `/track/{orderNumber}`. A password-protected admin at `/admin` manages order statuses.

**Stack:** Next.js 15 (App Router, Server Actions), Tailwind CSS v4 + shadcn/ui, Prisma + Neon Postgres, Lemon Squeezy, Resend + React Email, FMCSA QCMobile API, zod.

## 1. Accounts you need

| Service | What to get |
| --- | --- |
| [Neon](https://neon.tech) | A project. Copy the **pooled** connection string (`DATABASE_URL`) and the **direct** one (`DIRECT_URL`). |
| [FMCSA QCMobile](https://mobile.fmcsa.dot.gov/QCDevsite/) | Sign in with Login.gov and create a free **WebKey** (`FMCSA_WEBKEY`). |
| [Lemon Squeezy](https://lemonsqueezy.com) | A store, an API key, and one product "UCR Filing Service" with a single variant (any price; it's overridden per checkout). Note the store ID and variant ID. |
| [Resend](https://resend.com) | An API key and a verified sending domain (`EMAIL_FROM`). Until the domain is verified you can only send to your own address from `onboarding@resend.dev`. |

## 2. Local setup

```bash
cp .env.example .env      # fill in the values
npm install               # also runs `prisma generate`
npm run db:deploy         # applies prisma/migrations to Neon
npm run dev
```

Generate an admin session secret with `openssl rand -base64 32`.

### Testing the payment webhook locally

Lemon Squeezy must reach your machine, so expose it with a tunnel:

```bash
npx cloudflared tunnel --url http://localhost:3000   # or: ngrok http 3000
```

1. Set `NEXT_PUBLIC_APP_URL` to the tunnel URL and restart `npm run dev`.
2. In Lemon Squeezy → Settings → Webhooks, add `https://<tunnel>/api/webhooks/lemonsqueezy`, choose a signing secret (put it in `LEMONSQUEEZY_WEBHOOK_SECRET`), and select the **order_created** and **order_refunded** events.
3. Keep the store in **test mode** (`LEMONSQUEEZY_TEST_MODE="true"`) and pay with card `4242 4242 4242 4242`.

## 3. Deploying to Vercel

1. Push this repo to GitHub and import it in Vercel.
2. Add every variable from `.env.example` in Project → Settings → Environment Variables. Set `NEXT_PUBLIC_APP_URL` to your production domain.
3. Deploy. Then run `npm run db:deploy` once against the production database (locally with the production `DIRECT_URL`, or as part of the build command: `prisma migrate deploy && next build`).
4. In Lemon Squeezy, create a production webhook pointing to `https://<your-domain>/api/webhooks/lemonsqueezy` and set `LEMONSQUEEZY_TEST_MODE="false"`.
5. Do one end-to-end test order in test mode before switching the store live.

## Project map

| Path | Purpose |
| --- | --- |
| `src/app/(site)/page.tsx` | Landing page (hero lead form, fees, how it works, FAQ) |
| `src/app/(site)/file/[id]` | Multi-step filing form; `confirm/` holds the checkboxes and starts checkout |
| `src/app/(site)/order/success` | Post-payment page; polls until the webhook creates the order |
| `src/app/(site)/track` | Order lookup by number + email, and the public status page |
| `src/app/admin` | Admin login, orders list, order detail with status updates |
| `src/app/api/webhooks/lemonsqueezy` | Verifies the signature, creates the order idempotently, sends the receipt |
| `src/app/api/fmcsa/[dot]` | Server-side FMCSA lookup (keeps the WebKey private) |
| `src/app/actions/*` | Server actions for each form |
| `src/config/fees.ts` | Official UCR fee brackets per year + service fee |
| `src/emails/*` | React Email templates (receipt, status update) |
| `prisma/schema.prisma` | `Filing` (pre-payment application), `Order` (created after payment), `OrderEvent` (status history) |

## Yearly maintenance

When the UCR Board publishes fees for a new registration year, add the year to `UCR_FEES` and `REGISTRATION_YEARS` in `src/config/fees.ts`. The 2026 and 2027 fees come from 49 CFR 367.50 and 91 FR 56063 (Sept 1, 2026).
