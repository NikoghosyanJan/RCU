"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Lock } from "lucide-react";
import { confirmAndPayAction, type ConfirmState } from "@/app/actions/checkout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

type Item = { name: "accurate" | "authorize" | "thirdParty" | "terms"; label: React.ReactNode };

export function ConfirmForm({
  filingId,
  companyName,
  totalLabel,
  siteName,
}: {
  filingId: string;
  companyName: string;
  totalLabel: string;
  siteName: string;
}) {
  const [state, formAction, pending] = useActionState<ConfirmState, FormData>(
    confirmAndPayAction.bind(null, filingId),
    {},
  );
  const [checked, setChecked] = useState<Record<Item["name"], boolean>>({
    accurate: false,
    authorize: false,
    thirdParty: false,
    terms: false,
  });
  const [remindRenewal, setRemindRenewal] = useState(true);

  const items: Item[] = [
    {
      name: "accurate",
      label: "I confirm that the information I provided is true, accurate and complete.",
    },
    {
      name: "authorize",
      label: (
        <>
          I authorize {siteName} to submit the Unified Carrier Registration on behalf of{" "}
          <strong>{companyName}</strong>.
        </>
      ),
    },
    {
      name: "thirdParty",
      label: (
        <>
          I understand that {siteName} is a private company, not a government agency, and that the total of{" "}
          <strong>{totalLabel}</strong> includes the official UCR fee plus a software fee. I could register directly at
          ucr.gov.
        </>
      ),
    },
    {
      name: "terms",
      label: (
        <>
          I agree to the{" "}
          <Link href="/terms" target="_blank" className="text-primary underline">Terms of Service</Link>,{" "}
          <Link href="/privacy" target="_blank" className="text-primary underline">Privacy Policy</Link> and{" "}
          <Link href="/refund" target="_blank" className="text-primary underline">Refund Policy</Link>.
        </>
      ),
    },
  ];

  return (
    <form action={formAction} className="space-y-5">
      {items.map((item) => (
        <div key={item.name} className="space-y-1">
          <div className="flex items-start gap-3 rounded-lg border p-4">
            <Checkbox
              id={item.name}
              name={item.name}
              className="mt-0.5"
              checked={checked[item.name]}
              onCheckedChange={(v) => setChecked((c) => ({ ...c, [item.name]: v === true }))}
              aria-invalid={!!state.errors?.[item.name]}
            />
            <Label htmlFor={item.name} className="block text-sm leading-relaxed font-normal">
              {item.label}
            </Label>
          </div>
          {state.errors?.[item.name] && <p className="text-xs text-destructive">{state.errors[item.name]}</p>}
        </div>
      ))}

      <div className="flex items-start gap-3 rounded-lg border border-dashed p-4">
        <Checkbox
          id="remindRenewal"
          name="remindRenewal"
          className="mt-0.5"
          checked={remindRenewal}
          onCheckedChange={(v) => setRemindRenewal(v === true)}
        />
        <Label htmlFor="remindRenewal" className="block text-sm leading-relaxed font-normal">
          Email me when next year&apos;s UCR renewal opens. <span className="text-muted-foreground">(Optional)</span>
        </Label>
      </div>

      {state.message && <p className="text-sm text-destructive">{state.message}</p>}

      <div className="flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button asChild variant="ghost">
          <Link href={`/file/${filingId}`}><ArrowLeft /> Back to review</Link>
        </Button>
        <Button type="submit" size="lg" className="h-11 px-6" disabled={pending}>
          {pending ? <Loader2 className="animate-spin" /> : <Lock />}
          Proceed to secure payment · {totalLabel}
        </Button>
      </div>
    </form>
  );
}
