'use client'

import { memo } from 'react'
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react'
import type { ArchitectureNode } from '@/types/diagram'
import { NODE_COLORS } from '@/types/diagram'

type ArchitectureFlowNode = Node<ArchitectureNode & Record<string, unknown>>

function ArchitectureNodeComponent({ data, selected }: NodeProps<ArchitectureFlowNode>) {
  const accent = data.accent || NODE_COLORS[data.type]
  const statusColor =
    data.status === 'active' ? '#22c55e'
    : data.status === 'warning' ? '#f59e0b'
    : data.status === 'error' ? '#ef4444'
    : data.status === 'inactive' ? '#d1d5db'
    : undefined

  return (
    <div
      style={{
        borderColor: selected ? '#3b82f6' : accent,
        borderWidth: selected ? 2.5 : 2,
        minWidth: data.width ?? 160,
      }}
      className="rounded-xl border-solid bg-white shadow-sm transition-shadow dark:bg-zinc-800 dark:shadow-black/20"
    >
      <Handle type="target" position={Position.Top} className="!bg-zinc-400 dark:!bg-zinc-500" />

      <div className="px-4 py-3">
        <div className="flex items-center gap-2">
          {data.icon && <span className="text-xl leading-none">{data.icon}</span>}
          <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">{data.label}</span>
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

      <Handle type="source" position={Position.Bottom} className="!bg-zinc-400 dark:!bg-zinc-500" />
    </div>
  )
}

export default memo(ArchitectureNodeComponent)
