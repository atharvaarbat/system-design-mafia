'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Container from './container';
import DiagramVisual from './diagram-visuals';
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
            <div key={diagram.slug} className="">
              <article className="pattern-card h-full">
                <Link
                  href={`/d/${diagram.slug}`}
                  className="block h-full"
                  aria-label={`View ${diagram.title} architecture diagram`}
                >
                  <div className="group relative flex h-full flex-col border border-foreground/10 bg-background/60 backdrop-blur-[2px] transition-colors duration-500 ease-out hover:border-primary/30 hover:bg-primary/[0.03]">
                    <figure className="diagram-card-visual relative aspect-[4/3] overflow-hidden border-b border-foreground/5">
                      <div className="absolute inset-0 z-10 bg-gradient-to-t from-background/40 to-transparent opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-100" />
                      <DiagramVisual slug={diagram.slug} />
                      <span className="absolute top-3 left-3 z-10 font-doto text-2xl font-black text-foreground/15 transition-colors duration-500 group-hover:text-primary/40">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </figure>

                    <div className="flex flex-1 flex-col gap-2 p-5">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-sm font-bold tracking-wide text-foreground uppercase line-clamp-1">
                          {diagram.title}
                        </h3>
                        <span className="mt-0.5 shrink-0 text-[9px] font-bold tracking-[0.2em] text-primary/70 uppercase">
                          [{diagram.difficulty}]
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2">
                        {diagram.description}
                      </p>
                      <p className="mt-auto pt-3 text-[10px] tracking-[0.2em] text-foreground/30 uppercase">
                        {diagram.nodeCount} nodes · {diagram.edgeCount} edges
                      </p>
                    </div>

                    <div className="absolute top-0 right-0 m-3 h-2 w-2 rounded-full border border-foreground/10 bg-foreground/5 transition-all duration-400 group-hover:scale-150 group-hover:border-primary group-hover:bg-primary" />
                  </div>
                </Link>
              </article>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
