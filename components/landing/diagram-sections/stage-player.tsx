'use client';

import { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, TrendingUp, X } from 'lucide-react';
import RichText from '@/components/ui/rich-text';
import type { SystemDesignStage } from '@/types/diagram';

/** Docked on top of the diagram while the evolution story is playing. */
export default function StagePlayer({
  stages,
  stageIndex,
  nodeNameById,
  onStageChange,
  onClose,
}: {
  stages: SystemDesignStage[];
  stageIndex: number;
  nodeNameById: Map<string, string>;
  onStageChange: (stage: number) => void;
  onClose: () => void;
}) {
  const stage = stages[stageIndex];
  const total = stages.length;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && stageIndex < total - 1) {
        e.preventDefault();
        onStageChange(stageIndex + 1);
      } else if (e.key === 'ArrowLeft' && stageIndex > 0) {
        e.preventDefault();
        onStageChange(stageIndex - 1);
      } else if (e.key === 'Escape') {
        // In fullscreen, let Escape exit fullscreen (browser behavior) without also closing the story.
        if (document.fullscreenElement) return;
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [stageIndex, total, onStageChange, onClose]);

  // Names of components that appear for the first time at this stage.
  const newNodeNames = useMemo(() => {
    if (!stage) return [];
    const previous = new Set(stageIndex > 0 ? stages[stageIndex - 1].nodeIds : []);
    return stage.nodeIds
      .filter((id) => !previous.has(id))
      .map((id) => nodeNameById.get(id))
      .filter((n): n is string => !!n);
  }, [stage, stageIndex, stages, nodeNameById]);

  if (!stage) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="absolute top-4 left-4 z-30 w-[400px] max-w-[calc(100%-2rem)] bg-background/90 font-mono shadow-[0_8px_40px_rgba(0,0,0,0.35)] backdrop-blur-md"
    >
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-foreground/8 px-4 py-2.5">
        <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
        <span className="text-[10px] text-foreground/40 tracking-widest">
          Evolution {String(stageIndex + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}
        </span>
        <span className="truncate text-[10px] tracking-wider text-primary uppercase">
          {stage.title}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close evolution story"
          className="ml-auto cursor-pointer p-1 text-foreground/40 transition-colors hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Segmented progress */}
      <div className="flex gap-1 px-4 pt-3">
        {stages.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onStageChange(i)}
            aria-label={`Go to stage ${i + 1}`}
            className={`h-1 flex-1 cursor-pointer transition-colors duration-300 ${i <= stageIndex ? 'bg-primary' : 'bg-foreground/10 hover:bg-foreground/25'}`}
          />
        ))}
      </div>

      {/* Stage body */}
      <div className="max-h-[45vh] overflow-y-auto px-4 py-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={stageIndex}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-3"
          >
            {stage.trigger && (
              <div className="flex items-start gap-2 border border-amber-500/25 bg-amber-500/8 px-2.5 py-1.5">
                <TrendingUp className="mt-0.5 h-3 w-3 shrink-0 text-amber-500" />
                <p className="font-sans text-xs leading-relaxed text-foreground/75">
                  {stage.trigger}
                </p>
              </div>
            )}

            <RichText content={stage.narrative} />

            {newNodeNames.length > 0 && (
              <div>
                <p className="mb-1.5 text-[9px] font-bold tracking-widest text-foreground/35 uppercase">
                  New in this stage
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {newNodeNames.map((name, i) => (
                    <span
                      key={`${name}-${i}`}
                      className="border border-primary/25 px-1.5 py-0.5 text-[10px] tracking-wider text-primary/90"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex items-center border-t border-foreground/8 px-4 py-2.5">
        <button
          type="button"
          onClick={() => onStageChange(stageIndex - 1)}
          disabled={stageIndex === 0}
          className="inline-flex cursor-pointer items-center gap-1 border border-foreground/10 px-2.5 py-1 text-[10px] font-bold tracking-widest text-foreground/60 uppercase transition-all hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-foreground/10 disabled:hover:text-foreground/60"
        >
          <ChevronLeft className="h-3 w-3" />
          Prev
        </button>
        <span className="mx-auto text-[10px] tracking-widest text-foreground/35 uppercase">
          stage {stageIndex + 1} / {total}
        </span>
        <button
          type="button"
          onClick={() => onStageChange(stageIndex + 1)}
          disabled={stageIndex >= total - 1}
          className="inline-flex cursor-pointer items-center gap-1 bg-primary px-2.5 py-1 text-[10px] font-bold tracking-widest text-background uppercase transition-all hover:bg-primary/80 disabled:cursor-not-allowed disabled:opacity-30"
        >
          Grow
          <ChevronRight className="h-3 w-3" />
        </button>
      </div>
    </motion.div>
  );
}
