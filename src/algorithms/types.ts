export type SortingEvent =
  | { type: 'compare'; i: number; j: number }
  | { type: 'swap'; i: number; j: number }
  | { type: 'overwrite'; i: number; value: number }
  | { type: 'pivot'; index: number }
  | { type: 'range'; left: number; right: number }
  | { type: 'partition'; left: number; right: number; pivot: number }
  | { type: 'merge'; left: number; mid: number; right: number }
  | { type: 'snapshot' }
  | { type: 'done' }

export type AlgoGenerator = (arr: number[]) => Generator<SortingEvent, void, unknown>

export type AlgorithmId =
  | 'bubble'
  | 'insertion'
  | 'selection'
  | 'merge'
  | 'quick'
  | 'heap'
