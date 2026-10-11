import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Refund Policy" };

export default function RefundPage() {
  return (
    <LegalPage title="Refund Policy" updated="October 11, 2026">
      <h2>Before we file</h2>
      <p>
        If you cancel before your UCR registration has been submitted (order status &quot;Payment received&quot; or
        &quot;Processing&quot;), you are entitled to a full refund.
      </p>
      <h2>After we file</h2>
      <p>
        Once your registration has been submitted to the UCR Plan (status &quot;Filed with UCR&quot; or
        &quot;Completed&quot;), the official UCR fee has been paid to the UCR Plan and is not refundable by us, and our
        service fee is earned.
      </p>
      <h2>Duplicate payments</h2>
      <p>If you were charged twice for the same company and registration year, we will refund the duplicate payment.</p>
      <h2>How to request a refund</h2>
      <p>Email {site.supportEmail} with your order number. Refunds go back to the original payment method.</p>
    </LegalPage>
  );
}
