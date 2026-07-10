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
import EvolutionSection from '@/components/landing/diagram-sections/evolution-section';
import FlowsSection from '@/components/landing/diagram-sections/flows-section';
import ChaosSection from '@/components/landing/diagram-sections/chaos-section';
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
import { buildChaos } from '@/lib/diagram/chaos-context';
import { LineNav } from '../ui/line-nav';

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
  const [stageIdx, setStageIdx] = useState<number | null>(null);
  const [chaosArmed, setChaosArmed] = useState(false);
  const [killedNodeId, setKilledNodeId] = useState<string | null>(null);

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

  const killableNodes = useMemo(() => design.nodes.filter((n) => n.failure), [design]);

  const sectionIndex = useMemo(() => {
    const items: { id: string; label: string }[] = [];
    if (design.requirements?.functional?.length || design.requirements?.nonFunctional?.length)
      items.push({ id: 'requirements', label: 'Requirements' });
    if (design.estimates?.length) items.push({ id: 'estimates', label: 'Estimates' });
    if (design.stages?.length) items.push({ id: 'evolution', label: 'Evolution' });
    if (design.flows?.length) items.push({ id: 'flows', label: 'Request flows' });
    items.push({ id: 'components', label: 'Components' });
    if (design.summary) items.push({ id: 'deep-dive', label: 'Deep dive' });
    if (design.decisions?.length) items.push({ id: 'decisions', label: 'Decisions' });
    if (design.bottlenecks?.length) items.push({ id: 'bottlenecks', label: 'Bottlenecks' });
    if (killableNodes.length) items.push({ id: 'failure-lab', label: 'Failure lab' });
    if (design.quiz?.length) items.push({ id: 'quiz', label: 'Quiz' });
    if (design.references?.length || related.length) items.push({ id: 'references', label: 'References' });
    return items;
  }, [design, related, killableNodes]);

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

  // Evolution mode: the visible subset of the diagram at the active stage.
  const visible = useMemo(() => {
    if (stageIdx === null) return null;
    const stage = design.stages?.[stageIdx];
    if (!stage) return null;
    return { nodes: new Set(stage.nodeIds), edges: new Set(stage.edgeIds) };
  }, [stageIdx, design]);

  // Chaos mode: the killed node expanded into its authored blast radius.
  const chaosState = useMemo(
    () => (killedNodeId ? buildChaos(design, killedNodeId) : null),
    [killedNodeId, design],
  );

  const killedNode = useMemo(
    () => (killedNodeId ? design.nodes.find((n) => n.id === killedNodeId) ?? null : null),
    [killedNodeId, design],
  );

  const scrollToDiagram = useCallback(() => {
    diagramWrapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  // The four modes (trace, focus, evolution, chaos) are mutually exclusive —
  // entering one always clears the others so the diagram tells a single story.
  const resetChaos = useCallback(() => {
    setKilledNodeId(null);
    setChaosArmed(false);
  }, []);

  const handleTrace = useCallback(
    (flowIdx: number, stepIdx: number) => {
      setFocusNodeIds(null);
      setStageIdx(null);
      resetChaos();
      setTrace({ flowIdx, stepIdx });
      scrollToDiagram();
    },
    [scrollToDiagram, resetChaos],
  );

  const handleLocate = useCallback(
    (nodeIds: string[]) => {
      setTrace(null);
      setStageIdx(null);
      resetChaos();
      setFocusNodeIds(nodeIds);
      scrollToDiagram();
    },
    [scrollToDiagram, resetChaos],
  );

  const clearHighlight = useCallback(() => {
    setTrace(null);
    setFocusNodeIds(null);
  }, []);

  const handleStage = useCallback(
    (idx: number) => {
      setTrace(null);
      setFocusNodeIds(null);
      resetChaos();
      setStageIdx(idx);
      scrollToDiagram();
    },
    [scrollToDiagram, resetChaos],
  );

  const handleStageChange = useCallback((idx: number) => setStageIdx(idx), []);

  const handleCloseStage = useCallback(() => setStageIdx(null), []);

  const handleToggleChaos = useCallback(() => {
    if (chaosArmed || killedNodeId) {
      resetChaos();
      return;
    }
    setTrace(null);
    setFocusNodeIds(null);
    setStageIdx(null);
    setChaosArmed(true);
  }, [chaosArmed, killedNodeId, resetChaos]);

  // Kills a node (or restores it when clicked again); arming stays on so the reader can hop between targets.
  const handleChaosKill = useCallback(
    (nodeId: string) => {
      if (killedNodeId === nodeId) {
        setKilledNodeId(null);
        return;
      }
      setTrace(null);
      setFocusNodeIds(null);
      setStageIdx(null);
      setChaosArmed(true);
      setKilledNodeId(nodeId);
      scrollToDiagram();
    },
    [killedNodeId, scrollToDiagram],
  );

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
      <section
        id="main-content"
        className="relative flex min-h-screen w-full flex-col pt-24 pb-24"
        aria-label="Diagram detail"
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,color-mix(in_oklab,var(--foreground)_4%,transparent)_1px,transparent_1px)] bg-size-[24px_24px]" />

          <DiagramPageBackground />
        </div>

        <Container className="relative z-10 flex flex-1 flex-col gap-14 md:gap-20">
          <DiagramPageHero
            title={design.title}
            description={design.description}
            sectionIndex={sectionIndex}
          />

          <div className='flex flex-col md:flex-row gap-8'>
            <div className='sticky top-20 self-start hidden md:block'>
              <p className='font-poppins'>Content</p>
              <LineNav
                className=''
                onItemClick={(item, e) => handleIndexClick(e, item.href.slice(1))}
                items={sectionIndex.map((s) => ({
                  href: `#${s.id}`,
                  title: s.label,
                }))}
              />
            </div>
            <div className='flex flex-1 flex-col gap-14 md:gap-20 max-w-6xl ml-auto'>

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
                stageIdx={stageIdx}
                visible={visible}
                onStageChange={handleStageChange}
                onCloseStage={handleCloseStage}
                chaos={chaosState}
                chaosArmed={chaosArmed}
                killedNode={killedNode}
                hasChaosData={killableNodes.length > 0}
                onToggleChaos={handleToggleChaos}
                onChaosKill={handleChaosKill}
                onRestoreChaos={resetChaos}
              />
              {design.requirements && (
                <RequirementsSection requirements={design.requirements} />
              )}

              {design.estimates && design.estimates.length > 0 && (
                <EstimatesSection estimates={design.estimates} />
              )}

              {design.stages && design.stages.length > 0 && (
                <EvolutionSection
                  stages={design.stages}
                  activeStageIndex={stageIdx}
                  onStage={handleStage}
                />
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
                    className="border border-foreground/8 bg-foreground/2 p-6 md:p-10"
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

              {killableNodes.length > 0 && (
                <ChaosSection
                  nodes={killableNodes}
                  killedNodeId={killedNodeId}
                  onKill={handleChaosKill}
                />
              )}

              {design.quiz && design.quiz.length > 0 && (
                <QuizSection quiz={design.quiz} />
              )}

              <ReferencesSection references={design.references ?? []} related={related} />

              <DiagramPageCreator />

              <DiagramPageSuggestions suggested={suggested} />
            </div>
          </div>

        </Container>
      </section>
      <Footer />
    </div>
  );
}
