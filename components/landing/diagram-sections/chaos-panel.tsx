'use client';

import { useEffect } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, X } from 'lucide-react';
import RichText from '@/components/ui/rich-text';
import type { SystemDesignNode } from '@/types/diagram';

/** Docked on top of the diagram while a component is killed in chaos mode. */
export default function ChaosPanel({
  node,
  nodeNameById,
  onRestore,
}: {
  node: SystemDesignNode;
  nodeNameById: Map<string, string>;
  onRestore: () => void;
}) {
  const failure = node.failure;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      // In fullscreen, let Escape exit fullscreen (browser behavior) without also restoring.
      if (document.fullscreenElement) return;
      e.preventDefault();
      onRestore();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onRestore]);

  if (!failure) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="absolute top-4 left-4 z-30 w-[400px] max-w-[calc(100%-2rem)] bg-background/90 font-mono shadow-[0_8px_40px_rgba(0,0,0,0.35)] backdrop-blur-md"
    >
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-foreground/8 px-4 py-2.5">
        <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
        <span className="text-[10px] tracking-widest text-foreground/40">Chaos mode</span>
        <span className="truncate text-[10px] tracking-wider text-red-500 uppercase">
          {node.name ?? node.id} is offline
        </span>
        <button
          type="button"
          onClick={onRestore}
          aria-label="Restore and exit chaos mode"
          className="ml-auto cursor-pointer p-1 text-foreground/40 transition-colors hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Body */}
      <div className="max-h-[45vh] space-y-4 overflow-y-auto px-4 py-3">
        <div>
          <p className="mb-1.5 text-[9px] font-bold tracking-widest text-foreground/35 uppercase">
            What users feel
          </p>
          <p className="text-sm leading-relaxed text-foreground/85 font-poppins">
            {failure.userImpact}
          </p>
        </div>

        {failure.blastRadius && failure.blastRadius.length > 0 && (
          <div>
            <p className="mb-1.5 text-[9px] font-bold tracking-widest text-foreground/35 uppercase">
              Blast radius
            </p>
            <ul className="space-y-1.5">
              {failure.blastRadius.map((impact) => (
                <li key={impact.nodeId} className="flex items-start gap-2">
                  <span
                    className={`mt-0.5 shrink-0 px-1.5 py-0.5 text-[8px] font-bold tracking-widest text-white uppercase ${impact.effect === 'down' ? 'bg-red-500' : 'bg-amber-500'}`}
                  >
                    {impact.effect}
                  </span>
                  <span className="text-xs leading-relaxed text-foreground/70 font-poppins">
                    <span className="text-foreground/90">{nodeNameById.get(impact.nodeId) ?? impact.nodeId}</span>
                    {impact.note && <> — {impact.note}</>}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <p className="mb-1.5 text-[9px] font-bold tracking-widest text-foreground/35 uppercase">
            How the design survives
          </p>
          <RichText content={failure.mitigation} />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-end border-t border-foreground/8 px-4 py-2.5">
        <button
          type="button"
          onClick={onRestore}
          className="inline-flex cursor-pointer items-center gap-1.5 bg-primary px-2.5 py-1 text-[10px] font-bold tracking-widest text-background uppercase transition-all hover:bg-primary/80"
        >
          <RotateCcw className="h-3 w-3" />
          Restore service
        </button>
      </div>
    </motion.div>
  );
}
