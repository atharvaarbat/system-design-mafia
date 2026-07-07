'use client';

import { motion } from 'motion/react';
import { Check, X } from 'lucide-react';
import type { DesignDecision } from '@/types/diagram';
import RichText from '@/components/ui/rich-text';
import { Section, SectionHeader, fadeUp } from './section-shell';

export default function DecisionsSection({
  decisions,
}: {
  decisions: DesignDecision[];
}) {
  if (decisions.length === 0) return null;

  return (
    <Section id="decisions">
      <SectionHeader label="Trade-offs" title="Design Decisions" />
      <motion.p
        variants={fadeUp}
        className="-mt-4 mb-8 max-w-2xl text-sm leading-relaxed text-foreground/50"
      >
        An architecture is a record of trade-offs. For every major choice
        here: what won, what lost, and why the constraints made it so.
      </motion.p>

      <div className="grid gap-4 lg:grid-cols-2">
        {decisions.map((decision, i) => (
          <motion.div
            key={decision.title}
            variants={fadeUp}
            className="flex flex-col border border-foreground/5 bg-foreground/1.5 p-6"
          >
            <div className="mb-4 flex items-baseline gap-3">
              <span className="font-doto text-sm font-black text-foreground/25">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="text-sm font-bold tracking-wide text-foreground uppercase">
                {decision.title}
              </h3>
            </div>

            <div className="mb-4 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="w-14 shrink-0 text-[10px] font-bold tracking-widest text-foreground/30 uppercase">
                  Chose
                </span>
                <span className="inline-flex items-center gap-1.5 border border-primary/30 bg-primary/5 px-2 py-1 text-xs font-bold text-primary">
                  <Check className="h-3 w-3" />
                  {decision.choice}
                </span>
              </div>
              {decision.alternatives && decision.alternatives.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="w-14 shrink-0 text-[10px] font-bold tracking-widest text-foreground/30 uppercase">
                    Over
                  </span>
                  {decision.alternatives.map((alt) => (
                    <span
                      key={alt}
                      className="inline-flex items-center gap-1.5 border border-foreground/10 px-2 py-1 text-xs text-foreground/40"
                    >
                      <X className="h-3 w-3 text-foreground/25" />
                      {alt}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-foreground/5 pt-4">
              <RichText
                content={decision.rationale}
                className="text-xs dark:text-foreground/55 text-foreground/70"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
