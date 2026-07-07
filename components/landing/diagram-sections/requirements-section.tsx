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
      title: 'Non-Functional',
      hint: 'how well it must do it',
      items: requirements.nonFunctional ?? [],
      marker: '≫',
      markerClass: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/5',
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
            className="border border-foreground/5 bg-foreground/1.5 p-6"
          >
            <div className="mb-5 flex items-baseline gap-3">
              <span className="text-xs font-bold tracking-widest text-foreground uppercase">
                {col.title}
              </span>
              <span className="text-[10px] tracking-wider text-foreground/30">
                {col.hint}
              </span>
            </div>
            <ul className="space-y-3">
              {col.items.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm font-sans">
                  <span
                    className={`mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center border text-[9px] leading-none ${col.markerClass}`}
                  >
                    {col.marker}
                  </span>
                  <span className="leading-relaxed text-foreground/70">
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
