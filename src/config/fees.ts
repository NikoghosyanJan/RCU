// Source: 49 CFR 367.50 and 91 FR 56063 (Federal Register, Sept 1, 2026).
// Re-check plan.ucr.gov/fee-brackets each year before opening a new registration year.

export type FeeBracket = {
  code: "B1" | "B2" | "B3" | "B4" | "B5" | "B6";
  minVehicles: number;
  maxVehicles: number | null;
  feeCents: number;
};

export const UCR_FEES: Record<number, FeeBracket[]> = {
  2026: [
    { code: "B1", minVehicles: 0, maxVehicles: 2, feeCents: 4_600 },
    { code: "B2", minVehicles: 3, maxVehicles: 5, feeCents: 13_800 },
    { code: "B3", minVehicles: 6, maxVehicles: 20, feeCents: 27_600 },
    { code: "B4", minVehicles: 21, maxVehicles: 100, feeCents: 96_300 },
    { code: "B5", minVehicles: 101, maxVehicles: 1000, feeCents: 459_200 },
    { code: "B6", minVehicles: 1001, maxVehicles: null, feeCents: 4_483_600 },
  ],
  2027: [
    { code: "B1", minVehicles: 0, maxVehicles: 2, feeCents: 5_500 },
    { code: "B2", minVehicles: 3, maxVehicles: 5, feeCents: 16_700 },
    { code: "B3", minVehicles: 6, maxVehicles: 20, feeCents: 33_300 },
    { code: "B4", minVehicles: 21, maxVehicles: 100, feeCents: 116_300 },
    { code: "B5", minVehicles: 101, maxVehicles: 1000, feeCents: 554_800 },
    { code: "B6", minVehicles: 1001, maxVehicles: null, feeCents: 5_416_500 },
  ],
};

export const REGISTRATION_YEARS = [2027, 2026] as const;
export const DEFAULT_REGISTRATION_YEAR = 2027;

export const ENTITY_TYPES = [
  { value: "MOTOR_CARRIER", label: "Motor Carrier (for-hire or exempt)" },
  { value: "PRIVATE_CARRIER", label: "Motor Private Carrier" },
  { value: "FREIGHT_FORWARDER", label: "Freight Forwarder" },
  { value: "BROKER", label: "Broker" },
  { value: "LEASING_COMPANY", label: "Leasing Company" },
] as const;

export type EntityType = (typeof ENTITY_TYPES)[number]["value"];

// Brokers and leasing companies pay the B1 fee regardless of fleet size.
export const FLAT_FEE_ENTITY_TYPES: EntityType[] = ["BROKER", "LEASING_COMPANY"];

export const SERVICE_FEE_CENTS = Number(process.env.SERVICE_FEE_CENTS ?? 4900);
