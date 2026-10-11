import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { StatusForm } from "@/components/admin/status-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ENTITY_TYPES } from "@/config/fees";
import { db } from "@/lib/db";
import { ORDER_STATUS_LABEL } from "@/lib/orders";
import { formatUSD } from "@/lib/pricing";

export const dynamic = "force-dynamic";

export default async function AdminOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await db.order.findUnique({
    where: { id },
    include: { filing: true, events: { orderBy: { createdAt: "desc" } } },
  });
  if (!order) notFound();
  const f = order.filing;

  return (
    <>
      <AdminHeader />
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="icon">
              <Link href="/admin/orders"><ArrowLeft /></Link>
            </Button>
            <h1 className="text-2xl font-bold tracking-wider">{order.orderNumber}</h1>
            <StatusBadge status={order.status} />
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href={`/track/${order.orderNumber}`} target="_blank">
              Customer tracking page <ExternalLink />
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader><CardTitle>Company</CardTitle></CardHeader>
              <CardContent className="grid gap-4 text-sm sm:grid-cols-2">
                <Info label="Legal name" value={f.legalName} />
                <Info label="DBA" value={f.dbaName} />
                <Info label="USDOT" value={f.usdotNumber} />
                <Info label="MC" value={f.mcNumber} />
                <Info label="Address" value={[f.address, f.city, f.state, f.zip].filter(Boolean).join(", ")} />
                <Info label="Entity type" value={ENTITY_TYPES.find((t) => t.value === f.entityType)?.label ?? f.entityType} />
                <Info label="Vehicles" value={f.vehicleCount?.toString()} />
                <Info label="Registration year" value={String(f.registrationYear)} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Applicant</CardTitle></CardHeader>
              <CardContent className="grid gap-4 text-sm sm:grid-cols-3">
                <Info label="Name" value={f.applicantName} />
                <Info label="Email" value={f.email} />
                <Info label="Phone" value={f.phone} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Payment</CardTitle></CardHeader>
              <CardContent className="grid gap-4 text-sm sm:grid-cols-3">
                <Info label="UCR fee" value={`${formatUSD(f.ucrFeeCents ?? 0)} (${f.feeBracket})`} />
                <Info label="Service fee" value={formatUSD(f.serviceFeeCents ?? 0)} />
                <Info label="Amount paid" value={formatUSD(order.amountCents)} />
                <Info label="Lemon Squeezy order" value={order.lsOrderId} />
                <Info label="Paid at" value={order.createdAt.toLocaleString("en-US")} />
                <Info label="Terms accepted" value={f.agreedTermsAt?.toLocaleString("en-US")} />
                {order.receiptUrl && (
                  <a href={order.receiptUrl} target="_blank" rel="noreferrer" className="text-primary underline">
                    View receipt
                  </a>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Update status</CardTitle></CardHeader>
              <CardContent>
                <StatusForm orderId={order.id} current={order.status} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>History</CardTitle></CardHeader>
              <CardContent className="space-y-4 text-sm">
                {order.events.map((e) => (
                  <div key={e.id} className="border-l-2 border-primary pl-3">
                    <p className="font-medium">{ORDER_STATUS_LABEL[e.status]}</p>
                    {e.note && <p className="text-muted-foreground">{e.note}</p>}
                    <p className="text-xs text-muted-foreground">{e.createdAt.toLocaleString("en-US")}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

function Info({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-muted-foreground">{label}</p>
      <p className="font-medium break-words">{value || "—"}</p>
    </div>
  );
}
