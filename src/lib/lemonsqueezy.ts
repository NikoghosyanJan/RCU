import "server-only";
import crypto from "node:crypto";
import { createCheckout, lemonSqueezySetup } from "@lemonsqueezy/lemonsqueezy.js";
import { site } from "@/lib/site";

let configured = false;

function setup() {
  if (configured) return;
  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  if (!apiKey) throw new Error("LEMONSQUEEZY_API_KEY is not set");
  lemonSqueezySetup({ apiKey, onError: (e) => console.error("Lemon Squeezy error", e) });
  configured = true;
}

export async function createFilingCheckout(params: {
  filingId: string;
  totalCents: number;
  email: string;
  name: string;
  registrationYear: number;
  usdotNumber: string;
  legalName: string;
}) {
  setup();
  const storeId = process.env.LEMONSQUEEZY_STORE_ID;
  const variantId = process.env.LEMONSQUEEZY_VARIANT_ID;
  if (!storeId || !variantId) throw new Error("LEMONSQUEEZY_STORE_ID / LEMONSQUEEZY_VARIANT_ID are not set");

  const successUrl = `${site.url}/order/success?filing=${params.filingId}`;

  const { data, error } = await createCheckout(storeId, variantId, {
    customPrice: params.totalCents,
    productOptions: {
      name: `${params.registrationYear} UCR Registration Filing`,
      description: `${params.legalName} · USDOT ${params.usdotNumber}`,
      redirectUrl: successUrl,
      receiptButtonText: "View order status",
      receiptLinkUrl: successUrl,
      enabledVariants: [Number(variantId)],
    },
    checkoutOptions: { embed: false, media: false, discount: false },
    checkoutData: {
      email: params.email,
      name: params.name,
      custom: { filing_id: params.filingId },
    },
    testMode: process.env.LEMONSQUEEZY_TEST_MODE === "true",
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
  });

  if (error || !data) throw error ?? new Error("Failed to create checkout");
  return { id: data.data.id, url: data.data.attributes.url };
}

export function verifyWebhookSignature(rawBody: string, signature: string | null) {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (!secret || !signature) return false;
  const digest = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  const a = Buffer.from(digest, "hex");
  const b = Buffer.from(signature, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
