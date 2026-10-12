import type { OrderStatus } from "@prisma/client";
import { site } from "@/lib/site";

export const ORDER_STATUS_FLOW: OrderStatus[] = ["PAID", "PROCESSING", "FILED", "COMPLETED"];

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  PAID: "Payment received",
  PROCESSING: "Processing",
  FILED: "Filed with UCR",
  COMPLETED: "Completed",
  REFUNDED: "Refunded",
  CANCELLED: "Cancelled",
};

export const ORDER_STATUS_DESCRIPTION: Record<OrderStatus, string> = {
  PAID: "We received your payment and your order is in the queue.",
  PROCESSING: "Our team is reviewing your information and preparing your filing.",
  FILED: "Your UCR registration has been submitted to the UCR Plan.",
  COMPLETED: "Your UCR registration is complete and active.",
  REFUNDED: "This order was refunded.",
  CANCELLED: "This order was cancelled.",
};

export function trackingUrl(orderNumber: string) {
  return `${site.url}/track/${orderNumber}`;
}
