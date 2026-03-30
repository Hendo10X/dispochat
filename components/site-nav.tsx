"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const DispoIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M5.83366 1.75H8.16699C9.40467 1.75 10.5917 2.24167 11.4668 3.11684C12.342 3.992 12.8337 5.17899 12.8337 6.41667C12.8337 7.65434 12.342 8.84133 11.4668 9.7165C10.5917 10.5917 9.40467 11.0833 8.16699 11.0833V13.125C5.25033 11.9583 1.16699 10.2083 1.16699 6.41667C1.16699 5.17899 1.65866 3.992 2.53383 3.11684C3.409 2.24167 4.59598 1.75 5.83366 1.75ZM7.00033 9.91667H8.16699C9.09525 9.91667 9.98549 9.54792 10.6419 8.89154C11.2982 8.23516 11.667 7.34492 11.667 6.41667C11.667 5.48841 11.2982 4.59817 10.6419 3.94179C9.98549 3.28542 9.09525 2.91667 8.16699 2.91667H5.83366C4.9054 2.91667 4.01516 3.28542 3.35879 3.94179C2.70241 4.59817 2.33366 5.48841 2.33366 6.41667C2.33366 8.5225 3.76983 9.89683 7.00033 11.3633V9.91667Z" fill="currentColor"/>
  </svg>
);

const navLinks = [
  { label: "About us", href: "/about" },
  { label: "Pricing",  href: "/pricing" },
];

export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close menu on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  // Close on outside click / scroll
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener("scroll", close, { passive: true });
    return () => window.removeEventListener("scroll", close);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      {/* ── Main bar ── */}
      <nav className="mx-auto flex max-w-3xl items-center justify-between px-6 py-3.5">
        {/* Logo */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono font-medium tracking-tight hover:opacity-80 transition-opacity"
        >
          <DispoIcon size={16} />
          <span className="text-sm">dispochat</span>
        </Link>

        {/* Desktop links + CTA */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="rounded-full px-3 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              {label}
            </Link>
          ))}
          <Link
            href="/create"
            className="ml-1 inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 font-mono text-xs font-medium text-primary-foreground transition-opacity hover:opacity-85"
          >
            Create a room
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2.5 6h7m-3-3 3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>

        {/* Mobile chevron toggle */}
        <button
          className="md:hidden flex items-center justify-center rounded-full border px-3 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground gap-1.5"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          Menu
          <ChevronDown
            size={13}
            className={`transition-transform duration-300 ${open ? "rotate-180" : "rotate-0"}`}
          />
        </button>
      </nav>

      {/* ── Mobile dropdown — slides from top ── */}
      <div
        className={`md:hidden overflow-hidden border-b bg-background/95 backdrop-blur-md transition-all duration-300 ease-in-out ${
          open ? "max-h-72 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="mx-auto max-w-3xl flex flex-col px-6 py-4 gap-1">
          {navLinks.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="rounded-lg px-3 py-2.5 font-mono text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {label}
            </Link>
          ))}

          {/* Divider */}
          <div className="my-1 border-t" />

          <Link
            href="/create"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 font-mono text-sm font-medium text-primary-foreground transition-opacity hover:opacity-85"
          >
            Create a room
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2.5 6h7m-3-3 3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-2 px-6 py-5 text-center sm:flex-row sm:justify-between sm:text-left">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <DispoIcon size={12} />
          dispochat
        </Link>
        <p className="font-mono text-xs text-muted-foreground">
          Here today, gone tomorrow.
        </p>
      </div>
    </footer>
  );
}
