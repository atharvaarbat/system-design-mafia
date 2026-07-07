# Multi-Diagram Extension Prompt (for Large System Architectures)

Use this **together with** the System Design JSON Schema guide. It does not
change the schema — it tells the agent how to use existing primitives
(`nodes`, `edges`, `groups`) to represent **multiple independent diagrams**
inside a single `SystemDesign` JSON payload, for systems too large to show
as one coherent flow (e.g. Instagram, WhatsApp, YouTube).

It also covers how the educational fields (`flows`, `requirements`,
`estimates`, `decisions`, `bottlenecks`, `quiz`, `references` — schema guide
§1a) map onto a multi-diagram canvas (§8 below).

Only apply this when needed. Most requests still produce a single diagram.

---

## 1. Decide: one diagram, or several?

Default to **one diagram**. Split into multiple only when at least one of
these is true:

- The system has **clearly distinct functional domains** that don't share a
  natural left-to-right flow (e.g. "media upload pipeline" vs "messaging
  pipeline" vs "notification fan-out" for Instagram).
- A single diagram would need **25+ nodes** or produce heavy edge-crossing
  because unrelated subsystems are forced into one canvas.
- The user explicitly asks for a "breakdown," "by subsystem," "high-level +
  detail views," or names distinct product features (e.g. "Feed, DMs, and
  Stories" for Instagram).

If none of these apply, ignore this document and produce a normal single
diagram.

When splitting, pick **3–6 diagrams max**. Typical decomposition pattern:

1. High-level / request path overview (client → gateway → core services)
2. Core write path (e.g. upload, post creation, message send)
3. Core read path (e.g. feed generation, timeline assembly)
4. Supporting subsystem (e.g. notifications, search, presence)
5. Data/infra tier if complex enough to deserve its own view (sharding,
   replication, CDN strategy)

Name diagrams after what a reader would look for, not generic labels.

---

## 2. Core technique: diagrams as isolated spatial clusters

There is no `diagrams[]` array in the schema. Instead:

- Each diagram becomes **one top-level group** (call it a *frame group*) with
  **explicit `x`, `y`, `width`, `height`** — never auto-layout for frame
  groups. Auto-layout only adds 40px padding, which is not enough to keep
  independent diagrams visually separate.
- All of that diagram's nodes and sub-groups nest inside the frame group via
  `"group"` / `"parent"`.
- The frame group's `label` doubles as the diagram's title, since the schema
  has no per-diagram title field. Prefix it with a number: `"1. Media Upload
  & Processing"`, `"2. Feed Generation"`, etc. — this is what makes each
  diagram identifiable to a reader.
- Give each frame group a distinct `color` so the eye can separate them at a
  glance, and use `"style": "solid"` on the frame group (reserve `"dashed"`
  for ordinary sub-groups inside it) so the outermost boundary reads as a
  container, not just an emphasis box.

---

## 3. Cluster placement math

Lay clusters out on a grid so their bounding boxes never touch:

- **Vertical stack (default, ≤4 diagrams):** each diagram occupies its own
  horizontal band. Set each frame group's `y` to
  `diagramIndex * BAND_HEIGHT`, where `BAND_HEIGHT` = the tallest diagram's
  estimated height + **at least 400px** gap. Estimate height as
  `(max node rows) * 160 + 200`.
- **Grid (5–6 diagrams):** 2 columns. Column `x` offsets:
  `col * (MAX_DIAGRAM_WIDTH + 500)`. Row `y` offsets:
  `row * (MAX_DIAGRAM_HEIGHT + 400)`.
- Compute every node's absolute `x`/`y` **inside its own diagram's local
  coordinate space first** (as if it were the only diagram, starting near
  `x: 80, y: 80`), then **add the frame group's `x`/`y` offset** to every
  node and sub-group in that cluster before writing the final JSON. The
  frame group's own `x`/`y` is the offset; its `width`/`height` should
  comfortably enclose the translated children with ~80px internal margin.
- Never let two frame groups' bounding boxes overlap, even with padding.
  Gaps between frame groups should read as clearly larger than gaps between
  groups *within* a diagram (400px+ vs. 80px).

---

## 4. Node ID scoping (avoid collisions)

Node and edge IDs are **global** across the whole JSON, even though they
render in different visual clusters. Prefix every ID with a short diagram
tag:

```
upload-cdn, upload-worker, upload-s3        // Diagram 1
feed-cache, feed-ranker, feed-db            // Diagram 2
notif-queue, notif-worker                   // Diagram 3
```

Do this even for infrastructure that conceptually repeats across diagrams
(e.g. Postgres appears in both the write-path and read-path diagrams) —
duplicate the node with a diagram-scoped ID rather than reusing one ID in
two places. A single node cannot visually belong to two frame groups.

---

## 5. Edge scoping (no cross-diagram edges)

- Edges should only connect nodes **within the same frame group.** Diagrams
  are meant to be read independently.
- If two diagrams genuinely share infrastructure (e.g. both the upload
  pipeline and the feed pipeline write to the same object store), **do not**
  draw an edge between clusters. Instead:
  - Duplicate the shared node in each diagram (per §4), and
  - Note the relationship in that node's `description` or `details`, e.g.
    `"description": "Shared with Media Upload pipeline"`.
- Exception: if the *whole point* of a diagram is to show cross-subsystem
  interaction (e.g. a dedicated "system-wide data flow" overview diagram),
  cross edges are fine there — just don't do it in the per-subsystem
  detail diagrams.

---

## 6. Nesting within a cluster

Ordinary sub-groups (e.g. "Data Tier," "AWS VPC") still work exactly as
described in the schema guide — nest them under the frame group via
`"parent": "<frame-group-id>"`. Prefer **auto-layout** (omit bounds) for
these inner sub-groups; only the outer frame groups need explicit bounds.

---

## 7. The `summary` field across multiple diagrams

There is only one `summary` field for the whole JSON. Structure it as one
H3 section per diagram, in the same top-to-bottom/left-to-right order the
diagrams appear on the canvas. Follow the rich-text blank-line rules
exactly (heading, blank line, then paragraph or list, blank line):

```markdown
### 1. Media Upload & Processing Pipeline

Handles ingest, transcoding, and storage of user-uploaded media.

- Uploads go directly to object storage via pre-signed URLs
- A worker fleet transcodes video into multiple renditions

### 2. Feed Generation

Combines a fan-out-on-write cache with on-demand ranking for the home feed.

- Redis holds precomputed timelines per user
- The ranker re-scores the top N candidates at read time
```

Do not merge two diagrams' write-ups into one heading, and do not omit the
blank lines — a missing blank line collapses the list into the heading
(see the schema guide, §9a).

---

## 8. Educational fields across multiple diagrams

All educational fields (schema guide §1a) exist **once per JSON**, not per
frame group. Scope them like this:

### `flows` — one or two per frame group (this is where multi-diagram shines)

Flows are the reader's path through a large canvas: clicking a step
highlights its nodes/edges and the **camera automatically flies to them**,
so a flow effectively zooms the reader into the right frame group and walks
them across it hop by hop.

- Write **1–2 flows per frame group**, named after the subsystem:
  `"Upload a photo"` for the upload frame, `"Load the home feed"` for the
  feed frame. 3 frame groups ⇒ roughly 3–5 flows total.
- A flow's steps must stay **within one frame group's nodes** — the same
  no-cross-cluster rule as edges (§5). Because IDs are diagram-prefixed
  (§4), this falls out naturally: an upload flow references only
  `upload-*` node ids and their edges.
- Since shared infrastructure is *duplicated* per frame (§4), reference the
  duplicate that lives in the flow's own frame group — e.g. the feed flow
  highlights `feed-db`, never `upload-db`.
- Consecutive steps should share a node so the camera pans smoothly instead
  of teleporting.

### System-wide fields — cover all subsystems, don't repeat per frame

- `requirements`, `estimates`: describe the **whole product**. Estimates
  should include the per-subsystem driver numbers (uploads/day for the
  write frame, feed reads/sec for the read frame) so each diagram's sizing
  is justified.
- `decisions`, `bottlenecks`: draw them from across the subsystems — aim
  for at least one decision and one bottleneck per major frame group, and
  name the subsystem in the `title` when it isn't obvious
  (e.g. `"Feed: hybrid fan-out"`, `"Upload: transcoding backlog"`).
- `quiz`: mix questions across subsystems; at least one question should
  test the *boundary* between two frames (e.g. "why is the object store
  duplicated in both the upload and feed diagrams?").
- `references`, `relatedPatterns`, `difficulty`: unchanged — one set for
  the whole payload.

---

## 9. Worked skeleton (Instagram, 3 diagrams)

```jsonc
{
  "version": "1.0",
  "title": "Instagram — System Architecture",
  "summary": "### 1. Media Upload...\n\n...\n\n### 2. Feed Generation...\n\n...\n\n### 3. Notifications...\n\n...",
  "groups": [
    { "id": "frame-upload", "label": "1. Media Upload & Processing", "color": "#f59e0b", "style": "solid", "x": 80, "y": 0, "width": 1400, "height": 700 },
    { "id": "frame-feed",   "label": "2. Feed Generation",           "color": "#6366f1", "style": "solid", "x": 80, "y": 1100, "width": 1400, "height": 700 },
    { "id": "frame-notif",  "label": "3. Notification Fan-out",      "color": "#10b981", "style": "solid", "x": 80, "y": 2200, "width": 1400, "height": 600 }
  ],
  "nodes": [
    { "id": "upload-client", "kind": "mobile-app", "x": 160, "y": 350, "group": "frame-upload" },
    { "id": "upload-s3",     "kind": "s3",          "x": 1200, "y": 350, "group": "frame-upload" },

    { "id": "feed-cache",  "kind": "redis",    "x": 900, "y": 1450, "group": "frame-feed" },
    { "id": "feed-db",     "kind": "postgres", "x": 1300, "y": 1450, "group": "frame-feed" },

    { "id": "notif-queue",  "kind": "sqs",            "x": 900, "y": 2500, "group": "frame-notif" },
    { "id": "notif-worker", "kind": "worker-service", "x": 1200, "y": 2500, "group": "frame-notif" }
  ],
  "edges": [
    { "id": "e-upload-1", "source": "upload-client", "target": "upload-s3", "sourceHandle": "right-source", "targetHandle": "left-target" },
    { "id": "e-feed-1",   "source": "feed-cache",     "target": "feed-db",  "sourceHandle": "right-source", "targetHandle": "left-target" },
    { "id": "e-notif-1",  "source": "notif-queue",    "target": "notif-worker", "sourceHandle": "right-source", "targetHandle": "left-target" }
  ],
  "flows": [
    {
      "id": "upload-photo",
      "title": "Upload a photo",
      "description": "The write path — scoped entirely to frame 1.",
      "steps": [
        { "text": "The client uploads the photo directly to object storage via a pre-signed URL.", "nodeIds": ["upload-client", "upload-s3"], "edgeIds": ["e-upload-1"] }
        // ... more steps, all referencing upload-* ids only
      ]
    },
    {
      "id": "load-feed",
      "title": "Load the home feed",
      "description": "The read path — scoped entirely to frame 2.",
      "steps": [
        { "text": "The feed service checks the precomputed timeline in Redis, falling back to the posts DB for celebrity content.", "nodeIds": ["feed-cache", "feed-db"], "edgeIds": ["e-feed-1"] }
        // ... more steps, all referencing feed-* ids only
      ]
    }
  ]
  // ...plus the system-wide educational fields per §8:
  // "difficulty", "requirements", "estimates", "decisions",
  // "bottlenecks", "quiz", "references", "relatedPatterns"
}
```

(Truncated for brevity — a real diagram fills in each cluster's internal
nodes following the schema's normal §5 positioning and §6 handle rules.)

---

## 10. Checklist before emitting JSON

- [ ] Confirmed splitting was actually necessary (§1)
- [ ] Each diagram is one frame group with **explicit** bounds and a solid border
- [ ] Frame groups are separated by 400px+ with no bounding-box overlap
- [ ] All node/edge IDs are diagram-prefixed and globally unique
- [ ] No edges cross between frame groups (shared infra duplicated instead)
- [ ] `summary` has one H3 block per diagram, blank-line-separated per §9a of the schema guide
- [ ] Frame group labels are numbered and descriptive, not generic
- [ ] 1–2 `flows` per frame group; every step's `nodeIds`/`edgeIds` verified against the final `nodes`/`edges` arrays and scoped to a single frame group (§8)
- [ ] Consecutive flow steps share a node so the camera pans, not teleports
- [ ] `decisions` and `bottlenecks` cover every major frame group, with the subsystem named in the title where needed
- [ ] Full educational payload present (`difficulty`, `requirements`, `estimates`, `quiz`, `references`, `relatedPatterns` — schema guide §1a)
