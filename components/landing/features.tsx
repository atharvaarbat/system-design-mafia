'use client';

import { useRef } from 'react';
import { CodeIcon, LayoutDashboardIcon, PaletteIcon, PuzzleIcon } from 'lucide-react';
import {
  PremiumComponent,
  ThemingComponent,
  OpenSourceComponent,
  ProductionReadyComponent,
} from './feature-visual';
import { gsap, useGSAP } from '@/lib/gsap';

const PANELS = [
  {
    num: '01',
    icon: CodeIcon,
    title: 'Interactive Diagrams',
    description:
      'Explore every architecture visually. Drag, zoom, resize groups, trace edges — the canvas is yours to manipulate.',
    Visual: OpenSourceComponent,
  },
  {
    num: '02',
    icon: PuzzleIcon,
    title: 'Curated Architectures',
    description:
      'Production-grade system designs — from microservices to video streaming — each one battle-tested and explained end-to-end.',
    Visual: PremiumComponent,
  },
  {
    num: '03',
    icon: PaletteIcon,
    title: 'Deep Dive Breakdowns',
    description:
      'Every diagram ships with a rich-text architecture breakdown — trade-offs, data flow, scaling decisions, and rationale.',
    Visual: ThemingComponent,
  },
  {
    num: '04',
    icon: LayoutDashboardIcon,
    title: 'Learn by Doing',
    description:
      'Reading is step one. Editing groups, following edge paths, and inspecting nodes is how architecture truly sticks.',
    Visual: ProductionReadyComponent,
  },
];

/**
 * Desktop (motion-safe): the section pins and the panels ride a horizontal
 * scrubbed track. Mobile / reduced motion: plain vertical stack — the
 * horizontal layout only exists under `lg:motion-safe:` so no one gets
 * stranded with clipped panels.
 */
export default function Features() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const track = trackRef.current!;
        const getDistance = () => track.scrollWidth - window.innerWidth;
        const setProgress = gsap.quickSetter('.feat-progress', 'scaleX');

        const scrollTween = gsap.to(track, {
          x: () => -getDistance(),
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: () => '+=' + getDistance(),
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              setProgress(self.progress);
              if (counterRef.current) {
                const idx = Math.min(PANELS.length, Math.floor(self.progress * PANELS.length) + 1);
                counterRef.current.textContent = String(idx).padStart(2, '0');
              }
            },
          },
        });

        gsap.utils.toArray<HTMLElement>('.feat-panel').forEach((panel) => {
          gsap.from(panel.querySelector('.feat-panel-body'), {
            y: 50,
            autoAlpha: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: panel,
              containerAnimation: scrollTween,
              start: 'left 85%',
              once: true,
            },
          });

          // Ghost number drifts against the track for in-panel parallax
          gsap.fromTo(
            panel.querySelector('.feat-num'),
            { xPercent: 35 },
            {
              xPercent: -35,
              ease: 'none',
              scrollTrigger: {
                trigger: panel,
                containerAnimation: scrollTween,
                start: 'left right',
                end: 'right left',
                scrub: true,
              },
            },
          );
        });
      });

      mm.add('(max-width: 1023px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray<HTMLElement>('.feat-panel').forEach((panel) => {
          gsap.from(panel, {
            y: 40,
            autoAlpha: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: { trigger: panel, start: 'top 88%', once: true },
          });
        });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-28 font-mono lg:motion-safe:h-screen lg:motion-safe:py-0"
    >
      {/* Header — floats above the track when pinned */}
      <div className="relative z-10 mb-14 lg:motion-safe:absolute lg:motion-safe:inset-x-0 lg:motion-safe:top-24 lg:motion-safe:mb-0">
        <div className="container mx-auto flex items-end justify-between px-4 md:px-8 lg:px-12 xl:px-16">
          <div>
            <p className="mb-4 text-xs font-bold tracking-[0.25em] text-primary uppercase">
              <span className="mr-3 opacity-70">{'//'}</span>Field Manual
            </p>
            <h2 className="font-heading text-3xl font-bold tracking-tighter text-foreground uppercase md:text-5xl">
              Why this <span className="font-doto text-primary">matters</span>
            </h2>
          </div>

          <div className="hidden flex-col items-end gap-3 lg:motion-safe:flex">
            <p className="text-xs tracking-[0.25em] text-foreground/40 uppercase">
              <span ref={counterRef} className="text-primary">01</span> / {String(PANELS.length).padStart(2, '0')}
            </p>
            <div className="h-px w-48 bg-foreground/10">
              <div className="feat-progress h-full w-full origin-left scale-x-0 bg-primary shadow-[0_0_8px_var(--primary)]" />
            </div>
          </div>
        </div>
      </div>

      {/* Panel track */}
      <div
        ref={trackRef}
        className="flex flex-col gap-8 px-4 will-change-transform md:px-8 lg:motion-safe:h-full lg:motion-safe:w-max lg:motion-safe:flex-row lg:motion-safe:items-center lg:motion-safe:gap-[5vw] lg:motion-safe:px-[10vw] lg:motion-safe:pt-16"
      >
        {PANELS.map(({ num, icon: Icon, title, description, Visual }) => (
          <article
            key={num}
            className="feat-panel group relative min-h-[360px] w-full overflow-hidden border border-foreground/10 bg-background/60 backdrop-blur-[2px] transition-colors duration-500 hover:border-primary/30 lg:motion-safe:h-[58vh] lg:motion-safe:w-[56vw] lg:motion-safe:min-h-0 lg:motion-safe:shrink-0"
          >
            {/* Corner accents */}
            <div className="absolute top-0 left-0 h-2 w-2 border-t border-l border-primary/20 transition-colors duration-500 group-hover:border-primary/50" />
            <div className="absolute top-0 right-0 h-2 w-2 border-t border-r border-foreground/20 transition-colors duration-500 group-hover:border-primary/50" />
            <div className="absolute bottom-0 left-0 h-2 w-2 border-b border-l border-foreground/20 transition-colors duration-500 group-hover:border-primary/50" />
            <div className="absolute right-0 bottom-0 h-2 w-2 border-r border-b border-foreground/20 transition-colors duration-500 group-hover:border-primary/50" />

            {/* Ghost index number */}
            <span
              aria-hidden
              className="feat-num pointer-events-none absolute -bottom-6 right-2 font-doto text-[9rem] leading-none font-black text-foreground/[0.05] select-none lg:text-[13rem]"
            >
              {num}
            </span>

            <div className="feat-panel-body relative z-10 flex h-full flex-col items-start justify-center p-8 md:max-w-[55%] md:p-12">
              <Icon className="mb-6 h-8 w-8 text-primary" />
              <p className="mb-2 text-[10px] font-bold tracking-[0.3em] text-foreground/30 uppercase">
                {num} / {String(PANELS.length).padStart(2, '0')}
              </p>
              <h3 className="mb-4 text-xl font-bold tracking-widest text-foreground uppercase md:text-2xl">
                {title}
              </h3>
              <p className="text-sm leading-relaxed tracking-wider text-pretty text-foreground/60">
                {description}
              </p>
            </div>

            <Visual />
          </article>
        ))}
      </div>
    </section>
  );
}
