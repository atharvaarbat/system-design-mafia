import Link from 'next/link';
import Container from './container';

export default function Footer() {
  return (
    <footer className="border-t border-foreground/10 bg-foreground/[0.02] font-mono">
      <Container className="py-12">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <img src="/logo.svg" alt="System Design Hub logo" className="h-5 invert dark:invert-0" />
              <img src="/mafia.svg" alt="" className="h-5 invert dark:invert-0" />
            </Link>
            <span className="text-xs tracking-wider text-foreground/30">
              &copy; {new Date().getFullYear()} System Design Hub
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
