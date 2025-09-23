import type { SortingEvent, AlgoGenerator } from './types'

export const heapSort: AlgoGenerator = function* (arr: number[]): Generator<SortingEvent> {
  const a = arr.slice()
  const n = a.length

  function* heapify(n: number, i: number): Generator<SortingEvent> {
    let largest = i
    const l = 2 * i + 1
    const r = 2 * i + 2
    if (l < n) {
      yield { type: 'compare', i: l, j: largest }
      if (a[l] > a[largest]) largest = l
    }
    if (r < n) {
      yield { type: 'compare', i: r, j: largest }
      if (a[r] > a[largest]) largest = r
    }
    if (largest !== i) {
      ;[a[i], a[largest]] = [a[largest], a[i]]
      yield { type: 'swap', i, j: largest }
      yield* heapify(n, largest)
    }
  }

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) yield* heapify(n, i)
  for (let i = n - 1; i > 0; i--) {
    ;[a[0], a[i]] = [a[i], a[0]]
    yield { type: 'swap', i: 0, j: i }
    yield* heapify(i, 0)
  }
  yield { type: 'done' }
}
