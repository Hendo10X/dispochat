"use client"

import { useEffect, useRef, useState } from "react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ArrowUp, X, CornerUpLeft } from "lucide-react"
import { useWebHaptics } from "web-haptics/react"
import type { ReplyTarget } from "./chat-messages"

interface MessageInputProps {
  roomId: Id<"rooms">
  authorName: string
  authorId: string
  disabled?: boolean
  replyTarget?: ReplyTarget | null
  onCancelReply?: () => void
}

const MAX_CHARS = 500

/* ─── Slash commands ─────────────────────────────────────────── */
type CommandType = "variant" | "color"
type Variant = "shout" | "whisper" | "bold"

interface SlashCommand {
  cmd: string
  desc: string
  type: CommandType
  value: string
  color?: string
}

const SLASH_COMMANDS: SlashCommand[] = [
  {
    cmd: "/shout",
    desc: "All caps, every message",
    type: "variant",
    value: "shout",
  },
  {
    cmd: "/whisper",
    desc: "Soft and italic",
    type: "variant",
    value: "whisper",
  },
  { cmd: "/bold", desc: "Make your words pop", type: "variant", value: "bold" },
  {
    cmd: "/red",
    desc: "Red bubble",
    type: "color",
    value: "#ef4444",
    color: "#ef4444",
  },
  {
    cmd: "/blue",
    desc: "Blue bubble",
    type: "color",
    value: "#3b82f6",
    color: "#3b82f6",
  },
  {
    cmd: "/green",
    desc: "Green bubble",
    type: "color",
    value: "#22c55e",
    color: "#22c55e",
  },
  {
    cmd: "/purple",
    desc: "Purple bubble",
    type: "color",
    value: "#8b5cf6",
    color: "#8b5cf6",
  },
  {
    cmd: "/orange",
    desc: "Orange bubble",
    type: "color",
    value: "#f97316",
    color: "#f97316",
  },
  {
    cmd: "/pink",
    desc: "Pink bubble",
    type: "color",
    value: "#ec4899",
    color: "#ec4899",
  },
]

