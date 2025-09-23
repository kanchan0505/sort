import type { SortingEvent, AlgoGenerator } from './types'

export const selectionSort: AlgoGenerator = function* (arr: number[]): Generator<SortingEvent> {
  const a = arr.slice()
  const n = a.length
  for (let i = 0; i < n - 1; i++) {
    let min = i
    for (let j = i + 1; j < n; j++) {
      yield { type: 'compare', i: min, j }
      if (a[j] < a[min]) min = j
    }
    if (min !== i) {
      ;[a[i], a[min]] = [a[min], a[i]]
      yield { type: 'swap', i, j: min }
    }
  }
  yield { type: 'done' }
}
