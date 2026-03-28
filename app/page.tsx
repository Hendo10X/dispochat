import Link from "next/link";
import { Timer, Users, EyeOff, UserX } from "lucide-react";

export const metadata = { title: "dispochat — Conversations that disappear" };

/* ─── Shared SVG icon ──────────────────────────────────────────── */
const DispoIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M5.83366 1.75H8.16699C9.40467 1.75 10.5917 2.24167 11.4668 3.11684C12.342 3.992 12.8337 5.17899 12.8337 6.41667C12.8337 7.65434 12.342 8.84133 11.4668 9.7165C10.5917 10.5917 9.40467 11.0833 8.16699 11.0833V13.125C5.25033 11.9583 1.16699 10.2083 1.16699 6.41667C1.16699 5.17899 1.65866 3.992 2.53383 3.11684C3.409 2.24167 4.59598 1.75 5.83366 1.75ZM7.00033 9.91667H8.16699C9.09525 9.91667 9.98549 9.54792 10.6419 8.89154C11.2982 8.23516 11.667 7.34492 11.667 6.41667C11.667 5.48841 11.2982 4.59817 10.6419 3.94179C9.98549 3.28542 9.09525 2.91667 8.16699 2.91667H5.83366C4.9054 2.91667 4.01516 3.28542 3.35879 3.94179C2.70241 4.59817 2.33366 5.48841 2.33366 6.41667C2.33366 8.5225 3.76983 9.89683 7.00033 11.3633V9.91667Z" fill="currentColor"/>
  </svg>
);

/* ─── Chat preview ─────────────────────────────────────────────── */
function ChatPreview() {
  const messages = [
    { id: 1, text: "Hey, everyone here?",          self: false },
    { id: 2, text: "Yep, ready 👋",                self: true  },
    { id: 3, text: "Same, let's go",               self: false },
    { id: 4, text: "Quick — 2 min left",           self: true  },
    { id: 5, text: "See you on the other side 👻", self: false },
  ];

  return (
    <div className="relative w-full max-w-[300px] rounded-2xl border bg-card shadow-lg overflow-hidden">
      {/* Window chrome */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <DispoIcon size={14} />
          <span className="text-xs font-medium">Friday standup</span>
        </div>
        <span className="font-subtext text-xs tabular-nums text-muted-foreground">14:22</span>
      </div>

      {/* Timer bar */}
      <div className="h-0.5 bg-muted overflow-hidden">
        <div className="timer-bar h-full bg-primary" />
      </div>

      {/* Messages */}
      <div className="flex flex-col gap-2 p-4 min-h-[200px] justify-end">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.self ? "justify-end" : "justify-start"}`}>
            <span
              className={`max-w-[75%] rounded-2xl px-3 py-1.5 text-xs leading-relaxed ${
                m.self
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground"
              }`}
            >
              {m.text}
            </span>
          </div>
        ))}
      </div>

      {/* Dissolve gradient */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-card to-transparent" />

      {/* Participants badge */}
      <div className="flex items-center justify-between border-t px-4 py-2.5">
        <div className="flex -space-x-1.5">
          {["bg-blue-400", "bg-emerald-400", "bg-violet-400"].map((c, i) => (
            <div key={i} className={`size-5 rounded-full border-2 border-card ${c}`} />
          ))}
        </div>
        <span className="font-subtext text-[10px] text-muted-foreground">3 of 4 joined</span>
      </div>
    </div>
  );
}

/* ─── Page ─────────────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div className="min-h-svh flex flex-col">

      {/* ── Nav ── */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3.5">
          <Link href="/" className="inline-flex items-center gap-2 font-semibold tracking-tight hover:opacity-80 transition-opacity">
            <DispoIcon size={18} />
            <span>dispochat</span>
          </Link>
          <Link
            href="/create"
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-85"
          >
            Create a room
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2.5 6h7m-3-3 3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </nav>
      </header>

      <main className="flex-1">

        {/* ── Hero ── */}
        <section className="relative overflow-hidden border-b">
          {/* Dot grid */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-12 px-6 py-20 md:grid-cols-2 md:items-center md:py-28">
            {/* Copy */}
            <div className="flex flex-col items-center gap-6 text-center md:items-start md:text-left">
              <h1 className="text-4xl font-semibold tracking-tight leading-[1.15] md:text-5xl">
                Conversations<br />that disappear.
              </h1>

              <p className="font-subtext text-base text-muted-foreground leading-relaxed max-w-sm">
                Create a room, set a timer, share the link.
                When time's up — the room locks, messages vanish, and it never existed.
              </p>

              <div className="flex items-center justify-center gap-3 md:justify-start">
                <Link
                  href="/create"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-85"
                >
                  Create a room
                  <svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M2.5 6h7m-3-3 3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </div>
            </div>

            {/* Visual */}
            <div className="flex justify-center md:justify-end">
              <ChatPreview />
            </div>
          </div>
        </section>

        {/* ── How it works ── */}
        <section className="border-b">
          <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
            <p className="font-subtext mb-10 text-xs font-medium uppercase tracking-widest text-muted-foreground text-center md:text-left">
              How it works
            </p>
            <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
              {[
                {
                  n: "01",
                  title: "Create a room",
                  body: "Give it a name (optional), pick a timer between 5 and 30 minutes, and set the max number of people — up to 6.",
                },
                {
                  n: "02",
                  title: "Share the link",
                  body: "Send the link to whoever you want in the room. No accounts, no downloads — just click and you're in.",
                },
                {
                  n: "03",
                  title: "Chat & vanish",
                  body: "When the countdown hits zero the room locks. All messages disappear. No logs, no history, no trace.",
                },
              ].map((step) => (
                <div key={step.n} className="flex flex-col items-center gap-3 text-center md:items-start md:text-left">
                  <span className="font-semibold text-4xl text-border select-none leading-none">
                    {step.n}
                  </span>
                  <h3 className="text-base font-semibold tracking-tight">{step.title}</h3>
                  <p className="font-subtext text-sm text-muted-foreground leading-relaxed">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section className="border-b">
          <div className="mx-auto max-w-5xl px-6 py-14 md:py-16">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                { Icon: Timer,  label: "5–30 min timers", sub: "You set the countdown" },
                { Icon: Users,  label: "Up to 6 people",  sub: "Small, focused rooms"  },
                { Icon: EyeOff, label: "Zero traces",      sub: "No logs or history"    },
                { Icon: UserX,  label: "No account",       sub: "Link is all you need"  },
              ].map(({ Icon, label, sub }) => (
                <div
                  key={label}
                  className="flex flex-col gap-1.5 rounded-xl border p-4"
                >
                  <Icon className="size-4 text-muted-foreground" strokeWidth={1.5} />
                  <p className="text-sm font-medium tracking-tight">{label}</p>
                  <p className="font-subtext text-xs text-muted-foreground">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Bottom CTA ── */}
        <section>
          <div className="mx-auto max-w-5xl px-6 py-20 text-center md:py-24">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Ready to disappear?
            </h2>
            <p className="font-subtext mt-3 text-sm text-muted-foreground">
              Start a room in seconds. No strings attached.
            </p>
            <Link
              href="/create"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-85"
            >
              <DispoIcon size={15} />
              Create a room
            </Link>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
            <DispoIcon size={13} />
            dispochat
          </Link>
          <p className="font-subtext text-xs text-muted-foreground">
            Here today, gone tomorrow.
          </p>
        </div>
      </footer>

    </div>
  );
}
