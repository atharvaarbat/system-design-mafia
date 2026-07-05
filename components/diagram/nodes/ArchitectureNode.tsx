'use client'

import { memo, useEffect, useState, useMemo } from 'react'
import { Handle, Position, useEdges, useReactFlow, type NodeProps, type Node } from '@xyflow/react'
import type { SystemDesignNode } from '@/types/diagram'
import { CATEGORY_SHAPE_PATH, resolveNodeKind } from '@/lib/diagram/registry'
import { useEdgeHover } from '@/lib/diagram/edge-hover-context'
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from '@/components/ui/context-menu'

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

function ArchitectureNodeComponent({ data }: NodeProps<ArchitectureFlowNode>) {
  const { deleteElements } = useReactFlow()
  const edges = useEdges()
  const { hoveredEdgeIds } = useEdgeHover()
  const kindDef = resolveNodeKind(data.kind)
  const Icon = kindDef.icon
  const label = data.name || kindDef.label
  const shapePath = CATEGORY_SHAPE_PATH[kindDef.category]
  const shapeAvailable = useShapeAvailable(shapePath)

  const connectedEdgeSides = useMemo(() => {
    const sides = new Set<string>()
    for (const edge of edges) {
      if (!hoveredEdgeIds.has(edge.id)) continue
      if (edge.source === data.id && edge.sourceHandle) {
        sides.add(edge.sourceHandle.replace('-source', '').replace('-target', ''))
      }
      if (edge.target === data.id && edge.targetHandle) {
        sides.add(edge.targetHandle.replace('-source', '').replace('-target', ''))
      }
    }
    return sides
  }, [edges, hoveredEdgeIds, data.id])

  const statusColor =
    data.status === 'active' ? '#22c55e'
    : data.status === 'warning' ? '#f59e0b'
    : data.status === 'error' ? '#ef4444'
    : data.status === 'inactive' ? '#d1d5db'
    : undefined

  return (
    <ContextMenu>
      <ContextMenuTrigger>
    <div className="group relative w-fit">
    <Handle id="left-target" type="target" position={Position.Left} className="h-2 w-2 rounded-full bg-zinc-400! dark:bg-zinc-500! opacity-0 group-hover:opacity-100 transition-opacity" style={{ opacity: connectedEdgeSides.has('left') ? 1 : undefined }} />
    <Handle id="left-source" type="source" position={Position.Left} className="h-2 w-2 rounded-full bg-zinc-400! dark:bg-zinc-500! opacity-0 group-hover:opacity-100 transition-opacity" style={{ opacity: connectedEdgeSides.has('left') ? 1 : undefined }} />
    <Handle id="top-target" type="target" position={Position.Top} className="h-2 w-2 rounded-full bg-zinc-400! dark:bg-zinc-500! opacity-0 group-hover:opacity-100 transition-opacity" style={{ opacity: connectedEdgeSides.has('top') ? 1 : undefined }} />
    <Handle id="top-source" type="source" position={Position.Top} className="h-2 w-2 rounded-full bg-zinc-400! dark:bg-zinc-500! opacity-0 group-hover:opacity-100 transition-opacity" style={{ opacity: connectedEdgeSides.has('top') ? 1 : undefined }} />
    <div className="flex flex-col items-center gap-1 px-2 py-1">
      <div className="relative h-10 w-10 shrink-0">
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

      <span className="max-w-24 truncate text-center text-xs font-semibold text-zinc-800 dark:text-zinc-100">
        {label}
      </span>

      {data.description && (
        <p className="max-w-24 text-center text-[10px] leading-tight text-zinc-500 dark:text-zinc-400">
          {data.description}
        </p>
      )}
    </div>
    <Handle id="right-target" type="target" position={Position.Right} className="h-2 w-2 rounded-full bg-zinc-400! dark:bg-zinc-500! opacity-0 group-hover:opacity-100 transition-opacity" style={{ opacity: connectedEdgeSides.has('right') ? 1 : undefined }} />
    <Handle id="right-source" type="source" position={Position.Right} className="h-2 w-2 rounded-full bg-zinc-400! dark:bg-zinc-500! opacity-0 group-hover:opacity-100 transition-opacity" style={{ opacity: connectedEdgeSides.has('right') ? 1 : undefined }} />
    <Handle id="bottom-target" type="target" position={Position.Bottom} className="h-2 w-2 rounded-full bg-zinc-400! dark:bg-zinc-500! opacity-0 group-hover:opacity-100 transition-opacity" style={{ opacity: connectedEdgeSides.has('bottom') ? 1 : undefined }} />
    <Handle id="bottom-source" type="source" position={Position.Bottom} className="h-2 w-2 rounded-full bg-zinc-400! dark:bg-zinc-500! opacity-0 group-hover:opacity-100 transition-opacity" style={{ opacity: connectedEdgeSides.has('bottom') ? 1 : undefined }} />
    </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={() => deleteElements({ nodes: [{ id: data.id }] })}>
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

export default memo(ArchitectureNodeComponent)
