import type { SortingEvent, AlgoGenerator } from './types'

export const insertionSort: AlgoGenerator = function* (arr: number[]): Generator<SortingEvent> {
  const a = arr.slice()
  for (let i = 1; i < a.length; i++) {
    let key = a[i]
    let j = i - 1
    while (j >= 0) {
      yield { type: 'compare', i: j, j: j + 1 }
      if (a[j] > key) {
        a[j + 1] = a[j]
        yield { type: 'overwrite', i: j + 1, value: a[j] }
        j--
      } else break
    }
    a[j + 1] = key
    yield { type: 'overwrite', i: j + 1, value: key }
  }
  yield { type: 'done' }
}
