'use client'

import { memo, useState, useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { BaseEdge, getSmoothStepPath, EdgeLabelRenderer, useReactFlow, type EdgeProps, type Edge, getBezierPath } from '@xyflow/react'
import { useTheme } from 'next-themes'
import { ChevronRightIcon } from 'lucide-react'

interface EdgeData {
  label?: string
  protocol?: string
  lineStyle?: 'solid' | 'dashed' | 'dotted'
  color?: string
  width?: number
}

type ArchitectureFlowEdge = Edge<EdgeData & Record<string, unknown>>

function ArchitectureEdgeComponent({
  id,
  animated,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
}: EdgeProps<ArchitectureFlowEdge>) {
  const { deleteElements, setEdges } = useReactFlow()
  const [menuPos, setMenuPos] = useState<{x: number; y: number} | null>(null)
  const [submenu, setSubmenu] = useState<string | null>(null)

  const closeMenu = useCallback(() => setMenuPos(null), [])

  useEffect(() => {
    if (!menuPos) return
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('[data-edge-context-menu]')) closeMenu()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuPos, closeMenu])

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setMenuPos({ x: e.clientX, y: e.clientY })
  }, [])

  const themeCtx = useTheme?.()
  const isDark = themeCtx?.resolvedTheme === 'dark'
  const fallbackColor = isDark ? '#71717a' : '#64748b'
  const strokeColor = selected ? '#60a5fa' : (data?.color || fallbackColor)

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    // borderRadius: 12,
  })

  const strokeDasharray =
    data?.lineStyle === 'dashed' ? '6,4'
    : data?.lineStyle === 'dotted' ? '2,3'
    : undefined

  const strokeWidth = selected ? 3 : (data?.width || 2.5)

  const updateEdge = useCallback((updates: Partial<EdgeData & { animated?: boolean }>) => {
    setEdges((eds) =>
      eds.map((e) => {
        if (e.id !== id) return e
        const { animated: anim, ...dataUpdates } = updates
        return { ...e, animated: anim ?? e.animated, data: { ...e.data, ...dataUpdates } }
      }),
    )
    closeMenu()
  }, [id, setEdges, closeMenu])

  const currentLabel = !data?.lineStyle && !animated ? 'Solid'
    : !data?.lineStyle && animated ? 'Animated'
    : data?.lineStyle === 'dashed' && !animated ? 'Dashed'
    : data?.lineStyle === 'dashed' && animated ? 'Dashed (animated)'
    : data?.lineStyle === 'dotted' && !animated ? 'Dotted'
    : data?.lineStyle === 'dotted' && animated ? 'Dotted (animated)'
    : 'Solid'

  return (
    <>
      <g onContextMenu={handleContextMenu}>
      <defs>
        <marker
          id={`arrow-${id}`}
          viewBox="0 -5 10 10"
          refX="8"
          refY="0"
          markerWidth="10"
          markerHeight="10"
          markerUnits="userSpaceOnUse"
          orient="auto-start-reverse"
        >
          <path d="M 1 -3 L 8 0 L 1 3" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        </marker>
      </defs>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: strokeColor,
          strokeWidth,
          strokeDasharray,
          cursor: 'pointer',
        }}
        markerEnd={`url(#arrow-${id})`}
        />
      {data?.label && (
        <EdgeLabelRenderer>
          <div
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            }}
            className="pointer-events-none absolute z-50 rounded bg-background px-2 py-0.5 text-xs font-medium text-zinc-600 shadow-sm dark:text-zinc-300"
          >
            {data.label}
          </div>
        </EdgeLabelRenderer>
      )}
      </g>
      {menuPos && createPortal(
        <div
          data-edge-context-menu
          style={{ position: 'fixed', left: menuPos.x, top: menuPos.y, zIndex: 9999 }}
          className="min-w-36 rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10"
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Line Style submenu */}
          <div
            className="relative"
            onMouseEnter={() => setSubmenu('style')}
            onMouseLeave={() => setSubmenu(null)}
          >
            <div className="group/context-menu-item flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground">
              <span className="flex-1">Line Style</span>
              <span className="text-xs text-muted-foreground">{currentLabel}</span>
              <ChevronRightIcon className="size-3.5" />
            </div>
            {submenu === 'style' && (
              <div
                className="absolute left-full top-0 ml-1 min-w-36 rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10"
                onMouseDown={(e) => e.stopPropagation()}
              >
                <div className="flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground" onClick={() => updateEdge({ lineStyle: undefined, animated: false })}>
                  Solid
                </div>
                <div className="flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground" onClick={() => updateEdge({ lineStyle: 'dashed', animated: false })}>
                  Dashed
                </div>
                <div className="flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground" onClick={() => updateEdge({ lineStyle: 'dotted', animated: false })}>
                  Dotted
                </div>
                <div className="h-px bg-border my-1" />
                <div className="flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground" onClick={() => updateEdge({ lineStyle: 'dashed', animated: true })}>
                  Dashed (animated)
                </div>
                <div className="flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground" onClick={() => updateEdge({ lineStyle: 'dotted', animated: true })}>
                  Dotted (animated)
                </div>
              </div>
            )}
          </div>
          <div className="h-px bg-border my-1" />
          <div
            className="flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground"
            onClick={() => { deleteElements({ edges: [{ id }] }); closeMenu() }}
          >
            Delete
          </div>
        </div>,
        document.body
      )}
    </>
  )
}

export default memo(ArchitectureEdgeComponent)
