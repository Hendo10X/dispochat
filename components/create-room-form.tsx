"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export function CreateRoomForm() {
  const router = useRouter();
  const createRoom = useMutation(api.rooms.createRoom);

  const [roomName, setRoomName] = useState("");
  const [timerMinutes, setTimerMinutes] = useState(15);
  const [maxPeople, setMaxPeople] = useState(4);
  const [isCreating, setIsCreating] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsCreating(true);
    try {
      const roomId = await createRoom({
        name: roomName.trim() || undefined,
        timerMinutes,
        maxPeople,
      });
      router.push(`/room/${roomId}`);
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="room-name" className="text-sm font-medium">
          Room name
          <span className="ml-1 font-normal text-muted-foreground">(optional)</span>
        </Label>
        <Input
          id="room-name"
          placeholder="e.g. Friday standup"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          maxLength={60}
          autoComplete="off"
        />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Timer</Label>
          <span className="font-subtext text-sm text-muted-foreground">
            {timerMinutes} min
          </span>
        </div>
        <Slider
          min={5}
          max={30}
          step={1}
          value={timerMinutes}
          onValueChange={(v) => setTimerMinutes(v as number)}
        />
        <div className="flex justify-between">
          <span className="font-subtext text-xs text-muted-foreground">5 min</span>
          <span className="font-subtext text-xs text-muted-foreground">30 min</span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Max people</Label>
          <span className="font-subtext text-sm text-muted-foreground">
            {maxPeople} people
          </span>
        </div>
        <Slider
          min={3}
          max={6}
          step={1}
          value={maxPeople}
          onValueChange={(v) => setMaxPeople(v as number)}
        />
        <div className="flex justify-between">
          <span className="font-subtext text-xs text-muted-foreground">3</span>
          <span className="font-subtext text-xs text-muted-foreground">6</span>
        </div>
      </div>

      <Button type="submit" disabled={isCreating} className="w-full rounded-full">
        {isCreating ? "Creating…" : "Create room"}
      </Button>
    </form>
  );
}
