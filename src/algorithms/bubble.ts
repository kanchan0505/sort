import type { SortingEvent, AlgoGenerator } from './types'

export const bubbleSort: AlgoGenerator = function* (arr: number[]): Generator<SortingEvent> {
  const a = arr.slice()
  const n = a.length
  for (let i = 0; i < n - 1; i++) {
    let swapped = false
    for (let j = 0; j < n - i - 1; j++) {
      yield { type: 'compare', i: j, j: j + 1 }
      if (a[j] > a[j + 1]) {
        ;[a[j], a[j + 1]] = [a[j + 1], a[j]]
        yield { type: 'swap', i: j, j: j + 1 }
        swapped = true
      }
    }
    // Early exit if no swaps in a full pass (already sorted)
    if (!swapped) break
  }
  yield { type: 'done' }
}
