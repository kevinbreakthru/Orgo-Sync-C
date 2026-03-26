import type { FastifyInstance } from "fastify";
import { randomBytes, randomUUID } from "node:crypto";
import { z } from "zod";
import { CreateSubscriptionSchema, UpdateSubscriptionSchema } from "@orgo-sync/schemas";
import { getServiceClient } from "../../lib/supabase.js";
import { getRedis } from "../../lib/redis.js";
import { enqueueDispatch } from "../../queues/dispatch.queue.js";

function generateSigningSecret(): string {
  return randomBytes(32).toString("hex");
}

function invalidateSubCache(publisherId: string): void {
  getRedis().del(`subs:${publisherId}`).catch(() => {});
}

export async function registerSubscriptionRoutes(server: FastifyInstance) {
  const supabase = getServiceClient();

  server.post("/v1/subscriptions", {
    schema: {
      tags: ["subscriptions"],
      description: "Create a webhook subscription. Platforms create pre-approved subscriptions; builders create pending access requests.",
      body: CreateSubscriptionSchema,
    },
  }, async (request, reply) => {
    const auth = request.partnerAuth!;
    const input = request.body as z.infer<typeof CreateSubscriptionSchema>;
    const isPlatform = auth.partner_type === "platform";

    let publisherId: string;
    let subscriberId: string;

    if (isPlatform) {
      publisherId = auth.partner_id;
      subscriberId = input.subscriber_id ?? "";
      if (!subscriberId) {
        return reply.status(400).send({
          error: { code: "MISSING_SUBSCRIBER", message: "subscriber_id is required when a platform creates a subscription" },
        });
      }
    } else {
      subscriberId = auth.partner_id;
      publisherId = input.publisher_id ?? "";
      if (!publisherId) {
        return reply.status(400).send({
          error: { code: "MISSING_PUBLISHER", message: "publisher_id is required when a builder requests access" },
        });
      }
    }

    const signingSecret = isPlatform ? generateSigningSecret() : "";
    const approvalStatus = isPlatform ? "approved" : "pending";

    const { data, error } = await supabase
      .from("webhook_subscriptions")
      .insert({
        publisher_id: publisherId,
        subscriber_id: subscriberId,
        endpoint_url: input.endpoint_url,
        signing_secret: signingSecret,
        event_filters: input.event_filters,
        description: input.description ?? null,
        approval_status: approvalStatus,
        is_active: isPlatform,
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return reply.status(409).send({
          error: { code: "DUPLICATE_SUBSCRIPTION", message: "A subscription for this publisher/subscriber/endpoint already exists" },
        });
      }
      return reply.status(500).send({
        error: { code: "DB_ERROR", message: error.message },
      });
    }

    if (isPlatform) invalidateSubCache(publisherId);

    return reply.status(201).send({
      id: data.id,
      publisher_id: data.publisher_id,
      subscriber_id: data.subscriber_id,
      endpoint_url: data.endpoint_url,
      approval_status: data.approval_status,
      ...(isPlatform && { signing_secret: signingSecret }),
      event_filters: data.event_filters,
      description: data.description,
      is_active: data.is_active,
      created_at: data.created_at,
    });
  });

  server.get("/v1/subscriptions", {
    schema: {
      tags: ["subscriptions"],
      description: "List webhook subscriptions. Platforms see subscriptions they own; builders see subscriptions where they are the subscriber.",
    },
  }, async (request, reply) => {
    const auth = request.partnerAuth!;

    const isPlatform = auth.partner_type === "platform";
    const column = isPlatform ? "publisher_id" : "subscriber_id";

    const { data, error } = await supabase
      .from("webhook_subscriptions")
      .select("id, publisher_id, subscriber_id, endpoint_url, event_filters, description, is_active, approval_status, failure_count, disabled_at, created_at, updated_at")
      .eq(column, auth.partner_id)
      .order("created_at", { ascending: false });

    if (error) {
      return reply.status(500).send({
        error: { code: "DB_ERROR", message: error.message },
      });
    }

    return reply.send({ subscriptions: data ?? [] });
  });

  server.get("/v1/subscriptions/:id", {
    schema: {
      tags: ["subscriptions"],
      description: "Get subscription detail with recent delivery history.",
      params: z.object({ id: z.string().uuid() }),
    },
  }, async (request, reply) => {
    const auth = request.partnerAuth!;
    const { id } = request.params as { id: string };

    const { data: sub, error } = await supabase
      .from("webhook_subscriptions")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !sub) {
      return reply.status(404).send({
        error: { code: "NOT_FOUND", message: "Subscription not found" },
      });
    }

    if (sub.publisher_id !== auth.partner_id && sub.subscriber_id !== auth.partner_id) {
      return reply.status(403).send({
        error: { code: "FORBIDDEN", message: "You do not have access to this subscription" },
      });
    }

    const { data: deliveries } = await supabase
      .from("webhook_deliveries")
      .select("*")
      .eq("subscription_id", id)
      .order("created_at", { ascending: false })
      .limit(25);

    return reply.send({
      subscription: {
        id: sub.id,
        publisher_id: sub.publisher_id,
        subscriber_id: sub.subscriber_id,
        endpoint_url: sub.endpoint_url,
        event_filters: sub.event_filters,
        description: sub.description,
        is_active: sub.is_active,
        approval_status: sub.approval_status,
        failure_count: sub.failure_count,
        disabled_at: sub.disabled_at,
        created_at: sub.created_at,
        updated_at: sub.updated_at,
      },
      recent_deliveries: deliveries ?? [],
    });
  });

  server.patch("/v1/subscriptions/:id", {
    schema: {
      tags: ["subscriptions"],
      description: "Update a webhook subscription. Only the owning platform can modify.",
      params: z.object({ id: z.string().uuid() }),
      body: UpdateSubscriptionSchema,
    },
  }, async (request, reply) => {
    const auth = request.partnerAuth!;
    if (auth.partner_type !== "platform") {
      return reply.status(403).send({
        error: { code: "FORBIDDEN", message: "Only platform partners can update subscriptions" },
      });
    }

    const { id } = request.params as { id: string };
    const input = request.body as z.infer<typeof UpdateSubscriptionSchema>;

    const { data: existing } = await supabase
      .from("webhook_subscriptions")
      .select("publisher_id")
      .eq("id", id)
      .single();

    if (!existing || existing.publisher_id !== auth.partner_id) {
      return reply.status(404).send({
        error: { code: "NOT_FOUND", message: "Subscription not found" },
      });
    }

    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (input.endpoint_url) updates.endpoint_url = input.endpoint_url;
    if (input.event_filters) updates.event_filters = input.event_filters;
    if (input.description !== undefined) updates.description = input.description;
    if (input.is_active !== undefined) {
      updates.is_active = input.is_active;
      if (input.is_active) {
        updates.disabled_at = null;
        updates.failure_count = 0;
      }
    }

    let newSecret: string | undefined;
    if (input.regenerate_secret) {
      newSecret = generateSigningSecret();
      updates.signing_secret = newSecret;
    }

    const { data, error } = await supabase
      .from("webhook_subscriptions")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return reply.status(500).send({
        error: { code: "DB_ERROR", message: error.message },
      });
    }

    invalidateSubCache(auth.partner_id);

    return reply.send({
      id: data.id,
      publisher_id: data.publisher_id,
      subscriber_id: data.subscriber_id,
      endpoint_url: data.endpoint_url,
      event_filters: data.event_filters,
      description: data.description,
      is_active: data.is_active,
      failure_count: data.failure_count,
      disabled_at: data.disabled_at,
      updated_at: data.updated_at,
      ...(newSecret && { signing_secret: newSecret }),
    });
  });

  server.patch("/v1/subscriptions/:id/approve", {
    schema: {
      tags: ["subscriptions"],
      description: "Approve a pending subscription request. Only the publisher (platform) can approve. Generates the signing secret on approval.",
      params: z.object({ id: z.string().uuid() }),
    },
  }, async (request, reply) => {
    const auth = request.partnerAuth!;
    if (auth.partner_type !== "platform") {
      return reply.status(403).send({
        error: { code: "FORBIDDEN", message: "Only platform partners can approve subscriptions" },
      });
    }

    const { id } = request.params as { id: string };

    const { data: sub } = await supabase
      .from("webhook_subscriptions")
      .select("publisher_id, approval_status")
      .eq("id", id)
      .single();

    if (!sub || sub.publisher_id !== auth.partner_id) {
      return reply.status(404).send({
        error: { code: "NOT_FOUND", message: "Subscription not found" },
      });
    }

    if (sub.approval_status === "approved") {
      return reply.status(400).send({
        error: { code: "ALREADY_APPROVED", message: "This subscription is already approved" },
      });
    }

    const signingSecret = generateSigningSecret();

    const { data, error } = await supabase
      .from("webhook_subscriptions")
      .update({
        approval_status: "approved",
        signing_secret: signingSecret,
        is_active: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return reply.status(500).send({
        error: { code: "DB_ERROR", message: error.message },
      });
    }

    invalidateSubCache(auth.partner_id);

    return reply.send({
      id: data.id,
      publisher_id: data.publisher_id,
      subscriber_id: data.subscriber_id,
      endpoint_url: data.endpoint_url,
      approval_status: data.approval_status,
      signing_secret: signingSecret,
      event_filters: data.event_filters,
      description: data.description,
      is_active: data.is_active,
      updated_at: data.updated_at,
    });
  });

  server.delete("/v1/subscriptions/:id", {
    schema: {
      tags: ["subscriptions"],
      description: "Soft-delete (deactivate) a subscription.",
      params: z.object({ id: z.string().uuid() }),
    },
  }, async (request, reply) => {
    const auth = request.partnerAuth!;
    if (auth.partner_type !== "platform") {
      return reply.status(403).send({
        error: { code: "FORBIDDEN", message: "Only platform partners can delete subscriptions" },
      });
    }

    const { id } = request.params as { id: string };

    const { data: existing } = await supabase
      .from("webhook_subscriptions")
      .select("publisher_id")
      .eq("id", id)
      .single();

    if (!existing || existing.publisher_id !== auth.partner_id) {
      return reply.status(404).send({
        error: { code: "NOT_FOUND", message: "Subscription not found" },
      });
    }

    await supabase
      .from("webhook_subscriptions")
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq("id", id);

    invalidateSubCache(auth.partner_id);

    return reply.status(204).send();
  });

  server.post("/v1/subscriptions/:id/test", {
    schema: {
      tags: ["subscriptions"],
      description: "Send a test webhook payload to verify the subscription endpoint is reachable.",
      params: z.object({ id: z.string().uuid() }),
    },
  }, async (request, reply) => {
    const auth = request.partnerAuth!;
    if (auth.partner_type !== "platform") {
      return reply.status(403).send({
        error: { code: "FORBIDDEN", message: "Only platform partners can test subscriptions" },
      });
    }

    const { id } = request.params as { id: string };

    const { data: sub } = await supabase
      .from("webhook_subscriptions")
      .select("*")
      .eq("id", id)
      .eq("publisher_id", auth.partner_id)
      .single();

    if (!sub) {
      return reply.status(404).send({
        error: { code: "NOT_FOUND", message: "Subscription not found" },
      });
    }

    const { data: publisher } = await supabase
      .from("partners")
      .select("org_name")
      .eq("id", auth.partner_id)
      .single();

    const deliveryId = `del_test_${randomUUID()}`;

    await enqueueDispatch({
      delivery_id: deliveryId,
      subscription_id: sub.id,
      endpoint_url: sub.endpoint_url,
      signing_secret: sub.signing_secret,
      event_type: "event.created",
      publisher: {
        partner_id: auth.partner_id,
        org_name: (publisher?.org_name as string) ?? "Test Publisher",
      },
      data: {
        source: { platform: "orgo-sync-test", external_id: `test_${randomUUID()}` },
        title: "Test Event — Webhook Verification",
        description: "This is a test payload to verify your webhook endpoint is configured correctly.",
        start: new Date().toISOString(),
        end: new Date(Date.now() + 3600000).toISOString(),
        duration_minutes: 60,
        all_day: false,
        is_tbd: false,
        is_canceled: false,
        status: "confirmed",
        timezone: "America/Chicago",
        location: {
          raw: "123 Test Ave, Austin TX 78702",
          venue_name: "Test Venue",
          address: "123 Test Ave, Austin TX 78702",
          coordinates: null,
          additional_details: null,
        },
        sport: {
          event_type: "practice",
          team_name: "Demo Panthers U12",
          opponent_name: null,
          uniform: null,
          early_arrival_minutes: 15,
          label: null,
          is_game: false,
        },
        participants: [],
        recurrence: null,
        notes: null,
      },
    });

    return reply.send({
      success: true,
      delivery_id: deliveryId,
      message: "Test webhook queued for delivery",
    });
  });
}
