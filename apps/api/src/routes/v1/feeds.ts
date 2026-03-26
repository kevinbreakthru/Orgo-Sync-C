import type { FastifyInstance } from "fastify";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { getServiceClient } from "../../lib/supabase.js";
import { generateIcsFeed } from "../../feeds/ics-generator.js";
import type { CanonicalEvent, LogisticsObject } from "@orgo-sync/schemas";

const CreateFeedSchema = z.object({
  name: z.string().min(1).max(200),
  branding: z
    .object({
      footer: z.string().max(200).optional(),
    })
    .optional(),
});

const PushEventsSchema = z.object({
  events: z.array(
    z.object({
      external_id: z.string().optional(),
      canonical_event: z.record(z.unknown()),
      logistics: z.record(z.unknown()).nullable().optional(),
    })
  ).min(1).max(500),
});

function generateToken(): string {
  return randomUUID().replace(/-/g, "").slice(0, 24);
}

export async function registerFeedRoutes(server: FastifyInstance) {
  // POST /v1/feeds — create a calendar feed
  server.post("/v1/feeds", {
    schema: {
      tags: ["feeds"],
      description: "Create a subscribable ICS calendar feed. Returns a public URL that calendar apps can subscribe to.",
      body: CreateFeedSchema,
    },
  }, async (request, reply) => {
    const auth = request.partnerAuth!;
    const input = request.body as z.infer<typeof CreateFeedSchema>;
    const supabase = getServiceClient();

    const token = generateToken();

    const { data, error } = await supabase
      .from("calendar_feeds")
      .insert({
        partner_id: auth.partner_id,
        token,
        name: input.name,
        branding: input.branding ?? {},
      })
      .select("id, token, name, created_at")
      .single();

    if (error) {
      server.log.error({ error }, "Failed to create feed");
      return reply.status(500).send({
        error: { code: "FEED_CREATE_FAILED", message: "Failed to create calendar feed" },
      });
    }

    const baseUrl = process.env.RAILWAY_PUBLIC_DOMAIN
      ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
      : `http://localhost:${process.env.PORT ?? 3001}`;

    return reply.status(201).send({
      success: true,
      feed: {
        id: data.id,
        name: data.name,
        token: data.token,
        subscribe_url: `${baseUrl}/v1/feeds/${data.token}.ics`,
        created_at: data.created_at,
      },
    });
  });

  // POST /v1/feeds/:feedId/events — push enriched events to a feed
  server.post("/v1/feeds/:feedId/events", {
    schema: {
      tags: ["feeds"],
      description: "Push enriched events to a calendar feed. Events with matching external_id are upserted.",
      params: z.object({ feedId: z.string().uuid() }),
      body: PushEventsSchema,
    },
  }, async (request, reply) => {
    const auth = request.partnerAuth!;
    const { feedId } = request.params as { feedId: string };
    const input = request.body as z.infer<typeof PushEventsSchema>;
    const supabase = getServiceClient();

    const { data: feed } = await supabase
      .from("calendar_feeds")
      .select("id, partner_id")
      .eq("id", feedId)
      .single();

    if (!feed || feed.partner_id !== auth.partner_id) {
      return reply.status(404).send({
        error: { code: "FEED_NOT_FOUND", message: "Calendar feed not found" },
      });
    }

    let upserted = 0;
    let inserted = 0;

    for (const ev of input.events) {
      if (ev.external_id) {
        const { data: existing } = await supabase
          .from("feed_events")
          .select("id")
          .eq("feed_id", feedId)
          .eq("external_id", ev.external_id)
          .single();

        if (existing) {
          await supabase
            .from("feed_events")
            .update({
              canonical_event: ev.canonical_event,
              logistics: ev.logistics ?? null,
              updated_at: new Date().toISOString(),
            })
            .eq("id", existing.id);
          upserted++;
        } else {
          await supabase.from("feed_events").insert({
            feed_id: feedId,
            external_id: ev.external_id,
            canonical_event: ev.canonical_event,
            logistics: ev.logistics ?? null,
          });
          inserted++;
        }
      } else {
        await supabase.from("feed_events").insert({
          feed_id: feedId,
          canonical_event: ev.canonical_event,
          logistics: ev.logistics ?? null,
        });
        inserted++;
      }
    }

    return reply.status(200).send({
      success: true,
      feed_id: feedId,
      inserted,
      updated: upserted,
      total_events: input.events.length,
    });
  });

  server.get("/v1/feeds/:token", {
    schema: {
      tags: ["feeds"],
      description: "Subscribe to a calendar feed. Returns text/calendar (ICS) format. No API key required — share this URL directly with end users.",
      params: z.object({ token: z.string() }),
    },
  }, async (request, reply) => {
    const raw = (request.params as { token: string }).token;
    const token = raw.replace(/\.ics$/, "");
    const supabase = getServiceClient();

    const { data: feed } = await supabase
      .from("calendar_feeds")
      .select("id, name, branding")
      .eq("token", token)
      .single();

    if (!feed) {
      return reply.status(404).send({
        error: { code: "FEED_NOT_FOUND", message: "Calendar feed not found" },
      });
    }

    const { data: events } = await supabase
      .from("feed_events")
      .select("canonical_event, logistics")
      .eq("feed_id", feed.id)
      .order("created_at", { ascending: true })
      .limit(500);

    const feedEvents = (events ?? []).map((row) => ({
      canonical_event: row.canonical_event as unknown as CanonicalEvent,
      logistics: (row.logistics as unknown as LogisticsObject["enrichment"]) ?? null,
    }));

    const branding = feed.branding as Record<string, string> | null;
    const ics = generateIcsFeed(feedEvents, {
      name: feed.name,
      branding: branding?.footer ? { footer: branding.footer } : undefined,
    });

    return reply
      .status(200)
      .header("Content-Type", "text/calendar; charset=utf-8")
      .header("Content-Disposition", `inline; filename="${token}.ics"`)
      .header("Cache-Control", "public, max-age=300")
      .send(ics);
  });
}
