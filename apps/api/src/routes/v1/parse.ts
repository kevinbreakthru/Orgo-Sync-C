import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { IcsAdapter } from "../../adapters/ics.adapter.js";

const ParseRequestSchema = z.object({
  ics: z.string().min(1),
});

export async function registerParseRoute(server: FastifyInstance) {
  const icsAdapter = new IcsAdapter();

  server.post("/v1/parse", {
    schema: {
      tags: ["parse"],
      description: "Parse an ICS/iCal string into Orgo Canonical Events (no external API calls)",
      body: ParseRequestSchema,
    },
  }, async (request) => {
    const { ics } = request.body as z.infer<typeof ParseRequestSchema>;
    const { events, warnings } = await icsAdapter.normalize(ics);

    return {
      success: true,
      events,
      event_count: events.length,
      source: "ics",
      ...(warnings.length > 0 && { warnings }),
    };
  });
}
