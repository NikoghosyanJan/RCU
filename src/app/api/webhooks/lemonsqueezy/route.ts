import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { sendPaymentReceipt } from "@/lib/email";
import { verifyWebhookSignature } from "@/lib/lemonsqueezy";
import { generateOrderNumber } from "@/lib/order-number";

export const runtime = "nodejs";

type LsOrderEvent = {
  meta: {
    event_name: string;
    test_mode?: boolean;
    custom_data?: { filing_id?: string };
  };
  data: {
    id: string;
    type: string;
    attributes: {
      status: string;
      total: number;
      currency: string;
      user_email: string;
      urls?: { receipt?: string };
    };
  };
};

export async function POST(req: Request) {
  const rawBody = await req.text();
  if (!verifyWebhookSignature(rawBody, req.headers.get("x-signature"))) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody) as LsOrderEvent;
  const eventName = event.meta.event_name;

  try {
    if (eventName === "order_created") return await handleOrderCreated(event);
    if (eventName === "order_refunded") return await handleOrderRefunded(event);
  } catch (err) {
    console.error(`Webhook ${eventName} failed`, err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ ignored: eventName });
}

async function handleOrderCreated(event: LsOrderEvent) {
  const { id: lsOrderId, attributes } = event.data;
  const filingId = event.meta.custom_data?.filing_id;

  if (attributes.status !== "paid") return NextResponse.json({ ignored: `status ${attributes.status}` });
  if (!filingId) {
    console.error("order_created without filing_id", lsOrderId);
    return NextResponse.json({ error: "Missing filing_id" }, { status: 200 });
  }

  const existing = await db.order.findUnique({ where: { lsOrderId } });
  if (existing) return NextResponse.json({ duplicate: true, orderNumber: existing.orderNumber });

  const filing = await db.filing.findUnique({ where: { id: filingId }, include: { order: true } });
  if (!filing) {
    console.error("order_created for unknown filing", filingId, lsOrderId);
    return NextResponse.json({ error: "Unknown filing" }, { status: 200 });
  }
  if (filing.order) {
    console.error("Filing already has an order; possible double payment", filingId, lsOrderId);
    return NextResponse.json({ duplicate: true, orderNumber: filing.order.orderNumber });
  }
  if (filing.totalCents != null && attributes.total < filing.totalCents) {
    console.warn(`Paid amount ${attributes.total} is less than expected ${filing.totalCents} for filing ${filingId}`);
  }

  let order;
  for (let attempt = 0; attempt < 3 && !order; attempt++) {
    try {
      order = await db.$transaction(async (tx) => {
        await tx.filing.update({ where: { id: filing.id }, data: { status: "PAID" } });
        return tx.order.create({
          data: {
            orderNumber: generateOrderNumber(filing.registrationYear),
            filingId: filing.id,
            lsOrderId,
            amountCents: attributes.total,
            receiptUrl: attributes.urls?.receipt ?? null,
            events: { create: { status: "PAID", note: "Payment received" } },
          },
        });
      });
    } catch (err) {
      const isUnique = err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002";
      if (!isUnique) throw err;
      const target = String(err.meta?.target ?? "");
      if (!target.includes("orderNumber")) {
        const dup = await db.order.findFirst({ where: { OR: [{ lsOrderId }, { filingId: filing.id }] } });
        return NextResponse.json({ duplicate: true, orderNumber: dup?.orderNumber });
      }
    }
  }
  if (!order) throw new Error("Could not generate a unique order number");

  try {
    await sendPaymentReceipt(order.id);
  } catch (err) {
    console.error("Failed to send payment receipt", order.orderNumber, err);
  }

  return NextResponse.json({ orderNumber: order.orderNumber });
}

async function handleOrderRefunded(event: LsOrderEvent) {
  const order = await db.order.findUnique({ where: { lsOrderId: event.data.id } });
  if (!order) return NextResponse.json({ ignored: "unknown order" });
  if (order.status === "REFUNDED") return NextResponse.json({ duplicate: true });

  await db.order.update({
    where: { id: order.id },
    data: { status: "REFUNDED", events: { create: { status: "REFUNDED", note: "Payment refunded" } } },
  });
  return NextResponse.json({ refunded: order.orderNumber });
}
