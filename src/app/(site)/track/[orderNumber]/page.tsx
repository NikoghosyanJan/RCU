import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Check, Circle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { normalizeOrderNumber } from "@/lib/order-number";
import { ORDER_STATUS_DESCRIPTION, ORDER_STATUS_FLOW, ORDER_STATUS_LABEL } from "@/lib/orders";
import { formatUSD } from "@/lib/pricing";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Order status", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function OrderStatusPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await params;
  const order = await db.order.findUnique({
    where: { orderNumber: normalizeOrderNumber(decodeURIComponent(orderNumber)) },
    include: {
      filing: { select: { legalName: true, usdotNumber: true, registrationYear: true } },
      events: { orderBy: { createdAt: "asc" } },
    },
  });
  if (!order) notFound();

  const terminal = order.status === "REFUNDED" || order.status === "CANCELLED";
  const currentIndex = ORDER_STATUS_FLOW.indexOf(order.status);
  const reachedAt = (status: string) => order.events.find((e) => e.status === status)?.createdAt;

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">Order</p>
          <h1 className="text-2xl font-bold tracking-wider">{order.orderNumber}</h1>
        </div>
        <Badge variant={terminal ? "destructive" : "default"} className="px-3 py-1 text-sm">
          {ORDER_STATUS_LABEL[order.status]}
        </Badge>
      </div>

      <Card>
        <CardContent className="grid gap-4 p-6 text-sm sm:grid-cols-2">
          <Info label="Company" value={order.filing.legalName ?? ""} />
          <Info label="USDOT" value={order.filing.usdotNumber} />
          <Info label="Registration year" value={String(order.filing.registrationYear)} />
          <Info label="Amount paid" value={formatUSD(order.amountCents)} />
          <Info label="Ordered on" value={order.createdAt.toLocaleDateString("en-US", { dateStyle: "long" })} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Progress</CardTitle>
        </CardHeader>
        <CardContent>
          {terminal ? (
            <div className="flex items-start gap-3">
              <XCircle className="mt-0.5 size-5 text-destructive" />
              <div>
                <p className="font-medium">{ORDER_STATUS_LABEL[order.status]}</p>
                <p className="text-sm text-muted-foreground">{ORDER_STATUS_DESCRIPTION[order.status]}</p>
              </div>
            </div>
          ) : (
            <ol className="relative space-y-6">
              {ORDER_STATUS_FLOW.map((status, i) => {
                const done = i <= currentIndex;
                const at = reachedAt(status);
                return (
                  <li key={status} className="relative flex gap-4">
                    {i < ORDER_STATUS_FLOW.length - 1 && (
                      <span
                        className={cn("absolute top-7 left-3.5 h-[calc(100%-4px)] w-px", done ? "bg-primary" : "bg-border")}
                      />
                    )}
                    <span
                      className={cn(
                        "z-10 flex size-7 shrink-0 items-center justify-center rounded-full border",
                        done ? "border-primary bg-primary text-primary-foreground" : "bg-background text-muted-foreground",
                      )}
                    >
                      {done ? <Check className="size-4" /> : <Circle className="size-2.5" />}
                    </span>
                    <div>
                      <p className={cn("font-medium", !done && "text-muted-foreground")}>{ORDER_STATUS_LABEL[status]}</p>
                      <p className="text-sm text-muted-foreground">{ORDER_STATUS_DESCRIPTION[status]}</p>
                      {at && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {at.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </CardContent>
      </Card>

      {order.events.some((e) => e.note && e.status !== "PAID") && (
        <Card>
          <CardHeader>
            <CardTitle>Updates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {order.events
              .filter((e) => e.note && e.status !== "PAID")
              .map((e) => (
                <div key={e.id} className="border-l-2 border-primary pl-3">
                  <p>{e.note}</p>
                  <p className="text-xs text-muted-foreground">
                    {e.createdAt.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
                  </p>
                </div>
              ))}
          </CardContent>
        </Card>
      )}

      <p className="text-center text-sm text-muted-foreground">
        Need help? <Link href="/#faq" className="text-primary underline">Visit our FAQ</Link> or reply to your receipt email.
      </p>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
