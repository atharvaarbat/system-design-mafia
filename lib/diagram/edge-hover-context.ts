'use client'

import { createContext, useContext } from 'react'

interface EdgeHoverState {
  hoveredEdgeIds: Set<string>
}

export const EdgeHoverContext = createContext<EdgeHoverState>({ hoveredEdgeIds: new Set() })

export const useEdgeHover = () => useContext(EdgeHoverContext)
