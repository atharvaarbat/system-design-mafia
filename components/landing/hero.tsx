'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import Container from './container';
import HeroVisual, { SYSTEMS } from './hero-visual';
import { gsap, useGSAP, ScrollSmoother, SplitText, SCRAMBLE_CHARS } from '@/lib/gsap';

const HEX_POINTS = '190,100 145,177.9 55,177.9 10,100 55,22.1 145,22.1';

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const termRef = useRef<HTMLSpanElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // -- Headline: masked line-by-line char boot-up --------------------
        const splits = gsap.utils.toArray<HTMLElement>('.hero-line').map((line, i) =>
          SplitText.create(line, {
            type: 'lines,chars',
            mask: 'lines',
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.chars, {
                yPercent: 130,
                duration: 0.9,
                ease: 'expo.out',
                stagger: 0.02,
                delay: 0.2 + i * 0.12,
              }),
          }),
        );

        // -- Intro orchestration -------------------------------------------
        const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });

        intro
          .to(badgeRef.current, {
            duration: 1.2,
            scrambleText: {
              text: 'FREE // OPEN-SOURCE // NO SIGNUP',
              chars: SCRAMBLE_CHARS,
              speed: 0.4,
            },
          })
          .from('.hero-sub', { y: 24, autoAlpha: 0, duration: 0.8 }, 0.55)
          .from('.hero-cta', { y: 18, autoAlpha: 0, duration: 0.7, stagger: 0.08 }, 0.7)
          .from('.hero-stat', { y: 16, autoAlpha: 0, duration: 0.6, stagger: 0.1 }, 0.9)
          .from(
            '.hero-stat-num',
            {
              textContent: 0,
              duration: 1.2,
              ease: 'power1.out',
              snap: { textContent: 1 },
              stagger: 0.1,
            },
            0.95,
          )
          .from('.hero-stage-in', { x: 70, autoAlpha: 0, duration: 1.3 }, 0.8)
          .from('.hero-scroll-hint', { autoAlpha: 0, duration: 0.8 }, 1.6);

        // -- Ambient rotation: survey rings + hexagon ----------------------
        gsap.to('.hero-rings', {
          rotation: 360,
          duration: 140,
          repeat: -1,
          ease: 'none',
          transformOrigin: '50% 50%',
        });
        gsap.to('.hero-hex', {
          rotation: -360,
          duration: 90,
          repeat: -1,
          ease: 'none',
          transformOrigin: '50% 50%',
        });

        // -- Scroll indicator pulse -----------------------------------------
        gsap.to('.hero-scroll-line', {
          scaleY: 0,
          transformOrigin: 'bottom center',
          duration: 1.1,
          repeat: -1,
          yoyo: true,
          ease: 'power2.inOut',
        });

        // -- Exit: content sinks and dims as the section scrolls away ------
        gsap.to('.hero-inner', {
          yPercent: -10,
          autoAlpha: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '80% top',
            scrub: true,
          },
        });
        gsap.to('.hero-stage', {
          autoAlpha: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: '10% top',
            end: '70% top',
            scrub: true,
          },
        });

        return () => splits.forEach((s) => s.revert());
      });
    },
    { scope: sectionRef },
  );

  const scrollToPatterns = (e: React.MouseEvent) => {
    e.preventDefault();
    const smoother = ScrollSmoother.get();
    const target = document.querySelector('#diagram-cards');
    if (smoother) smoother.scrollTo('#diagram-cards', true, 'top 80px');
    else target?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen w-full flex-col justify-center overflow-hidden pt-32 pb-28 font-mono"
    >
      {/* Concentric survey rings, drifting on their own depth layer */}
      <div data-speed="0.85" className="pointer-events-none absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 opacity-30">
        <div className="hero-rings flex h-[800px] w-[800px] items-center justify-center rounded-full border border-foreground/5">
          <div className="flex h-[600px] w-[600px] items-center justify-center rounded-full border border-dashed border-foreground/20">
            <div className="flex h-[400px] w-[400px] items-center justify-center rounded-full border border-foreground/20">
              <div className="h-[200px] w-[200px] rounded-full border border-dashed border-foreground/10" />
            </div>
          </div>
        </div>
      </div>

      {/* Ambient primary glow behind the monitor panel */}
      <div
        data-speed="0.9"
        className="pointer-events-none absolute top-1/3 right-[5%] h-[420px] w-[560px] rounded-full"
        style={{
          background:
            'radial-gradient(ellipse at center, color-mix(in oklab, var(--primary) 7%, transparent) 0%, color-mix(in oklab, var(--primary) 2%, transparent) 45%, transparent 70%)',
        }}
      />

      {/* Dashed hexagon orbiting behind the panel — its own depth layer */}
      <div
        data-speed="0.92"
        className="pointer-events-none absolute top-1/2 right-[1vw] hidden -translate-y-1/2 lg:block"
        aria-hidden
      >
        <svg viewBox="0 0 200 200" className="hero-hex h-[46vw] max-h-[680px] w-[46vw] max-w-[680px]">
          <polygon
            points={HEX_POINTS}
            fill="none"
            stroke="var(--color-foreground)"
            strokeOpacity="0.08"
            strokeWidth="0.5"
            strokeDasharray="3 6"
          />
          <polygon
            points={HEX_POINTS}
            transform="translate(100 100) scale(0.72) translate(-100 -100)"
            fill="none"
            stroke="var(--color-primary)"
            strokeOpacity="0.1"
            strokeWidth="0.5"
          />
        </svg>
      </div>

      {/* Live system monitor — desktop only */}
      <div
        className="hero-stage pointer-events-none absolute top-1/2 right-[3vw] z-0 hidden w-[38vw] max-w-[540px] -translate-y-1/2 lg:block xl:right-[5vw]"
        data-speed="1.06"
        aria-hidden
      >
        <div className="hero-stage-in">
          <HeroVisual tickerRef={termRef} />
        </div>
      </div>

      <Container className="relative z-10">
        <div className="hero-inner flex max-w-5xl flex-col items-start lg:max-w-[54vw]">
          {/* Badge — decodes on load */}
          <span
            ref={badgeRef}
            className="mb-8 inline-block border border-foreground/10 bg-foreground/[0.03] px-4 py-1.5 text-xs font-bold tracking-[0.25em] text-primary uppercase backdrop-blur-sm"
          >
            {' '}
          </span>

          {/* Headline */}
          <h1 className="mb-8 text-[clamp(2.9rem,7vw,7.5rem)] leading-[0.94] tracking-tight uppercase">
            <span className="hero-line block font-heading font-bold text-foreground">
              How big
            </span>
            <span className="hero-line block font-doto font-black text-primary">
              Systems
            </span>
            <span className="hero-line block font-heading font-bold text-foreground">
              actually work
            </span>
          </h1>

          {/* Sub copy */}
          <p className="hero-sub mb-4 max-w-xl text-base text-pretty text-muted-foreground md:text-lg">
            Free, open-source guides and interactive diagrams that pull real
            architectures apart — piece by piece, decision by decision.
          </p>

          {/* Terminal line — driven by the blueprint's master timeline */}
          <p className="hero-sub mb-10 text-xs tracking-widest text-foreground/40 uppercase">
            <span className="text-primary/70">&gt;</span> exploring:{' '}
            <span ref={termRef} className="text-foreground/70">{SYSTEMS[0].ticker}</span>
            <span className="animate-pulse text-primary">_</span>
          </p>

          {/* CTAs */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/patterns"
              className="hero-cta group inline-flex items-center justify-center gap-2 bg-primary px-8 py-3 text-sm font-bold text-background uppercase transition-all hover:bg-primary/90 active:scale-[0.97]"
            >
              Start Learning
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <a
              href="#diagram-cards"
              onClick={scrollToPatterns}
              className="hero-cta inline-flex items-center justify-center gap-2 border border-foreground/10 px-8 py-3 text-sm font-bold text-foreground uppercase transition-all hover:bg-foreground/5 active:scale-[0.97]"
            >
              Browse Patterns ↓
            </a>
          </div>

          {/* Stat readout */}
          <div className="mt-16 flex flex-wrap items-center gap-x-8 gap-y-3 text-xs font-bold tracking-[0.2em] text-foreground/50 uppercase">
            <span className="hero-stat">
              <span className="hero-stat-num text-primary">20</span>
              <span className="text-primary">+</span> guides
            </span>
            <span className="hidden h-3 w-px bg-foreground/15 sm:block" />
            <span className="hero-stat">
              <span className="hero-stat-num text-primary">10</span>
              <span className="text-primary">+</span> systems
            </span>
            <span className="hidden h-3 w-px bg-foreground/15 sm:block" />
            <span className="hero-stat">
              <span className="hero-stat-num text-primary">100</span>
              <span className="text-primary">%</span> free
            </span>
          </div>
        </div>
      </Container>

      {/* Scroll hint */}
      <div className="hero-scroll-hint absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2">
        <span className="text-[10px] tracking-[0.3em] text-foreground/30 uppercase">Scroll</span>
        <span className="hero-scroll-line block h-8 w-px bg-primary/60" />
      </div>
    </section>
  );
}
