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
      <SectionHeader
        label="Why It Looks Like This"
        title="System Evolution"
        description="No system is born with queues and caches. Every box was added because something was about to break. Play a stage and the diagram above shrinks to what existed at that point in the story."
      />

      <div className="space-y-6">
        {stages.map((stage, stageIdx) => {
          const isActive = activeStageIndex === stageIdx;
          return (
            <motion.div
              key={stage.id}
              variants={fadeUp}
              className={`border bg-foreground/2 transition-colors ${isActive ? 'border-primary/30' : 'border-foreground/8'}`}
            >
              {/* Stage header */}
              <div className="flex flex-wrap items-center gap-3 border-b border-foreground/8 px-6 py-4">
                <span className="font-mono text-[11px] font-semibold tracking-[0.15em] text-primary uppercase tabular-nums">
                  Stage {String(stageIdx + 1).padStart(2, '0')}
                </span>
                <h3 className="font-sans text-base font-semibold text-foreground">
                  {stage.title}
                </h3>
                <button
                  type="button"
                  onClick={() => onStage(stageIdx)}
                  className="ml-auto inline-flex cursor-pointer items-center gap-1.5 border border-foreground/15 px-3 py-1.5 font-mono text-[11px] font-semibold tracking-[0.15em] text-foreground/70 uppercase transition-[color,background-color,border-color,transform] hover:border-primary/40 hover:bg-primary/5 hover:text-primary active:scale-[0.96]"
                >
                  <Play className="h-3 w-3" />
                  View this stage
                </button>
              </div>

              {stage.trigger && (
                <div className="flex items-start gap-2.5 border-b border-foreground/8 px-6 py-3.5">
                  <TrendingUp className="mt-1 h-3.5 w-3.5 shrink-0 text-amber-500" />
                  <p className="font-sans text-sm leading-relaxed text-foreground/75">
                    <span className="font-mono text-[11px] font-semibold tracking-[0.15em] text-amber-500 uppercase">
                      Scale pressure:{' '}
                    </span>
                    {stage.trigger}
                  </p>
                </div>
              )}

              <div className="px-6 py-5">
                <RichText content={stage.narrative} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}
