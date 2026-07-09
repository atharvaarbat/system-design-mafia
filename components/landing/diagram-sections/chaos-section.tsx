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
      <SectionHeader label="Break Things on Purpose" title="Failure Lab" />
      <motion.p
        variants={fadeUp}
        className="-mt-4 mb-8 max-w-2xl text-sm leading-relaxed text-foreground/50 font-poppins"
      >
        Most of this architecture exists because of fear — of one box dying.
        Take a component offline and the diagram above shows the blast radius:
        what goes down, what degrades, what the user feels, and which design
        decision saves the day.
      </motion.p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {nodes.map((node) => {
          const isKilled = killedNodeId === node.id;
          const kindDef = resolveNodeKind(node.kind);
          return (
            <motion.div
              key={node.id}
              variants={fadeUp}
              className={`flex flex-col border bg-foreground/1.5 transition-colors ${isKilled ? 'border-red-500/40' : 'border-foreground/5'}`}
            >
              <div className="flex items-center gap-2.5 border-b border-foreground/5 px-5 py-3.5">
                <span className={`inline-block h-1.5 w-1.5 rounded-full ${isKilled ? 'animate-pulse bg-red-500' : 'bg-emerald-500'}`} />
                <h3 className="truncate text-sm font-bold tracking-wide text-foreground">
                  {node.name ?? node.id}
                </h3>
                <span className="ml-auto shrink-0 text-[9px] tracking-widest text-foreground/30 uppercase">
                  {kindDef.label}
                </span>
              </div>

              {node.failure && (
                <p className="flex-1 px-5 py-3.5 text-xs leading-relaxed text-foreground/55 font-poppins">
                  {node.failure.userImpact}
                </p>
              )}

              <div className="border-t border-foreground/5 px-5 py-3">
                <button
                  type="button"
                  onClick={() => onKill(node.id)}
                  className={`inline-flex w-full cursor-pointer items-center justify-center gap-1.5 border px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase transition-all ${
                    isKilled
                      ? 'border-foreground/10 text-foreground/60 hover:border-primary/40 hover:text-primary'
                      : 'border-red-500/25 text-red-500/80 hover:border-red-500/60 hover:bg-red-500/5 hover:text-red-500'
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
