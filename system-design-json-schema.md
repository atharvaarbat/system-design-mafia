# System Design JSON Schema — AI Agent Guide

This document defines the JSON schema used to describe system architecture diagrams. An AI agent should generate JSON conforming to `SystemDesign`, which is then rendered into an interactive React Flow canvas.

---

## 1. Top-Level Structure

```jsonc
{
  "version": "1.0",          // required, schema version
  "title": "My Architecture", // required, diagram title
  "description": "...",      // optional, subtitle
  "summary": "...",          // optional, rich-text markdown deep-dive rendered below the diagram as "Architecture Breakdown"
  "theme": "light",          // optional: "light" | "dark"
  "nodes": [ /* ... */ ],    // required, array of SystemDesignNode
  "edges": [ /* ... */ ],    // required, array of SystemDesignEdge
  "groups": [ /* ... */ ]    // optional, array of SystemDesignGroup
}
```

---

## 2. Node (`SystemDesignNode`)

```jsonc
{
  "id": "user-svc",         // required, unique string ID
  "kind": "rest-api",       // required, one of 30+ registered kinds (see §2a)
  "x": 1680,                // required, absolute X position in the canvas
  "y": 48,                  // required, absolute Y position in the canvas
  "name": "User Service",   // optional, display label (falls back to kind label)
  "description": "Auth & Profiles", // optional, subtitle shown below name
  "details": "### Responsibilities\n\n- Auth\n- Profiles", // optional, markdown body shown in the expanded card
  "status": "active",       // optional: "active" | "warning" | "error" | "inactive"
  "group": "aws-cloud"      // optional, ID of the parent SystemDesignGroup
}
```

### 2a. `kind` Registry

Each node must have a `kind` from the `NODE_REGISTRY`. Every kind maps to a **category**, **icon**, and **color** used during rendering.

#### Client
| kind | label |
|---|---|
| `browser` | Browser |
| `mobile-app` | Mobile App |
| `desktop-app` | Desktop App |
| `generic-client` | Client |

#### Network
| kind | label |
|---|---|
| `dns` | DNS |
| `cdn` | CDN |
| `load-balancer` | Load Balancer |
| `api-gateway` | API Gateway |
| `firewall` | Firewall / WAF |
| `generic-network` | Network |

#### Compute
| kind | label |
|---|---|
| `rest-api` | REST API |
| `graphql-api` | GraphQL API |
| `grpc-service` | gRPC Service |
| `worker-service` | Worker |
| `lambda-function` | Function (Serverless) |
| `container` | Container |
| `kubernetes` | Kubernetes |
| `auth-service` | Auth Service |
| `monitoring-service` | Monitoring |
| `generic-service` | Service |

#### Database
| kind | label |
|---|---|
| `postgres` | PostgreSQL |
| `mysql` | MySQL |
| `mongodb` | MongoDB |
| `dynamodb` | DynamoDB |
| `cassandra` | Cassandra |
| `elasticsearch` | Elasticsearch |
| `generic-database` | Database |

#### Cache
| kind | label |
|---|---|
| `redis` | Redis |
| `memcached` | Memcached |
| `generic-cache` | Cache |

#### Queue
| kind | label |
|---|---|
| `kafka` | Kafka |
| `rabbitmq` | RabbitMQ |
| `sqs` | SQS |
| `sns` | SNS |
| `generic-queue` | Message Queue |

#### Storage
| kind | label |
|---|---|
| `s3` | Object Storage |
| `blob-storage` | Blob Storage |
| `generic-storage` | Storage |

#### External
| kind | label |
|---|---|
| `external-api` | External API |
| `email-provider` | Email Provider |
| `payment-provider` | Payment Provider |
| `generic-external` | External Service |

---

## 3. Edge (`SystemDesignEdge`)

```jsonc
{
  "id": "e-gw-user",         // required, unique string ID
  "source": "api-gateway",   // required, source node ID
  "target": "user-svc",      // required, target node ID
  "sourceHandle": "right-source", // recommended — see §6
  "targetHandle": "left-target",  // recommended — see §6
  "label": "gRPC",           // optional, text shown on the edge
  "protocol": "grpc",        // optional: see §3a
  "style": "solid",          // optional: "solid" | "dashed" | "dotted"
  "animated": true,          // optional, animated dashed flow
  "width": 2.5,              // optional, stroke width in px
  "color": "#ef4444"         // optional, stroke color (any CSS color string)
}
```

### 3a. `protocol` Values

| protocol | Use case |
|---|---|
| `http` | HTTP communication |
| `https` | HTTPS communication |
| `grpc` | gRPC-based inter-service calls |
| `websocket` | Real-time / bidirectional |
| `tcp` | Raw TCP connections |
| `udp` | UDP-based communication |
| `database` | SQL / database queries |
| `message` | Message queue / event bus |
| `event` | Event-driven communication |
| `internal` | Internal / private network |

The `protocol` field is only displayed as a visual hint on the edge. It does not change edge rendering beyond being accessible as metadata.

---

## 4. Group (`SystemDesignGroup`)

