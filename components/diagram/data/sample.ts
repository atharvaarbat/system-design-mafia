import type { SystemDesign } from '@/types/diagram'

export const sampleArchitecture: SystemDesign = {
  version: '1.0',
  title: 'E-Commerce Microservices',
  description: 'Cloud-native e-commerce platform on AWS',

  nodes: [
    // ── Clients ─────────────────────────────────────────
    { id: 'mobile-app', kind: 'mobile-app', name: 'Mobile App', x: 48, y: 240 },
    { id: 'web-browser', kind: 'browser', name: 'Web Browser', x: 48, y: 480 },

    // ── Edge Layer ──────────────────────────────────────
    { id: 'dns', kind: 'dns', name: 'Route 53', x: 336, y: 360 },
    { id: 'cdn', kind: 'cdn', name: 'CloudFront', x: 600, y: 360, description: 'CDN & Edge Caching' },
    { id: 'waf', kind: 'firewall', name: 'WAF', x: 864, y: 360, description: 'Web Application Firewall' },
    { id: 'alb', kind: 'load-balancer', name: 'ALB', x: 1128, y: 360, description: 'Application LB' },
    {
      id: 'api-gateway',
      kind: 'api-gateway',
      name: 'API Gateway',
      x: 1392,
      y: 360,
      description: 'REST / GraphQL',
      group: 'aws-cloud',
    },

    // ── Services ────────────────────────────────────────
    {
      id: 'user-svc',
      kind: 'rest-api',
      name: 'User Service',
      x: 1680,
      y: 48,
      description: 'Auth & Profiles',
      group: 'aws-cloud',
    },
    {
      id: 'product-svc',
      kind: 'rest-api',
      name: 'Product Service',
      x: 1680,
      y: 360,
      description: 'Catalog & Inventory',
      group: 'aws-cloud',
    },
    {
      id: 'order-svc',
      kind: 'rest-api',
      name: 'Order Service',
      x: 1680,
      y: 672,
      description: 'Order Management',
      group: 'aws-cloud',
    },
    {
      id: 'payment-svc',
      kind: 'rest-api',
      name: 'Payment Service',
      x: 1680,
      y: 984,
      description: 'Payment Processing',
      group: 'aws-cloud',
    },
    {
      id: 'notification-svc',
      kind: 'worker-service',
      name: 'Notification Svc',
      x: 2256,
      y: 1200,
      description: 'Email & Push',
      group: 'aws-cloud',
    },

    // ── Databases & Infrastructure ──────────────────────
    {
      id: 'user-db',
      kind: 'postgres',
      name: 'User DB',
      x: 1968,
      y: 48,
      group: 'data-tier',
    },
    {
      id: 'user-db-ro',
      kind: 'postgres',
      name: 'User DB Read Replica',
      x: 2256,
      y: 48,
      group: 'data-tier',
    },
    {
      id: 'product-db',
      kind: 'postgres',
      name: 'Product DB',
      x: 1968,
      y: 360,
      group: 'data-tier',
    },
    {
      id: 'order-db',
      kind: 'dynamodb',
      name: 'Order DB (Sharded)',
      x: 1968,
      y: 672,
      group: 'data-tier',
    },
    {
      id: 'redis',
      kind: 'redis',
      name: 'Redis Cluster',
      x: 1968,
      y: 1200,
      description: 'Session & Cache',
      group: 'data-tier',
    },
    {
      id: 'queue',
      kind: 'kafka',
      name: 'Event Bus',
      x: 1968,
      y: 984,
      description: 'Message Broker',
      group: 'aws-cloud',
    },
    {
      id: 'search',
      kind: 'elasticsearch',
      name: 'Elasticsearch',
      x: 2256,
      y: 360,
      description: 'Full-Text Search',
      group: 'data-tier',
    },
    {
      id: 's3',
      kind: 's3',
      name: 'S3 Buckets',
      x: 1968,
      y: 1368,
      description: 'Static Assets',
      group: 'data-tier',
    },
    {
      id: 'sendgrid',
      kind: 'email-provider',
      name: 'SendGrid',
      x: 2544,
      y: 1200,
    },
  ],

  edges: [
    // ── Clients → DNS ─────────────────────────────────
    { id: 'e-mobile-dns', source: 'mobile-app', target: 'dns', sourceHandle: 'right-source', targetHandle: 'left-target', protocol: 'https', label: 'HTTPS' },
    { id: 'e-web-dns', source: 'web-browser', target: 'dns', sourceHandle: 'right-source', targetHandle: 'left-target', protocol: 'https', label: 'HTTPS' },

    // ── Edge chain ────────────────────────────────────
    { id: 'e-dns-cdn', source: 'dns', target: 'cdn', sourceHandle: 'right-source', targetHandle: 'left-target', protocol: 'https' },
    { id: 'e-cdn-waf', source: 'cdn', target: 'waf', sourceHandle: 'right-source', targetHandle: 'left-target', protocol: 'https' },
    { id: 'e-waf-alb', source: 'waf', target: 'alb', sourceHandle: 'right-source', targetHandle: 'left-target', protocol: 'https' },
    { id: 'e-alb-gw', source: 'alb', target: 'api-gateway', sourceHandle: 'right-source', targetHandle: 'left-target', protocol: 'https' },

    // ── API Gateway → Services ────────────────────────
    { id: 'e-gw-user', source: 'api-gateway', target: 'user-svc', sourceHandle: 'right-source', targetHandle: 'left-target', protocol: 'grpc', animated: true, label: 'gRPC' },
    { id: 'e-gw-product', source: 'api-gateway', target: 'product-svc', sourceHandle: 'right-source', targetHandle: 'left-target', protocol: 'grpc', animated: true, label: 'gRPC' },
    { id: 'e-gw-order', source: 'api-gateway', target: 'order-svc', sourceHandle: 'right-source', targetHandle: 'left-target', protocol: 'grpc', animated: true, label: 'gRPC' },

    // ── Services → Databases ──────────────────────────
    { id: 'e-user-db', source: 'user-svc', target: 'user-db', sourceHandle: 'right-source', targetHandle: 'left-target', style: 'dashed', protocol: 'database', label: 'SQL' },
    { id: 'e-user-ro', source: 'user-svc', target: 'user-db-ro', sourceHandle: 'right-source', targetHandle: 'left-target', style: 'dashed', protocol: 'database', label: 'Read' },
    { id: 'e-product-db', source: 'product-svc', target: 'product-db', sourceHandle: 'right-source', targetHandle: 'left-target', style: 'dashed', protocol: 'database', label: 'SQL' },
    { id: 'e-order-db', source: 'order-svc', target: 'order-db', sourceHandle: 'right-source', targetHandle: 'left-target', style: 'dashed', protocol: 'database', label: 'SQL' },

    // ── Services → Redis (cache) ──────────────────────
    { id: 'e-user-cache', source: 'user-svc', target: 'redis', sourceHandle: 'right-source', targetHandle: 'left-target', style: 'dotted', protocol: 'internal' },
    { id: 'e-product-cache', source: 'product-svc', target: 'redis', sourceHandle: 'right-source', targetHandle: 'left-target', style: 'dotted', protocol: 'internal' },
    { id: 'e-order-cache', source: 'order-svc', target: 'redis', sourceHandle: 'right-source', targetHandle: 'left-target', style: 'dotted', protocol: 'internal' },

    // ── Event Bus flow ────────────────────────────────
    { id: 'e-order-queue', source: 'order-svc', target: 'queue', sourceHandle: 'right-source', targetHandle: 'left-target', protocol: 'message', animated: true, label: 'Order Events' },
    { id: 'e-payment-queue', source: 'payment-svc', target: 'queue', sourceHandle: 'right-source', targetHandle: 'left-target', protocol: 'message', animated: true, label: 'Payment Events' },
    { id: 'e-queue-notif', source: 'queue', target: 'notification-svc', sourceHandle: 'right-source', targetHandle: 'left-target', protocol: 'message', animated: true },

    // ── Search & Assets ───────────────────────────────
    { id: 'e-product-search', source: 'product-svc', target: 'search', sourceHandle: 'right-source', targetHandle: 'left-target', style: 'dashed', protocol: 'internal' },
    { id: 'e-product-s3', source: 'product-svc', target: 's3', sourceHandle: 'right-source', targetHandle: 'left-target', style: 'dashed', protocol: 'internal' },
    { id: 'e-cdn-s3', source: 'cdn', target: 's3', sourceHandle: 'right-source', targetHandle: 'left-target', style: 'dashed', protocol: 'https' },

    // ── Notifications → SendGrid ──────────────────────
    { id: 'e-notif-sendgrid', source: 'notification-svc', target: 'sendgrid', sourceHandle: 'right-source', targetHandle: 'left-target', style: 'dotted', protocol: 'https' },

    // ── Internal ──────────────────────────────────────
    { id: 'e-payment-order', source: 'payment-svc', target: 'order-svc', sourceHandle: 'right-source', targetHandle: 'left-target', style: 'dashed', protocol: 'internal' },
  ],

  groups: [
    {
      id: 'aws-cloud',
      label: 'AWS Cloud',
      style: 'dashed',
    },
    {
      id: 'data-tier',
      label: 'Data Tier',
      style: 'dashed',
      color: '#6366f1',
      parent: 'aws-cloud',
    },
  ],
}
