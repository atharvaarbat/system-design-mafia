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

  // Educational content fields (all optional — see §1a for authoring rules):
  "difficulty": "advanced",  // "beginner" | "intermediate" | "advanced"
  "requirements": { /* ... */ },   // functional / non-functional requirement lists
  "estimates": [ /* ... */ ],      // back-of-the-envelope stat cards
  "stages": [ /* ... */ ],         // evolution mode — the system's scale story, stage by stage (§1a.10)
  "flows": [ /* ... */ ],          // interactive request-flow walkthroughs (highlight the diagram!)
  "decisions": [ /* ... */ ],      // design decisions with alternatives + rationale
  "bottlenecks": [ /* ... */ ],    // failure modes + mitigations
  "quiz": [ /* ... */ ],           // self-test questions with reveal answers
  "references": [ /* ... */ ],     // further-reading links
  "relatedPatterns": [ /* ... */ ],// slugs of related diagrams in data/diagrams/index.json

  "nodes": [ /* ... */ ],    // required, array of SystemDesignNode
  "edges": [ /* ... */ ],    // required, array of SystemDesignEdge
  "groups": [ /* ... */ ]    // optional, array of SystemDesignGroup
}
```

---

## 1a. Educational Content Fields (Page Sections)

The detail page renders a full learning experience around the diagram. Each section below is driven by one optional top-level field — **a section only renders when its field is present**, so partial payloads degrade gracefully. For a full-quality page, generate all of them.

Page section order (top to bottom):

1. Diagram (with protocol legend, edge-contract legend, flow player + payload inspector, stage player + chaos mode overlays)
2. **Requirements** ← `requirements`
3. **Scale Estimates** ← `estimates`
4. **System Evolution** ← `stages` (interactive — stages replay the system's growth in the diagram)
5. **Request Flows** ← `flows` (interactive — steps highlight the diagram)
6. **Key Components** ← auto-generated from `nodes` (no field; quality depends on node `name`/`description`)
7. **Architecture Breakdown** ← `summary`
8. **Design Decisions** ← `decisions`
9. **Bottlenecks & Failure Modes** ← `bottlenecks`
10. **Failure Lab** ← auto-generated from `nodes[].failure` (interactive — kill components in the diagram, §1a.11)
11. **Test Yourself** ← `quiz`
12. **Further Reading** ← `references` + `relatedPatterns`

A "jump-to" index and an estimated reading time are computed automatically — there are no fields for them.

> **⚠️ Markdown vs plain text.** Only these fields render through the rich-text subset (§9a): `summary`, node `details`, `stages[].narrative`, `nodes[].failure.mitigation`, `decisions[].rationale`, `bottlenecks[].problem`, `bottlenecks[].mitigation`, `quiz[].answer`. **Every other string is plain text** — flow step `text`, flow step `payload.title`/`payload.body`/`stateChanges[].note`, edge `qps`/`p99`/`payloadSize`, stage `trigger`s, failure `userImpact`/blast-radius `note`s, requirement items, estimate `note`s, quiz `question`s, etc. Markdown syntax in plain-text fields shows up as literal `**asterisks**`. (Payload bodies are rendered verbatim in a monospace box — put JSON/code there, not markdown.)

### 1a.1 `difficulty`

```jsonc
"difficulty": "advanced"   // "beginner" | "intermediate" | "advanced"
```

Rendered as a colored chip in the metadata strip. Match the value used for this diagram in `data/diagrams/index.json`.

### 1a.2 `requirements`

```jsonc
"requirements": {
  "functional": [
    "Creators can upload multi-gigabyte videos, and interrupted uploads resume from the failed chunk",
    "Playback quality adapts automatically to the viewer's available bandwidth (ABR)"
  ],
  "nonFunctional": [
    "Low latency — sub-second video startup for popular content served from edge caches",
    "Massive scale — millions of concurrent streams, hundreds of hours ingested per minute"
  ]
}
```

- 4–6 items per list. Plain text, one full sentence each.
- Functional = user-visible behavior ("X can do Y"). Non-functional = quality attributes, each ideally with a concrete target or consequence after an em-dash.
- Every requirement should be *visible in the diagram* — if a requirement has no corresponding component or flow, either the diagram or the requirement is wrong.

### 1a.3 `estimates`

```jsonc
"estimates": [
  { "label": "Daily active users", "value": "100M", "note": "each watching ~5 videos per day" },
  { "label": "Read : write ratio", "value": "200 : 1", "note": "views dwarf uploads — optimize the read path" }
]
```

- 4–6 entries, rendered as stat cards. `value` displays in a very large font — **keep it under ~12 characters** ("100M", "500 hrs/min", "~2 PB", "200 : 1").
- `note` (plain text, one short clause) should say *why the number matters for the design*, not just restate it.
- Order-of-magnitude honesty beats precision. Pick numbers that justify the architecture's choices (the ratio that motivates the cache, the volume that motivates the queue).

### 1a.4 `flows` — interactive walkthroughs (the highest-value field)

```jsonc
"flows": [
  {
    "id": "upload-video",                    // required, unique
    "title": "Upload & process a video",     // required, short
    "description": "From pressing upload to the video being streamable.", // optional, plain text
    "steps": [
      {
        "text": "The client asks the API service for a pre-signed upload URL. The API authenticates the creator and opens a multipart session.",  // required, plain text
        "nodeIds": ["client-web", "api-gateway", "api-service"],  // optional, nodes involved in THIS step
        "edgeIds": ["e-web-gw", "e-gw-api"],                       // optional, edges traversed in THIS step
        "payload": {                                               // optional — the data on the wire at this hop (payload inspector)
          "title": "POST /api/videos:initiate",                   // short label, plain text
          "body": "{\n  \"title\": \"…\",\n  \"parts\": 512\n}"    // verbatim JSON/code, rendered monospace
        },
        "stateChanges": [                                          // optional — node state this step mutates
          { "nodeId": "metadata-db", "note": "row written — status = uploading" }
        ],
        "latencyMs": 40                                            // optional — this hop's latency; the player shows a cumulative clock + waterfall
      }
      // ... more steps
    ]
  }
]
```

**How it renders:** each step is clickable (and a player docks onto the diagram). The active step's nodes/edges **glow** in the diagram, earlier steps in the flow stay visible as a dimmed "trail", everything else fades out, and the camera automatically flies to the active step's nodes. This is what turns the diagram from a picture into a lesson — treat flows as mandatory for any non-trivial design.

When steps carry `payload` / `stateChanges` / `latencyMs`, the docked player becomes a **payload inspector**: it shows the actual data at the hop ("On the wire"), the node state the step mutates ("State changes"), and a running **elapsed clock + latency waterfall** across the whole flow — so a beginner *sees* that a cache hit is 1ms while an origin miss is 80ms.

**Rules:**

- **Every id in `nodeIds`/`edgeIds` must exactly match an existing `nodes[].id` / `edges[].id`.** Invalid ids fail silently (nothing highlights). Copy edge ids verbatim — including ugly auto-generated ones like `"xy-edge__api-servicebottom-source-blob-storage-uploadtop-target"`. `stateChanges[].nodeId` must match too.
- 1–3 flows per design. The classic pair is **write path** + **read path** (e.g. "Upload & process a video" / "Stream a video"). A failure-handling flow is a good third.
- 4–8 steps per flow. One logical hop or action per step. Consecutive steps should chain — share a node with the previous step so the camera pans naturally.
- `nodeIds`: the 1–3 nodes participating in the step. `edgeIds`: only the edges actually traversed in the step (usually 1–2).
- Step `text` is 1–3 plain-text sentences. Teach the *why*, not just the *what*: "A failed chunk is retried alone — a 10 GB upload never restarts from zero" beats "The client uploads chunks".
- Every node referenced in a step should have a `name` — step chips display node names.
- **`payload`** (optional) is the literal data travelling on this hop. `title` is a short label (e.g. `"POST /videos:initiate"`, `"S3 ObjectCreated event"`, `"Redis GET video:{id}"`). `body` is rendered **verbatim in a monospace box** — put a small JSON object, an event, an HTTP line, or a manifest snippet there. Keep it under ~8 lines; use `\n` for newlines. Show how data *morphs* hop by hop (request → row → event → job → manifest).
- **`stateChanges`** (optional) lists node mutations the step causes — `{ nodeId, note }`, note is short plain text ("row inserted", "cache warmed", "segment cached at edge"). This makes side effects visible, not just the message in flight.
- **`latencyMs`** (optional) is this hop's latency contribution in milliseconds. If any step in a flow has it, the player shows a cumulative *elapsed* clock and a proportional waterfall bar. Use honest orders of magnitude (cache hit `1`, same-region call `20`, origin/cross-region `80`, async encode `180000`) — the whole point is teaching latency intuition. Either annotate most steps of a flow or none.

### 1a.5 `decisions`

```jsonc
"decisions": [
  {
    "title": "Clients talk to storage directly",        // the tension being resolved
    "choice": "Pre-signed URLs + multipart upload",      // short chip, ≤ ~50 chars
    "alternatives": ["Proxy uploads through the API servers"],  // 1–3 rejected options, short chips
    "rationale": "Video ingress is measured in petabytes. If those bytes flowed through the API tier, it would have to scale with *video traffic* instead of *request traffic*..."  // markdown (§9a)
  }
]
```

- 3–6 decisions. Pick the choices an interviewer would probe: the database, the queue, the caching strategy, the sync/async boundaries.
- `rationale` is 2–4 sentences of markdown. Argue from **this system's constraints and numbers** (tie back to `estimates`), not from generic technology virtues. Name the cost of the losing alternatives.

### 1a.6 `bottlenecks`

```jsonc
"bottlenecks": [
  {
    "title": "Viral video thundering herd",
    "problem": "A video going viral sends millions of players after the same segments within minutes. Uncached, the stampede hits Cassandra and origin storage simultaneously.",   // markdown (§9a)
    "mitigation": "The CDN soaks segment traffic, Redis soaks metadata reads, and request coalescing collapses concurrent identical misses into a single origin fetch."             // markdown (§9a)
  }
]
```

- 3–5 entries. Ask: *what breaks first at 10× load?* Hot partitions, thundering herds, backlog growth, cost blow-ups, single points of failure.
- `problem` states what breaks **and under which conditions**. `mitigation` must reference mechanisms that exist in the diagram (or explicitly note an extension).

### 1a.7 `quiz`

```jsonc
"quiz": [
  {
    "question": "Why do application servers never touch video bytes — in either direction?",  // plain text
    "answer": "Uploads go straight to blob storage via pre-signed URLs; playback comes straight from the CDN. Video bandwidth is thousands of times metadata bandwidth..."          // markdown (§9a)
  }
]
```

- 4–8 questions with hidden, click-to-reveal answers.
- Every question must be answerable from this page's content, and each `answer` should teach the point on its own (the reader may have gotten it wrong).
- Prefer *why* and *what-happens-if* questions over definition recall.

### 1a.8 `references`

```jsonc
"references": [
  { "title": "HTTP Live Streaming (HLS) — the manifest + segment format specification", "url": "https://datatracker.ietf.org/doc/html/rfc8216", "source": "RFC 8216" },
  { "title": "Netflix Tech Blog — real-world streaming engineering", "url": "https://netflixtechblog.com/", "source": "netflixtechblog.com" }
]
```

- 3–6 links. `source` is the short attribution shown next to the title (domain or spec number).
- **Never invent deep links.** Use stable, canonical URLs you are certain exist: official docs landing pages, RFCs, well-known engineering blogs' homepages. A homepage that exists beats a plausible-looking 404.

### 1a.9 `relatedPatterns`

```jsonc
"relatedPatterns": ["event-driven-architecture", "design-instagram"]
```

- 1–3 slugs of **other diagrams that exist in `data/diagrams/index.json`**. Unknown slugs are silently dropped.
- Rendered as "Patterns used in this design" links — pick genuinely related patterns, not filler.

### 1a.10 `stages` — evolution mode (the system's scale story)

```jsonc
"stages": [
  {
    "id": "mvp",                                        // required, unique
    "title": "The MVP — one API, one database, one bucket",  // required, short
    "narrative": "Every platform starts small. A stateless API issues **pre-signed URLs**...\n\nThis survives a few thousand users, but every viewer pulls the full-size original.",  // required, markdown (§9a)
    "nodeIds": ["client-web", "api-gateway", "api-service", "metadata-db", "blob-storage-upload"],  // required
    "edgeIds": ["e-web-gw", "e-gw-api", "e-api-db"]     // required
  },
  {
    "id": "transcoding",
    "title": "Make it watchable — the transcoding pipeline",
    "trigger": "Raw originals are unwatchable at scale — a phone cannot stream a 4K master file",  // optional, plain text
    "narrative": "Stop serving what creators upload; start serving what players need...",
    "nodeIds": [ /* EVERYTHING visible at this stage — previous stage's ids plus the new ones */ ],
    "edgeIds": [ /* same: cumulative */ ]
  }
  // ... more stages, ending with the full system
]
```

**How it renders:** a "System Evolution" section lists the stages, and playing one docks a stage player onto the diagram. Only that stage's nodes/edges render — the rest of the system disappears — and the camera fits the visible set. Stepping forward watches the architecture grow; a "new in this stage" chip list calls out what each stage added. This is the single best teaching device for *why* the architecture looks the way it does: every component arrives together with the scale pressure that forced it.

**Rules:**

- **Ids are cumulative, not deltas.** Each stage lists **everything** visible at that stage, and each stage's `nodeIds`/`edgeIds` should be a superset of the previous stage's. The final stage must list the complete system.
- **Every id must exactly match an existing `nodes[].id` / `edges[].id`** — invalid ids fail silently. Copy edge ids verbatim, including auto-generated ones.
- **Both endpoints of every listed edge must be in the same stage's `nodeIds`** — an edge with a hidden endpoint is hidden regardless.
- 3–5 stages. Stage 1 is the naive MVP (client → server → store); each later stage adds one architectural idea (async processing, CDN, cache, sharding…).
- `trigger` (plain text, one sentence) names the scale pressure that forced this stage: concrete numbers beat adjectives ("Views outnumber uploads 200:1 and hot partitions saturate"). Omit it on the first stage.
- `narrative` is 2–4 sentences of markdown: what this stage adds, why, and what is about to break next. Tie it to `estimates` and foreshadow the next stage's trigger.
- Tell one story: requirements → estimates → stages → flows should read as *pressure → shape → behavior*.

### 1a.11 `nodes[].failure` — chaos mode (the Failure Lab)

Defined per node (see §2), documented here because it powers a page section. Any node carrying a `failure` object becomes **killable**: the page renders a "Failure Lab" section and a chaos-mode toggle on the diagram. Killing a component marks it OFFLINE, restyles its authored blast radius (red = down, amber = degraded), fails every edge touching a dead/down node, dims the rest, and docks a panel showing user impact + mitigation.

```jsonc
"failure": {
  "userImpact": "Playback does not stop, but startup jumps from milliseconds to seconds.",  // required, plain text
  "blastRadius": [                                       // optional, other affected components
    { "nodeId": "blob-storage-transcoded", "effect": "degraded", "note": "absorbs the entire read load the edge used to soak" }
    // effect: "down" | "degraded"; note: optional plain text, short
  ],
  "mitigation": "Real platforms run **multiple CDNs** with DNS-level failover..."  // required, markdown (§9a)
}
```

**Rules:**

- Give `failure` to the 4–7 most instructive components — the ones whose death teaches a design decision (the cache, the queue, the CDN, the database, the stateless tier). Not every node needs one.
- Every `blastRadius[].nodeId` must exactly match an existing `nodes[].id`. Do not list the killed node itself.
- `userImpact` describes what the *end user* experiences, and the most instructive ones subvert expectations ("creators notice nothing — but new videos silently never publish").
- `mitigation` must reference mechanisms that exist in the diagram (or explicitly note an extension), and ideally names the design decision that contains the blast.
- Keep `failure` consistent with `bottlenecks`: bottlenecks describe load-driven failure in prose; `failure` makes component-death explorable. They should reinforce, not contradict, each other.

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
  "group": "aws-cloud",     // optional, ID of the parent SystemDesignGroup
  "failure": { /* ... */ }  // optional, chaos-mode simulation — makes the node killable (see §1a.11)
}
```