Groups are **boundary boxes** that visually contain nodes and child groups. They can be auto-sized (omit `x`/`y`/`width`/`height`) or explicitly positioned.

```jsonc
{
  "id": "data-tier",          // required, unique string ID
  "label": "Data Tier",       // required, shown on the group header badge
  "description": "...",       // optional, not currently rendered in UI
  "color": "#6366f1",         // optional, accent color for the border
  "style": "dashed",          // optional: "solid" | "dashed" (default: "dashed")
  "parent": "aws-cloud",      // optional, ID of a parent group (for nesting)
  // Explicit bounds (optional — omit for auto-layout):
  "x": 1912,
  "y": 8,
  "width": 984,
  "height": 1516
}
```

### Auto-Layout vs Explicit Bounds

**If you supply `x`, `y`, `width`, `height`:** the group is placed at that exact position and size. The transform layer uses these values as-is.

**If you omit bounds:** the transform layer computes the group's bounding box by unioning all its direct child nodes and nested child groups, adding 40px padding on all sides. A group with no children will be invisible (skipped).

Groups are rendered on a lower `zIndex` behind nodes. The `orderGroupsByDepth` function ensures parent groups render before child groups (so children appear above).

---

## 5. Positioning Guide

### 5a. Node Footprint

Each node occupies approximately **120 × 120** pixels on the canvas. Use this as your grid unit when computing layouts.

Actual rendered dimensions may vary slightly because nodes use intrinsic sizing (flex layout around the icon + label). The transform layer uses fallback dimensions of **200 × 84** for bounding-box calculations when a node has no explicit width/height.

### 5b. Coordinate System

The canvas is a **2D Cartesian plane** where:
- **X increases → to the right**
- **Y increases ↓ downward**

All coordinates in the JSON (`SystemDesignNode.x`, `SystemDesignNode.y`, `SystemDesignGroup.x`, `SystemDesignGroup.y`) are **absolute canvas coordinates** — they represent the node's position relative to the top-left origin of the entire canvas.

### 5c. Positioning Inside Groups

When a node belongs to a group (`"group": "some-group-id"`), you still specify **absolute coordinates** in the JSON. The transform layer (`systemDesignToFlow()`) automatically converts these to **relative coordinates** for React Flow by subtracting the group's bounding box position.

For example:
```jsonc
{
  "nodes": [
    { "id": "svc", "kind": "rest-api", "x": 400, "y": 300, "group": "my-group" }
  ],
  "groups": [
    { "id": "my-group", "label": "Group", "x": 200, "y": 200, "width": 400, "height": 300 }
  ]
}
```
The node at absolute (400, 300) will be rendered at relative (200, 100) inside the group — i.e. `400 - 200 = 200`, `300 - 200 = 100`. The 40px padding applied during auto-layout may shift this.

**Always write absolute positions in the JSON.** The layer handles the math.

### 5d. Spacing Guidelines

- **Horizontal spacing between nodes:** 120–160px (center-to-center)
- **Vertical spacing between nodes:** 120–160px (center-to-center)
- **Group padding from its children:** 40px on all sides (applied automatically if using auto-layout)
- **Group-to-group gap:** 80px minimum between bounding boxes

### 5e. Layout Flow Convention

For system design diagrams, use a **left-to-right (L→R)** flow:
1. **Clients** — leftmost
2. **Network layer** (DNS, CDN, WAF, LB) — left-center
3. **API Gateway** — center
4. **Compute / Services** — center-right
5. **Data tier** (databases, caches, queues) — rightmost
6. **External services** — far right

Vertically, layer independent concerns (e.g., User Service above, Order Service below).

---

## 6. Handle Conventions

Each architecture node has **8 connection handles** (4 sides × 2 types):

| Handle ID | Position | Type |
|---|---|---|
| `left-target` | Left | Target (incoming) |
| `left-source` | Left | Source (outgoing) |
| `top-target` | Top | Target |
| `top-source` | Top | Source |
| `right-target` | Right | Target |
| `right-source` | Right | Source |
| `bottom-target` | Bottom | Target |
| `bottom-source` | Bottom | Source |

### Edge Handle Best Practices

When defining edges, always specify `sourceHandle` and `targetHandle` to ensure routes are predictable:

```jsonc
{
  "source": "cdn",
  "target": "waf",
  "sourceHandle": "right-source",   // exits right side of CDN
  "targetHandle": "left-target"     // enters left side of WAF
}
```

If handles are omitted, React Flow auto-connects from the closest sides, which may produce unpredictable edge paths.

**Convention:**
- Left-to-right flows: use `"right-source"` → `"left-target"`
- Right-to-left flows: use `"left-source"` → `"right-target"`
- Top-down flows: use `"bottom-source"` → `"top-target"`
- Bottom-up flows: use `"top-source"` → `"bottom-target"`

Edges are rendered as **Bezier curves** (`getBezierPath`), producing smooth S-curves between endpoints.

---

## 7. Transform Layer (How JSON → React Flow)

The file `lib/diagram/transform.ts` converts `SystemDesign` JSON to React Flow's `Node[]` and `Edge[]` arrays. Key steps:

