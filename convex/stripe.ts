"use node";
import Stripe from "stripe";
import { v } from "convex/values";

import { action, internalAction } from "./_generated/server";
import { internal } from "./_generated/api";

const url = process.env.NEXT_PUBLIC_URL;
const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
  apiVersion: "2023-10-16",
});

export const portal = action({
  args: { orgId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    if (!args.orgId) {
      throw new Error("Org ID is required");
    }

    const orgSubscriptions = await ctx.runQuery(internal.subscritions.get, {
      ordId: args.orgId,
    });
    if (!orgSubscriptions) {
      throw new Error("No subscription found");
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: orgSubscriptions.stripeCustomerId,
      return_url: `${url}`,
    });
    return session.url!;
  },
});

export const pay = action({
  args: { orgId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    if (!args.orgId) {
      throw new Error("Org ID is required");
    }

    const session = await stripe.checkout.sessions.create({
      success_url: `${url}`,
      cancel_url: `${url}`,
      customer_email: identity.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Big Board Pro",
              description: "Unlimited boards and storage",
            },
            unit_amount: 2000,
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        orgId: args.orgId,
      },
      mode: "subscription",
    });
    return session.url!;
  },
});

export const fulfill = internalAction({
  args: {
    signature: v.string(),
    payload: v.string(),
  },
  handler: async (ctx, { signature, payload }) => {
    const webHookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

    try {
      const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        webHookSecret
      );

      const session = event.data.object as Stripe.Checkout.Session;

      if (event.type === "checkout.session.completed") {
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );

        if (!session.metadata?.orgId) {
          throw new Error("No Organization ID");
        }

        await ctx.runMutation(internal.subscritions.create, {
          orgId: session.metadata.orgId as string,
          stripeSubscriptionId: subscription.id as string,
          stripeCustomerId: subscription.customer as string,
          stripePriceId: subscription.items.data[0].price.id as string,
          stripeCurrentPeriodEnd: subscription.current_period_end * 1000,
        });
      }

      if (event.type === "invoice.payment_succeeded") {
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );

        await ctx.runMutation(internal.subscritions.update, {
          stripeSubscriptionId: subscription.id as string,
          stripeCurrentPeriodEnd: subscription.current_period_end * 1000,
        });
      }
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false };
    }
  },
});
