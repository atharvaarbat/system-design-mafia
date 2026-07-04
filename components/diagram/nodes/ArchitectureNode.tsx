'use client'

import { memo, useEffect, useState } from 'react'
import { Handle, Position, useEdges, type NodeProps, type Node } from '@xyflow/react'
import type { SystemDesignNode } from '@/types/diagram'
import { CATEGORY_SHAPE_PATH, resolveNodeKind } from '@/lib/diagram/registry'

type ArchitectureFlowNode = Node<SystemDesignNode & Record<string, unknown>>

/** A masked element is hidden entirely (not just unmasked) when its mask-image 404s,
 *  so we verify the shape loads before applying the mask instead of relying on CSS fallback. */
function useShapeAvailable(path: string): boolean {
  const [available, setAvailable] = useState(false)

  useEffect(() => {
    let cancelled = false
    setAvailable(false)
    const img = new Image()
    img.onload = () => !cancelled && setAvailable(true)
    img.onerror = () => !cancelled && setAvailable(false)
    img.src = path
    return () => {
      cancelled = true
    }
  }, [path])

  return available
}

function ArchitectureNodeComponent({ data, selected, id }: NodeProps<ArchitectureFlowNode>) {
  const edges = useEdges()
  const hasIncoming = edges.some((e) => e.target === id)
  const hasOutgoing = edges.some((e) => e.source === id)

  const kindDef = resolveNodeKind(data.kind)
  const Icon = kindDef.icon
  const label = data.name || kindDef.label
  const shapePath = CATEGORY_SHAPE_PATH[kindDef.category]
  const shapeAvailable = useShapeAvailable(shapePath)

  const statusColor =
    data.status === 'active' ? '#22c55e'
    : data.status === 'warning' ? '#f59e0b'
    : data.status === 'error' ? '#ef4444'
    : data.status === 'inactive' ? '#d1d5db'
    : undefined

  return (
    <div
      style={{
        borderColor: selected ? '#3b82f6' : kindDef.color,
        borderWidth: selected ? 2.5 : 2,
        minWidth: data.width ?? 200,
      }}
      className="rounded-xl border-solid bg-white shadow-sm transition-shadow dark:bg-zinc-800 dark:shadow-black/20"
    >
      {hasIncoming && (
        <Handle type="target" position={Position.Left} className="bg-zinc-400! dark:bg-zinc-500!" />
      )}

      <div className="flex items-start gap-3 px-3 py-3">
        <div className="relative h-11 w-11 shrink-0">
          <div
            className="absolute inset-0 rounded-lg"
            style={{
              backgroundColor: kindDef.color,
              ...(shapeAvailable
                ? {
                    WebkitMaskImage: `url(${shapePath})`,
                    maskImage: `url(${shapePath})`,
                    WebkitMaskSize: 'contain',
                    maskSize: 'contain',
                    WebkitMaskRepeat: 'no-repeat',
                    maskRepeat: 'no-repeat',
                    WebkitMaskPosition: 'center',
                    maskPosition: 'center',
                  }
                : {}),
            }}
          />
          <Icon className="absolute inset-0 m-auto h-5 w-5 text-white" strokeWidth={2} />
        </div>

        <div className="min-w-0 flex-1 pt-0.5">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-sm font-semibold text-zinc-800 dark:text-zinc-100">
              {label}
            </span>
            {statusColor && (
              <span
                style={{ backgroundColor: statusColor }}
                className="h-2 w-2 shrink-0 rounded-full"
              />
            )}
          </div>
          {data.description && (
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{data.description}</p>
          )}
        </div>
      </div>

      {hasOutgoing && (
        <Handle type="source" position={Position.Right} className="bg-zinc-400! dark:bg-zinc-500!" />
      )}
    </div>
  )
}

export default memo(ArchitectureNodeComponent)
