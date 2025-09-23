import type { SortingEvent, AlgoGenerator } from './types'

export const mergeSort: AlgoGenerator = function* (arr: number[]): Generator<SortingEvent> {
  const a = arr.slice()
  function* merge(l: number, m: number, r: number): Generator<SortingEvent> {
    yield { type: 'merge', left: l, mid: m, right: r }
    const left = a.slice(l, m + 1)
    const right = a.slice(m + 1, r + 1)
    let i = 0,
      j = 0,
      k = l
    while (i < left.length && j < right.length) {
      yield { type: 'compare', i: l + i, j: m + 1 + j }
      if (left[i] <= right[j]) {
        a[k] = left[i]
        yield { type: 'overwrite', i: k, value: left[i] }
        i++
      } else {
        a[k] = right[j]
        yield { type: 'overwrite', i: k, value: right[j] }
        j++
      }
      k++
    }
    while (i < left.length) {
      a[k] = left[i]
      yield { type: 'overwrite', i: k, value: left[i] }
      i++
      k++
    }
    while (j < right.length) {
      a[k] = right[j]
      yield { type: 'overwrite', i: k, value: right[j] }
      j++
      k++
    }
  }

  function* sort(l: number, r: number): Generator<SortingEvent> {
    if (l >= r) return
    const m = Math.floor((l + r) / 2)
    yield { type: 'range', left: l, right: r }
    yield* sort(l, m)
    yield* sort(m + 1, r)
    yield* merge(l, m, r)
  }
  if (a.length) yield* sort(0, a.length - 1)
  yield { type: 'done' }
}
