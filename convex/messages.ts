import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const sendMessage = mutation({
  args: {
    roomId: v.id("rooms"),
    content: v.string(),
    authorName: v.string(),
    authorId: v.string(),
    replyToId: v.optional(v.id("messages")),
    replyToContent: v.optional(v.string()),
    replyToAuthor: v.optional(v.string()),
    bubbleColor: v.optional(v.string()),
    variant: v.optional(v.union(v.literal("shout"), v.literal("whisper"), v.literal("bold"))),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    if (!room) throw new ConvexError("Room not found");
    if (room.expiresAt < Date.now()) throw new ConvexError("Room has expired");

    const trimmed = args.content.trim();
    if (!trimmed) throw new ConvexError("Message cannot be empty");
    if (trimmed.length > 500) throw new ConvexError("Message too long");

    await ctx.db.insert("messages", {
      roomId: args.roomId,
      content: trimmed,
      authorName: args.authorName,
      authorId: args.authorId,
      replyToId: args.replyToId,
      replyToContent: args.replyToContent,
      replyToAuthor: args.replyToAuthor,
      bubbleColor: args.bubbleColor,
      variant: args.variant,
    });
  },
});

export const getMessages = query({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .order("asc")
      .collect();
  },
});
