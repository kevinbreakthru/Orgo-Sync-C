import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function main() {
  console.log("Creating calendar_feeds and feed_events tables...\n");

  const { error: e1 } = await sb.rpc("exec_sql" as string, {
    query: `
      CREATE TABLE IF NOT EXISTS calendar_feeds (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        partner_id uuid NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
        token text NOT NULL UNIQUE,
        name text NOT NULL,
        branding jsonb DEFAULT '{}'::jsonb,
        created_at timestamptz DEFAULT now()
      );

      CREATE INDEX IF NOT EXISTS idx_calendar_feeds_partner ON calendar_feeds(partner_id);
      CREATE INDEX IF NOT EXISTS idx_calendar_feeds_token ON calendar_feeds(token);

      ALTER TABLE calendar_feeds ENABLE ROW LEVEL SECURITY;
    `,
  });

  if (e1) {
    console.log("calendar_feeds via rpc failed, trying REST approach...");
  }

  // Check if table exists already
  const { error: check } = await sb.from("calendar_feeds").select("id").limit(1);
  if (check && check.message?.includes("does not exist")) {
    console.log("Tables don't exist yet. Creating via Supabase Management API...");
    console.log("Please run the following SQL in the Supabase SQL Editor:\n");
    console.log(SQL);
    process.exit(0);
  }

  if (!check) {
    console.log("calendar_feeds table already exists.");
  }

  const { error: check2 } = await sb.from("feed_events").select("id").limit(1);
  if (!check2) {
    console.log("feed_events table already exists.");
  }

  if (!check && !check2) {
    console.log("\nBoth tables are ready.");
  }
}

const SQL = `
-- Calendar feeds: a subscribable ICS endpoint per partner
CREATE TABLE IF NOT EXISTS calendar_feeds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  token text NOT NULL UNIQUE,
  name text NOT NULL,
  branding jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_calendar_feeds_partner ON calendar_feeds(partner_id);
CREATE INDEX IF NOT EXISTS idx_calendar_feeds_token ON calendar_feeds(token);

ALTER TABLE calendar_feeds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Partners manage own feeds"
  ON calendar_feeds FOR ALL
  USING (partner_id IN (
    SELECT id FROM partners WHERE user_id = auth.uid()
  ))
  WITH CHECK (partner_id IN (
    SELECT id FROM partners WHERE user_id = auth.uid()
  ));

CREATE POLICY "Service role full access feeds"
  ON calendar_feeds FOR ALL
  USING (auth.role() = 'service_role');

-- Feed events: enriched events persisted for ICS serving
CREATE TABLE IF NOT EXISTS feed_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  feed_id uuid NOT NULL REFERENCES calendar_feeds(id) ON DELETE CASCADE,
  external_id text,
  canonical_event jsonb NOT NULL,
  logistics jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_feed_events_feed ON feed_events(feed_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_feed_events_external ON feed_events(feed_id, external_id) WHERE external_id IS NOT NULL;

ALTER TABLE feed_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Partners manage own feed events"
  ON feed_events FOR ALL
  USING (feed_id IN (
    SELECT id FROM calendar_feeds WHERE partner_id IN (
      SELECT id FROM partners WHERE user_id = auth.uid()
    )
  ))
  WITH CHECK (feed_id IN (
    SELECT id FROM calendar_feeds WHERE partner_id IN (
      SELECT id FROM partners WHERE user_id = auth.uid()
    )
  ));

CREATE POLICY "Service role full access feed events"
  ON feed_events FOR ALL
  USING (auth.role() = 'service_role');
`;

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
