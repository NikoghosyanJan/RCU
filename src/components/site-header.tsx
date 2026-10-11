import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <ShieldCheck className="size-6 text-primary" />
          <span>{site.name}</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link href="/#fees" className="hidden px-3 py-2 text-muted-foreground hover:text-foreground sm:block">
            Fees
          </Link>
          <Link href="/#how-it-works" className="hidden px-3 py-2 text-muted-foreground hover:text-foreground sm:block">
            How it works
          </Link>
          <Link href="/#faq" className="hidden px-3 py-2 text-muted-foreground hover:text-foreground md:block">
            FAQ
          </Link>
          <Button asChild variant="outline" size="sm">
            <Link href="/track">Track Order</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
