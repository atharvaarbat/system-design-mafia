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

export interface SystemDesign {
  version: string
  title: string
  description?: string
  summary?: string
  nodes: SystemDesignNode[]
  edges: SystemDesignEdge[]
  groups?: SystemDesignGroup[]
  theme?: 'light' | 'dark'
}
