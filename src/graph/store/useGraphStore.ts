import { create } from 'zustand'
import type { GraphEvent } from '@/graph/algorithms/types'
import { graphAlgorithms } from '@/graph/algorithms'

type Grid = number[][]

type State = {
  algo: string
  events: GraphEvent[]
  cursor: number
  playing: boolean
  speed: number
  // grid setup
  grid: Grid
  start: [number, number]
  goal: [number, number]
  // graph setup
  graph: Record<string, Array<{ to: string; w: number }>>
  gStart: string
  gGoal?: string
  // metrics
  metrics: { visits: number; relaxations: number; enq: number; deq: number }
}

type Actions = {
  setAlgo: (a: State['algo']) => void
  setGrid: (g: Grid) => void
  setStart: (s: [number, number]) => void
  setGoal: (g: [number, number]) => void
  setGraph: (g: State['graph']) => void
  setGraphStart: (s: string) => void
  setGraphGoal: (s?: string) => void
  generate: () => void
  play: () => void
  pause: () => void
  step: (n?: number) => void
  seek: (i: number) => void
  setSpeed: (s: number) => void
  currentPath: () => string[]
  visitedSet: () => Set<string>
  mstEdgeSet: () => Set<string>
  topoOrder: () => string[]
  negativeCycle: () => string[] | undefined
  currentEvent: () => GraphEvent | undefined
}

