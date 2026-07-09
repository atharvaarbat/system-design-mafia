'use client';

import { motion } from 'motion/react';
import type { Bottleneck } from '@/types/diagram';
import RichText from '@/components/ui/rich-text';
import { Section, SectionHeader, fadeUp } from './section-shell';

export default function BottlenecksSection({
  bottlenecks,
}: {
  bottlenecks: Bottleneck[];
}) {
  if (bottlenecks.length === 0) return null;

  return (
    <Section id="bottlenecks">
      <SectionHeader
        label="What Breaks First"
        title="Bottlenecks & Failure Modes"
        description="Reading a system means sensing where it cracks under 10× load. These are the pressure points of this design, and how it holds."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {bottlenecks.map((item, i) => (
          <motion.div
            key={item.title}
            variants={fadeUp}
            className="border border-foreground/8 bg-foreground/2"
          >
            <div className="flex items-baseline gap-3 border-b border-foreground/8 px-6 py-4">
              <span className="font-mono text-[11px] font-semibold tracking-[0.15em] text-amber-500 uppercase tabular-nums">
                Risk {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="font-sans text-base font-semibold text-foreground">
                {item.title}
              </h3>
            </div>
            <div className="space-y-5 p-6">
              <div>
                <div className="mb-1.5 font-mono text-[11px] font-semibold tracking-[0.15em] text-amber-500 uppercase">
                  Failure mode
                </div>
                <RichText content={item.problem} className="text-sm leading-relaxed" />
              </div>
              <div>
                <div className="mb-1.5 font-mono text-[11px] font-semibold tracking-[0.15em] text-primary uppercase">
                  Mitigation
                </div>
                <RichText content={item.mitigation} className="text-sm leading-relaxed" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
