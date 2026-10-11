import crypto from "node:crypto";

// No 0/O/1/I/L to keep order numbers easy to read aloud and type.
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

export function generateOrderNumber(registrationYear: number) {
  const bytes = crypto.randomBytes(8);
  let suffix = "";
  for (const b of bytes) suffix += ALPHABET[b % ALPHABET.length];
  return `UCR${String(registrationYear).slice(-2)}-${suffix}`;
}

export function normalizeOrderNumber(input: string) {
  return input.trim().toUpperCase().replace(/\s+/g, "");
}
