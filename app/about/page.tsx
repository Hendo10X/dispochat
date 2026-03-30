import Link from "next/link";
import { SiteNav, SiteFooter } from "@/components/site-nav";

export const metadata = { title: "About — dispochat" };

const sections = [
  {
    label: "01",
    title: "What even is this?",
    body: [
      "dispochat is a chat app that forgets everything. On purpose.",
      "You create a room, you set a timer, you share a link. People show up. Everyone talks. The timer runs out. The room closes. The messages disappear. Nobody learns anything about your cloud architecture opinions.",
      "It's like a group chat, but one that keeps its promises.",
    ],
  },
  {
    label: "02",
    title: "Why did we build it?",
    body: [
      "Because every group chat we've ever been in still exists somewhere, haunted by a 2019 meme and someone's unsolicited hot take about pineapple on pizza.",
      "Some conversations are meant to be fleeting. A quick standup. A surprise party plan. A very heated debate about which fast food chain has the best fries (it's obvious, we won't say it here).",
      "dispochat gives those moments their own space — one that doesn't overstay its welcome.",
    ],
  },
  {
    label: "03",
    title: "How does the disappearing work?",
    body: [
      "Magic. Just kidding — it's Convex.",
      "When your timer hits zero, the room locks. No new messages. No replays. The conversation just... stops being accessible. We don't store a secret archive. There's no \"deleted but recoverable\" situation. It's gone in the same way your dignity is gone after karaoke night.",
      "We built it this way because privacy shouldn't be a premium feature.",
    ],
  },
  {
    label: "04",
    title: "Who's behind this?",
    body: [
      "Just people who've had one too many group chats they wish they could unsend.",
      "We like building small, focused tools that do one thing well. dispochat does one thing: it talks, then it forgets. Like a very agreeable goldfish, but with better UX.",
      "No VC funding. No roadmap with 47 tabs. No \"we're pivoting to AI\" announcement coming. Just a disposable chat app, built with care.",
    ],
  },
];

export default function AboutPage() {
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
              About us
            </p>
            <h1 className="text-4xl font-bold tracking-tight leading-[1.12] md:text-5xl">
              We made a chat app<br />that self-destructs.
            </h1>
            <p className="font-subtext mt-6 text-base text-muted-foreground leading-relaxed max-w-md">
              Completely on purpose. Not a bug. We promise.
            </p>
          </div>
        </section>

        {/* ── Sections ── */}
        {sections.map((s, i) => (
          <section key={s.label} className={`border-b ${i % 2 !== 0 ? "bg-muted/20" : ""}`}>
            <div className="mx-auto max-w-3xl px-6 py-14 md:py-16">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-[120px_1fr] md:gap-12">
                <span className="font-mono font-semibold text-4xl text-border select-none leading-none">
                  {s.label}
                </span>
                <div className="flex flex-col gap-4">
                  <h2 className="text-xl font-bold tracking-tight">{s.title}</h2>
                  {s.body.map((para, j) => (
                    <p key={j} className="font-subtext text-sm text-muted-foreground leading-relaxed">
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ))}

        {/* ── CTA ── */}
        <section>
          <div className="mx-auto max-w-3xl px-6 py-20 text-center md:py-24">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Okay, you&apos;re convinced.
            </h2>
            <p className="font-subtext mt-3 text-sm text-muted-foreground">
              Go make a room. Tell someone something. Watch it vanish.
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
