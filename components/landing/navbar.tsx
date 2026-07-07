'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import ThemeToggle from '../ui/theme-switch';
import { gsap, useGSAP, ScrollTrigger, SCRAMBLE_CHARS } from '@/lib/gsap';

function GithubIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
    </svg>
  );
}

const NAV_LINKS = [
  { href: '/patterns', label: 'PATTERNS' },
  { href: '/#diagram-cards', label: 'LIBRARY' },
];

export default function Navbar() {
  const headerRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Drop in on load
        gsap.from(headerRef.current, {
          yPercent: -110,
          duration: 0.9,
          ease: 'expo.out',
          delay: 0.15,
        });

        // Duck out of the way scrolling down, slide back scrolling up
        ScrollTrigger.create({
          start: 0,
          end: 'max',
          onUpdate: (self) => {
            const hide = self.direction === 1 && self.scroll() > 150;
            gsap.to(headerRef.current, {
              yPercent: hide ? -110 : 0,
              duration: 0.45,
              ease: 'power3.out',
              overwrite: 'auto',
            });
          },
        });
      });
    },
    { scope: headerRef },
  );

  // Mobile menu items cascade in on open
  useGSAP(
    () => {
      if (mobileMenuOpen) {
        gsap.from('.mnav-item', {
          y: 14,
          autoAlpha: 0,
          duration: 0.45,
          ease: 'power3.out',
          stagger: 0.06,
        });
      }
    },
    { scope: headerRef, dependencies: [mobileMenuOpen] },
  );

  const scrambleLink = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const label = e.currentTarget.querySelector('.nav-label');
    if (!label) return;
    gsap.to(label, {
      duration: 0.5,
      scrambleText: { text: label.textContent ?? '', chars: SCRAMBLE_CHARS, speed: 1 },
    });
  };

  return (
    <header
      ref={headerRef}
      className={cn(
        'fixed top-0 right-0 left-0 z-50 border-b font-mono transition-colors duration-300',
        scrolled || mobileMenuOpen
          ? 'border-border/50 bg-background/80 shadow-sm backdrop-blur-md'
          : 'border-transparent bg-transparent',
      )}
    >
      <div
        className={cn(
          'container mx-auto flex items-center justify-between px-4 transition-[padding] duration-300 md:px-8 lg:px-12 xl:px-16',
          scrolled ? 'py-3' : 'py-5',
        )}
      >
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-3" aria-label="System Design Mafia home">
          <div className="relative flex h-5 items-center justify-center transition-transform duration-300 group-hover:scale-105 invert dark:invert-0">
            <img src="/logo.svg" alt="System Design Mafia" width="20" height="20" className="h-full w-full" />
          </div>
          <img src="/mafia.svg" alt="" className="h-5 w-auto invert dark:invert-0" />
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onMouseEnter={scrambleLink}
              className="group text-xs font-bold tracking-[0.2em] text-foreground/50 uppercase transition-colors hover:text-foreground"
            >
              <span className="mr-1 text-primary opacity-0 transition-opacity duration-200 group-hover:opacity-70">
                {'//'}
              </span>
              <span className="nav-label inline-block min-w-[8ch]">{link.label}</span>
            </Link>
          ))}

          <span className="h-4 w-px bg-foreground/10" />

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <a
              href="https://github.com/atharvaarbat"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="flex h-10 w-10 items-center justify-center border border-foreground/10 text-foreground/50 transition-colors hover:bg-foreground/5 hover:text-foreground"
            >
              <GithubIcon />
            </a>
            <a
              href="https://x.com/arbat_atharva"
              target="_blank"
              rel="noreferrer"
              aria-label="X (Twitter)"
              className="flex h-10 w-10 items-center justify-center border border-foreground/10 text-foreground/50 transition-colors hover:bg-foreground/5 hover:text-foreground"
            >
              <XIcon />
            </a>
          </div>

          <Link
            href="/patterns"
            className="group inline-flex h-10 items-center gap-2 bg-primary px-5 text-xs font-bold tracking-[0.2em] text-background uppercase transition-all hover:bg-primary/90 active:scale-[0.97]"
          >
            Start
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </nav>

        {/* Mobile toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <button
            className="p-1 text-foreground"
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full right-0 left-0 flex flex-col border-b border-border/50 bg-background shadow-lg md:hidden">
          <nav aria-label="Mobile" className="flex flex-col p-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="mnav-item flex items-center justify-between border-b border-foreground/5 px-2 py-4 text-sm font-bold tracking-[0.2em] text-foreground/70 uppercase transition-colors hover:text-foreground"
              >
                <span>
                  <span className="mr-2 text-primary/70">{'//'}</span>
                  {link.label}
                </span>
                <ArrowUpRight className="h-4 w-4 text-foreground/30" />
              </Link>
            ))}

            <div className="mnav-item flex items-center justify-between px-2 py-4">
              <div className="flex items-center gap-6">
                <a
                  href="https://github.com/atharvaarbat"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <GithubIcon />
                </a>
                <a
                  href="https://x.com/arbat_atharva"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="X (Twitter)"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <XIcon />
                </a>
              </div>
              <ThemeToggle />
            </div>

            <Link
              href="/patterns"
              onClick={() => setMobileMenuOpen(false)}
              className="mnav-item mt-2 w-full bg-primary px-4 py-4 text-center text-xs font-bold tracking-widest text-background uppercase transition-colors hover:bg-primary/90 active:scale-[0.98]"
            >
              Start Learning
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
