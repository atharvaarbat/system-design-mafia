'use client'

import { memo } from 'react'
import { NodeResizer, type NodeProps, type Node } from '@xyflow/react'

interface GroupNodeData {
  label: string
  description?: string
  accent: string
  borderStyle: 'solid' | 'dashed'
}

type GroupFlowNode = Node<GroupNodeData & Record<string, unknown>>

function GroupNodeComponent({ data, selected }: NodeProps<GroupFlowNode>) {
  return (
    <>
      <NodeResizer
        isVisible={selected}
        minWidth={240}
        minHeight={120}
        lineClassName="border-blue-400"
        handleClassName="h-6 w-6 bg-white border-2 border-blue-400 rounded-md"
      />
      <div className="relative h-full w-full">
        <div
          style={{
            borderColor: selected ? '#3b82f6' : data.accent || '#94a3b8',
            borderStyle: data.borderStyle === 'dashed' ? 'dashed' : 'solid',
          }}
          className="nodrag h-full w-full rounded-2xl border-2 bg-zinc-50/40 dark:bg-zinc-900/20"
        />
        <div className="absolute left-4 top-2 inline-block rounded-md bg-white px-3 py-1 shadow-sm dark:bg-zinc-800">
          <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">{data.label}</span>
        </div>
      </div>
    </>
  )
}

export default memo(GroupNodeComponent)