### 7a. Group Bounds Computation (`computeGroupBounds`)
1. Groups with explicit `x`, `y`, `width`, `height` use those values.
2. Groups without explicit bounds compute their box from child nodes + child groups.
3. The bounding box adds 40px padding (`GROUP_PAD`) on all sides.
4. Groups are sorted by depth (parents before children) for correct z-ordering.

### 7b. Node Positioning
Every node's `position` is set to **relative coordinates**:
```
flowNode.position.x = archNode.x - parentBounds.x
flowNode.position.y = archNode.y - parentBounds.y
```
If there's no parent group, the absolute coordinates are used directly.

### 7c. Edge Configuration
Each `SystemDesignEdge` maps to a React Flow edge of type `architectureEdge`. The `data` object carries `label`, `protocol`, `lineStyle`, `color`, and `width` for custom rendering.

---

## 8. The Reverse: Flow → JSON

`lib/diagram/flow-to-system-design.ts` converts React Flow state back to `SystemDesign` JSON. It computes **absolute positions** by walking up `parentId` chains:

```typescript
absoluteX = node.position.x + parent.position.x + grandparent.position.x + ...
```

This enables the "Copy JSON" button to export accurate absolute positions after drag-and-drop rearrangements.

---

## 9. Rendering Details (for context)

### Node Rendering (`ArchitectureNode.tsx`)
- The kind's Lucide icon is rendered inside a 40×40px container
- A category-based SVG shape mask is applied over the icon background (e.g., `client.svg` for all client nodes)
- The node is a flex column: icon + label + optional description
- 8 handles are present but only visible on hover (or when an edge is connected)
- Status colors: green (active), amber (warning), red (error), gray (inactive)
- Clicking a node opens an expanded card (`ExpandableNodeCard`) with Category, Description, Details, Connections, Status, and ID sections
- `details` is rendered with `RichText` (`components/ui/rich-text.tsx`), a lightweight markdown subset: `### `/`#### ` headings, `- ` list items, blank-line-separated paragraphs, and inline `**bold**`, `*italic*`, `__underline__`, `` `code` ``, `[text](url)` links. Full CommonMark (tables, numbered lists, nested lists, images) is not supported.
- Blocks are split on blank lines (`\n\n`) only — a heading or list must be followed by a blank line before the next block, or it gets swallowed into the same block (e.g. a `### Heading` immediately followed by `- item` with no blank line renders as one heading containing the raw `- item` text, not a separate list).

### Group Rendering (`GroupNode.tsx`)
- Rendered as a rounded rectangle with dashed/solid border
- A floating badge in the top-left shows the label
- Supports resizing (NodeResizer) and inline label editing
- Groups are non-draggable (you drag the label badge to move the group)

### Edge Rendering (`ArchitectureEdge.tsx`)
- Bezier curve paths with arrow markers
- Label rendered using `EdgeLabelRenderer` (positioned at the path midpoint)
- Context menu allows toggling line style (solid/dashed/dotted), animation, and label edits

---

## 10. Example (Minimal)

```jsonc
{
  "version": "1.0",
  "title": "Simple API",
  "nodes": [
    { "id": "browser", "kind": "browser", "x": 120, "y": 300 },
    { "id": "api", "kind": "rest-api", "x": 600, "y": 300, "name": "API Server" },
    { "id": "db", "kind": "postgres", "x": 1080, "y": 300, "name": "Database", "group": "data-group" }
  ],
  "edges": [
    { "id": "e1", "source": "browser", "target": "api", "sourceHandle": "right-source", "targetHandle": "left-target", "protocol": "https" },
    { "id": "e2", "source": "api", "target": "db", "sourceHandle": "right-source", "targetHandle": "left-target", "protocol": "database", "style": "dashed" }
  ],
  "groups": [
    { "id": "data-group", "label": "Data Tier", "color": "#10b981" }
  ]
}
```

---

## 11. Guidelines for AI Agents

1. **Always assign absolute `x`/`y`** to every node and (optionally) every group.
2. **Use a ~120px grid** for node centers. Place nodes at multiples of 120 when possible.
3. **Use `kind` only from the registry** (Section 2a). Unknown kinds will render as a generic "Unknown" badge.
4. **Specify `sourceHandle` and `targetHandle`** on every edge to control routing.
5. **Use `group` on nodes** to place them inside groups. The parent group must exist in the `groups` array.
6. **Group nesting** is supported via `parent` on the group. Nesting depth is unbounded.
7. **Omit group bounds** (x/y/width/height) to use auto-layout — the group will wrap its children with 40px padding.
8. **Left-to-right layout** is the standard convention for system design diagrams.
9. **Keep descriptions short** — they render in ~10px font and have ~96px max-width.
10. **Edge `id`s must be unique** across all edges. Use a prefix like `"e-"` or `"edge-"`.
11. **Include a `summary` field** with a rich-text markdown explanation of the architecture — trade-offs, data flow, scaling decisions, and rationale. This is rendered as an "Architecture Breakdown" section below the diagram and follows the same markdown rules as `details` (§9: blank-line-separated blocks, `###`/`####` headings, `- ` lists, inline formatting, no tables/nested lists).
