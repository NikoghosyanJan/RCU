"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowLeft, ArrowRight, CheckCircle2, Loader2, Pencil } from "lucide-react";
import { saveCompanyStep, saveOperationStep } from "@/app/actions/filing";
import { FormField } from "@/components/form-field";
import { Stepper } from "@/components/filing/stepper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ENTITY_TYPES, REGISTRATION_YEARS } from "@/config/fees";
import { US_STATES } from "@/config/states";
import { compareWithFmcsa, type FilingWarning, type FmcsaRecord } from "@/lib/filing-checks";
import { bracketLabel, formatUSD, getBracket } from "@/lib/pricing";
import { formatPhone } from "@/lib/validation/filing";

export type WizardFiling = {
  id: string;
  applicantName: string;
  email: string;
  phone: string;
  registrationYear: number;
  usdotNumber: string;
  legalName: string;
  dbaName: string;
  mcNumber: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  entityType: string;
  vehicleCount: string;
};

type LookupState = "idle" | "loading" | "found" | "not-found" | "error";

const selectClass =
  "h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive";

export function FilingWizard({ initial, serviceFeeCents }: { initial: WizardFiling; serviceFeeCents: number }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string>();
  const [lookup, setLookup] = useState<LookupState>("idle");
  const [fmcsa, setFmcsa] = useState<FmcsaRecord | null>(null);
  const [pending, startTransition] = useTransition();

  const set = (key: keyof WizardFiling) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = key === "phone" ? formatPhone(e.target.value) : e.target.value;
    setData((d) => ({ ...d, [key]: value }));
  };

  useEffect(() => {
    const resuming = !!initial.legalName;
    let cancelled = false;
    if (!resuming) setLookup("loading");
    fetch(`/api/fmcsa/${initial.usdotNumber}`)
      .then(async (res) => {
        if (cancelled) return;
        if (!res.ok) {
          if (!resuming) setLookup(res.status === 404 ? "not-found" : "error");
          return;
        }
        const { carrier } = await res.json();
        setFmcsa({
          legalName: carrier.legalName,
          state: carrier.state,
          powerUnits: carrier.powerUnits,
          allowedToOperate: carrier.allowedToOperate,
        });
        if (resuming) return;
        setData((d) => ({
          ...d,
          legalName: d.legalName || carrier.legalName,
          dbaName: d.dbaName || carrier.dbaName,
          mcNumber: d.mcNumber || carrier.mcNumber,
          address: d.address || carrier.address,
          city: d.city || carrier.city,
          state: d.state || carrier.state,
          zip: d.zip || carrier.zip,
          vehicleCount: d.vehicleCount || (carrier.powerUnits != null ? String(carrier.powerUnits) : ""),
        }));
        setLookup("found");
      })
      .catch(() => {
        if (!cancelled && !resuming) setLookup("error");
      });
    return () => {
      cancelled = true;
    };
  }, [initial.legalName, initial.usdotNumber]);

  const warnings = useMemo(() => (fmcsa ? compareWithFmcsa(data, fmcsa) : []), [data, fmcsa]);

  const preview = useMemo(() => {
    const count = Number(data.vehicleCount);
    if (data.vehicleCount === "" || !Number.isInteger(count) || count < 0) return null;
    const bracket = getBracket(Number(data.registrationYear), count, data.entityType);
    return { bracket, total: bracket.feeCents + serviceFeeCents };
  }, [data.vehicleCount, data.registrationYear, data.entityType, serviceFeeCents]);

  function submitCompany() {
    setMessage(undefined);
    startTransition(async () => {
      const res = await saveCompanyStep(data.id, {
        applicantName: data.applicantName,
        email: data.email,
        phone: data.phone,
        registrationYear: data.registrationYear,
        legalName: data.legalName,
        dbaName: data.dbaName,
        mcNumber: data.mcNumber,
        address: data.address,
        city: data.city,
        state: data.state,
        zip: data.zip,
      });
      if (!res.ok) {
        setErrors(res.errors ?? {});
        setMessage(res.message);
        return;
      }
      setErrors({});
      setStep(1);
      window.scrollTo({ top: 0 });
    });
  }

  function submitOperation() {
    setMessage(undefined);
    startTransition(async () => {
      const res = await saveOperationStep(data.id, {
        entityType: data.entityType,
        vehicleCount: data.vehicleCount,
      });
      if (!res.ok) {
        setErrors(res.errors ?? {});
        setMessage(res.message);
        return;
      }
      setErrors({});
      setStep(2);
      window.scrollTo({ top: 0 });
    });
  }

  const e = errors;
  const entityLabel = ENTITY_TYPES.find((t) => t.value === data.entityType)?.label;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{data.registrationYear} UCR Registration</h1>
        <p className="text-sm text-muted-foreground">USDOT #{data.usdotNumber}</p>
      </div>
      <Stepper current={step} />

      {step === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Company information</CardTitle>
            <CardDescription>
              {lookup === "loading" && (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" /> Looking up USDOT #{data.usdotNumber} with FMCSA…
                </span>
              )}
              {lookup === "found" && (
                <span className="inline-flex items-center gap-2 text-emerald-700">
                  <CheckCircle2 className="size-4" /> We found your company on FMCSA. Please review and correct anything outdated.
                </span>
              )}
              {(lookup === "not-found" || lookup === "error") && (
                <span className="inline-flex items-center gap-2 text-amber-700">
                  <AlertTriangle className="size-4" />
                  {lookup === "not-found"
                    ? "We couldn't find this USDOT number. Please enter your company details below."
                    : "FMCSA lookup is unavailable right now. Please enter your company details below."}
                </span>
              )}
              {lookup === "idle" && "Review your company details as registered with FMCSA."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <FormField id="legalName" label="Legal business name" required error={e.legalName}>
                  <Input id="legalName" className="h-10" value={data.legalName} onChange={set("legalName")} aria-invalid={!!e.legalName} />
                </FormField>
              </div>
              <FormField id="dbaName" label="DBA name" error={e.dbaName}>
                <Input id="dbaName" className="h-10" value={data.dbaName} onChange={set("dbaName")} />
              </FormField>
              <FormField id="mcNumber" label="MC number" error={e.mcNumber}>
                <Input id="mcNumber" className="h-10" value={data.mcNumber} onChange={set("mcNumber")} />
              </FormField>
              <div className="sm:col-span-2">
                <FormField id="address" label="Street address" required error={e.address}>
                  <Input id="address" className="h-10" value={data.address} onChange={set("address")} aria-invalid={!!e.address} />
                </FormField>
              </div>
              <FormField id="city" label="City" required error={e.city}>
                <Input id="city" className="h-10" value={data.city} onChange={set("city")} aria-invalid={!!e.city} />
              </FormField>
              <div className="grid grid-cols-2 gap-4">
                <FormField id="state" label="State" required error={e.state}>
                  <select id="state" className={selectClass} value={data.state} onChange={set("state")} aria-invalid={!!e.state}>
                    <option value="">--</option>
                    {US_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </FormField>
                <FormField id="zip" label="ZIP" required error={e.zip}>
                  <Input id="zip" className="h-10" value={data.zip} onChange={set("zip")} aria-invalid={!!e.zip} />
                </FormField>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="mb-4 font-semibold">Contact &amp; registration</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField id="applicantName" label="Applicant name" required error={e.applicantName}>
                  <Input id="applicantName" className="h-10" value={data.applicantName} onChange={set("applicantName")} aria-invalid={!!e.applicantName} />
                </FormField>
                <FormField id="email" label="Email address" required error={e.email}>
                  <Input id="email" type="email" className="h-10" value={data.email} onChange={set("email")} aria-invalid={!!e.email} />
                </FormField>
                <FormField id="phone" label="Phone number" required error={e.phone}>
                  <Input id="phone" type="tel" className="h-10" placeholder="(XXX) XXX-XXXX" value={data.phone} onChange={set("phone")} aria-invalid={!!e.phone} />
                </FormField>
                <FormField id="registrationYear" label="Registration year" required error={e.registrationYear}>
                  <select
                    id="registrationYear"
                    className={selectClass}
                    value={data.registrationYear}
                    onChange={(ev) => setData((d) => ({ ...d, registrationYear: Number(ev.target.value) }))}
                  >
                    {REGISTRATION_YEARS.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </FormField>
              </div>
            </div>

            {message && <p className="text-sm text-destructive">{message}</p>}
            <div className="flex items-center justify-between">
              <Button asChild variant="ghost">
                <Link href="/"><ArrowLeft /> Start over</Link>
              </Button>
              <Button size="lg" className="h-10 px-6" onClick={submitCompany} disabled={pending || lookup === "loading"}>
                {pending && <Loader2 className="animate-spin" />} Continue <ArrowRight />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Operation details</CardTitle>
            <CardDescription>Your UCR fee depends on your entity type and the number of commercial motor vehicles you own or operate.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField id="entityType" label="Entity type" required error={e.entityType}>
                <select id="entityType" className={selectClass} value={data.entityType} onChange={set("entityType")} aria-invalid={!!e.entityType}>
                  <option value="">Select…</option>
                  {ENTITY_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </FormField>
              <FormField
                id="vehicleCount"
                label="Number of vehicles"
                required
                error={e.vehicleCount}
                hint="Count trucks and tractors (power units) used in interstate commerce."
              >
                <Input
                  id="vehicleCount"
                  type="number"
                  min={0}
                  inputMode="numeric"
                  className="h-10"
                  value={data.vehicleCount}
                  onChange={set("vehicleCount")}
                  aria-invalid={!!e.vehicleCount}
                />
              </FormField>
            </div>

            {preview && (
              <div className="rounded-lg border bg-muted/40 p-4 text-sm">
                <div className="flex justify-between">
                  <span>Fee bracket {preview.bracket.code} ({bracketLabel(preview.bracket)})</span>
                  <span>{formatUSD(preview.bracket.feeCents)}</span>
                </div>
                <div className="mt-1 flex justify-between text-muted-foreground">
                  <span>Software fee</span>
                  <span>{formatUSD(serviceFeeCents)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-semibold">
                  <span>Estimated total</span>
                  <span>{formatUSD(preview.total)}</span>
                </div>
              </div>
            )}

            <FmcsaWarnings warnings={warnings} />

            {message && <p className="text-sm text-destructive">{message}</p>}
            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={() => setStep(0)}>
                <ArrowLeft /> Back
              </Button>
              <Button size="lg" className="h-10 px-6" onClick={submitOperation} disabled={pending}>
                {pending && <Loader2 className="animate-spin" />} Review order <ArrowRight />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && preview && (
        <div className="grid gap-6 md:grid-cols-5">
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Review your information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 text-sm">
              <FmcsaWarnings warnings={warnings} />
              {fmcsa && warnings.length === 0 && (
                <p className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-800">
                  <CheckCircle2 className="size-4 shrink-0" /> Your details match your FMCSA record.
                </p>
              )}
              <ReviewBlock title="Company" onEdit={() => setStep(0)}>
                <Row label="Legal name" value={data.legalName} />
                {data.dbaName && <Row label="DBA" value={data.dbaName} />}
                <Row label="USDOT" value={data.usdotNumber} />
                {data.mcNumber && <Row label="MC" value={data.mcNumber} />}
                <Row label="Address" value={`${data.address}, ${data.city}, ${data.state} ${data.zip}`} />
              </ReviewBlock>
              <ReviewBlock title="Contact" onEdit={() => setStep(0)}>
                <Row label="Applicant" value={data.applicantName} />
                <Row label="Email" value={data.email} />
                <Row label="Phone" value={data.phone} />
              </ReviewBlock>
              <ReviewBlock title="Operation" onEdit={() => setStep(1)}>
                <Row label="Registration year" value={String(data.registrationYear)} />
                <Row label="Entity type" value={entityLabel ?? ""} />
                <Row label="Vehicles" value={data.vehicleCount} />
              </ReviewBlock>
            </CardContent>
          </Card>

          <Card className="h-fit md:col-span-2">
            <CardHeader>
              <CardTitle>Order summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>
                  {data.registrationYear} UCR fee
                  <span className="block text-xs text-muted-foreground">
                    Bracket {preview.bracket.code}: {bracketLabel(preview.bracket)}
                  </span>
                </span>
                <span>{formatUSD(preview.bracket.feeCents)}</span>
              </div>
              <div className="flex justify-between">
                <span>Software fee</span>
                <span>{formatUSD(serviceFeeCents)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-base font-semibold">
                <span>Total due</span>
                <span>{formatUSD(preview.total)}</span>
              </div>
              <Button size="lg" className="mt-2 h-11 w-full" onClick={() => router.push(`/file/${data.id}/confirm`)}>
                Continue to confirmation <ArrowRight />
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => setStep(1)}>
                <ArrowLeft /> Back
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function FmcsaWarnings({ warnings }: { warnings: FilingWarning[] }) {
  if (warnings.length === 0) return null;
  return (
    <div role="status" className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
      <p className="flex items-center gap-2 font-semibold">
        <AlertTriangle className="size-4 shrink-0" /> Please double-check against your FMCSA record
      </p>
      <ul className="mt-2 list-disc space-y-1 pl-5">
        {warnings.map((w) => (
          <li key={w.field}>{w.message}</li>
        ))}
      </ul>
      <p className="mt-2 text-xs text-amber-800">
        You can still continue. If your FMCSA record is outdated, update it with FMCSA as well.
      </p>
    </div>
  );
}

function ReviewBlock({ title, onEdit, children }: { title: string; onEdit: () => void; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-semibold">{title}</h3>
        <Button variant="ghost" size="sm" onClick={onEdit}>
          <Pencil /> Edit
        </Button>
      </div>
      <dl className="space-y-1">{children}</dl>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="col-span-2 break-words">{value}</dd>
    </div>
  );
}
