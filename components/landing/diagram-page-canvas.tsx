'use client';

import { motion, AnimatePresence } from 'motion/react';
import Diagram from '@/components/diagram/diagram';
import FlowPlayer from '@/components/landing/diagram-sections/flow-player';
import { Crosshair, X } from 'lucide-react';
import type { SystemDesign, RequestFlow } from '@/types/diagram';
import type { DiagramHighlight } from '@/lib/diagram/highlight-context';

interface DiagramPageCanvasProps {
  diagramWrapRef: React.RefObject<HTMLDivElement | null>;
  design: SystemDesign;
  editable: boolean;
  slug: string;
  highlight: DiagramHighlight | null;
  trace: { flowIdx: number; stepIdx: number } | null;
  activeFlow: RequestFlow | null;
  focusNodeIds: string[] | null;
  focusLabel: string;
  nodeNameById: Map<string, string>;
  onStepChange: (stepIdx: number) => void;
  onClearHighlight: () => void;
}

export default function DiagramPageCanvas({
  diagramWrapRef,
  design,
  editable,
  slug,
  highlight,
  trace,
  activeFlow,
  focusNodeIds,
  focusLabel,
  nodeNameById,
  onStepChange,
  onClearHighlight,
}: DiagramPageCanvasProps) {
  return (
    <motion.div
      ref={diagramWrapRef}
      className="relative scroll-mt-24 overflow-hidden bg-foreground/3"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
    >
      {/* Corner L-brackets */}
      <div className="pointer-events-none absolute top-0 left-0 z-20 hidden h-5 w-5 border-t-2 border-l-2 border-primary/30 lg:block" />
      <div className="pointer-events-none absolute top-0 right-0 z-20 hidden h-5 w-5 border-t-2 border-r-2 border-primary/30 lg:block" />
      <div className="pointer-events-none absolute bottom-0 left-0 z-20 hidden h-5 w-5 border-b-2 border-l-2 border-primary/30 lg:block" />
      <div className="pointer-events-none absolute bottom-0 right-0 z-20 hidden h-5 w-5 border-b-2 border-r-2 border-primary/30 lg:block" />

      <Diagram
        design={design}
        editable={editable}
        diagramId={slug}
        highlight={highlight}
        overlay={
          <>
            {/* Flow player — docked while tracing */}
            <AnimatePresence>
              {trace && activeFlow && (
                <FlowPlayer
                  key="flow-player"
                  flow={activeFlow}
                  flowIndex={trace.flowIdx}
                  stepIndex={trace.stepIdx}
                  nodeNameById={nodeNameById}
                  onStepChange={onStepChange}
                  onClose={onClearHighlight}
                />
              )}
            </AnimatePresence>

            {/* Component focus chip */}
            <AnimatePresence>
              {!trace && focusNodeIds && (
                <motion.div
                  key="focus-chip"
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute top-4 left-4 z-30 flex items-center gap-2.5 border border-primary/25 bg-background/90 px-3.5 py-2 backdrop-blur-md"
                >
                  <Crosshair className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs text-foreground/75">{focusLabel}</span>
                  <button
                    type="button"
                    onClick={onClearHighlight}
                    aria-label="Clear focus"
                    className="cursor-pointer p-0.5 text-foreground/40 transition-colors hover:text-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        }
      />
    </motion.div>
  );
}
