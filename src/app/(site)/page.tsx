import Link from "next/link";
import {
  BadgeCheck,
  BellRing,
  Building2,
  Clock,
  Cpu,
  Mail,
  MousePointerClick,
  ScanSearch,
  Send,
  ShieldAlert,
  ShieldCheck,
  Lock,
  Truck,
  Zap,
} from "lucide-react";
import { FeeTable } from "@/components/landing/fee-table";
import { LeadForm } from "@/components/landing/lead-form";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { DEFAULT_REGISTRATION_YEAR, SERVICE_FEE_CENTS } from "@/config/fees";
import { formatUSD } from "@/lib/pricing";
import { site } from "@/lib/site";

const year = DEFAULT_REGISTRATION_YEAR;

const steps = [
  {
    icon: MousePointerClick,
    title: "Enter your USDOT number",
    text: "The software retrieves your public FMCSA record.",
  },
  {
    icon: ScanSearch,
    title: "Auto-fill & validation",
    text: "Your registration is pre-filled and your company details, fleet size and classification are checked. Mismatches are flagged before you pay.",
  },
  {
    icon: BadgeCheck,
    title: "Review & authorize",
    text: "Check the details, see your price broken down, and authorize the filing in one secure checkout.",
  },
  {
    icon: Send,
    title: "Filed & confirmed",
    text: "Your registration is submitted to the UCR system on your behalf and the confirmation is emailed to you.",
  },
  {
    icon: BellRing,
    title: "Yearly reminder",
    text: "Each year, we remind you when UCR renewal opens.",
  },
];

const benefits = [
  { icon: Zap, title: "Auto-filled from FMCSA", text: "Your company record is pulled automatically from the public FMCSA database." },
  { icon: ShieldCheck, title: "Validated before you pay", text: "Fleet size, classification and company details are checked against your FMCSA record." },
  { icon: Cpu, title: "Exact fee, calculated", text: "Your UCR bracket and fee are computed from your fleet size and entity type." },
  { icon: Truck, title: "Live order tracking", text: "Follow every step of your filing with your private tracking link." },
  { icon: Mail, title: "Confirmation by email", text: "Receipt, status updates and your UCR confirmation go straight to your inbox." },
  { icon: BellRing, title: "Renewal reminders", text: "Never miss a deadline: we email you when next year's registration opens." },
];

