import type { GraphAlgoGenerator, GraphAlgorithmId } from './types'
import { bfsGrid } from './bfsGrid'
import { dijkstra } from './dijkstra'
import { dfs } from './dfs'
import { aStar } from './astar'
import { prim } from './prim'
import { kruskal } from './kruskal'
import { topoSort } from './topo'
import { bellmanFord } from './bellmanFord'

export const graphAlgorithms: Record<string, { name: string; run: GraphAlgoGenerator }> = {
  'bfs-grid': { name: 'BFS on Grid', run: bfsGrid },
  'dijkstra': { name: 'Dijkstra (Adj List)', run: dijkstra },
  'dfs': { name: 'Depth-First Search', run: dfs },
  'astar': { name: 'A* Search', run: aStar },
  'prim': { name: "Prim's MST", run: prim },
  'kruskal': { name: "Kruskal's MST", run: kruskal },
  'topo': { name: 'Topological Sort', run: topoSort },
  'bellman-ford': { name: 'Bellman-Ford', run: bellmanFord },
}

export const graphAlgorithmOptions = Object.entries(graphAlgorithms).map(([id, { name }]) => ({ id, name }))
