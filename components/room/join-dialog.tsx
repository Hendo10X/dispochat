"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface JoinDialogProps {
  roomName?: string;
  onJoin: (displayName: string) => void;
}

export function JoinDialog({ roomName, onJoin }: JoinDialogProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Please enter a name");
      return;
    }
    if (trimmed.length > 30) {
      setError("Name must be 30 characters or less");
      return;
    }
    onJoin(trimmed);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border bg-card p-6 shadow-lg">
        <div className="mb-5">
          <h2 className="text-lg font-semibold">
            {roomName ? `Join "${roomName}"` : "Join room"}
          </h2>
          <p className="font-subtext mt-1 text-sm text-muted-foreground">
            What should people call you?
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="display-name">Your name</Label>
            <Input
              id="display-name"
              autoFocus
              placeholder="e.g. Alex"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              maxLength={30}
            />
            {error && (
              <p className="font-subtext text-xs text-destructive">{error}</p>
            )}
          </div>
          <Button type="submit" className="w-full rounded-full">
            Join room
          </Button>
        </form>
      </div>
    </div>
  );
}