const faqs = [
  {
    q: "What is UCR?",
    a: "The Unified Carrier Registration (UCR) Agreement requires interstate motor carriers, brokers, freight forwarders and leasing companies to register annually and pay a fee based on fleet size.",
  },
  {
    q: "Who needs to file UCR?",
    a: "Any company operating commercial motor vehicles in interstate or international commerce, including for-hire and private carriers, as well as brokers, freight forwarders and leasing companies.",
  },
  {
    q: "When is the UCR deadline?",
    a: "Registration for the next year opens October 1. Fees must be paid before January 1 of the registration year; after that, unregistered companies may face state enforcement and fines.",
  },
  {
    q: "What does the software check?",
    a: "After you enter your USDOT number, the software compares what you submit with your public FMCSA record: fleet size (and whether it changes your fee bracket), legal name, state, and whether the company is authorized to operate. Any mismatch is flagged before you pay so you can correct it.",
  },
  {
    q: "How is my UCR fee calculated?",
    a: "Your fee depends on the number of commercial motor vehicles you own or operate. Brokers and leasing companies without vehicles pay the lowest bracket fee. The software calculates it for you.",
  },
  {
    q: "Are you the government?",
    a: `No. ${site.name} is a private company and is not affiliated with the UCR Plan, FMCSA, or any government agency. You can register directly at ucr.gov. We charge a software fee of ${formatUSD(SERVICE_FEE_CENTS)} for preparing, validating and submitting your filing.`,
  },
  {
    q: "What if you can't complete my filing?",
    a: "If we can't complete your filing, you receive a full refund of everything you paid, including the UCR fee and our software fee. See our Refund Policy for details.",
  },
  {
    q: "Will you remind me next year?",
    a: "Yes. If you keep the reminder option checked at checkout, we email you when the next UCR registration year opens. You can opt out at any time.",
  },
  {
    q: "How do I track my order?",
    a: "After payment, we email you a receipt with a direct tracking link. You can also enter your order number and email on the Track Order page.",
  },
];

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-primary to-[oklch(0.3_0.12_260)] text-primary-foreground">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 lg:grid-cols-2 lg:py-20">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm">
              <Clock className="size-4" /> {year} UCR registration is now open
            </p>
            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">Automated UCR Filing Software</h1>
            <p className="mt-5 max-w-xl text-lg text-primary-foreground/80">
              Enter your USDOT number. Our software pulls your FMCSA record, pre-fills and validates your registration,
              and files it on your behalf. Your confirmation arrives by email.
            </p>
            <ul className="mt-8 grid gap-3 text-sm sm:grid-cols-2">
              {["Auto-filled from FMCSA", "Validated before you pay", "Fee calculated automatically", "Confirmation by email"].map(
                (t) => (
                  <li key={t} className="flex items-center gap-2">
                    <BadgeCheck className="size-5 shrink-0" /> {t}
                  </li>
                ),
              )}
            </ul>
          </div>
          <Card className="text-card-foreground shadow-2xl">
            <CardContent className="p-6 sm:p-8">
              <h2 className="text-xl font-semibold">Start your UCR filing</h2>
              <p className="mb-5 mt-1 text-sm text-muted-foreground">All fields are required.</p>
              <LeadForm />
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16">
        <h2 className="text-center text-3xl font-bold tracking-tight">How it works</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
          {site.name} is software that prepares and files your annual Unified Carrier Registration online.
        </p>
        <ol className="mt-10 grid gap-4 md:grid-cols-5">
          {steps.map((s, i) => (
            <li key={s.title}>
              <Card className="h-full">
                <CardContent className="p-5">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <s.icon className="size-5" />
                  </div>
                  <p className="mt-4 text-sm font-medium text-muted-foreground">Step {i + 1}</p>
                  <h3 className="font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
                </CardContent>
              </Card>
            </li>
          ))}
        </ol>
      </section>

      <section id="fees" className="scroll-mt-20 bg-muted/40 py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-center text-3xl font-bold tracking-tight">What you pay</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
            Your price has two parts, shown separately at checkout.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border bg-card p-6">
              <Building2 className="size-6 text-primary" />
              <h3 className="mt-3 font-semibold">UCR government fee</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Set by the UCR Plan based on your fleet size. Paid to the UCR Plan when your registration is filed.
              </p>
            </div>
            <div className="rounded-xl border bg-card p-6">
              <Cpu className="size-6 text-primary" />
              <h3 className="mt-3 font-semibold">
                Our software fee: <span className="text-primary">{formatUSD(SERVICE_FEE_CENTS)}</span>
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Flat fee per filing for auto-fill, validation, submission, tracking and renewal reminders.
              </p>
            </div>
          </div>
          <h3 className="mt-10 text-center text-xl font-semibold">Official UCR fees by fleet size</h3>
          <div className="mt-4">
            <FeeTable />
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Brokers and leasing companies pay the bracket B1 fee regardless of fleet size.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-3xl font-bold tracking-tight">Why use {site.name}</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b) => (
            <div key={b.title} className="rounded-xl border p-6">
              <b.icon className="size-6 text-primary" />
              <h3 className="mt-3 font-semibold">{b.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{b.text}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 flex items-center justify-center gap-2 text-center text-sm text-muted-foreground">
          <Lock className="size-4 shrink-0" /> Payments are processed securely by Lemon Squeezy. We never store your card
          details.
        </p>
      </section>

      <section id="important" className="scroll-mt-20 px-4 pb-16">
        <div className="mx-auto max-w-3xl rounded-xl border-2 border-primary/20 bg-card p-6 sm:p-8">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <ShieldAlert className="size-5 text-primary" /> Important
          </h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            <li>
              {site.name} is a private company. We are not affiliated with the UCR Plan, FMCSA, or any government
              agency.
            </li>
            <li>
              You can register directly at{" "}
              <a href="https://www.ucr.gov" target="_blank" rel="noopener noreferrer" className="text-primary underline">
                ucr.gov
              </a>
              . This product is for businesses that prefer an automated, validated online process.
            </li>
            <li>By purchasing, you authorize {site.name} to submit your registration on your behalf.</li>
            <li>
              Refund policy: if we can&apos;t complete your filing, you receive a full refund.{" "}
              <Link href="/refund" className="text-primary underline">Read the full policy</Link>.
            </li>
            <li>
              Support:{" "}
              <a href={`mailto:${site.supportEmail}`} className="text-primary underline">{site.supportEmail}</a>
            </li>
          </ul>
        </div>
      </section>

      <section id="faq" className="scroll-mt-20 bg-muted/40 py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-center text-3xl font-bold tracking-tight">Frequently asked questions</h2>
          <Accordion type="single" collapsible className="mt-8 rounded-xl border bg-card px-5">
            {faqs.map((f) => (
              <AccordionItem key={f.q} value={f.q}>
                <AccordionTrigger className="text-base">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Already ordered? <Link href="/track" className="font-medium text-primary underline">Track your order</Link>
          </p>
        </div>
      </section>
    </>
  );
}
