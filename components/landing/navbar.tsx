import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { GithubIcon, NewTwitterIcon, Menu01Icon, Cancel01Icon } from "hugeicons-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ChartArea, Menu, StarCheck, X } from "lucide-react";
import ThemeToggle from "../ui/theme-switch";
// import LogoIcon from "@/assets/logo-icon";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        scrolled
          ? "bg-background/80 backdrop-blur-md border-border/50 shadow-sm py-3"
          : "bg-transparent border-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 md:px-8 lg:px-12 xl:px-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 flex items-center invert dark:invert-0 justify-center relative transition-transform duration-300 group-hover:scale-105">
            {/* <LogoIcon className="w-full h-full text-primary" /> */}
            <img src="/logo.svg" alt="Logo" className="w-full h-full" />
          </div>
          <span className="font-mono font-bold text-sm tracking-widest uppercase">System Design Mafia</span>
        </Link>



        {/* Right side */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <a href="https://github.com/atharvaarbat" target="_blank" rel="noreferrer" className="flex items-center justify-center h-10 w-10 border border-foreground/10 bg-transparent text-foreground/50 hover:text-foreground hover:bg-foreground/5 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-github" viewBox="0 0 16 16">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
              </svg>
            </a>
            <a href="https://x.com/arbat_atharva" target="_blank" rel="noreferrer" className="flex items-center justify-center h-10 w-10 border border-foreground/10 bg-transparent text-foreground/50 hover:text-foreground hover:bg-foreground/5 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-twitter-x" viewBox="0 0 16 16">
                <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
              </svg>            </a>
          </div>
          {/* <Link href="/home" className="flex items-center h-10 bg-primary text-background font-mono font-bold tracking-widest uppercase px-6 text-xs hover:bg-primary/90 transition-colors active:scale-[0.96]">
            Get Started
          </Link> */}
        </div>

        {/* Mobile Toggle */}
        <div className="flex md:hidden items-center gap-4">
          <button
            className="text-foreground p-1"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border/50 shadow-lg p-4 flex flex-col gap-4 animate-fade-in-up">

          <div className="flex items-center justify-center gap-8 p-4 border-t border-border/50 mt-2">
            <a href="https://github.com/WatermelonCorp/watermelon-platform" className="text-muted-foreground hover:text-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-github" viewBox="0 0 16 16">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
              </svg>
            </a>
            <a href="https://x.com/watermelonui" className="text-muted-foreground hover:text-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-twitter-x" viewBox="0 0 16 16">
                <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
              </svg>
            </a>
          </div>
          {/* <Link href="/home" className="w-full text-center bg-primary text-background font-mono font-bold tracking-widest uppercase px-4 py-4 text-xs hover:bg-primary/90 transition-colors active:scale-[0.96] mt-2">
            Get Started
          </Link> */}
        </div>
      )}
    </header>
  );
}
