import type { SortingEvent } from '@/algorithms/types'

export type RunSummary = {
  bullets: string[]
}

export function narrateRun(events: SortingEvent[]): RunSummary {
  const bullets: string[] = []
  let compares = 0,
    swaps = 0,
    overwrites = 0
  let partitions = 0,
    merges = 0,
    ranges = 0,
    pivots = 0

  for (const ev of events) {
    switch (ev.type) {
      case 'compare':
        compares++
        break
      case 'swap':
        swaps++
        break
      case 'overwrite':
        overwrites++
        break
      case 'partition':
        partitions++
        bullets.push(`Partitioned subarray [${ev.left}, ${ev.right}] around pivot @${ev.pivot}.`)
        break
      case 'merge':
        merges++
        bullets.push(`Merged ranges [${ev.left}, ${ev.mid}] and [${ev.mid + 1}, ${ev.right}].`)
        break
      case 'range':
        ranges++
        break
      case 'pivot':
        pivots++
        bullets.push(`Chose pivot at index ${ev.index}.`)
        break
      case 'snapshot':
      case 'done':
        break
    }
  }

  bullets.unshift(
    `Compared elements ${compares} time${compares === 1 ? '' : 's'}.`,
    swaps ? `Swapped elements ${swaps} time${swaps === 1 ? '' : 's'}.` : 'No swaps needed in some passes.',
    overwrites ? `Performed ${overwrites} overwrites (typical in merge-based strategies).` : ''
  )

  if (partitions) bullets.push(`Performed ${partitions} partition step${partitions === 1 ? '' : 's'}.`)
  if (merges) bullets.push(`Performed ${merges} merge step${merges === 1 ? '' : 's'}.`)
  if (pivots) bullets.push(`Selected ${pivots} pivot${pivots === 1 ? '' : 's'}.`)

  return { bullets: bullets.filter(Boolean) }
}
