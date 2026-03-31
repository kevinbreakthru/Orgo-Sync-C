"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { PageHeader } from "../../../../components/shared/page-header";
import {
  Check, AlertTriangle, Pencil, ArrowRight, Sparkles, Loader2,
} from "lucide-react";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

const YOURAPP_SAMPLE = {
  meta: {
    api_version: "2.4.1",
    organization_id: "org_8271",
    organization_name: "Austin Youth Sports Association",
    sport_program: "Spring Soccer 2026",
    season_id: "ssn_4019",
    export_timestamp: "2026-04-02T08:15:33-05:00",
  },
  event: {
    event_id: "evt_928371",
    event_type: "game",
    event_subtype: "league_play",
    event_status: "confirmed",
    event_visibility: "public",
    program_id: "prg_2847",
    program_name: "U12 Competitive Soccer",
    division_id: "div_1093",
    division_name: "Gold Division",
    season_name: "Spring 2026",
    game_number: 14,
    round: "Regular Season",
    title: "Panthers vs Tigers — Game 14",
    description:
      "League game. Home team wears dark kit. Arrive 25 min early for warm-up.",
    start_datetime: "2026-04-05T10:00:00-05:00",
    end_datetime: "2026-04-05T11:30:00-05:00",
    duration_minutes: 90,
    timezone_iana: "America/Chicago",
    all_day: false,
    is_cancelled: false,
    is_postponed: false,
    reschedule_note: null,
  },
  location: {
    location_id: "loc_7723",
    facility_name: "Riverside Athletic Complex",
    field_name: "Field 4",
    street_address: "4500 River Rd",
    city: "Austin",
    state: "TX",
    zip_code: "78702",
    country: "US",
    full_address: "4500 River Rd, Austin, TX 78702",
    latitude: 30.2672,
    longitude: -97.7431,
    parking_notes: "Lot B — enter from south gate",
    surface_type: "natural_grass",
    is_indoor: false,
    field_notes: "Cleats required. No metal studs.",
  },
  home_team: {
    team_id: "tm_4481",
    team_name: "Austin Panthers",
    team_abbreviation: "PAN",
    division: "Gold",
    coach_name: "Maria Santos",
    coach_email: "m.santos@austinpanthers.org",
    coach_phone: "+1-512-555-0147",
    team_color_primary: "#1B3A5C",
    team_color_secondary: "#FFFFFF",
    uniform_home: "Navy blue home kit",
    uniform_away: "White away kit",
    roster_size: 16,
  },
  away_team: {
    team_id: "tm_4502",
    team_name: "Hill Country Tigers",
    team_abbreviation: "TGR",
    division: "Gold",
    coach_name: "James Whitfield",
    coach_email: "j.whitfield@hctigers.org",
    uniform_home: "Orange and black stripes",
    uniform_away: "White with orange trim",
    roster_size: 14,
  },
  logistics: {
    arrive_early_minutes: 25,
    warm_up_minutes: 15,
    halftime_minutes: 10,
    officials_assigned: true,
    referee_name: "David Park",
    referee_certification: "Grade 7",
    required_equipment: ["cleats", "shin_guards", "water_bottle"],
    concessions_available: true,
    restrooms_available: true,
  },
  registration: {
    registration_id: "reg_18294",
    registration_status: "confirmed",
    payment_status: "paid",
    amount_cents: 35000,
    currency: "USD",
    registered_at: "2026-01-15T09:30:00-06:00",
    waiver_signed: true,
    medical_form_on_file: true,
  },
};

const YOURAPP_JSON = JSON.stringify(YOURAPP_SAMPLE, null, 2);

interface FieldMapping {
  source: string;
  target: string;
  confidence: number;
  status: "auto" | "reviewed" | "manual";
  sourceLine?: number;
}

