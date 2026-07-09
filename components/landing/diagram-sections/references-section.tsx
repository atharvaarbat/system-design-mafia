'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowUpRight, GitBranch } from 'lucide-react';
import type { Reference } from '@/types/diagram';
import { Section, SectionHeader, fadeUp } from './section-shell';

export default function ReferencesSection({
  references,
  related,
}: {
  references: Reference[];
  related: { slug: string; title: string }[];
}) {
  if (references.length === 0 && related.length === 0) return null;

  return (
    <Section id="references">
      <SectionHeader label="Go Deeper" title="Further Reading" />

      {references.length > 0 && (
        <motion.ul
          variants={fadeUp}
          className="divide-y divide-foreground/8 border border-foreground/8 bg-foreground/2"
        >
          {references.map((ref) => (
            <li key={ref.url}>
              <a
                href={ref.url}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-foreground/2"
              >
                <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-foreground/30 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                <span className="flex-1 font-sans text-[15px] text-foreground/85 transition-colors group-hover:text-primary">
                  {ref.title}
                </span>
                {ref.source && (
                  <span className="hidden shrink-0 font-mono text-[11px] tracking-wider text-foreground/45 sm:block">
                    {ref.source}
                  </span>
                )}
              </a>
            </li>
          ))}
        </motion.ul>
      )}

      {related.length > 0 && (
        <motion.div variants={fadeUp} className={references.length > 0 ? 'mt-8' : ''}>
          <div className="mb-3 flex items-center gap-2 font-mono text-[11px] font-semibold tracking-[0.15em] text-foreground/45 uppercase">
            <GitBranch className="h-3 w-3" />
            Patterns used in this design
          </div>
          <div className="flex flex-wrap gap-2">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/d/${r.slug}`}
                className="border border-foreground/12 px-3 py-1.5 font-sans text-[13px] text-foreground/70 transition-[color,background-color,border-color,transform] hover:border-primary/40 hover:bg-primary/5 hover:text-primary active:scale-[0.98]"
              >
                {r.title}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </Section>
  );
}
