"use client";

import { useRoomExpiry } from "@/hooks/use-room-expiry";
import { cn } from "@/lib/utils";

interface RoomTimerProps {
  expiresAt: number;
}

export function RoomTimer({ expiresAt }: RoomTimerProps) {
  const { timeRemainingMs, isExpired } = useRoomExpiry(expiresAt);

  if (isExpired) {
    return (
      <span className="font-subtext text-sm font-medium text-destructive">
        Expired
      </span>
    );
  }

  const totalSeconds = Math.floor(timeRemainingMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const formatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const isUrgent = timeRemainingMs < 60_000;
  const isWarning = timeRemainingMs < 5 * 60_000;

  return (
    <span
      className={cn(
        "font-subtext text-sm font-medium tabular-nums",
        isUrgent
          ? "text-destructive"
          : isWarning
            ? "text-yellow-500 dark:text-yellow-400"
            : "text-muted-foreground"
      )}
    >
      {isUrgent && (
        <span className="mr-1 inline-block h-2 w-2 animate-pulse rounded-full bg-destructive" />
      )}
      {formatted}
    </span>
  );
}
