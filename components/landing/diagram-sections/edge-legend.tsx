'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown, Waypoints } from 'lucide-react';

/** Small legend explaining the sync/async edge language — docked bottom-left of the
 *  diagram whenever the design carries edge contracts. Collapsible to stay out of the way. */
export default function EdgeLegend() {
  const [open, setOpen] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
      className="absolute bottom-4 left-4 z-30 w-max bg-background/80 font-mono backdrop-blur-md"
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 border-b border-foreground/8 px-3 py-1.5 text-[9px] font-bold tracking-widest text-foreground/45 uppercase transition-colors hover:text-foreground/70"
      >
        <Waypoints className="h-3 w-3" />
        Edge contracts
        <ChevronDown className={`ml-auto h-3 w-3 transition-transform ${open ? '' : '-rotate-90'}`} />
      </button>

      {open && (
        <div className="space-y-2 px-3 py-2.5">
          <div className="flex items-center gap-2.5">
            <svg viewBox="0 0 32 8" className="h-2 w-8 shrink-0" aria-hidden>
              <line x1="1" y1="4" x2="31" y2="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-foreground/50" />
            </svg>
            <span className="text-[10px] text-foreground/65">
              <span className="text-foreground/90">synchronous</span> — caller waits
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <svg viewBox="0 0 32 8" className="h-2 w-8 shrink-0" aria-hidden>
              <line x1="1" y1="4" x2="31" y2="4" stroke="currentColor" strokeWidth="2" strokeDasharray="4 3" strokeLinecap="round" className="text-foreground/50" />
              <circle r="2" className="fill-violet-500">
                <animateMotion dur="1.6s" repeatCount="indefinite" path="M1 4 L31 4" />
              </circle>
            </svg>
            <span className="text-[10px] text-foreground/65">
              <span className="text-foreground/90">asynchronous</span> — fire &amp; forget
            </span>
          </div>

          <p className="pt-0.5 text-[9px] leading-snug text-foreground/35">
            denser dots = higher throughput. Hover any edge for its full contract.
          </p>
        </div>
      )}
    </motion.div>
  );
}
