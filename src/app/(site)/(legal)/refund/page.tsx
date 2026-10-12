import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Refund Policy" };

export default function RefundPage() {
  return (
    <LegalPage title="Refund Policy" updated="October 12, 2026">
      <p>
        This policy explains when you can get a refund for an order placed with {site.name}, operated by{" "}
        {site.legal.entityName}.
      </p>

      <h2>Full refund if we can&apos;t complete your filing</h2>
      <p>
        If we can&apos;t complete your UCR filing for any reason, you receive a full refund of everything you paid: the
        UCR government fee and our software fee. This includes cases where the UCR system rejects the registration, where
        we can&apos;t verify your company, or where we are otherwise unable to submit it.
      </p>

      <h2>After your registration has been submitted</h2>
      <p>
        Once your registration has been submitted to the UCR system (order status &quot;Filed with UCR&quot; or
        &quot;Completed&quot;), the order is not refundable. The UCR government fee has been paid to the UCR Plan and
        can&apos;t be recovered by us, and our software fee has been earned. Questions about fees already paid to the UCR
        Plan must be directed to the UCR Plan.
      </p>

      <h2>Duplicate payments</h2>
      <p>
        If you were charged more than once for the same company and registration year, we refund the duplicate payment in
        full.
      </p>

      <h2>How to request a refund</h2>
      <p>
        Email <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a> with your order number and the reason for
        your request. We reply within 2 business days.
      </p>

      <h2>How refunds are paid</h2>
      <p>
        Payments are processed by Lemon Squeezy, our Merchant of Record. Approved refunds are issued through Lemon Squeezy
        to your original payment method, usually within 5–10 business days depending on your bank.
      </p>

      <h2>Disputes</h2>
      <p>
        Please contact us before opening a chargeback or payment dispute. Most issues can be resolved quickly by email,
        and a dispute can delay your filing while it is reviewed.
      </p>
    </LegalPage>
  );
}
