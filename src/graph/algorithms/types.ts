export type GraphEvent =
  | { type: 'setStart'; node: string }
  | { type: 'setGoal'; node: string }
  | { type: 'enqueue'; node: string }
  | { type: 'dequeue'; node: string }
  | { type: 'visit'; node: string }
  | { type: 'relax'; from: string; to: string; newDist: number }
  | { type: 'path'; nodes: string[] }
  | { type: 'connect'; u: string; v: string }          // MST edges
  | { type: 'order'; nodes: string[] }                 // Topological order
  | { type: 'negativeCycle'; cycle?: string[] }
  | { type: 'done' }

export type GraphAlgoGenerator = (...args: any[]) => Generator<GraphEvent, void, unknown>

export type GraphAlgorithmId = 'bfs-grid' | 'dijkstra'
