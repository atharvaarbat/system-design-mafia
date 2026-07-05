import type { Edge, Node } from '@xyflow/react'
import type { SystemDesign, SystemDesignEdge, SystemDesignGroup, SystemDesignNode } from '@/types/diagram'

function getAbsolutePosition(
  nodeId: string,
  nodeMap: Map<string, Node>,
): { x: number; y: number } {
  const node = nodeMap.get(nodeId)
  if (!node) return { x: 0, y: 0 }
  if (node.parentId) {
    const parent = getAbsolutePosition(node.parentId, nodeMap)
    return { x: node.position.x + parent.x, y: node.position.y + parent.y }
  }
  return { x: node.position.x, y: node.position.y }
}

export function flowToSystemDesign(nodes: Node[], edges: Edge[], original?: SystemDesign): SystemDesign {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]))

  const systemNodes: SystemDesignNode[] = []
  const systemGroups: SystemDesignGroup[] = []

  for (const node of nodes) {
    const pos = getAbsolutePosition(node.id, nodeMap)
    const nd = node.data as Record<string, unknown>

    if (node.type === 'architectureNode') {
      const sn: SystemDesignNode = {
        id: node.id,
        kind: nd.kind as SystemDesignNode['kind'],
        x: Math.round(pos.x),
        y: Math.round(pos.y),
      }
      if (nd.name) sn.name = String(nd.name)
      if (nd.description) sn.description = String(nd.description)
      if (nd.status) sn.status = nd.status as SystemDesignNode['status']
      if (node.parentId) sn.group = node.parentId
      systemNodes.push(sn)
    } else if (node.type === 'groupNode') {
      const g: SystemDesignGroup = {
        id: node.id,
        label: String(nd.label ?? ''),
      }
      if (nd.description) g.description = String(nd.description)
      if (nd.accent && nd.accent !== '#94a3b8') g.color = String(nd.accent)
      if (nd.borderStyle) g.style = nd.borderStyle as 'solid' | 'dashed'
      if (node.parentId) g.parent = node.parentId
      if (node.width) g.width = Math.round(node.width)
      if (node.height) g.height = Math.round(node.height)
      g.x = Math.round(pos.x)
      g.y = Math.round(pos.y)
      systemGroups.push(g)
    }
  }

  const systemEdges: SystemDesignEdge[] = []
  for (const edge of edges) {
    if (edge.type !== 'architectureEdge') continue
    const ed = edge.data as Record<string, unknown> | undefined
    const se: SystemDesignEdge = {
      id: edge.id,
      source: edge.source,
      target: edge.target,
    }
    if (edge.sourceHandle) se.sourceHandle = edge.sourceHandle
    if (edge.targetHandle) se.targetHandle = edge.targetHandle
    if (ed?.label) se.label = String(ed.label)
    if (ed?.protocol) se.protocol = ed.protocol as SystemDesignEdge['protocol']
    if (ed?.lineStyle) se.style = ed.lineStyle as 'solid' | 'dashed' | 'dotted'
    if (edge.animated) se.animated = true
    if (ed?.width) se.width = Number(ed.width)
    if (ed?.color) se.color = String(ed.color)
    systemEdges.push(se)
  }

  return {
    version: original?.version ?? '1.0',
    title: original?.title ?? 'Exported Architecture',
    ...(original?.description ? { description: original.description } : {}),
    nodes: systemNodes,
    edges: systemEdges,
    ...(systemGroups.length > 0 ? { groups: systemGroups } : {}),
  }
}