const FIELD_MAPPINGS: FieldMapping[] = [
  { source: "event.event_id", target: "source.external_id", confidence: 99, status: "auto" },
  { source: "meta.organization_name", target: "source.platform", confidence: 97, status: "auto" },
  { source: "event.title", target: "title", confidence: 99, status: "auto" },
  { source: "event.description", target: "description", confidence: 98, status: "auto" },
  { source: "event.start_datetime", target: "start", confidence: 99, status: "auto" },
  { source: "event.end_datetime", target: "end", confidence: 99, status: "auto" },
  { source: "event.duration_minutes", target: "duration_minutes", confidence: 99, status: "auto" },
  { source: "event.all_day", target: "all_day", confidence: 99, status: "auto" },
  { source: "event.is_cancelled", target: "is_canceled", confidence: 97, status: "auto" },
  { source: "event.event_status", target: "status", confidence: 95, status: "auto" },
  { source: "event.timezone_iana", target: "timezone", confidence: 99, status: "auto" },
  { source: "event.description", target: "notes", confidence: 82, status: "manual" },
  { source: "location.full_address", target: "location.raw", confidence: 96, status: "auto" },
  { source: "location.facility_name", target: "location.venue_name", confidence: 97, status: "auto" },
  { source: "location.street_address+city+state+zip_code", target: "location.address", confidence: 94, status: "reviewed" },
  { source: "location.latitude", target: "location.coordinates.lat", confidence: 99, status: "auto" },
  { source: "location.longitude", target: "location.coordinates.lng", confidence: 99, status: "auto" },
  { source: "location.field_notes+parking_notes", target: "location.additional_details", confidence: 88, status: "reviewed" },
  { source: "event.event_type", target: "sport.event_type", confidence: 96, status: "auto" },
  { source: "home_team.team_name", target: "sport.team_name", confidence: 94, status: "auto" },
  { source: "away_team.team_name", target: "sport.opponent_name", confidence: 93, status: "auto" },
  { source: "home_team.uniform_home", target: "sport.uniform", confidence: 91, status: "auto" },
  { source: "logistics.arrive_early_minutes", target: "sport.early_arrival_minutes", confidence: 98, status: "auto" },
  { source: "event.program_name", target: "sport.label", confidence: 86, status: "reviewed" },
  { source: "event.event_type=='game'", target: "sport.is_game", confidence: 97, status: "auto" },
  { source: "home_team.coach_name", target: "participants[0].name", confidence: 89, status: "reviewed" },
  { source: "'coach'", target: "participants[0].role", confidence: 99, status: "auto" },
  { source: "event.is_postponed", target: "is_tbd", confidence: 84, status: "manual" },
  { source: "location.surface_type", target: "meta.surface_type", confidence: 78, status: "manual" },
  { source: "location.is_indoor", target: "meta.is_indoor", confidence: 92, status: "auto" },
  { source: "home_team.team_color_primary", target: "meta.team_color", confidence: 85, status: "reviewed" },
  { source: "home_team.roster_size", target: "meta.roster_size", confidence: 90, status: "auto" },
  { source: "logistics.required_equipment", target: "meta.equipment", confidence: 87, status: "reviewed" },
  { source: "logistics.officials_assigned", target: "meta.has_officials", confidence: 91, status: "auto" },
  { source: "logistics.referee_name", target: "meta.referee", confidence: 88, status: "auto" },
  { source: "event.game_number", target: "meta.game_number", confidence: 95, status: "auto" },
  { source: "event.round", target: "meta.round", confidence: 93, status: "auto" },
  { source: "event.division_name", target: "meta.division", confidence: 94, status: "auto" },
  { source: "event.season_name", target: "meta.season", confidence: 96, status: "auto" },
  { source: "registration.registration_status", target: "meta.registration_status", confidence: 90, status: "auto" },
  { source: "registration.payment_status", target: "meta.payment_status", confidence: 89, status: "auto" },
  { source: "registration.waiver_signed", target: "meta.waiver_signed", confidence: 92, status: "auto" },
  { source: "registration.medical_form_on_file", target: "meta.medical_cleared", confidence: 86, status: "reviewed" },
  { source: "home_team.coach_email", target: "meta.coach_contact", confidence: 88, status: "auto" },
  { source: "meta.sport_program", target: "meta.program_name", confidence: 95, status: "auto" },
  { source: "meta.season_id", target: "meta.season_id", confidence: 99, status: "auto" },
  { source: "meta.organization_id", target: "meta.org_id", confidence: 99, status: "auto" },
  { source: "location.location_id", target: "meta.venue_id", confidence: 97, status: "auto" },
  { source: "home_team.team_id", target: "meta.home_team_id", confidence: 99, status: "auto" },
  { source: "away_team.team_id", target: "meta.away_team_id", confidence: 99, status: "auto" },
  { source: "event.event_subtype", target: "meta.event_subtype", confidence: 91, status: "auto" },
  { source: "event.event_visibility", target: "meta.visibility", confidence: 93, status: "auto" },
  { source: "logistics.concessions_available", target: "meta.concessions", confidence: 88, status: "auto" },
];

