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
      <SectionHeader
        label="Back of the Envelope"
        title="Scale Estimates"
        description="Rough, order-of-magnitude numbers. The point is to justify the architecture, not to be exact."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {estimates.map((est) => (
          <motion.div
            key={est.label}
            variants={fadeUp}
            className="group border border-foreground/8 bg-foreground/2 p-5 transition-colors hover:border-primary/25"
          >
            <div className="mb-2 font-mono text-[11px] tracking-[0.15em] text-foreground/50 uppercase">
              {est.label}
            </div>
            <div className="font-doto text-3xl font-black text-foreground tabular-nums">
              {est.value}
            </div>
            {est.note && (
              <div className="mt-2 font-sans text-[13px] leading-relaxed text-foreground/60">
                {est.note}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
