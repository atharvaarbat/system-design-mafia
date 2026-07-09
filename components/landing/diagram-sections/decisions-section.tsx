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
      <SectionHeader
        label="Trade-offs"
        title="Design Decisions"
        description="An architecture is a record of trade-offs. For every major choice here: what won, what lost, and why the constraints made it so."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {decisions.map((decision, i) => (
          <motion.div
            key={decision.title}
            variants={fadeUp}
            className="flex flex-col border border-foreground/8 bg-foreground/2 p-6"
          >
            <div className="mb-4 flex items-baseline gap-3">
              <span className="font-mono text-xs font-semibold text-foreground/40 tabular-nums">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="font-sans text-base font-semibold text-foreground">
                {decision.title}
              </h3>
            </div>

            <div className="mb-4 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="w-14 shrink-0 font-mono text-[11px] font-semibold tracking-[0.15em] text-foreground/45 uppercase">
                  Chose
                </span>
                <span className="inline-flex items-center gap-1.5 border border-primary/25 bg-primary/5 px-2 py-1 font-sans text-[13px] font-medium text-primary">
                  <Check className="h-3 w-3" />
                  {decision.choice}
                </span>
              </div>
              {decision.alternatives && decision.alternatives.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="w-14 shrink-0 font-mono text-[11px] font-semibold tracking-[0.15em] text-foreground/45 uppercase">
                    Over
                  </span>
                  {decision.alternatives.map((alt) => (
                    <span
                      key={alt}
                      className="inline-flex items-center gap-1.5 border border-foreground/10 px-2 py-1 font-sans text-[13px] text-foreground/60"
                    >
                      <X className="h-3 w-3 text-foreground/30" />
                      {alt}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-foreground/8 pt-4">
              <RichText content={decision.rationale} className="text-sm leading-relaxed" />
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
