'use client';

import { motion } from 'motion/react';
import type { Estimate } from '@/types/diagram';
import { Section, SectionHeader, fadeUp } from './section-shell';

export default function EstimatesSection({
  estimates,
}: {
  estimates: Estimate[];
}) {
  if (estimates.length === 0) return null;

  return (
    <Section id="estimates">
      <SectionHeader label="Back of the Envelope" title="Scale Estimates" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {estimates.map((est) => (
          <motion.div
            key={est.label}
            variants={fadeUp}
            className="group relative border border-foreground/5 bg-foreground/1.5 p-5 transition-colors hover:border-primary/20 hover:bg-foreground/3"
          >
            <span className="pointer-events-none absolute top-0 left-0 h-3 w-3 border-t border-l border-foreground/15 transition-colors group-hover:border-primary/50" />
            <div className="mb-2 text-[10px] font-bold tracking-widest text-foreground/40 uppercase">
              {est.label}
            </div>
            <div className="font-doto text-3xl font-black text-foreground">
              {est.value}
            </div>
            {est.note && (
              <div className="mt-2 text-xs leading-relaxed text-foreground/40">
                {est.note}
              </div>
            )}
          </motion.div>
        ))}
      </div>
      <motion.p
        variants={fadeUp}
        className="mt-4 text-xs tracking-wider text-foreground/25"
      >
        Rough, order-of-magnitude numbers — the point is to justify the
        architecture, not to be exact.
      </motion.p>
    </Section>
  );
}
