'use client'

import { useState, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence, type Transition } from 'motion/react'
import { X } from 'lucide-react'
import { useEditable } from '@/lib/diagram/editable-context'
import { usePortalTarget } from '@/lib/diagram/portal-target-context'

interface ExpandableNodeCardProps {
  trigger: React.ReactNode
  title: string
  subtitle?: string
  icon?: React.ReactNode
  color?: string
  children?: React.ReactNode
}

const spring: Transition = {
  type: 'spring',
  stiffness: 800,
  damping: 80,
  mass: 5,
}

function computeCardOrigin(nodeRect: DOMRect) {
  const cardW = Math.min(480, window.innerWidth - 32)
  const cardMaxH = Math.min(window.innerHeight - 32, 600)

  let left = Math.round(nodeRect.left)
  let top = Math.round(nodeRect.top)

  if (left + cardW > window.innerWidth - 16) {
    left = Math.max(16, window.innerWidth - cardW - 16)
  }
  if (top + cardMaxH > window.innerHeight - 16) {
    top = Math.max(16, window.innerHeight - cardMaxH - 16)
  }

  return { left, top, cardW, cardMaxH }
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
  const [origin, setOrigin] = useState({ left: 0, top: 0, cardW: 480, cardMaxH: 600 })
  const triggerRef = useRef<HTMLDivElement>(null)
  const editable = useEditable()
  const portalTarget = usePortalTarget()

  const open = useCallback(() => {
    if (triggerRef.current) {
      setOrigin(computeCardOrigin(triggerRef.current.getBoundingClientRect()))
    }
    setIsOpen(true)
  }, [])

  // Read-only: single click opens. Editing: click selects/drags, double-click opens.
  const handleClick = useCallback(() => {
    if (editable) return
    open()
  }, [editable, open])

  const handleDoubleClick = useCallback(() => {
    if (!editable) return
    open()
  }, [editable, open])

  const handleClose = useCallback(() => {
    setIsOpen(false)
  }, [])

  return (
    <>
      <div ref={triggerRef} onClick={handleClick} onDoubleClick={handleDoubleClick} className="cursor-pointer">
        {trigger}
      </div>

      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={handleClose}
              className="fixed inset-0 z-50 bg-black/15"
            >
              <motion.div
                key="node-card"
                initial={{ opacity: 0, scale: 0.85, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.85, y: -8 }}
                transition={spring}
                onClick={(e) => e.stopPropagation()}
                style={{
                  position: 'fixed',
                  left: origin.left,
                  top: origin.top,
                  width: origin.cardW,
                  maxHeight: origin.cardMaxH,
                  transformOrigin: 'top left',
                  borderRadius: 16,
                }}
                className="overflow-hidden bg-card shadow-2xl flex flex-col"
              >
                <button
                  onClick={handleClose}
                  className="absolute top-3 right-3 z-30 flex h-7 w-7 items-center justify-center rounded-full bg-black/40 text-white/80 hover:bg-black/60 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>

                <div
                  className="relative shrink-0 flex items-center"
                  style={{ backgroundColor: color || 'oklch(0.7 0 0)' }}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.35)_1px,transparent_1.5px)] bg-size-[16px_16px] opacity-30" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,transparent_30%,rgba(0,0,0,0.28)_100%)]" />

                  <div className="flex items-center gap-4 px-5 py-5">
                    {icon && (
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center">
                        <div className="h-8 w-8 text-white/90">{icon}</div>
                      </div>
                    )}
                    <div>
                      {subtitle && (
                        <p className="text-white/70 text-[11px] font-medium tracking-wide uppercase">
                          {subtitle}
                        </p>
                      )}
                      <h3 className="text-xl font-semibold tracking-tight text-white text-balance leading-tight">
                        {title}
                      </h3>
                    </div>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.12, duration: 0.2 }}
                  className="min-h-0 flex-1 overflow-y-auto px-5 py-5 text-foreground/80 text-sm leading-relaxed"
                >
                  {children || (
                    <p className="text-muted-foreground italic">No additional information available.</p>
                  )}
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        portalTarget ?? document.body
      )}
    </>
  )
}
