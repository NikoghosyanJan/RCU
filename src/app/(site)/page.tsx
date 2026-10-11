import Link from "next/link";
import { BadgeCheck, Clock, FileText, Headphones, Lock, Search, ShieldCheck, Truck } from "lucide-react";
import { FeeTable } from "@/components/landing/fee-table";
import { LeadForm } from "@/components/landing/lead-form";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { SERVICE_FEE_CENTS } from "@/config/fees";
import { formatUSD } from "@/lib/pricing";
import { site } from "@/lib/site";

const steps = [
  {
    icon: FileText,
    title: "Enter your details",
    text: "Give us your name, contact info and USDOT number. We pull your company record from FMCSA automatically.",
  },
  {
    icon: Search,
    title: "Review & pay securely",
    text: "Confirm your fleet size and fee bracket, then pay the official UCR fee plus our service fee in one checkout.",
  },
  {
    icon: BadgeCheck,
    title: "We file for you",
    text: "Our team submits your UCR registration and emails you a receipt and a link to track your order.",
  },
];

const benefits = [
  { icon: Clock, title: "Done in minutes", text: "A short, guided form instead of a confusing government portal." },
  { icon: ShieldCheck, title: "Accuracy check", text: "We review your fleet size and bracket before filing." },
  { icon: Truck, title: "Order tracking", text: "Follow every step of your filing with your private tracking link." },
  { icon: Headphones, title: "Real support", text: "Questions? Our team answers by phone and email." },
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
    q: "How is my UCR fee calculated?",
    a: "Your fee depends on the number of commercial motor vehicles you own or operate. Brokers and leasing companies without vehicles pay the lowest bracket fee.",
  },
  {
    q: "Are you the government?",
    a: `No. ${site.name} is a private, third-party filing service and is not affiliated with the UCR Plan or any government agency. You can file directly at ucr.gov. We charge a service fee of ${formatUSD(SERVICE_FEE_CENTS)} for preparing and submitting your filing.`,
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
              <Clock className="size-4" /> 2027 UCR registration is now open
            </p>
            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
              File Your UCR Registration Online in Minutes
            </h1>
            <p className="mt-5 max-w-xl text-lg text-primary-foreground/80">
              Stay compliant for 2026 and 2027. Enter your USDOT number and we&apos;ll handle the rest:
              company lookup, fee calculation, and filing.
            </p>
            <ul className="mt-8 grid gap-3 text-sm sm:grid-cols-2">
              {["Auto-filled from FMCSA", "Secure payment", "Email receipt & tracking", "US-based support"].map(
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
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <Card key={s.title}>
              <CardContent className="p-6">
                <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <s.icon className="size-5" />
                </div>
                <p className="mt-4 text-sm font-medium text-muted-foreground">Step {i + 1}</p>
                <h3 className="text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="fees" className="scroll-mt-20 bg-muted/40 py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-center text-3xl font-bold tracking-tight">2026 &amp; 2027 UCR Fees</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
            Official UCR fees are set by the UCR Board and FMCSA and depend on the number of commercial
            motor vehicles you own or operate. 2027 fees increased about 20% over 2026.
          </p>
          <div className="mt-8">
            <FeeTable />
          </div>
          <div className="mt-4 space-y-1 text-sm text-muted-foreground">
            <p>Brokers and leasing companies pay the bracket B1 fee regardless of fleet size.</p>
            <p>
              Our service fee: <strong className="text-foreground">{formatUSD(SERVICE_FEE_CENTS)}</strong> per filing,
              added to the official UCR fee at checkout.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-3xl font-bold tracking-tight">Why file with us</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b) => (
            <div key={b.title} className="rounded-xl border p-6">
              <b.icon className="size-6 text-primary" />
              <h3 className="mt-3 font-semibold">{b.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{b.text}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Lock className="size-4" /> Payments are processed securely by Lemon Squeezy. We never store your card details.
        </p>
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
