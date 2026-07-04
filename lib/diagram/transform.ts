import type { Edge, Node } from '@xyflow/react'
import type { SystemDesign, SystemDesignGroup, SystemDesignNode } from '@/types/diagram'

const NODE_W = 200
const NODE_H = 84
const GROUP_PAD = 40

interface Bounds {
  x: number
  y: number
  width: number
  height: number
}

function nodeBounds(node: SystemDesignNode): Bounds {
  return {
    x: node.x,
    y: node.y,
    width: node.width || NODE_W,
    height: node.height || NODE_H,
  }
}

function unionBounds(boxes: Bounds[]): Bounds {
  const minX = Math.min(...boxes.map((b) => b.x))
  const minY = Math.min(...boxes.map((b) => b.y))
  const maxX = Math.max(...boxes.map((b) => b.x + b.width))
  const maxY = Math.max(...boxes.map((b) => b.y + b.height))
  return {
    x: minX - GROUP_PAD,
    y: minY - GROUP_PAD,
    width: maxX - minX + GROUP_PAD * 2,
    height: maxY - minY + GROUP_PAD * 2,
  }
}

/** Recursively computes each group's bounding box from its direct nodes and nested child groups. */
function computeGroupBounds(design: SystemDesign): Map<string, Bounds> {
  const groups = design.groups ?? []
  const groupMap = new Map(groups.map((g) => [g.id, g]))
  const bounds = new Map<string, Bounds>()
  const inProgress = new Set<string>()

  function resolve(groupId: string): Bounds | undefined {
    if (bounds.has(groupId)) return bounds.get(groupId)
    if (inProgress.has(groupId)) return undefined // guards against a cyclic `parent` reference
    inProgress.add(groupId)

    const group = groupMap.get(groupId)
    if (!group) return undefined

    if (group.x != null && group.y != null && group.width != null && group.height != null) {
      const explicit = { x: group.x, y: group.y, width: group.width, height: group.height }
      bounds.set(groupId, explicit)
      return explicit
    }

    const directNodeBoxes = design.nodes.filter((n) => n.group === groupId).map(nodeBounds)
    const childGroupBoxes = groups
      .filter((g) => g.parent === groupId)
      .map((g) => resolve(g.id))
      .filter((b): b is Bounds => b != null)

    const boxes = [...directNodeBoxes, ...childGroupBoxes]
    if (boxes.length === 0) return undefined

    const box = unionBounds(boxes)
    bounds.set(groupId, box)
    return box
  }

  for (const group of groups) resolve(group.id)
  return bounds
}

/** Root groups first, then their children, so nested groups render above their ancestors. */
function orderGroupsByDepth(groups: SystemDesignGroup[]): SystemDesignGroup[] {
  const groupMap = new Map(groups.map((g) => [g.id, g]))

  function depth(group: SystemDesignGroup, seen = new Set<string>()): number {
    if (!group.parent || seen.has(group.id)) return 0
    const parent = groupMap.get(group.parent)
    if (!parent) return 0
    return 1 + depth(parent, new Set(seen).add(group.id))
  }

  return [...groups].sort((a, b) => depth(a) - depth(b))
}

export function systemDesignToFlow(design: SystemDesign): { nodes: Node[]; edges: Edge[] } {
  const flowNodes: Node[] = []
  const flowEdges: Edge[] = []

  const groupBounds = computeGroupBounds(design)

  if (design.groups) {
    for (const group of orderGroupsByDepth(design.groups)) {
      const boundsForGroup = groupBounds.get(group.id)
      if (!boundsForGroup) continue

      const parentBounds = group.parent ? groupBounds.get(group.parent) : undefined

      flowNodes.push({
        id: group.id,
        type: 'groupNode',
        position: {
          x: parentBounds ? boundsForGroup.x - parentBounds.x : boundsForGroup.x,
          y: parentBounds ? boundsForGroup.y - parentBounds.y : boundsForGroup.y,
        },
        data: {
          label: group.label,
          description: group.description,
          accent: group.color || '#94a3b8',
          borderStyle: group.style || 'dashed',
        },
        parentId: group.parent || undefined,
        extent: group.parent ? 'parent' : undefined,
        width: boundsForGroup.width,
        height: boundsForGroup.height,
        draggable: false,
        selectable: true,
        style: { zIndex: -1 },
      })
    }
  }

  for (const archNode of design.nodes) {
    const parentBounds = archNode.group ? groupBounds.get(archNode.group) : undefined

    flowNodes.push({
      id: archNode.id,
      type: 'architectureNode',
      position: {
        x: parentBounds ? archNode.x - parentBounds.x : archNode.x,
        y: parentBounds ? archNode.y - parentBounds.y : archNode.y,
      },
      data: { ...archNode },
      parentId: archNode.group || undefined,
      extent: archNode.group ? 'parent' : undefined,
      width: archNode.width || NODE_W,
      height: archNode.height || NODE_H,
      draggable: true,
      selectable: true,
    })
  }

  for (const archEdge of design.edges) {
    flowEdges.push({
      id: archEdge.id,
      source: archEdge.source,
      target: archEdge.target,
      type: 'architectureEdge',
      animated: archEdge.animated,
      data: {
        label: archEdge.label,
        protocol: archEdge.protocol,
        lineStyle: archEdge.style,
        color: archEdge.color,
        width: archEdge.width,
      },
    })
  }

  return { nodes: flowNodes, edges: flowEdges }
}
