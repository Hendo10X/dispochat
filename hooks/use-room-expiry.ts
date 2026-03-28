"use client";

import { useEffect, useState } from "react";

export function useRoomExpiry(expiresAt: number | undefined): {
  timeRemainingMs: number;
  isExpired: boolean;
} {
  const [timeRemainingMs, setTimeRemainingMs] = useState<number>(
    expiresAt ? Math.max(0, expiresAt - Date.now()) : 0
  );

  useEffect(() => {
    if (!expiresAt) return;

    const tick = () => {
      const remaining = Math.max(0, expiresAt - Date.now());
      setTimeRemainingMs(remaining);
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  return {
    timeRemainingMs,
    isExpired: expiresAt !== undefined && Date.now() >= expiresAt,
  };
}
