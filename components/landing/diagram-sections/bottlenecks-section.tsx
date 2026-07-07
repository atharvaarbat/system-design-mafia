'use client';

import { motion } from 'motion/react';
import { TriangleAlert, ShieldCheck } from 'lucide-react';
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
      <SectionHeader label="What Breaks First" title="Bottlenecks & Failure Modes" />
      <motion.p
        variants={fadeUp}
        className="-mt-4 mb-8 max-w-2xl text-sm leading-relaxed text-foreground/50"
      >
        Reading a system means sensing where it cracks under 10× load.
        These are the pressure points of this design — and how it holds.
      </motion.p>

      <div className="grid gap-4 lg:grid-cols-2">
        {bottlenecks.map((item, i) => (
          <motion.div
            key={item.title}
            variants={fadeUp}
            className="border border-foreground/5 bg-foreground/1.5"
          >
            <div className="flex items-center gap-3 border-b border-foreground/5 px-6 py-4">
              <span className="border border-amber-500/30 bg-amber-500/5 px-2 py-0.5 text-[10px] font-bold tracking-widest text-amber-400 uppercase">
                Risk {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="text-sm font-bold tracking-wide text-foreground uppercase">
                {item.title}
              </h3>
            </div>
            <div className="space-y-5 p-6">
              <div className="border-l-2 border-amber-500/40 pl-4">
                <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-amber-400 uppercase">
                  <TriangleAlert className="h-3 w-3" />
                  Failure mode
                </div>
                <RichText
                  content={item.problem}
                  className="text-xs dark:text-foreground/55 text-foreground/70"
                />
              </div>
              <div className="border-l-2 border-primary/40 pl-4">
                <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-primary uppercase">
                  <ShieldCheck className="h-3 w-3" />
                  Mitigation
                </div>
                <RichText
                  content={item.mitigation}
                  className="text-xs dark:text-foreground/55 text-foreground/70"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
