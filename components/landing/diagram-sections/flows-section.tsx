'use client';

import { motion } from 'motion/react';
import { Play } from 'lucide-react';
import type { RequestFlow } from '@/types/diagram';
import { Section, SectionHeader, fadeUp } from './section-shell';

export default function FlowsSection({
  flows,
  nodeNameById,
  activeFlowIndex,
  activeStepIndex,
  onTrace,
}: {
  flows: RequestFlow[];
  nodeNameById: Map<string, string>;
  activeFlowIndex: number | null;
  activeStepIndex: number;
  onTrace: (flowIndex: number, stepIndex: number) => void;
}) {
  if (flows.length === 0) return null;

  return (
    <Section id="flows">
      <SectionHeader
        label="Follow the Data"
        title="Request Flows"
        description="A diagram shows what exists; a trace shows what happens. Press play on a flow, or click any step, and the diagram above lights up the exact path that request takes."
      />

      <div className="space-y-6">
        {flows.map((flow, flowIdx) => {
          const isActive = activeFlowIndex === flowIdx;
          return (
            <motion.div
              key={flow.id}
              variants={fadeUp}
              className={`border bg-foreground/2 transition-colors ${isActive ? 'border-primary/30' : 'border-foreground/8'}`}
            >
              {/* Flow header */}
              <div className="flex flex-wrap items-center gap-3 border-b border-foreground/8 px-6 py-4">
                <span className="font-mono text-[11px] font-semibold tracking-[0.15em] text-primary uppercase tabular-nums">
                  Flow {String(flowIdx + 1).padStart(2, '0')}
                </span>
                <h3 className="font-sans text-base font-semibold text-foreground">
                  {flow.title}
                </h3>
                <button
                  type="button"
                  onClick={() => onTrace(flowIdx, 0)}
                  className="ml-auto inline-flex cursor-pointer items-center gap-1.5 border border-foreground/15 px-3 py-1.5 font-mono text-[11px] font-semibold tracking-[0.15em] text-foreground/70 uppercase transition-[color,background-color,border-color,transform] hover:border-primary/40 hover:bg-primary/5 hover:text-primary active:scale-[0.96]"
                >
                  <Play className="h-3 w-3" />
                  Trace in diagram
                </button>
              </div>

              {flow.description && (
                <p className="border-b border-foreground/8 px-6 py-3.5 font-sans text-sm leading-relaxed text-foreground/70">
                  {flow.description}
                </p>
              )}

              {/* Steps */}
              <ol className="divide-y divide-foreground/5">
                {flow.steps.map((step, stepIdx) => {
                  const isCurrentStep = isActive && activeStepIndex === stepIdx;
                  return (
                    <li key={stepIdx}>
                      <button
                        type="button"
                        onClick={() => onTrace(flowIdx, stepIdx)}
                        className={`group flex w-full cursor-pointer items-start gap-4 px-6 py-3.5 text-left transition-colors ${isCurrentStep ? 'bg-primary/5' : 'hover:bg-foreground/2'}`}
                        aria-label={`Trace step ${stepIdx + 1} of ${flow.title} in the diagram`}
                      >
                        <span
                          className={`mt-0.5 shrink-0 font-mono text-xs font-semibold tabular-nums ${isCurrentStep ? 'text-primary' : 'text-foreground/45 group-hover:text-foreground/70'}`}
                        >
                          {String(stepIdx + 1).padStart(2, '0')}
                        </span>
                        <span
                          className={`flex-1 font-sans text-[15px] leading-relaxed ${isCurrentStep ? 'text-foreground' : 'text-foreground/85'}`}
                        >
                          {step.text}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}
