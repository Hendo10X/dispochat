"use client";

import { useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SendHorizonal } from "lucide-react";

interface MessageInputProps {
  roomId: Id<"rooms">;
  authorName: string;
  authorId: string;
  disabled?: boolean;
}

const MAX_CHARS = 500;

export function MessageInput({
  roomId,
  authorName,
  authorId,
  disabled,
}: MessageInputProps) {
  const sendMessage = useMutation(api.messages.sendMessage);
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const trimmed = content.trim();
  const canSend = trimmed.length > 0 && trimmed.length <= MAX_CHARS && !disabled && !isSending;

  function autoResize() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }

  async function handleSend() {
    if (!canSend) return;
    setIsSending(true);
    try {
      await sendMessage({ roomId, content: trimmed, authorName, authorId });
      setContent("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    } finally {
      setIsSending(false);
      textareaRef.current?.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const overLimit = content.length > MAX_CHARS;

  return (
    <div className="border-t bg-background p-3">
      <div className="flex items-end gap-2 rounded-2xl border bg-muted/30 px-3 py-2 focus-within:ring-2 focus-within:ring-ring">
        <textarea
          ref={textareaRef}
          rows={1}
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            autoResize();
          }}
          onKeyDown={handleKeyDown}
          disabled={disabled || isSending}
          placeholder={disabled ? "Room has expired" : "Message… (Enter to send)"}
          className="font-subtext max-h-40 min-h-[1.5rem] flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
        />
        <div className="flex items-center gap-2 pb-0.5">
          {content.length > MAX_CHARS - 80 && (
            <span
              className={cn(
                "font-subtext text-xs",
                overLimit ? "text-destructive" : "text-muted-foreground"
              )}
            >
              {content.length}/{MAX_CHARS}
            </span>
          )}
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!canSend || overLimit}
            className="h-7 w-7 shrink-0 rounded-full"
          >
            <SendHorizonal className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
