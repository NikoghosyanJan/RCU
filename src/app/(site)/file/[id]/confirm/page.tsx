import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { ConfirmForm } from "@/components/filing/confirm-form";
import { Stepper } from "@/components/filing/stepper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/db";
import { bracketLabel, formatUSD, quote } from "@/lib/pricing";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Confirm & Pay", robots: { index: false } };

export default async function ConfirmPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const filing = await db.filing.findUnique({ where: { id }, include: { order: true } });
  if (!filing) notFound();
  if (filing.order) redirect(`/track/${filing.order.orderNumber}`);
  if (!filing.legalName || filing.vehicleCount == null || !filing.entityType) redirect(`/file/${id}`);

  const q = quote(filing.registrationYear, filing.vehicleCount, filing.entityType);

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Confirm &amp; pay</h1>
        <p className="text-sm text-muted-foreground">Please review and accept the statements below.</p>
      </div>
      <Stepper current={3} />

      <Card>
        <CardHeader>
          <CardTitle>Order summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Company</span>
            <span className="text-right font-medium">{filing.legalName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">USDOT</span>
            <span>{filing.usdotNumber}</span>
          </div>
          <Separator className="my-3" />
          <div className="flex justify-between">
            <span>
              {filing.registrationYear} UCR fee (bracket {q.bracket.code}, {bracketLabel(q.bracket)})
            </span>
            <span>{formatUSD(q.ucrFeeCents)}</span>
          </div>
          <div className="flex justify-between">
            <span>Service fee</span>
            <span>{formatUSD(q.serviceFeeCents)}</span>
          </div>
          <Separator className="my-3" />
          <div className="flex justify-between text-base font-semibold">
            <span>Total</span>
            <span>{formatUSD(q.totalCents)}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Authorization</CardTitle>
        </CardHeader>
        <CardContent>
          <ConfirmForm
            filingId={filing.id}
            companyName={filing.legalName}
            totalLabel={formatUSD(q.totalCents)}
            siteName={site.name}
          />
        </CardContent>
      </Card>
    </div>
  );
}
