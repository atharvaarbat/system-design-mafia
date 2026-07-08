'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import Container from '@/components/landing/container';
import Navbar from '@/components/landing/navbar';
import Footer from '@/components/landing/footer';
import RichText from '@/components/ui/rich-text';
import DiagramPageBackground from '@/components/landing/diagram-page-background';
import DiagramPageHero from '@/components/landing/diagram-page-hero';
import DiagramPageCanvas from '@/components/landing/diagram-page-canvas';
import DiagramPageCreator from '@/components/landing/diagram-page-creator';
import DiagramPageSuggestions from '@/components/landing/diagram-page-suggestions';
import RequirementsSection from '@/components/landing/diagram-sections/requirements-section';
import EstimatesSection from '@/components/landing/diagram-sections/estimates-section';
import FlowsSection from '@/components/landing/diagram-sections/flows-section';
import ComponentsSection from '@/components/landing/diagram-sections/components-section';
import DecisionsSection from '@/components/landing/diagram-sections/decisions-section';
import BottlenecksSection from '@/components/landing/diagram-sections/bottlenecks-section';
import QuizSection from '@/components/landing/diagram-sections/quiz-section';
import ReferencesSection from '@/components/landing/diagram-sections/references-section';
import { Section, SectionHeader, fadeUp } from '@/components/landing/diagram-sections/section-shell';
import diagrams from '@/data/diagrams/index.json';
import { motion } from 'motion/react';
import type { SystemDesign } from '@/types/diagram';
import type { DiagramHighlight, HighlightState } from '@/lib/diagram/highlight-context';

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

  const [trace, setTrace] = useState<{ flowIdx: number; stepIdx: number } | null>(null);
  const [focusNodeIds, setFocusNodeIds] = useState<string[] | null>(null);

  const nodeNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const node of design.nodes) {
      if (node.name) map.set(node.id, node.name);
    }
    return map;
  }, [design]);

  const related = useMemo(
    () =>
      (design.relatedPatterns ?? [])
        .map((s) => diagrams.diagrams.find((d) => d.slug === s))
        .filter((d): d is (typeof diagrams.diagrams)[number] => !!d)
        .map((d) => ({ slug: d.slug, title: d.title, description: d.description })),
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

  const handleStepChange = useCallback(
    (stepIdx: number) => setTrace((prev) => (prev ? { ...prev, stepIdx } : null)),
    [],
  );

  const suggested = useMemo(() => {
    const others = diagrams.diagrams.filter((d) => d.slug !== slug);
    let seed = 0;
    for (let i = 0; i < slug.length; i++) seed = (seed * 31 + slug.charCodeAt(i)) >>> 0;
    const start = others.length > 0 ? seed % others.length : 0;
    return [...others.slice(start), ...others.slice(0, start)].slice(0, 3);
  }, [slug]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section
        id="main-content"
        className="relative flex min-h-screen w-full flex-col overflow-x-hidden pt-24 pb-24 font-mono"
        aria-label="Diagram detail"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,color-mix(in_oklab,var(--foreground)_4%,transparent)_1px,transparent_1px)] bg-size-[24px_24px]" />

        <DiagramPageBackground />

        <Container className="relative z-10 flex flex-1 flex-col gap-10">
          <DiagramPageHero
            title={design.title}
            description={design.description}
            sectionIndex={sectionIndex}
          />

          <DiagramPageCanvas
            diagramWrapRef={diagramWrapRef}
            design={design}
            editable={editable}
            slug={slug}
            highlight={highlight}
            trace={trace}
            activeFlow={activeFlow}
            focusNodeIds={focusNodeIds}
            focusLabel={focusLabel}
            nodeNameById={nodeNameById}
            onStepChange={handleStepChange}
            onClearHighlight={clearHighlight}
          />

          {design.requirements && (
            <RequirementsSection requirements={design.requirements} />
          )}

          {design.estimates && design.estimates.length > 0 && (
            <EstimatesSection estimates={design.estimates} />
          )}

          {design.flows && design.flows.length > 0 && (
            <FlowsSection
              flows={design.flows}
              nodeNameById={nodeNameById}
              activeFlowIndex={trace?.flowIdx ?? null}
              activeStepIndex={trace?.stepIdx ?? 0}
              onTrace={handleTrace}
            />
          )}

          <ComponentsSection nodes={design.nodes} onLocate={handleLocate} />

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

          {design.decisions && design.decisions.length > 0 && (
            <DecisionsSection decisions={design.decisions} />
          )}

          {design.bottlenecks && design.bottlenecks.length > 0 && (
            <BottlenecksSection bottlenecks={design.bottlenecks} />
          )}

          {design.quiz && design.quiz.length > 0 && (
            <QuizSection quiz={design.quiz} />
          )}

          <ReferencesSection references={design.references ?? []} related={related} />

          <DiagramPageCreator />

          <DiagramPageSuggestions suggested={suggested} />
        </Container>
      </section>
      <Footer />
    </div>
  );
}
