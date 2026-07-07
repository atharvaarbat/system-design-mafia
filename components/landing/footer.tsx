'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Container from './container';
import { gsap, useGSAP } from '@/lib/gsap';

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '.footer-wordmark',
          { yPercent: 55 },
          {
            yPercent: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: footerRef.current,
              start: 'top bottom',
              end: 'bottom bottom',
              scrub: 0.5,
            },
          },
        );
      });
    },
    { scope: footerRef },
  );

  return (
    <footer ref={footerRef} className="border-t border-foreground/10 bg-foreground/[0.02] font-mono">
      {/* Giant wordmark rises out of the footer as it enters */}
      <div aria-hidden className="overflow-hidden border-b border-foreground/5">
        <p
          className="footer-wordmark mt-6 mb-6 md:mb-14  xl:-mb-[0.3vw] text-center font-doto text-[8.1vw] leading-none font-black whitespace-nowrap text-transparent uppercase select-none"
          style={{
            WebkitTextStroke: '1px color-mix(in oklab, var(--foreground) 14%, transparent)',
          }}
        >
          System Design Mafia
        </p>
      </div>
      <Container className="py-12">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <img src="/logo.svg" alt="System Design Mafia logo" className="h-5 invert dark:invert-0" />
              <img src="/mafia.svg" alt="" className="h-5 invert dark:invert-0" />
            </Link>
            <span className="text-xs tracking-wider text-foreground/30">
              &copy; {new Date().getFullYear()} System Design Mafia
            </span>
          </div>
          <nav aria-label="Footer navigation" className="flex items-center gap-6">
            <Link
              href="/"
              className="text-xs tracking-widest text-foreground/50 hover:text-foreground transition-colors uppercase"
            >
              Home
            </Link>
            <Link
              href="/patterns"
              className="text-xs tracking-widest text-foreground/50 hover:text-foreground transition-colors uppercase"
            >
              Patterns
            </Link>
            <a
              href="https://github.com/atharvaarbat"
              target="_blank"
              rel="noreferrer"
              className="text-xs tracking-widest text-foreground/50 hover:text-foreground transition-colors uppercase"
            >
              GitHub
            </a>
            <a
              href="https://x.com/arbat_atharva"
              target="_blank"
              rel="noreferrer"
              className="text-xs tracking-widest text-foreground/50 hover:text-foreground transition-colors uppercase"
            >
              X
            </a>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
