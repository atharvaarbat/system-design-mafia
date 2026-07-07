'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import Container from './container';
import { gsap, useGSAP, ScrollSmoother, SplitText, SCRAMBLE_CHARS } from '@/lib/gsap';

const TOPICS = [
  'microservices',
  'event-driven systems',
  'video streaming',
  'url shorteners',
  'cqrs + sharding',
  'load balancing',
];

/**
 * The exploded system diagram floating behind/beside the headline.
 * `speed` feeds ScrollSmoother's data-speed (scroll depth) and scales the
 * mouse-parallax strength; `depth` sets the resting blur/opacity layer.
 */
const CHIPS: {
  label: string;
  x: string;
  y: string;
  speed: number;
  depth: 'far' | 'mid' | 'near';
}[] = [
  { label: 'CLIENT', x: '54%', y: '16%', speed: 0.82, depth: 'far' },
  { label: 'CDN', x: '88%', y: '12%', speed: 1.24, depth: 'near' },
  { label: 'API GATEWAY', x: '65%', y: '30%', speed: 1.06, depth: 'mid' },
  { label: 'LOAD BALANCER', x: '85%', y: '42%', speed: 0.9, depth: 'mid' },
  { label: 'AUTH SVC', x: '58%', y: '54%', speed: 1.16, depth: 'near' },
  { label: 'CACHE', x: '74%', y: '62%', speed: 0.84, depth: 'far' },
  { label: 'MESSAGE QUEUE', x: '88%', y: '72%', speed: 1.1, depth: 'mid' },
  { label: 'DATABASE', x: '66%', y: '82%', speed: 0.94, depth: 'far' },
];

const DEPTH_STYLE = {
  far: 'opacity-50 blur-[1.5px]',
  mid: 'opacity-75 blur-[0.5px]',
  near: 'opacity-100',
} as const;

/** Wire runs between chip anchor points (viewBox units == chip % coords). */
const WIRES = [
  'M54,16 L65,30',
  'M88,12 L65,30',
  'M65,30 L85,42',
  'M85,42 L58,54',
  'M85,42 L88,72',
  'M58,54 L74,62',
  'M88,72 L66,82',
  'M74,62 L66,82',
];

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
          .from(
            '.hero-chip',
            {
              autoAlpha: 0,
              y: 26,
              scale: 0.85,
              duration: 0.7,
              ease: 'back.out(1.7)',
              stagger: 0.07,
            },
            0.8,
          )
          .from(
            '.hero-wire',
            { drawSVG: '0%', duration: 1.1, ease: 'power2.inOut', stagger: 0.07 },
            1.0,
          )
          .from('.hero-scroll-hint', { autoAlpha: 0, duration: 0.8 }, 1.6);

        // -- Terminal line: scramble through topics forever ----------------
        const cycle = gsap.timeline({ repeat: -1, delay: 1.8 });
        TOPICS.forEach((topic) => {
          cycle.to(termRef.current, {
            duration: 0.9,
            scrambleText: { text: topic, chars: SCRAMBLE_CHARS, speed: 0.35 },
          }, '+=1.7');
        });

        // -- Ambient: concentric circles slowly rotating -------------------
        gsap.to('.hero-rings', {
          rotation: 360,
          duration: 140,
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

      // -- Mouse depth parallax (fine pointers only) ------------------------
      mm.add('(prefers-reduced-motion: no-preference) and (pointer: fine)', () => {
        const chips = gsap.utils.toArray<HTMLElement>('.hero-chip-inner');
        const movers = chips.map((chip, i) => {
          const strength = (CHIPS[i].speed - 1) * 90;
          return {
            x: gsap.quickTo(chip, 'x', { duration: 0.8, ease: 'power3.out' }),
            y: gsap.quickTo(chip, 'y', { duration: 0.8, ease: 'power3.out' }),
            strength,
          };
        });

        const onMove = (e: MouseEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          movers.forEach((m) => {
            m.x(nx * m.strength * 2);
            m.y(ny * m.strength);
          });
        };
        window.addEventListener('mousemove', onMove);
        return () => window.removeEventListener('mousemove', onMove);
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

      {/* Ambient primary glow */}
      <div
        data-speed="0.9"
        className="pointer-events-none absolute top-1/3 right-[10%] h-[420px] w-[560px] rounded-full"
        style={{
          background:
            'radial-gradient(ellipse at center, color-mix(in oklab, var(--primary) 7%, transparent) 0%, color-mix(in oklab, var(--primary) 2%, transparent) 45%, transparent 70%)',
        }}
      />

      {/* The exploded system diagram — desktop only */}
      <div className="hero-stage pointer-events-none absolute inset-0 hidden lg:block" aria-hidden>
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          data-speed="1.02"
        >
          {WIRES.map((d) => (
            <path
              key={d}
              d={d}
              className="hero-wire"
              fill="none"
              stroke="color-mix(in oklab, var(--foreground) 14%, transparent)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>

        {CHIPS.map((chip) => (
          <div
            key={chip.label}
            data-speed={chip.speed}
            className="hero-chip absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: chip.x, top: chip.y }}
          >
            <div
              className={`hero-chip-inner flex items-center gap-2 border border-foreground/15 bg-background/70 px-3 py-1.5 backdrop-blur-sm ${DEPTH_STYLE[chip.depth]}`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_6px_var(--primary)]" />
              <span className="text-[10px] font-bold tracking-[0.2em] text-foreground/70">
                {chip.label}
              </span>
            </div>
          </div>
        ))}
      </div>

      <Container className="relative z-10">
        <div className="hero-inner flex max-w-5xl flex-col items-start">
          {/* Badge — decodes on load */}
          <span
            ref={badgeRef}
            className="mb-8 inline-block border border-foreground/10 bg-foreground/[0.03] px-4 py-1.5 text-xs font-bold tracking-[0.25em] text-primary uppercase backdrop-blur-sm"
          >
            {' '}
          </span>

          {/* Headline */}
          <h1 className="mb-8 text-[clamp(2.9rem,9vw,8.5rem)] leading-[0.94] tracking-tight uppercase">
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

          {/* Terminal line */}
          <p className="hero-sub mb-10 text-xs tracking-widest text-foreground/40 uppercase">
            <span className="text-primary/70">&gt;</span> exploring:{' '}
            <span ref={termRef} className="text-foreground/70">distributed systems</span>
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
