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
            <TableHead>
              Vehicles<span className="hidden sm:inline"> owned or operated</span>
            </TableHead>
            <TableHead className="px-4 text-right sm:px-2">2027 UCR fee</TableHead>
            <TableHead className="hidden px-4 text-right sm:table-cell">2026 UCR fee</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fees2027.map((b, i) => (
            <TableRow key={b.code}>
              <TableCell className="px-4 font-medium">{b.code}</TableCell>
              <TableCell>{bracketLabel(b)}</TableCell>
              <TableCell className="px-4 text-right font-semibold sm:px-2">{formatUSD(b.feeCents)}</TableCell>
              <TableCell className="hidden px-4 text-right text-muted-foreground sm:table-cell">
                {formatUSD(fees2026[i].feeCents)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
