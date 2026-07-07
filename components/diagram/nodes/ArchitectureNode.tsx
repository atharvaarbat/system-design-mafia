'use client'

import { memo, useEffect, useState, useMemo, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Handle, Position, useEdges, useReactFlow, type NodeProps, type Node } from '@xyflow/react'
import type { SystemDesignNode } from '@/types/diagram'
import { CATEGORY_SHAPE_PATH, resolveNodeKind } from '@/lib/diagram/registry'
import { useEdgeHover } from '@/lib/diagram/edge-hover-context'
import { useDiagramHighlight } from '@/lib/diagram/highlight-context'
import { useSelectionActions } from '@/lib/diagram/selection-actions-context'
import { useEditable } from '@/lib/diagram/editable-context'
import RichText from '@/components/ui/rich-text'
import ExpandableNodeCard from './expandable-node-card'

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

function ArchitectureNodeComponent({ data, selected }: NodeProps<ArchitectureFlowNode>) {
  const { deleteElements, getNodes } = useReactFlow()
  const { groupSelectedNodes, ungroupSelectedNodes, moveNodesToGroup } = useSelectionActions()
  const editable = useEditable()
  const edges = useEdges()
  const { hoveredEdgeIds } = useEdgeHover()
  const { highlight } = useDiagramHighlight()
  const highlightState = highlight ? highlight.nodes.get(data.id) : undefined
  const isDimmed = !!highlight && !highlightState
  const kindDef = resolveNodeKind(data.kind)
  const Icon = kindDef.icon
  const label = data.name || kindDef.label
  const shapePath = CATEGORY_SHAPE_PATH[kindDef.category]
  const shapeAvailable = useShapeAvailable(shapePath)
  const hasBrandLogo = !!kindDef.brandLogo

  const [menuState, setMenuState] = useState<{
    x: number
    y: number
    groupableIds: string[]
    nodeIds: string[]
    hasParent: boolean
    hasGroups: boolean
  } | null>(null)
  const [groupSubmenu, setGroupSubmenu] = useState<{
    x: number
    y: number
    groups: { id: string; label: string }[]
  } | null>(null)
  const closeMenu = useCallback(() => {
    setMenuState(null)
    setGroupSubmenu(null)
  }, [])

  useEffect(() => {
    if (!menuState) return
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('[data-node-context-menu]') && !target.closest('[data-group-submenu]')) closeMenu()
    }
    document.addEventListener('mousedown', handler, true)
    return () => document.removeEventListener('mousedown', handler, true)
  }, [menuState, closeMenu])

  // Reads the current selection on demand (not a subscription) so opening
  // this menu doesn't force every node to re-render on every drag/selection change.
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    if (!editable) return
    e.stopPropagation()
    const allNodes = getNodes()
    const selArchNodes = allNodes.filter((n) => n.selected && n.type === 'architectureNode')

    let nodeIds: string[]
    let hasParent: boolean
    if (selArchNodes.length >= 1) {
      nodeIds = selArchNodes.map((n) => n.id)
      hasParent = selArchNodes.some((n) => n.parentId)
    } else {
      nodeIds = [data.id]
      hasParent = !!allNodes.find((n) => n.id === data.id)?.parentId
    }

    let groupableIds: string[] = []
    if (selArchNodes.length >= 2 && new Set(selArchNodes.map((n) => n.parentId)).size === 1) {
      groupableIds = selArchNodes.map((n) => n.id)
    }

    const hasGroups = allNodes.some((n) => n.type === 'groupNode')
    setMenuState({ x: e.clientX, y: e.clientY, groupableIds, nodeIds, hasParent, hasGroups })
  }, [editable, getNodes, data.id])

  const handleGroup = useCallback(() => {
    if (menuState) groupSelectedNodes(menuState.groupableIds)
    closeMenu()
  }, [menuState, groupSelectedNodes, closeMenu])

  const handleUngroup = useCallback(() => {
    if (menuState) ungroupSelectedNodes(menuState.nodeIds)
    closeMenu()
  }, [menuState, ungroupSelectedNodes, closeMenu])

  const handleOpenMoveSubmenu = useCallback(() => {
    if (!menuState) return
    if (groupSubmenu) {
      setGroupSubmenu(null)
      return
    }
    const allNodes = getNodes()
    const currentParentId = allNodes.find((n) => n.id === menuState.nodeIds[0])?.parentId
    const groups = allNodes
      .filter((n) => n.type === 'groupNode' && n.id !== currentParentId)
      .map((n) => ({ id: n.id, label: (n.data as { label?: string })?.label || n.id }))
    if (groups.length === 0) return
    setGroupSubmenu({ x: menuState.x + 144, y: menuState.y, groups })
  }, [menuState, getNodes, groupSubmenu])

  const handleMoveToGroup = useCallback((targetGroupId: string) => {
    if (menuState) moveNodesToGroup(menuState.nodeIds, targetGroupId)
    closeMenu()
  }, [menuState, moveNodesToGroup, closeMenu])

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

  const handleDelete = useCallback(() => {
    deleteElements({ nodes: [{ id: data.id }] })
    closeMenu()
  }, [deleteElements, data.id, closeMenu])

  const statusColor =
    data.status === 'active' ? '#22c55e'
      : data.status === 'warning' ? '#f59e0b'
        : data.status === 'error' ? '#ef4444'
          : data.status === 'inactive' ? '#d1d5db'
            : undefined

  const connectedEdgeCount = useMemo(
    () => edges.filter((e) => e.source === data.id || e.target === data.id).length,
    [edges, data.id],
  )

  return (
    <>
      <ExpandableNodeCard
        trigger={
          <div
            onContextMenu={handleContextMenu}
            className={`group relative w-fit rounded-xl transition-[opacity,filter] duration-500 ${selected && editable ? 'bg-primary/20' : ''} ${isDimmed ? 'opacity-20 grayscale' : ''}`}
          >
            {highlightState === 'active' && (
              <div className="pointer-events-none absolute -inset-1.5 rounded-xl border-2 border-primary/70 bg-primary/8 shadow-[0_0_28px_color-mix(in_oklab,var(--color-primary)_35%,transparent)]" />
            )}
            {highlightState === 'trail' && (
              <div className="pointer-events-none absolute -inset-1.5 rounded-xl border border-dashed border-primary/35" />
            )}
            <Handle id="left-target" type="target" position={Position.Left} className="h-2 w-2 rounded-full bg-zinc-400! dark:bg-zinc-500! opacity-0 group-hover:opacity-100 transition-opacity" style={{ opacity: !editable ? 0 : connectedEdgeSides.has('left') ? 1 : undefined, pointerEvents: editable ? undefined : 'none' }} />
            <Handle id="left-source" type="source" position={Position.Left} className="h-2 w-2 rounded-full bg-zinc-400! dark:bg-zinc-500! opacity-0 group-hover:opacity-100 transition-opacity" style={{ opacity: !editable ? 0 : connectedEdgeSides.has('left') ? 1 : undefined, pointerEvents: editable ? undefined : 'none' }} />
            <Handle id="top-target" type="target" position={Position.Top} className="h-2 w-2 rounded-full bg-zinc-400! dark:bg-zinc-500! opacity-0 group-hover:opacity-100 transition-opacity" style={{ opacity: !editable ? 0 : connectedEdgeSides.has('top') ? 1 : undefined, pointerEvents: editable ? undefined : 'none' }} />
            <Handle id="top-source" type="source" position={Position.Top} className="h-2 w-2 rounded-full bg-zinc-400! dark:bg-zinc-500! opacity-0 group-hover:opacity-100 transition-opacity" style={{ opacity: !editable ? 0 : connectedEdgeSides.has('top') ? 1 : undefined, pointerEvents: editable ? undefined : 'none' }} />
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
                {hasBrandLogo
                  ? <img src={kindDef.brandLogo} alt="" className="absolute inset-0 m-auto h-8 w-8 object-contain" />
                  : <Icon className="absolute inset-0 m-auto h-5 w-5 text-white" strokeWidth={2} />}
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
            <Handle id="right-target" type="target" position={Position.Right} className="h-2 w-2 rounded-full bg-zinc-400! dark:bg-zinc-500! opacity-0 group-hover:opacity-100 transition-opacity" style={{ opacity: !editable ? 0 : connectedEdgeSides.has('right') ? 1 : undefined, pointerEvents: editable ? undefined : 'none' }} />
            <Handle id="right-source" type="source" position={Position.Right} className="h-2 w-2 rounded-full bg-zinc-400! dark:bg-zinc-500! opacity-0 group-hover:opacity-100 transition-opacity" style={{ opacity: !editable ? 0 : connectedEdgeSides.has('right') ? 1 : undefined, pointerEvents: editable ? undefined : 'none' }} />
            <Handle id="bottom-target" type="target" position={Position.Bottom} className="h-2 w-2 rounded-full bg-zinc-400! dark:bg-zinc-500! opacity-0 group-hover:opacity-100 transition-opacity" style={{ opacity: !editable ? 0 : connectedEdgeSides.has('bottom') ? 1 : undefined, pointerEvents: editable ? undefined : 'none' }} />
            <Handle id="bottom-source" type="source" position={Position.Bottom} className="h-2 w-2 rounded-full bg-zinc-400! dark:bg-zinc-500! opacity-0 group-hover:opacity-100 transition-opacity" style={{ opacity: !editable ? 0 : connectedEdgeSides.has('bottom') ? 1 : undefined, pointerEvents: editable ? undefined : 'none' }} />
          </div>
        }
        title={label}
        subtitle={kindDef.label}
        icon={hasBrandLogo
          ? <img src={kindDef.brandLogo} alt="" className="w-full h-full object-contain" />
          : <Icon className="w-full h-full" strokeWidth={2} />}
        color={kindDef.color}
      >
        <p className="bg-foreground text-background rounded-full w-fit px-2 py-1 mb-2 text-xs capitalize">{kindDef.category}</p>
        <div className="space-y-6">


          {data.description && (
            <div>
              <h4 className="text-foreground font-semibold tracking-tight mb-2">Description</h4>
              <p className="text-muted-foreground">{data.description}</p>
            </div>
          )}

          {data.details && (
            <div>
              <h4 className="text-foreground font-semibold tracking-tight mb-2">Details</h4>
              <RichText content={data.details} />
            </div>
          )}



          {data.status && (
            <div>
              <h4 className="text-foreground font-semibold tracking-tight mb-2">Status</h4>
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border capitalize"
                style={{ borderColor: statusColor ?? undefined, color: statusColor ?? undefined }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusColor }} />
                {data.status}
              </span>
            </div>
          )}


        </div>
      </ExpandableNodeCard>

      {menuState && createPortal(
        <div
          data-node-context-menu
          style={{ position: 'fixed', left: menuState.x, top: menuState.y, zIndex: 9999 }}
          className="min-w-36 rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10"
          onMouseDown={(e) => e.stopPropagation()}
        >
          {menuState.groupableIds.length >= 2 && (
            <div
              className="flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground"
              onClick={handleGroup}
            >
              Group
            </div>
          )}
          {menuState.hasParent && (
            <div
              className="flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground"
              onClick={handleUngroup}
            >
              Ungroup
            </div>
          )}
          {menuState.hasGroups && (
            <div
              className="flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground"
              onClick={handleOpenMoveSubmenu}
            >
              <span className="flex-1">Move to Group</span>
              <span className="text-foreground/40">›</span>
            </div>
          )}
          <div
            className="flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground"
            onClick={handleDelete}
          >
            Delete
          </div>
        </div>,
        document.body
      )}
      {groupSubmenu && createPortal(
        <div
          data-group-submenu
          style={{ position: 'fixed', left: groupSubmenu.x, top: groupSubmenu.y, zIndex: 9999 }}
          className="min-w-36 rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10"
          onMouseDown={(e) => e.stopPropagation()}
        >
          {groupSubmenu.groups.map((g) => (
            <div
              key={g.id}
              className="flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground"
              onClick={() => handleMoveToGroup(g.id)}
            >
              {g.label}
            </div>
          ))}
        </div>,
        document.body
      )}
    </>
  )
}

export default memo(ArchitectureNodeComponent)
