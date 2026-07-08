'use client'

import { useCallback, useEffect, useRef } from 'react'
import { useReactFlow, useViewport } from '@xyflow/react'
import { GripVertical, X } from 'lucide-react'
import { NOTE_COLORS, type DiagramNote } from '@/lib/diagram/notes-storage'

const NOTE_WIDTH = 200

/** Deterministic small tilt per note so the board doesn't look like a grid of identical stickers. */
function noteRotation(id: string): number {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0
  return ((Math.abs(h) % 100) / 100) * 5 - 2.5
}

interface DragState {
  pointerId: number
  startFlowX: number
  startFlowY: number
  originX: number
  originY: number
}

interface NoteCardProps {
  note: DiagramNote
  isEditing: boolean
  onStartEdit: () => void
  onStopEdit: () => void
  onTextChange: (text: string) => void
  onColorChange: (color: string) => void
  onMove: (position: { x: number; y: number }) => void
  onDelete: () => void
}

function NoteCard({ note, isEditing, onStartEdit, onStopEdit, onTextChange, onColorChange, onMove, onDelete }: NoteCardProps) {
  const { screenToFlowPosition } = useReactFlow()
  const dragState = useRef<DragState | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const rotation = noteRotation(note.id)

  useEffect(() => {
    if (isEditing) textareaRef.current?.focus()
  }, [isEditing])

  // Auto-grows the textarea to fit content, in flow-space px (scaled by the viewport wrapper).
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [note.text])

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (e.button !== 0) return
    // Swatches/delete live in this same header strip — don't hijack their clicks into a drag.
    if ((e.target as HTMLElement).closest('button')) return
    e.stopPropagation()
    const startFlow = screenToFlowPosition({ x: e.clientX, y: e.clientY })
    dragState.current = {
      pointerId: e.pointerId,
      startFlowX: startFlow.x,
      startFlowY: startFlow.y,
      originX: note.x,
      originY: note.y,
    }
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }, [screenToFlowPosition, note.x, note.y])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const drag = dragState.current
    if (!drag || drag.pointerId !== e.pointerId) return
    const current = screenToFlowPosition({ x: e.clientX, y: e.clientY })
    onMove({ x: drag.originX + (current.x - drag.startFlowX), y: drag.originY + (current.y - drag.startFlowY) })
  }, [screenToFlowPosition, onMove])

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (dragState.current?.pointerId === e.pointerId) dragState.current = null
  }, [])

  const handleBlur = useCallback((e: React.FocusEvent<HTMLTextAreaElement>) => {
    onStopEdit()
    if (e.target.value.trim() === '') onDelete()
  }, [onStopEdit, onDelete])

  return (
    <div className="pointer-events-auto absolute animate-in fade-in zoom-in-95 duration-300" style={{ left: note.x, top: note.y, width: NOTE_WIDTH }}>
      <div
        className="group/note relative rounded-lg shadow-md ring-1 ring-black/5 transition-[transform,box-shadow] duration-200 ease-out hover:shadow-lg hover:-translate-y-0.5"
        style={{ backgroundColor: note.color, transform: `rotate(${rotation}deg)` }}
      >
         

        <div
          className="flex cursor-grab items-center justify-between px-2 pt-1.5 pb-0.5 active:cursor-grabbing"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <GripVertical className="h-3 w-3 text-black/30" />
          <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover/note:opacity-100">
            {NOTE_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                aria-label="Note color"
                onClick={() => onColorChange(c)}
                className={`h-2.5 w-2.5 shrink-0 rounded-full ring-1 ring-black/10 ${c === note.color ? 'ring-2 ring-black/40' : ''}`}
                style={{ backgroundColor: c }}
              />
            ))}
            <button
              type="button"
              aria-label="Delete note"
              onClick={onDelete}
              className="ml-1 shrink-0 rounded p-0.5 text-black/40 hover:bg-black/10 hover:text-black/70"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        </div>

        <textarea
          ref={textareaRef}
          value={note.text}
          onChange={(e) => onTextChange(e.target.value)}
          onFocus={onStartEdit}
          onBlur={handleBlur}
          placeholder="Add a note…"
          rows={1}
          className="block w-full resize-none overflow-hidden bg-transparent px-2.5 pb-2.5 text-[13px] leading-snug text-zinc-800 outline-hidden placeholder:text-black/35"
        />
      </div>
    </div>
  )
}

interface PendingPlacement {
  x: number
  y: number
  seq: number
}

interface NotesLayerProps {
  notes: DiagramNote[]
  editingId: string | null
  pendingPlacement: PendingPlacement | null
  onStartEdit: (id: string) => void
  onStopEdit: (id: string) => void
  onTextChange: (id: string, text: string) => void
  onColorChange: (id: string, color: string) => void
  onMove: (id: string, position: { x: number; y: number }) => void
  onDelete: (id: string) => void
  onPlace: (position: { x: number; y: number }) => void
}

/** Rendered inside ReactFlowProvider so it can share the pane's viewport transform and coordinate space. */
export default function NotesLayer({
  notes,
  editingId,
  pendingPlacement,
  onStartEdit,
  onStopEdit,
  onTextChange,
  onColorChange,
  onMove,
  onDelete,
  onPlace,
}: NotesLayerProps) {
  const { x, y, zoom } = useViewport()
  const { screenToFlowPosition } = useReactFlow()
  const lastSeq = useRef(0)

  // A pane click while note-placement mode is active arrives as raw screen coords —
  // screenToFlowPosition is only available down here, inside the provider.
  useEffect(() => {
    if (!pendingPlacement || pendingPlacement.seq === lastSeq.current) return
    lastSeq.current = pendingPlacement.seq
    onPlace(screenToFlowPosition({ x: pendingPlacement.x, y: pendingPlacement.y }))
  }, [pendingPlacement, screenToFlowPosition, onPlace])

  return (
    <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
      <div style={{ transform: `translate(${x}px, ${y}px) scale(${zoom})`, transformOrigin: '0 0' }}>
        {notes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            isEditing={editingId === note.id}
            onStartEdit={() => onStartEdit(note.id)}
            onStopEdit={() => onStopEdit(note.id)}
            onTextChange={(text) => onTextChange(note.id, text)}
            onColorChange={(color) => onColorChange(note.id, color)}
            onMove={(pos) => onMove(note.id, pos)}
            onDelete={() => onDelete(note.id)}
          />
        ))}
      </div>
    </div>
  )
}
