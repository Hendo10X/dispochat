"use client";

import { useEffect, useState } from "react";

export function useUserId(): string | null {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    let id = localStorage.getItem("dispochat_user_id");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("dispochat_user_id", id);
    }
    setUserId(id);
  }, []);

  return userId;
}
