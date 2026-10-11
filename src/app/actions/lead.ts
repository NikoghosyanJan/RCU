"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { leadSchema } from "@/lib/validation/filing";

export type LeadState = {
  errors?: Partial<Record<string, string>>;
  values?: Record<string, string>;
  message?: string;
};

export async function createFilingAction(_prev: LeadState, formData: FormData): Promise<LeadState> {
  const values = Object.fromEntries(
    ["applicantName", "email", "phone", "registrationYear", "usdotNumber"].map((k) => [
      k,
      String(formData.get(k) ?? ""),
    ]),
  );

  const parsed = leadSchema.safeParse(values);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      errors[key] ??= issue.message;
    }
    return { errors, values };
  }

  let filingId: string;
  try {
    const filing = await db.filing.create({ data: parsed.data });
    filingId = filing.id;
  } catch (err) {
    console.error("createFilingAction failed", err);
    return { values, message: "Something went wrong. Please try again." };
  }

  redirect(`/file/${filingId}`);
}
