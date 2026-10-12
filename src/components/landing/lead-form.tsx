"use client";

import { useActionState, useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { createFilingAction, type LeadState } from "@/app/actions/lead";
import { FormField } from "@/components/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DEFAULT_REGISTRATION_YEAR, REGISTRATION_YEARS } from "@/config/fees";
import { formatPhone } from "@/lib/validation/filing";

const selectClass =
  "h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function LeadForm() {
  const [state, formAction, pending] = useActionState<LeadState, FormData>(createFilingAction, {});
  const [phone, setPhone] = useState(state.values?.phone ?? "");
  const v = state.values ?? {};
  const e = state.errors ?? {};

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <FormField id="applicantName" label="Applicant Name" required error={e.applicantName}>
        <Input
          id="applicantName"
          name="applicantName"
          className="h-10"
          defaultValue={v.applicantName}
          autoComplete="name"
          aria-invalid={!!e.applicantName}
        />
      </FormField>
      <FormField id="email" label="Email Address" required error={e.email}>
        <Input
          id="email"
          name="email"
          type="email"
          className="h-10"
          defaultValue={v.email}
          autoComplete="email"
          aria-invalid={!!e.email}
        />
      </FormField>
      <FormField id="phone" label="Phone Number" required error={e.phone}>
        <Input
          id="phone"
          name="phone"
          type="tel"
          className="h-10"
          placeholder="(XXX) XXX-XXXX"
          value={phone}
          onChange={(ev) => setPhone(formatPhone(ev.target.value))}
          autoComplete="tel-national"
          aria-invalid={!!e.phone}
        />
      </FormField>
      <div className="grid grid-cols-2 gap-4">
        <FormField id="registrationYear" label="Registration Year" required error={e.registrationYear}>
          <select
            id="registrationYear"
            name="registrationYear"
            className={selectClass}
            defaultValue={v.registrationYear ?? String(DEFAULT_REGISTRATION_YEAR)}
          >
            {REGISTRATION_YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </FormField>
        <FormField id="usdotNumber" label="USDOT Number" required error={e.usdotNumber}>
          <Input
            id="usdotNumber"
            name="usdotNumber"
            inputMode="numeric"
            className="h-10"
            defaultValue={v.usdotNumber}
            maxLength={8}
            aria-invalid={!!e.usdotNumber}
          />
        </FormField>
      </div>
      {state.message && <p className="text-sm text-destructive">{state.message}</p>}
      <Button type="submit" size="lg" className="h-11 w-full text-base" disabled={pending}>
        {pending ? <Loader2 className="animate-spin" /> : null}
        Start My UCR Filing
        {!pending && <ArrowRight />}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        100% online. Takes about 3 minutes. Secure checkout.
      </p>
    </form>
  );
}
