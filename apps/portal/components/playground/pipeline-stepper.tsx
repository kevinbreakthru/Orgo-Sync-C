"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Webhook,
  FileText,
  ListChecks,
  Send,
  CheckCircle2,
  Loader2,
} from "lucide-react";
const easeOut = [0.16, 1, 0.3, 1] as const;

interface PipelineStep {
  id: string;
  label: string;
  icon: React.ElementType;
  durationMs: number;
}

const ROUTING_PIPELINE: PipelineStep[] = [
  { id: "catch", label: "Catch webhook payload", icon: Webhook, durationMs: 100 },
  { id: "standardize", label: "Standardize to Canonical Schema", icon: FileText, durationMs: 160 },
  { id: "queue", label: "Queue for dispatch", icon: ListChecks, durationMs: 120 },
  { id: "deliver", label: "Deliver to builder endpoint", icon: Send, durationMs: 140 },
];

type StepState = "pending" | "active" | "complete" | "skipped";

interface PipelineStepperProps {
  active: boolean;
  normalizeOnly?: boolean; // kept for API compat, ignored
  onComplete: () => void;
}

const stepVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.15, ease: easeOut },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.1 },
  },
};

const checkVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 400, damping: 20 },
  },
};

export function PipelineStepper({
  active,
  normalizeOnly = false,
  onComplete,
}: PipelineStepperProps) {
  const steps = ROUTING_PIPELINE;
  const [stepStates, setStepStates] = useState<Map<string, StepState>>(new Map());
  const [currentIdx, setCurrentIdx] = useState(-1);
  const [done, setDone] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!active) {
      setStepStates(new Map());
      setCurrentIdx(-1);
      setDone(false);
      return;
    }

    const initial = new Map<string, StepState>();
    steps.forEach((s) => initial.set(s.id, "pending"));
    setStepStates(initial);

    let idx = 0;

    const runStep = () => {
      if (idx >= steps.length) {
        setDone(true);
        setTimeout(onComplete, 200);
        return;
      }

      const step = steps[idx];
      setCurrentIdx(idx);
      setStepStates((prev) => {
        const next = new Map(prev);
        next.set(step.id, "active");
        return next;
      });

      timerRef.current = setTimeout(() => {
        setStepStates((prev) => {
          const next = new Map(prev);
          next.set(step.id, "complete");
          return next;
        });
        idx++;
        setTimeout(runStep, 40);
      }, step.durationMs);
    };

    const startDelay = setTimeout(runStep, 60);

    return () => {
      clearTimeout(startDelay);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [active]);

  if (!active && stepStates.size === 0) return null;

  const progress = steps.length > 0
    ? (steps.filter((s) => stepStates.get(s.id) === "complete").length / steps.length) * 100
    : 0;

  return (
    <AnimatePresence>
      {(active || !done) && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.18, ease: easeOut }}
          className="border-t border-neutral-800/60 bg-neutral-950/80 backdrop-blur-sm overflow-hidden"
        >
          <div className="px-5 py-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500">
                Routing Pipeline
              </span>
              {done && (
                <motion.span
                  variants={checkVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex items-center gap-1.5 text-[11px] font-medium text-green-400"
                >
                  <CheckCircle2 size={12} />
                  Complete
                </motion.span>
              )}
            </div>

            <div className="relative h-1 rounded-full bg-neutral-800 mb-4 overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full bg-brand-500"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.15, ease: easeOut }}
              />
            </div>

            <div className="space-y-1">
              {steps.map((step, i) => {
                const state = stepStates.get(step.id) ?? "pending";
                const Icon = step.icon;

                return (
                  <motion.div
                    key={step.id}
                    variants={stepVariants}
                    initial="hidden"
                    animate={i <= currentIdx || state === "complete" ? "visible" : "hidden"}
                    className="flex items-center gap-3 py-1.5"
                  >
                    <div className="w-5 h-5 flex items-center justify-center shrink-0">
                      {state === "active" ? (
                        <Loader2
                          size={14}
                          className="text-brand-400 animate-spin"
                        />
                      ) : state === "complete" ? (
                        <motion.div
                          variants={checkVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          <CheckCircle2 size={14} className="text-green-400" />
                        </motion.div>
                      ) : (
                        <Icon size={14} className="text-neutral-600" />
                      )}
                    </div>

                    <span
                      className={`text-code text-xs transition-colors duration-200 ${
                        state === "active"
                          ? "text-white"
                          : state === "complete"
                            ? "text-neutral-400"
                            : "text-neutral-600"
                      }`}
                    >
                      {step.label}
                    </span>

                    {state === "complete" && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-[10px] font-mono text-neutral-600 ml-auto"
                      >
                        {step.durationMs}ms
                      </motion.span>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
