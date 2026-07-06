'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'motion/react'

interface ExpandableNodeCardProps {
  trigger: React.ReactNode
  title: string
  subtitle?: string
  icon?: React.ReactNode
  color?: string
  children?: React.ReactNode
}

export default function ExpandableNodeCard({
  trigger,
  title,
  subtitle,
  icon,
  color,
  children,
}: ExpandableNodeCardProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div onClick={() => setIsOpen(true)} className="cursor-pointer">
        {trigger}
      </div>

      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="absolute inset-0 "
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="relative w-full max-w-4xl max-h-[90vh] bg-card rounded-none overflow-hidden border border-border z-10 flex flex-col md:flex-row shadow-xl"
              >
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 right-4 z-20 flex h-8 w-8 items-center justify-center bg-background/50 hover:bg-accent rounded-none border border-border text-foreground transition-colors backdrop-blur-sm"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>

                <div
                  className="relative h-64 w-full shrink-0 overflow-hidden md:h-full md:w-1/2 flex items-center justify-center"
                  style={{ backgroundColor: color || 'oklch(0.7 0 0)' }}
                >
                  {icon && (
                    <div className="w-24 h-24 text-white/90">
                      {icon}
                    </div>
                  )}
                </div>

                <div className="p-6 sm:p-8 w-full md:w-1/2 flex flex-col h-full overflow-y-auto">
                  {subtitle && (
                    <p className="text-primary text-xs font-medium tracking-wide uppercase mb-3">{subtitle}</p>
                  )}
                  <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground mb-6 pb-4 border-b border-border">
                    {title}
                  </h3>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ delay: 0.2 }}
                    className="text-foreground/80 text-sm leading-relaxed grow"
                  >
                    {children || (
                      <p className="text-muted-foreground italic">No additional information available.</p>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  )
}
