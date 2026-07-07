'use client'

import { createContext, useContext } from 'react'

/** 'active' = part of the current walkthrough step, 'trail' = part of an earlier step. */
export type HighlightState = 'active' | 'trail'

/** Elements NOT present in the maps are dimmed while a highlight is enabled. */
export interface DiagramHighlight {
  nodes: Map<string, HighlightState>
  edges: Map<string, HighlightState>
}

interface DiagramHighlightCtx {
  highlight: DiagramHighlight | null
}

export const DiagramHighlightContext = createContext<DiagramHighlightCtx>({ highlight: null })

export const useDiagramHighlight = () => useContext(DiagramHighlightContext)
