'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import Container from './container';
import { gsap, useGSAP, SplitText } from '@/lib/gsap';

export default function Cta() {
  const sectionRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const split = SplitText.create('.cta-line', {
          type: 'lines',
          mask: 'lines',
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 120,
              duration: 1.1,
              ease: 'expo.out',
              stagger: 0.12,
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 70%',
                once: true,
              },
            }),
        });

        gsap.from('.cta-item', {
          autoAlpha: 0,
          y: 20,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', once: true },
        });

        // The whole block breathes in as you arrive, glow blooming behind it
        gsap.fromTo(
          '.cta-block',
          { scale: 0.94 },
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'center center',
              scrub: 0.6,
            },
          },
        );
        gsap.fromTo(
          '.cta-glow',
          { opacity: 0, scale: 0.7 },
          {
            opacity: 1,
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              end: 'center center',
              scrub: 0.6,
            },
          },
        );

        return () => split.revert();
      });

      // Magnetic CTA button
      mm.add('(prefers-reduced-motion: no-preference) and (pointer: fine)', () => {
        const wrap = buttonRef.current!;
        const xTo = gsap.quickTo(wrap, 'x', { duration: 0.4, ease: 'power3.out' });
        const yTo = gsap.quickTo(wrap, 'y', { duration: 0.4, ease: 'power3.out' });

        const onMove = (e: MouseEvent) => {
          const rect = wrap.getBoundingClientRect();
          xTo((e.clientX - (rect.left + rect.width / 2)) * 0.35);
          yTo((e.clientY - (rect.top + rect.height / 2)) * 0.35);
        };
        const onLeave = () => {
          gsap.to(wrap, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)' });
        };

        wrap.addEventListener('mousemove', onMove);
        wrap.addEventListener('mouseleave', onLeave);
        return () => {
          wrap.removeEventListener('mousemove', onMove);
          wrap.removeEventListener('mouseleave', onLeave);
        };
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="relative flex min-h-[85vh] items-center overflow-hidden py-32 font-mono">
      {/* Glow blooms in on approach */}
      <div
        aria-hidden
        className="cta-glow pointer-events-none absolute top-1/2 left-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            'radial-gradient(ellipse at center, color-mix(in oklab, var(--primary) 10%, transparent) 0%, color-mix(in oklab, var(--primary) 3%, transparent) 45%, transparent 70%)',
        }}
      />

      <Container className="relative z-10">
        <div className="cta-block flex flex-col items-center text-center">
          <p className="cta-item mb-8 text-xs font-bold tracking-[0.25em] text-primary uppercase">
            <span className="mr-3 opacity-70">{'//'}</span>Next Step
          </p>

          <h2 className="mb-10 text-[clamp(2.2rem,6.5vw,5.5rem)] leading-[1.02] tracking-tighter uppercase">
            <span className="cta-line block font-heading font-bold text-foreground">
              Stop memorizing.
            </span>
            <span className="cta-line block font-doto font-black text-primary">
              Start understanding.
            </span>
          </h2>

          <p className="cta-item mb-12 max-w-xl text-sm text-pretty text-muted-foreground md:text-base">
            Every diagram is free, open-source, and waiting to be pulled apart.
            No signup. No paywall. Just systems, made legible.
          </p>

          <div ref={buttonRef} className="cta-item">
            <Link
              href="/patterns"
              className="group inline-flex items-center gap-3 bg-primary px-10 py-4 text-sm font-bold tracking-widest text-background uppercase transition-colors hover:bg-primary/90"
            >
              Enter the pattern library
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
