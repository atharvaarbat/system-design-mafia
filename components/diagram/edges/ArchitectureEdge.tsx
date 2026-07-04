'use client'

import { memo } from 'react'
import { BaseEdge, getBezierPath, EdgeLabelRenderer, type EdgeProps, type Edge } from '@xyflow/react'
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
  const fallbackColor = isDark ? '#52525b' : '#94a3b8'
  const strokeColor = selected ? '#3b82f6' : (data?.color || fallbackColor)

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  const strokeDasharray =
    data?.lineStyle === 'dashed' ? '6,4'
    : data?.lineStyle === 'dotted' ? '2,3'
    : undefined

  const angle = Math.atan2(targetY - sourceY, targetX - sourceX)
  const as = 8
  const ax = targetX - as * 0.5 * Math.cos(angle)
  const ay = targetY - as * 0.5 * Math.sin(angle)
  const arrowPath = `M ${ax + as * Math.cos(angle - 0.5)} ${ay + as * Math.sin(angle - 0.5)} L ${ax} ${ay} L ${ax + as * Math.cos(angle + 0.5)} ${ay + as * Math.sin(angle + 0.5)}`

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: strokeColor,
          strokeWidth: selected ? 2.5 : data?.width || 2,
          strokeDasharray,
        }}
        className="!opacity-80"
      />
      <path
        d={arrowPath}
        fill={strokeColor}
        stroke="none"
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
