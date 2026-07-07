import {
  Activity,
  Archive,
  Boxes,
  Cloud,
  Container,
  Cpu,
  Database,
  ExternalLink,
  Globe,
  HardDrive,
  KeyRound,
  Layers,
  Mail,
  MessageSquare,
  Monitor,
  Network,
  Radio,
  Router,
  Search,
  Send,
  Server,
  ShieldAlert,
  Smartphone,
  Waypoints,
  Webhook,
  Zap,
  type LucideIcon,
} from 'lucide-react'

export const CATEGORIES = [
  'client',
  'network',
  'compute',
  'database',
  'cache',
  'queue',
  'storage',
  'external',
] as const

export type NodeCategory = (typeof CATEGORIES)[number]

export const CATEGORY_SHAPE_PATH: Record<NodeCategory, string> = {
  client: '/diagram/shapes/client.svg',
  network: '/diagram/shapes/network.svg',
  compute: '/diagram/shapes/compute.svg',
  database: '/diagram/shapes/database.svg',
  cache: '/diagram/shapes/cache.svg',
  queue: '/diagram/shapes/queue.svg',
  storage: '/diagram/shapes/storage.svg',
  external: '/diagram/shapes/external.svg',
}

export interface NodeKindDefinition {
  label: string
  category: NodeCategory
  icon: LucideIcon
  color: string
  brandLogo?: string
}

export const NODE_REGISTRY = {
  // client
  'browser': { label: 'Browser', category: 'client', icon: Globe, color: '#64748b' },
  'mobile-app': { label: 'Mobile App', category: 'client', icon: Smartphone, color: '#64748b' },
  'desktop-app': { label: 'Desktop App', category: 'client', icon: Monitor, color: '#64748b' },
  'generic-client': { label: 'Client', category: 'client', icon: Monitor, color: '#94a3b8' },

  // network
  'dns': { label: 'DNS', category: 'network', icon: Router, color: '#6366f1' },
  'cdn': { label: 'CDN', category: 'network', icon: Cloud, color: '#f97316' },
  'load-balancer': { label: 'Load Balancer', category: 'network', icon: Waypoints, color: '#22c55e' },
  'api-gateway': { label: 'API Gateway', category: 'network', icon: Webhook, color: '#8b5cf6' },
  'firewall': { label: 'Firewall / WAF', category: 'network', icon: ShieldAlert, color: '#ef4444' },
  'generic-network': { label: 'Network', category: 'network', icon: Network, color: '#94a3b8' },

  // compute
  'rest-api': { label: 'REST API', category: 'compute', icon: Server, color: '#3b82f6' },
  'graphql-api': { label: 'GraphQL API', category: 'compute', icon: Server, color: '#e535ab' },
  'grpc-service': { label: 'gRPC Service', category: 'compute', icon: Server, color: '#4b5563' },
  'worker-service': { label: 'Worker', category: 'compute', icon: Cpu, color: '#6366f1' },
  'lambda-function': { label: 'Function (Serverless)', category: 'compute', icon: Zap, color: '#f59e0b' },
  'container': { label: 'Container', category: 'compute', icon: Container, color: '#14b8a6' },
  'kubernetes': { label: 'Kubernetes', category: 'compute', icon: Boxes, color: '#326ce5' },
  'auth-service': { label: 'Auth Service', category: 'compute', icon: KeyRound, color: '#06b6d4' },
  'monitoring-service': { label: 'Monitoring', category: 'compute', icon: Activity, color: '#f43f5e' },
  'generic-service': { label: 'Service', category: 'compute', icon: Server, color: '#3b82f6' },

  // database
  'postgres': { label: 'PostgreSQL', category: 'database', icon: Database, color: '#152e42', brandLogo: '/diagram/logo/postgres.svg' },
  'mysql': { label: 'MySQL', category: 'database', icon: Database, color: '#00758f' },
  'mongodb': { label: 'MongoDB', category: 'database', icon: Database, color: '#47a248' },
  'dynamodb': { label: 'DynamoDB', category: 'database', icon: Database, color: '#4053d6', brandLogo: '/diagram/logo/dynamodb.svg' },
  'cassandra': { label: 'Cassandra', category: 'database', icon: Database, color: '#1287b1' },
  'elasticsearch': { label: 'Elasticsearch', category: 'database', icon: Search, color: '#f5a623' },
  'generic-database': { label: 'Database', category: 'database', icon: Database, color: '#10b981' },

  // cache
  'redis': { label: 'Redis', category: 'cache', icon: Zap, color: '#dc382d', brandLogo: '/diagram/logo/redis.svg' },
  'memcached': { label: 'Memcached', category: 'cache', icon: Zap, color: '#4f9ada' },
  'generic-cache': { label: 'Cache', category: 'cache', icon: Zap, color: '#f59e0b' },

  // queue
  'kafka': { label: 'Kafka', category: 'queue', icon: Layers, color: '#fff', brandLogo: '/diagram/logo/kafka.svg' },
  'rabbitmq': { label: 'RabbitMQ', category: 'queue', icon: Radio, color: '#ff6600' },
  'sqs': { label: 'SQS', category: 'queue', icon: Send, color: '#ff4f8b' },
  'sns': { label: 'SNS', category: 'queue', icon: Radio, color: '#e0417a' },
  'generic-queue': { label: 'Message Queue', category: 'queue', icon: MessageSquare, color: '#a855f7' },

  // storage
  's3': { label: 'Object Storage', category: 'storage', icon: Archive, color: '#e8734a', brandLogo: '/diagram/logo/aws-s3.svg' },
  'blob-storage': { label: 'Blob Storage', category: 'storage', icon: HardDrive, color: '#0078d4' },
  'generic-storage': { label: 'Storage', category: 'storage', icon: Archive, color: '#06b6d4' },

  // external
  'external-api': { label: 'External API', category: 'external', icon: ExternalLink, color: '#94a3b8' },
  'email-provider': { label: 'Email Provider', category: 'external', icon: Mail, color: '#64748b', brandLogo: '/diagram/logo/sendgrid.svg' },
  'payment-provider': { label: 'Payment Provider', category: 'external', icon: ExternalLink, color: '#635bff' },
  'generic-external': { label: 'External Service', category: 'external', icon: ExternalLink, color: '#94a3b8' },
} as const satisfies Record<string, NodeKindDefinition>

export type NodeKind = keyof typeof NODE_REGISTRY

export const UNKNOWN_KIND_DEFINITION: NodeKindDefinition = {
  label: 'Unknown',
  category: 'compute',
  icon: Server,
  color: '#94a3b8',
}

export function resolveNodeKind(kind: string): NodeKindDefinition {
  const entry = (NODE_REGISTRY as Record<string, NodeKindDefinition>)[kind]
  if (entry) return entry

  if (process.env.NODE_ENV !== 'production') {
    console.warn(`[diagram] Unknown node kind "${kind}", falling back to a generic badge.`)
  }
  return UNKNOWN_KIND_DEFINITION
}
