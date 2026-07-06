'use client'

import { useMemo, useCallback, useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import {
  ReactFlow,
  ReactFlowProvider,
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
  useReactFlow,
} from '@xyflow/react'
import { useTheme } from 'next-themes'
import '@xyflow/react/dist/style.css'

import ArchitectureNodeComponent from './nodes/ArchitectureNode'
import GroupNodeComponent from './nodes/GroupNode'
import ArchitectureEdgeComponent from './edges/ArchitectureEdge'
import { systemDesignToFlow } from '@/lib/diagram/transform'
import { EdgeHoverContext } from '@/lib/diagram/edge-hover-context'
import { SelectionActionsContext } from '@/lib/diagram/selection-actions-context'
import { EditableContext } from '@/lib/diagram/editable-context'
import { PortalTargetContext } from '@/lib/diagram/portal-target-context'
import type { SystemDesign } from '@/types/diagram'
import { flowToSystemDesign } from '@/lib/diagram/flow-to-system-design'
import { Dock } from '../unlumen-ui/dock'
import { Copy, Minimize2, MoveDiagonal, RefreshCcw, Pencil } from 'lucide-react'

const nodeTypes = {
  architectureNode: ArchitectureNodeComponent,
  groupNode: GroupNodeComponent,
}

const edgeTypes = {
  architectureEdge: ArchitectureEdgeComponent,
}

interface Props {
  design: SystemDesign
  editable?: boolean
}

export default function Diagram({ design, editable: editableProp = true }: Props) {
  const [isEditable, setIsEditable] = useState(editableProp)
  const isEditableRef = useRef(isEditable)
  useEffect(() => { isEditableRef.current = isEditable }, [isEditable])

  const diagram = design
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => systemDesignToFlow(diagram),
    [diagram],
  )

  const [nodes, setNodes] = useState<Node[]>(initialNodes)
  const [edges, setEdges] = useState<Edge[]>(initialEdges)

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      if (!isEditableRef.current) return
      setNodes((n) => applyNodeChanges(changes, n))
    },
    [],
  )
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      if (!isEditableRef.current) return
      setEdges((e) => applyEdgeChanges(changes, e))
    },
    [],
  )
  const onConnect = useCallback(
    (params: Connection) => {
      if (!isEditableRef.current) return
      if (params.source === params.target) return
      setEdges((e) => addEdge(params, e))
    },
    [],
  )

  const onReconnect: OnReconnect = useCallback(
    (oldEdge, newConnection) => {
      if (!isEditableRef.current) return
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

  const [copied, setCopied] = useState(false)

  const handleCopyJson = useCallback(() => {
    const design = flowToSystemDesign(nodes, edges, diagram)
    navigator.clipboard.writeText(JSON.stringify(design, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [nodes, edges])

  const defaultEdgeOptions = useMemo(
    () => ({ type: 'architectureEdge' as const }),
    [],
  )

  const translateExtent = useMemo((): [[number, number], [number, number]] | undefined => {
    if (isEditable) return undefined

    const PADDING = 300
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity

    const nodeMap = new Map(nodes.map((n) => [n.id, n]))

    function getAbsPos(nodeId: string): { x: number; y: number } {
      let x = 0, y = 0
      let cur = nodeMap.get(nodeId)
      while (cur) {
        x += cur.position.x
        y += cur.position.y
        cur = cur.parentId ? nodeMap.get(cur.parentId) : undefined
      }
      return { x, y }
    }

    for (const node of nodes) {
      const abs = getAbsPos(node.id)
      const w = node.width ?? node.measured?.width ?? 200
      const h = node.height ?? node.measured?.height ?? 84
      minX = Math.min(minX, abs.x)
      minY = Math.min(minY, abs.y)
      maxX = Math.max(maxX, abs.x + w)
      maxY = Math.max(maxY, abs.y + h)
    }

    if (!isFinite(minX)) return undefined

    return [[minX - PADDING, minY - PADDING], [maxX + PADDING, maxY + PADDING]]
  }, [nodes, isEditable])

  // Groups the given architecture-node ids into a new groupNode, preserving
  // absolute screen position. Nodes must share a common parent (or have none).
  const groupNodes = useCallback((nodeIds: string[]) => {
    setNodes((nds) => {
      const nodeMap = new Map(nds.map((n) => [n.id, n]))
      const selNodes = nodeIds
        .map((id) => nodeMap.get(id))
        .filter((n): n is Node => !!n && n.type === 'architectureNode')
      if (selNodes.length < 2) return nds

      const parentIds = new Set(selNodes.map((n) => n.parentId))
      if (parentIds.size > 1) return nds
      const commonParentId = selNodes[0].parentId

      function getAbsPos(nodeId: string): { x: number; y: number } {
        let x = 0, y = 0
        let cur = nodeMap.get(nodeId)
        while (cur) {
          x += cur.position.x
          y += cur.position.y
          cur = cur.parentId ? nodeMap.get(cur.parentId) : undefined
        }
        return { x, y }
      }

      const GROUP_PAD = 40, NODE_W = 200, NODE_H = 84
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
      for (const node of selNodes) {
        const abs = getAbsPos(node.id)
        const sw = node.style?.width
        const sh = node.style?.height
        const w = typeof sw === 'number' ? sw : node.measured?.width ?? NODE_W
        const h = typeof sh === 'number' ? sh : node.measured?.height ?? NODE_H
        minX = Math.min(minX, abs.x)
        minY = Math.min(minY, abs.y)
        maxX = Math.max(maxX, abs.x + w)
        maxY = Math.max(maxY, abs.y + h)
      }

      const absGroupX = minX - GROUP_PAD
      const absGroupY = minY - GROUP_PAD
      const groupW = maxX - minX + GROUP_PAD * 2
      const groupH = maxY - minY + GROUP_PAD * 2
      const parentAbs = commonParentId ? getAbsPos(commonParentId) : { x: 0, y: 0 }
      const groupId = `group-${crypto.randomUUID?.() ?? Date.now()}`
      const selectedIds = new Set(selNodes.map((n) => n.id))

      const groupNode: Node = {
        id: groupId,
        type: 'groupNode',
        position: { x: absGroupX - parentAbs.x, y: absGroupY - parentAbs.y },
        data: { label: 'Untitled Group', accent: '#94a3b8', borderStyle: 'solid' },
        parentId: commonParentId || undefined,
        extent: commonParentId ? 'parent' : undefined,
        width: groupW,
        height: groupH,
        draggable: false,
        selectable: true,
        style: { zIndex: -1, pointerEvents: 'none' },
      }

      return [
        groupNode,
        ...nds.map((n) => {
          if (!selectedIds.has(n.id)) return n
          const abs = getAbsPos(n.id)
          return {
            ...n,
            parentId: groupId,
            extent: 'parent' as const,
            position: { x: abs.x - absGroupX, y: abs.y - absGroupY },
            selected: false,
          }
        }),
      ]
    })
  }, [])

  // Ungroups the given architecture-node ids – removes them from their group
  // by converting their position to absolute coordinates and clearing parentId.
  const ungroupNodes = useCallback((nodeIds: string[]) => {
    setNodes((nds) => {
      const nodeMap = new Map(nds.map((n) => [n.id, n]))
      function getAbsPos(nodeId: string): { x: number; y: number } {
        let x = 0, y = 0
        let cur = nodeMap.get(nodeId)
        while (cur) {
          x += cur.position.x
          y += cur.position.y
          cur = cur.parentId ? nodeMap.get(cur.parentId) : undefined
        }
        return { x, y }
      }
      const ids = new Set(nodeIds)
      return nds.map((n) => {
        if (!ids.has(n.id) || !n.parentId) return n
        const abs = getAbsPos(n.id)
        return {
          ...n,
          parentId: undefined,
          extent: undefined,
          position: { x: abs.x, y: abs.y },
        }
      })
    })
  }, [])

  // Moves the given architecture-node ids into targetGroupId, converting their
  // position to be relative to the target group.
  const moveToGroup = useCallback((nodeIds: string[], targetGroupId: string) => {
    setNodes((nds) => {
      const nodeMap = new Map(nds.map((n) => [n.id, n]))
      function getAbsPos(nodeId: string): { x: number; y: number } {
        let x = 0, y = 0
        let cur = nodeMap.get(nodeId)
        while (cur) {
          x += cur.position.x
          y += cur.position.y
          cur = cur.parentId ? nodeMap.get(cur.parentId) : undefined
        }
        return { x, y }
      }
      const targetAbs = getAbsPos(targetGroupId)
      const ids = new Set(nodeIds)
      return nds.map((n) => {
        if (!ids.has(n.id)) return n
        const abs = getAbsPos(n.id)
        return {
          ...n,
          parentId: targetGroupId,
          extent: 'parent' as const,
          position: { x: abs.x - targetAbs.x, y: abs.y - targetAbs.y },
        }
      })
    })
  }, [])

  const selectionActions = useMemo(
    () => ({ groupSelectedNodes: groupNodes, ungroupSelectedNodes: ungroupNodes, moveNodesToGroup: moveToGroup }),
    [groupNodes, ungroupNodes, moveToGroup],
  )

  const [selectionMenu, setSelectionMenu] = useState<{ x: number; y: number; nodeIds: string[] } | null>(null)
  const closeSelectionMenu = useCallback(() => setSelectionMenu(null), [])

  const onSelectionContextMenu = useCallback((event: React.MouseEvent, selNodes: Node[]) => {
    if (!isEditableRef.current) return
    const archIds = selNodes.filter((n) => n.type === 'architectureNode').map((n) => n.id)
    if (archIds.length < 2) return
    event.preventDefault()
    setSelectionMenu({ x: event.clientX, y: event.clientY, nodeIds: archIds })
  }, [])

  useEffect(() => {
    if (!selectionMenu) return
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('[data-selection-context-menu]')) closeSelectionMenu()
    }
    document.addEventListener('mousedown', handler, true)
    return () => document.removeEventListener('mousedown', handler, true)
  }, [selectionMenu, closeSelectionMenu])

  // Kept in a ref so the Ctrl/Cmd+G shortcut doesn't need to re-subscribe on every node change.
  const nodesRef = useRef(nodes)
  useEffect(() => {
    nodesRef.current = nodes
  }, [nodes])

  useEffect(() => {
    if (!isEditable) return
    const handler = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey) || e.key.toLowerCase() !== 'g') return
      const archIds = nodesRef.current
        .filter((n) => n.selected && n.type === 'architectureNode')
        .map((n) => n.id)
      if (archIds.length < 2) return
      e.preventDefault()
      groupNodes(archIds)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [groupNodes, isEditable])
  const containerRef = useRef<HTMLDivElement>(null)
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null)
  const portalRef = useCallback((el: HTMLDivElement | null) => {
    if (el) setPortalContainer(el)
  }, [])
  function DiagramDock() {
    const { fitView } = useReactFlow()
    const [isFullscreen, setIsFullscreen] = useState(false)

    useEffect(() => {
      const handler = () => setIsFullscreen(!!document.fullscreenElement)
      document.addEventListener('fullscreenchange', handler)
      return () => document.removeEventListener('fullscreenchange', handler)
    }, [])

    const handleReset = useCallback(() => {
      fitView({ duration: 300 })
    }, [fitView])

    const handleFullscreen = useCallback(() => {
      if (!document.fullscreenElement) {
        containerRef.current?.requestFullscreen()
      } else {
        document.exitFullscreen()
      }
    }, [])

    const [urlCopied, setUrlCopied] = useState(false)
    const handleCopyUrl = useCallback(() => {
      navigator.clipboard.writeText(window.location.href)
      setUrlCopied(true)
      setTimeout(() => setUrlCopied(false), 2000)
    }, [])

    const handleToggleEditable = useCallback(() => {
      setIsEditable((prev) => !prev)
    }, [])

    const items = [
      { icon: <RefreshCcw />, label: "Reset", onClick: handleReset },
      { icon: isFullscreen ? <Minimize2 /> : <MoveDiagonal />, label: isFullscreen ? "Exit full screen" : "Full screen", onClick: handleFullscreen },
      { icon: <Copy />, label: urlCopied ? "Copied!" : "Copy", onClick: handleCopyUrl },
      { icon: <Pencil />, label: isEditable ? "Editing" : "Read only", onClick: handleToggleEditable, active: isEditable },
    ]

    return (
      <div className='z-999'>
        <Dock
          items={items}
          magnification={1.4}
          distance={50}
          springOptions={{ stiffness: 400, damping: 25 }}
          borderRadius={30}
          iconSize={28}
          className='rounded-3xl bg-background/10 backdrop-blur-md'
        />

      </div>
    )
  }
  return (
    <ReactFlowProvider>
        <div ref={containerRef} style={{ width: '100%', height: '100vh' }} className="mx-auto bg-background relative overflow-hidden">
          <PortalTargetContext.Provider value={portalContainer}>
            <EditableContext.Provider value={isEditable}>
              <SelectionActionsContext.Provider value={selectionActions}>
                <EdgeHoverContext.Provider value={{ hoveredEdgeIds }}>
                  <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onReconnect={onReconnect}
                    edgesReconnectable={isEditable}
                    nodesDraggable={isEditable}
                    nodesConnectable={isEditable}
                    elementsSelectable={isEditable}
                    colorMode={isDark ? 'dark' : 'light'}
                    nodesFocusable={isEditable}
                    edgesFocusable={isEditable}
                    onEdgeMouseEnter={onEdgeMouseEnter}
                    onEdgeMouseLeave={onEdgeMouseLeave}
                    onSelectionContextMenu={onSelectionContextMenu}
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                    defaultEdgeOptions={defaultEdgeOptions}
                    fitView
                    minZoom={0.1}
                    maxZoom={2}
                    snapToGrid
                    snapGrid={[8, 8]}
                    panOnScroll
                    panOnDrag={true}
                    translateExtent={translateExtent}
                    proOptions={{ hideAttribution: true }}
                  >
                    <Background
                      variant={BackgroundVariant.Dots}
                      color={isDark ? '#666' : '#222'}
                      gap={24}
                      size={2}
                    />
                    {isEditable && (
                      <Controls className='bg-background' position="bottom-left">
                        <ControlButton onClick={handleCopyJson} title="Copy JSON">
                          <span className="text-xs font-mono">{copied ? '✓' : '</>'}</span>
                        </ControlButton>
                      </Controls>
                    )}
                  </ReactFlow>
                  {selectionMenu && createPortal(
                    <div
                      data-selection-context-menu
                      style={{ position: 'fixed', left: selectionMenu.x, top: selectionMenu.y, zIndex: 9999 }}
                      className="min-w-36 rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10"
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      <div
                        className="flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground"
                        onClick={() => {
                          groupNodes(selectionMenu.nodeIds)
                          closeSelectionMenu()
                        }}
                      >
                        Group
                      </div>
                    </div>,
                    portalContainer ?? document.body
                  )}
                </EdgeHoverContext.Provider>
              </SelectionActionsContext.Provider>
            </EditableContext.Provider>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50">
              <DiagramDock />
            </div>

            {/* Bottom Right Logos */}
            <div className="absolute bottom-4 right-4 flex items-center gap-2 z-50 invert dark:invert-0 opacity-45">
              <img src="/logo.svg" className="h-4" />
              <img src="/mafia.svg" className="h-4" />
            </div>
            <div ref={portalRef} />
          </PortalTargetContext.Provider>
        </div>
    </ReactFlowProvider>
  )
}
