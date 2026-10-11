"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { quote } from "@/lib/pricing";
import { companySchema, leadSchema, operationSchema } from "@/lib/validation/filing";

export type StepResult =
  | { ok: true; quote?: { bracket: string; ucrFeeCents: number; serviceFeeCents: number; totalCents: number } }
  | { ok: false; errors?: Record<string, string>; message?: string };

const companyStepSchema = leadSchema.omit({ usdotNumber: true }).extend(companySchema.shape);

function toErrors(error: z.ZodError) {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) errors[String(issue.path[0])] ??= issue.message;
  return errors;
}

async function getEditableFiling(id: string) {
  const filing = await db.filing.findUnique({ where: { id }, select: { id: true, status: true } });
  if (!filing) return { error: "Filing not found." };
  if (filing.status === "PAID") return { error: "This filing has already been paid." };
  return { filing };
}

export async function saveCompanyStep(id: string, input: unknown): Promise<StepResult> {
  const parsed = companyStepSchema.safeParse(input);
  if (!parsed.success) return { ok: false, errors: toErrors(parsed.error) };

  const { error } = await getEditableFiling(id);
  if (error) return { ok: false, message: error };

  const d = parsed.data;
  await db.filing.update({
    where: { id },
    data: {
      applicantName: d.applicantName,
      email: d.email,
      phone: d.phone,
      registrationYear: d.registrationYear,
      legalName: d.legalName,
      dbaName: d.dbaName || null,
      mcNumber: d.mcNumber || null,
      address: d.address,
      city: d.city,
      state: d.state,
      zip: d.zip,
      status: "DRAFT",
    },
  });
  return { ok: true };
}

export async function saveOperationStep(id: string, input: unknown): Promise<StepResult> {
  const parsed = operationSchema.safeParse(input);
  if (!parsed.success) return { ok: false, errors: toErrors(parsed.error) };

  const { error } = await getEditableFiling(id);
  if (error) return { ok: false, message: error };

  const filing = await db.filing.findUniqueOrThrow({ where: { id }, select: { registrationYear: true } });
  const q = quote(filing.registrationYear, parsed.data.vehicleCount, parsed.data.entityType);

  await db.filing.update({
    where: { id },
    data: {
      entityType: parsed.data.entityType,
      vehicleCount: parsed.data.vehicleCount,
      feeBracket: q.bracket.code,
      ucrFeeCents: q.ucrFeeCents,
      serviceFeeCents: q.serviceFeeCents,
      totalCents: q.totalCents,
      status: "DRAFT",
    },
  });

  return {
    ok: true,
    quote: {
      bracket: q.bracket.code,
      ucrFeeCents: q.ucrFeeCents,
      serviceFeeCents: q.serviceFeeCents,
      totalCents: q.totalCents,
    },
  };
}
