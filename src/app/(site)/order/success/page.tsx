import Link from "next/link";
import type { Metadata } from "next";
import { CheckCircle2, Loader2, Mail } from "lucide-react";
import { RefreshPoller } from "@/components/order/refresh-poller";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Thank you", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ filing?: string }> }) {
  const { filing: filingId } = await searchParams;
  const filing = filingId
    ? await db.filing.findUnique({ where: { id: filingId }, include: { order: true } })
    : null;

  if (!filing) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Order not found</h1>
        <p className="mt-2 text-muted-foreground">
          If you completed a payment, check your email for your order number and tracking link.
        </p>
        <Button asChild className="mt-6">
          <Link href="/track">Track an order</Link>
        </Button>
      </div>
    );
  }

  const order = filing.order;

  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <Card>
        <CardContent className="space-y-5 p-8 text-center">
          {order ? (
            <>
              <CheckCircle2 className="mx-auto size-14 text-emerald-600" />
              <h1 className="text-2xl font-bold">Thank you! Payment received.</h1>
              <p className="text-muted-foreground">
                We&apos;re preparing the {filing.registrationYear} UCR registration for{" "}
                <strong className="text-foreground">{filing.legalName}</strong>.
              </p>
              <div className="rounded-lg bg-muted p-4">
                <p className="text-xs uppercase text-muted-foreground">Order number</p>
                <p className="text-2xl font-bold tracking-wider text-primary">{order.orderNumber}</p>
              </div>
              <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Mail className="size-4" /> A receipt and tracking link were sent to {filing.email}
              </p>
              <Button asChild size="lg" className="h-11 w-full">
                <Link href={`/track/${order.orderNumber}`}>Track my order</Link>
              </Button>
            </>
          ) : (
            <>
              <Loader2 className="mx-auto size-12 animate-spin text-primary" />
              <h1 className="text-2xl font-bold">Confirming your payment…</h1>
              <p className="text-muted-foreground">
                This usually takes a few seconds. Please keep this page open.
              </p>
              <RefreshPoller />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
