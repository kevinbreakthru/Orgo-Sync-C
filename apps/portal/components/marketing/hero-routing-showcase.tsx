"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const RAW_JSON = `{
  "source": "YourApp",
  "event_type": "game",
  "program_name": "U14 Boys Premier",
  "opponent": "FC Academy",
  "location": "Riverside Sports Complex",
  "start_time": "2026-03-28T14:00:00",
  "timezone": "America/New_York"
}`;

const CANONICAL_JSON = `{
  "external_id": "la_evt_8291",
  "title": "U14 Boys Premier vs FC Academy",
  "start_time": "2026-03-28T14:00:00-04:00",
  "location": {
    "name": "Riverside Sports Complex",
    "lat": 40.7291,
    "lng": -74.0028
  },
  "sport": {
    "team_name": "U14 Boys Premier",
    "opponent_name": "FC Academy"
  }
}`;

const ENDPOINTS = [
  { name: "FanApp Staging", url: "fanapp.dev/hooks/schedule" },
  { name: "CoachBoard", url: "api.coachboard.io/ingest" },
  { name: "CalSync Pro", url: "calsync.pro/webhooks/orgo" },
];

const PHASE_TIMING = { raw: 2800, canonical: 3200, dispatch: 4600 };
const TOTAL_CYCLE = PHASE_TIMING.raw + PHASE_TIMING.canonical + PHASE_TIMING.dispatch + 2000;

type Phase = "raw" | "canonical" | "dispatch";

const fadeVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export function HeroRoutingShowcase() {
  const [phase, setPhase] = useState<Phase>("raw");
  const [deliveredCount, setDeliveredCount] = useState(0);

  useEffect(() => {
    let mounted = true;
    function cycle() {
      if (!mounted) return;
      setPhase("raw");
      setDeliveredCount(0);

      setTimeout(() => { if (mounted) setPhase("canonical"); }, PHASE_TIMING.raw);
      setTimeout(() => { if (mounted) setPhase("dispatch"); }, PHASE_TIMING.raw + PHASE_TIMING.canonical);
      setTimeout(() => { if (mounted) setDeliveredCount(1); }, PHASE_TIMING.raw + PHASE_TIMING.canonical + 800);
      setTimeout(() => { if (mounted) setDeliveredCount(2); }, PHASE_TIMING.raw + PHASE_TIMING.canonical + 1500);
      setTimeout(() => { if (mounted) setDeliveredCount(3); }, PHASE_TIMING.raw + PHASE_TIMING.canonical + 2200);
    }
    cycle();
    const interval = setInterval(cycle, TOTAL_CYCLE);
    return () => { mounted = false; clearInterval(interval); };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="hero-showcase"
    >
      <div className="hero-showcase-chrome">
        <div className="hero-showcase-dots">
          <span style={{ background: "#FF5F57" }} />
          <span style={{ background: "#FFBD2E" }} />
          <span style={{ background: "#28C840" }} />
        </div>
        <div className="hero-showcase-title">orgo-sync — routing pipeline</div>
      </div>

      <div className="hero-showcase-body">
        <div className="hero-showcase-status">
          <span className={`hero-showcase-step ${phase === "raw" ? "active" : "done"}`}>
            Ingest
          </span>
          <span className="hero-showcase-arrow">→</span>
          <span className={`hero-showcase-step ${phase === "canonical" ? "active" : phase === "dispatch" ? "done" : ""}`}>
            Normalize
          </span>
          <span className="hero-showcase-arrow">→</span>
          <span className={`hero-showcase-step ${phase === "dispatch" ? "active" : ""}`}>
            Dispatch
          </span>
        </div>

        {/* Fixed-height container — content animates inside without shifting layout */}
        <div className="hero-showcase-stage">
          <AnimatePresence mode="popLayout">
            {phase === "raw" && (
              <motion.div
                key="raw"
                className="hero-showcase-stage-inner"
                variants={fadeVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.35, ease: "easeInOut" }}
              >
                <div className="hero-showcase-label">
                  <span className="hero-showcase-badge-source">YourApp</span>
                  Raw webhook payload
                </div>
                <pre className="hero-showcase-pre">{RAW_JSON}</pre>
              </motion.div>
            )}

            {phase === "canonical" && (
              <motion.div
                key="canonical"
                className="hero-showcase-stage-inner"
                variants={fadeVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.35, ease: "easeInOut" }}
              >
                <div className="hero-showcase-label">
                  <span className="hero-showcase-badge-orgo">Canonical</span>
                  Orgo Sync standard
                </div>
                <pre className="hero-showcase-pre">{CANONICAL_JSON}</pre>
              </motion.div>
            )}

            {phase === "dispatch" && (
              <motion.div
                key="dispatch"
                className="hero-showcase-stage-inner"
                variants={fadeVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.35, ease: "easeInOut" }}
              >
                <div className="hero-showcase-label">Dispatching webhooks&hellip;</div>
                <div className="hero-showcase-endpoints">
                  {ENDPOINTS.map((ep, i) => (
                    <div key={ep.name} className="hero-showcase-endpoint">
                      <span className="hero-showcase-ep-name">{ep.name}</span>
                      <span className="hero-showcase-ep-url">{ep.url}</span>
                      {deliveredCount > i ? (
                        <motion.span
                          className="hero-showcase-ep-ok"
                          initial={{ opacity: 0, scale: 0.85 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                          200 OK
                        </motion.span>
                      ) : (
                        <span className="hero-showcase-ep-pending">pending</span>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
