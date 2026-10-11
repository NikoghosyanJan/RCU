import Link from "next/link";
import { LogOut, ShieldCheck } from "lucide-react";
import { logoutAction } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";

export function AdminHeader() {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/admin/orders" className="flex items-center gap-2 font-semibold">
          <ShieldCheck className="size-5 text-primary" /> {site.name} · Admin
        </Link>
        <form action={logoutAction}>
          <Button variant="ghost" size="sm" type="submit">
            <LogOut /> Sign out
          </Button>
        </form>
      </div>
    </header>
  );
}
