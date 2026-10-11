import type { OrderStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { ORDER_STATUS_LABEL } from "@/lib/orders";

const variant: Record<OrderStatus, "default" | "secondary" | "destructive" | "outline"> = {
  PAID: "secondary",
  PROCESSING: "outline",
  FILED: "default",
  COMPLETED: "default",
  REFUNDED: "destructive",
  CANCELLED: "destructive",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return <Badge variant={variant[status]}>{ORDER_STATUS_LABEL[status]}</Badge>;
}
