import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="October 11, 2026">
      <p>This policy explains how {site.name} collects and uses your information.</p>
      <h2>Information we collect</h2>
      <ul>
        <li>Contact details: name, email address and phone number.</li>
        <li>Company details: USDOT number, MC number, legal and DBA names, address, entity type and fleet size.</li>
        <li>Order details: amounts paid and order status. Card details are handled by Lemon Squeezy and never stored by us.</li>
      </ul>
      <h2>How we use it</h2>
      <ul>
        <li>To prepare and submit your UCR filing.</li>
        <li>To send receipts, order status updates and support replies.</li>
        <li>To meet legal and accounting obligations.</li>
      </ul>
      <h2>Sharing</h2>
      <p>
        We share information only with the UCR Plan to complete your filing, and with service providers that help us run
        the service (payment processing, email delivery, hosting). We do not sell your personal information.
      </p>
      <h2>Public data</h2>
      <p>
        We look up company information from the public FMCSA database using the USDOT number you provide, to pre-fill your
        filing.
      </p>
      <h2>Your choices</h2>
      <p>You can request access to, correction of, or deletion of your data by emailing {site.supportEmail}.</p>
    </LegalPage>
  );
}
