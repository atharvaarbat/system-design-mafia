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
  reconnectEdge,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
  type Connection,
  type EdgeMouseHandler,
  type OnReconnect,
} from '@xyflow/react'
import { useTheme } from 'next-themes'
import '@xyflow/react/dist/style.css'

import ArchitectureNodeComponent from './nodes/ArchitectureNode'
import GroupNodeComponent from './nodes/GroupNode'
import ArchitectureEdgeComponent from './edges/ArchitectureEdge'
import { sampleArchitecture } from './data/sample'
import { systemDesignToFlow } from '@/lib/diagram/transform'
import { EdgeHoverContext } from '@/lib/diagram/edge-hover-context'
import type { SystemDesign } from '@/types/diagram'

const nodeTypes = {
  architectureNode: ArchitectureNodeComponent,
  groupNode: GroupNodeComponent,
}

const edgeTypes = {
  architectureEdge: ArchitectureEdgeComponent,
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
    (params: Connection) => {
      if (params.source === params.target) return
      setEdges((e) => addEdge(params, e))
    },
    [],
  )

  const onReconnect: OnReconnect = useCallback(
    (oldEdge, newConnection) => {
      if (newConnection.source === newConnection.target) return
      setEdges((els) => reconnectEdge(oldEdge, newConnection, els))
    },
    [],
  )

  const [hoveredEdgeIds, setHoveredEdgeIds] = useState<Set<string>>(new Set())

  const onEdgeMouseEnter: EdgeMouseHandler = useCallback(
    (_event, edge) => {
      setHoveredEdgeIds((prev) => new Set(prev).add(edge.id))
    },
    [],
  )

  const onEdgeMouseLeave: EdgeMouseHandler = useCallback(
    (_event, edge) => {
      setHoveredEdgeIds((prev) => {
        const next = new Set(prev)
        next.delete(edge.id)
        return next
      })
    },
    [],
  )

  const defaultEdgeOptions = useMemo(
    () => ({ type: 'architectureEdge' as const }),
    [],
  )

  return (
    <div style={{ width: '100vw', height: '100vh' }} className="dark:bg-zinc-900/60">
      <EdgeHoverContext.Provider value={{ hoveredEdgeIds }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onReconnect={onReconnect}
        edgesReconnectable
        colorMode={isDark ? 'dark' : 'light'}
        onEdgeMouseEnter={onEdgeMouseEnter}
        onEdgeMouseLeave={onEdgeMouseLeave}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        minZoom={0.1}
        maxZoom={2}
        snapToGrid
        snapGrid={[8, 8]}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          color={isDark ? '#888' : '#ddd'}
          gap={24}
          size={2}
        />
        <Controls className='bg-background' position="bottom-left">
          
        </Controls>
      </ReactFlow>
      </EdgeHoverContext.Provider>
    </div>
  )
}
