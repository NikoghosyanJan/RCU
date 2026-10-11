"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import type { OrderStatus } from "@prisma/client";
import { updateOrderStatusAction, type AdminFormState } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ORDER_STATUS_LABEL } from "@/lib/orders";

const STATUSES: OrderStatus[] = ["PAID", "PROCESSING", "FILED", "COMPLETED", "REFUNDED", "CANCELLED"];

export function StatusForm({ orderId, current }: { orderId: string; current: OrderStatus }) {
  const [state, formAction, pending] = useActionState<AdminFormState, FormData>(
    updateOrderStatusAction.bind(null, orderId),
    {},
  );

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          name="status"
          defaultValue={current}
          key={current}
          className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>{ORDER_STATUS_LABEL[s]}</option>
          ))}
        </select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="note">Note (shown to the customer on the tracking page)</Label>
        <Textarea id="note" name="note" rows={3} placeholder="Optional" />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="notify" defaultChecked className="size-4 accent-primary" />
        Email the customer about this update
      </label>
      {state.message && (
        <p className={state.ok ? "text-sm text-emerald-700" : "text-sm text-destructive"}>{state.message}</p>
      )}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending && <Loader2 className="animate-spin" />} Save update
      </Button>
    </form>
  );
}