> **Node text feeds three places**, so treat `name`, `description`, and `details` as required in practice:
> 1. The node itself on the canvas (`name` + `description`).
> 2. The auto-generated **Key Components** section — cards show `name`, kind label, and `description`, grouped by category, and clicking a card locates the node in the diagram.
> 3. The expanded node card (click a node) — renders `description` plus the full `details` markdown. Put the deep dive here: what the component owns, why this technology, how it scales.
>
> Flow steps (§1a.4) also display node `name`s as chips.

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
  "color": "#ef4444",        // optional, stroke color (any CSS color string)

  // Edge contract (all optional — see §3b):
  "sync": true,              // true = caller blocks (solid); false = fire-and-forget (dashed + particles)
  "guarantees": ["ordered", "at-least-once"], // delivery/ordering promises, shown on hover
  "qps": "~100K peak",       // throughput — also scales async particle density
  "p99": "8ms",              // tail latency
  "payloadSize": "~2KB"      // typical message size
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

### 3b. Edge Contracts (sync vs async)

The hardest concept for beginners is *where the synchronous world ends*. These optional fields make an edge's contract visible: the single most teachable distinction is **who waits**.

```jsonc
{
  "sync": false,                                 // false → async / fire-and-forget
  "guarantees": ["at-least-once", "idempotent"], // 0+ of: at-least-once | exactly-once | ordered | idempotent
  "qps": "~500/min",                             // free-form throughput string
  "p99": "12ms",                                 // free-form tail-latency string
  "payloadSize": "~2KB"                          // free-form size string
}
```

