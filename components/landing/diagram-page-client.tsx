'use client';

import { useMemo } from 'react';
import Container from '@/components/landing/container';
import Heading from '@/components/landing/heading';
import SubHeading from '@/components/landing/subheading';
import Diagram from '@/components/diagram/diagram';
import Navbar from '@/components/landing/navbar';
import RichText from '@/components/ui/rich-text';
import DiagramVisual from '@/components/landing/diagram-visuals';
import diagrams from '@/data/diagrams/index.json';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { motion, type Variants } from 'motion/react';
import type { SystemDesign, Protocol } from '@/types/diagram';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.12 },
  },
};

const PROTOCOL_COLORS: Record<Protocol, { color: string; label: string }> = {
  https: { color: '#22c55e', label: 'HTTPS' },
  grpc: { color: '#8b5cf6', label: 'gRPC' },
  database: { color: '#f59e0b', label: 'Database' },
  message: { color: '#06b6d4', label: 'Message' },
  internal: { color: '#64748b', label: 'Internal' },
  http: { color: '#22c55e', label: 'HTTP' },
  websocket: { color: '#ec4899', label: 'WebSocket' },
  tcp: { color: '#f97316', label: 'TCP' },
  udp: { color: '#a855f7', label: 'UDP' },
  event: { color: '#14b8a6', label: 'Event' },
};

