import { algorithms } from '@/algorithms'
import type { SortingEvent } from '@/algorithms/types'

function applyEvents(initial: number[], events: SortingEvent[]): number[] {
  const arr = initial.slice()
  for (const ev of events) {
    if (ev.type === 'swap') {
      const { i, j } = ev
      if (i < arr.length && j < arr.length) {
        ;[arr[i], arr[j]] = [arr[j], arr[i]]
      }
    } else if (ev.type === 'overwrite') {
      if (ev.i < arr.length) arr[ev.i] = ev.value
    }
  }
  return arr
}

function isSorted(a: number[]) {
  for (let i = 1; i < a.length; i++) if (a[i-1] > a[i]) return false
  return true
}

export function runSelfCheck() {
  const testSets: number[][] = [
    [],
    [1],
    [2,1],
    [3,2,1],
    [5,1,4,2,8],
    [5,3,8,4,2,7,1,10],
  ]
  const results: string[] = []
  for (const [id, { run }] of Object.entries(algorithms) as any) {
    for (const input of testSets) {
      const gen = run(input)
      const events = Array.from(gen) as SortingEvent[]
      const out = applyEvents(input, events)
      if (!isSorted(out)) {
        console.error(`[SelfCheck] ${id} FAILED for input`, input, '=>', out)
        results.push(`${id}: FAIL`)
        break
      }
    }
    if (!results.find((r) => r.startsWith(`${(id as any)}:`))) {
      results.push(`${id}: PASS`)
    }
  }
  console.table(results.map(r => ({ result: r })))
}