**How it renders:**

- **`sync: true`** → a **solid** line: the caller blocks until it gets a response (an HTTP request, a DB query, a cache read).
- **`sync: false`** → a **dashed** line with **travelling particle dots**: fire-and-forget (an event onto a queue, a job fan-out). The particles' density and speed scale with `qps`, so a firehose *looks* like a firehose. An explicit `style` still overrides the line dash; `sync` only sets the default.
- **`guarantees` / `qps` / `p99` / `payloadSize`** surface in a small **contract card on edge hover**, and a **legend** (bottom-left of the diagram) explains the sync/async language. The legend and particles appear only when at least one edge defines `sync`.

**Rules:**

- Annotate the edges that *teach the seam* — the request path as `sync`, the queue / event / fan-out edges as `async`. Not every edge needs a contract; leave plumbing edges bare (they keep their `style`).
- `qps`, `p99`, `payloadSize` are **plain-text, free-form** — write them for humans (`"~50K peak"`, `"10M+ peak"`, `"1ms"`, `"~2–6MB"`). `qps` is parsed loosely (leading number + optional `k`/`m`/`b`) only to pick particle density; the string is shown verbatim.
- Keep contracts consistent with the story: a `sync` edge with `p99: "1ms"` should be your cache; the `async` edges should be exactly the decoupling points your `decisions` and `bottlenecks` talk about.

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
- `details` is rendered with `RichText` (`components/ui/rich-text.tsx`). See §9a for the full rendering specification.

