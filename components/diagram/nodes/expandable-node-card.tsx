'use client'

import { useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'motion/react'
import { X } from 'lucide-react'
import { useEditable } from '@/lib/diagram/editable-context'

interface ExpandableNodeCardProps {
  trigger: React.ReactNode
  title: string
  subtitle?: string
  icon?: React.ReactNode
  color?: string
  children?: React.ReactNode
}

// ease-out-expo: aggressive start, long tail — best for large surface reveals
const EASE_OUT_EXPO = [0.19, 1, 0.22, 1] as const
// ease-in-quart: fast collapse — exits should feel instant
const EASE_IN_QUART = [0.895, 0.03, 0.685, 0.22] as const

interface PortalOrigin {
  /** clip-path origin as "x% y%" relative to the card's bounding box */
  clipAt: string
  /** initial circle radius matches the node's icon — the iris starts at node size */
  initRadiusPx: number
}

function computePortalOrigin(nodeRect: DOMRect): PortalOrigin {
  const vw = window.innerWidth
  const vh = window.innerHeight
  // Mirror the Tailwind constraints: max-w-4xl (56rem = 896px), p-4 container, max-h-[90vh]
  const cardW = Math.min(vw - 32, 896)
  const cardH = vh * 0.9
  const cardLeft = Math.max(16, (vw - cardW) / 2)
  const cardTop = Math.max(16, (vh - cardH) / 2)

  const nx = nodeRect.left + nodeRect.width / 2
  const ny = nodeRect.top + nodeRect.height / 2

  const ox = ((nx - cardLeft) / cardW) * 100
  const oy = ((ny - cardTop) / cardH) * 100

  return {
    clipAt: `${ox.toFixed(2)}% ${oy.toFixed(2)}%`,
    initRadiusPx: Math.min(nodeRect.width, nodeRect.height) / 2,
  }
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
  const [origin, setOrigin] = useState<PortalOrigin>({ clipAt: '50% 50%', initRadiusPx: 20 })
  const triggerRef = useRef<HTMLDivElement>(null)
  const editable = useEditable()

  const handleOpen = () => {
    if (editable) return
    if (triggerRef.current) {
      setOrigin(computePortalOrigin(triggerRef.current.getBoundingClientRect()))
    }
    setIsOpen(true)
  }

  const clipClosed = `circle(${origin.initRadiusPx}px at ${origin.clipAt})`
  const clipOpen = `circle(200% at ${origin.clipAt})`

  return (
    <>
      <div ref={triggerRef} onClick={handleOpen} className="cursor-pointer">
        {trigger}
      </div>

      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop — dims and blurs the diagram */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                onClick={() => setIsOpen(false)}
                className="absolute inset-0 bg-black/40 backdrop-blur-[3px]"
              />

              {/* Card — revealed via iris expanding from node position */}
              <motion.div
                initial={{ clipPath: clipClosed }}
                animate={{ clipPath: clipOpen }}
                exit={{
                  clipPath: clipClosed,
                  transition: { duration: 0.22, ease: EASE_IN_QUART },
                }}
                transition={{ duration: 0.55, ease: EASE_OUT_EXPO }}
                className="relative w-full max-w-4xl max-h-[90vh] bg-card overflow-hidden z-10 flex flex-col shadow-2xl"
              >
                {/* Radial glow at origin — fades as card fully opens, reinforces the source point */}
                <motion.div
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                  className="absolute inset-0 pointer-events-none z-20"
                  style={{
                    background: `radial-gradient(circle at ${origin.clipAt}, rgba(255,255,255,0.18) 0%, transparent 50%)`,
                  }}
                />

                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 right-4 z-30 flex h-8 w-8 items-center justify-center bg-black/50 hover:bg-black/70 active:scale-[0.96] transition-[background-color,transform] backdrop-blur-sm after:absolute after:-inset-1"
                >
                  <X className="text-white h-4 w-4" />
                </button>

                {/* Colored header */}
                <div
                  className="relative w-full shrink-0 overflow-hidden md:h-full flex items-center"
                  style={{ backgroundColor: color || 'oklch(0.7 0 0)' }}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.35)_1px,transparent_1.5px)] bg-size-[16px_16px] opacity-30" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,transparent_30%,rgba(0,0,0,0.28)_100%)]" />

                  {icon && (
                    <div className="relative flex h-28 w-28 items-center justify-center">
                      <div className="h-14 w-14 text-white/90">{icon}</div>
                    </div>
                  )}
                  <div className="shrink-0">
                    {subtitle && (
                      <p className="text-white/80 text-xs font-medium tracking-wide uppercase">{subtitle}</p>
                    )}
                    <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white text-balance">
                      {title}
                    </h3>
                  </div>
                </div>

                {/* Content — staggered in after card is mostly open */}
                <div className="flex min-h-0 w-full flex-1 flex-col md:w-1/2 md:flex-none">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.28, duration: 0.3, ease: 'easeOut' }}
                    className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8 sm:py-8 text-foreground/80 text-sm leading-relaxed"
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
