import Link from "next/link";
import { SiteNav, SiteFooter } from "@/components/site-nav";

export const metadata = { title: "FAQ — dispochat" };

const faqs = [
  {
    category: "Privacy & data",
    color: "#2B7FFF",
    questions: [
      {
        q: "Do you store my messages?",
        a: "No. Messages live only for the duration of the room. Once the timer expires and the room closes, everything in it is permanently deleted — no archive, no backup, no secret copy we forgot to mention.",
      },
      {
        q: "Can dispochat staff read my conversations?",
        a: "No. We don't retain messages after a room expires, and we have no interest in reading your conversations. We're busy enough building the thing.",
      },
      {
        q: "Is there a message log anywhere?",
        a: "Nope. No logs, no history, no exported CSV sitting on someone's laptop. When the room goes, the messages go with it.",
      },
    ],
  },
  {
    category: "Rooms & timers",
    color: "#00C950",
    questions: [
      {
        q: "How long can a room last?",
        a: "Between 5 and 30 minutes — you pick when you create it. That's the window. Make it count.",
      },
      {
        q: "Can I extend the timer once the room is live?",
        a: "No. The timer you set is the timer you get. This is very much on purpose — it keeps conversations focused and removes the temptation to just keep pushing the deadline.",
      },
      {
        q: "What happens when the timer hits zero?",
        a: "The room locks immediately. No new messages can be sent. Anyone still in the room sees it close. The messages are then deleted. It's over. Go touch grass.",
      },
      {
        q: "Can I reopen an expired room?",
        a: "No. Once a room closes it's gone for good. If you need to keep talking, create a new room. That's kind of the whole point.",
      },
    ],
  },
  {
    category: "People & access",
    color: "#FF6900",
    questions: [
      {
        q: "Do I need an account to use dispochat?",
        a: "No account, no sign-up, no email, no password to forget. You create a room, you get a link, you share it. That's the entire onboarding.",
      },
      {
        q: "How many people can join a room?",
        a: "You set the limit when you create the room — anywhere from 3 to 6 people. Once the room is full, the link stops working for anyone else trying to join.",
      },
      {
        q: "Can someone join a room without the link?",
        a: "Not unless they have the link. Room IDs aren't guessable, and there's no public directory of open rooms. Share the link only with who you mean to.",
      },
      {
        q: "Can I kick someone from a room?",
        a: "Not currently. Think carefully about who you share that link with. Choose wisely.",
      },
    ],
  },
  {
    category: "Technical",
    color: "#8038BF",
    questions: [
      {
        q: "Does dispochat work on mobile?",
        a: "Yes — it runs in any modern browser on any device. No app download required.",
      },
      {
        q: "Do I need to install anything?",
        a: "Nothing. Open the link, you're in. We're big fans of things that just work.",
      },
      {
        q: "What if I lose the room link?",
        a: "You won't be able to rejoin. We don't have a \"resend link\" feature — there's no account attached to recover it from. Send the link to yourself before sharing it if you're worried.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <div className="min-h-svh flex flex-col">
      <SiteNav />

      <main className="flex-1">

        {/* ── Hero ── */}
        <section className="relative overflow-hidden border-b">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="mx-auto max-w-3xl px-6 py-20 md:py-28">
            <p className="font-mono mb-5 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              FAQ
            </p>
            <h1 className="text-4xl font-bold tracking-tight leading-[1.12] md:text-5xl">
              Questions you&apos;d ask<br />if you had time.
            </h1>
            <p className="font-subtext mt-6 text-base text-muted-foreground leading-relaxed max-w-md">
              You don&apos;t have time. The room is already ticking.<br />
              We&apos;ll keep these short.
            </p>
          </div>
        </section>

        {/* ── FAQ groups ── */}
        {faqs.map((group, gi) => (
          <section key={group.category} className={`border-b ${gi % 2 !== 0 ? "bg-muted/20" : ""}`}>
            <div className="mx-auto max-w-3xl px-6 py-14 md:py-16">
              {/* Category label */}
              <div className="flex items-center gap-2.5 mb-10">
                <span className="size-2 rounded-full" style={{ backgroundColor: group.color }} />
                <p className="font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  {group.category}
                </p>
              </div>

              {/* Questions */}
              <div className="flex flex-col divide-y">
                {group.questions.map(({ q, a }) => (
                  <div key={q} className="grid grid-cols-1 gap-2 py-6 md:grid-cols-2 md:gap-12">
                    <h3 className="text-sm font-semibold tracking-tight leading-snug">{q}</h3>
                    <p className="font-subtext text-sm text-muted-foreground leading-relaxed">{a}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* ── CTA ── */}
        <section>
          <div className="mx-auto max-w-3xl px-6 py-20 text-center md:py-24">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Still have questions?
            </h2>
            <p className="font-subtext mt-3 text-sm text-muted-foreground">
              Too bad — the room expired. Just try it, it takes 30 seconds.
            </p>
            <Link
              href="/create"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-85"
            >
              Create a room
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
