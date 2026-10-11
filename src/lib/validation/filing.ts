import { z } from "zod";
import { ENTITY_TYPES, REGISTRATION_YEARS } from "@/config/fees";

const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;

export const leadSchema = z.object({
  applicantName: z.string().trim().min(2, "Enter your full name").max(120),
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  phone: z.string().trim().regex(phoneRegex, "Use the format (XXX) XXX-XXXX"),
  registrationYear: z.coerce
    .number()
    .refine((y) => (REGISTRATION_YEARS as readonly number[]).includes(y), "Select a registration year"),
  usdotNumber: z
    .string()
    .trim()
    .regex(/^\d{1,8}$/, "USDOT number must be 1–8 digits"),
});
export type LeadInput = z.infer<typeof leadSchema>;

const entityValues = ENTITY_TYPES.map((e) => e.value) as [string, ...string[]];

export const companySchema = z.object({
  legalName: z.string().trim().min(2, "Legal name is required").max(200),
  dbaName: z.string().trim().max(200).optional().or(z.literal("")),
  mcNumber: z.string().trim().max(20).optional().or(z.literal("")),
  address: z.string().trim().min(3, "Street address is required").max(200),
  city: z.string().trim().min(2, "City is required").max(100),
  state: z.string().trim().length(2, "Use the 2-letter state code").toUpperCase(),
  zip: z.string().trim().regex(/^\d{5}(-\d{4})?$/, "Enter a valid ZIP code"),
});
export type CompanyInput = z.infer<typeof companySchema>;

export const operationSchema = z.object({
  entityType: z.enum(entityValues, { message: "Select your entity type" }),
  vehicleCount: z.coerce
    .number({ message: "Enter the number of vehicles" })
    .int()
    .min(0, "Cannot be negative")
    .max(1_000_000),
});
export type OperationInput = z.infer<typeof operationSchema>;

export const confirmSchema = z.object({
  accurate: z.literal(true, { message: "Required" }),
  authorize: z.literal(true, { message: "Required" }),
  thirdParty: z.literal(true, { message: "Required" }),
  terms: z.literal(true, { message: "Required" }),
});
export type ConfirmInput = z.infer<typeof confirmSchema>;

export function formatPhone(value: string) {
  const d = value.replace(/\D/g, "").slice(0, 10);
  if (d.length === 0) return "";
  if (d.length < 4) return `(${d}`;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}
