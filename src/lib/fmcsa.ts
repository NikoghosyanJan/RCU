import "server-only";

const BASE_URL = "https://mobile.fmcsa.dot.gov/qc/services";

export type CarrierInfo = {
  usdotNumber: string;
  legalName: string;
  dbaName: string;
  mcNumber: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  powerUnits: number | null;
  allowedToOperate: boolean | null;
};

type QcCarrier = {
  dotNumber?: number;
  legalName?: string | null;
  dbaName?: string | null;
  phyStreet?: string | null;
  phyCity?: string | null;
  phyState?: string | null;
  phyZipcode?: string | null;
  totalPowerUnits?: number | null;
  allowedToOperate?: "Y" | "N" | null;
};

type QcDocket = { docketNumber?: number; prefix?: string };

async function qc<T>(path: string): Promise<T | null> {
  const webKey = process.env.FMCSA_WEBKEY;
  if (!webKey) throw new Error("FMCSA_WEBKEY is not set");
  const res = await fetch(`${BASE_URL}${path}?webKey=${encodeURIComponent(webKey)}`, {
    headers: { Accept: "application/json" },
    next: { revalidate: 60 * 60 * 24 },
    signal: AbortSignal.timeout(8000),
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`FMCSA request failed: ${res.status}`);
  return (await res.json()) as T;
}

export const TEST_USDOT = "000000";

const TEST_CARRIER: CarrierInfo = {
  usdotNumber: TEST_USDOT,
  legalName: "Test Trucking LLC",
  dbaName: "Test Freight",
  mcNumber: "123456",
  address: "123 Test Street",
  city: "Dallas",
  state: "TX",
  zip: "75201",
  powerUnits: 3,
  allowedToOperate: true,
};

// The test USDOT is only honored while no FMCSA key is configured, so it can't be used in production.
export async function lookupCarrier(usdot: string): Promise<CarrierInfo | null> {
  if (usdot === TEST_USDOT && !process.env.FMCSA_WEBKEY) return TEST_CARRIER;

  const [carrierRes, docketRes] = await Promise.all([
    qc<{ content?: { carrier?: QcCarrier } | null }>(`/carriers/${usdot}`),
    qc<{ content?: QcDocket[] | null }>(`/carriers/${usdot}/docket-numbers`).catch(() => null),
  ]);

  const c = carrierRes?.content?.carrier;
  if (!c) return null;

  const mc = docketRes?.content?.find((d) => d.prefix === "MC");

  return {
    usdotNumber: String(c.dotNumber ?? usdot),
    legalName: c.legalName?.trim() ?? "",
    dbaName: c.dbaName?.trim() ?? "",
    mcNumber: mc?.docketNumber ? String(mc.docketNumber) : "",
    address: c.phyStreet?.trim() ?? "",
    city: c.phyCity?.trim() ?? "",
    state: c.phyState?.trim() ?? "",
    zip: c.phyZipcode?.trim().slice(0, 10) ?? "",
    powerUnits: typeof c.totalPowerUnits === "number" ? c.totalPowerUnits : null,
    allowedToOperate: c.allowedToOperate ? c.allowedToOperate === "Y" : null,
  };
}
