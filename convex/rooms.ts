import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createRoom = mutation({
  args: {
    name: v.optional(v.string()),
    timerMinutes: v.number(),
    maxPeople: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const expiresAt = now + args.timerMinutes * 60 * 1000;
    const roomId = await ctx.db.insert("rooms", {
      name: args.name,
      timerMinutes: args.timerMinutes,
      maxPeople: args.maxPeople,
      expiresAt,
      createdAt: now,
    });
    return roomId;
  },
});

export const getRoom = query({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.roomId);
  },
});
