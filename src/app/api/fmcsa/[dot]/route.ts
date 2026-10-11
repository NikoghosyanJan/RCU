import { NextResponse } from "next/server";
import { lookupCarrier } from "@/lib/fmcsa";

export async function GET(_req: Request, { params }: { params: Promise<{ dot: string }> }) {
  const { dot } = await params;
  if (!/^\d{1,8}$/.test(dot)) {
    return NextResponse.json({ error: "Invalid USDOT number" }, { status: 400 });
  }

  try {
    const carrier = await lookupCarrier(dot);
    if (!carrier) return NextResponse.json({ error: "Carrier not found" }, { status: 404 });
    return NextResponse.json({ carrier });
  } catch (err) {
    console.error("FMCSA lookup failed", err);
    return NextResponse.json({ error: "Lookup unavailable" }, { status: 502 });
  }
}
