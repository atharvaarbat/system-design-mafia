'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { RequestFlow } from '@/types/diagram';

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

  const nodeNames = (step.nodeIds ?? [])
    .map((id) => nodeNameById.get(id))
    .filter((n): n is string => !!n);

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="absolute top-4 left-4 z-30 w-[360px] max-w-[calc(100%-2rem)] bg-background/90 font-mono shadow-[0_8px_40px_rgba(0,0,0,0.35)] backdrop-blur-md"
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

      {/* Step body */}
      <div className="px-4 py-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={stepIndex}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-sm leading-relaxed text-foreground/85 font-poppins">
              <span className="mr-2 font-doto font-black text-primary">
                {String(stepIndex + 1).padStart(2, '0')}
              </span>
              {step.text}
            </p>
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
