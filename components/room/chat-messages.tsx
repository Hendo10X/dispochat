"use client";

import { useEffect, useRef } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { ChatAnimationOverlay } from "./chat-animation-overlay";
import { useMessageAnimation } from "@/hooks/use-message-animation";

interface ChatMessagesProps {
  roomId: Id<"rooms">;
  currentUserId: string;
}

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ChatMessages({ roomId, currentUserId }: ChatMessagesProps) {
  const messages = useQuery(api.messages.getMessages, { roomId });
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { animationType, animationKey, clearAnimation } = useMessageAnimation(messages);

  useEffect(() => {
    if (!messages?.length) return;
    const el = containerRef.current;
    if (!el) return;
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    if (isNearBottom) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages?.length]);

  if (messages === undefined) {
    return (
      <div className="flex flex-1 flex-col gap-3 p-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              "h-10 w-3/5 animate-pulse rounded-2xl bg-muted",
              i === 2 && "self-end"
            )}
          />
        ))}
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-6 text-center">
        <p className="font-subtext text-sm text-muted-foreground">
          No messages yet. Say something!
        </p>
      </div>
    );
  }

  return (
    <>
      <ChatAnimationOverlay
        key={animationKey}
        type={animationType}
        onComplete={clearAnimation}
      />
    <div
      ref={containerRef}
      className="flex flex-1 flex-col gap-1 overflow-y-auto p-4"
    >
      {messages.map((msg, i) => {
        const isOwn = msg.authorId === currentUserId;
        const prevMsg = messages[i - 1];
        const showName = !isOwn && prevMsg?.authorId !== msg.authorId;

        return (
          <div
            key={msg._id}
            className={cn("flex flex-col", isOwn ? "items-end" : "items-start")}
          >
            {showName && (
              <span className="font-subtext mb-0.5 ml-1 text-xs text-muted-foreground">
                {msg.authorName}
              </span>
            )}
            <div
              className={cn(
                "max-w-[75%] rounded-2xl px-3.5 py-2 text-sm",
                isOwn
                  ? "rounded-br-sm bg-primary text-primary-foreground"
                  : "rounded-bl-sm bg-muted text-foreground"
              )}
            >
              {msg.content}
            </div>
            <span className="font-subtext mt-0.5 px-1 text-[11px] text-muted-foreground">
              {formatTime(msg._creationTime)}
            </span>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
    </>
  );
}
