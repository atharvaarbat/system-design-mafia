'use client'

import { createContext, useContext } from 'react'
import type { SystemDesign } from '@/types/diagram'

/** 'dead' = the node the reader killed, 'down'/'degraded' = its authored blast radius. */
export type ChaosEffect = 'dead' | 'down' | 'degraded'

export interface DiagramChaos {
  /** The node the reader killed. */
  sourceId: string
  nodes: Map<string, ChaosEffect>
  /** Edges rendered as failed — any edge touching a dead or down node. */
  edges: Set<string>
}

interface DiagramChaosCtx {
  chaos: DiagramChaos | null
  /** True while chaos mode is armed — killable nodes show a target marker and clicks kill instead of opening the card. */
  armed: boolean
  killableIds: Set<string>
  onKill: (nodeId: string) => void
}

const EMPTY_KILLABLE = new Set<string>()

export const DiagramChaosContext = createContext<DiagramChaosCtx>({
  chaos: null,
  armed: false,
  killableIds: EMPTY_KILLABLE,
  onKill: () => {},
})

export const useDiagramChaos = () => useContext(DiagramChaosContext)

/** Expands a killed node into full chaos state using the node's authored `failure.blastRadius`. */
export function buildChaos(design: SystemDesign, sourceId: string): DiagramChaos {
  const nodes = new Map<string, ChaosEffect>([[sourceId, 'dead']])
  const failure = design.nodes.find((n) => n.id === sourceId)?.failure
  for (const impact of failure?.blastRadius ?? []) {
    if (impact.nodeId !== sourceId) nodes.set(impact.nodeId, impact.effect)
  }
  const edges = new Set<string>()
  for (const edge of design.edges) {
    const source = nodes.get(edge.source)
    const target = nodes.get(edge.target)
    if (source === 'dead' || source === 'down' || target === 'dead' || target === 'down') {
      edges.add(edge.id)
    }
  }
  return { sourceId, nodes, edges }
}
