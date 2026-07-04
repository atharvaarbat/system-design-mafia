import type { SystemDesign } from '@/types/diagram'

export const sampleArchitecture: SystemDesign = {
  version: '1.0',
  title: 'E-Commerce Microservices',
  description: 'Cloud-native e-commerce platform on AWS',

  nodes: [
    // Clients
    { id: 'mobile-app', kind: 'mobile-app', name: 'Mobile App', x: 60, y: 240 },
    { id: 'web-browser', kind: 'browser', name: 'Web Browser', x: 60, y: 420 },

    // Edge Layer
    { id: 'dns', kind: 'dns', name: 'Route 53', x: 280, y: 330 },

    { id: 'cdn', kind: 'cdn', name: 'CloudFront', x: 540, y: 330, description: 'CDN & Edge Caching' },

    { id: 'waf', kind: 'firewall', name: 'WAF', x: 800, y: 330, description: 'Web Application Firewall' },

    { id: 'alb', kind: 'load-balancer', name: 'ALB', x: 1080, y: 330, description: 'Application LB' },

    {
      id: 'api-gateway',
      kind: 'api-gateway',
      name: 'API Gateway',
      x: 1380,
      y: 330,
      description: 'REST / GraphQL',
      group: 'aws-cloud',
    },

    // Services
    {
      id: 'user-svc',
      kind: 'rest-api',
      name: 'User Service',
      x: 1760,
      y: 120,
      description: 'Auth & Profiles',
      group: 'aws-cloud',
    },

    {
      id: 'product-svc',
      kind: 'rest-api',
      name: 'Product Service',
      x: 1760,
      y: 330,
      description: 'Catalog & Inventory',
      group: 'aws-cloud',
    },

    {
      id: 'order-svc',
      kind: 'rest-api',
      name: 'Order Service',
      x: 1760,
      y: 540,
      description: 'Order Management',
      group: 'aws-cloud',
    },

    {
      id: 'payment-svc',
      kind: 'rest-api',
      name: 'Payment Service',
      x: 2140,
      y: 540,
      description: 'Payment Processing',
      group: 'aws-cloud',
    },

    {
      id: 'notification-svc',
      kind: 'worker-service',
      name: 'Notification Svc',
      x: 2140,
      y: 760,
      description: 'Email & Push',
      group: 'aws-cloud',
    },

    // Databases
    {
      id: 'user-db',
      kind: 'postgres',
      name: 'User DB',
      x: 2520,
      y: 120,
      group: 'data-tier',
    },

    {
      id: 'user-db-ro',
      kind: 'postgres',
      name: 'User DB Read Replica',
      x: 2860,
      y: 120,
      group: 'data-tier',
    },

    {
      id: 'product-db',
      kind: 'postgres',
      name: 'Product DB',
      x: 2520,
      y: 330,
      group: 'data-tier',
    },

    {
      id: 'order-db',
      kind: 'dynamodb',
      name: 'Order DB (Sharded)',
      x: 2520,
      y: 540,
      group: 'data-tier',
    },

    // Shared Infrastructure
    {
      id: 'redis',
      kind: 'redis',
      name: 'Redis Cluster',
      x: 1760,
      y: 980,
      description: 'Session & Cache',
      group: 'data-tier',
    },

    {
      id: 'queue',
      kind: 'kafka',
      name: 'Event Bus',
      x: 2520,
      y: 980,
      description: 'Message Broker',
      group: 'aws-cloud',
    },

    {
      id: 'search',
      kind: 'elasticsearch',
      name: 'Elasticsearch',
      x: 2860,
      y: 330,
      description: 'Full-Text Search',
      group: 'data-tier',
    },

    {
      id: 's3',
      kind: 's3',
      name: 'S3 Buckets',
      x: 2140,
      y: 1180,
      description: 'Static Assets',
      group: 'data-tier',
    },

    {
      id: 'sendgrid',
      kind: 'email-provider',
      name: 'SendGrid',
      x: 2860,
      y: 760,
    },
  ],

  edges: [
    { id: 'e-mobile-dns', source: 'mobile-app', target: 'dns', protocol: 'https', label: 'HTTPS' },
    { id: 'e-web-dns', source: 'web-browser', target: 'dns', protocol: 'https', label: 'HTTPS' },

    { id: 'e-dns-cdn', source: 'dns', target: 'cdn', protocol: 'https' },
    { id: 'e-cdn-waf', source: 'cdn', target: 'waf', protocol: 'https' },
    { id: 'e-waf-alb', source: 'waf', target: 'alb', protocol: 'https' },
    { id: 'e-alb-gw', source: 'alb', target: 'api-gateway', protocol: 'https' },

    { id: 'e-gw-user', source: 'api-gateway', target: 'user-svc', protocol: 'grpc', animated: true, label: 'gRPC' },
    { id: 'e-gw-product', source: 'api-gateway', target: 'product-svc', protocol: 'grpc', animated: true, label: 'gRPC' },
    { id: 'e-gw-order', source: 'api-gateway', target: 'order-svc', protocol: 'grpc', animated: true, label: 'gRPC' },

    { id: 'e-user-db', source: 'user-svc', target: 'user-db', style: 'dashed', protocol: 'database', label: 'SQL' },
    { id: 'e-user-ro', source: 'user-svc', target: 'user-db-ro', style: 'dashed', protocol: 'database', label: 'Read' },
    { id: 'e-product-db', source: 'product-svc', target: 'product-db', style: 'dashed', protocol: 'database', label: 'SQL' },
    { id: 'e-order-db', source: 'order-svc', target: 'order-db', style: 'dashed', protocol: 'database', label: 'SQL' },

    { id: 'e-user-cache', source: 'user-svc', target: 'redis', style: 'dotted', protocol: 'internal' },
    { id: 'e-product-cache', source: 'product-svc', target: 'redis', style: 'dotted', protocol: 'internal' },
    { id: 'e-order-cache', source: 'order-svc', target: 'redis', style: 'dotted', protocol: 'internal' },

    { id: 'e-order-queue', source: 'order-svc', target: 'queue', protocol: 'message', animated: true, label: 'Order Events' },
    { id: 'e-payment-queue', source: 'payment-svc', target: 'queue', protocol: 'message', animated: true, label: 'Payment Events' },
    { id: 'e-queue-notif', source: 'queue', target: 'notification-svc', protocol: 'message', animated: true },

    { id: 'e-product-search', source: 'product-svc', target: 'search', style: 'dashed', protocol: 'internal' },
    { id: 'e-product-s3', source: 'product-svc', target: 's3', style: 'dashed', protocol: 'internal' },
    { id: 'e-cdn-s3', source: 'cdn', target: 's3', style: 'dashed', protocol: 'https' },

    { id: 'e-notif-sendgrid', source: 'notification-svc', target: 'sendgrid', style: 'dotted', protocol: 'https' },
    { id: 'e-payment-order', source: 'payment-svc', target: 'order-svc', style: 'dashed', protocol: 'internal' },
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