import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { FilingWizard, type WizardFiling } from "@/components/filing/filing-wizard";
import { SERVICE_FEE_CENTS } from "@/config/fees";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "UCR Filing", robots: { index: false } };

export default async function FilingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const filing = await db.filing.findUnique({ where: { id }, include: { order: true } });
  if (!filing) notFound();
  if (filing.order) redirect(`/track/${filing.order.orderNumber}`);

  const initial: WizardFiling = {
    id: filing.id,
    applicantName: filing.applicantName,
    email: filing.email,
    phone: filing.phone,
    registrationYear: filing.registrationYear,
    usdotNumber: filing.usdotNumber,
    legalName: filing.legalName ?? "",
    dbaName: filing.dbaName ?? "",
    mcNumber: filing.mcNumber ?? "",
    address: filing.address ?? "",
    city: filing.city ?? "",
    state: filing.state ?? "",
    zip: filing.zip ?? "",
    entityType: filing.entityType ?? "",
    vehicleCount: filing.vehicleCount?.toString() ?? "",
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <FilingWizard initial={initial} serviceFeeCents={SERVICE_FEE_CENTS} />
    </div>
  );
}
