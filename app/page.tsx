import Link from "next/link";
import { Timer, Users, EyeOff, UserX, Zap, Lock, Coffee, Megaphone } from "lucide-react";
import { SiteNav, SiteFooter } from "@/components/site-nav";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export const metadata = { title: "dispochat — Conversations that disappear" };

/* ─── Shared SVG icon ──────────────────────────────────────────── */
const DispoIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M5.83366 1.75H8.16699C9.40467 1.75 10.5917 2.24167 11.4668 3.11684C12.342 3.992 12.8337 5.17899 12.8337 6.41667C12.8337 7.65434 12.342 8.84133 11.4668 9.7165C10.5917 10.5917 9.40467 11.0833 8.16699 11.0833V13.125C5.25033 11.9583 1.16699 10.2083 1.16699 6.41667C1.16699 5.17899 1.65866 3.992 2.53383 3.11684C3.409 2.24167 4.59598 1.75 5.83366 1.75ZM7.00033 9.91667H8.16699C9.09525 9.91667 9.98549 9.54792 10.6419 8.89154C11.2982 8.23516 11.667 7.34492 11.667 6.41667C11.667 5.48841 11.2982 4.59817 10.6419 3.94179C9.98549 3.28542 9.09525 2.91667 8.16699 2.91667H5.83366C4.9054 2.91667 4.01516 3.28542 3.35879 3.94179C2.70241 4.59817 2.33366 5.48841 2.33366 6.41667C2.33366 8.5225 3.76983 9.89683 7.00033 11.3633V9.91667Z" fill="currentColor"/>
  </svg>
);

/* ─── Chat preview ─────────────────────────────────────────────── */
const avatars = [
  { initials: "AK", bg: "bg-blue-200 text-blue-800" },
  { initials: "JR", bg: "bg-emerald-200 text-emerald-800" },
  { initials: "MS", bg: "bg-violet-200 text-violet-800" },
];

function ChatPreview() {
  const messages = [
    { id: 1, text: "Hey, everyone here?",          self: false },
    { id: 2, text: "Yep, ready 👋",                self: true  },
    { id: 3, text: "Same, let's go",               self: false },
    { id: 4, text: "Quick — 2 min left",           self: true  },
    { id: 5, text: "See you on the other side 👻", self: false },
  ];

  return (
    <div className="relative w-full rounded-2xl border bg-card shadow-lg overflow-hidden">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <DispoIcon size={14} />
          <span className="font-mono text-xs font-medium">Friday standup</span>
        </div>
        <span className="font-mono text-xs tabular-nums text-muted-foreground">14:22</span>
      </div>
      <div className="h-0.5 bg-muted overflow-hidden">
        <div className="timer-bar h-full bg-primary" />
      </div>
      <div className="flex flex-col gap-2.5 p-5 min-h-50 justify-end">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.self ? "justify-end" : "justify-start"}`}>
            <span className={`max-w-[70%] rounded-2xl px-3.5 py-2 text-sm leading-snug ${m.self ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
              {m.text}
            </span>
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-card to-transparent" />
      <div className="flex items-center justify-between border-t px-4 py-2.5">
        <div className="flex -space-x-2">
          {avatars.map(({ initials, bg }) => (
            <div key={initials} className={`size-6 rounded-full border-2 border-card flex items-center justify-center text-[9px] font-semibold ${bg}`}>
              {initials}
            </div>
          ))}
        </div>
        <span className="font-mono text-[10px] text-muted-foreground">3 of 4 joined</span>
      </div>
    </div>
  );
}

