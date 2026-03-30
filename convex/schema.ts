import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  rooms: defineTable({
    name: v.optional(v.string()),
    slug: v.optional(v.string()),
    timerMinutes: v.number(),
    maxPeople: v.number(),
    expiresAt: v.number(),
    createdAt: v.number(),
  }).index("by_slug", ["slug"]),

  messages: defineTable({
    roomId: v.id("rooms"),
    type: v.optional(v.union(v.literal("message"), v.literal("join"))),
    content: v.string(),
    authorName: v.string(),
    authorId: v.string(),
    replyToId: v.optional(v.id("messages")),
    replyToContent: v.optional(v.string()),
    replyToAuthor: v.optional(v.string()),
    bubbleColor: v.optional(v.string()),
    variant: v.optional(v.union(v.literal("shout"), v.literal("whisper"), v.literal("bold"))),
  }).index("by_room", ["roomId"]),

  presence: defineTable({
    roomId: v.id("rooms"),
    userId: v.string(),
    displayName: v.string(),
    lastSeen: v.number(),
    typing: v.optional(v.boolean()),
  })
    .index("by_room", ["roomId"])
    .index("by_room_user", ["roomId", "userId"]),
})
