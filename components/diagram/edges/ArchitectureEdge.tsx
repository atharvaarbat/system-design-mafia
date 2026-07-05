'use client'

import { memo, useState, useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { BaseEdge, getSmoothStepPath, EdgeLabelRenderer, useReactFlow, type EdgeProps, type Edge, getBezierPath } from '@xyflow/react'
import { useTheme } from 'next-themes'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

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
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState('')
  const closeMenu = useCallback(() => setMenuPos(null), [])

  const startEditing = useCallback((initialValue: string = '') => {
    setEditValue(initialValue)
    setEditing(true)
  }, [])

  const saveLabel = useCallback(() => {
    const trimmed = editValue.trim()
    setEdges((eds) =>
      eds.map((e) => {
        if (e.id !== id) return e
        return { ...e, data: { ...e.data, label: trimmed || undefined } }
      }),
    )
    setEditing(false)
  }, [id, setEdges, editValue])

  const cancelEditing = useCallback(() => {
    setEditing(false)
  }, [])

  const handleLabelKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      saveLabel()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      cancelEditing()
    }
  }, [saveLabel, cancelEditing])

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

  const toggleAnimation = useCallback(() => {
    setEdges((eds) =>
      eds.map((e) => {
        if (e.id !== id) return e
        return { ...e, animated: !e.animated }
      }),
    )
  }, [id, setEdges])

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
      {(data?.label || editing) && (
        <EdgeLabelRenderer>
          <div
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            }}
            className="pointer-events-auto absolute z-50"
            onDoubleClick={(e) => { e.stopPropagation(); startEditing(data?.label || '') }}
          >
            {editing ? (
              <input
                autoFocus
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={saveLabel}
                onKeyDown={handleLabelKeyDown}
                className="rounded border border-input bg-background px-2 py-0.5 text-xs font-medium text-foreground shadow-sm outline-hidden ring-1 ring-ring/50"
              />
            ) : (
              <div className="rounded bg-background px-2 py-0.5 text-xs font-medium text-zinc-600 shadow-sm dark:text-zinc-300">
                {data?.label}
              </div>
            )}
          </div>
        </EdgeLabelRenderer>
      )}
      </g>
      {menuPos && createPortal(
        <div
          data-edge-context-menu
          style={{ position: 'fixed', left: menuPos.x, top: menuPos.y, zIndex: 9999 }}
          className="min-w-40 rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="px-1.5 pb-1 text-xs font-medium text-muted-foreground">Line Style</div>
          <div className="px-1 pb-1.5">
            <ToggleGroup
              value={[!data?.lineStyle ? 'solid' : data.lineStyle]}
              onValueChange={(values) => {
                if (values.length === 0) return
                const value = values[0]
                updateEdge({ lineStyle: value === 'solid' ? undefined : value as 'dashed' | 'dotted' })
              }}
              orientation="horizontal"
              variant="outline"
              spacing={0}
              className="w-full"
            >
              <ToggleGroupItem
                value="solid"
                className="flex h-8 flex-1 items-center justify-center px-0 hover:bg-accent hover:text-accent-foreground data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
              >
                <svg viewBox="0 0 20 12" className="h-3 w-5" aria-label="Solid">
                  <line x1="0" y1="6" x2="20" y2="6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </ToggleGroupItem>
              <ToggleGroupItem
                value="dashed"
                className="flex h-8 flex-1 items-center justify-center px-0 hover:bg-accent hover:text-accent-foreground data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
              >
                <svg viewBox="0 0 20 12" className="h-3 w-5" aria-label="Dashed">
                  <line x1="0" y1="6" x2="20" y2="6" stroke="currentColor" strokeWidth="2.5" strokeDasharray="4 3" strokeLinecap="round" />
                </svg>
              </ToggleGroupItem>
              <ToggleGroupItem
                value="dotted"
                className="flex h-8 flex-1 items-center justify-center px-0 hover:bg-accent hover:text-accent-foreground data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
              >
                <svg viewBox="0 0 20 12" className="h-3 w-5" aria-label="Dotted">
                  <line x1="0" y1="6" x2="20" y2="6" stroke="currentColor" strokeWidth="2.5" strokeDasharray="1 3" strokeLinecap="round" />
                </svg>
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div className="h-px bg-border my-1" />
          {/* Animation Toggle */}
          <div className="flex cursor-default items-center justify-between rounded-md px-1.5 py-1 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground">
            <span>Animation</span>
            <button
              role="switch"
              aria-checked={!!animated}
              onClick={(e) => { e.stopPropagation(); toggleAnimation() }}
              className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${animated ? 'bg-primary' : 'bg-input'}`}
            >
              <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${animated ? 'translate-x-[18px]' : 'translate-x-[3px]'}`} />
            </button>
          </div>
          <div className="h-px bg-border my-1" />
          {/* Label actions */}
          {data?.label ? (
            <div
              className="flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground"
              onClick={() => { updateEdge({ label: undefined }) }}
            >
              Delete Label
            </div>
          ) : (
            <div
              className="flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground"
              onClick={() => { closeMenu(); startEditing('') }}
            >
              Add Label
            </div>
          )}
          <div className="h-px bg-border my-1" />
          {/* Delete */}
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
