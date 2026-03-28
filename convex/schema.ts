import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  rooms: defineTable({
    name: v.optional(v.string()),
    timerMinutes: v.number(),
    maxPeople: v.number(),
    expiresAt: v.number(),
    createdAt: v.number(),
  }),

  messages: defineTable({
    roomId: v.id("rooms"),
    content: v.string(),
    authorName: v.string(),
    authorId: v.string(),
  }).index("by_room", ["roomId"]),

  presence: defineTable({
    roomId: v.id("rooms"),
    userId: v.string(),
    displayName: v.string(),
    lastSeen: v.number(),
  })
    .index("by_room", ["roomId"])
    .index("by_room_user", ["roomId", "userId"]),
});
