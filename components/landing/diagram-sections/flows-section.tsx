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
      <SectionHeader label="Follow the Data" title="Request Flows" />
      <motion.p
        variants={fadeUp}
        className="-mt-4 mb-8 max-w-2xl text-sm leading-relaxed text-foreground/50 font-poppins"
      >
        A diagram tells you what exists — a trace tells you what happens.
        Press play on a flow (or click any step) and the diagram above
        lights up the exact path that request takes.
      </motion.p>

      <div className="space-y-6">
        {flows.map((flow, flowIdx) => {
          const isActive = activeFlowIndex === flowIdx;
          return (
            <motion.div
              key={flow.id}
              variants={fadeUp}
              className={`border bg-foreground/1.5 transition-colors ${isActive ? 'border-primary/30' : 'border-foreground/5'}`}
            >
              {/* Flow header */}
              <div className="flex flex-wrap items-center gap-3 border-b border-foreground/5 px-6 py-4">
                <span className="border border-primary/25 bg-primary/5 px-2 py-0.5 text-[10px] font-bold tracking-widest text-primary uppercase">
                  Flow {String(flowIdx + 1).padStart(2, '0')}
                </span>
                <h3 className="text-sm font-bold tracking-wide text-foreground uppercase">
                  {flow.title}
                </h3>
                <button
                  type="button"
                  onClick={() => onTrace(flowIdx, 0)}
                  className="ml-auto inline-flex cursor-pointer items-center gap-1.5 border border-foreground/10 px-3 py-1.5 text-[10px] font-bold tracking-widest text-foreground/60 uppercase transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                >
                  <Play className="h-3 w-3" />
                  Trace in diagram
                </button>
              </div>

              {flow.description && (
                <p className="border-b border-foreground/5 px-6 py-3 text-xs leading-relaxed text-foreground/45 font-poppins">
                  {flow.description}
                </p>
              )}

              {/* Steps */}
              <ol className="divide-y divide-foreground/4">
                {flow.steps.map((step, stepIdx) => {
                  const isCurrentStep = isActive && activeStepIndex === stepIdx;
                  const nodeNames = (step.nodeIds ?? [])
                    .map((id) => nodeNameById.get(id))
                    .filter((n): n is string => !!n);
                  return (
                    <li key={stepIdx}>
                      <button
                        type="button"
                        onClick={() => onTrace(flowIdx, stepIdx)}
                        className={`group flex w-full font-poppins cursor-pointer items-start gap-4 px-6 py-3.5 text-left transition-colors ${isCurrentStep ? 'bg-primary/5' : 'hover:bg-foreground/2'}`}
                        aria-label={`Trace step ${stepIdx + 1} of ${flow.title} in the diagram`}
                      >
                        <span
                          className={`mt-0.5 shrink-0 font-doto text-sm font-black tabular-nums ${isCurrentStep ? 'text-primary' : 'text-foreground/25 group-hover:text-foreground/50'}`}
                        >
                          {String(stepIdx + 1).padStart(2, '0')}
                        </span>
                        <span className="flex-1">
                          <span className={`block text-sm leading-relaxed ${isCurrentStep ? 'text-foreground' : 'text-foreground/65'}`}>
                            {step.text}
                          </span>
                          {nodeNames.length > 0 && (
                            <span className="mt-1.5 flex flex-wrap gap-1.5">
                              {nodeNames.map((name, i) => (
                                <span
                                  key={`${name}-${i}`}
                                  className={`border px-1.5 py-0.5 text-[10px] tracking-wider ${isCurrentStep ? 'border-primary/25 text-primary/90' : 'border-foreground/8 text-foreground/35'}`}
                                >
                                  {name}
                                </span>
                              ))}
                            </span>
                          )}
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
