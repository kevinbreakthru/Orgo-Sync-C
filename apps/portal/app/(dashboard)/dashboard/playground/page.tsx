"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { PageHeader } from "../../../../components/shared/page-header";
import { Badge } from "../../../../components/ui/badge";
import { cn } from "../../../../lib/utils";
import { PipelineStepper } from "../../../../components/playground/pipeline-stepper";
import { Send, Circle, Loader2 } from "lucide-react";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

const EXAMPLES = {
  publish: {
    label: "Publish (Real-Time)",
    endpoint: "/v1/publish",
    body: JSON.stringify(
      {
        events: [
          {
            action: "created",
            source: "teamsnap",
            payload: {
              id: 12345,
              name: "Practice",
              team_name: "Springfield Thunder U12",
              start_date: "2026-03-28T16:00:00-05:00",
              end_date: "2026-03-28T17:30:00-05:00",
              duration_in_minutes: 90,
              is_game: false,
              game_type: "practice",
              location_name: "Lincoln Park Field 3",
              additional_location_details:
                "Parking lot B, enter from Oak Street",
              uniform: "Blue practice jersey",
              minutes_to_arrive_early: 15,
              time_zone_iana_name: "America/Chicago",
              location: {
                address: "1601 N LaSalle Dr, Chicago, IL 60614",
                latitude: 41.9117,
                longitude: -87.6354,
              },
            },
          },
        ],
      },
      null,
      2
    ),
  },
  teamsnap: {
    label: "TeamSnap Ingest",
    endpoint: "/v1/ingest",
    body: JSON.stringify(
      {
        source: "teamsnap",
        enrich: false,
        payload: {
          id: 12345,
          name: "Practice",
          team_name: "Springfield Thunder U12",
          start_date: "2026-03-28T16:00:00-05:00",
          end_date: "2026-03-28T17:30:00-05:00",
          duration_in_minutes: 90,
          is_game: false,
          game_type: "practice",
          location_name: "Lincoln Park Field 3",
          additional_location_details:
            "Parking lot B, enter from Oak Street",
          uniform: "Blue practice jersey",
          minutes_to_arrive_early: 15,
          time_zone_iana_name: "America/Chicago",
          location: {
            address: "1601 N LaSalle Dr, Chicago, IL 60614",
            latitude: 41.9117,
            longitude: -87.6354,
          },
        },
      },
      null,
      2
    ),
  },
  structured: {
    label: "Normalize JSON",
    endpoint: "/v1/ingest",
    body: JSON.stringify(
      {
        source: "json",
        enrich: false,
        payload: {
          source: { platform: "yourapp", external_id: "evt_90210" },
          title: "U12 Soccer vs Eagles",
          start: "2026-03-28T14:00:00-05:00",
          end: "2026-03-28T15:30:00-05:00",
          duration_minutes: 90,
          location: {
            raw: "Memorial Stadium, 123 Oak St, Springfield IL",
          },
          sport: {
            event_type: "game",
            team_name: "Springfield Thunder",
            opponent_name: "Eagles",
            uniform: "White jerseys",
            early_arrival_minutes: 30,
          },
        },
      },
      null,
      2
    ),
  },
};

type ExampleKey = keyof typeof EXAMPLES;

