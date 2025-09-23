import type { GraphEvent, GraphAlgoGenerator } from './types'

type Graph = Record<string, Array<{ to: string; w: number }>>

export const dijkstra: GraphAlgoGenerator = function* (
  graph: Graph,
  start: string,
  goal?: string
): Generator<GraphEvent> {
  const dist: Record<string, number> = {}
  const prev: Record<string, string | undefined> = {}
  const Q: Set<string> = new Set(Object.keys(graph))
  for (const v of Q) dist[v] = v === start ? 0 : Infinity
  yield { type: 'setStart', node: start }
  if (goal) yield { type: 'setGoal', node: goal }
  while (Q.size) {
    let u: string | undefined
    let best = Infinity
    for (const v of Q) if (dist[v] < best) { best = dist[v]; u = v }
    if (!u) break
    Q.delete(u)
    yield { type: 'visit', node: u }
    if (goal && u === goal) break
    for (const { to, w } of graph[u] || []) {
      if (!Q.has(to)) continue
      const nd = dist[u] + w
      if (nd < dist[to]) {
        dist[to] = nd
        prev[to] = u
        yield { type: 'relax', from: u, to, newDist: nd }
      }
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
