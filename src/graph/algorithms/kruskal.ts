import type { GraphEvent, GraphAlgoGenerator } from './types'

type Edge = { u: string; v: string; w: number }
type Graph = Record<string, Array<{ to: string; w: number }>>

function edgesFromGraph(g: Graph): Edge[] {
  const edges: Edge[] = []
  for (const u of Object.keys(g)) for (const { to, w } of g[u]) if (u < to) edges.push({ u, v: to, w })
  return edges
}

export const kruskal: GraphAlgoGenerator = function* (graph: Graph): Generator<GraphEvent> {
  const edges = edgesFromGraph(graph).sort((a,b)=>a.w-b.w)
  const parent: Record<string, string> = {}
  const find = (x: string): string => parent[x] ? parent[x] = find(parent[x]) : x
  const union = (a: string, b: string) => { a = find(a); b = find(b); if (a!==b) parent[a]=b }
  for (const {u,v} of edges) {
    if (find(u) !== find(v)) {
      union(u,v)
      yield { type: 'connect', u, v }
    }
  }
  yield { type: 'done' }
}
