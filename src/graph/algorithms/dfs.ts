import type { GraphEvent, GraphAlgoGenerator } from './types'

type Graph = Record<string, Array<{ to: string; w?: number }>>

export const dfs: GraphAlgoGenerator = function* (graph: Graph, start: string): Generator<GraphEvent> {
  const seen = new Set<string>()
  function* go(u: string): Generator<GraphEvent> {
    if (seen.has(u)) return
    seen.add(u)
    yield { type: 'visit', node: u }
    for (const { to } of graph[u] || []) {
      yield* go(to)
    }
  }
  yield { type: 'setStart', node: start }
  yield* go(start)
  yield { type: 'done' }
}
