'use client';

import { motion } from 'motion/react';
import type { Requirements } from '@/types/diagram';
import { Section, SectionHeader, fadeUp } from './section-shell';

export default function RequirementsSection({
  requirements,
}: {
  requirements: Requirements;
}) {
  const columns = [
    {
      key: 'functional',
      title: 'Functional',
      hint: 'what the system must do',
      items: requirements.functional ?? [],
      marker: '✓',
      markerClass: 'text-primary border-primary/30 bg-primary/5',
    },
    {
      key: 'non-functional',
      title: 'Non-functional',
      hint: 'how well it must do it',
      items: requirements.nonFunctional ?? [],
      marker: '≫',
      markerClass: 'text-foreground/60 border-foreground/20 bg-foreground/5',
    },
  ].filter((c) => c.items.length > 0);

  if (columns.length === 0) return null;

  return (
    <Section id="requirements">
      <SectionHeader label="The Contract" title="Requirements" />
      <div className="grid gap-4 lg:grid-cols-2">
        {columns.map((col) => (
          <motion.div
            key={col.key}
            variants={fadeUp}
            className="border border-foreground/8 bg-foreground/2 p-6"
          >
            <div className="mb-5 flex items-baseline gap-3">
              <span className="font-mono text-[11px] font-semibold tracking-[0.15em] text-foreground/70 uppercase">
                {col.title}
              </span>
              <span className="font-sans text-xs text-foreground/50">
                {col.hint}
              </span>
            </div>
            <ul className="space-y-3">
              {col.items.map((item, i) => (
                <li key={i} className="flex items-start gap-3 font-sans text-[15px]">
                  <span
                    className={`mt-1 inline-flex h-4 w-4 shrink-0 items-center justify-center border text-[9px] leading-none ${col.markerClass}`}
                  >
                    {col.marker}
                  </span>
                  <span className="leading-relaxed text-foreground/85">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
