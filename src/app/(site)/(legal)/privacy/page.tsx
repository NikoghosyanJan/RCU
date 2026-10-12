import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  const { entityName, address } = site.legal;

  return (
    <LegalPage title="Privacy Policy" updated="October 12, 2026">
      <p>
        This policy explains how {entityName} (&quot;{site.name}&quot;, &quot;we&quot;, &quot;us&quot;) collects, uses
        and protects information when you use our website and UCR filing software.
      </p>

      <h2>Who we are</h2>
      <p>
        {entityName}, {address}, is responsible for the personal information described in this policy. Contact:{" "}
        <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>.
      </p>

      <h2>Information we collect</h2>
      <ul>
        <li>
          <strong>Contact details</strong> you provide: name, email address and phone number.
        </li>
        <li>
          <strong>Company details</strong>: USDOT number, MC number, legal and DBA names, address, entity type and fleet
          size.
        </li>
        <li>
          <strong>Public FMCSA data</strong> retrieved with your USDOT number, such as legal name, address, number of
          power units and operating status.
        </li>
        <li>
          <strong>Order details</strong>: prices, amounts paid, order status, your confirmations at checkout and your
          renewal reminder preference. Card details are collected by Lemon Squeezy and never stored by us.
        </li>
        <li>
          <strong>Technical data</strong>: IP address, browser type and server logs, collected automatically for
          security and troubleshooting.
        </li>
      </ul>

      <h2>How we use it</h2>
      <ul>
        <li>To prepare, validate and submit your UCR registration (performance of our contract with you).</li>
        <li>To send receipts, order status updates, your UCR confirmation and support replies.</li>
        <li>To send renewal reminders, if you opted in (your consent).</li>
        <li>To prevent fraud and keep the Service secure (our legitimate interests).</li>
        <li>To meet legal, tax and accounting obligations.</li>
      </ul>

      <h2>Who we share it with</h2>
      <p>We do not sell or rent your personal information, and we do not share it for advertising.</p>
      <ul>
        <li>
          <strong>The UCR Plan</strong> and its registration system, to file your registration.
        </li>
        <li>
          <strong>Lemon Squeezy</strong>, our Merchant of Record, for payment processing, taxes and receipts.
        </li>
        <li>
          <strong>Resend</strong>, for sending email.
        </li>
        <li>
          <strong>Vercel</strong> (hosting) and <strong>Neon</strong> (database), which store and process data on our
          behalf.
        </li>
        <li>Authorities, if required by law or to protect our rights.</li>
      </ul>
      <p>These providers may process data in the United States and only use it to provide their services to us.</p>

      <h2>International transfers</h2>
      <p>
        We are based in the Republic of Armenia and process personal data in line with the Armenian Law on Protection of
        Personal Data. Because our customers, the UCR Plan and our service providers are mostly in the United States, your
        information is transferred to and stored in the United States. We only share it with providers that protect it
        under contracts and their own security commitments.
      </p>

      <h2>How long we keep it</h2>
      <p>
        We keep order and filing records for as long as needed to provide the Service and to meet legal and accounting
        requirements, generally up to 7 years. You can ask us to delete an unfinished, unpaid filing at any time.
      </p>

      <h2>Security</h2>
      <p>
        Data is encrypted in transit (HTTPS) and stored with access restricted to authorized staff. No method of
        transmission or storage is completely secure, but we work to protect your information.
      </p>

      <h2>Cookies</h2>
      <p>
        We do not use advertising or analytics tracking cookies. We use only cookies that are strictly necessary for the
        site to work, such as a secure session cookie for our administrators. Lemon Squeezy may set its own cookies during
        checkout.
      </p>

      <h2>Emails and reminders</h2>
      <p>
        Order-related emails are part of the Service. Renewal reminders are optional: you can opt out at checkout, by using
        the link in any reminder email, or by contacting us.
      </p>

      <h2>Your rights</h2>
      <p>
        Depending on where you live (including California under the CCPA/CPRA, and the EU/UK under the GDPR), you may have
        the right to access, correct, delete or receive a copy of your personal information, to object to or restrict
        certain processing, and to withdraw consent. We will not discriminate against you for exercising these rights. To
        make a request, email <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>. We may need to verify your
        identity. Some records must be kept to meet legal obligations, and information already submitted to the UCR Plan
        is governed by the UCR Plan&apos;s own policies.
      </p>

      <h2>Children</h2>
      <p>The Service is for businesses and is not directed to children under 16. We do not knowingly collect their data.</p>

      <h2>Changes</h2>
      <p>
        We may update this policy from time to time. The &quot;Last updated&quot; date shows the latest version.
      </p>

      <h2>Contact</h2>
      <p>
        {entityName}, {address}. Email: <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>.
      </p>
    </LegalPage>
  );
}
