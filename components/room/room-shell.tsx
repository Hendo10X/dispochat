"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useUserId } from "@/hooks/use-user-id"
import { useRoomExpiry } from "@/hooks/use-room-expiry"
import { JoinDialog } from "./join-dialog"
import { RoomTimer } from "./room-timer"
import { ChatMessages, type ReplyTarget } from "./chat-messages"
import { MessageInput } from "./message-input"
import { ParticipantList } from "./participant-list"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import { Copy, TimerOff, Users } from "lucide-react"

interface RoomShellProps {
  roomId: Id<"rooms">
}

const STALE_THRESHOLD = 15_000
const HEARTBEAT_INTERVAL = 10_000

const TYPING_COLORS = [
  "text-violet-500",
  "text-blue-500",
  "text-emerald-500",
  "text-amber-500",
  "text-rose-500",
  "text-cyan-500",
  "text-fuchsia-500",
]

function typingColorForUserId(userId: string): string {
  let hash = 0
  for (let i = 0; i < userId.length; i++) {
    hash = (hash * 31 + userId.charCodeAt(i)) >>> 0
  }
  return TYPING_COLORS[hash % TYPING_COLORS.length]
}

export function RoomShell({ roomId }: RoomShellProps) {
  const router = useRouter()
  const userId = useUserId()
  const room = useQuery(api.rooms.getRoom, { roomId })
  const presenceRecords = useQuery(api.presence.getPresence, { roomId })
  const upsertPresence = useMutation(api.presence.upsertPresence)
  const removePresence = useMutation(api.presence.removePresence)

  const [displayName, setDisplayName] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [replyTarget, setReplyTarget] = useState<ReplyTarget | null>(null)
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const { isExpired } = useRoomExpiry(room?.expiresAt)

  // Restore name from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(`dispochat_name_${roomId}`)
    if (saved) setDisplayName(saved)
  }, [roomId])

  // Heartbeat
  useEffect(() => {
    if (!displayName || !userId || isExpired) return

    upsertPresence({ roomId, userId, displayName })

    heartbeatRef.current = setInterval(() => {
      upsertPresence({ roomId, userId, displayName })
    }, HEARTBEAT_INTERVAL)

    return () => {
      if (heartbeatRef.current) clearInterval(heartbeatRef.current)
    }
  }, [displayName, userId, roomId, isExpired, upsertPresence])

  // Cleanup on unmount / tab close
  useEffect(() => {
    if (!userId) return
    const handleUnload = () => {
      removePresence({ roomId, userId })
    }
    window.addEventListener("beforeunload", handleUnload)
    return () => {
      window.removeEventListener("beforeunload", handleUnload)
      removePresence({ roomId, userId })
    }
  }, [userId, roomId, removePresence])

  function handleJoin(name: string) {
    localStorage.setItem(`dispochat_name_${roomId}`, name)
    setDisplayName(name)
  }

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Loading
  if (room === undefined || !userId) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <div className="font-subtext text-sm text-muted-foreground">
          Loading…
        </div>
      </div>
    )
  }

  // Not found
  if (room === null) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
        <TimerOff className="h-10 w-10 text-muted-foreground" />
        <h1 className="text-xl font-semibold">Room not found</h1>
        <p className="font-subtext text-sm text-muted-foreground">
          This room doesn't exist or has been removed.
        </p>
        <Button className="rounded-full" onClick={() => router.push("/")}>
          Create a room
        </Button>
      </div>
    )
  }

  // Expired
  if (isExpired) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
        <TimerOff className="h-10 w-10 text-muted-foreground" />
        <h1 className="text-xl font-semibold">This room has expired</h1>
        <p className="font-subtext text-sm text-muted-foreground">
          Conversations on dispochat are temporary by design.
        </p>
        <Button className="rounded-full" onClick={() => router.push("/")}>
          Create a new room
        </Button>
      </div>
    )
  }

  // Room full check
  const activeParticipants = (presenceRecords ?? []).filter(
    (p) => p.lastSeen > Date.now() - STALE_THRESHOLD
  )
  const typingUsers = activeParticipants.filter(
    (p) => p.typing && p.userId !== userId
  )
  const isUserPresent = activeParticipants.some((p) => p.userId === userId)
  const isFull =
    activeParticipants.length >= room.maxPeople &&
    !isUserPresent &&
    !displayName

  if (isFull) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
        <Users className="h-10 w-10 text-muted-foreground" />
        <h1 className="text-xl font-semibold">This room is full</h1>
        <p className="font-subtext text-sm text-muted-foreground">
          The room has reached its maximum capacity of {room.maxPeople} people.
        </p>
        <Button className="rounded-full" onClick={() => router.push("/")}>
          Create your own room
        </Button>
      </div>
    )
  }

  return (
    <>
      {!displayName && <JoinDialog roomName={room.name} onJoin={handleJoin} />}
      <div className="flex h-dvh flex-col">
        {/* Header */}
        <header className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-sm leading-none font-semibold">
                {room.name ?? (
                  <span className="tracking-wider uppercase">dispochat</span>
                )}
              </h1>
              {room.name && (
                <p className="mt-0.5 font-subtext text-xs tracking-wider text-muted-foreground uppercase">
                  dispochat
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <RoomTimer expiresAt={room.expiresAt} />
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={copyLink}
            >
              <Copy className="mr-1.5 h-3.5 w-3.5" />
              {copied ? "Copied!" : "Share"}
            </Button>
          </div>
        </header>

        <div className="hidden px-4 py-2 text-xs text-muted-foreground md:block">
          <p>
            Press <Kbd>d</Kbd> to toggle between dark and light mode.
          </p>
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Chat */}
          <div className="flex flex-1 flex-col overflow-hidden">
            {displayName && userId ? (
              <>
                <ChatMessages
                  roomId={roomId}
                  currentUserId={userId}
                  typingUsers={typingUsers}
                  onReply={setReplyTarget}
                />
                <MessageInput
                  roomId={roomId}
                  authorName={displayName}
                  authorId={userId}
                  disabled={isExpired}
                  replyTarget={replyTarget}
                  onCancelReply={() => setReplyTarget(null)}
                />
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center">
                <p className="font-subtext text-sm text-muted-foreground">
                  Enter your name to start chatting
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="hidden w-56 shrink-0 border-l p-4 md:block">
            {presenceRecords && userId && (
              <ParticipantList
                presenceRecords={presenceRecords}
                currentUserId={userId}
                maxPeople={room.maxPeople}
              />
            )}
          </aside>
        </div>
      </div>
    </>
  )
}
