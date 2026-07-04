export type ArchitectureNodeType =
  | 'client'
  | 'cdn'
  | 'load-balancer'
  | 'api-gateway'
  | 'service'
  | 'database'
  | 'cache'
  | 'queue'
  | 'storage'
  | 'function'
  | 'dns'
  | 'firewall'
  | 'container'
  | 'orchestrator'
  | 'monitoring'
  | 'auth'
  | 'search'
  | 'analytics'
  | 'external';

export type NodeStatus = 'active' | 'warning' | 'error' | 'inactive';

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
  | 'internal';

export interface ArchitectureNode {
  id: string;
  type: ArchitectureNodeType;
  label: string;
  description?: string;
  x: number;
  y: number;
  icon?: string;
  variant?: 'default' | 'outlined' | 'filled';
  accent?: string;
  status?: NodeStatus;
  metadata?: Record<string, string>;
  width?: number;
  height?: number;
}

export interface ArchitectureEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  protocol?: Protocol;
  style?: 'solid' | 'dashed' | 'dotted';
  animated?: boolean;
  width?: number;
  color?: string;
}

export interface ArchitectureGroup {
  id: string;
  label: string;
  description?: string;
  children: string[];
  style?: 'solid' | 'dashed';
  color?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

export interface SystemDesign {
  version: string;
  title: string;
  description?: string;
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
  groups?: ArchitectureGroup[];
  theme?: 'light' | 'dark';
}

export const NODE_COLORS: Record<ArchitectureNodeType, string> = {
  'client': '#64748b',
  'cdn': '#f97316',
  'load-balancer': '#22c55e',
  'api-gateway': '#8b5cf6',
  'service': '#3b82f6',
  'database': '#10b981',
  'cache': '#f59e0b',
  'queue': '#a855f7',
  'storage': '#06b6d4',
  'function': '#ec4899',
  'dns': '#6366f1',
  'firewall': '#ef4444',
  'container': '#14b8a6',
  'orchestrator': '#f97316',
  'monitoring': '#8b5cf6',
  'auth': '#06b6d4',
  'search': '#ec4899',
  'analytics': '#f59e0b',
  'external': '#94a3b8',
};
