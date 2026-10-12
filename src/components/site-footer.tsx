import Link from "next/link";
import { disclaimer, site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t bg-muted/40">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-semibold">{site.name}</p>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Automated software that prepares, validates and files your annual Unified Carrier Registration for
            carriers, brokers, freight forwarders and leasing companies.
          </p>
        </div>
        <div className="text-sm">
          <p className="font-medium">Company</p>
          <ul className="mt-2 space-y-1.5 text-muted-foreground">
            <li><Link href="/track" className="hover:text-foreground">Track your order</Link></li>
            <li><Link href="/terms" className="hover:text-foreground">Terms of Service</Link></li>
            <li><Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
            <li><Link href="/refund" className="hover:text-foreground">Refund Policy</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="font-medium">Contact</p>
          <ul className="mt-2 space-y-1.5 text-muted-foreground">
            <li><a href={`mailto:${site.supportEmail}`} className="hover:text-foreground">{site.supportEmail}</a></li>
            <li><a href={`tel:${site.supportPhone.replace(/\D/g, "")}`} className="hover:text-foreground">{site.supportPhone}</a></li>
            <li>Mon–Fri, 9am–6pm ET</li>
          </ul>
        </div>
      </div>
      <div className="border-t">
        <div className="mx-auto max-w-6xl space-y-2 px-4 py-6 text-xs text-muted-foreground">
          <p><strong>Disclaimer:</strong> {disclaimer}</p>
          <p>
            &copy; {new Date().getFullYear()} {site.legal.entityName}
            {site.legal.entityName !== site.name && <> (operating as {site.name})</>}. {site.legal.address}. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
