import type { GraphEvent, GraphAlgoGenerator } from './types'

type Graph = Record<string, Array<{ to: string; w: number }>>

export const prim: GraphAlgoGenerator = function* (graph: Graph, start: string): Generator<GraphEvent> {
  const inMST = new Set<string>()
  const keys: Record<string, number> = {}
  const parent: Record<string, string | undefined> = {}
  for (const v of Object.keys(graph)) keys[v] = Infinity
  keys[start] = 0
  yield { type: 'setStart', node: start }
  while (inMST.size < Object.keys(graph).length) {
    let u: string | undefined
    let best = Infinity
    for (const v of Object.keys(graph)) {
      if (!inMST.has(v) && keys[v] < best) { best = keys[v]; u = v }
    }
    if (!u) break
    inMST.add(u)
    if (parent[u]) yield { type: 'connect', u, v: parent[u]! }
    yield { type: 'visit', node: u }
    for (const { to, w } of graph[u] || []) {
      if (!inMST.has(to) && w < keys[to]) { keys[to] = w; parent[to] = u }
    }
  }
  yield { type: 'done' }
}
