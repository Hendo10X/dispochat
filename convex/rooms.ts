import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/* ─── Funny slug word lists ──────────────────────────────────── */
const ADJECTIVES = [
  "chunky", "soggy", "wobbly", "grumpy", "sneaky", "fluffy", "spicy",
  "crusty", "wiggly", "sassy", "goofy", "stinky", "bouncy", "sleepy",
  "cheeky", "lumpy", "funky", "zesty", "cranky", "dizzy", "fuzzy",
  "greasy", "jumpy", "quirky", "rusty", "slimy", "tipsy", "wacky",
  "dopey", "feisty", "frisky", "gloomy", "hangry", "loopy", "mushy",
  "nerdy", "peppy", "pouty", "rowdy", "sappy", "snarky", "squirmy",
  "stuffy", "toasty", "touchy", "trashy", "tricky", "woozy", "zany",
];

const NOUNS = [
  "wizard", "penguin", "potato", "noodle", "pickle", "banana", "waffle",
  "nugget", "goblin", "hamster", "pigeon", "burrito", "muffin", "biscuit",
  "sausage", "ferret", "platypus", "cactus", "pretzel", "blobfish",
  "weasel", "turnip", "raccoon", "yeti", "hedgehog", "walrus", "flamingo",
  "salamander", "mongoose", "avocado", "bagel", "crouton", "donut",
  "eggplant", "falafel", "gremlin", "hotdog", "iguana", "jellybean",
  "kumquat", "lasagna", "marmot", "nacho", "opossum", "pancake",
  "quokka", "ramen", "sloth", "taco", "ukulele", "vortex", "wombat",
];

function generateSlug(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const suffix = Math.random().toString(36).slice(2, 5); // 3-char base36
  return `${adj}-${noun}-${suffix}`;
}

/* ─── Mutations ──────────────────────────────────────────────── */
export const createRoom = mutation({
  args: {
    name: v.optional(v.string()),
    timerMinutes: v.number(),
    maxPeople: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const expiresAt = now + args.timerMinutes * 60 * 1000;

    // Generate a unique slug (retry once on collision)
    let slug = generateSlug();
    const existing = await ctx.db
      .query("rooms")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    if (existing) slug = generateSlug();

    await ctx.db.insert("rooms", {
      name: args.name,
      slug,
      timerMinutes: args.timerMinutes,
      maxPeople: args.maxPeople,
      expiresAt,
      createdAt: now,
    });

    return slug;
  },
});

/* ─── Queries ────────────────────────────────────────────────── */
export const getRoomBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("rooms")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
  },
});

export const getRoom = query({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.roomId);
  },
});
