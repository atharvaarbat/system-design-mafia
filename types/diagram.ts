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

export type FailureEffect = 'down' | 'degraded'

/** Delivery / ordering contract an edge promises. Shown as chips on hover. */
export type EdgeGuarantee = 'at-least-once' | 'exactly-once' | 'ordered' | 'idempotent'

/** One component affected when another node is killed in chaos mode. */
export interface FailureImpact {
  nodeId: string
  effect: FailureEffect
  /** Plain text, short. What happens to this component during the outage. */
  note?: string
}

/** Interactive failure simulation ("chaos mode") for a node. Nodes with this field are killable in the diagram. */
export interface NodeFailure {
  /** Plain text. What the end user experiences while this node is down. */
  userImpact: string
  /** Components affected by the outage, and how. */
  blastRadius?: FailureImpact[]
  /** Markdown. How the design survives (or degrades through) this failure. */
  mitigation: string
}

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
  failure?: NodeFailure
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
  /** Sync/async contract. true = caller blocks (rendered solid); false = fire-and-forget
   *  (rendered dashed with travelling particles). Undefined leaves rendering to `style`. */
  sync?: boolean
  /** Delivery / ordering guarantees this edge promises. */
  guarantees?: EdgeGuarantee[]
  /** Peak throughput, e.g. "~100K peak". Also scales async particle density. */
  qps?: string
  /** Tail latency, e.g. "8ms". */
  p99?: string
  /** Typical message size, e.g. "~2KB". */
  payloadSize?: string
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

/** The literal data travelling on a hop — shown in the flow player's payload inspector. */
export interface FlowStepPayload {
  /** Short label for the payload, e.g. "POST /videos/initiate" or "S3 ObjectCreated event". Plain text. */
  title: string
  /** The actual data at this hop — a JSON / code block rendered verbatim in a monospace box. Plain text. */
  body: string
}

/** A state mutation a flow step causes at a node ("row inserted", "cache warmed"). */
export interface FlowStepStateChange {
  nodeId: string
  /** Plain text, short. What changed at this node during the step. */
  note: string
}

/** One step of a request-flow walkthrough. nodeIds/edgeIds are highlighted in the diagram while the step is active. */
export interface FlowStep {
  text: string
  nodeIds?: string[]
  edgeIds?: string[]
  /** The data on the wire at this hop — rendered in the payload inspector. */
  payload?: FlowStepPayload
  /** Node state mutations this step triggers. */
  stateChanges?: FlowStepStateChange[]
  /** This hop's latency contribution in ms — the player shows a cumulative clock + waterfall. */
  latencyMs?: number
}

export interface RequestFlow {
  id: string
  title: string
  description?: string
  steps: FlowStep[]
}

/** One chapter of the system's scale story ("evolution mode"). Ids are cumulative —
 *  each stage lists EVERYTHING visible at that stage, not just what it adds. */
export interface SystemDesignStage {
  id: string
  title: string
  /** Plain text. The scale pressure that forced this stage into existence. Omit on the first stage. */
  trigger?: string
  /** Markdown. What this stage adds, why, and what is about to break next. */
  narrative: string
  /** All nodes visible at this stage — usually a superset of the previous stage's list. */
  nodeIds: string[]
  /** All edges visible at this stage. Both endpoints must be listed in nodeIds. */
  edgeIds: string[]
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
  stages?: SystemDesignStage[]
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