const avgConfidence = Math.round(
  FIELD_MAPPINGS.reduce((sum, m) => sum + m.confidence, 0) / FIELD_MAPPINGS.length
);
const autoCount = FIELD_MAPPINGS.filter((m) => m.status === "auto").length;
const reviewedCount = FIELD_MAPPINGS.filter((m) => m.status === "reviewed").length;
const manualCount = FIELD_MAPPINGS.filter((m) => m.status === "manual").length;
const highConfidence = FIELD_MAPPINGS.filter((m) => m.confidence >= 90).length;

function confidenceBadge(score: number) {
  if (score >= 95)
    return "bg-green-500/15 text-green-400 border-green-500/20";
  if (score >= 85)
    return "bg-accent-amber/15 text-accent-amber border-accent-amber/20";
  return "bg-red-500/15 text-red-400 border-red-500/20";
}

function StatusIcon({ status }: { status: FieldMapping["status"] }) {
  switch (status) {
    case "auto":
      return (
        <span className="inline-flex items-center gap-1 text-[10px] text-green-400 font-medium uppercase tracking-wider">
          <Check size={10} strokeWidth={2.5} /> Auto
        </span>
      );
    case "reviewed":
      return (
        <span className="inline-flex items-center gap-1 text-[10px] text-accent-amber font-medium uppercase tracking-wider">
          <AlertTriangle size={10} strokeWidth={2.5} /> Review
        </span>
      );
    case "manual":
      return (
        <span className="inline-flex items-center gap-1 text-[10px] text-red-400 font-medium uppercase tracking-wider">
          <Pencil size={10} strokeWidth={2.5} /> Manual
        </span>
      );
  }
}

type Phase = "analyzing" | "mapping" | "done";

function findSourceLine(fieldPath: string): number | undefined {
  const key = fieldPath.split(".").pop()?.split("+")[0]?.replace(/[^a-zA-Z_]/g, "");
  if (!key) return undefined;
  const lines = YOURAPP_JSON.split("\n");
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(`"${key}"`)) return i + 1;
  }
  return undefined;
}

const mappingsWithLines = FIELD_MAPPINGS.map((m) => ({
  ...m,
  sourceLine: findSourceLine(m.source),
}));

