import type { GraphEvent, GraphAlgoGenerator } from './types'

type Graph = Record<string, Array<{ to: string }>>

export const topoSort: GraphAlgoGenerator = function* (graph: Graph): Generator<GraphEvent> {
  const indeg: Record<string, number> = {}
  for (const u of Object.keys(graph)) {
    indeg[u] = indeg[u] ?? 0
    for (const { to } of graph[u]) indeg[to] = (indeg[to] ?? 0) + 1
  }
  const q = Object.keys(graph).filter(v => (indeg[v] ?? 0) === 0)
  const order: string[] = []
  while (q.length) {
    const u = q.shift()!
    order.push(u)
    yield { type: 'visit', node: u }
    for (const { to } of graph[u] || []) {
      indeg[to]--
      if (indeg[to] === 0) q.push(to)
    }
  }
  yield { type: 'order', nodes: order }
  yield { type: 'done' }
}
