'use client';

import { useRef } from 'react';
import { useGSAP, ScrollTrigger } from '@/lib/gsap';

function Crosshair({ className, accent = false }: { className: string; accent?: boolean }) {
  const stroke = accent ? 'bg-primary/50' : 'bg-foreground/20';
  return (
    <div className={`absolute hidden h-4 w-4 lg:block ${className}`}>
      <div className={`absolute top-1/2 right-0 left-0 h-px ${stroke}`} />
      <div className={`absolute top-0 bottom-0 left-1/2 w-px ${stroke}`} />
    </div>
  );
}

/**
 * Fixed instrument frame the whole page scrolls beneath: dot grid, frame
 * lines, crosshair registration marks, and a live scroll readout. Replaces
 * the per-section copies of the same decoration.
 */
export default function BlueprintHud() {
  const readoutRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        if (readoutRef.current) {
          readoutRef.current.textContent = `${String(Math.round(self.progress * 100)).padStart(3, '0')}%`;
        }
      },
    });
  });

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-40 font-mono">
      {/* Dot grid — fixed graph paper the content floats over */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,color-mix(in_oklab,var(--foreground)_4%,transparent)_1px,transparent_1px)] bg-size-[24px_24px]" />

      {/* Frame lines */}
      <div className="absolute top-24 right-0 left-0 hidden h-px bg-foreground/5 lg:block" />
      <div className="absolute right-0 bottom-24 left-0 hidden h-px bg-foreground/5 lg:block" />
      <div className="absolute top-0 bottom-0 left-8 hidden w-px bg-foreground/5 md:left-16 lg:block" />
      <div className="absolute top-0 right-8 bottom-0 hidden w-px bg-foreground/5 md:right-16 lg:block" />

      {/* Registration marks at the intersections */}
      <Crosshair accent className="top-24 left-8 -translate-x-1/2 -translate-y-1/2 md:left-16" />
      <Crosshair className="top-24 right-8 translate-x-1/2 -translate-y-1/2 md:right-16" />
      <Crosshair className="bottom-24 left-8 -translate-x-1/2 translate-y-1/2 md:left-16" />
      <Crosshair className="right-8 bottom-24 translate-x-1/2 translate-y-1/2 md:right-16" />

      {/* Instrument readouts */}
      <div className="absolute bottom-24 left-8 hidden -translate-y-3 pl-3 text-[10px] tracking-[0.25em] text-foreground/25 uppercase md:left-16 lg:block">
        SDH.BLUEPRINT / 002
      </div>
      <div className="absolute right-8 bottom-24 hidden -translate-y-3 pr-3 text-right text-[10px] tracking-[0.25em] text-foreground/25 uppercase md:right-16 lg:block">
        SCROLL <span ref={readoutRef} className="text-primary/60">000%</span>
      </div>
    </div>
  );
}
