import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UCR_FEES } from "@/config/fees";
import { bracketLabel, formatUSD } from "@/lib/pricing";

export function FeeTable() {
  const fees2026 = UCR_FEES[2026];
  const fees2027 = UCR_FEES[2027];

  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="px-4">Bracket</TableHead>
            <TableHead>Vehicles owned or operated</TableHead>
            <TableHead className="text-right">2026 UCR fee</TableHead>
            <TableHead className="px-4 text-right">2027 UCR fee</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fees2027.map((b, i) => (
            <TableRow key={b.code}>
              <TableCell className="px-4 font-medium">{b.code}</TableCell>
              <TableCell>{bracketLabel(b)}</TableCell>
              <TableCell className="text-right">{formatUSD(fees2026[i].feeCents)}</TableCell>
              <TableCell className="px-4 text-right font-semibold">{formatUSD(b.feeCents)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
