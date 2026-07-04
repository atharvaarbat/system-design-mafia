'use client'

import { useMemo, useCallback, useState } from 'react'
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  ControlButton,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
  type Connection,
} from '@xyflow/react'
import { useTheme } from 'next-themes'
import '@xyflow/react/dist/style.css'

import ArchitectureNodeComponent from './nodes/ArchitectureNode'
import GroupNodeComponent from './nodes/GroupNode'
import ArchitectureEdgeComponent from './edges/ArchitectureEdge'
import { sampleArchitecture } from './data/sample'
import type { SystemDesign } from '@/types/diagram'

const nodeTypes = {
  architectureNode: ArchitectureNodeComponent,
  groupNode: GroupNodeComponent,
}

const edgeTypes = {
  architectureEdge: ArchitectureEdgeComponent,
}

const NODE_W = 160
const NODE_H = 70
const GROUP_PAD = 40

function systemDesignToFlow(design: SystemDesign): { nodes: Node[]; edges: Edge[] } {
  const flowNodes: Node[] = []
  const flowEdges: Edge[] = []
  const nodeMap = new Map<string, (typeof design.nodes)[0]>()

  for (const node of design.nodes) {
    nodeMap.set(node.id, node)
  }

  const groupBounds = new Map<string, { x: number; y: number; width: number; height: number }>()

  if (design.groups) {
    for (const group of design.groups) {
      const children = group.children
        .map((id) => nodeMap.get(id))
        .filter(Boolean) as (typeof design.nodes)[0][]

      if (children.length === 0) continue

      if (group.x != null && group.y != null && group.width != null && group.height != null) {
        groupBounds.set(group.id, { x: group.x, y: group.y, width: group.width, height: group.height })
      } else {
        const minX = Math.min(...children.map((c) => c.x))
        const minY = Math.min(...children.map((c) => c.y))
        const maxX = Math.max(...children.map((c) => c.x + (c.width || NODE_W)))
        const maxY = Math.max(...children.map((c) => c.y + (c.height || NODE_H)))
        groupBounds.set(group.id, {
          x: minX - GROUP_PAD,
          y: minY - GROUP_PAD,
          width: maxX - minX + GROUP_PAD * 2,
          height: maxY - minY + GROUP_PAD * 2,
        })
      }
    }
  }

  if (design.groups) {
    for (const group of design.groups) {
      const bounds = groupBounds.get(group.id)
      if (!bounds) continue

      flowNodes.push({
        id: group.id,
        type: 'groupNode',
        position: { x: bounds.x, y: bounds.y },
        data: {
          label: group.label,
          description: group.description,
          accent: group.color || '#94a3b8',
          borderStyle: group.style || 'dashed',
        },
        width: bounds.width,
        height: bounds.height,
        draggable: false,
        selectable: true,
        style: { zIndex: -1 },
      })
    }
  }

  for (const archNode of design.nodes) {
    const parentId = design.groups?.find((g) => g.children.includes(archNode.id))?.id
    const bounds = parentId ? groupBounds.get(parentId) : undefined

    flowNodes.push({
      id: archNode.id,
      type: 'architectureNode',
      position: {
        x: bounds ? archNode.x - bounds.x : archNode.x,
        y: bounds ? archNode.y - bounds.y : archNode.y,
      },
      data: { ...archNode },
      parentId: parentId || undefined,
      extent: parentId ? 'parent' : undefined,
      width: archNode.width || NODE_W,
      height: archNode.height || NODE_H,
      draggable: true,
      selectable: true,
    })
  }

  for (const archEdge of design.edges) {
    flowEdges.push({
      id: archEdge.id,
      source: archEdge.source,
      target: archEdge.target,
      type: 'architectureEdge',
      animated: archEdge.animated,
      markerEnd: undefined,
      data: {
        label: archEdge.label,
        protocol: archEdge.protocol,
        lineStyle: archEdge.style,
        color: archEdge.color,
        width: archEdge.width,
      },
    })
  }

  return { nodes: flowNodes, edges: flowEdges }
}

interface Props {
  design?: SystemDesign
}

export default function Diagram({ design }: Props) {
  const diagram = design || sampleArchitecture
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => systemDesignToFlow(diagram),
    [diagram],
  )

  const [nodes, setNodes] = useState<Node[]>(initialNodes)
  const [edges, setEdges] = useState<Edge[]>(initialEdges)

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((n) => applyNodeChanges(changes, n)),
    [],
  )
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((e) => applyEdgeChanges(changes, e)),
    [],
  )
  const onConnect = useCallback(
    (params: Connection) => setEdges((e) => addEdge(params, e)),
    [],
  )

  const defaultEdgeOptions = useMemo(
    () => ({ type: 'architectureEdge' as const }),
    [],
  )

  return (
    <div style={{ width: '100vw', height: '100vh' }} className="dark:bg-black">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        minZoom={0.1}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Lines}
          color={isDark ? '#333' : '#ddd'}
          gap={24}
          size={1}
        />
        <Controls position="bottom-left">
          <ControlButton
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            title="Toggle theme"
          >
            {isDark ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </ControlButton>
        </Controls>
      </ReactFlow>
    </div>
  )
}