export const useGraphStore = create<State & Actions>((set, get) => ({
  algo: 'bfs-grid',
  events: [],
  cursor: -1,
  playing: false,
  speed: 1,
  grid: Array.from({ length: 15 }, () => Array.from({ length: 24 }, () => 0)),
  start: [1, 1],
  goal: [13, 22],
  graph: {
    a: [{ to: 'b', w: 1 }, { to: 'd', w: 4 }],
    b: [{ to: 'c', w: 3 }],
    c: [],
    d: [{ to: 'c', w: 2 }],
  },
  gStart: 'a',
  gGoal: 'c',
  metrics: { visits: 0, relaxations: 0, enq: 0, deq: 0 },

  setAlgo(a) { set({ algo: a }) },
  setGrid(g) { set({ grid: g }) },
  setStart(s) { set({ start: s }) },
  setGoal(g) { set({ goal: g }) },
  setGraph(g) { set({ graph: g }) },
  setGraphStart(s) { set({ gStart: s }) },
  setGraphGoal(s) { set({ gGoal: s }) },

  generate() {
    const { algo, grid, start, goal, graph, gStart, gGoal } = get()
    const run = graphAlgorithms[algo].run
    let events: GraphEvent[] = []
    if (algo === 'bfs-grid') {
      events = Array.from(run(grid, start, goal)) as GraphEvent[]
    } else if (algo === 'dijkstra') {
      events = Array.from(run(graph, gStart, gGoal)) as GraphEvent[]
    } else if (algo === 'dfs') {
      events = Array.from(run(graph, gStart)) as GraphEvent[]
    } else if (algo === 'astar') {
      const h = (v: string) => 0 // placeholder heuristic; can be wired to coordinates
      events = Array.from(run(graph, gStart, gGoal ?? gStart, h)) as GraphEvent[]
    } else if (algo === 'prim') {
      events = Array.from(run(graph, gStart)) as GraphEvent[]
    } else if (algo === 'kruskal') {
      events = Array.from(run(graph)) as GraphEvent[]
    } else if (algo === 'topo') {
      events = Array.from(run(graph)) as GraphEvent[]
    } else if (algo === 'bellman-ford') {
      events = Array.from(run(graph, gStart, gGoal)) as GraphEvent[]
    }
    set({ events, cursor: -1, metrics: { visits: 0, relaxations: 0, enq: 0, deq: 0 } })
  },
  play() {
    // helper to compute metrics up to a cursor index
    const computeMetrics = (events: GraphEvent[], upto: number) => {
      const m = { visits: 0, relaxations: 0, enq: 0, deq: 0 }
      for (let i = 0; i <= upto && i < events.length; i++) {
        const ev = events[i]
        if (!ev) continue
        if (ev.type === 'visit') m.visits++
        else if (ev.type === 'relax') m.relaxations++
        else if (ev.type === 'enqueue') m.enq++
        else if (ev.type === 'dequeue') m.deq++
      }
      return m
    }

    const tick = () => {
      const { cursor, events, playing, speed } = get()
      if (!playing) return
      const next = Math.min(cursor + 1, events.length - 1)
      set({ cursor: next, metrics: computeMetrics(events, next) })
      if (next >= events.length - 1) set({ playing: false })
      else setTimeout(tick, Math.max(16, 1000 / (30 * speed)))
    }
    set({ playing: true })
    setTimeout(tick, 0)
  },
  pause() { set({ playing: false }) },
  step(n = 1) {
    const { cursor, events } = get()
    const next = Math.max(-1, Math.min(cursor + n, events.length - 1))
    // recompute metrics up to next
    const m = (()=>{
      const mm = { visits: 0, relaxations: 0, enq: 0, deq: 0 }
      for (let i = 0; i <= next && i < events.length; i++) {
        const ev = events[i]
        if (!ev) continue
        if (ev.type === 'visit') mm.visits++
        else if (ev.type === 'relax') mm.relaxations++
        else if (ev.type === 'enqueue') mm.enq++
        else if (ev.type === 'dequeue') mm.deq++
      }
      return mm
    })()
    set({ cursor: next, metrics: m })
  },
  seek(i) {
    const max = get().events.length - 1
    const next = Math.max(-1, Math.min(i, max))
    const events = get().events
    const m = (()=>{
      const mm = { visits: 0, relaxations: 0, enq: 0, deq: 0 }
      for (let j = 0; j <= next && j < events.length; j++) {
        const ev = events[j]
        if (!ev) continue
        if (ev.type === 'visit') mm.visits++
        else if (ev.type === 'relax') mm.relaxations++
        else if (ev.type === 'enqueue') mm.enq++
        else if (ev.type === 'dequeue') mm.deq++
      }
      return mm
    })()
    set({ cursor: next, metrics: m })
  },
  setSpeed(s) { set({ speed: Math.max(0.1, Math.min(s, 20)) }) },
  currentPath() {
    const { events, cursor } = get()
    for (let i = cursor; i >= 0; i--) {
      const ev = events[i]
      if (ev.type === 'path') return ev.nodes
    }
    return []
  },
  visitedSet() {
    const { events, cursor } = get()
    const s = new Set<string>()
    for (let i = 0; i <= cursor && i < events.length; i++) {
      const ev = events[i]
      if (ev.type === 'visit' || ev.type === 'enqueue' || ev.type === 'dequeue') s.add((ev as any).node)
    }
    return s
  },
  mstEdgeSet() {
    const { events, cursor } = get()
    const setU = new Set<string>()
    const key = (u: string, v: string) => u < v ? `${u}|${v}` : `${v}|${u}`
    for (let i = 0; i <= cursor && i < events.length; i++) {
      const ev = events[i]
      if (ev.type === 'connect') setU.add(key(ev.u, ev.v))
    }
    return setU
  },
  topoOrder() {
    const { events, cursor } = get()
    for (let i = cursor; i >= 0; i--) {
      const ev = events[i]
      if (ev.type === 'order') return ev.nodes
    }
    return []
  },
  negativeCycle() {
    const { events, cursor } = get()
    for (let i = cursor; i >= 0; i--) {
      const ev = events[i]
      if (ev.type === 'negativeCycle') return ev.cycle
    }
    return undefined
  },
  currentEvent() {
    const { events, cursor } = get()
    if (cursor >= 0 && cursor < events.length) return events[cursor]
    return undefined
  },
}))
