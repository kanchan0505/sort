import { create } from 'zustand'
import { algorithms } from '@/algorithms'
import type { AlgorithmId, SortingEvent } from '@/algorithms/types'
import { buildTimeline, replayToArray } from '@/player/timeline'
import { createScheduler, type Scheduler } from '@/player/scheduler'
import { initializeTheme, setTheme, type Theme } from '@/utils/theme'

type State = {
  input: number[]
  algo: AlgorithmId
  events: SortingEvent[]
  snapshots: Array<{ index: number; state: number[] }>
  cursor: number
  playing: boolean
  speed: number
  scheduler?: Scheduler
  palette: 'default' | 'high-contrast' | 'colorblind'
  glow: boolean
  showRange: boolean
  theme: Theme
  audioEnabled: boolean
}

type Actions = {
  setInput: (arr: number[]) => void
  randomize: (n: number, seed?: number) => void
  setAlgo: (algo: AlgorithmId) => void
  generate: () => void
  play: () => void
  pause: () => void
  step: (n?: number) => void
  seek: (idx: number) => void
  setSpeed: (s: number) => void
  currentArray: () => number[]
  setPalette: (p: State['palette']) => void
  toggleGlow: () => void
  toggleRange: () => void
  toggleTheme: () => void
  toggleAudio: () => void
  metrics: () => { comparisons: number; swaps: number; overwrites: number }
}

function seededRandom(seed = 1) {
  return function () {
    seed = (seed * 1664525 + 1013904223) % 4294967296
    return seed / 4294967296
  }
}

export const useAppStore = create<State & Actions>((set, get) => ({
  input: Array.from({ length: 10 }, (_, i) => i + 1).sort(() => Math.random() - 0.5),
  algo: 'quick',
  events: [],
  snapshots: [],
  cursor: -1,
  playing: false,
  speed: 1,
  palette: 'default',
  glow: true,
  showRange: true,
  theme: initializeTheme(),
  audioEnabled: false,

  setInput(arr) {
    set({ input: arr })
  },
  randomize(n, seed) {
    const rnd = seed ? seededRandom(seed) : Math.random
    const arr = Array.from({ length: n }, () => Math.floor(rnd() * n) + 1)
    set({ input: arr })
  },
  setAlgo(algo) {
    set({ algo })
  },
  generate() {
    const { input, algo } = get()
    const gen = algorithms[algo].run(input)
    const timeline = buildTimeline(gen, input)
    const scheduler = createScheduler(timeline.events.length, (cursor) => set({ cursor }))
    set({ events: timeline.events, snapshots: timeline.snapshots, scheduler, cursor: -1 })
  },
  play() {
    const { scheduler } = get()
    if (!scheduler) return
    scheduler.play()
    set({ playing: true })
  },
  pause() {
    const { scheduler } = get()
    if (!scheduler) return
    scheduler.pause()
    set({ playing: false })
  },
  step(n = 1) {
    const { scheduler } = get()
    if (!scheduler) return
    scheduler.step(n)
  },
  seek(idx) {
    const { scheduler } = get()
    if (!scheduler) return
    scheduler.seek(idx)
  },
  setSpeed(s) {
    const { scheduler } = get()
    if (!scheduler) return
    scheduler.setSpeed(s)
    set({ speed: s })
  },
  currentArray() {
    const { input, events, snapshots, cursor } = get()
    return replayToArray(input, events, cursor, snapshots)
  },
  setPalette(p) {
    set({ palette: p })
  },
  toggleGlow() {
    set((s) => ({ glow: !s.glow }))
  },
  toggleRange() {
    set((s) => ({ showRange: !s.showRange }))
  },
  toggleTheme() {
    set((s) => {
      const newTheme = s.theme === 'dark' ? 'light' : 'dark'
      setTheme(newTheme)
      return { theme: newTheme }
    })
  },
  toggleAudio() {
    set((s) => ({ audioEnabled: !s.audioEnabled }))
  },
  metrics() {
    const { events, cursor } = get()
    let comparisons = 0,
      swaps = 0,
      overwrites = 0
    for (let i = 0; i <= cursor && i < events.length; i++) {
      const ev = events[i]
      if (ev.type === 'compare') comparisons++
      else if (ev.type === 'swap') swaps++
      else if (ev.type === 'overwrite') overwrites++
    }
    return { comparisons, swaps, overwrites }
  },
}))