export default function MappingsPage() {
  const [phase, setPhase] = useState<Phase>("analyzing");
  const [visibleRows, setVisibleRows] = useState(0);
  const editorRef = useRef<{ revealLineInCenter: (line: number) => void } | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setPhase("mapping"), 500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (phase !== "mapping") return;
    if (visibleRows >= mappingsWithLines.length) {
      setPhase("done");
      return;
    }
    const t = setTimeout(() => setVisibleRows((v) => v + 1), 12);
    return () => clearTimeout(t);
  }, [phase, visibleRows]);

  const handleRowHover = useCallback((line: number | undefined) => {
    if (line && editorRef.current) {
      editorRef.current.revealLineInCenter(line);
    }
  }, []);

  return (
    <div>
      <PageHeader
        title="Schema Mapping"
        description={`YourApp data format — ${FIELD_MAPPINGS.length} fields mapped to the Canonical Schema.`}
      >
        <span className="inline-flex items-center gap-1.5 rounded-md border border-neutral-700 bg-neutral-800 px-2.5 py-1 text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
          <Sparkles size={10} className="text-accent-amber" />
          Phase 2 Preview
        </span>
      </PageHeader>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="dark-card rounded-xl border border-neutral-800/60 p-4">
          <div className="text-display-sm text-white tabular-nums">{FIELD_MAPPINGS.length}</div>
          <div className="text-caption text-neutral-500 mt-1">Fields Mapped</div>
        </div>
        <div className="dark-card rounded-xl border border-neutral-800/60 p-4">
          <div className="text-display-sm text-green-400 tabular-nums">{avgConfidence}%</div>
          <div className="text-caption text-neutral-500 mt-1">Avg Confidence</div>
        </div>
        <div className="dark-card rounded-xl border border-neutral-800/60 p-4">
          <div className="text-display-sm text-accent-teal tabular-nums">{autoCount}</div>
          <div className="text-caption text-neutral-500 mt-1">Auto-Mapped</div>
        </div>
        <div className="dark-card rounded-xl border border-neutral-800/60 p-4">
          <div className="text-display-sm text-accent-amber tabular-nums">{reviewedCount}</div>
          <div className="text-caption text-neutral-500 mt-1">Needs Review</div>
        </div>
        <div className="dark-card rounded-xl border border-neutral-800/60 p-4">
          <div className="text-display-sm text-red-400 tabular-nums">{manualCount}</div>
          <div className="text-caption text-neutral-500 mt-1">Manual Override</div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-neutral-800 bg-neutral-900 text-[11px] font-mono text-neutral-400">
          YourApp <ArrowRight size={10} className="text-neutral-600 mx-1" /> Orgo Canonical Schema
        </div>
        <div className="text-body-sm text-neutral-500">
          {highConfidence}/{FIELD_MAPPINGS.length} fields above 90%
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-6">
        <div className="dark-card-deeper rounded-2xl border border-neutral-800/60 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-800/60 bg-neutral-900/50">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent-amber" />
              <span className="text-code text-neutral-400">YourApp Event Payload</span>
            </div>
            <span className="text-[10px] font-mono text-neutral-600 bg-neutral-800 px-2 py-0.5 rounded">
              READ ONLY
            </span>
          </div>
          <MonacoEditor
            height="640px"
            language="json"
            theme="vs-dark"
            value={YOURAPP_JSON}
            onMount={(editor) => {
              editorRef.current = editor;
            }}
            options={{
              readOnly: true,
              minimap: { enabled: false },
              fontSize: 12,
              fontFamily: "var(--font-mono), 'JetBrains Mono', monospace",
              lineNumbers: "on",
              lineNumbersMinChars: 3,
              scrollBeyondLastLine: false,
              wordWrap: "on",
              padding: { top: 12 },
              renderLineHighlight: "none",
              folding: true,
              guides: { indentation: true },
              overviewRulerBorder: false,
              scrollbar: { verticalSliderSize: 4 },
            }}
          />
        </div>

        <div className="dark-card rounded-2xl border border-neutral-800/60 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-800/60">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent-teal" />
              <span className="text-code text-neutral-400">Field Mappings</span>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-mono text-neutral-600">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" /> &ge;95%
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-amber" /> 85-94%
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" /> &lt;85%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-[1fr_20px_1fr_56px_56px] gap-1.5 px-5 py-2.5 border-b border-neutral-800/40 text-[10px] font-mono uppercase tracking-wider text-neutral-600">
            <span>Source</span>
            <span />
            <span>Target</span>
            <span className="text-center">Score</span>
            <span className="text-center">Type</span>
          </div>

          {phase === "analyzing" && (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 size={24} className="text-accent-teal animate-spin" />
              <span className="text-code text-sm text-neutral-400 animate-pulse">
                Analyzing field structure...
              </span>
            </div>
          )}

          <div className="overflow-y-auto max-h-[576px] divide-y divide-neutral-800/30">
            {mappingsWithLines.slice(0, visibleRows).map((m, i) => (
              <div
                key={i}
                onMouseEnter={() => handleRowHover(m.sourceLine)}
                onMouseLeave={() => handleRowHover(undefined)}
                className="grid grid-cols-[1fr_20px_1fr_56px_56px] gap-1.5 items-center px-5 py-2 hover:bg-neutral-800/30 transition-colors cursor-default"
              >
                <code className="text-xs font-mono text-accent-amber/80 truncate" title={m.source}>
                  {m.source}
                </code>

                <div className="flex justify-center">
                  <ArrowRight size={12} className="text-neutral-700" />
                </div>

                <code className="text-xs font-mono text-accent-teal truncate" title={m.target}>
                  {m.target}
                </code>

                <div className="flex justify-center">
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono border tabular-nums ${confidenceBadge(m.confidence)}`}
                  >
                    {m.confidence}%
                  </span>
                </div>

                <div className="flex justify-center">
                  <StatusIcon status={m.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {phase === "done" && (
        <div className="dark-card rounded-2xl border border-neutral-800/60 p-5 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="text-body-sm text-neutral-400">
              <span className="font-medium text-white">{FIELD_MAPPINGS.length} mappings</span> analyzed &middot;{" "}
              {autoCount} auto-mapped &middot; {reviewedCount + manualCount} need human review
            </div>
            <div className="flex gap-3">
              <button
                disabled
                className="px-4 py-2 rounded-lg border border-neutral-700 text-body-sm text-neutral-400 cursor-not-allowed opacity-60"
              >
                Review Individually
              </button>
              <button
                disabled
                className="px-4 py-2 rounded-lg bg-accent-teal text-white text-body-sm font-medium cursor-not-allowed opacity-60"
              >
                Approve {FIELD_MAPPINGS.length} Mappings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