### 9a. Rich Text Rendering Specification (`RichText`)

The rich-text fields — `summary`, node `details`, `stages[].narrative`, `nodes[].failure.mitigation`, `decisions[].rationale`, `bottlenecks[].problem`, `bottlenecks[].mitigation`, and `quiz[].answer` — support a **strict markdown subset** that is parsed in two phases: block-level split → inline tokenization. All other string fields are plain text (§1a).

#### Block-Level Parsing

Content is split into blocks by **one or more blank lines** (`\n\n+`). Each block is classified into exactly one type:

| Prefix | Block type | Rendered as |
|---|---|---|
| `### ` | H3 heading | `<h3>` (bold, 16px) |
| `#### ` | H4 heading | `<h4>` (bold, 14px) |
| `- ` | Unordered list | `<ul>` with dot markers |
| *(none)* | Paragraph | `<p>` |

> **⚠️ Critical rule:** A heading or list must be separated from the previous/next block by **at least one blank line**. If a `### Heading` is immediately followed by `- item` with no blank line between them, the entire thing is parsed as **one heading block** — the `- item` text appears as raw content inside the `<h3>`, not as a separate list.

✅ **Correct:**
```markdown
### Responsibilities

- Auth
- Profiles

This is a paragraph.
```

❌ **Wrong** (no blank line between heading and list — everything becomes one heading):
```markdown
### Responsibilities
- Auth
- Profiles

This is a paragraph.
```

