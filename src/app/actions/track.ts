"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { normalizeOrderNumber } from "@/lib/order-number";

export type TrackState = { message?: string; values?: { orderNumber: string; email: string } };

export async function trackOrderAction(_prev: TrackState, formData: FormData): Promise<TrackState> {
  const orderNumber = normalizeOrderNumber(String(formData.get("orderNumber") ?? ""));
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const values = { orderNumber, email };

  if (!orderNumber || !email) return { message: "Enter your order number and email address.", values };

  const order = await db.order.findUnique({
    where: { orderNumber },
    select: { orderNumber: true, filing: { select: { email: true } } },
  });

  if (!order || order.filing.email.toLowerCase() !== email) {
    return { message: "We couldn't find an order with that number and email.", values };
  }

  redirect(`/track/${order.orderNumber}`);
}
