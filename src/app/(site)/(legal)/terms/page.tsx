import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { disclaimer, site } from "@/lib/site";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated="October 11, 2026">
      <p>
        These Terms of Service govern your use of the {site.name} website and services. By submitting an order you agree
        to these terms.
      </p>
      <h2>1. Our service</h2>
      <p>{disclaimer}</p>
      <p>
        We prepare and submit Unified Carrier Registration (UCR) filings on your behalf using the information you provide.
        Your payment includes the official UCR fee, which we remit to the UCR Plan, and our service fee for preparing and
        submitting the filing and providing support.
      </p>
      <h2>2. Your responsibilities</h2>
      <ul>
        <li>You must provide accurate, complete and current information, including your fleet size.</li>
        <li>You confirm that you are authorized to act on behalf of the company named in the order.</li>
        <li>You remain responsible for your company&apos;s compliance with federal and state regulations.</li>
      </ul>
      <h2>3. Authorization</h2>
      <p>
        By placing an order you authorize {site.name} to submit the UCR registration and payment for the registration year
        you selected on behalf of your company.
      </p>
      <h2>4. Processing times</h2>
      <p>
        We typically process orders within 1–2 business days. Processing times are estimates and may be affected by the
        availability of the UCR National Registration System or by incomplete information.
      </p>
      <h2>5. Fees and payment</h2>
      <p>
        Payments are processed by Lemon Squeezy, our merchant of record. Prices are shown before checkout. Official UCR fees
        are set by the UCR Board and FMCSA and may change by registration year.
      </p>
      <h2>6. Refunds</h2>
      <p>Refunds are handled according to our Refund Policy.</p>
      <h2>7. Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, our liability for any claim related to the service is limited to the
        service fee you paid. We are not liable for penalties resulting from inaccurate information you provided.
      </p>
      <h2>8. Contact</h2>
      <p>Questions about these terms: {site.supportEmail}.</p>
    </LegalPage>
  );
}
