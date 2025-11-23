import type { SortingEvent } from '@/algorithms/types'

export type Timeline = {
  events: SortingEvent[]
  snapshots: Array<{ index: number; state: number[] }>
}

export function buildTimeline(events: Iterable<SortingEvent>, initial: number[], snapshotEvery = 50): Timeline {
  const arr: SortingEvent[] = []
  const snaps: Array<{ index: number; state: number[] }> = []
  let count = 0
  let currentState: number[] = initial.slice()
  
  for (const ev of events) {
    arr.push(ev)
    
    // Update state for snapshot
    if (ev.type === 'swap' && currentState.length > Math.max(ev.i, ev.j)) {
      [currentState[ev.i], currentState[ev.j]] = [currentState[ev.j], currentState[ev.i]]
    } else if (ev.type === 'overwrite' && currentState.length > ev.i) {
      currentState[ev.i] = ev.value
    }
    
    count++
    if (count % snapshotEvery === 0) {
      snaps.push({ index: arr.length - 1, state: currentState.slice() })
    }
  }
  
  return { events: arr, snapshots: snaps }
}

export function replayToArray(initial: number[], events: SortingEvent[], endIdx: number, snapshots?: Array<{ index: number; state: number[] }>): number[] {
  // Validate endIdx
  if (endIdx < -1) return initial.slice()
  
  // Find the closest snapshot before endIdx
  let startState = initial.slice()
  let startIdx = -1
  
  if (snapshots) {
    for (const snap of snapshots) {
      if (snap.index <= endIdx && snap.index > startIdx) {
        startState = snap.state.slice()
        startIdx = snap.index
      }
    }
  }
  
  // Replay from snapshot to target
  const targetIdx = Math.min(endIdx, events.length - 1)
  for (let k = startIdx + 1; k <= targetIdx; k++) {
    const ev = events[k]
    switch (ev.type) {
      case 'swap': {
        const { i, j } = ev
        if (i < startState.length && j < startState.length) {
          [startState[i], startState[j]] = [startState[j], startState[i]]
        }
        break
      }
      case 'overwrite': {
        if (ev.i < startState.length) {
          startState[ev.i] = ev.value
        }
        break
      }
      default:
        break
    }
  }
  return startState
}
