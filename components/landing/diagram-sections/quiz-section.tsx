'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus } from 'lucide-react';
import type { QuizItem } from '@/types/diagram';
import RichText from '@/components/ui/rich-text';
import { Section, SectionHeader, fadeUp } from './section-shell';

export default function QuizSection({ quiz }: { quiz: QuizItem[] }) {
  const [open, setOpen] = useState<Set<number>>(new Set());
  const toggle = (i: number) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  if (quiz.length === 0) return null;

  return (
    <Section id="quiz">
      <SectionHeader
        label="Active Recall"
        title="Test Yourself"
        description="If you can answer these without scrolling back up, the architecture is yours. Try each one out loud before revealing."
      />

      <motion.div variants={fadeUp} className="divide-y divide-foreground/8 border border-foreground/8 bg-foreground/2">
        {quiz.map((item, i) => {
          const isOpen = open.has(i);
          return (
            <div key={i}>
              <button
                type="button"
                onClick={() => toggle(i)}
                aria-expanded={isOpen}
                className="flex w-full cursor-pointer items-start gap-4 px-6 py-4 text-left transition-colors hover:bg-foreground/2"
              >
                <span className={`mt-0.5 shrink-0 font-mono text-xs font-semibold tabular-nums ${isOpen ? 'text-primary' : 'text-foreground/45'}`}>
                  Q{i + 1}
                </span>
                <span className="flex-1 font-sans text-[15px] leading-relaxed text-foreground/90">
                  {item.question}
                </span>
                <span className="mt-0.5 shrink-0 text-foreground/40">
                  {isOpen ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                </span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="mx-6 mb-4 border-l-2 border-primary/40 py-1 pl-4">
                      <div className="mb-1.5 font-mono text-[11px] font-semibold tracking-[0.15em] text-primary uppercase">
                        Answer
                      </div>
                      <RichText content={item.answer} className="text-sm leading-relaxed" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </motion.div>
    </Section>
  );
}