/* ─── Component ──────────────────────────────────────────────── */
export function MessageInput({
  roomId,
  authorName,
  authorId,
  disabled,
  replyTarget,
  onCancelReply,
}: MessageInputProps) {
  const sendMessage = useMutation(api.messages.sendMessage)
  const setTyping = useMutation(api.presence.setTyping)
  const [content, setContent] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [cmdIndex, setCmdIndex] = useState(0)
  const [activeCommand, setActiveCommand] = useState<SlashCommand | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isTypingRef = useRef(false)
  const { trigger: haptic } = useWebHaptics()

  const trimmed = content.trim()
  const canSend =
    trimmed.length > 0 && trimmed.length <= MAX_CHARS && !disabled && !isSending
  const overLimit = trimmed.length > MAX_CHARS

  // Show dropdown when entire input is a partial /command with no space yet
  const cmdQuery = /^\/([\w]*)$/.test(content) ? content.toLowerCase() : null
  const filteredCmds =
    cmdQuery !== null
      ? SLASH_COMMANDS.filter((c) => c.cmd.startsWith(cmdQuery))
      : []
  const showCmdMenu = filteredCmds.length > 0

  useEffect(() => {
    setCmdIndex(0)
  }, [cmdQuery])

  /* cleanup typing on unmount */
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
      stopTyping()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function autoResize() {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }

  function startTyping() {
    if (isTypingRef.current) return
    isTypingRef.current = true
    setTyping({ roomId, userId: authorId, typing: true }).catch(() => {})
    haptic("selection")
  }

  function stopTyping() {
    if (!isTypingRef.current) return
    isTypingRef.current = false
    setTyping({ roomId, userId: authorId, typing: false }).catch(() => {})
  }

  function scheduleStopTyping() {
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(stopTyping, 1500)
  }

  // Selecting a command makes it the persistent active mode
  function selectCommand(cmd: SlashCommand) {
    setActiveCommand(cmd)
    setContent("")
    haptic("light")
    requestAnimationFrame(() => {
      const el = textareaRef.current
      if (el) {
        el.focus()
        autoResize()
      }
    })
  }

  function clearCommand() {
    setActiveCommand(null)
    haptic("light")
    textareaRef.current?.focus()
  }

  async function handleSend() {
    if (!canSend) return
    const textToSend = trimmed
    if (!textToSend) return

    // Derive styling from the sticky active command
    const bubbleColor =
      activeCommand?.type === "color" ? activeCommand.value : undefined
    const variant =
      activeCommand?.type === "variant"
        ? (activeCommand.value as Variant)
        : undefined
    const finalContent =
      variant === "shout" ? textToSend.toUpperCase() : textToSend

    setContent("")
    if (textareaRef.current) textareaRef.current.style.height = "auto"
    stopTyping()
    onCancelReply?.()
    haptic("success")

    setIsSending(true)
    try {
      await sendMessage({
        roomId,
        content: finalContent,
        authorName,
        authorId,
        replyToId: replyTarget?.id,
        replyToContent: replyTarget?.content,
        replyToAuthor: replyTarget?.authorName,
        bubbleColor,
        variant,
      })
    } finally {
      setIsSending(false)
      textareaRef.current?.focus()
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (showCmdMenu) {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setCmdIndex((i) => Math.min(i + 1, filteredCmds.length - 1))
        return
      }
      if (e.key === "ArrowUp") {
        e.preventDefault()
        setCmdIndex((i) => Math.max(i - 1, 0))
        return
      }
      if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault()
        selectCommand(filteredCmds[cmdIndex])
        return
      }
      if (e.key === "Escape") {
        e.preventDefault()
        setContent("")
        return
      }
    }
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
      return
    }
    startTyping()
    scheduleStopTyping()
  }

  return (
    <div className="relative border-t bg-background">
      {/* ── Active command badge ── */}
      {activeCommand && (
        <div className="flex items-center gap-2 border-b bg-muted/40 px-4 py-2">
          <span className="font-mono text-xs font-semibold">
            Active bubble style:
          </span>
          <span className="font-mono text-xs font-medium">
            {activeCommand.cmd}
          </span>
          <span className="font-subtext text-xs text-muted-foreground">
            {activeCommand.desc}
          </span>
          <button
            type="button"
            onClick={clearCommand}
            className="ml-auto shrink-0 rounded-full p-0.5 text-muted-foreground hover:text-foreground"
            aria-label="Clear command"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* ── Reply preview bar ── */}
      {replyTarget && (
        <div className="flex items-center gap-2 border-b bg-muted/40 px-4 py-2">
          <CornerUpLeft className="h-3.5 w-3.5 shrink-0 text-primary" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-primary">
              {replyTarget.authorName}
            </p>
            <p className="truncate font-subtext text-xs text-muted-foreground">
              {replyTarget.content}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              haptic("light")
              onCancelReply?.()
            }}
            className="shrink-0 rounded-full p-0.5 text-muted-foreground hover:text-foreground"
            aria-label="Cancel reply"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <div className="p-3">
        {/* ── Slash command dropdown ── */}
        {showCmdMenu && (
          <div className="absolute right-3 bottom-full left-3 z-50 mb-2 overflow-hidden rounded-xl border bg-card shadow-xl">
            <p className="px-3 pt-2.5 pb-1 font-mono text-[10px] font-medium tracking-widest text-muted-foreground uppercase">
              Commands
            </p>
            {filteredCmds.map((cmd, i) => (
              <button
                key={cmd.cmd}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault()
                  selectCommand(cmd)
                }}
                className={cn(
                  "flex w-full items-center gap-3 px-3 py-2 text-left transition-colors",
                  i === cmdIndex ? "bg-muted" : "hover:bg-muted/60"
                )}
              >
                <span className="font-mono text-sm font-medium">{cmd.cmd}</span>
                <span className="font-subtext text-xs text-muted-foreground">
                  {cmd.desc}
                </span>
              </button>
            ))}
            <p className="px-3 pt-1 pb-2 font-subtext text-[10px] text-muted-foreground">
              ↑↓ navigate · ↵ or Tab to select · Esc to close
            </p>
          </div>
        )}

        {/* ── Input row ── */}
        <div className="flex items-end gap-2 rounded-2xl border bg-muted/30 px-3 py-2 focus-within:ring-2 focus-within:ring-ring">
          <textarea
            ref={textareaRef}
            rows={1}
            value={content}
            onChange={(e) => {
              setContent(e.target.value)
              autoResize()
            }}
            onKeyDown={handleKeyDown}
            disabled={disabled || isSending}
            placeholder={
              disabled
                ? "Room has expired"
                : activeCommand
                  ? `${activeCommand.cmd} mode — type your message`
                  : "Message… or / for commands"
            }
            className="max-h-40 min-h-6 flex-1 resize-none bg-transparent font-subtext text-base leading-snug outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed md:text-sm"
          />

          <div className="flex items-center gap-2 pb-0.5">
            {trimmed.length > MAX_CHARS - 80 && (
              <span
                className={cn(
                  "font-subtext text-xs tabular-nums",
                  overLimit ? "text-destructive" : "text-muted-foreground"
                )}
              >
                {trimmed.length}/{MAX_CHARS}
              </span>
            )}

            <Button
              size="icon"
              onClick={handleSend}
              disabled={!canSend || overLimit}
              className="h-7 w-7 shrink-0 rounded-full"
            >
              <ArrowUp className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
