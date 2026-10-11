import {
  FLAT_FEE_ENTITY_TYPES,
  SERVICE_FEE_CENTS,
  UCR_FEES,
  type EntityType,
  type FeeBracket,
} from "@/config/fees";

export type PriceQuote = {
  bracket: FeeBracket;
  ucrFeeCents: number;
  serviceFeeCents: number;
  totalCents: number;
};

export function getBracket(year: number, vehicleCount: number, entityType?: string): FeeBracket {
  const brackets = UCR_FEES[year];
  if (!brackets) throw new Error(`No UCR fees configured for ${year}`);
  if (entityType && FLAT_FEE_ENTITY_TYPES.includes(entityType as EntityType)) {
    return brackets[0];
  }
  const match = brackets.find(
    (b) => vehicleCount >= b.minVehicles && (b.maxVehicles === null || vehicleCount <= b.maxVehicles),
  );
  if (!match) throw new Error(`No bracket for ${vehicleCount} vehicles`);
  return match;
}

export function quote(year: number, vehicleCount: number, entityType?: string): PriceQuote {
  const bracket = getBracket(year, vehicleCount, entityType);
  return {
    bracket,
    ucrFeeCents: bracket.feeCents,
    serviceFeeCents: SERVICE_FEE_CENTS,
    totalCents: bracket.feeCents + SERVICE_FEE_CENTS,
  };
}

export function formatUSD(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}

export function bracketLabel(b: FeeBracket) {
  return b.maxVehicles === null
    ? `${b.minVehicles.toLocaleString()}+ vehicles`
    : `${b.minVehicles.toLocaleString()}–${b.maxVehicles.toLocaleString()} vehicles`;
}
