import { FLAT_FEE_ENTITY_TYPES, type EntityType } from "@/config/fees";
import { getBracket } from "@/lib/pricing";

export type FmcsaRecord = {
  legalName: string;
  state: string;
  powerUnits: number | null;
  allowedToOperate: boolean | null;
};

export type FilingCheckInput = {
  registrationYear: number;
  legalName: string;
  state: string;
  entityType: string;
  vehicleCount: string;
};

export type FilingWarning = { field: "legalName" | "state" | "vehicleCount" | "entityType" | "status"; message: string };

const normalizeName = (s: string) =>
  s
    .toUpperCase()
    .replace(/[.,'&]/g, " ")
    .replace(/\b(LLC|INC|CORP|CORPORATION|CO|COMPANY|LTD|THE)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export function compareWithFmcsa(data: FilingCheckInput, fmcsa: FmcsaRecord): FilingWarning[] {
  const warnings: FilingWarning[] = [];

  if (fmcsa.allowedToOperate === false) {
    warnings.push({
      field: "status",
      message: "FMCSA lists this USDOT number as not authorized to operate. Check your USDOT status before filing.",
    });
  }

  if (fmcsa.legalName && data.legalName && normalizeName(fmcsa.legalName) !== normalizeName(data.legalName)) {
    warnings.push({
      field: "legalName",
      message: `Legal name differs from your FMCSA record ("${fmcsa.legalName}").`,
    });
  }

  if (fmcsa.state && data.state && fmcsa.state.toUpperCase() !== data.state.toUpperCase()) {
    warnings.push({ field: "state", message: `State differs from your FMCSA record (${fmcsa.state}).` });
  }

  const count = Number(data.vehicleCount);
  const hasCount = data.vehicleCount !== "" && Number.isInteger(count) && count >= 0;
  const flatFee = FLAT_FEE_ENTITY_TYPES.includes(data.entityType as EntityType);

  if (hasCount && fmcsa.powerUnits != null && count !== fmcsa.powerUnits && !flatFee) {
    const entered = getBracket(data.registrationYear, count, data.entityType);
    const onRecord = getBracket(data.registrationYear, fmcsa.powerUnits, data.entityType);
    warnings.push({
      field: "vehicleCount",
      message:
        entered.code === onRecord.code
          ? `You entered ${count} vehicles; FMCSA lists ${fmcsa.powerUnits} power units. Your fee bracket is the same.`
          : `You entered ${count} vehicles; FMCSA lists ${fmcsa.powerUnits} power units. This changes your fee bracket (${entered.code} vs ${onRecord.code}). Make sure the count is correct.`,
    });
  }

  if (flatFee && fmcsa.powerUnits != null && fmcsa.powerUnits > 0) {
    warnings.push({
      field: "entityType",
      message: `FMCSA lists ${fmcsa.powerUnits} power units for this USDOT number. If you operate vehicles, you may need to register as a motor carrier instead.`,
    });
  }

  return warnings;
}
