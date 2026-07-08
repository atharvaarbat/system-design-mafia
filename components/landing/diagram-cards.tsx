'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Container from './container';
import DiagramCard from './diagram-card';
import diagrams from '@/data/diagrams/index.json';
import { gsap, useGSAP, SplitText } from '@/lib/gsap';

/** Vertical drift per grid column — the parallax shear across the grid. */
const COLUMN_DRIFT = [-60, 44, -104];

export default function DiagramCards() {
  const sectionRef = useRef<HTMLElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Ghost headline crawls right-to-left as the section passes
        gsap.fromTo(
          ghostRef.current,
          { xPercent: 4 },
          {
            xPercent: -18,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        );

        // Section heading: masked line reveal
        const split = SplitText.create('.patterns-heading', {
          type: 'lines',
          mask: 'lines',
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 120,
              duration: 1,
              ease: 'expo.out',
              stagger: 0.1,
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 75%',
                once: true,
              },
            }),
        });

        gsap.from('.patterns-kicker', {
          autoAlpha: 0,
          y: 14,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
        });

        // Each card boots up as it enters
        gsap.utils.toArray<HTMLElement>('.pattern-card').forEach((card) => {
          gsap.from(card, {
            y: 54,
            autoAlpha: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 88%', once: true },
          });
        });

        return () => split.revert();
      });

      // Columns drift at different speeds — desktop grid only
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray<HTMLElement>('.pattern-shift').forEach((wrap, i) => {
          gsap.to(wrap, {
            y: COLUMN_DRIFT[i % 3],
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.6,
            },
          });
        });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      id="diagram-cards"
      ref={sectionRef}
      className="relative w-full overflow-hidden py-32 font-mono"
    >
      {/* Ghost headline */}
      <div
        ref={ghostRef}
        aria-hidden
        className="pointer-events-none absolute top-16 left-0 font-doto text-[8vw] leading-none font-black tracking-tight whitespace-nowrap text-transparent uppercase select-none"
        style={{
          WebkitTextStroke: '1px color-mix(in oklab, var(--foreground) 10%, transparent)',
        }}
      >
        Patterns ✦ Patterns ✦ Patterns
      </div>

      <Container className="relative z-10">
        <div className="mb-20 pt-[8vw] md:flex">
          <div className="flex-1">
          <h2 className="patterns-heading max-w-3xl font-heading text-4xl font-bold tracking-tighter text-foreground uppercase md:text-6xl">
            The pattern library
          </h2>
          <p className="patterns-kicker mt-6 max-w-xl text-sm text-pretty text-muted-foreground md:text-base">
            Proven architectures for scalable, maintainable distributed systems
            — every one interactive, annotated, and free.
          </p>
          </div>
          <Link
            href="/patterns"
            className="mt-8 h-fit inline-flex items-center gap-2 border border-primary/30 px-4 py-2 text-xs font-bold uppercase tracking-widest text-foreground transition-all duration-300 hover:border-primary/60 hover:bg-primary/5"
          >
            View all patterns
            <span>→</span>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {diagrams.diagrams.filter((d) => d.featured).map((diagram, i) => (
            <article key={diagram.slug} className="pattern-card h-full">
              <DiagramCard diagram={diagram} index={i} showDetails />
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
