'use client';

import { motion } from 'motion/react';
import { RotateCcw, Skull } from 'lucide-react';
import { resolveNodeKind } from '@/lib/diagram/registry';
import type { SystemDesignNode } from '@/types/diagram';
import { Section, SectionHeader, fadeUp } from './section-shell';

export default function ChaosSection({
  nodes,
  killedNodeId,
  onKill,
}: {
  /** Nodes that carry `failure` data — the killable ones. */
  nodes: SystemDesignNode[];
  killedNodeId: string | null;
  onKill: (nodeId: string) => void;
}) {
  if (nodes.length === 0) return null;

  return (
    <Section id="failure-lab">
      <SectionHeader
        label="Break Things on Purpose"
        title="Failure Lab"
        description="Most of this architecture exists because any one box can die. Take a component offline and the diagram above shows the blast radius: what goes down, what degrades, and what the user feels."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {nodes.map((node) => {
          const isKilled = killedNodeId === node.id;
          const kindDef = resolveNodeKind(node.kind);
          return (
            <motion.div
              key={node.id}
              variants={fadeUp}
              className={`flex flex-col border bg-foreground/2 transition-colors ${isKilled ? 'border-red-500/40' : 'border-foreground/8'}`}
            >
              <div className="flex items-center gap-2.5 border-b border-foreground/8 px-5 py-3.5">
                <span className={`inline-block h-1.5 w-1.5 rounded-full ${isKilled ? 'animate-pulse bg-red-500' : 'bg-emerald-500'}`} />
                <h3 className="truncate font-sans text-sm font-semibold text-foreground">
                  {node.name ?? node.id}
                </h3>
                <span className="ml-auto shrink-0 font-mono text-[10px] tracking-wider text-foreground/45 uppercase">
                  {kindDef.label}
                </span>
              </div>

              {node.failure && (
                <p className="flex-1 px-5 py-3.5 font-sans text-[13px] leading-relaxed text-foreground/75">
                  {node.failure.userImpact}
                </p>
              )}

              <div className="border-t border-foreground/8 px-5 py-3">
                <button
                  type="button"
                  onClick={() => onKill(node.id)}
                  className={`inline-flex w-full cursor-pointer items-center justify-center gap-1.5 border px-3 py-1.5 font-mono text-[11px] font-semibold tracking-[0.15em] uppercase transition-[color,background-color,border-color,transform] active:scale-[0.98] ${
                    isKilled
                      ? 'border-foreground/15 text-foreground/70 hover:border-primary/40 hover:text-primary'
                      : 'border-red-500/25 text-red-500/90 hover:border-red-500/60 hover:bg-red-500/5 hover:text-red-500'
                  }`}
                >
                  {isKilled ? (
                    <>
                      <RotateCcw className="h-3 w-3" />
                      Restore service
                    </>
                  ) : (
                    <>
                      <Skull className="h-3 w-3" />
                      Take it offline
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}
