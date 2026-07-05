'use client';

import { useMemo } from 'react';
import Container from '@/components/landing/container';
import Heading from '@/components/landing/heading';
import SubHeading from '@/components/landing/subheading';
import Diagram from '@/components/diagram/diagram';
import Navbar from '@/components/landing/navbar';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { motion, type Variants } from 'motion/react';
import type { Protocol } from '@/types/diagram';
import { sampleArchitecture } from '@/components/diagram/data/sample';

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

interface Props {
  editable?: boolean;
}

export default function DiagramPage({ editable = false }: Props) {
  const design = sampleArchitecture;

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

  return (
    <>
      <Navbar />
      <section className="relative flex min-h-screen w-full flex-col overflow-x-hidden pt-28 pb-24 font-mono">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[24px_24px]" />

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
      <div className="absolute top-24 right-0 left-0 hidden h-px bg-white/5 lg:block" />
      <div className="absolute right-0 bottom-24 left-0 hidden h-px bg-white/5 lg:block" />
      <div className="absolute top-0 bottom-0 left-8 hidden w-px bg-white/5 md:left-16 lg:block" />
      <div className="absolute top-0 right-8 bottom-0 hidden w-px bg-white/5 md:right-16 lg:block" />

      {/* Crosshairs */}
      <div className="absolute top-24 left-8 hidden h-4 w-4 -translate-x-1/2 -translate-y-1/2 md:left-16 lg:block">
        <div className="bg-primary/50 absolute top-1/2 right-0 left-0 h-px" />
        <div className="bg-primary/50 absolute top-0 bottom-0 left-1/2 w-px" />
      </div>
      <div className="absolute top-24 right-8 hidden h-4 w-4 translate-x-1/2 -translate-y-1/2 md:right-16 lg:block">
        <div className="absolute top-1/2 right-0 left-0 h-px bg-white/20" />
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/20" />
      </div>
      <div className="absolute bottom-24 left-8 hidden h-4 w-4 -translate-x-1/2 translate-y-1/2 md:left-16 lg:block">
        <div className="absolute top-1/2 right-0 left-0 h-px bg-white/20" />
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/20" />
      </div>
      <div className="absolute right-8 bottom-24 hidden h-4 w-4 translate-x-1/2 translate-y-1/2 md:right-16 lg:block">
        <div className="absolute top-1/2 right-0 left-0 h-px bg-white/20" />
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/20" />
      </div>

      {/* Abstract Background Concentric Circles */}
      <div className="pointer-events-none absolute top-1/2 left-0 flex h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/5 opacity-30">
        <div className="flex h-[600px] w-[600px] items-center justify-center rounded-full border border-dashed border-white/20">
          <div className="flex h-[400px] w-[400px] items-center justify-center rounded-full border border-white/20">
            <div className="h-[200px] w-[200px] rounded-full border border-dashed border-white/10" />
          </div>
        </div>
      </div>

      <Container className="relative z-10 flex flex-1 flex-col gap-16">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link
            href="/#diagram-cards"
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 border border-white/5 bg-white/[0.015] px-3 py-1.5 text-xs tracking-wider transition-all hover:bg-white/[0.03]"
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
          className="flex items-center gap-2 text-xs tracking-widest text-white/30 uppercase"
        >
          <span className="text-white/20">~/patterns</span>
          <span className="text-white/10">/</span>
          <span className="text-primary">{design.title.toLowerCase().replace(/\s+/g, '-')}</span>
          <span className="ml-auto border border-white/5 bg-white/[0.02] px-2 py-0.5 text-[10px] text-white/25">
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
            <motion.div variants={fadeUp} className="mb-8 max-w-xl">
              <SubHeading variant="big" className="text-pretty">
                {design.description}
              </SubHeading>
            </motion.div>
          )}

          {/* Animated stat chips */}
          <motion.div
            variants={fadeUp}
            className="flex flex-wrap items-center gap-3"
          >
            {[
              { label: `${stats.nodeCount} nodes`, color: 'border-blue-500/20 text-blue-400' },
              { label: `${stats.edgeCount} edges`, color: 'border-violet-500/20 text-violet-400' },
              { label: `${stats.groupCount} groups`, color: 'border-amber-500/20 text-amber-400' },
              { label: `${stats.protocols.length} protocols`, color: 'border-cyan-500/20 text-cyan-400' },
            ].map((chip) => (
              <div
                key={chip.label}
                className={`inline-flex items-center border bg-white/[0.02] px-3 py-1 text-xs font-bold tracking-wider uppercase ${chip.color}`}
              >
                {chip.label}
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Terminal-style metadata strip */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
          className="flex flex-wrap items-center gap-x-6 gap-y-1 border border-white/5 bg-white/[0.015] px-5 py-3 text-xs text-white/35"
        >
          <span className="text-white/20">$</span>
          <span>arch inspect {design.title.toLowerCase().replace(/\s+/g, '-')}</span>
          <span className="h-3 w-px bg-white/10" />
          <span>
            <span className="text-white/50">{stats.nodeCount}</span> nodes
          </span>
          <span>
            <span className="text-white/50">{stats.edgeCount}</span> edges
          </span>
          <span>
            <span className="text-white/50">{stats.groupCount}</span> groups
          </span>
          <span>
            <span className="text-white/50">{stats.protocols.length}</span> protocols
          </span>
          <span className="ml-auto inline-flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500/60" />
            <span className="text-[10px] tracking-wider text-green-500/60 uppercase">verified</span>
          </span>
        </motion.div>

        {/* Diagram */}
        <motion.div
          className="relative overflow-hidden rounded-sm border border-white/10 bg-black/20"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
        >
          <Diagram design={design} editable={editable} />

          {/* Protocol legend — pinned to bottom of diagram */}
          <div className="absolute bottom-0 right-0 left-0 hidden border-t border-white/5 bg-black/60 px-4 py-2 backdrop-blur-sm lg:flex lg:items-center lg:gap-4">
            <span className="text-[10px] font-bold tracking-widest text-white/30 uppercase">
              Protocol
            </span>
            {stats.protocols.map(({ protocol, count }) => {
              const info = PROTOCOL_COLORS[protocol] ?? {
                color: '#64748b',
                label: protocol,
              };
              return (
                <div key={protocol} className="flex items-center gap-1.5 text-[11px]">
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ backgroundColor: info.color }}
                  />
                  <span className="text-white/50">{info.label}</span>
                  <span className="text-white/20">({count})</span>
                </div>
              );
            })}
          </div>
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
            <div className="mb-1 flex items-center gap-3 text-xs tracking-widest text-white/30 uppercase">
              <span className="text-primary">//</span>
              <span>Component Breakdown</span>
              <span className="h-px flex-1 bg-white/5" />
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
                className={`group border bg-white/[0.015] p-5 transition-all hover:bg-white/[0.03] ${section.color}`}
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
                        className="text-xs text-white/50 transition-colors group-hover:text-white/70"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-xs italic text-white/20">
                    none in this architecture
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
    </>
  );
}
