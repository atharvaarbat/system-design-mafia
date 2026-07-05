import type { SystemDesign } from '@/types/diagram'

export const sampleArchitecture: SystemDesign = {
  "version": "1.0",
  "title": "E-Commerce Microservices",
  "description": "Cloud-native e-commerce platform on AWS",
  "nodes": [
    {
      "id": "mobile-app",
      "kind": "mobile-app",
      "x": 576,
      "y": 224,
      "name": "Mobile App"
    },
    {
      "id": "web-browser",
      "kind": "browser",
      "x": 576,
      "y": 560,
      "name": "Web Browser"
    },
    {
      "id": "dns",
      "kind": "dns",
      "x": 584,
      "y": 384,
      "name": "Route 53"
    },
    {
      "id": "cdn",
      "kind": "cdn",
      "x": 744,
      "y": 432,
      "name": "CloudFront",
      "description": "CDN & Edge Caching"
    },
    {
      "id": "waf",
      "kind": "firewall",
      "x": 952,
      "y": 352,
      "name": "WAF",
      "description": "Web Application Firewall"
    },
    {
      "id": "alb",
      "kind": "load-balancer",
      "x": 1136,
      "y": 360,
      "name": "ALB",
      "description": "Application LB"
    },
    {
      "id": "api-gateway",
      "kind": "api-gateway",
      "x": 1320,
      "y": 360,
      "name": "API Gateway",
      "description": "REST / GraphQL",
      "group": "aws-cloud"
    },
    {
      "id": "user-svc",
      "kind": "rest-api",
      "x": 1600,
      "y": 80,
      "name": "User Service",
      "description": "Auth & Profiles",
      "group": "aws-cloud"
    },
    {
      "id": "product-svc",
      "kind": "rest-api",
      "x": 1608,
      "y": 360,
      "name": "Product Service",
      "description": "Catalog & Inventory",
      "group": "aws-cloud"
    },
    {
      "id": "order-svc",
      "kind": "rest-api",
      "x": 1608,
      "y": 664,
      "name": "Order Service",
      "description": "Order Management",
      "group": "aws-cloud"
    },
    {
      "id": "payment-svc",
      "kind": "rest-api",
      "x": 1328,
      "y": 824,
      "name": "Payment Service",
      "description": "Payment Processing",
      "group": "aws-cloud"
    },
    {
      "id": "notification-svc",
      "kind": "worker-service",
      "x": 2064,
      "y": 832,
      "name": "Notification Svc",
      "description": "Email & Push",
      "group": "aws-cloud"
    },
    {
      "id": "user-db",
      "kind": "postgres",
      "x": 2080,
      "y": 192,
      "name": "User DB",
      "group": "data-tier"
    },
    {
      "id": "user-db-ro",
      "kind": "postgres",
      "x": 2056,
      "y": 80,
      "name": "User DB Read Replica",
      "group": "data-tier"
    },
    {
      "id": "product-db",
      "kind": "postgres",
      "x": 2072,
      "y": 328,
      "name": "Product DB",
      "group": "data-tier"
    },
    {
      "id": "order-db",
      "kind": "dynamodb",
      "x": 2048,
      "y": 664,
      "name": "Order DB (Sharded)",
      "group": "data-tier"
    },
    {
      "id": "redis",
      "kind": "redis",
      "x": 1912,
      "y": 256,
      "name": "Redis Cluster",
      "description": "Session & Cache",
      "group": "data-tier"
    },
    {
      "id": "queue",
      "kind": "kafka",
      "x": 1912,
      "y": 832,
      "name": "Event Bus",
      "description": "Message Broker",
      "group": "aws-cloud"
    },
    {
      "id": "search",
      "kind": "elasticsearch",
      "x": 2064,
      "y": 424,
      "name": "Elasticsearch",
      "description": "Full-Text Search",
      "group": "data-tier"
    },
    {
      "id": "s3",
      "kind": "s3",
      "x": 2064,
      "y": 544,
      "name": "S3 Buckets",
      "description": "Static Assets",
      "group": "data-tier"
    },
    {
      "id": "sendgrid",
      "kind": "email-provider",
      "x": 2296,
      "y": 840,
      "name": "SendGrid"
    }
  ],
  "edges": [
    {
      "id": "e-dns-cdn",
      "source": "dns",
      "target": "cdn",
      "sourceHandle": "right-source",
      "targetHandle": "left-target",
      "protocol": "https"
    },
    {
      "id": "e-cdn-waf",
      "source": "cdn",
      "target": "waf",
      "sourceHandle": "right-source",
      "targetHandle": "left-target",
      "protocol": "https"
    },
    {
      "id": "e-waf-alb",
      "source": "waf",
      "target": "alb",
      "sourceHandle": "right-source",
      "targetHandle": "left-target",
      "protocol": "https"
    },
    {
      "id": "e-alb-gw",
      "source": "alb",
      "target": "api-gateway",
      "sourceHandle": "right-source",
      "targetHandle": "left-target",
      "protocol": "https"
    },
    {
      "id": "e-gw-user",
      "source": "api-gateway",
      "target": "user-svc",
      "sourceHandle": "right-source",
      "targetHandle": "left-target",
      "label": "gRPC",
      "protocol": "grpc",
      "animated": true
    },
    {
      "id": "e-gw-product",
      "source": "api-gateway",
      "target": "product-svc",
      "sourceHandle": "right-source",
      "targetHandle": "left-target",
      "label": "gRPC",
      "protocol": "grpc",
      "animated": true
    },
    {
      "id": "e-gw-order",
      "source": "api-gateway",
      "target": "order-svc",
      "sourceHandle": "right-source",
      "targetHandle": "left-target",
      "label": "gRPC",
      "protocol": "grpc",
      "animated": true
    },
    {
      "id": "e-user-db",
      "source": "user-svc",
      "target": "user-db",
      "sourceHandle": "right-source",
      "targetHandle": "left-target",
      "label": "SQL",
      "protocol": "database",
      "style": "dashed"
    },
    {
      "id": "e-user-ro",
      "source": "user-svc",
      "target": "user-db-ro",
      "sourceHandle": "right-source",
      "targetHandle": "left-target",
      "label": "Read",
      "protocol": "database",
      "style": "dashed"
    },
    {
      "id": "e-product-db",
      "source": "product-svc",
      "target": "product-db",
      "sourceHandle": "right-source",
      "targetHandle": "left-target",
      "label": "SQL",
      "protocol": "database",
      "style": "dashed"
    },
    {
      "id": "e-order-db",
      "source": "order-svc",
      "target": "order-db",
      "sourceHandle": "right-source",
      "targetHandle": "left-target",
      "label": "SQL",
      "protocol": "database",
      "style": "dashed"
    },
    {
      "id": "e-user-cache",
      "source": "user-svc",
      "target": "redis",
      "sourceHandle": "right-source",
      "targetHandle": "left-target",
      "protocol": "internal",
      "style": "dotted"
    },
    {
      "id": "e-order-cache",
      "source": "order-svc",
      "target": "redis",
      "sourceHandle": "right-source",
      "targetHandle": "left-target",
      "protocol": "internal",
      "style": "dotted"
    },
    {
      "id": "e-order-queue",
      "source": "order-svc",
      "target": "queue",
      "sourceHandle": "right-source",
      "targetHandle": "left-target",
      "label": "Order Events",
      "protocol": "message",
      "animated": true
    },
    {
      "id": "e-payment-queue",
      "source": "payment-svc",
      "target": "queue",
      "sourceHandle": "right-source",
      "targetHandle": "left-target",
      "label": "Payment Events",
      "protocol": "message",
      "animated": true
    },
    {
      "id": "e-queue-notif",
      "source": "queue",
      "target": "notification-svc",
      "sourceHandle": "right-source",
      "targetHandle": "left-target",
      "protocol": "message",
      "animated": true
    },
    {
      "id": "e-cdn-s3",
      "source": "cdn",
      "target": "s3",
      "sourceHandle": "right-source",
      "targetHandle": "left-target",
      "protocol": "https",
      "style": "dashed"
    },
    {
      "id": "e-notif-sendgrid",
      "source": "notification-svc",
      "target": "sendgrid",
      "sourceHandle": "right-source",
      "targetHandle": "left-target",
      "protocol": "https",
      "style": "dotted"
    },
    {
      "id": "xy-edge__mobile-appbottom-source-dnstop-target",
      "source": "mobile-app",
      "target": "dns",
      "sourceHandle": "bottom-source",
      "targetHandle": "top-target",
      "label": "HTTPS",
      "protocol": "https"
    },
    {
      "id": "xy-edge__web-browsertop-source-dnsbottom-target",
      "source": "web-browser",
      "target": "dns",
      "sourceHandle": "top-source",
      "targetHandle": "bottom-target",
      "label": "HTTPS",
      "protocol": "https"
    },
    {
      "id": "xy-edge__payment-svctop-source-order-svcleft-target",
      "source": "payment-svc",
      "target": "order-svc",
      "sourceHandle": "top-source",
      "targetHandle": "left-target",
      "protocol": "internal"
    },
    {
      "id": "xy-edge__product-svcbottom-source-s3left-target",
      "source": "product-svc",
      "target": "s3",
      "sourceHandle": "bottom-source",
      "targetHandle": "left-target",
      "protocol": "internal",
      "style": "dashed"
    },
    {
      "id": "xy-edge__product-svctop-source-redisleft-target",
      "source": "product-svc",
      "target": "redis",
      "sourceHandle": "top-source",
      "targetHandle": "left-target",
      "protocol": "internal",
      "style": "dotted"
    },
    {
      "id": "xy-edge__product-svcright-source-searchleft-target",
      "source": "product-svc",
      "target": "search",
      "sourceHandle": "right-source",
      "targetHandle": "left-target",
      "protocol": "internal",
      "style": "dashed"
    }
  ],
  "groups": [
    {
      "id": "aws-cloud",
      "label": "AWS Cloud",
      "style": "dashed",
      "width": 1176,
      "height": 1030,
      "x": 1280,
      "y": -30
    },
    {
      "id": "data-tier",
      "label": "Data Tier",
      "color": "#6366f1",
      "style": "dashed",
      "parent": "aws-cloud",
      "width": 384,
      "height": 928,
      "x": 1864,
      "y": 30
    }
  ]
}