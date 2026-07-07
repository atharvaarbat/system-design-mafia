'use client'

import { memo, useState, useCallback, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { NodeResizer, useReactFlow, type NodeProps, type Node } from '@xyflow/react'
import { useEditable } from '@/lib/diagram/editable-context'
import { usePortalTarget } from '@/lib/diagram/portal-target-context'
import { clampMenuPosition } from '@/lib/diagram/menu-position'

interface GroupNodeData {
  label: string
  description?: string
  accent: string
  borderStyle: 'solid' | 'dashed'
}

type GroupFlowNode = Node<GroupNodeData & Record<string, unknown>>

interface DragState {
  pointerId: number
  startFlowX: number
  startFlowY: number
  originX: number
  originY: number
}

function GroupNodeComponent({ id, data, selected }: NodeProps<GroupFlowNode>) {
  const { setNodes, getNode, deleteElements, screenToFlowPosition } = useReactFlow()
  const editable = useEditable()
  // Menus portal into the diagram container so they stay visible in fullscreen mode.
  const portalTarget = usePortalTarget()
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState('')
  const dragState = useRef<DragState | null>(null)

  const startEditing = useCallback(() => {
    setEditValue(data.label)
    setEditing(true)
  }, [data.label])

  const saveLabel = useCallback(() => {
    const nextLabel = editValue.trim() || 'Untitled Group'
    if (nextLabel !== data.label) {
      setNodes((nds) =>
        nds.map((n) => {
          if (n.id !== id) return n
          return { ...n, data: { ...n.data, label: nextLabel } }
        }),
      )
    }
    setEditing(false)
  }, [id, setNodes, editValue, data.label])

  const cancelEditing = useCallback(() => {
    setEditing(false)
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      saveLabel()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      cancelEditing()
    }
  }, [saveLabel, cancelEditing])

  const handleLabelPointerDown = useCallback((e: React.PointerEvent) => {
    if (!editable || editing || e.button !== 0) return
    const node = getNode(id)
    if (!node) return
    e.stopPropagation()
    const startFlow = screenToFlowPosition({ x: e.clientX, y: e.clientY })
    dragState.current = {
      pointerId: e.pointerId,
      startFlowX: startFlow.x,
      startFlowY: startFlow.y,
      originX: node.position.x,
      originY: node.position.y,
    }
    e.currentTarget.setPointerCapture(e.pointerId)
  }, [editable, editing, getNode, id, screenToFlowPosition])

  const handleLabelPointerMove = useCallback((e: React.PointerEvent) => {
    const drag = dragState.current
    if (!drag || drag.pointerId !== e.pointerId) return
    const current = screenToFlowPosition({ x: e.clientX, y: e.clientY })
    const dx = current.x - drag.startFlowX
    const dy = current.y - drag.startFlowY
    let x = drag.originX + dx
    let y = drag.originY + dy
    // Manual drag bypasses React Flow's extent clamping — keep nested groups inside their parent.
    const node = getNode(id)
    if (node?.parentId && node.extent === 'parent') {
      const parent = getNode(node.parentId)
      const parentW = parent?.width ?? parent?.measured?.width
      const parentH = parent?.height ?? parent?.measured?.height
      const w = node.width ?? node.measured?.width ?? 0
      const h = node.height ?? node.measured?.height ?? 0
      if (parentW != null) x = Math.min(Math.max(x, 0), Math.max(0, parentW - w))
      if (parentH != null) y = Math.min(Math.max(y, 0), Math.max(0, parentH - h))
    }
    setNodes((nds) =>
      nds.map((n) => (n.id === id ? { ...n, position: { x, y } } : n)),
    )
  }, [id, screenToFlowPosition, setNodes, getNode])

  const handleLabelPointerUp = useCallback((e: React.PointerEvent) => {
    if (dragState.current?.pointerId === e.pointerId) {
      dragState.current = null
    }
  }, [])

  const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(null)
  const closeMenu = useCallback(() => setMenuPos(null), [])

  useEffect(() => {
    if (!menuPos) return
    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('[data-group-context-menu]')) closeMenu()
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu()
    }
    document.addEventListener('mousedown', onMouseDown, true)
    document.addEventListener('keydown', onKeyDown, true)
    return () => {
      document.removeEventListener('mousedown', onMouseDown, true)
      document.removeEventListener('keydown', onKeyDown, true)
    }
  }, [menuPos, closeMenu])

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    if (!editable) return
    e.stopPropagation()
    setMenuPos(clampMenuPosition(e.clientX, e.clientY, 176, 90))
  }, [editable])

  const handleUngroup = useCallback(() => {
    closeMenu()
    setNodes((nds) => {
      const groupNode = nds.find((n) => n.id === id)
      if (!groupNode) return nds
      const newParentId = groupNode.parentId
      return nds
        .filter((n) => n.id !== id)
        .map((n) => {
          if (n.parentId !== id) return n
          return {
            ...n,
            parentId: newParentId,
            extent: newParentId ? ('parent' as const) : undefined,
            position: {
              x: n.position.x + groupNode.position.x,
              y: n.position.y + groupNode.position.y,
            },
          }
        })
    })
  }, [id, setNodes, closeMenu])

  const handleDeleteGroup = useCallback(() => {
    deleteElements({ nodes: [{ id }] })
    closeMenu()
  }, [deleteElements, id, closeMenu])

  return (
    <>
      {editable && (
      <NodeResizer
        isVisible={selected}
        minWidth={240}
        minHeight={120}
        lineStyle={{ borderColor: '#3b82f6', borderWidth: 3 }}
        handleClassName="h-10 w-10 bg-white border-2 border-blue-400 rounded-md shadow-sm"
      />
      )}
      <div className="relative h-full w-full" onContextMenu={handleContextMenu} style={{ pointerEvents: 'auto' }}>
        <div
          style={{
            borderColor: selected ? '#3b82f655' : data.accent || '#94a3b8',
            borderStyle: data.borderStyle === 'dashed' ? 'dashed' : 'solid',
          }}
          className="h-full w-full rounded-2xl border-2 bg-zinc-50/40 dark:bg-zinc-900/20"
        />
        <div
          style={{ pointerEvents: 'auto' }}
          className={`nodrag nopan absolute left-4 top-2 inline-block rounded-md bg-white px-3 py-1 shadow-sm dark:bg-zinc-800 ${editable ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
          onPointerDown={handleLabelPointerDown}
          onPointerMove={handleLabelPointerMove}
          onPointerUp={handleLabelPointerUp}
          onPointerCancel={handleLabelPointerUp}
          onDoubleClick={(e) => { if (!editable) return; e.stopPropagation(); startEditing() }}
        >
          {editing ? (
            <input
              autoFocus
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={saveLabel}
              onKeyDown={handleKeyDown}
              className="w-32 rounded border border-input bg-background px-1 py-0.5 text-xs font-medium text-foreground outline-hidden ring-1 ring-ring/50"
            />
          ) : (
            <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300 cursor-default select-none">{data.label}</span>
          )}
        </div>
      </div>
      {menuPos && createPortal(
        <div
          data-group-context-menu
          style={{ position: 'fixed', left: menuPos.x, top: menuPos.y, zIndex: 9999 }}
          className="min-w-36 rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div
            className="flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground"
            onClick={handleUngroup}
          >
            Ungroup
          </div>
          <div
            className="flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground"
            onClick={handleDeleteGroup}
          >
            Delete
          </div>
        </div>,
        portalTarget ?? document.body
      )}
    </>
  )
}

export default memo(GroupNodeComponent)
