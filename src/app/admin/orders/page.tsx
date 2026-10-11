import Link from "next/link";
import { OrderStatus, type Prisma } from "@prisma/client";
import { AdminHeader } from "@/components/admin/admin-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { db } from "@/lib/db";
import { ORDER_STATUS_LABEL } from "@/lib/orders";
import { formatUSD } from "@/lib/pricing";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  const { q = "", status = "", page = "1" } = await searchParams;
  const pageNum = Math.max(1, Number(page) || 1);
  const query = q.trim();

  const where: Prisma.OrderWhereInput = {
    ...(Object.values(OrderStatus).includes(status as OrderStatus) ? { status: status as OrderStatus } : {}),
    ...(query
      ? {
          OR: [
            { orderNumber: { contains: query.toUpperCase() } },
            { filing: { usdotNumber: { contains: query } } },
            { filing: { email: { contains: query, mode: "insensitive" } } },
            { filing: { legalName: { contains: query, mode: "insensitive" } } },
          ],
        }
      : {}),
  };

  const [orders, total, counts] = await Promise.all([
    db.order.findMany({
      where,
      include: { filing: { select: { legalName: true, usdotNumber: true, email: true, registrationYear: true } } },
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      skip: (pageNum - 1) * PAGE_SIZE,
    }),
    db.order.count({ where }),
    db.order.groupBy({ by: ["status"], _count: true }),
  ]);

  const countFor = (s: OrderStatus) => counts.find((c) => c.status === s)?._count ?? 0;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const qs = (p: number) => `?${new URLSearchParams({ q, status, page: String(p) })}`;

  return (
    <>
      <AdminHeader />
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(["PAID", "PROCESSING", "FILED", "COMPLETED"] as OrderStatus[]).map((s) => (
            <Link key={s} href={`?status=${s}`} className="rounded-xl border bg-background p-4 hover:border-primary">
              <p className="text-sm text-muted-foreground">{ORDER_STATUS_LABEL[s]}</p>
              <p className="text-2xl font-bold">{countFor(s)}</p>
            </Link>
          ))}
        </div>

        <form className="flex flex-col gap-3 sm:flex-row">
          <Input name="q" defaultValue={q} placeholder="Search order #, USDOT, email or company" className="h-10 bg-background" />
          <select
            name="status"
            defaultValue={status}
            className="h-10 rounded-lg border border-input bg-background px-3 text-sm"
          >
            <option value="">All statuses</option>
            {Object.values(OrderStatus).map((s) => (
              <option key={s} value={s}>{ORDER_STATUS_LABEL[s]}</option>
            ))}
          </select>
          <Button type="submit" className="h-10">Search</Button>
          {(q || status) && (
            <Button asChild variant="ghost" className="h-10">
              <Link href="/admin/orders">Clear</Link>
            </Button>
          )}
        </form>

        <Card className="overflow-hidden p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-4">Order #</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>USDOT</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="px-4">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                    No orders found.
                  </TableCell>
                </TableRow>
              )}
              {orders.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="px-4 font-medium">
                    <Link href={`/admin/orders/${o.id}`} className="text-primary hover:underline">
                      {o.orderNumber}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-56 truncate">{o.filing.legalName}</div>
                    <div className="max-w-56 truncate text-xs text-muted-foreground">{o.filing.email}</div>
                  </TableCell>
                  <TableCell>{o.filing.usdotNumber}</TableCell>
                  <TableCell>{o.filing.registrationYear}</TableCell>
                  <TableCell>{formatUSD(o.amountCents)}</TableCell>
                  <TableCell><StatusBadge status={o.status} /></TableCell>
                  <TableCell className="px-4 text-muted-foreground">
                    {o.createdAt.toLocaleDateString("en-US", { dateStyle: "medium" })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {pages > 1 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Page {pageNum} of {pages} · {total} orders
            </span>
            <div className="flex gap-2">
              {pageNum > 1 && (
                <Button asChild variant="outline" size="sm">
                  <Link href={qs(pageNum - 1)}>Previous</Link>
                </Button>
              )}
              {pageNum < pages && (
                <Button asChild variant="outline" size="sm">
                  <Link href={qs(pageNum + 1)}>Next</Link>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
