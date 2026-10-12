import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal-page";
import { SERVICE_FEE_CENTS } from "@/config/fees";
import { formatUSD } from "@/lib/pricing";
import { disclaimer, site } from "@/lib/site";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  const { entityName, address, regNumber, governingLaw, disputeVenue } = site.legal;

  return (
    <LegalPage title="Terms of Service" updated="October 12, 2026">
      <p>
        These Terms of Service (&quot;Terms&quot;) are an agreement between you and {entityName} (&quot;{site.name}
        &quot;, &quot;we&quot;, &quot;us&quot;), {address}. They govern your use of the {site.name} website and software
        (the &quot;Service&quot;). By using the Service or placing an order, you agree to these Terms. If you are using
        the Service for a company, you agree on behalf of that company.
      </p>

      <h2>1. The Service</h2>
      <p>
        {site.name} is online software that prepares and files your annual Unified Carrier Registration (UCR). Using the
        USDOT number you enter, the Service retrieves your public record from the Federal Motor Carrier Safety
        Administration (FMCSA), pre-fills your registration, checks your company details, fleet size and classification,
        and flags mismatches before you pay. After you review and authorize the filing, we submit your registration to the
        UCR system on your behalf and email you the confirmation. If you opt in, we also remind you when the next
        registration year opens.
      </p>

      <h2>2. Not a government agency</h2>
      <p>{disclaimer}</p>

      <h2>3. Eligibility and authority</h2>
      <ul>
        <li>You must be at least 18 years old and able to enter into a binding contract.</li>
        <li>
          You confirm that you are the owner, an officer, or an authorized representative of the company named in your
          order, and that you have authority to register it with the UCR Plan.
        </li>
        <li>The Service is intended for businesses, not consumers acting for personal purposes.</li>
      </ul>

      <h2>4. Authorization to file on your behalf</h2>
      <p>
        By completing checkout, you authorize {site.name} to submit the UCR registration for the company, USDOT number
        and registration year shown in your order, and to pay the official UCR fee to the UCR Plan on your behalf from the
        amount you paid. We act only as your filing agent for that registration.
      </p>

      <h2>5. Your information and FMCSA data</h2>
      <ul>
        <li>You are responsible for providing accurate, complete and current information, including your fleet size.</li>
        <li>
          Data pre-filled from FMCSA comes from a public government database that may be outdated. Mismatch warnings are
          provided for convenience and do not guarantee that your information is correct.
        </li>
        <li>
          You remain responsible for your company&apos;s compliance with federal and state regulations, including keeping
          your FMCSA record up to date.
        </li>
      </ul>

      <h2>6. Pricing</h2>
      <p>Your price has two parts, shown separately before and at checkout:</p>
      <ul>
        <li>
          <strong>The UCR government fee</strong>, set by the UCR Plan based on fleet size and registration year. We pass
          this amount through to the UCR Plan when we file.
        </li>
        <li>
          <strong>Our software fee</strong> (currently {formatUSD(SERVICE_FEE_CENTS)} per filing) for preparing,
          validating and submitting your registration, order tracking and support.
        </li>
      </ul>
      <p>
        Prices are calculated by our system from the information you provide. Official UCR fees may change by
        registration year. All prices are in US dollars.
      </p>

      <h2>7. Payments and Merchant of Record</h2>
      <p>
        Our order process is conducted by our online reseller Lemon Squeezy, which is the Merchant of Record for all our
        orders. Lemon Squeezy processes your payment, handles any applicable taxes, and provides customer service
        inquiries and returns related to payment. Lemon Squeezy&apos;s{" "}
        <a href="https://www.lemonsqueezy.com/buyer-terms" target="_blank" rel="noopener noreferrer">
          Buyer Terms
        </a>{" "}
        also apply to your purchase. We never receive or store your full card details.
      </p>

      <h2>8. Processing times and availability</h2>
      <p>
        We typically submit registrations within 1–2 business days after payment. Processing times are estimates and can
        be affected by the availability of the UCR registration system, by FMCSA data issues, or by incomplete or
        incorrect information. We will contact you by email if we need anything from you.
      </p>

      <h2>9. Renewal reminders</h2>
      <p>
        If you leave the reminder option checked at checkout, we will email you when the next UCR registration year
        opens. Reminders do not renew or charge you automatically. You can opt out at any time using the link in the email
        or by contacting us.
      </p>

      <h2>10. Refunds</h2>
      <p>
        Refunds are handled according to our <Link href="/refund">Refund Policy</Link>, which is part of these Terms.
      </p>

      <h2>11. Acceptable use and intellectual property</h2>
      <ul>
        <li>
          Do not submit information you are not authorized to submit, misuse the Service, attempt to access other
          users&apos; orders, or interfere with its operation (including scraping or automated access).
        </li>
        <li>
          The Service, including its software, design and content, is owned by {entityName} and protected by law. We grant
          you a limited, non-exclusive, non-transferable right to use it for its intended purpose.
        </li>
      </ul>

      <h2>12. Disclaimers</h2>
      <p>
        Except as expressly stated in these Terms, the Service is provided &quot;as is&quot; and &quot;as
        available&quot;. We do not guarantee that the UCR registration system or FMCSA data will be available or accurate
        at any given time. We do not provide legal, tax or compliance advice.
      </p>

      <h2>13. Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, our total liability for any claim related to the Service is limited to the
        software fee you paid for the order in question. We are not liable for indirect, incidental, special or
        consequential damages, or for fines, penalties or enforcement actions resulting from inaccurate information you
        provided, from delays caused by third-party systems, or from your failure to register on time.
      </p>

      <h2>14. Indemnification</h2>
      <p>
        You agree to indemnify and hold harmless {entityName} from claims, losses and expenses arising from information you
        provided, from your breach of these Terms, or from your violation of any law.
      </p>

      <h2>15. Governing law</h2>
      <p>
        These Terms are governed by the laws of {governingLaw}, without regard to its conflict-of-law rules. Before
        starting any formal proceeding, please contact us so we can try to resolve the issue informally. Any dispute that
        can&apos;t be resolved informally will be brought in the competent courts of {disputeVenue}, and you consent to
        their jurisdiction.
      </p>

      <h2>16. Changes</h2>
      <p>
        We may update these Terms from time to time. The &quot;Last updated&quot; date shows the latest version. Changes do
        not affect orders placed before the change.
      </p>

      <h2>17. Contact</h2>
      <p>
        {entityName}, {address}.{regNumber && <> Registration / tax ID: {regNumber}.</>} Email:{" "}
        <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>.
      </p>
    </LegalPage>
  );
}
