import type { GraphEvent, GraphAlgoGenerator } from './types'

type Graph = Record<string, Array<{ to: string; w: number }>>

export const bellmanFord: GraphAlgoGenerator = function* (
  graph: Graph,
  start: string,
  goal?: string
): Generator<GraphEvent> {
  const V = Object.keys(graph)
  const dist: Record<string, number> = {}
  const prev: Record<string, string | undefined> = {}
  for (const v of V) dist[v] = v === start ? 0 : Infinity
  yield { type: 'setStart', node: start }
  if (goal) yield { type: 'setGoal', node: goal }
  for (let i = 0; i < V.length - 1; i++) {
    for (const u of V) for (const { to, w } of graph[u] || []) {
      if (dist[u] + w < dist[to]) {
        dist[to] = dist[u] + w
        prev[to] = u
        yield { type: 'relax', from: u, to, newDist: dist[to] }
      }
    }
  }
  // detect negative cycle
  for (const u of V) for (const { to, w } of graph[u] || []) {
    if (dist[u] + w < dist[to]) {
      yield { type: 'negativeCycle' }
      yield { type: 'done' }
      return
    }
  }
  if (goal) {
    const path: string[] = []
    let cur: string | undefined = goal
    if (!isFinite(dist[cur])) { yield { type: 'done' }; return }
    while (cur) { path.push(cur); cur = prev[cur] }
    path.reverse()
    yield { type: 'path', nodes: path }
  }
  yield { type: 'done' }
}
