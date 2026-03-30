import Link from "next/link";
import { SiteNav, SiteFooter } from "@/components/site-nav";

export const metadata = { title: "Pricing — dispochat" };

const included = [
  "Unlimited rooms",
  "Timers from 5 to 30 minutes",
  "Up to 6 people per room",
  "Zero message storage",
  "No account required",
  "No ads, ever",
  "Works on any device",
  "Link-based access — no installs",
];

export default function PricingPage() {
  return (
    <div className="min-h-svh flex flex-col">
      <SiteNav />

      <main className="flex-1">

        {/* ── Hero ── */}
        <section className="relative overflow-hidden border-b">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.035]"
            style={{ backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)", backgroundSize: "24px 24px" }}
          />
          <div className="mx-auto max-w-3xl px-6 py-20 md:py-28">
            <p className="font-mono mb-5 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Pricing
            </p>
            <h1 className="text-4xl font-bold tracking-tight leading-[1.12] md:text-5xl">
              Free.<br />That&apos;s the pricing page.
            </h1>
            <p className="font-subtext mt-6 text-base text-muted-foreground leading-relaxed max-w-md">
              No plans. No tiers. No &quot;starts at $X/month.&quot;<br />
              dispochat is free — now and for the foreseeable future.
            </p>
          </div>
        </section>

        {/* ── Plan card ── */}
        <section className="border-b">
          <div className="mx-auto max-w-3xl px-6 py-16 md:py-20">
            <div className="rounded-2xl border p-8 md:p-10">

              {/* Price */}
              <div className="flex items-end gap-2 mb-1">
                <span className="text-5xl font-bold tracking-tight">$0</span>
                <span className="font-subtext text-sm text-muted-foreground mb-1.5">/ forever</span>
              </div>
              <p className="font-subtext text-sm text-muted-foreground mb-8">
                Everything included. Nothing held back for a &quot;Pro&quot; tier.
              </p>

              {/* Features list */}
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 mb-8">
                {included.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 font-subtext text-sm">
                    <span className="size-4 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold" style={{ backgroundColor: "#00C95020", color: "#00C950" }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                href="/create"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-85"
              >
                Create a room — it&apos;s free
                <svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M2.5 6h7m-3-3 3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Why free? ── */}
        <section className="border-b bg-muted/20">
          <div className="mx-auto max-w-3xl px-6 py-16 md:py-20">
            <p className="font-mono mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              The obvious question
            </p>
            <h2 className="text-2xl font-bold tracking-tight mb-10">
              Why is it free?
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {[
                {
                  n: "01",
                  title: "It's lightweight",
                  body: "Rooms expire in 30 minutes maximum. There's no long-term storage, no CDN bill, no growing database of messages to maintain. The infrastructure costs are genuinely low.",
                },
                {
                  n: "02",
                  title: "We believe in it",
                  body: "Ephemeral communication shouldn't be a luxury feature. The whole point falls apart if we gate it behind a paywall. Access to disappearing conversations should be table stakes.",
                },
                {
                  n: "03",
                  title: "We might add Pro later",
                  body: "Longer timers, larger rooms, custom room names — if we ever charge for anything, it'll be clearly optional extras. Everything that exists today stays free.",
                },
              ].map((item) => (
                <div key={item.n} className="flex flex-col gap-3">
                  <span className="font-mono font-semibold text-4xl text-border select-none leading-none">{item.n}</span>
                  <h3 className="text-base font-semibold tracking-tight">{item.title}</h3>
                  <p className="font-subtext text-sm text-muted-foreground leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section>
          <div className="mx-auto max-w-3xl px-6 py-20 text-center md:py-24">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              No card needed.
            </h2>
            <p className="font-subtext mt-3 text-sm text-muted-foreground">
              Seriously — just make a room.
            </p>
            <Link
              href="/create"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-85"
            >
              Get started free
              <svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M2.5 6h7m-3-3 3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
