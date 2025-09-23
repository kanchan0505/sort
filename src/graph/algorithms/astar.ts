import type { GraphEvent, GraphAlgoGenerator } from './types'

type Graph = Record<string, Array<{ to: string; w: number }>>

export const aStar: GraphAlgoGenerator = function* (
  graph: Graph,
  start: string,
  goal: string,
  heuristic: (v: string) => number
): Generator<GraphEvent> {
  const open = new Set<string>([start])
  const came: Record<string, string | undefined> = {}
  const g: Record<string, number> = { [start]: 0 }
  const f: Record<string, number> = { [start]: heuristic(start) }
  yield { type: 'setStart', node: start }
  yield { type: 'setGoal', node: goal }
  while (open.size) {
    let u: string = start
    let best = Infinity
    for (const v of open) {
      const val = f[v] ?? Infinity
      if (val < best) { best = val; u = v }
    }
    if (u === goal) break
    open.delete(u)
    yield { type: 'visit', node: u }
    for (const { to, w } of graph[u] || []) {
      const tentative = (g[u] ?? Infinity) + w
      if (tentative < (g[to] ?? Infinity)) {
        g[to] = tentative
        f[to] = tentative + heuristic(to)
        came[to] = u
        open.add(to)
        yield { type: 'relax', from: u, to, newDist: tentative }
      }
    }
  }
  // reconstruct
  const path: string[] = []
  let cur: string | undefined = goal
  if (!came[cur] && cur !== start) { yield { type: 'done' }; return }
  while (cur) { path.push(cur); cur = came[cur] }
  path.reverse()
  yield { type: 'path', nodes: path }
  yield { type: 'done' }
}
