export interface DiagramNote {
  id: string
  /** Flow-space position (same coordinate system as diagram nodes). */
  x: number
  y: number
  text: string
  color: string
}

export const NOTE_COLORS = ['#fde68a', '#fca5a5', '#93c5fd', '#86efac', '#d8b4fe', '#f9a8d4'] as const

function storageKey(diagramId: string): string {
  return `sdmafia:diagram-notes:${diagramId}`
}

/** Reader-authored notes never leave the browser — no diagramId means no safe storage key. */
export function loadNotes(diagramId: string): DiagramNote[] {
  if (typeof window === 'undefined' || !diagramId) return []
  try {
    const raw = window.localStorage.getItem(storageKey(diagramId))
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveNotes(diagramId: string, notes: DiagramNote[]): void {
  if (typeof window === 'undefined' || !diagramId) return
  try {
    window.localStorage.setItem(storageKey(diagramId), JSON.stringify(notes))
  } catch {
    // storage unavailable or full — edits just won't persist across reloads
  }
}
