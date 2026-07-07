import type { NodeKind } from '@/lib/diagram/registry'

export type NodeStatus = 'active' | 'warning' | 'error' | 'inactive'

export type Protocol =
  | 'http'
  | 'https'
  | 'grpc'
  | 'websocket'
  | 'tcp'
  | 'udp'
  | 'database'
  | 'message'
  | 'event'
  | 'internal'

export interface SystemDesignNode {
  id: string
  kind: NodeKind
  name?: string
  description?: string
  /** Markdown body rendered in the expanded node card. */
  details?: string
  x: number
  y: number
  width?: number
  height?: number
  status?: NodeStatus
  group?: string
}

export interface SystemDesignEdge {
  id: string
  source: string
  target: string
  sourceHandle?: string
  targetHandle?: string
  label?: string
  protocol?: Protocol
  style?: 'solid' | 'dashed' | 'dotted'
  animated?: boolean
  width?: number
  color?: string
}

export interface SystemDesignGroup {
  id: string
  label: string
  description?: string
  color?: string
  style?: 'solid' | 'dashed'
  parent?: string
  x?: number
  y?: number
  width?: number
  height?: number
}

/** One step of a request-flow walkthrough. nodeIds/edgeIds are highlighted in the diagram while the step is active. */
export interface FlowStep {
  text: string
  nodeIds?: string[]
  edgeIds?: string[]
}

export interface RequestFlow {
  id: string
  title: string
  description?: string
  steps: FlowStep[]
}

export interface DesignDecision {
  title: string
  /** What this architecture chose. */
  choice: string
  /** Options that were considered and rejected. */
  alternatives?: string[]
  /** Markdown. Why the choice wins for this system's constraints. */
  rationale: string
}

export interface Bottleneck {
  title: string
  /** Markdown. What breaks, and under which conditions. */
  problem: string
  /** Markdown. How the design mitigates it. */
  mitigation: string
}

export interface QuizItem {
  question: string
  /** Markdown. */
  answer: string
}

export interface Reference {
  title: string
  url: string
  /** e.g. "netflixtechblog.com" or "RFC 8216" — shown next to the title. */
  source?: string
}

export interface Requirements {
  functional?: string[]
  nonFunctional?: string[]
}

export interface Estimate {
  label: string
  value: string
  note?: string
}

export interface SystemDesign {
  version: string
  title: string
  description?: string
  summary?: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  requirements?: Requirements
  estimates?: Estimate[]
  flows?: RequestFlow[]
  decisions?: DesignDecision[]
  bottlenecks?: Bottleneck[]
  quiz?: QuizItem[]
  references?: Reference[]
  /** Slugs of related diagrams in data/diagrams/index.json. */
  relatedPatterns?: string[]
  nodes: SystemDesignNode[]
  edges: SystemDesignEdge[]
  groups?: SystemDesignGroup[]
  theme?: 'light' | 'dark'
}
