'use client';

import { useMemo } from 'react';
import { motion } from 'motion/react';
import { Crosshair } from 'lucide-react';
import type { SystemDesignNode } from '@/types/diagram';
import { resolveNodeKind, CATEGORIES, type NodeCategory } from '@/lib/diagram/registry';
import { Section, SectionHeader, fadeUp } from './section-shell';

const CATEGORY_ACCENT: Record<NodeCategory, string> = {
  client: 'text-slate-400',
  network: 'text-lime-400',
  compute: 'text-blue-400',
  database: 'text-emerald-400',
  cache: 'text-amber-400',
  queue: 'text-purple-400',
  storage: 'text-cyan-400',
  external: 'text-slate-400',
};

interface ComponentEntry {
  key: string;
  name: string;
  kindLabel: string;
  category: NodeCategory;
  color: string;
  brandLogo?: string;
  Icon: React.ComponentType<{ className?: string; strokeWidth?: number; style?: React.CSSProperties }>;
  description?: string;
  nodeIds: string[];
}

export default function ComponentsSection({
  nodes,
  onLocate,
}: {
  nodes: SystemDesignNode[];
  onLocate: (nodeIds: string[]) => void;
}) {
  const byCategory = useMemo(() => {
    const entries = new Map<string, ComponentEntry>();
    for (const node of nodes) {
      const kindDef = resolveNodeKind(node.kind);
      const name = node.name || kindDef.label;
      const key = `${node.kind}::${name}`;
      const existing = entries.get(key);
      if (existing) {
        existing.nodeIds.push(node.id);
        if (!existing.description && node.description) existing.description = node.description;
      } else {
        entries.set(key, {
          key,
          name,
          kindLabel: kindDef.label,
          category: kindDef.category,
          color: kindDef.color,
          brandLogo: kindDef.brandLogo,
          Icon: kindDef.icon,
          description: node.description,
          nodeIds: [node.id],
        });
      }
    }

    const grouped = new Map<NodeCategory, ComponentEntry[]>();
    for (const cat of CATEGORIES) grouped.set(cat, []);
    for (const entry of entries.values()) grouped.get(entry.category)?.push(entry);
    return [...grouped.entries()].filter(([, list]) => list.length > 0);
  }, [nodes]);

  if (byCategory.length === 0) return null;

  return (
    <Section id="components">
      <SectionHeader
        label="Component Breakdown"
        title="Key Components"
        description="Every box on the canvas, and the job it does. Click a card to locate it in the diagram; click the node itself for the full deep dive."
      />

      <div className="space-y-8">
        {byCategory.map(([category, entries]) => (
          <motion.div key={category} variants={fadeUp}>
            <div className="mb-3 flex items-baseline gap-3">
              <span className={`font-mono text-[11px] font-semibold tracking-[0.15em] uppercase ${CATEGORY_ACCENT[category]}`}>
                {category}
              </span>
              <span className="font-mono text-[11px] text-foreground/45 tabular-nums">
                ×{entries.reduce((acc, e) => acc + e.nodeIds.length, 0)}
              </span>
              <span className="h-px flex-1 self-center bg-foreground/8" />
            </div>
            <div className="grid gap-3 font-sans sm:grid-cols-2 lg:grid-cols-3">
              {entries.map((entry) => (
                <button
                  key={entry.key}
                  type="button"
                  onClick={() => onLocate(entry.nodeIds)}
                  className="group flex cursor-pointer items-start gap-3 border border-foreground/8 bg-foreground/2 p-4 text-left transition-[color,background-color,border-color,transform] hover:border-primary/25 hover:bg-foreground/3 active:scale-[0.98]"
                  aria-label={`Locate ${entry.name} in the diagram`}
                >
                  <span className="relative flex h-9 w-9 shrink-0 items-center justify-center border border-foreground/10 bg-foreground/3">
                    {entry.brandLogo ? (
                      <img src={entry.brandLogo} alt="" className="h-5 w-5 object-contain" />
                    ) : (
                      <entry.Icon className="h-4 w-4" strokeWidth={2} style={{ color: entry.color }} />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline gap-2">
                      <span className="truncate text-sm font-semibold text-foreground">
                        {entry.name}
                      </span>
                      {entry.nodeIds.length > 1 && (
                        <span className="shrink-0 font-mono text-[11px] text-foreground/45 tabular-nums">
                          ×{entry.nodeIds.length}
                        </span>
                      )}
                    </span>
                    <span className="mt-0.5 block font-mono text-[10px] tracking-wider text-foreground/45 uppercase">
                      {entry.kindLabel}
                    </span>
                    {entry.description && (
                      <span className="mt-1.5 block text-[13px] leading-relaxed text-foreground/65">
                        {entry.description}
                      </span>
                    )}
                  </span>
                  <Crosshair className="mt-0.5 h-3.5 w-3.5 shrink-0 text-foreground/20 transition-colors group-hover:text-primary" />
                </button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
