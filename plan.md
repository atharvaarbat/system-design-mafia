I've got the full picture now — schema (types/diagram.ts), transform, renderer, plus the existing flows, decisions, bottlenecks, quiz, estimates sections. Here's my honest read, then the ideas.

The core gap: your JSON captures structure (what exists, what connects to what) and your extra sections capture prose about the system. But a beginner staring at 40 boxes is missing four things a static diagram fundamentally can't show: story (why it looks like this), time (what happens in what order, how fast), scale (which arrow carries 1M msg/s vs 10 req/s), and failure (what breaks when a box dies). Everything below attacks one of those.

---
1. Evolution mode — "the system as a story" (biggest win, in my opinion)

No real system was born with Kafka and 5 caches. The single best teaching device in system design is the scale journey: v1 is a client, a server, a database. At 100K users the DB melts → add a read replica. At 10M, fan-out kills you → add a queue. A beginner who watches the diagram grow understands every box, because each one arrived with a reason.

stages: [{
  id: 'v1', title: 'MVP — one server, one DB',
  narrative: string,          // markdown: what works, what's about to break
  trigger?: string,           // "at ~500K DAU, write latency spikes"
  nodeIds: string[],          // nodes visible at this stage
  edgeIds: string[],
}]

Renderer-wise it's a stage slider; nodes not in the stage don't render (or ghost at 10% opacity so you see what's coming). This reuses your highlight/camera machinery almost directly.

2. Chaos mode — "click a box to kill it"

Beginners think architectures are static truths. The "why" of most components is fear. Let the reader click any node → it turns red/dead → edges into it fail → dependent nodes degrade → and a panel explains the blast radius and what saves you (failover, replica, retry). This turns your existing bottlenecks text into an interactive experience.

// on SystemDesignNode
failure?: {
  blastRadius: { nodeId: string, effect: 'down' | 'degraded', note?: string }[]
  mitigation: string   // markdown: "traffic shifts to replica via health checks"
  userImpact: string   // "messages queue on-device, send when reconnected"
}

3. Payload inspector — "what is actually inside the arrow?"

Arrows are the most hand-wavy part of every architecture diagram. Extend FlowStep so as the flow plays, a side panel shows the actual data at that hop — the JSON request, the Kafka event, the Redis key being read — and how it morphs hop by hop. This is the difference between "the message goes to the queue" and seeing { msgId, from, to, ciphertext } land in a partition.

// on FlowStep
payload?: { title: string, body: string /* json/code block */ }
stateChanges?: { nodeId: string, note: string }[]  // "row inserted into messages", "cache warmed"
latencyMs?: number   // cumulative clock ticking as the flow plays

The latencyMs gives you a request waterfall for free — beginners have zero intuition that a cache hit is 1ms and a cross-region call is 150ms.

4. Edge contracts — sync vs async made visible

The single hardest concept for beginners is where the synchronous world ends. Right now protocol hints at it, but nothing teaches it. Add semantics to edges and render them differently (solid = caller waits, dashed+particles = fire-and-forget), plus a legend:

// on SystemDesignEdge
sync?: boolean
guarantees?: ('at-least-once' | 'exactly-once' | 'ordered' | 'idempotent')[]
qps?: string        // "~100K peak"
p99?: string        // "8ms"
payloadSize?: string

With qps you can also scale the animated-particle density per edge — the reader sees which pipes are firehoses.

5. Semantic zoom — fractal diagrams

Zoomed out: 4 mega-blocks (Clients / Edge / Services / Data). Zoom in: blocks dissolve into real nodes. Double-click a service node: open its internal architecture as a nested diagram. This solves overwhelm structurally instead of asking beginners to be brave. Data-wise: either an abstractionLevel on nodes/groups, or drilldown?: string on a node pointing to another diagram slug (you already have relatedPatterns — this is the per-node version).

6. Beginner lens — analogies and "why is this here?"

Per-node structured explanation, distinct from the freeform details markdown:

// on SystemDesignNode
explain?: {
  what: string        // "a message queue — a waiting line for work"
  whyHere: string     // "so the send API can return in 50ms instead of waiting on fan-out"
  analogy?: string    // "a restaurant order rail between waiters and kitchen"
  withoutIt?: string  // "every send blocks until all group members are notified"
  alternatives?: string[]  // "RabbitMQ, SQS — Kafka wins here for replay + ordering"
}

A "beginner mode" toggle could even swap node labels for their analogies. withoutIt is the killer field — counterfactuals are how noobs actually learn why architecture exists.

7. Interview / build-it mode — active recall on the canvas

You have quiz, but it's disconnected from the diagram. Two canvas-native versions: (a) predict the next hop — while a flow plays, pause and ask "where does the request go next?" with 3 clickable nodes; (b) blank slate mode — show the requirements, give a palette of the real components, let the reader place and wire them, then diff against the actual design. Version (a) is cheap since the flow player exists.

8. Smaller, cheap additions

- Glossary: glossary?: Record<string, string> — any term in any markdown body auto-underlines and gets a hover definition. Massive for noobs, trivial to build.
- Read/write path toggle: tag edges paths?: ('read' | 'write' | 'background')[], render toggle chips that dim everything else. Reuses highlight machinery directly.
- Numbers overlay: your estimates exist as a list — pin them onto the diagram (a badge on the DB node saying "~60TB/yr", on an edge "100K msg/s peak") via estimate.anchorNodeId.
- Data model peek: dataModel?: string on storage nodes — sample rows/keys ("session:{userId} → TTL 30d") shown in the expanded card.
