'use client';

import { motion, AnimatePresence } from 'motion/react';
import Diagram from '@/components/diagram/diagram';
import FlowPlayer from '@/components/landing/diagram-sections/flow-player';
import StagePlayer from '@/components/landing/diagram-sections/stage-player';
import ChaosPanel from '@/components/landing/diagram-sections/chaos-panel';
import EdgeLegend from '@/components/landing/diagram-sections/edge-legend';
import { Crosshair, Skull, X } from 'lucide-react';
import type { SystemDesign, RequestFlow, SystemDesignNode } from '@/types/diagram';
import type { DiagramHighlight } from '@/lib/diagram/highlight-context';
import type { DiagramChaos } from '@/lib/diagram/chaos-context';

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
  /* Evolution (stages) mode */
  stageIdx: number | null;
  visible: { nodes: Set<string>; edges: Set<string> } | null;
  onStageChange: (stageIdx: number) => void;
  onCloseStage: () => void;
  /* Chaos (failure) mode */
  chaos: DiagramChaos | null;
  chaosArmed: boolean;
  killedNode: SystemDesignNode | null;
  hasChaosData: boolean;
  onToggleChaos: () => void;
  onChaosKill: (nodeId: string) => void;
  onRestoreChaos: () => void;
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
  stageIdx,
  visible,
  onStageChange,
  onCloseStage,
  chaos,
  chaosArmed,
  killedNode,
  hasChaosData,
  onToggleChaos,
  onChaosKill,
  onRestoreChaos,
}: DiagramPageCanvasProps) {
  const hasEdgeContracts = design.edges.some((e) => e.sync !== undefined);

  return (
    <motion.div
      id="diagram-wrap"
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
        visible={visible}
        chaos={chaos}
        chaosArmed={chaosArmed}
        onChaosKill={onChaosKill}
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

            {/* Stage player — docked while the evolution story is playing */}
            <AnimatePresence>
              {stageIdx !== null && design.stages && design.stages.length > 0 && (
                <StagePlayer
                  key="stage-player"
                  stages={design.stages}
                  stageIndex={stageIdx}
                  nodeNameById={nodeNameById}
                  onStageChange={onStageChange}
                  onClose={onCloseStage}
                />
              )}
            </AnimatePresence>

            {/* Chaos panel — docked while a component is killed */}
            <AnimatePresence>
              {killedNode && chaos && (
                <ChaosPanel
                  key="chaos-panel"
                  node={killedNode}
                  nodeNameById={nodeNameById}
                  onRestore={onRestoreChaos}
                />
              )}
            </AnimatePresence>

            {/* Chaos armed, nothing killed yet — instruction chip */}
            <AnimatePresence>
              {chaosArmed && !killedNode && (
                <motion.div
                  key="chaos-armed-chip"
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute top-4 left-4 z-30 flex items-center gap-2.5 border border-red-500/25 bg-background/90 px-3.5 py-2 backdrop-blur-md"
                >
                  <Skull className="h-3.5 w-3.5 text-red-500" />
                  <span className="font-sans text-xs text-foreground/80">
                    Chaos mode: click a marked component to take it offline
                  </span>
                  <button
                    type="button"
                    onClick={onToggleChaos}
                    aria-label="Exit chaos mode"
                    className="cursor-pointer p-0.5 text-foreground/40 transition-colors hover:text-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Chaos toggle — top-right, only when the design carries failure data */}
            {hasChaosData && !editable && !chaosArmed && !killedNode && (
              <button
                type="button"
                onClick={onToggleChaos}
                className="absolute top-4 right-4 z-30 inline-flex cursor-pointer items-center gap-1.5 border border-foreground/10 bg-background/80 px-3 py-1.5 font-mono text-[10px] font-bold tracking-widest text-foreground/60 uppercase backdrop-blur-md transition-all hover:border-red-500/40 hover:bg-red-500/5 hover:text-red-500"
              >
                <Skull className="h-3 w-3" />
                Chaos mode
              </button>
            )}

            {/* Edge-contract legend — sync vs async language, bottom-left */}
            {hasEdgeContracts && !editable && <EdgeLegend />}

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