/* ─── Page ─────────────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div className="min-h-svh flex flex-col">
      <SiteNav />

      <main className="flex-1">

        {/* ── Hero ── */}
        <section className="relative overflow-hidden border-b">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.035]"
            style={{ backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)", backgroundSize: "24px 24px" }}
          />
          <div className="mx-auto max-w-3xl px-6 py-20 md:py-28">
            <div className="flex flex-col items-center gap-6 text-center md:items-start md:text-left">
              <h1 className="text-4xl font-bold tracking-tight leading-[1.12] md:text-5xl">
                Conversations<br />that disappear.
              </h1>
              <p className="font-subtext text-base text-muted-foreground leading-relaxed max-w-md">
                Create a room, set a timer, share the link.<br />
                When time&apos;s up — the room locks, messages vanish,<br />
                and it never existed.
              </p>
              <Link href="/create" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-85">
                Create a room
                <svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M2.5 6h7m-3-3 3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
            <div className="mt-14">
              <ChatPreview />
            </div>
          </div>
        </section>

        {/* ── How it works ── */}
        <section className="border-b">
          <div className="mx-auto max-w-3xl px-6 py-16 md:py-20">
            <p className="font-mono mb-10 text-xs font-medium uppercase tracking-widest text-muted-foreground text-center md:text-left">
              How it works
            </p>
            <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
              {[
                { n: "01", title: "Create a room", body: "Give it a name (optional), pick a timer between 5 and 30 minutes, and set the max number of people — up to 6." },
                { n: "02", title: "Share the link", body: "Send the link to whoever you want in the room. No accounts, no downloads — just click and you're in." },
                { n: "03", title: "Chat & vanish",  body: "When the countdown hits zero the room locks. All messages disappear. No logs, no history, no trace." },
              ].map((step) => (
                <div key={step.n} className="flex flex-col items-center gap-3 text-center md:items-start md:text-left">
                  <span className="font-mono font-semibold text-4xl text-border select-none leading-none">{step.n}</span>
                  <h3 className="text-base font-semibold tracking-tight">{step.title}</h3>
                  <p className="font-subtext text-sm text-muted-foreground leading-relaxed">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section className="border-b bg-muted/20">
          <div className="mx-auto max-w-3xl px-6 py-14 md:py-16">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                { Icon: Timer,  label: "5–30 min timers", sub: "You set the countdown", color: "#2B7FFF" },
                { Icon: Users,  label: "Up to 6 people",  sub: "Small, focused rooms",  color: "#00C950" },
                { Icon: EyeOff, label: "Zero traces",      sub: "No logs or history",    color: "#FF6900" },
                { Icon: UserX,  label: "No account",       sub: "Link is all you need",  color: "#8038BF" },
              ].map(({ Icon, label, sub, color }) => (
                <div key={label} className="flex flex-col gap-1.5 rounded-xl border p-4 bg-background">
                  <Icon className="size-4" style={{ color }} strokeWidth={1.5} />
                  <p className="text-sm font-semibold tracking-tight">{label}</p>
                  <p className="font-subtext text-xs text-muted-foreground">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Use cases ── */}
        <section className="border-b">
          <div className="mx-auto max-w-3xl px-6 py-16 md:py-20">
            <p className="font-mono mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground text-center md:text-left">
              Built for
            </p>
            <h2 className="text-2xl font-bold tracking-tight mb-10 text-center md:text-left">
              Any conversation worth having<br className="hidden md:block" /> and forgetting.
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                {
                  Icon: Zap,
                  color: "#2B7FFF",
                  title: "Quick team standups",
                  body: "15-minute limit, everyone shows up, you talk, it's done. No transcript, no action items that nobody reads, just alignment and out.",
                },
                {
                  Icon: Lock,
                  color: "#8038BF",
                  title: "Sensitive discussions",
                  body: "Salary negotiations, performance feedback, or anything you'd rather not have living in someone's Slack forever. Say it, close it, it's gone.",
                },
                {
                  Icon: Coffee,
                  color: "#FF6900",
                  title: "Surprise planning",
                  body: "Organising a birthday party, a roast, or a secret trip with people who share a group chat with the guest of honour? Problem solved.",
                },
                {
                  Icon: Megaphone,
                  color: "#00C950",
                  title: "One-off coordination",
                  body: "Coordinating something that doesn't need a permanent channel — an event, a handoff, a one-time brief. Create, talk, done. No ghost channels left behind.",
                },
              ].map(({ Icon, color, title, body }) => (
                <div key={title} className="flex flex-col gap-3 rounded-xl border p-5">
                  <div className="flex items-center gap-2.5">
                    <Icon className="size-4 shrink-0" style={{ color }} strokeWidth={1.5} />
                    <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
                  </div>
                  <p className="font-subtext text-sm text-muted-foreground leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Why not just use X ── */}
        <section className="border-b bg-muted/20">
          <div className="mx-auto max-w-3xl px-6 py-16 md:py-20">
            <p className="font-mono mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground text-center md:text-left">
              The honest pitch
            </p>
            <h2 className="text-2xl font-bold tracking-tight mb-10 text-center md:text-left">
              Why not just use WhatsApp?
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="flex flex-col gap-4 rounded-xl border bg-background p-6">
                <p className="font-mono text-xs font-medium text-muted-foreground uppercase tracking-widest">Regular chat apps</p>
                <ul className="flex flex-col gap-2.5">
                  {[
                    "Messages stored indefinitely",
                    "Everything searchable, forever",
                    "Requires an account or phone number",
                    "Group chats never really end",
                    "Someone always screenshots",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 font-subtext text-sm text-muted-foreground">
                      <span className="mt-0.5 text-destructive shrink-0">✕</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col gap-4 rounded-xl border bg-background p-6">
                <p className="font-mono text-xs font-medium uppercase tracking-widest" style={{ color: "#00C950" }}>dispochat</p>
                <ul className="flex flex-col gap-2.5">
                  {[
                    "Messages deleted when the room closes",
                    "No history, no logs, no trace",
                    "No account needed, ever",
                    "Rooms expire — on your schedule",
                    "Nothing to screenshot that matters",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 font-subtext text-sm">
                      <span className="mt-0.5 shrink-0" style={{ color: "#00C950" }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="border-b">
          <div className="mx-auto max-w-3xl px-6 py-16 md:py-20">
            <p className="font-mono mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground text-center md:text-left">
              FAQ
            </p>
            <h2 className="text-2xl font-bold tracking-tight mb-10 text-center md:text-left">
              Things people ask.
            </h2>
            <Accordion multiple>
              {[
                { q: "Do you store my messages?",               a: "No. Messages live only for the duration of the room. Once the timer expires and the room closes, everything is permanently deleted — no archive, no backup, no secret copy we forgot to mention." },
                { q: "What happens when the timer hits zero?",  a: "The room locks immediately. No new messages can be sent. The conversation is then deleted. It's over. Clean slate." },
                { q: "Can I extend the timer once it's live?",  a: "No. The timer you set is the timer you get. This is very much on purpose — it keeps conversations focused and removes the temptation to keep pushing the deadline." },
                { q: "Do I need an account?",                   a: "No account, no sign-up, no email, no password to forget. You create a room, you get a link, you share it. That's the entire onboarding." },
                { q: "How many people can join a room?",        a: "You set the limit when you create it — anywhere from 3 to 6 people. Once the room is full, the link stops working for anyone else." },
                { q: "Can someone join without the link?",      a: "Not unless they have the link. Room IDs aren't guessable and there's no public directory of open rooms. Share the link only with who you mean to." },
                { q: "Can I rejoin a room after it expires?",   a: "No. Once a room closes it's gone for good. If you need to keep talking, create a new room. That's kind of the whole point." },
                { q: "Is dispochat free?",                      a: "Yes, completely free. No trial period, no credit card, no freemium bait-and-switch. Create rooms, use all the features, pay nothing." },
              ].map(({ q, a }) => (
                <AccordionItem key={q} value={q}>
                  <AccordionTrigger className="px-5 py-5 text-sm font-semibold tracking-tight hover:no-underline">
                    {q}
                  </AccordionTrigger>
                  <AccordionContent className="px-5">
                    <p className="font-subtext text-sm text-muted-foreground leading-relaxed">
                      {a}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <p className="font-subtext mt-6 text-xs text-muted-foreground text-center md:text-left">
              More questions?{" "}
              <Link href="/faq" className="underline underline-offset-2 hover:text-foreground transition-colors">
                Read the full FAQ →
              </Link>
            </p>
          </div>
        </section>

        {/* ── Bottom CTA ── */}
        <section>
          <div className="mx-auto max-w-3xl px-6 py-20 text-center md:py-24">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Ready to disappear?
            </h2>
            <p className="font-subtext mt-3 text-sm text-muted-foreground">
              Start a room in seconds. No strings attached.
            </p>
            <Link href="/create" className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-85">
              <DispoIcon size={15} />
              Create a room
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