export default function DiagramPageClient({
  slug,
  design,
  editable = false,
}: {
  slug: string;
  design: SystemDesign;
  editable?: boolean;
}) {
  const stats = useMemo(() => {
    const nodeCount = design.nodes.length;
    const edgeCount = design.edges.length;
    const groupCount = design.groups?.length ?? 0;

    const protocolCounts: Record<string, number> = {};
    const kindCounts: Record<string, number> = {};
    for (const edge of design.edges) {
      const p = edge.protocol ?? 'internal';
      protocolCounts[p] = (protocolCounts[p] ?? 0) + 1;
    }
    for (const node of design.nodes) {
      kindCounts[node.kind] = (kindCounts[node.kind] ?? 0) + 1;
    }

    const protocols = Object.entries(protocolCounts)
      .map(([p, c]) => ({ protocol: p as Protocol, count: c }))
      .sort((a, b) => b.count - a.count);

    const kinds = Object.entries(kindCounts)
      .map(([k, c]) => ({ kind: k, count: c }))
      .sort((a, b) => b.count - a.count);

    return { nodeCount, edgeCount, groupCount, protocols, kinds };
  }, [design]);

  const suggested = useMemo(() => {
    const others = diagrams.diagrams.filter((d) => d.slug !== slug);
    const shuffled = [...others].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  }, [slug]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="relative flex min-h-screen w-full flex-col overflow-x-hidden pt-24 pb-24 font-mono">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,color-mix(in_oklab,var(--foreground)_4%,transparent)_1px,transparent_1px)] bg-size-[24px_24px]" />

        {/* Ambient Glow */}
        <motion.div
          className="pointer-events-none absolute top-1/3 left-1/2 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(163,255,18,0.06) 0%, rgba(163,255,18,0.02) 40%, transparent 70%)',
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        />

        {/* Decorative Technical Borders */}
        <div className="absolute top-24 right-0 left-0 hidden h-px bg-foreground/5 lg:block" />
        <div className="absolute right-0 bottom-24 left-0 hidden h-px bg-foreground/5 lg:block" />
        <div className="absolute top-0 bottom-0 left-8 hidden w-px bg-foreground/5 md:left-16 lg:block" />
        <div className="absolute top-0 right-8 bottom-0 hidden w-px bg-foreground/5 md:right-16 lg:block" />

        {/* Crosshairs - corner targets */}
        <motion.div
          className="absolute top-24 left-8 hidden h-4 w-4 -translate-x-1/2 -translate-y-1/2 md:left-16 lg:block"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="bg-primary/50 absolute top-1/2 right-0 left-0 h-px" />
          <div className="bg-primary/50 absolute top-0 bottom-0 left-1/2 w-px" />
        </motion.div>
        <motion.div
          className="absolute top-24 right-8 hidden h-4 w-4 translate-x-1/2 -translate-y-1/2 md:right-16 lg:block"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: [0.4, 0, 0.2, 1], delay: 0.5 }}
        >
          <div className="absolute top-1/2 right-0 left-0 h-px bg-foreground/20" />
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-foreground/20" />
        </motion.div>
        <motion.div
          className="absolute bottom-24 left-8 hidden h-4 w-4 -translate-x-1/2 translate-y-1/2 md:left-16 lg:block"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: [0.4, 0, 0.2, 1], delay: 1 }}
        >
          <div className="absolute top-1/2 right-0 left-0 h-px bg-foreground/20" />
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-foreground/20" />
        </motion.div>
        <motion.div
          className="absolute right-8 bottom-24 hidden h-4 w-4 translate-x-1/2 translate-y-1/2 md:right-16 lg:block"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: [0.4, 0, 0.2, 1], delay: 1.5 }}
        >
          <div className="absolute top-1/2 right-0 left-0 h-px bg-foreground/20" />
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-foreground/20" />
        </motion.div>

        {/* Crosshairs - mid-edge */}
        <motion.div
          className="absolute top-1/2 left-8 hidden h-4 w-4 -translate-x-1/2 -translate-y-1/2 md:left-16 lg:block"
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 5, repeat: Infinity, ease: [0.4, 0, 0.2, 1], delay: 2 }}
        >
          <div className="absolute top-1/2 right-0 left-0 h-px bg-foreground/10" />
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-foreground/10" />
        </motion.div>
        <motion.div
          className="absolute top-1/2 right-8 hidden h-4 w-4 translate-x-1/2 -translate-y-1/2 md:right-16 lg:block"
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 5, repeat: Infinity, ease: [0.4, 0, 0.2, 1], delay: 2.5 }}
        >
          <div className="absolute top-1/2 right-0 left-0 h-px bg-foreground/10" />
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-foreground/10" />
        </motion.div>

        {/* Abstract Background Concentric Circles - breathing */}
        <div className="pointer-events-none absolute top-1/2 left-0 flex h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 items-center justify-center">
          <motion.div
            className="flex h-[800px] w-[800px] items-center justify-center rounded-full border border-foreground/5"
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: [0.4, 0, 0.2, 1] }}
          >
            <motion.div
              className="flex h-[600px] w-[600px] items-center justify-center rounded-full border border-dashed border-foreground/20"
              animate={{ scale: [1, 0.96, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: [0.4, 0, 0.2, 1], delay: 1 }}
            >
              <motion.div
                className="flex h-[400px] w-[400px] items-center justify-center rounded-full border border-foreground/20"
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ duration: 6, repeat: Infinity, ease: [0.4, 0, 0.2, 1], delay: 2 }}
              >
                <motion.div
                  className="h-[200px] w-[200px] rounded-full border border-dashed border-foreground/10"
                  animate={{ scale: [1, 0.95, 1] }}
                  transition={{ duration: 6, repeat: Infinity, ease: [0.4, 0, 0.2, 1], delay: 3 }}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scanning line - slow vertical sweep */}
        <motion.div
          className="pointer-events-none absolute left-0 right-0 hidden h-px lg:block"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(163,255,18,0.3) 50%, transparent 100%)',
          }}
          animate={{ top: ['10%', '90%', '10%'] }}
          transition={{ duration: 12, repeat: Infinity, ease: [0.4, 0, 0.2, 1] }}
        />

        {/* Floating terminal dots */}
        {[
          { top: '15%', left: '5%', delay: 0 },
          { top: '35%', right: '6%', delay: 0.8 },
          { top: '65%', left: '4%', delay: 1.6 },
          { top: '80%', right: '5%', delay: 2.4 },
        ].map((dot, i) => (
          <motion.div
            key={i}
            className="pointer-events-none absolute hidden h-1 w-1 rounded-full lg:block"
            style={{ backgroundColor: 'rgba(163,255,18,0.4)', top: dot.top, left: dot.left, right: dot.right }}
            animate={{ opacity: [0, 0.8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: [0.4, 0, 0.2, 1], delay: dot.delay }}
          />
        ))}

        <Container className="relative z-10 flex flex-1 flex-col gap-10">
          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              href="/#diagram-cards"
              className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5  px-3 py-1.5 text-xs tracking-wider transition-all hover:bg-foreground/3"
            >
              <ArrowLeft className="h-3 w-3" />
              Back to patterns
            </Link>
          </motion.div>

          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-2 text-xs tracking-widest text-foreground/30 uppercase"
          >
            <span className="dark:text-foreground/20 text-foreground/60">~/patterns</span>
            <span className="dark:text-foreground/20 text-foreground/60">/</span>
            <span className="text-primary">
              {design.title.toLowerCase().replace(/\s+/g, '-')}
            </span>
            <span className="ml-auto border border-foreground/5 bg-foreground/2 px-2 py-0.5 text-[10px] text-foreground/25">
              v1.0
            </span>
          </motion.div>

          {/* Hero */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeUp} className="mb-3 max-w-3xl">
              <Heading
                as="h1"
                variant="big"
                className="text-foreground font-sans leading-[0.9]"
              >
                {design.title}
              </Heading>
            </motion.div>

            {design.description && (
              <motion.div variants={fadeUp} className=" max-w-xl">
                <SubHeading variant="big" className="text-pretty">
                  {design.description}
                </SubHeading>
              </motion.div>
            )}

            {/* Animated stat chips */}
            {/* <motion.div
              variants={fadeUp}
              className="flex flex-wrap items-center gap-3"
            >
              {[
                {
                  label: `${stats.nodeCount} nodes`,
                  color: 'border-blue-500/20 text-blue-400',
                },
                {
                  label: `${stats.edgeCount} edges`,
                  color: 'border-violet-500/20 text-violet-400',
                },
                {
                  label: `${stats.groupCount} groups`,
                  color: 'border-amber-500/20 text-amber-400',
                },
                {
                  label: `${stats.protocols.length} protocols`,
                  color: 'border-cyan-500/20 text-cyan-400',
                },
              ].map((chip) => (
                <div
                  key={chip.label}
                  className={`inline-flex items-center border bg-foreground/2 px-3 py-1 text-xs font-bold tracking-wider uppercase ${chip.color}`}
                >
                  {chip.label}
                </div>
              ))}
            </motion.div> */}
          </motion.div> 

          {/* Terminal-style metadata strip */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.5,
            }}
            className="flex flex-wrap items-center gap-x-6 gap-y-1 border border-foreground/5 bg-foreground/1.5 px-5 py-3 text-xs dark:text-foreground/35 text-foreground/75"
          >
            <span className="text-foreground/70">$</span>
            <span>
              arch inspect {design.title.toLowerCase().replace(/\s+/g, '-')}
            </span>
            <span className="h-3 w-px bg-foreground/10" />
            <div className="flex items-center gap-2">

            <span>
              <span className="text-foreground">{stats.nodeCount}</span> nodes
            </span>
            <span>
              <span className="text-foreground">{stats.edgeCount}</span> edges
            </span>
            <span>
              <span className="text-foreground">{stats.groupCount}</span> groups
            </span>
            <span>
              <span className="text-foreground">{stats.protocols.length}</span>{' '}
              protocols
            </span>
            </div>
            <motion.span
              className="ml-1 inline-block h-4 w-[2px] bg-foreground/40"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <span className="ml-auto inline-flex items-center gap-1.5">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
              <span className="text-[10px] tracking-wider text-primary uppercase">
                verified
              </span>
            </span>
          </motion.div>

          {/* Diagram */}
          <motion.div
            className="relative overflow-hidden border border-foreground/10 bg-foreground/3"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.9,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.5,
            }}
          >
            {/* Corner L-brackets */}
            <div className="pointer-events-none absolute top-0 left-0 z-20 hidden h-5 w-5 border-t-2 border-l-2 border-primary/30 lg:block" />
            <div className="pointer-events-none absolute top-0 right-0 z-20 hidden h-5 w-5 border-t-2 border-r-2 border-primary/30 lg:block" />
            <div className="pointer-events-none absolute bottom-0 left-0 z-20 hidden h-5 w-5 border-b-2 border-l-2 border-primary/30 lg:block" />
            <div className="pointer-events-none absolute bottom-0 right-0 z-20 hidden h-5 w-5 border-b-2 border-r-2 border-primary/30 lg:block" />

            <Diagram design={design} editable={editable} />

            {/* Protocol legend — pinned to bottom of diagram */}
            {/* <div className="absolute bottom-0 right-0 left-0 hidden border-t border-white/5 bg-black/60 px-4 py-2 backdrop-blur-sm lg:flex lg:items-center lg:gap-4">
              <span className="text-[10px] font-bold tracking-widest text-white/30 uppercase">
                Protocol
              </span>
              {stats.protocols.map(({ protocol, count }) => {
                const info = PROTOCOL_COLORS[protocol] ?? {
                  color: '#64748b',
                  label: protocol,
                };
                return (
                  <div
                    key={protocol}
                    className="flex items-center gap-1.5 text-[11px]"
                  >
                    <span
                      className="inline-block h-2 w-2 rounded-full"
                      style={{ backgroundColor: info.color }}
                    />
                    <span className="text-white/50">{info.label}</span>
                    <span className="text-white/20">({count})</span>
                  </div>
                );
              })}
            </div> */}
          </motion.div>

          {/* Key Components Section */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="pb-8"
          >
            <motion.div variants={fadeUp} className="mb-8">
              <div className="mb-1 flex items-center gap-3 text-xs tracking-widest text-foreground/30 uppercase">
                <span className="text-primary">//</span>
                <span>Component Breakdown</span>
                <span className="h-px flex-1 bg-foreground/5" />
              </div>
              <Heading as="h2" variant="medium" className="text-foreground">
                Key Components
              </Heading>
            </motion.div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: 'Client',
                  items: stats.kinds
                    .filter((k) =>
                      ['browser', 'mobile-app', 'desktop-app'].includes(k.kind),
                    )
                    .map((k) => `${k.kind} (${k.count})`),
                  color: 'border-slate-500/20',
                  accent: 'text-slate-400',
                },
                {
                  title: 'Network',
                  items: stats.kinds
                    .filter((k) =>
                      [
                        'dns',
                        'cdn',
                        'load-balancer',
                        'api-gateway',
                        'firewall',
                      ].includes(k.kind),
                    )
                    .map((k) => `${k.kind} (${k.count})`),
                  color: 'border-lime-500/20',
                  accent: 'text-lime-400',
                },
                {
                  title: 'Compute',
                  items: stats.kinds
                    .filter((k) =>
                      [
                        'rest-api',
                        'graphql-api',
                        'worker-service',
                        'lambda-function',
                        'container',
                      ].includes(k.kind),
                    )
                    .map((k) => `${k.kind} (${k.count})`),
                  color: 'border-blue-500/20',
                  accent: 'text-blue-400',
                },
                {
                  title: 'Data',
                  items: stats.kinds
                    .filter((k) =>
                      [
                        'postgres',
                        'mysql',
                        'dynamodb',
                        'redis',
                        'elasticsearch',
                        'kafka',
                        's3',
                      ].includes(k.kind),
                    )
                    .map((k) => `${k.kind} (${k.count})`),
                  color: 'border-amber-500/20',
                  accent: 'text-amber-400',
                },
              ].map((section) => (
                <motion.div
                  key={section.title}
                  variants={fadeUp}
                  className={`group border bg-foreground/1.5 p-5 transition-all hover:bg-foreground/3 ${section.color}`}
                >
                  <div
                    className={`mb-3 text-xs font-bold tracking-widest uppercase ${section.accent}`}
                  >
                    {section.title}
                  </div>
                  {section.items.length > 0 ? (
                    <ul className="space-y-1.5">
                      {section.items.map((item) => (
                        <li
                          key={item}
                          className="text-xs text-foreground/70 transition-colors group-hover:text-foreground/70"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-xs italic text-foreground/20">
                      none in this architecture
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Architecture Summary */}
          {design.summary && (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={staggerContainer}
              className="pb-8"
            >
              <motion.div variants={fadeUp} className="mb-8">
                <div className="mb-1 flex items-center gap-3 text-xs tracking-widest text-foreground/30 uppercase">
                  <span className="text-primary">//</span>
                  <span>Deep Dive</span>
                  <span className="h-px flex-1 bg-foreground/5" />
                </div>
                <Heading as="h2" variant="medium" className="text-foreground">
                  Architecture Breakdown
                </Heading>
              </motion.div>
              <motion.div
                variants={fadeUp}
                className="border border-foreground/5 bg-foreground/1 p-8"
              >
                <RichText content={design.summary} />
              </motion.div>
            </motion.div>
          )}

          {/* Message from the Creator */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="pb-8"
          >
            <motion.div variants={fadeUp} className="mb-8">
              <div className="mb-1 flex items-center gap-3 text-xs tracking-widest text-foreground/30 uppercase">
                <span className="text-primary">//</span>
                <span>A Word</span>
                <span className="h-px flex-1 bg-foreground/5" />
              </div>
              <Heading as="h2" variant="medium" className="text-foreground">
                From the Creator
              </Heading>
            </motion.div>
            <motion.div
              variants={fadeUp}
              className="border border-foreground/5 bg-foreground/1 p-8 text-foreground/80 text-sm leading-relaxed space-y-4"
            >
              <p>
                Every great system starts as a sketch on a whiteboard. The ability to zoom out
                and see the whole picture — how services connect, where data flows, what breaks
                and why — is what separates engineers who build features from engineers who build
                systems. This diagram is more than boxes and arrows. It's a map of decisions,
                trade-offs, and intentional design.
              </p>
              <p>
                Studying architectures isn't just about passing interviews. It's about training
                your intuition. The more systems you take apart, the better you get at sensing
                where a monolith will crack, where a queue belongs, or when a cache is hiding a
                deeper problem. You start seeing patterns instead of chaos.
              </p>
              <p>
                So keep reading, keep tracing those edges, keep asking "why this way and not
                that way." The engineers who truly understand large systems are the ones who
                never stop being curious about how things fit together. That curiosity is the
                only ingredient that really matters.
              </p>
              <p className="text-foreground/50 italic pt-2 flex gap-2">
                — Atharva Arbat 
                <span>
                <Link href="https://x.com/arbat_atharva" className='text-blue-500 underline'>
                  @arbat_atharva
                </Link>
                </span>
              </p>
            </motion.div>
          </motion.div>
          {/* More Patterns */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp} className="mb-8">
              <div className="mb-1 flex items-center gap-3 text-xs tracking-widest text-foreground/30 uppercase">
                <span className="text-primary">//</span>
                <span>Explore</span>
                <span className="h-px flex-1 bg-foreground/5" />
              </div>
              <Heading as="h2" variant="medium" className="text-foreground">
                More Patterns
              </Heading>
            </motion.div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {suggested.map((diagram) => (
                <Link key={diagram.slug} href={`/d/${diagram.slug}`} className="block">
                  <motion.div
                    variants={fadeUp}
                    whileHover={{ y: -4, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } }}
                    className="group relative flex flex-col border border-foreground/10 bg-foreground/[0.02] transition-colors duration-500 ease-out hover:border-primary/30 hover:bg-primary/[0.03]"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-100" />
                      <DiagramVisual slug={diagram.slug} />
                    </div>
                    <div className="flex flex-1 flex-col gap-2 p-5">
                      <h3 className="text-foreground text-sm font-bold tracking-wide uppercase">
                        {diagram.title}
                      </h3>
                      <p className="text-muted-foreground text-xs leading-relaxed">
                        {diagram.description}
                      </p>
                    </div>
                    <motion.div
                      className="absolute right-0 top-0 m-3 h-2 w-2 rounded-full border border-foreground/10 bg-foreground/5"
                      variants={{
                        hover: {
                          scale: 1.6,
                          borderColor: 'var(--color-primary)',
                          backgroundColor: 'var(--color-primary)',
                          transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
                        },
                      }}
                    />
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>
        </Container>
      </section>
    </div>
  );
}
