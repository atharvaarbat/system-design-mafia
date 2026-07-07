'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import Container from '@/components/landing/container';
import Heading from '@/components/landing/heading';
import SubHeading from '@/components/landing/subheading';
import Diagram from '@/components/diagram/diagram';
import Navbar from '@/components/landing/navbar';
import RichText from '@/components/ui/rich-text';
import DiagramVisual from '@/components/landing/diagram-visuals';
import Footer from '@/components/landing/footer';
import RequirementsSection from '@/components/landing/diagram-sections/requirements-section';
import EstimatesSection from '@/components/landing/diagram-sections/estimates-section';
import FlowsSection from '@/components/landing/diagram-sections/flows-section';
import ComponentsSection from '@/components/landing/diagram-sections/components-section';
import DecisionsSection from '@/components/landing/diagram-sections/decisions-section';
import BottlenecksSection from '@/components/landing/diagram-sections/bottlenecks-section';
import QuizSection from '@/components/landing/diagram-sections/quiz-section';
import ReferencesSection from '@/components/landing/diagram-sections/references-section';
import FlowPlayer from '@/components/landing/diagram-sections/flow-player';
import { Section, SectionHeader, fadeUp, staggerContainer } from '@/components/landing/diagram-sections/section-shell';
import diagrams from '@/data/diagrams/index.json';
import { ArrowLeft, Crosshair, X } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import type { SystemDesign, Protocol } from '@/types/diagram';
import type { DiagramHighlight, HighlightState } from '@/lib/diagram/highlight-context';

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

