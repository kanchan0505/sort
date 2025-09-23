import type { GraphEvent, GraphAlgoGenerator } from './types'

export const bfsGrid: GraphAlgoGenerator = function* (
  grid: number[][],
  start: [number, number],
  goal: [number, number]
): Generator<GraphEvent> {
  const h = grid.length
  const w = grid[0]?.length ?? 0
  const inb = (r: number, c: number) => r >= 0 && c >= 0 && r < h && c < w
  const key = (r: number, c: number) => `${r},${c}`
  const from: Record<string, string | undefined> = {}
  const q: Array<[number, number]> = []
  const seen = new Set<string>()
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ]
  q.push(start)
  seen.add(key(...start))
  yield { type: 'setStart', node: key(...start) }
  yield { type: 'setGoal', node: key(...goal) }
  while (q.length) {
    const [r, c] = q.shift()!
    yield { type: 'dequeue', node: key(r, c) }
    if (r === goal[0] && c === goal[1]) break
    for (const [dr, dc] of dirs) {
      const nr = r + dr,
        nc = c + dc
      if (!inb(nr, nc) || grid[nr][nc] === 1) continue
      const k = key(nr, nc)
      if (!seen.has(k)) {
        seen.add(k)
        from[k] = key(r, c)
        yield { type: 'enqueue', node: k }
        q.push([nr, nc])
      }
    }
    yield { type: 'visit', node: key(r, c) }
  }
  // reconstruct
  const path: string[] = []
  let cur: string | undefined = key(...goal)
  if (!seen.has(cur)) {
    yield { type: 'done' }
    return
  }
  while (cur) {
    path.push(cur)
    cur = from[cur]
  }
  path.reverse()
  yield { type: 'path', nodes: path }
  yield { type: 'done' }
}