#### List Block Detail

A list block groups **consecutive `- ` lines** within the same block:
- Lines in the block that do not start with `- ` are silently dropped.
- Only **single-level** lists are supported — no nested lists, no numbered lists.
- Each item renders with a small dot marker (bullet).

```markdown
- First item
- Second item
- Third item
```

#### Inline Formatting

Within any block's text (after stripping the prefix), inline tokens are parsed:

| Syntax | Result |
|---|---|
| `**bold text**` | **Bold** (`<strong>`) |
| `*italic text*` | *Italic* (`<em>`) |
| `__underlined__` | <u>Underlined</u> (`<u>`, dotted underline) |
| `` `code span` `` | `Code` (`<code>`, small, primary color) |
| `[label](https://...)` | Link (`<a>`, opens in new tab) |

Inline tokens can be mixed freely:
```markdown
**Redis** is used for *caching* and `session` storage. See [docs](https://redis.io).
```

#### What Is NOT Supported

The renderer does **NOT** support:
- Tables (`\|` syntax)
- Numbered / ordered lists
- Nested lists (indented `- ` items)
- Blockquotes (`> `)
- Fenced code blocks (triple backticks)
- Horizontal rules (`---`)
- Images
- HTML tags
- H1/H2 headings (`# ` or `## `)
- Horizontal rule separators

