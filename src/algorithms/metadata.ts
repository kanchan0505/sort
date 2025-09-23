import type { AlgorithmId } from './types'

export type AlgoTheory = {
  name: string
  howItWorks: string[]
  properties: {
    time: { best: string; average: string; worst: string }
    space: string
    stable: boolean
    inPlace: boolean
  }
  notes?: string[]
}

export const algoTheory: Record<AlgorithmId, AlgoTheory> = {
  bubble: {
    name: 'Bubble Sort',
    howItWorks: [
      'Repeatedly step through the list, compare adjacent pairs, and swap if out of order.',
      'Each pass bubbles the largest remaining element to the end.',
      'Stop early if a full pass makes no swaps (already sorted).',
    ],
    properties: {
      time: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
      space: 'O(1)',
      stable: true,
      inPlace: true,
    },
  },
  insertion: {
    name: 'Insertion Sort',
    howItWorks: [
      'Treat the left part as a growing sorted list.',
      'Take the next element and insert it into the correct position in the sorted part.',
      'Shift larger elements to make space for the insertion.',
    ],
    properties: {
      time: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
      space: 'O(1)',
      stable: true,
      inPlace: true,
    },
  },
  selection: {
    name: 'Selection Sort',
    howItWorks: [
      'For each position i, find the minimum in the unsorted suffix.',
      'Swap that minimum into position i.',
      'Repeat for i+1 onward.',
    ],
    properties: {
      time: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
      space: 'O(1)',
      stable: false,
      inPlace: true,
    },
  },
  merge: {
    name: 'Merge Sort',
    howItWorks: [
      'Divide the array into halves recursively until size 1.',
      'Merge two sorted halves by repeatedly taking the smaller head element.',
      'Combine results up the recursion to produce the final sorted array.',
    ],
    properties: {
      time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
      space: 'O(n)',
      stable: true,
      inPlace: false,
    },
  },
  quick: {
    name: 'Quick Sort (Lomuto)',
    howItWorks: [
      'Choose a pivot (here: the rightmost element).',
      'Partition: elements ≤ pivot go left; > pivot go right.',
      'Recursively sort the left and right partitions.',
    ],
    properties: {
      time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' },
      space: 'O(log n) expected (recursion stack)',
      stable: false,
      inPlace: true,
    },
    notes: ['Performance depends on pivot selection; randomized pivots reduce worst-case risk.'],
  },
  heap: {
    name: 'Heap Sort',
    howItWorks: [
      'Build a max-heap from the array.',
      'Repeat: swap max (root) with the end, reduce heap size, heapify the root.',
      'Continue until the heap shrinks to size 1.',
    ],
    properties: {
      time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
      space: 'O(1)',
      stable: false,
      inPlace: true,
    },
  },
}