export default function PlaygroundPage() {
  const [activeExample, setActiveExample] = useState<ExampleKey>("publish");
  const [apiKey, setApiKey] = useState("");
  const [requestBody, setRequestBody] = useState(EXAMPLES.publish.body);
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [statusCode, setStatusCode] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState<number | null>(null);
  const [pipelineActive, setPipelineActive] = useState(false);
  const [displayResponse, setDisplayResponse] = useState("");
  const rawResponseRef = useRef("");
  const typewriterRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function isNormalizeOnly(): boolean {
    try {
      const parsed = JSON.parse(requestBody);
      return parsed.enrich === false;
    } catch { return false; }
  }

  function typewriterReveal(json: string) {
    const lines = json.split("\n");
    let idx = 0;
    setDisplayResponse("");

    const tick = () => {
      if (idx >= lines.length) return;
      idx++;
      setDisplayResponse(lines.slice(0, idx).join("\n"));
      typewriterRef.current = setTimeout(tick, Math.max(6, 400 / lines.length));
    };
    tick();
  }

  function selectExample(key: ExampleKey) {
    setActiveExample(key);
    setRequestBody(EXAMPLES[key].body);
    setResponse("");
    setDisplayResponse("");
    setStatusCode(null);
    setElapsed(null);
    setPipelineActive(false);
    if (typewriterRef.current) clearTimeout(typewriterRef.current);
  }

  const sendRequest = useCallback(async () => {
    if (!apiKey) {
      const errJson = JSON.stringify(
        { error: { code: "MISSING_KEY", message: "Enter your API key above" } },
        null,
        2
      );
      setResponse(errJson);
      setDisplayResponse(errJson);
      setStatusCode(400);
      return;
    }

    setLoading(true);
    setResponse("");
    setDisplayResponse("");
    setElapsed(null);
    setStatusCode(null);
    setPipelineActive(true);
    rawResponseRef.current = "";

    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
    const endpoint = EXAMPLES[activeExample].endpoint;
    const start = performance.now();

    try {
      const res = await fetch(`${apiUrl}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": apiKey,
        },
        body: requestBody,
      });

      setStatusCode(res.status);
      const data = await res.json();
      rawResponseRef.current = JSON.stringify(data, null, 2);
      setResponse(rawResponseRef.current);
      setElapsed(Math.round(performance.now() - start));
    } catch (err) {
      rawResponseRef.current = JSON.stringify(
        { error: { message: (err as Error).message } },
        null,
        2
      );
      setResponse(rawResponseRef.current);
      setStatusCode(0);
      setElapsed(Math.round(performance.now() - start));
    } finally {
      setLoading(false);
    }
  }, [apiKey, activeExample, requestBody]);

  const handlePipelineComplete = useCallback(() => {
    setPipelineActive(false);
    if (rawResponseRef.current) {
      typewriterReveal(rawResponseRef.current);
    }
  }, []);

  return (
    <div>
      <PageHeader
        title="API Playground"
        description="Test the real-time translation and routing API with pre-loaded examples."
      />

      <div className="dark-card rounded-xl border border-neutral-800/60 p-4 mb-5 flex items-center gap-3">
        <span className="text-code text-neutral-500 shrink-0">X-API-Key:</span>
        <input
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="flex-1 bg-transparent text-code text-white placeholder:text-neutral-600 outline-none"
          placeholder="sk_test_..."
          spellCheck={false}
        />
      </div>

      <div className="dark-card-deeper rounded-2xl border border-neutral-800/60 overflow-hidden">
        {/* Terminal chrome */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-800/60">
          <div className="flex items-center gap-2">
            <Circle size={10} className="text-red-500 fill-red-500" />
            <Circle size={10} className="text-yellow-500 fill-yellow-500" />
            <Circle size={10} className="text-green-500 fill-green-500" />
            <span className="ml-3 text-code text-neutral-500">orgo-sync-playground</span>
          </div>
          <button
            onClick={sendRequest}
            disabled={loading}
            className={cn(
              "flex items-center gap-2 px-4 py-1.5 rounded-lg text-code transition-all",
              loading
                ? "bg-neutral-800 text-neutral-500 cursor-wait"
                : "bg-brand-600 text-white hover:bg-brand-500"
            )}
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Send size={14} />
                <span>Send Request</span>
              </>
            )}
          </button>
        </div>

        <div className="flex items-center gap-0 border-b border-neutral-800/60 px-1 bg-neutral-950">
          {(
            Object.entries(EXAMPLES) as [ExampleKey, (typeof EXAMPLES)[ExampleKey]][]
          ).map(([key, ex]) => (
            <button
              key={key}
              onClick={() => selectExample(key)}
              className={cn(
                "px-4 py-2.5 text-code transition-colors relative",
                activeExample === key
                  ? "text-white"
                  : "text-neutral-600 hover:text-neutral-400"
              )}
            >
              {ex.label}
              {activeExample === key && (
                <span className="absolute bottom-0 left-0 right-0 h-px bg-brand-500" />
              )}
            </button>
          ))}
        </div>

        <PipelineStepper
          active={pipelineActive}
          normalizeOnly={isNormalizeOnly()}
          onComplete={handlePipelineComplete}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-neutral-800/60">
          <div>
            <div className="flex items-center gap-3 px-5 py-2.5 border-b border-neutral-800/40 bg-neutral-900/50">
              <span className="text-code text-brand-400">POST</span>
              <span className="text-code text-neutral-400">{EXAMPLES[activeExample].endpoint}</span>
            </div>
            <MonacoEditor
              height="420px"
              language="json"
              theme="vs-dark"
              value={requestBody}
              onChange={(v) => setRequestBody(v ?? "")}
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                fontFamily: "var(--font-mono), 'JetBrains Mono', 'Fira Code', monospace",
                lineNumbers: "on",
                lineNumbersMinChars: 3,
                scrollBeyondLastLine: false,
                wordWrap: "on",
                padding: { top: 12 },
                renderLineHighlight: "none",
                overviewRulerBorder: false,
                hideCursorInOverviewRuler: true,
                scrollbar: { verticalSliderSize: 4, horizontalSliderSize: 4 },
              }}
            />
          </div>

          <div>
            <div className="flex items-center gap-3 px-5 py-2.5 border-b border-neutral-800/40 bg-neutral-900/50">
              <span className="text-code text-neutral-500">Response</span>
              {statusCode !== null && (
                <Badge
                  variant={
                    statusCode >= 200 && statusCode < 300 ? "success" : "destructive"
                  }
                  className="font-mono"
                >
                  {statusCode}
                </Badge>
              )}
              {elapsed !== null && (
                <span className="text-code text-neutral-600">{elapsed}ms</span>
              )}
            </div>
            <MonacoEditor
              height="420px"
              language="json"
              theme="vs-dark"
              value={displayResponse || ""}
              options={{
                readOnly: true,
                minimap: { enabled: false },
                fontSize: 13,
                fontFamily: "var(--font-mono), 'JetBrains Mono', 'Fira Code', monospace",
                lineNumbers: "on",
                lineNumbersMinChars: 3,
                scrollBeyondLastLine: false,
                wordWrap: "on",
                padding: { top: 12 },
                renderLineHighlight: "none",
                overviewRulerBorder: false,
                hideCursorInOverviewRuler: true,
                scrollbar: { verticalSliderSize: 4, horizontalSliderSize: 4 },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
