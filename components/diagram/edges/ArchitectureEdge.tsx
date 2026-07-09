'use client'

import { memo, useState, useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { BaseEdge, EdgeLabelRenderer, useReactFlow, type EdgeProps, type Edge, getBezierPath } from '@xyflow/react'
import { useTheme } from 'next-themes'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useDiagramHighlight } from '@/lib/diagram/highlight-context'
import { useDiagramChaos } from '@/lib/diagram/chaos-context'
import { useEditable } from '@/lib/diagram/editable-context'
import { useEdgeHover } from '@/lib/diagram/edge-hover-context'
import { usePortalTarget } from '@/lib/diagram/portal-target-context'
import { clampMenuPosition } from '@/lib/diagram/menu-position'

interface EdgeData {
  label?: string
  protocol?: string
  lineStyle?: 'solid' | 'dashed' | 'dotted'
  color?: string
  width?: number
  sync?: boolean
  guarantees?: string[]
  qps?: string
  p99?: string
  payloadSize?: string
}

type ArchitectureFlowEdge = Edge<EdgeData & Record<string, unknown>>

/** Maps a throughput string ("~100K peak", "10M+") to travelling-particle density.
 *  Bigger pipes get more, faster dots so a firehose reads as a firehose. */
function particleConfig(qps?: string): { count: number; dur: number } {
  const m = qps?.match(/([\d.]+)\s*([kmb])?/i)
  if (!m) return { count: 1, dur: 2.8 }
  let n = parseFloat(m[1])
  const unit = m[2]?.toLowerCase()
  if (unit === 'k') n *= 1e3
  else if (unit === 'm') n *= 1e6
  else if (unit === 'b') n *= 1e9
  if (n >= 1e6) return { count: 4, dur: 1.5 }
  if (n >= 1e4) return { count: 3, dur: 2.0 }
  if (n >= 1e2) return { count: 2, dur: 2.4 }
  return { count: 1, dur: 2.8 }
}

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
  const editable = useEditable()
  // Menus portal into the diagram container so they stay visible in fullscreen mode.
  const portalTarget = usePortalTarget()
  const { hoveredEdgeIds } = useEdgeHover()
  const isHovered = hoveredEdgeIds.has(id)
  const [menuPos, setMenuPos] = useState<{x: number; y: number} | null>(null)
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState('')
  const closeMenu = useCallback(() => setMenuPos(null), [])

  const startEditing = useCallback((initialValue: string = '') => {
    setEditValue(initialValue)
    setEditing(true)
  }, [])

  const saveLabel = useCallback(() => {
    const nextLabel = editValue.trim() || undefined
    if (nextLabel !== (data?.label || undefined)) {
      setEdges((eds) =>
        eds.map((e) => {
          if (e.id !== id) return e
          return { ...e, data: { ...e.data, label: nextLabel } }
        }),
      )
    }
    setEditing(false)
  }, [id, setEdges, editValue, data?.label])

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
    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('[data-edge-context-menu]')) closeMenu()
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu()
    }
    document.addEventListener('mousedown', onMouseDown, true)
    document.addEventListener('keydown', onKeyDown, true)
    return () => {
      document.removeEventListener('mousedown', onMouseDown, true)
      document.removeEventListener('keydown', onKeyDown, true)
    }
  }, [menuPos, closeMenu])

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    if (!editable) return
    e.preventDefault()
    e.stopPropagation()
    setMenuPos(clampMenuPosition(e.clientX, e.clientY, 192, 260))
  }, [editable])

  const themeCtx = useTheme?.()
  const isDark = themeCtx?.resolvedTheme === 'dark'
  const fallbackColor = isDark ? '#71717a' : '#64748b'

  const { highlight } = useDiagramHighlight()
  const highlightState = highlight ? highlight.edges.get(id) : undefined
  const isDimmed = !!highlight && !highlightState

  const { chaos } = useDiagramChaos()
  const chaosFailed = chaos ? chaos.edges.has(id) : false

  const strokeColor = chaosFailed
    ? '#ef4444'
    : highlightState
    ? 'var(--color-primary)'
    : selected ? '#60a5fa' : (data?.color || fallbackColor)

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    // borderRadius: 12,
  })

  // Sync contract drives the resting look: async (sync === false) reads as dashed
  // with travelling particles; sync stays solid. An explicit `lineStyle` still wins.
  const contractDash =
    data?.lineStyle === 'dashed' ? '6,4'
    : data?.lineStyle === 'dotted' ? '2,3'
    : data?.sync === false ? '6,4'
    : undefined

  const strokeDasharray =
    chaosFailed ? '5,5'
    : highlightState === 'active' ? '6,4'
    : contractDash

  const particles = particleConfig(data?.qps)
  const showParticles =
    data?.sync === false &&
    !chaosFailed &&
    !isDimmed &&
    !chaos &&
    highlightState !== 'active'

  const hasContract =
    data?.sync !== undefined ||
    !!data?.qps ||
    !!data?.p99 ||
    !!data?.payloadSize ||
    (data?.guarantees?.length ?? 0) > 0

  const strokeWidth = highlightState === 'active' ? 3 : selected ? 3 : (data?.width || 2.5)
  const groupOpacity = chaos
    ? (chaosFailed ? 1 : 0.1)
    : isDimmed ? 0.08 : highlightState === 'trail' ? 0.65 : 1

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
      <g onContextMenu={handleContextMenu} style={{ opacity: groupOpacity, transition: 'opacity 0.5s' }}>
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
          // dashdraw keyframes ship with the imported @xyflow/react stylesheet
          // 'none' on failed edges also cancels the .animated class — dead links must not look like flowing traffic
          animation: chaosFailed ? 'none' : highlightState === 'active' ? 'dashdraw 0.5s linear infinite' : undefined,
        }}
        markerEnd={`url(#arrow-${id})`}
        />
      {showParticles && (
        <g style={{ pointerEvents: 'none' }}>
          {Array.from({ length: particles.count }).map((_, i) => (
            <circle key={i} r={2.4} fill={strokeColor}>
              {/* Negative begin pre-distributes the dots evenly along the pipe. */}
              <animateMotion
                dur={`${particles.dur}s`}
                repeatCount="indefinite"
                begin={`${(-i * particles.dur) / particles.count}s`}
                path={edgePath}
                rotate="auto"
              />
            </circle>
          ))}
        </g>
      )}
      {(data?.label || editing || (data?.protocol && isHovered) || (hasContract && isHovered)) && (
        <EdgeLabelRenderer>
          <div
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              opacity: groupOpacity,
              transition: 'opacity 0.5s',
            }}
            className="pointer-events-auto absolute z-50"
            onDoubleClick={(e) => { if (!editable) return; e.stopPropagation(); startEditing(data?.label || '') }}
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
              <div className="flex flex-col items-center gap-1">
                {(data?.label || (data?.protocol && isHovered)) && (
                  <div className={`flex items-center gap-1.5 rounded bg-background px-2 py-0.5 text-xs font-medium shadow-sm ${highlightState === 'active' ? 'text-foreground ring-1 ring-primary/50' : 'text-zinc-600 dark:text-zinc-300'}`}>
                    {data?.label && <span>{data.label}</span>}
                    {data?.protocol && isHovered && (
                      <span className="text-[9px] uppercase tracking-wider text-muted-foreground">{data.protocol}</span>
                    )}
                  </div>
                )}
                {hasContract && isHovered && (
                  <div className="flex w-max max-w-[220px] flex-col gap-1.5 rounded-md border border-foreground/10 bg-background/95 px-2.5 py-2 font-mono shadow-lg backdrop-blur-sm">
                    {data?.sync !== undefined && (
                      <span className={`inline-flex w-fit items-center gap-1 px-1.5 py-0.5 text-[9px] font-bold tracking-widest uppercase ${data.sync ? 'bg-sky-500/15 text-sky-500' : 'bg-violet-500/15 text-violet-500'}`}>
                        {data.sync ? 'sync · caller waits' : 'async · fire & forget'}
                      </span>
                    )}
                    {(data?.qps || data?.p99 || data?.payloadSize) && (
                      <div className="flex flex-wrap gap-x-2.5 gap-y-0.5 text-[10px] text-foreground/70">
                        {data?.qps && (
                          <span><span className="text-foreground/40">qps</span> {data.qps}</span>
                        )}
                        {data?.p99 && (
                          <span><span className="text-foreground/40">p99</span> {data.p99}</span>
                        )}
                        {data?.payloadSize && (
                          <span><span className="text-foreground/40">size</span> {data.payloadSize}</span>
                        )}
                      </div>
                    )}
                    {(data?.guarantees?.length ?? 0) > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {data!.guarantees!.map((g) => (
                          <span key={g} className="border border-foreground/10 px-1 py-0.5 text-[8px] tracking-wider text-foreground/55 lowercase">
                            {g}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
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
        portalTarget ?? document.body
      )}
    </>
  )
}

export default memo(ArchitectureEdgeComponent)
