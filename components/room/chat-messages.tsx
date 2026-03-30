"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { ChatAnimationOverlay } from "./chat-animation-overlay";
import { useMessageAnimation } from "@/hooks/use-message-animation";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Reply } from "lucide-react";
import { useWebHaptics } from "web-haptics/react";

/* ─── Brand colors for usernames ────────────────────────────── */
const NAME_COLORS = ["#2B7FFF", "#FF6900", "#00C950", "#8038BF"];
function colorForId(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return NAME_COLORS[h % NAME_COLORS.length];
}

interface TypingUser {
  userId: string;
  displayName: string;
}

export interface ReplyTarget {
  id: Id<"messages">;
  content: string;
  authorName: string;
}

interface ChatMessagesProps {
  roomId: Id<"rooms">;
  currentUserId: string;
  typingUsers?: TypingUser[];
  onReply: (target: ReplyTarget) => void;
}

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* ─── Single swipeable message bubble ───────────────────────── */
interface BubbleProps {
  msg: {
    _id: Id<"messages">;
    content: string;
    authorName: string;
    authorId: string;
    _creationTime: number;
    replyToContent?: string;
    replyToAuthor?: string;
  };
  isOwn: boolean;
  showName: boolean;
  onReply: (target: ReplyTarget) => void;
}

function MessageBubble({ msg, isOwn, showName, onReply }: BubbleProps) {
  const x = useMotionValue(0);
  const iconOpacity = useTransform(x, [0, 36], [0, 1]);
  const iconX = useTransform(x, [0, 48], [-8, 0]);
  const [hovered, setHovered] = useState(false);
  const { trigger: haptic } = useWebHaptics();

  function triggerReply() {
    haptic("light");
    onReply({ id: msg._id, content: msg.content, authorName: msg.authorName });
  }

  function handleDragEnd() {
    const cur = x.get();
    if (cur > 52) triggerReply();
    animate(x, 0, { type: "spring", stiffness: 400, damping: 30 });
  }

  return (
    <div
      className={cn("group flex w-full flex-col", isOwn ? "items-end" : "items-start")}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {showName && (
        <span
          className="font-subtext mb-0.5 ml-1 text-xs font-medium"
          style={{ color: colorForId(msg.authorId) }}
        >
          {msg.authorName}
        </span>
      )}

      {/* Bubble + absolutely-positioned reply button so it never affects bubble width */}
      <div className="relative max-w-[75%]">
        {/* Swipe-to-reply drag layer */}
        <motion.div
          style={{ x }}
          drag={!isOwn ? "x" : false}
          dragDirectionLock
          dragConstraints={{ left: 0, right: 80 }}
          dragElastic={{ left: 0, right: 0.3 }}
          onDragEnd={handleDragEnd}
          className="touch-pan-y"
        >
          {/* Swipe indicator */}
          {!isOwn && (
            <motion.span
              style={{ opacity: iconOpacity, x: iconX }}
              className="pointer-events-none absolute -left-7 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              <Reply className="h-3.5 w-3.5" />
            </motion.span>
          )}

          <div
            style={{ overflowWrap: "anywhere" }}
            className={cn(
              "rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
              isOwn
                ? "rounded-br-sm bg-primary text-primary-foreground"
                : "rounded-bl-sm bg-muted text-foreground"
            )}
          >
            {/* Reply quote — darker tint */}
            {msg.replyToContent && (
              <div
                className={cn(
                  "mb-2 rounded-lg border-l-2 pl-2.5 pr-2 py-1.5 text-xs leading-snug",
                  isOwn
                    ? "border-white/40 bg-black/25 text-primary-foreground/75"
                    : "border-primary/40 bg-primary/10 text-foreground/70"
                )}
              >
                <p className="mb-0.5 font-semibold">{msg.replyToAuthor}</p>
                <p className="line-clamp-2">{msg.replyToContent}</p>
              </div>
            )}
            {msg.content}
          </div>
        </motion.div>

        {/* Desktop reply button — floats outside bubble, doesn't affect width */}
        <motion.button
          animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.7 }}
          transition={{ duration: 0.15 }}
          onClick={triggerReply}
          className={cn(
            "absolute top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground",
            isOwn ? "-left-7" : "-right-7"
          )}
          aria-label="Reply"
        >
          <Reply className="h-3.5 w-3.5" />
        </motion.button>
      </div>

      <span className="font-subtext mt-0.5 px-1 text-[11px] text-muted-foreground">
        {formatTime(msg._creationTime)}
      </span>
    </div>
  );
}

/* ─── Chat messages list ─────────────────────────────────────── */
export function ChatMessages({
  roomId,
  currentUserId,
  typingUsers = [],
  onReply,
}: ChatMessagesProps) {
  const messages = useQuery(api.messages.getMessages, { roomId });
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { animationType, animationKey, clearAnimation } = useMessageAnimation(messages);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    if (isNearBottom) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages?.length, typingUsers.length]);

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
            <MessageBubble
              key={msg._id}
              msg={msg}
              isOwn={isOwn}
              showName={showName}
              onReply={onReply}
            />
          );
        })}

        {typingUsers.length > 0 && (
          <div className="flex flex-col items-start gap-0.5 mt-1">
            <span className="font-subtext mb-0.5 ml-1 text-xs text-muted-foreground">
              {typingUsers.map((u) => u.displayName).join(", ")}
            </span>
            <div className="rounded-2xl rounded-bl-sm bg-muted px-4 py-2.5">
              <span className="flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:0ms]" />
                <span className="size-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:150ms]" />
                <span className="size-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:300ms]" />
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </>
  );
}
