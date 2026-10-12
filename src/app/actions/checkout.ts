"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { createFilingCheckout } from "@/lib/lemonsqueezy";
import { quote } from "@/lib/pricing";
import { confirmSchema } from "@/lib/validation/filing";

export type ConfirmState = { errors?: Record<string, string>; message?: string };

export async function confirmAndPayAction(
  filingId: string,
  _prev: ConfirmState,
  formData: FormData,
): Promise<ConfirmState> {
  const parsed = confirmSchema.safeParse({
    accurate: formData.get("accurate") === "on",
    authorize: formData.get("authorize") === "on",
    thirdParty: formData.get("thirdParty") === "on",
    terms: formData.get("terms") === "on",
  });
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) errors[String(issue.path[0])] = "Please check this box to continue.";
    return { errors };
  }

  const filing = await db.filing.findUnique({ where: { id: filingId }, include: { order: true } });
  if (!filing) return { message: "Filing not found." };
  if (filing.order) redirect(`/track/${filing.order.orderNumber}`);
  if (!filing.legalName || filing.vehicleCount == null || !filing.entityType) {
    return { message: "Your filing is incomplete. Please go back and complete all steps." };
  }

  const q = quote(filing.registrationYear, filing.vehicleCount, filing.entityType);

  let checkoutUrl: string;
  try {
    const checkout = await createFilingCheckout({
      filingId: filing.id,
      totalCents: q.totalCents,
      email: filing.email,
      name: filing.applicantName,
      registrationYear: filing.registrationYear,
      usdotNumber: filing.usdotNumber,
      legalName: filing.legalName,
    });
    checkoutUrl = checkout.url;

    await db.filing.update({
      where: { id: filing.id },
      data: {
        status: "AWAITING_PAYMENT",
        agreedTermsAt: new Date(),
        remindRenewal: formData.get("remindRenewal") === "on",
        feeBracket: q.bracket.code,
        ucrFeeCents: q.ucrFeeCents,
        serviceFeeCents: q.serviceFeeCents,
        totalCents: q.totalCents,
        lsCheckoutId: checkout.id,
      },
    });
  } catch (err) {
    console.error("confirmAndPayAction failed", err);
    return { message: "We couldn't start the secure checkout. Please try again in a moment." };
  }

  redirect(checkoutUrl);
}
