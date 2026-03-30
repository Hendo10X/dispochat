"use client"

import { useEffect, useRef, useState } from "react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ArrowUp, Smile } from "lucide-react"
import { EmojiPicker } from "frimousse"

interface MessageInputProps {
  roomId: Id<"rooms">
  authorName: string
  authorId: string
  disabled?: boolean
}

const MAX_CHARS = 500

export function MessageInput({
  roomId,
  authorName,
  authorId,
  disabled,
}: MessageInputProps) {
  const sendMessage = useMutation(api.messages.sendMessage)
  const setTyping = useMutation(api.presence.setTyping)
  const [content, setContent] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const pickerRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const trimmed = content.trim()
  const canSend =
    trimmed.length > 0 && trimmed.length <= MAX_CHARS && !disabled && !isSending
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
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      setTypingStatus(false)
    }
  }, [])
  function autoResize() {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }
  async function setTypingStatus(active: boolean) {
    if (isTyping === active) return
    setIsTyping(active)
    try {
      await setTyping({ roomId, userId: authorId, typing: active })
    } catch {
      // ignore transient errors
    }
  }

  function scheduleStopTyping() {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    typingTimeoutRef.current = setTimeout(() => setTypingStatus(false), 1200)
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
    requestAnimationFrame(() => {
      el.focus()
      const pos = start + emoji.length
      el.setSelectionRange(pos, pos)
      autoResize()
    })
  }

  async function handleSend() {
    if (!canSend) return
    setIsSending(true)
    try {
      await sendMessage({ roomId, content: trimmed, authorName, authorId })
      setContent("")
      setTypingStatus(false)
      if (textareaRef.current) textareaRef.current.style.height = "auto"
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

    setTypingStatus(true)
    scheduleStopTyping()
  }

  return (
    <div className="relative border-t bg-background p-3">
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
            onClick={() => setPickerOpen((v) => !v)}
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
            <span
              className={cn(
                "font-subtext text-xs tabular-nums",
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
            <ArrowUp className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
