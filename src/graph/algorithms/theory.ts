export type GraphAlgoTheory = {
  id: string
  name: string
  overview: string
  howItWorks: string[]
  complexity: { time: string; space: string }
  notes?: string[]
}

export const graphAlgoTheory: Record<string, GraphAlgoTheory> = {
  'bfs-grid': {
    id: 'bfs-grid',
    name: 'BFS on Grid',
    overview: 'Breadth-first search explores neighbors level by level on an unweighted grid to find the shortest path in steps.',
    howItWorks: [
      'Start from the source cell and enqueue it.',
      'Pop from the queue, visit each unvisited neighbor, and enqueue them.',
      'Track parents to reconstruct the shortest path when the goal is reached.',
      'Continue until queue is empty or goal is found.'
    ],
    complexity: { time: 'O(R*C)', space: 'O(R*C)' },
  },
  'dijkstra': {
    id: 'dijkstra',
    name: 'Dijkstra (Adj List)',
    overview: 'Dijkstra computes shortest paths from a source in graphs with non-negative edge weights using a priority queue.',
    howItWorks: [
      'Initialize distances as infinity except source = 0.',
      'Use a min-priority queue to pick the node with smallest tentative distance.',
      'Relax all outgoing edges; update neighbors and push to PQ when improved.',
      'Repeat until PQ empty; reconstruct path from parents.'
    ],
    complexity: { time: 'O(E log V)', space: 'O(V)', },
  },
  'dfs': {
    id: 'dfs',
    name: 'Depth-First Search',
    overview: 'DFS explores as far as possible along each branch before backtracking, useful for reachability and ordering.',
    howItWorks: [
      'Start at the source and mark it visited.',
      'Recursively explore an unvisited neighbor until none remain.',
      'Backtrack and continue with other neighbors.'
    ],
    complexity: { time: 'O(V+E)', space: 'O(V)', },
  },
  'astar': {
    id: 'astar',
    name: 'A* Search',
    overview: 'A* guides search using f(n) = g(n) + h(n), where g is path cost and h is a heuristic estimate of remaining cost.',
    howItWorks: [
      'Initialize g(start)=0, f(start)=h(start). Use a min-heap on f.',
      'Pop node with smallest f; if it is goal, reconstruct path.',
      'For each neighbor, compute tentative g and relax if improved; set f=g+h.',
      'Heuristic h must be admissible and consistent for optimality.'
    ],
    complexity: { time: 'Depends on h; up to O(E)', space: 'O(V)', },
  },
  'prim': {
    id: 'prim',
    name: "Prim's MST",
    overview: 'Prim grows a minimum spanning tree from a seed by repeatedly choosing the cheapest edge crossing the cut.',
    howItWorks: [
      'Start from an arbitrary node; keep a cut (visited set).',
      'Pick the minimum-weight edge connecting the cut to an unvisited node.',
      'Add that node and edge to the MST; repeat until all nodes are in the MST.'
    ],
    complexity: { time: 'O(E log V)', space: 'O(V)', },
  },
  'kruskal': {
    id: 'kruskal',
    name: "Kruskal's MST",
    overview: 'Kruskal sorts edges by weight and adds them if they do not create a cycle, using a DSU (Union-Find).',
    howItWorks: [
      'Sort all edges by increasing weight.',
      'Initialize each node as its own set (Union-Find).',
      'Iterate edges; union endpoints if they are in different sets (no cycle).'
    ],
    complexity: { time: 'O(E log E)', space: 'O(V)', },
  },
  'topo': {
    id: 'topo',
    name: 'Topological Sort',
    overview: 'Topological ordering of a DAG lists nodes so that every directed edge u→v goes from left to right.',
    howItWorks: [
      'Kahn’s algorithm: compute indegrees, enqueue zeros.',
      'Pop from queue, append to order, decrement neighbors; enqueue new zeros.',
      'If all nodes processed, order is valid; otherwise a cycle exists.'
    ],
    complexity: { time: 'O(V+E)', space: 'O(V)', },
  },
  'bellman-ford': {
    id: 'bellman-ford',
    name: 'Bellman-Ford',
    overview: 'Bellman-Ford relaxes edges up to V-1 times to compute single-source shortest paths, handling negative weights.',
    howItWorks: [
      'Initialize distances; repeatedly relax all edges V-1 times.',
      'One more pass detecting improvements implies a negative cycle.',
      'Parents allow path reconstruction if no negative cycle is reachable.'
    ],
    complexity: { time: 'O(VE)', space: 'O(V)', },
  },
}
