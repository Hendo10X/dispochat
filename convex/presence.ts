import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const upsertPresence = mutation({
  args: {
    roomId: v.id("rooms"),
    userId: v.string(),
    displayName: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("presence")
      .withIndex("by_room_user", (q) =>
        q.eq("roomId", args.roomId).eq("userId", args.userId)
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        lastSeen: Date.now(),
        displayName: args.displayName,
      });
    } else {
      await ctx.db.insert("presence", {
        roomId: args.roomId,
        userId: args.userId,
        displayName: args.displayName,
        lastSeen: Date.now(),
      });
    }
  },
});

export const removePresence = mutation({
  args: {
    roomId: v.id("rooms"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("presence")
      .withIndex("by_room_user", (q) =>
        q.eq("roomId", args.roomId).eq("userId", args.userId)
      )
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});

export const getPresence = query({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("presence")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .collect();
  },
});
