import type { AlgoGenerator, AlgorithmId } from './types'
import { bubbleSort } from './bubble'
import { insertionSort } from './insertion'
import { selectionSort } from './selection'
import { mergeSort } from './merge'
import { quickSort } from './quick'
import { heapSort } from './heap'

export const algorithms: Record<AlgorithmId, { name: string; run: AlgoGenerator }> = {
  bubble: { name: 'Bubble Sort', run: bubbleSort },
  insertion: { name: 'Insertion Sort', run: insertionSort },
  selection: { name: 'Selection Sort', run: selectionSort },
  merge: { name: 'Merge Sort', run: mergeSort },
  quick: { name: 'Quick Sort (Lomuto)', run: quickSort },
  heap: { name: 'Heap Sort', run: heapSort },
}

export const algorithmOptions = (Object.entries(algorithms) as [AlgorithmId, { name: string }][]).map(
  ([id, { name }]) => ({ id, name })
)