#### Styling

The entire block is wrapped in `font-mono text-sm leading-relaxed` with a `space-y-5` gap between blocks. Headings get `tracking-tight` / `tracking-wide`. Code spans use `text-xs` and a subtle border+background.

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
11. **Include a `summary` field** with a rich-text markdown explanation of the architecture — trade-offs, data flow, scaling decisions, and rationale. This is rendered as an "Architecture Breakdown" section below the diagram. See §9a for the exact rich-text rules.
12. **When writing any rich-text field, always separate blocks with a blank line.** The single most common bug is a heading immediately followed by a list item with no blank line, which collapses them into one heading block. Always write `### Heading\n\n- item` not `### Heading\n- item` (see §9a).
13. **Generate the full educational payload** (§1a): `difficulty`, `requirements`, `estimates`, `stages`, `flows`, `decisions`, `bottlenecks`, node `failure`s, `quiz`, `references`, `relatedPatterns`. Sections render only when present — a diagram-only payload produces a much weaker page.
14. **Write `nodes` and `edges` FIRST, then `stages` and `flows`.** Both reference node/edge ids; every id in `nodeIds`/`edgeIds` (and every `failure.blastRadius[].nodeId`) must exactly match an existing element or the feature silently does nothing. After generating, re-verify each id against the final `nodes`/`edges` arrays.
15. **Respect the plain-text/markdown split** (§1a): markdown only in `summary`, `details`, stage `narrative`, failure `mitigation`, `rationale`, `problem`, bottleneck `mitigation`, `answer`. Flow step text, stage triggers, failure `userImpact`/notes, requirements, estimates, questions, titles, and chips are plain text.
16. **Stage ids are cumulative** (§1a.10): each stage lists everything visible at that stage, each stage is a superset of the previous one, the last stage is the full system, and both endpoints of every listed edge appear in that stage's `nodeIds`.
17. **Keep estimate `value`s under ~12 characters** — they render in a very large display font.
18. **Give every node a `name`, `description`, and `details`** — they power the Key Components section, the expanded node cards, and flow-step chips (§2 note).
19. **Only use real URLs in `references`** — canonical docs, RFCs, known blog homepages. Never fabricate deep links.
20. **Only use existing slugs in `relatedPatterns`** — check `data/diagrams/index.json`; unknown slugs are dropped.
21. **Make the fields reinforce each other**: estimates justify decisions, decisions explain diagram structure, stages explain why each component exists, bottlenecks stress the same components the flows traverse, failures make the bottlenecks explorable, and quiz answers close the loop. A reader should meet each idea at least twice.
22. **Use edge contracts to teach the sync/async seam** (§3b): mark the request path `sync: true` and the queue / event / fan-out edges `sync: false`; the async edges should be exactly the decoupling points your `decisions` and `bottlenecks` discuss. Give the load-bearing edges `qps` / `p99` / `payloadSize`, and `guarantees` on the async ones.
23. **Enrich flow steps with `payload`, `stateChanges`, and `latencyMs`** (§1a.4): show the real data morphing hop by hop (request → row → event → job → manifest), the node state each step mutates, and honest per-hop latencies so the player's elapsed clock + waterfall build latency intuition.
