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
import NotesLayer from './notes-layer'
import { systemDesignToFlow } from '@/lib/diagram/transform'
import { EdgeHoverContext } from '@/lib/diagram/edge-hover-context'
import { DiagramHighlightContext, type DiagramHighlight } from '@/lib/diagram/highlight-context'
import { DiagramChaosContext, type DiagramChaos } from '@/lib/diagram/chaos-context'
import { SelectionActionsContext } from '@/lib/diagram/selection-actions-context'
import { EditableContext } from '@/lib/diagram/editable-context'
import { PortalTargetContext } from '@/lib/diagram/portal-target-context'
import { clampMenuPosition } from '@/lib/diagram/menu-position'
import { NODE_REGISTRY, CATEGORIES, type NodeKind, type NodeKindDefinition } from '@/lib/diagram/registry'
import { useDiagramNotes } from '@/lib/diagram/use-diagram-notes'
import type { SystemDesign } from '@/types/diagram'
import { flowToSystemDesign } from '@/lib/diagram/flow-to-system-design'
import { Dock } from '../unlumen-ui/dock'
import { Link, Minimize2, MoveDiagonal, Pencil, Scan, StickyNote } from 'lucide-react'

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
  /** When set, listed nodes/edges glow and everything else dims; the camera follows the active set. */
  highlight?: DiagramHighlight | null
  /** When set, only listed nodes/edges render (evolution/stage mode); the camera fits the visible set.
   *  Groups stay visible while any of their member nodes are. */
  visible?: { nodes: Set<string>; edges: Set<string> } | null
  /** Chaos-mode state — the killed node and its blast radius. Affected elements restyle, the rest dim. */
  chaos?: DiagramChaos | null
  /** True while the reader is choosing a component to kill; killable nodes show a target marker. */
  chaosArmed?: boolean
  /** Fired when an armed reader clicks a killable node. */
  onChaosKill?: (nodeId: string) => void
  /** Absolutely-positioned chrome (flow player, legend, …) rendered INSIDE the
   *  fullscreen container so it stays visible when the diagram goes fullscreen. */
  overlay?: React.ReactNode
  /** Stable per-diagram key for persisting reader notes to localStorage. Falls back to a slugified title. */
  diagramId?: string
}

/** True when the event target is a text-entry element — keyboard shortcuts must not fire there. */
function isTypingTarget(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null
  return !!el?.closest?.('input, textarea, select, [contenteditable="true"]')
}

/** Walks parentId chains to an absolute flow position. The seen-set guards against cyclic parents. */
function getAbsPos(nodeId: string, nodeMap: Map<string, Node>): { x: number; y: number } {
  let x = 0, y = 0
  const seen = new Set<string>()
  let cur = nodeMap.get(nodeId)
  while (cur && !seen.has(cur.id)) {
    seen.add(cur.id)
    x += cur.position.x
    y += cur.position.y
    cur = cur.parentId ? nodeMap.get(cur.parentId) : undefined
  }
  return { x, y }
}

/** Flies the camera to the active highlight set. Rendered inside ReactFlowProvider. */
function HighlightCamera({ highlight }: { highlight: DiagramHighlight | null }) {
  const { fitView } = useReactFlow()
  const hadHighlight = useRef(false)

  useEffect(() => {
    if (highlight) {
      hadHighlight.current = true
      const activeIds = [...highlight.nodes.entries()]
        .filter(([, state]) => state === 'active')
        .map(([id]) => ({ id }))
      if (activeIds.length > 0) {
        fitView({ nodes: activeIds, duration: 650, padding: 0.4, maxZoom: 1.1 })
      }
    } else if (hadHighlight.current) {
      hadHighlight.current = false
      fitView({ duration: 650, padding: 0.15 })
    }
  }, [highlight, fitView])

  return null
}

