'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Timer, X } from 'lucide-react';
import type { RequestFlow } from '@/types/diagram';

/** Compact ms → human clock: "8ms", "1.2s", "3m 5s". */
function fmtMs(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(ms < 10000 ? 1 : 0)}s`;
  const m = Math.floor(ms / 60000);
  const s = Math.round((ms % 60000) / 1000);
  return s ? `${m}m ${s}s` : `${m}m`;
}

/** Docked on top of the diagram while a flow is being traced. */
export default function FlowPlayer({
  flow,
  flowIndex,
  stepIndex,
  nodeNameById,
  onStepChange,
  onClose,
}: {
  flow: RequestFlow;
  flowIndex: number;
  stepIndex: number;
  nodeNameById: Map<string, string>;
  onStepChange: (step: number) => void;
  onClose: () => void;
}) {
  const step = flow.steps[stepIndex];
  const total = flow.steps.length;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && stepIndex < total - 1) {
        e.preventDefault();
        onStepChange(stepIndex + 1);
      } else if (e.key === 'ArrowLeft' && stepIndex > 0) {
        e.preventDefault();
        onStepChange(stepIndex - 1);
      } else if (e.key === 'Escape') {
        // In fullscreen, let Escape exit fullscreen (browser behavior) without also closing the trace.
        if (document.fullscreenElement) return;
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [stepIndex, total, onStepChange, onClose]);

  if (!step) return null;

  // Cumulative "elapsed" clock + waterfall — only when the flow carries latency data.
  const totalMs = flow.steps.reduce((sum, s) => sum + (s.latencyMs ?? 0), 0);
  const elapsedMs = flow.steps
    .slice(0, stepIndex + 1)
    .reduce((sum, s) => sum + (s.latencyMs ?? 0), 0);
  const hasLatency = totalMs > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="absolute top-4 left-4 z-30 w-[380px] max-w-[calc(100%-2rem)] bg-background/90 font-mono shadow-[0_8px_40px_rgba(0,0,0,0.35)] backdrop-blur-md"
    >
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-foreground/8 px-4 py-2.5">
        <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
        <span className="text-[10px] text-foreground/40  tracking-widest ">
          Tracing flow {String(flowIndex + 1).padStart(2, '0')}
        </span>
        <span className="truncate text-[10px] tracking-wider text-primary uppercase">
          {flow.title}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Stop tracing"
          className="ml-auto cursor-pointer p-1 text-foreground/40 transition-colors hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Segmented progress */}
      <div className="flex gap-1 px-4 pt-3">
        {flow.steps.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onStepChange(i)}
            aria-label={`Go to step ${i + 1}`}
            className={`h-1 flex-1 cursor-pointer transition-colors duration-300 ${i <= stepIndex ? 'bg-primary' : 'bg-foreground/10 hover:bg-foreground/25'}`}
          />
        ))}
      </div>

      {/* Latency waterfall — where the time goes across the whole flow */}
      {hasLatency && (
        <div className="px-4 pt-3">
          <div className="mb-1.5 flex items-center gap-1.5 text-[10px]">
            <Timer className="h-3 w-3 text-primary" />
            <span className="text-foreground/70">elapsed {fmtMs(elapsedMs)}</span>
            {step.latencyMs != null && (
              <span className="text-foreground/35">· +{fmtMs(step.latencyMs)} this hop</span>
            )}
            <span className="ml-auto text-foreground/30">total {fmtMs(totalMs)}</span>
          </div>
          <div className="flex h-1.5 gap-px">
            {flow.steps.map((s, i) => {
              const pct = ((s.latencyMs ?? 0) / totalMs) * 100;
              const state = i < stepIndex ? 'past' : i === stepIndex ? 'current' : 'future';
              return (
                <div
                  key={i}
                  style={{ width: `${pct}%` }}
                  className={`h-full min-w-[2px] transition-colors duration-300 ${state === 'current' ? 'bg-primary' : state === 'past' ? 'bg-primary/40' : 'bg-foreground/10'}`}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Step body */}
      <div className="max-h-[46vh] overflow-y-auto px-4 py-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={stepIndex}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-3.5"
          >
            <p className="font-sans text-sm leading-relaxed text-foreground/85">
              <span className="mr-2 font-mono text-xs font-semibold text-primary tabular-nums">
                {String(stepIndex + 1).padStart(2, '0')}
              </span>
              {step.text}
            </p>

            {step.payload && (
              <div>
                <p className="mb-1.5 text-[9px] font-bold tracking-widest text-foreground/35 uppercase">
                  On the wire
                </p>
                <div className="border border-foreground/10 bg-foreground/2">
                  <div className="border-b border-foreground/8 px-3 py-1.5 text-[10px] tracking-wider text-primary/90">
                    {step.payload.title}
                  </div>
                  <pre className="overflow-x-auto px-3 py-2 text-[11px] leading-relaxed whitespace-pre-wrap break-words text-foreground/75">
                    {step.payload.body}
                  </pre>
                </div>
              </div>
            )}

            {step.stateChanges && step.stateChanges.length > 0 && (
              <div>
                <p className="mb-1.5 text-[9px] font-bold tracking-widest text-foreground/35 uppercase">
                  State changes
                </p>
                <ul className="space-y-1.5">
                  {step.stateChanges.map((change, i) => (
                    <li key={`${change.nodeId}-${i}`} className="flex items-start gap-2">
                      <span className="mt-0.5 shrink-0 border border-primary/25 px-1.5 py-0.5 text-[9px] tracking-wider text-primary/90">
                        {nodeNameById.get(change.nodeId) ?? change.nodeId}
                      </span>
                      <span className="font-sans text-xs leading-relaxed text-foreground/75">
                        {change.note}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex items-center border-t border-foreground/8 px-4 py-2.5">
        <button
          type="button"
          onClick={() => onStepChange(stepIndex - 1)}
          disabled={stepIndex === 0}
          className="inline-flex cursor-pointer items-center gap-1 border border-foreground/10 px-2.5 py-1 text-[10px] font-bold tracking-widest text-foreground/60 uppercase transition-all hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-foreground/10 disabled:hover:text-foreground/60"
        >
          <ChevronLeft className="h-3 w-3" />
          Prev
        </button>
        <span className="mx-auto text-[10px] tracking-widest text-foreground/35 uppercase">
          step {stepIndex + 1} / {total}
        </span>
        <button
          type="button"
          onClick={() => onStepChange(stepIndex + 1)}
          disabled={stepIndex >= total - 1}
          className="inline-flex cursor-pointer items-center gap-1 bg-primary  px-2.5 py-1 text-[10px] font-bold tracking-widest text-background uppercase transition-all hover:bg-primary/80 hover:text-background disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-foreground/10 disabled:hover:text-foreground/60"
        >
          Next
          <ChevronRight className="h-3 w-3" />
        </button>
      </div>
    </motion.div>
  );
}
