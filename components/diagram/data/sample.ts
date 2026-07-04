import type { SystemDesign } from '@/types/diagram'

export const sampleArchitecture: SystemDesign = {
  version: '1.0',
  title: 'E-Commerce Microservices',
  description: 'Cloud-native e-commerce platform on AWS',
  nodes: [
    { id: 'mobile-app', type: 'client', label: 'Mobile App', x: 40, y: 260, icon: '📱' },
    { id: 'web-browser', type: 'client', label: 'Web Browser', x: 40, y: 370, icon: '🌐' },

    { id: 'dns', type: 'dns', label: 'Route 53', x: 200, y: 315, icon: '🔗' },
    { id: 'cdn', type: 'cdn', label: 'CloudFront', x: 350, y: 315, icon: '🌍', description: 'CDN & Edge Caching' },
    { id: 'waf', type: 'firewall', label: 'WAF', x: 500, y: 315, icon: '🛡️', description: 'Web Application Firewall' },
    { id: 'alb', type: 'load-balancer', label: 'ALB', x: 680, y: 315, icon: '⚖️', description: 'Application LB' },
    { id: 'api-gateway', type: 'api-gateway', label: 'API Gateway', x: 880, y: 315, icon: '🚪', description: 'REST / GraphQL' },

    { id: 'user-svc', type: 'service', label: 'User Service', x: 1110, y: 150, icon: '👤', description: 'Auth & Profiles' },
    { id: 'product-svc', type: 'service', label: 'Product Service', x: 1110, y: 315, icon: '📦', description: 'Catalog & Inventory' },
    { id: 'order-svc', type: 'service', label: 'Order Service', x: 1110, y: 480, icon: '📋', description: 'Order Management' },
    { id: 'payment-svc', type: 'service', label: 'Payment Service', x: 1380, y: 480, icon: '💳', description: 'Payment Processing' },
    { id: 'notification-svc', type: 'service', label: 'Notification Svc', x: 1380, y: 650, icon: '📧', description: 'Email & Push' },

    { id: 'user-db', type: 'database', label: 'User DB (PgSQL)', x: 1380, y: 150, icon: '🗄️' },
    { id: 'user-db-ro', type: 'database', label: 'User DB Read Replica', x: 1580, y: 150, icon: '🗄️' },
    { id: 'product-db', type: 'database', label: 'Product DB (PgSQL)', x: 1380, y: 315, icon: '🗄️' },
    { id: 'order-db', type: 'database', label: 'Order DB (Sharded)', x: 1380, y: 480, icon: '🗄️' },

    { id: 'redis', type: 'cache', label: 'Redis Cluster', x: 1110, y: 650, icon: '⚡', description: 'Session & Cache' },
    { id: 'queue', type: 'queue', label: 'SQS / Kafka', x: 1580, y: 650, icon: '📨', description: 'Message Broker' },
    { id: 'search', type: 'search', label: 'Elasticsearch', x: 1580, y: 315, icon: '🔍', description: 'Full-Text Search' },
    { id: 's3', type: 'storage', label: 'S3 Buckets', x: 1110, y: 800, icon: '☁️', description: 'Static Assets' },

    { id: 'sendgrid', type: 'external', label: 'SendGrid', x: 1780, y: 650, icon: '📤' },
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
      children: [
        'cdn', 'waf', 'alb', 'api-gateway',
        'user-svc', 'product-svc', 'order-svc', 'payment-svc', 'notification-svc',
        'user-db', 'user-db-ro', 'product-db', 'order-db',
        'redis', 'queue', 'search', 's3',
      ],
      style: 'dashed',
    },
    {
      id: 'data-tier',
      label: 'Data Tier',
      children: ['user-db', 'user-db-ro', 'product-db', 'order-db', 'redis', 'search', 's3'],
      style: 'dashed',
      color: '#6366f1',
    },
  ],
}
