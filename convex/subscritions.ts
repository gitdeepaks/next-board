import { v } from "convex/values";

import { internalMutation, internalQuery, query } from "./_generated/server";

export const get = internalQuery({
  args: { ordId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orgSubscriptions")
      .withIndex("by_org", (q) => q.eq("orgId", args.ordId as string))
      .unique();
  },
});

export const getIsSunscriptionActive = query({
  args: { ordId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (!args.ordId) {
      return false;
    }

    const orgSubscriptions = await ctx.db
      .query("orgSubscriptions")
      .withIndex("by_org", (q) => q.eq("orgId", args.ordId as string))
      .unique();

    const periosEnd = orgSubscriptions?.stripeCurrentPeriodEnd;

    const isSubscriptionActive = periosEnd && periosEnd > Date.now();

    return isSubscriptionActive;
  },
});

export const create = internalMutation({
  args: {
    orgId: v.string(),
    stripePriceId: v.string(),
    stripeCustomerId: v.string(),
    stripeSubscriptionId: v.string(),
    stripeCurrentPeriodEnd: v.number(),
  },
  handler: async (
    ctx,
    {
      orgId,
      stripePriceId,
      stripeCustomerId,
      stripeSubscriptionId,
      stripeCurrentPeriodEnd,
    }
  ) => {
    return await ctx.db.insert("orgSubscriptions", {
      orgId,
      stripePriceId,
      stripeCustomerId,
      stripeSubscriptionId,
      stripeCurrentPeriodEnd,
    });
  },
});

export const update = internalMutation({
  args: {
    stripeSubscriptionId: v.string(),
    stripeCurrentPeriodEnd: v.number(),
  },
  handler: async (ctx, { stripeSubscriptionId, stripeCurrentPeriodEnd }) => {
    try {
      const existingSubscription = await ctx.db
        .query("orgSubscriptions")
        .withIndex("by_subscription", (q) =>
          q.eq("stripeSubscriptionId", stripeSubscriptionId)
        )
        .unique();

      if (!existingSubscription) {
        throw new Error("subscription not found");
      }

      await ctx.db.patch(existingSubscription._id, {
        stripeCurrentPeriodEnd,
      });

      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  },
});
