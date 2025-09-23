import type { SortingEvent, AlgoGenerator } from './types'

export const quickSort: AlgoGenerator = function* (arr: number[]): Generator<SortingEvent> {
  const a = arr.slice()
  function* partition(l: number, r: number): Generator<SortingEvent, number, unknown> {
    const pivot = a[r]
    yield { type: 'pivot', index: r }
    let i = l
    for (let j = l; j < r; j++) {
      yield { type: 'compare', i: j, j: r }
      if (a[j] <= pivot) {
        if (i !== j) {
          ;[a[i], a[j]] = [a[j], a[i]]
          yield { type: 'swap', i, j }
        }
        i++
      }
    }
    if (i !== r) {
      ;[a[i], a[r]] = [a[r], a[i]]
      yield { type: 'swap', i, j: r }
    }
    return i
  }

  function* sort(l: number, r: number): Generator<SortingEvent> {
    if (l >= r) return
    yield { type: 'partition', left: l, right: r, pivot: r }
    const p = (yield* partition(l, r)) as unknown as number
    yield* sort(l, p - 1)
    yield* sort(p + 1, r)
  }
  if (a.length) yield* sort(0, a.length - 1)
  yield { type: 'done' }
}