const DIFFICULTY_STYLE: Record<string, string> = {
  beginner: 'border-emerald-500/25 text-emerald-400',
  intermediate: 'border-amber-500/25 text-amber-400',
  advanced: 'border-rose-500/25 text-rose-400',
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
  const diagramWrapRef = useRef<HTMLDivElement>(null);

  // A trace (flow walkthrough) and a component focus are mutually exclusive highlight sources.
  const [trace, setTrace] = useState<{ flowIdx: number; stepIdx: number } | null>(null);
  const [focusNodeIds, setFocusNodeIds] = useState<string[] | null>(null);

  const stats = useMemo(() => {
    const nodeCount = design.nodes.length;
    const edgeCount = design.edges.length;
    const groupCount = design.groups?.length ?? 0;

    const protocolCounts: Record<string, number> = {};
    for (const edge of design.edges) {
      const p = edge.protocol ?? 'internal';
      protocolCounts[p] = (protocolCounts[p] ?? 0) + 1;
    }

    const protocols = Object.entries(protocolCounts)
      .map(([p, c]) => ({ protocol: p as Protocol, count: c }))
      .sort((a, b) => b.count - a.count);

    return { nodeCount, edgeCount, groupCount, protocols };
  }, [design]);

  const nodeNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const node of design.nodes) {
      if (node.name) map.set(node.id, node.name);
    }
    return map;
  }, [design]);

  const readingMinutes = useMemo(() => {
    const parts: string[] = [design.summary ?? '', design.description ?? ''];
    design.requirements?.functional?.forEach((r) => parts.push(r));
    design.requirements?.nonFunctional?.forEach((r) => parts.push(r));
    design.estimates?.forEach((e) => parts.push(e.label, e.value, e.note ?? ''));
    design.flows?.forEach((f) => {
      parts.push(f.title, f.description ?? '');
      f.steps.forEach((s) => parts.push(s.text));
    });
    design.decisions?.forEach((d) =>
      parts.push(d.title, d.choice, ...(d.alternatives ?? []), d.rationale),
    );
    design.bottlenecks?.forEach((b) => parts.push(b.title, b.problem, b.mitigation));
    design.quiz?.forEach((q) => parts.push(q.question, q.answer));
    const words = parts.join(' ').split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 200));
  }, [design]);

  const related = useMemo(
    () =>
      (design.relatedPatterns ?? [])
        .map((s) => diagrams.diagrams.find((d) => d.slug === s))
        .filter((d): d is (typeof diagrams.diagrams)[number] => !!d)
        .map((d) => ({ slug: d.slug, title: d.title })),
    [design],
  );

  const sectionIndex = useMemo(() => {
    const items: { id: string; label: string }[] = [];
    if (design.requirements?.functional?.length || design.requirements?.nonFunctional?.length)
      items.push({ id: 'requirements', label: 'requirements' });
    if (design.estimates?.length) items.push({ id: 'estimates', label: 'estimates' });
    if (design.flows?.length) items.push({ id: 'flows', label: 'request-flows' });
    items.push({ id: 'components', label: 'components' });
    if (design.summary) items.push({ id: 'deep-dive', label: 'deep-dive' });
    if (design.decisions?.length) items.push({ id: 'decisions', label: 'decisions' });
    if (design.bottlenecks?.length) items.push({ id: 'bottlenecks', label: 'bottlenecks' });
    if (design.quiz?.length) items.push({ id: 'quiz', label: 'quiz' });
    if (design.references?.length || related.length) items.push({ id: 'references', label: 'references' });
    return items;
  }, [design, related]);

  const highlight = useMemo<DiagramHighlight | null>(() => {
    if (trace && design.flows) {
      const flow = design.flows[trace.flowIdx];
      const step = flow?.steps[trace.stepIdx];
      if (!flow || !step) return null;
      const nodes = new Map<string, HighlightState>();
      const edges = new Map<string, HighlightState>();
      for (let i = 0; i < trace.stepIdx; i++) {
        flow.steps[i].nodeIds?.forEach((id) => nodes.set(id, 'trail'));
        flow.steps[i].edgeIds?.forEach((id) => edges.set(id, 'trail'));
      }
      step.nodeIds?.forEach((id) => nodes.set(id, 'active'));
      step.edgeIds?.forEach((id) => edges.set(id, 'active'));
      return { nodes, edges };
    }
    if (focusNodeIds && focusNodeIds.length > 0) {
      const nodes = new Map<string, HighlightState>(
        focusNodeIds.map((id) => [id, 'active'] as const),
      );
      const idSet = new Set(focusNodeIds);
      const edges = new Map<string, HighlightState>();
      for (const edge of design.edges) {
        if (idSet.has(edge.source) || idSet.has(edge.target)) edges.set(edge.id, 'trail');
      }
      return { nodes, edges };
    }
    return null;
  }, [trace, focusNodeIds, design]);

  const scrollToDiagram = useCallback(() => {
    diagramWrapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const handleTrace = useCallback(
    (flowIdx: number, stepIdx: number) => {
      setFocusNodeIds(null);
      setTrace({ flowIdx, stepIdx });
      scrollToDiagram();
    },
    [scrollToDiagram],
  );

  const handleLocate = useCallback(
    (nodeIds: string[]) => {
      setTrace(null);
      setFocusNodeIds(nodeIds);
      scrollToDiagram();
    },
    [scrollToDiagram],
  );

  const clearHighlight = useCallback(() => {
    setTrace(null);
    setFocusNodeIds(null);
  }, []);

  const focusLabel = useMemo(() => {
    if (!focusNodeIds || focusNodeIds.length === 0) return '';
    const first = nodeNameById.get(focusNodeIds[0]) ?? focusNodeIds[0];
    return focusNodeIds.length > 1 ? `${first} ×${focusNodeIds.length}` : first;
  }, [focusNodeIds, nodeNameById]);

  const activeFlow = trace && design.flows ? design.flows[trace.flowIdx] : null;

  const suggested = useMemo(() => {
    const others = diagrams.diagrams.filter((d) => d.slug !== slug);
    // Deterministic rotation seeded by slug so the server render and hydration agree.
    let seed = 0;
    for (let i = 0; i < slug.length; i++) seed = (seed * 31 + slug.charCodeAt(i)) >>> 0;
    const start = others.length > 0 ? seed % others.length : 0;
    return [...others.slice(start), ...others.slice(0, start)].slice(0, 3);
  }, [slug]);

  const handleIndexClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      e.preventDefault();
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    [],
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section id="main-content" className="relative flex min-h-screen w-full flex-col overflow-x-hidden pt-24 pb-24 font-mono" aria-label="Diagram detail">
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
              href="/patterns"
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
                className="text-foreground font-doto font-black"
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
          </motion.div>

          {/* Terminal-style metadata strip */}
          {/* <motion.div
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
            {design.difficulty && (
              <span
                className={`border px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase ${DIFFICULTY_STYLE[design.difficulty] ?? 'border-foreground/10 text-foreground/40'}`}
              >
                {design.difficulty}
              </span>
            )}
            <span className="text-foreground/40">~{readingMinutes} min read</span>
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
          </motion.div> */}

          {/* Section index */}
          {sectionIndex.length > 0 && (
            <motion.nav
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
              aria-label="Page sections"
              className="-mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 px-1 text-[11px] tracking-wider"
            >
              <span className="text-foreground/30">Jump to:</span>
              {sectionIndex.map((s, i) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  onClick={(e) => handleIndexClick(e, s.id)}
                  className="text-foreground/45 transition-colors hover:text-primary capitalize"
                >
                  <span className="text-primary/60">
                    [{String(i + 1).padStart(2, '0')}]
                  </span>{' '}
                  {s.label}
                </a>
              ))}
            </motion.nav>
          )}

          {/* Diagram */}
          <motion.div
            ref={diagramWrapRef}
            className="relative scroll-mt-24 overflow-hidden  bg-foreground/3"
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

            <Diagram
              design={design}
              editable={editable}
              highlight={highlight}
              overlay={
                <>
                  {/* Flow player — docked while tracing */}
                  <AnimatePresence>
                    {trace && activeFlow && (
                      <FlowPlayer
                        key="flow-player"
                        flow={activeFlow}
                        flowIndex={trace.flowIdx}
                        stepIndex={trace.stepIdx}
                        nodeNameById={nodeNameById}
                        onStepChange={(step) => setTrace({ flowIdx: trace.flowIdx, stepIdx: step })}
                        onClose={clearHighlight}
                      />
                    )}
                  </AnimatePresence>

                  {/* Component focus chip */}
                  <AnimatePresence>
                    {!trace && focusNodeIds && (
                      <motion.div
                        key="focus-chip"
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute top-4 left-4 z-30 flex items-center gap-2.5 border border-primary/25 bg-background/90 px-3.5 py-2 backdrop-blur-md"
                      >
                        <Crosshair className="h-3.5 w-3.5 text-primary" />
                        <span className="text-xs text-foreground/75">{focusLabel}</span>
                        <button
                          type="button"
                          onClick={clearHighlight}
                          aria-label="Clear focus"
                          className="cursor-pointer p-0.5 text-foreground/40 transition-colors hover:text-foreground"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>


                </>
              }
            />
          </motion.div>

          {/* Requirements */}
          {design.requirements && (
            <RequirementsSection requirements={design.requirements} />
          )}

          {/* Scale estimates */}
          {design.estimates && design.estimates.length > 0 && (
            <EstimatesSection estimates={design.estimates} />
          )}

          {/* Request flows */}
          {design.flows && design.flows.length > 0 && (
            <FlowsSection
              flows={design.flows}
              nodeNameById={nodeNameById}
              activeFlowIndex={trace?.flowIdx ?? null}
              activeStepIndex={trace?.stepIdx ?? 0}
              onTrace={handleTrace}
            />
          )}

          {/* Key components */}
          <ComponentsSection nodes={design.nodes} onLocate={handleLocate} />

          {/* Architecture Summary */}
          {design.summary && (
            <Section id="deep-dive">
              <SectionHeader label="Deep Dive" title="Architecture Breakdown" />
              <motion.div
                variants={fadeUp}
                className="border border-foreground/5 bg-foreground/1 p-8"
              >
                <RichText content={design.summary} />
              </motion.div>
            </Section>
          )}

          {/* Design decisions */}
          {design.decisions && design.decisions.length > 0 && (
            <DecisionsSection decisions={design.decisions} />
          )}

          {/* Bottlenecks */}
          {design.bottlenecks && design.bottlenecks.length > 0 && (
            <BottlenecksSection bottlenecks={design.bottlenecks} />
          )}

          {/* Quiz */}
          {design.quiz && design.quiz.length > 0 && (
            <QuizSection quiz={design.quiz} />
          )}

          {/* References + related patterns */}
          <ReferencesSection references={design.references ?? []} related={related} />

          {/* Message from the Creator */}
          <Section>
            <SectionHeader label="A Word" title="From the Creator" />
            <motion.div
              variants={fadeUp}
              className="border border-foreground/5 bg-foreground/1 p-8 text-foreground/80 text-sm leading-relaxed space-y-4"
            >
              <p>
                Every great system starts as a sketch on a whiteboard. The ability to zoom out
                and see the whole picture — how services connect, where data flows, what breaks
                and why — is what separates engineers who build features from engineers who build
                systems. This diagram is more than boxes and arrows. It&apos;s a map of decisions,
                trade-offs, and intentional design.
              </p>
              <p>
                Studying architectures isn&apos;t just about passing interviews. It&apos;s about training
                your intuition. The more systems you take apart, the better you get at sensing
                where a monolith will crack, where a queue belongs, or when a cache is hiding a
                deeper problem. You start seeing patterns instead of chaos.
              </p>
              <p>
                So keep reading, keep tracing those edges, keep asking &quot;why this way and not
                that way.&quot; The engineers who truly understand large systems are the ones who
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
          </Section>

          {/* More Patterns */}
          <Section className="">
            <SectionHeader label="Explore" title="More Patterns" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {suggested.map((diagram) => (
                <article key={diagram.slug}>
                  <Link href={`/d/${diagram.slug}`} className="block" aria-label={`View ${diagram.title} architecture diagram`}>
                    <motion.div
                      variants={fadeUp}
                      whileHover={{ y: -4, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } }}
                      className="group relative flex flex-col border border-foreground/10 bg-foreground/[0.02] transition-colors duration-500 ease-out hover:border-primary/30 hover:bg-primary/[0.03]"
                    >
                      <figure className="relative aspect-[4/3] overflow-hidden diagram-card-visual">
                        <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-100" />
                        <DiagramVisual slug={diagram.slug} />
                      </figure>
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
                </article>
              ))}
            </div>
          </Section>
        </Container>
      </section>
      <Footer />
    </div>
  );
}
