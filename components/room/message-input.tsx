"use client"

import { useEffect, useRef, useState } from "react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ArrowUp, Smile, X, CornerUpLeft } from "lucide-react"
import { EmojiPicker } from "frimousse"
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
  const [pickerOpen, setPickerOpen] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const pickerRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Use ref to avoid stale closure in setTypingStatus
  const isTypingRef = useRef(false)
  const { trigger: haptic } = useWebHaptics()

  const trimmed = content.trim()
  const canSend = trimmed.length > 0 && trimmed.length <= MAX_CHARS && !disabled && !isSending
  const overLimit = content.length > MAX_CHARS

  /* close picker on outside click */
  useEffect(() => {
    if (!pickerOpen) return
    function onDown(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setPickerOpen(false)
      }
    }
    document.addEventListener("mousedown", onDown)
    return () => document.removeEventListener("mousedown", onDown)
  }, [pickerOpen])

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

  function insertEmoji(emoji: string) {
    const el = textareaRef.current
    if (!el) {
      setContent((p) => p + emoji)
      return
    }
    const start = el.selectionStart ?? content.length
    const end = el.selectionEnd ?? content.length
    const next = content.slice(0, start) + emoji + content.slice(end)
    setContent(next)
    haptic("light")
    requestAnimationFrame(() => {
      el.focus()
      const pos = start + emoji.length
      el.setSelectionRange(pos, pos)
      autoResize()
    })
  }

  async function handleSend() {
    if (!canSend) return
    const textToSend = content.trim()
    if (!textToSend) return

    // Clear + stop typing immediately before the async call
    setContent("")
    if (textareaRef.current) textareaRef.current.style.height = "auto"
    stopTyping()
    onCancelReply?.()
    haptic("success")

    setIsSending(true)
    try {
      await sendMessage({
        roomId,
        content: textToSend,
        authorName,
        authorId,
        replyToId: replyTarget?.id,
        replyToContent: replyTarget?.content,
        replyToAuthor: replyTarget?.authorName,
      })
    } finally {
      setIsSending(false)
      textareaRef.current?.focus()
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
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
      {/* ── Reply preview bar ── */}
      {replyTarget && (
        <div className="flex items-center gap-2 border-b bg-muted/40 px-4 py-2">
          <CornerUpLeft className="h-3.5 w-3.5 shrink-0 text-primary" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-primary">{replyTarget.authorName}</p>
            <p className="truncate font-subtext text-xs text-muted-foreground">{replyTarget.content}</p>
          </div>
          <button
            type="button"
            onClick={() => { haptic("light"); onCancelReply?.() }}
            className="shrink-0 rounded-full p-0.5 text-muted-foreground hover:text-foreground"
            aria-label="Cancel reply"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <div className="p-3">
        {/* ── Emoji picker popover ── */}
        {pickerOpen && (
          <div ref={pickerRef} className="absolute right-3 bottom-full z-50 mb-2">
            <EmojiPicker.Root
              className="emoji-picker w-75 overflow-hidden rounded-xl border bg-card shadow-xl"
              onEmojiSelect={(e) => {
                insertEmoji(e.emoji)
                setPickerOpen(false)
              }}
            >
              <EmojiPicker.Search />
              <EmojiPicker.Viewport className="h-52">
                <EmojiPicker.List />
              </EmojiPicker.Viewport>
              <EmojiPicker.Loading>Loading emojis…</EmojiPicker.Loading>
              <EmojiPicker.Empty>
                {({ search }) => <>No results for &ldquo;{search}&rdquo;</>}
              </EmojiPicker.Empty>
            </EmojiPicker.Root>
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
            placeholder={disabled ? "Room has expired" : "Message…"}
            className="max-h-40 min-h-6 flex-1 resize-none bg-transparent font-subtext text-base leading-snug outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed md:text-sm"
          />

          <div className="flex items-center gap-2 pb-0.5">
            <button
              type="button"
              onClick={() => { haptic("light"); setPickerOpen((v) => !v) }}
              disabled={disabled}
              className={cn(
                "shrink-0 p-0.5 text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none",
                pickerOpen && "text-foreground"
              )}
              aria-label="Emoji picker"
            >
              <Smile className="h-4.5 w-4.5" />
            </button>

            {content.length > MAX_CHARS - 80 && (
              <span className={cn(
                "font-subtext text-xs tabular-nums",
                overLimit ? "text-destructive" : "text-muted-foreground"
              )}>
                {content.length}/{MAX_CHARS}
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
