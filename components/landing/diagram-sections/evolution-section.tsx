'use client';

import { motion } from 'motion/react';
import { Play, TrendingUp } from 'lucide-react';
import RichText from '@/components/ui/rich-text';
import type { SystemDesignStage } from '@/types/diagram';
import { Section, SectionHeader, fadeUp } from './section-shell';

export default function EvolutionSection({
  stages,
  activeStageIndex,
  onStage,
}: {
  stages: SystemDesignStage[];
  activeStageIndex: number | null;
  onStage: (stageIndex: number) => void;
}) {
  if (stages.length === 0) return null;

  return (
    <Section id="evolution">
      <SectionHeader label="Why It Looks Like This" title="System Evolution" />
      <motion.p
        variants={fadeUp}
        className="-mt-4 mb-8 max-w-2xl text-sm leading-relaxed text-foreground/50 font-poppins"
      >
        No system is born with queues and caches — every box was added because
        something was about to break. Play a stage and the diagram above shrinks
        to what existed at that point in the story; step forward to watch the
        architecture grow under scale pressure.
      </motion.p>

      <div className="space-y-6">
        {stages.map((stage, stageIdx) => {
          const isActive = activeStageIndex === stageIdx;
          return (
            <motion.div
              key={stage.id}
              variants={fadeUp}
              className={`border bg-foreground/1.5 transition-colors ${isActive ? 'border-primary/30' : 'border-foreground/5'}`}
            >
              {/* Stage header */}
              <div className="flex flex-wrap items-center gap-3 border-b border-foreground/5 px-6 py-4">
                <span className="px-2 py-0.5 text-[10px] font-bold tracking-widest text-primary uppercase">
                  Stage {String(stageIdx + 1).padStart(2, '0')}
                </span>
                <h3 className="text-sm font-bold tracking-wide text-foreground uppercase">
                  {stage.title}
                </h3>
                <button
                  type="button"
                  onClick={() => onStage(stageIdx)}
                  className="ml-auto inline-flex cursor-pointer items-center gap-1.5 border border-foreground/10 px-3 py-1.5 text-[10px] font-bold tracking-widest text-foreground/60 uppercase transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                >
                  <Play className="h-3 w-3" />
                  View this stage
                </button>
              </div>

              {stage.trigger && (
                <div className="flex items-start gap-2.5 border-b border-foreground/5 px-6 py-3">
                  <TrendingUp className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                  <p className="text-xs leading-relaxed text-foreground/55 font-poppins">
                    <span className="font-bold tracking-widest text-amber-500/90 uppercase">Scale pressure · </span>
                    {stage.trigger}
                  </p>
                </div>
              )}

              <div className="px-6 py-4">
                <RichText content={stage.narrative} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}
