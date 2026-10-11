"use server";

import crypto from "node:crypto";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { OrderStatus } from "@prisma/client";
import { ADMIN_COOKIE, ADMIN_SESSION_TTL_SECONDS, createAdminToken, verifyAdminToken } from "@/lib/admin-session";
import { db } from "@/lib/db";
import { sendStatusUpdate } from "@/lib/email";

export type AdminFormState = { message?: string; ok?: boolean };

async function requireAdmin() {
  const store = await cookies();
  if (!(await verifyAdminToken(store.get(ADMIN_COOKIE)?.value))) redirect("/admin/login");
}

function safeEqual(a: string, b: string) {
  const ha = crypto.createHash("sha256").update(a).digest();
  const hb = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}

export async function loginAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const password = String(formData.get("password") ?? "");
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return { message: "ADMIN_PASSWORD is not configured." };
  if (!safeEqual(password, expected)) {
    await new Promise((r) => setTimeout(r, 500));
    return { message: "Incorrect password." };
  }

  const store = await cookies();
  store.set(ADMIN_COOKIE, await createAdminToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_TTL_SECONDS,
  });

  const next = String(formData.get("next") ?? "");
  redirect(next.startsWith("/admin") ? next : "/admin/orders");
}

export async function logoutAction() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

export async function updateOrderStatusAction(
  orderId: string,
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await requireAdmin();

  const status = String(formData.get("status") ?? "") as OrderStatus;
  const note = String(formData.get("note") ?? "").trim() || null;
  const notify = formData.get("notify") === "on";

  if (!Object.values(OrderStatus).includes(status)) return { message: "Invalid status." };

  const order = await db.order.findUnique({ where: { id: orderId } });
  if (!order) return { message: "Order not found." };
  if (order.status === status && !note) return { message: "Nothing to update." };

  await db.order.update({
    where: { id: orderId },
    data: { status, events: { create: { status, note } } },
  });

  let message = "Order updated.";
  if (notify) {
    try {
      await sendStatusUpdate(orderId, note);
      message = "Order updated and customer notified.";
    } catch (err) {
      console.error("sendStatusUpdate failed", err);
      message = "Order updated, but the notification email failed to send.";
    }
  }

  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");
  return { ok: true, message };
}
