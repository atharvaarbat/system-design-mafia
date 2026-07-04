'use client'

import { memo } from 'react'
import { BaseEdge, getSmoothStepPath, EdgeLabelRenderer, type EdgeProps, type Edge } from '@xyflow/react'
import { useTheme } from 'next-themes'

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
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
}: EdgeProps<ArchitectureFlowEdge>) {
  const themeCtx = useTheme?.()
  const isDark = themeCtx?.resolvedTheme === 'dark'
  const fallbackColor = isDark ? '#71717a' : '#64748b'
  const strokeColor = selected ? '#60a5fa' : (data?.color || fallbackColor)

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 12,
  })

  const strokeDasharray =
    data?.lineStyle === 'dashed' ? '6,4'
    : data?.lineStyle === 'dotted' ? '2,3'
    : undefined

  const strokeWidth = selected ? 3 : (data?.width || 2.5)

  return (
    <>
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
  <defs>
    <marker
      id={`arrow-${id}`}
      viewBox="0 0 12 12"
      refX="10"
      refY="6"
      markerWidth="10"
      markerHeight="10"
      orient="auto"
      markerUnits="strokeWidth"
    >
      <path
        d="M 1 1 L 11 6 L 1 11"
        fill="none"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </marker>
  </defs>
</svg>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: strokeColor,
          strokeWidth,
          strokeDasharray,
        }}
        markerEnd={`url(#arrow-${id})`}
        />
      {data?.label && (
        <EdgeLabelRenderer>
          <div
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            }}
            className="pointer-events-none absolute rounded bg-white px-2 py-0.5 text-xs font-medium text-zinc-600 shadow-sm dark:bg-zinc-800 dark:text-zinc-300"
          >
            {data.label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  )
}

export default memo(ArchitectureEdgeComponent)
