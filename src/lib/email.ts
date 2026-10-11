import "server-only";
import { Resend } from "resend";
import { PaymentReceiptEmail } from "@/emails/payment-receipt";
import { StatusUpdateEmail } from "@/emails/status-update";
import { db } from "@/lib/db";
import { ORDER_STATUS_DESCRIPTION, ORDER_STATUS_LABEL, trackingUrl } from "@/lib/orders";
import { formatUSD } from "@/lib/pricing";
import { disclaimer, site } from "@/lib/site";

let client: Resend | null = null;

function resend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  client ??= new Resend(key);
  return client;
}

function from() {
  return process.env.EMAIL_FROM || `${site.name} <onboarding@resend.dev>`;
}

export async function sendPaymentReceipt(orderId: string) {
  const order = await db.order.findUniqueOrThrow({ where: { id: orderId }, include: { filing: true } });
  const f = order.filing;
  const url = trackingUrl(order.orderNumber);

  const { error } = await resend().emails.send({
    from: from(),
    to: f.email,
    replyTo: site.supportEmail,
    subject: `Payment received – Order ${order.orderNumber}`,
    react: PaymentReceiptEmail({
      siteName: site.name,
      supportEmail: site.supportEmail,
      applicantName: f.applicantName,
      orderNumber: order.orderNumber,
      trackingUrl: url,
      receiptUrl: order.receiptUrl,
      paidAt: order.createdAt.toLocaleDateString("en-US", { dateStyle: "long" }),
      legalName: f.legalName ?? "",
      usdotNumber: f.usdotNumber,
      registrationYear: f.registrationYear,
      bracket: f.feeBracket ?? "",
      ucrFee: formatUSD(f.ucrFeeCents ?? 0),
      serviceFee: formatUSD(f.serviceFeeCents ?? 0),
      total: formatUSD(order.amountCents),
      disclaimer,
    }),
  });
  if (error) throw new Error(`Resend error: ${error.message}`);
}

export async function sendStatusUpdate(orderId: string, note?: string | null) {
  const order = await db.order.findUniqueOrThrow({ where: { id: orderId }, include: { filing: true } });

  const { error } = await resend().emails.send({
    from: from(),
    to: order.filing.email,
    replyTo: site.supportEmail,
    subject: `Order ${order.orderNumber}: ${ORDER_STATUS_LABEL[order.status]}`,
    react: StatusUpdateEmail({
      siteName: site.name,
      supportEmail: site.supportEmail,
      applicantName: order.filing.applicantName,
      orderNumber: order.orderNumber,
      trackingUrl: trackingUrl(order.orderNumber),
      statusLabel: ORDER_STATUS_LABEL[order.status],
      statusDescription: ORDER_STATUS_DESCRIPTION[order.status],
      note,
    }),
  });
  if (error) throw new Error(`Resend error: ${error.message}`);
}
