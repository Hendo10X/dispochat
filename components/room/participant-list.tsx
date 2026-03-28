"use client";

import { Doc } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";

interface ParticipantListProps {
  presenceRecords: Doc<"presence">[];
  currentUserId: string;
  maxPeople: number;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const AVATAR_COLORS = [
  "bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300",
  "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300",
  "bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300",
];

function colorForUser(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash * 31 + userId.charCodeAt(i)) >>> 0;
  }
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

export function ParticipantList({
  presenceRecords,
  currentUserId,
  maxPeople,
}: ParticipantListProps) {
  const STALE_THRESHOLD = 15_000;
  const active = presenceRecords.filter(
    (p) => p.lastSeen > Date.now() - STALE_THRESHOLD
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          People
        </span>
        <span className="font-subtext text-xs text-muted-foreground">
          {active.length}/{maxPeople}
        </span>
      </div>

      {/* capacity bar */}
      <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${(active.length / maxPeople) * 100}%` }}
        />
      </div>

      <ul className="flex flex-col gap-2">
        {active.map((p) => (
          <li key={p._id} className="flex items-center gap-2">
            <span
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                colorForUser(p.userId)
              )}
            >
              {getInitials(p.displayName)}
            </span>
            <span className="font-subtext truncate text-sm">
              {p.displayName}
              {p.userId === currentUserId && (
                <span className="ml-1 text-xs text-muted-foreground">(you)</span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
