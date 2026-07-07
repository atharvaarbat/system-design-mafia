'use client';

import { useState, useMemo } from 'react';
import { motion, type Variants } from 'motion/react';
import { Search, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import Container from '@/components/landing/container';
import Heading from '@/components/landing/heading';
import SubHeading from '@/components/landing/subheading';
import DiagramVisual from '@/components/landing/diagram-visuals';
import diagrams from '@/data/diagrams/index.json';
import Footer from '@/components/landing/footer';
import Navbar from '@/components/landing/navbar';

const easePremium = [0.4, 0, 0.2, 1] as const;

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
  hover: {
    y: -4,
    transition: { duration: 0.5, ease: easePremium },
  },
};

const difficultyColors: Record<string, string> = {
  beginner: 'border-green-500/30 text-green-400',
  intermediate: 'border-yellow-500/30 text-yellow-400',
  advanced: 'border-red-500/30 text-red-400',
};

const difficulties = ['beginner', 'intermediate', 'advanced'] as const;
type Difficulty = (typeof difficulties)[number];

export default function PatternsPage() {
  const [search, setSearch] = useState('');
  const [activeDifficulty, setActiveDifficulty] = useState<Difficulty | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return diagrams.diagrams.filter((d) => {
      if (activeDifficulty && d.difficulty !== activeDifficulty) return false;
      if (!q) return true;
      return (
        d.title.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [search, activeDifficulty]);

  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen overflow-x-hidden bg-background font-mono">

      {/* Background Dot Grid */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_center,color-mix(in_oklab,var(--foreground)_4%,transparent)_1px,transparent_1px)] bg-size-[24px_24px]" />

      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32">
        {/* Technical Borders */}
        <div className="absolute top-24 right-0 left-0 h-px bg-foreground/5" />
        <div className="absolute right-0 bottom-24 left-0 h-px bg-foreground/5" />
        <div className="absolute top-0 bottom-0 left-4 w-px bg-foreground/5 md:left-8 lg:left-16" />
        <div className="absolute top-0 right-4 bottom-0 w-px bg-foreground/5 md:right-8 lg:right-16" />

        {/* Crosshairs */}
        <div className="absolute top-24 left-4 hidden h-4 w-4 -translate-x-1/2 -translate-y-1/2 md:left-8 lg:left-16 md:block">
          <div className="bg-primary/50 absolute top-1/2 right-0 left-0 h-px" />
          <div className="bg-primary/50 absolute top-0 bottom-0 left-1/2 w-px" />
        </div>
        <div className="absolute top-24 right-4 hidden h-4 w-4 translate-x-1/2 -translate-y-1/2 md:right-8 lg:right-16 md:block">
          <div className="absolute top-1/2 right-0 left-0 h-px bg-foreground/20" />
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-foreground/20" />
        </div>
        <div className="absolute bottom-24 left-4 hidden h-4 w-4 -translate-x-1/2 translate-y-1/2 md:left-8 lg:left-16 md:block">
          <div className="absolute top-1/2 right-0 left-0 h-px bg-foreground/20" />
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-foreground/20" />
        </div>
        <div className="absolute right-4 bottom-24 hidden h-4 w-4 translate-x-1/2 translate-y-1/2 md:right-8 lg:right-16 md:block">
          <div className="absolute top-1/2 right-0 left-0 h-px bg-foreground/20" />
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-foreground/20" />
        </div>

        {/* Ambient Glow */}
        <div
          className="pointer-events-none absolute top-1/3 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(163,255,18,0.06) 0%, rgba(163,255,18,0.02) 40%, transparent 70%)',
          }}
        />

        <Container className="relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.08, delayChildren: 0.1 },
              },
            }}
          >
            {/* Header */}
            <div className="mb-8 md:mb-12">
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
                  },
                }}
                className="text-primary  mb-4 inline-flex items-center text-xs font-bold tracking-widest uppercase"
              >
                <span className="mr-3 opacity-70">{'{/*}'}</span>
                Pattern Library
              </motion.div>
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
                  },
                }}
              >
                <Heading
                  as="h1"
                  variant="big"
                  className="text-foreground mb-4 font-doto font-black"
                >
                  Architecture <span className="text-primary">Patterns</span>
                </Heading>
              </motion.div>
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
                  },
                }}
              >
                <SubHeading
                  variant="big"
                  className="max-w-2xl text-pretty"
                >
                  Proven architectural patterns for building scalable, maintainable
                  distributed systems. Filter by name, description, or tag.
                </SubHeading>
              </motion.div>
            </div>

            {/* Search Bar */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
                },
              }}
              className="relative mb-12 max-w-md"
            >
              <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-foreground/30" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search patterns..."
                className="w-full border border-foreground/10 bg-foreground/[0.02] py-3 pr-4 pl-11 text-sm text-foreground outline-none transition-colors duration-300 placeholder:text-foreground/25 focus:border-primary/40 focus:bg-primary/[0.03]"
              />
            </motion.div>

            {/* Difficulty Filters */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 8 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                },
              }}
              className="mb-6 flex flex-wrap items-center gap-2"
            >
              <button
                onClick={() => setActiveDifficulty(null)}
                className={`border px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-colors duration-300 ${
                  activeDifficulty === null
                    ? 'border-primary/40 bg-primary/[0.06] text-primary'
                    : 'border-foreground/10 text-foreground/50 hover:border-foreground/20 hover:text-foreground/70'
                }`}
              >
                All
              </button>
              {difficulties.map((d) => (
                <button
                  key={d}
                  onClick={() =>
                    setActiveDifficulty(activeDifficulty === d ? null : d)
                  }
                  className={`border px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-colors duration-300 ${
                    activeDifficulty === d
                      ? 'border-primary/40 bg-primary/[0.06] text-primary'
                      : 'border-foreground/10 text-foreground/50 hover:border-foreground/20 hover:text-foreground/70'
                  }`}
                >
                  {d}
                </button>
              ))}
              <span className="ml-auto text-xs tracking-wider text-foreground/40">
                {filtered.length} pattern{filtered.length !== 1 ? 's' : ''} found
              </span>
            </motion.div>

            {/* Cards Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((diagram) => (
                <article key={diagram.slug}>
                  <Link href={`/d/${diagram.slug}`} className="block" aria-label={`View ${diagram.title} architecture diagram`}>
                    <motion.div
                      variants={cardVariants}
                      whileHover="hover"
                      className="group relative flex flex-col border border-foreground/10 bg-foreground/[0.02] transition-colors duration-500 ease-out hover:border-primary/30 hover:bg-primary/[0.03]"
                    >
                      {/* Visual */}
                      <figure className="relative aspect-[4/3] overflow-hidden diagram-card-visual">
                        <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-100" />
                        <DiagramVisual slug={diagram.slug} />
                      </figure>

                      {/* Content */}
                      <div className="flex flex-1 flex-col gap-3 p-5">
                        {/* Title + Difficulty */}
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="text-foreground text-sm font-bold tracking-wide uppercase leading-snug">
                            {diagram.title}
                          </h3>
                          <span
                            className={`shrink-0 border px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${
                              difficultyColors[diagram.difficulty] ?? 'border-foreground/20 text-foreground/50'
                            }`}
                          >
                            {diagram.difficulty}
                          </span>
                        </div>

                        <p className="text-muted-foreground text-xs leading-relaxed">
                          {diagram.description}
                        </p>

                        {/* Tags */}
                        <div className="mt-auto flex flex-wrap gap-1.5">
                          {diagram.tags.map((tag) => (
                            <span
                              key={tag}
                              className="border border-foreground/5 bg-foreground/[0.03] px-2 py-0.5 text-[10px] font-bold tracking-wider text-foreground/50 uppercase"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Stats */}
                        <div className="mt-2 flex items-center gap-4 text-[10px] tracking-wider text-foreground/35 uppercase">
                          <span>{diagram.nodeCount} nodes</span>
                          <span>{diagram.edgeCount} edges</span>
                        </div>
                      </div>

                      {/* Hover Dot */}
                      <motion.div
                        className="absolute right-0 top-0 m-3 h-2 w-2 rounded-full border border-foreground/10 bg-foreground/5"
                        variants={{
                          hover: {
                            scale: 1.6,
                            borderColor: 'var(--color-primary)',
                            backgroundColor: 'var(--color-primary)',
                            transition: { duration: 0.4, ease: easePremium },
                          },
                        }}
                      />
                    </motion.div>
                  </Link>
                </article>
              ))}
            </div>

            {/* Empty State */}
            {filtered.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-24 text-center"
              >
                <p className="text-muted-foreground text-sm">
                  No patterns match your search.
                </p>
                <button
                  onClick={() => {
                    setSearch('');
                    setActiveDifficulty(null);
                  }}
                  className="text-primary mt-4 text-xs font-bold tracking-widest uppercase underline underline-offset-4 hover:opacity-80 transition-opacity"
                >
                  Clear filters
                </button>
              </motion.div>
            )}
          </motion.div>
        </Container>
      </section>
      </main>
      <Footer />
    </>
  );
}

