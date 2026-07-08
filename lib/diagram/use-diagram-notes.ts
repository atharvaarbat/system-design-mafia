'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { DiagramNote, NOTE_COLORS, loadNotes, saveNotes } from './notes-storage'

export function useDiagramNotes(diagramId: string) {
  const [notes, setNotes] = useState<DiagramNote[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)

  // Notes live in localStorage, which the server can't see during SSR — loading them in an
  // effect (rather than during render) keeps the first client render matching the server's
  // empty output, avoiding a hydration mismatch.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- must run post-mount, not during render, so SSR (no localStorage) and the first client render match
    setNotes(loadNotes(diagramId))
  }, [diagramId])

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => saveNotes(diagramId, notes), 300)
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [diagramId, notes])

  const addNote = useCallback((position: { x: number; y: number }) => {
    const id = `note-${crypto.randomUUID?.() ?? Date.now()}`
    const color = NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)]
    setNotes((prev) => [...prev, { id, x: position.x, y: position.y, text: '', color }])
    setEditingId(id)
  }, [])

  const moveNote = useCallback((id: string, position: { x: number; y: number }) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, x: position.x, y: position.y } : n)))
  }, [])

  const updateNoteText = useCallback((id: string, text: string) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, text } : n)))
  }, [])

  const setNoteColor = useCallback((id: string, color: string) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, color } : n)))
  }, [])

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id))
    setEditingId((cur) => (cur === id ? null : cur))
  }, [])

  return { notes, editingId, setEditingId, addNote, moveNote, updateNoteText, setNoteColor, deleteNote }
}