/** Fits the camera to the visible (stage) set when it changes. Rendered inside ReactFlowProvider. */
function StageCamera({ visible }: { visible: { nodes: Set<string> } | null }) {
  const { fitView } = useReactFlow()
  const hadVisible = useRef(false)

  useEffect(() => {
    if (visible) {
      hadVisible.current = true
      const ids = [...visible.nodes].map((id) => ({ id }))
      if (ids.length > 0) {
        fitView({ nodes: ids, duration: 650, padding: 0.25, maxZoom: 1.1 })
      }
    } else if (hadVisible.current) {
      hadVisible.current = false
      fitView({ duration: 650, padding: 0.15 })
    }
  }, [visible, fitView])

  return null
}

interface DiagramDockProps {
  isEditable: boolean
  onToggleEditable: () => void
  noteMode: boolean
  onToggleNoteMode: () => void
  containerRef: React.RefObject<HTMLDivElement | null>
}

function DiagramDock({ isEditable, onToggleEditable, noteMode, onToggleNoteMode, containerRef }: DiagramDockProps) {
  const { fitView } = useReactFlow()
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement)
    handler()
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  const handleFitView = useCallback(() => {
    fitView({ duration: 300 })
  }, [fitView])

  const handleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }, [containerRef])

  const [urlCopied, setUrlCopied] = useState(false)
  const handleCopyUrl = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setUrlCopied(true)
      setTimeout(() => setUrlCopied(false), 2000)
    } catch {
      // clipboard unavailable (e.g. insecure origin) — silently skip
    }
  }, [])

  const items = [
    { icon: <Scan />, label: 'Fit view', onClick: handleFitView },
    { icon: isFullscreen ? <Minimize2 /> : <MoveDiagonal />, label: isFullscreen ? 'Exit full screen' : 'Full screen', onClick: handleFullscreen },
    { icon: <Link />, label: urlCopied ? 'Link copied!' : 'Copy link', onClick: handleCopyUrl },
    { icon: <StickyNote />, label: noteMode ? 'Click canvas to place' : 'Add note', onClick: onToggleNoteMode, active: noteMode },
    { icon: <Pencil />, label: isEditable ? 'Editing' : 'Read only', onClick: onToggleEditable, active: isEditable },
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

interface AddNodeMenuProps {
  x: number
  y: number
  portalTarget: HTMLElement | null
  onClose: () => void
  onAdd: (kind: NodeKind, position: { x: number; y: number }) => void
}

/** Searchable node palette shown on empty-canvas right-click. Rendered inside ReactFlowProvider. */
function AddNodeMenu({ x, y, portalTarget, onClose, onAdd }: AddNodeMenuProps) {
  const { screenToFlowPosition } = useReactFlow()
  const [query, setQuery] = useState('')

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('[data-add-node-menu]')) onClose()
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('mousedown', onMouseDown, true)
    document.addEventListener('keydown', onKeyDown, true)
    return () => {
      document.removeEventListener('mousedown', onMouseDown, true)
      document.removeEventListener('keydown', onKeyDown, true)
    }
  }, [onClose])

  const q = query.trim().toLowerCase()
  const allKinds = Object.entries(NODE_REGISTRY) as [NodeKind, NodeKindDefinition][]
  const grouped = CATEGORIES
    .map((category) => ({
      category,
      kinds: allKinds.filter(
        ([kind, def]) =>
          def.category === category &&
          (!q || def.label.toLowerCase().includes(q) || kind.includes(q)),
      ),
    }))
    .filter((g) => g.kinds.length > 0)

  const pos = clampMenuPosition(x, y, 232, 340)

  return createPortal(
    <div
      data-add-node-menu
      style={{ position: 'fixed', left: pos.x, top: pos.y, zIndex: 9999 }}
      className="w-56 rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10"
      onMouseDown={(e) => e.stopPropagation()}
    >
      <input
        autoFocus
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Add node…"
        className="mb-1 w-full rounded-md border border-input bg-background px-2 py-1 text-sm outline-hidden"
      />
      <div className="max-h-72 overflow-y-auto">
        {grouped.length === 0 && (
          <p className="px-1.5 py-2 text-xs text-muted-foreground">No matches</p>
        )}
        {grouped.map(({ category, kinds }) => (
          <div key={category}>
            <div className="px-1.5 pt-1.5 pb-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {category}
            </div>
            {kinds.map(([kind, def]) => {
              const KindIcon = def.icon
              return (
                <div
                  key={kind}
                  className="flex cursor-default items-center gap-2 rounded-md px-1.5 py-1 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground"
                  onClick={() => onAdd(kind, screenToFlowPosition({ x, y }))}
                >
                  <span
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded"
                    style={{ backgroundColor: def.color }}
                  >
                    {def.brandLogo
                      ? <img src={def.brandLogo} alt="" className="h-3.5 w-3.5 object-contain" />
                      : <KindIcon className="h-3 w-3 text-white" strokeWidth={2} />}
                  </span>
                  {def.label}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>,
    portalTarget ?? document.body,
  )
}

export default function Diagram({ design, editable: editableProp = true, highlight = null, visible = null, chaos = null, chaosArmed = false, onChaosKill, overlay = null, diagramId }: Props) {
  const [isEditable, setIsEditable] = useState(editableProp)
  const isEditableRef = useRef(isEditable)
  useEffect(() => { isEditableRef.current = isEditable }, [isEditable])

  // Adjust-state-during-render pattern: a changed `editable` prop overrides the local toggle.
  const [prevEditableProp, setPrevEditableProp] = useState(editableProp)
  if (prevEditableProp !== editableProp) {
    setPrevEditableProp(editableProp)
    setIsEditable(editableProp)
  }

  const diagram = design
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  const noteStorageId = diagramId ?? diagram.title.toLowerCase().trim().replace(/\s+/g, '-')
  const {
    notes,
    editingId: editingNoteId,
    setEditingId: setEditingNoteId,
    addNote,
    moveNote,
    updateNoteText,
    setNoteColor,
    deleteNote,
  } = useDiagramNotes(noteStorageId)

  const [noteMode, setNoteMode] = useState(false)
  const noteModeRef = useRef(noteMode)
  useEffect(() => { noteModeRef.current = noteMode }, [noteMode])
  const toggleNoteMode = useCallback(() => setNoteMode((v) => !v), [])

  useEffect(() => {
    if (!noteMode) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setNoteMode(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [noteMode])

  const notePlacementSeq = useRef(0)
  const [pendingNotePlacement, setPendingNotePlacement] = useState<{ x: number; y: number; seq: number } | null>(null)

  const onPaneClick = useCallback((event: React.MouseEvent) => {
    if (!noteModeRef.current) return
    notePlacementSeq.current += 1
    setPendingNotePlacement({ x: event.clientX, y: event.clientY, seq: notePlacementSeq.current })
    setNoteMode(false)
  }, [])

  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => systemDesignToFlow(diagram),
    [diagram],
  )

  const [nodes, setNodes] = useState<Node[]>(initialNodes)
  const [edges, setEdges] = useState<Edge[]>(initialEdges)

  // Kept in a ref so gesture handlers and shortcuts can read fresh state without re-subscribing.
  const nodesRef = useRef(nodes)
  useEffect(() => { nodesRef.current = nodes }, [nodes])

  // Adjust-state-during-render pattern: a new design replaces local edits.
  const [prevInitialNodes, setPrevInitialNodes] = useState(initialNodes)
  if (prevInitialNodes !== initialNodes) {
    setPrevInitialNodes(initialNodes)
    setNodes(initialNodes)
    setEdges(initialEdges)
  }

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      if (!isEditableRef.current) {
        // Still track measurements in read-only mode so translateExtent stays accurate.
        const dimensionChanges = changes.filter((c) => c.type === 'dimensions')
        if (dimensionChanges.length > 0) setNodes((n) => applyNodeChanges(dimensionChanges, n))
        return
      }
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
      // Explicit type — edges added without one would be dropped by flowToSystemDesign.
      setEdges((e) => addEdge({ ...params, type: 'architectureEdge' }, e))
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

  const highlightCtx = useMemo(() => ({ highlight }), [highlight])
  const edgeHoverCtx = useMemo(() => ({ hoveredEdgeIds }), [hoveredEdgeIds])

  const killableIds = useMemo(
    () => new Set(design.nodes.filter((n) => n.failure).map((n) => n.id)),
    [design],
  )
  const chaosCtx = useMemo(
    () => ({
      chaos,
      armed: chaosArmed && !isEditable,
      killableIds,
      onKill: onChaosKill ?? (() => {}),
    }),
    [chaos, chaosArmed, isEditable, killableIds, onChaosKill],
  )

  // Stage/evolution mode: hide everything outside the visible set. Groups stay
  // visible while any architecture node in their parentId chain is visible.
  const displayNodes = useMemo(() => {
    if (!visible) return nodes
    const nodeMap = new Map(nodes.map((n) => [n.id, n]))
    const visibleGroupIds = new Set<string>()
    for (const node of nodes) {
      if (node.type !== 'architectureNode' || !visible.nodes.has(node.id)) continue
      const seen = new Set<string>()
      let cur = node.parentId ? nodeMap.get(node.parentId) : undefined
      while (cur && !seen.has(cur.id)) {
        seen.add(cur.id)
        visibleGroupIds.add(cur.id)
        cur = cur.parentId ? nodeMap.get(cur.parentId) : undefined
      }
    }
    return nodes.map((node) => {
      const isVisible = node.type === 'groupNode' ? visibleGroupIds.has(node.id) : visible.nodes.has(node.id)
      return node.hidden === !isVisible ? node : { ...node, hidden: !isVisible }
    })
  }, [nodes, visible])

  const displayEdges = useMemo(() => {
    if (!visible) return edges
    return edges.map((edge) => {
      // Both endpoints must be visible too, so a bad edge list degrades gracefully.
      const isVisible = visible.edges.has(edge.id) && visible.nodes.has(edge.source) && visible.nodes.has(edge.target)
      return edge.hidden === !isVisible ? edge : { ...edge, hidden: !isVisible }
    })
  }, [edges, visible])

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
    const out = flowToSystemDesign(nodes, edges, diagram)
    navigator.clipboard
      ?.writeText(JSON.stringify(out, null, 2))
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
      .catch(() => {})
  }, [nodes, edges, diagram])

  const defaultEdgeOptions = useMemo(
    () => ({ type: 'architectureEdge' as const }),
    [],
  )

  const translateExtent = useMemo((): [[number, number], [number, number]] | undefined => {
    if (isEditable) return undefined

    const PADDING = 300
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity

    const nodeMap = new Map(nodes.map((n) => [n.id, n]))

    for (const node of nodes) {
      const abs = getAbsPos(node.id, nodeMap)
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
    const nds = nodesRef.current
    const nodeMap = new Map(nds.map((n) => [n.id, n]))
    const selNodes = nodeIds
      .map((id) => nodeMap.get(id))
      .filter((n): n is Node => !!n && n.type === 'architectureNode')
    if (selNodes.length < 2) return

    const parentIds = new Set(selNodes.map((n) => n.parentId))
    if (parentIds.size > 1) return
    const commonParentId = selNodes[0].parentId

    const GROUP_PAD = 40, NODE_W = 200, NODE_H = 84
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
    for (const node of selNodes) {
      const abs = getAbsPos(node.id, nodeMap)
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
    const parentAbs = commonParentId ? getAbsPos(commonParentId, nodeMap) : { x: 0, y: 0 }
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
      style: { zIndex: -1 },
    }

    const mapped = nds.map((n) => {
      if (!selectedIds.has(n.id)) return n
      const abs = getAbsPos(n.id, nodeMap)
      return {
        ...n,
        parentId: groupId,
        extent: 'parent' as const,
        position: { x: abs.x - absGroupX, y: abs.y - absGroupY },
        selected: false,
      }
    })

    // React Flow requires parents to appear before their children in the array.
    if (!commonParentId) {
      setNodes([groupNode, ...mapped])
      return
    }
    const parentIdx = mapped.findIndex((n) => n.id === commonParentId)
    setNodes([...mapped.slice(0, parentIdx + 1), groupNode, ...mapped.slice(parentIdx + 1)])
  }, [])

  // Ungroups the given architecture-node ids — reparents them to their group's
  // parent (matching the group context menu) and drops group shells left empty.
  const ungroupNodes = useCallback((nodeIds: string[]) => {
    const nds = nodesRef.current
    const nodeMap = new Map(nds.map((n) => [n.id, n]))
    const ids = new Set(nodeIds)
    const affected = nds.filter((n) => ids.has(n.id) && n.parentId)
    if (affected.length === 0) return

    const emptiedCandidates = new Set(affected.map((n) => n.parentId as string))
    let result = nds.map((n) => {
      if (!ids.has(n.id) || !n.parentId) return n
      const newParentId = nodeMap.get(n.parentId)?.parentId
      const abs = getAbsPos(n.id, nodeMap)
      const parentAbs = newParentId ? getAbsPos(newParentId, nodeMap) : { x: 0, y: 0 }
      return {
        ...n,
        parentId: newParentId,
        extent: newParentId ? ('parent' as const) : undefined,
        position: { x: abs.x - parentAbs.x, y: abs.y - parentAbs.y },
      }
    })
    for (const gid of emptiedCandidates) {
      if (!result.some((n) => n.parentId === gid)) result = result.filter((n) => n.id !== gid)
    }
    setNodes(result)
  }, [])

  // Moves the given architecture-node ids into targetGroupId, converting their
  // position to be relative to the target group.
  const moveToGroup = useCallback((nodeIds: string[], targetGroupId: string) => {
    const nds = nodesRef.current
    const nodeMap = new Map(nds.map((n) => [n.id, n]))
    if (!nodeMap.has(targetGroupId)) return
    const ids = new Set(nodeIds)
    const moving = nds.filter((n) => ids.has(n.id) && n.parentId !== targetGroupId)
    if (moving.length === 0) return

    const targetAbs = getAbsPos(targetGroupId, nodeMap)
    const oldParents = new Set(moving.map((n) => n.parentId).filter((p): p is string => !!p))
    let result = nds.map((n) => {
      if (!ids.has(n.id)) return n
      const abs = getAbsPos(n.id, nodeMap)
      return {
        ...n,
        parentId: targetGroupId,
        extent: 'parent' as const,
        position: { x: abs.x - targetAbs.x, y: abs.y - targetAbs.y },
      }
    })
    for (const gid of oldParents) {
      if (gid === targetGroupId) continue
      if (!result.some((n) => n.parentId === gid)) result = result.filter((n) => n.id !== gid)
    }
    setNodes(result)
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
    const pos = clampMenuPosition(event.clientX, event.clientY, 160, 60)
    setSelectionMenu({ x: pos.x, y: pos.y, nodeIds: archIds })
  }, [])

  useEffect(() => {
    if (!selectionMenu) return
    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('[data-selection-context-menu]')) closeSelectionMenu()
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSelectionMenu()
    }
    document.addEventListener('mousedown', onMouseDown, true)
    document.addEventListener('keydown', onKeyDown, true)
    return () => {
      document.removeEventListener('mousedown', onMouseDown, true)
      document.removeEventListener('keydown', onKeyDown, true)
    }
  }, [selectionMenu, closeSelectionMenu])

  // ------------------------------------------------------------- add node
  const [paneMenu, setPaneMenu] = useState<{ x: number; y: number } | null>(null)
  const closePaneMenu = useCallback(() => setPaneMenu(null), [])

  const onPaneContextMenu = useCallback((event: React.MouseEvent | MouseEvent) => {
    if (!isEditableRef.current) return
    event.preventDefault()
    setPaneMenu({ x: event.clientX, y: event.clientY })
  }, [])

  const addNode = useCallback((kind: NodeKind, position: { x: number; y: number }) => {
    const suffix = (crypto.randomUUID?.() ?? Math.random().toString(36).slice(2)).slice(0, 8)
    const id = `${kind}-${suffix}`
    const snapped = { x: Math.round(position.x / 8) * 8, y: Math.round(position.y / 8) * 8 }
    setNodes((nds) => [
      ...nds,
      {
        id,
        type: 'architectureNode',
        position: snapped,
        data: { id, kind, x: snapped.x, y: snapped.y },
        draggable: true,
        selectable: true,
      },
    ])
    setPaneMenu(null)
  }, [])

  // Ctrl/Cmd+G groups the current selection.
  useEffect(() => {
    if (!isEditable) return
    const handler = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey) || e.key.toLowerCase() !== 'g') return
      if (isTypingTarget(e.target)) return
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

  const toggleEditable = useCallback(() => setIsEditable((prev) => !prev), [])

  return (
    <ReactFlowProvider>
        <div ref={containerRef} style={{ width: '100%', height: '100vh' }} className={`mx-auto bg-background relative overflow-hidden ${noteMode || (chaosArmed && !isEditable) ? 'cursor-crosshair' : ''}`}>
          <PortalTargetContext.Provider value={portalContainer}>
            <EditableContext.Provider value={isEditable}>
              <SelectionActionsContext.Provider value={selectionActions}>
                <EdgeHoverContext.Provider value={edgeHoverCtx}>
                  <DiagramChaosContext.Provider value={chaosCtx}>
                  <DiagramHighlightContext.Provider value={highlightCtx}>
                  <StageCamera visible={visible} />
                  <HighlightCamera highlight={highlight} />
                  <ReactFlow
                    nodes={displayNodes}
                    edges={displayEdges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onReconnect={onReconnect}
                    onPaneContextMenu={onPaneContextMenu}
                    onPaneClick={onPaneClick}
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
                    zoomOnDoubleClick={false}
                    deleteKeyCode={['Backspace', 'Delete']}
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
                  <NotesLayer
                    notes={notes}
                    editingId={editingNoteId}
                    pendingPlacement={pendingNotePlacement}
                    onStartEdit={setEditingNoteId}
                    onStopEdit={() => setEditingNoteId(null)}
                    onTextChange={updateNoteText}
                    onColorChange={setNoteColor}
                    onMove={moveNote}
                    onDelete={deleteNote}
                    onPlace={addNote}
                  />
                  </DiagramHighlightContext.Provider>
                  </DiagramChaosContext.Provider>
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
                  {paneMenu && (
                    <AddNodeMenu
                      x={paneMenu.x}
                      y={paneMenu.y}
                      portalTarget={portalContainer}
                      onClose={closePaneMenu}
                      onAdd={addNode}
                    />
                  )}
                </EdgeHoverContext.Provider>
              </SelectionActionsContext.Provider>
            </EditableContext.Provider>
            {overlay}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50">
              <DiagramDock
                isEditable={isEditable}
                onToggleEditable={toggleEditable}
                noteMode={noteMode}
                onToggleNoteMode={toggleNoteMode}
                containerRef={containerRef}
              />
            </div>

            {/* Bottom Right Logos */}
            <div className="absolute bottom-4 right-4 flex items-center gap-2 z-50 invert dark:invert-0 opacity-45">
              <img src="/logo.svg" alt="" className="h-4" />
              <img src="/mafia.svg" alt="" className="h-4" />
            </div>
            <div ref={portalRef} />
          </PortalTargetContext.Provider>
        </div>
    </ReactFlowProvider>
  )
}
