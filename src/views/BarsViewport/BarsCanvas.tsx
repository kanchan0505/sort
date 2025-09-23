import React, { useMemo, useRef, useEffect } from 'react'
import { useBarsRenderer } from './useBarsRenderer'
import { useAppStore } from '@/store/useAppStore'
import { audioFeedback } from '@/utils/audio'

export default function BarsCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const values = useAppStore((s) => s.currentArray())
  const cursor = useAppStore((s) => s.cursor)
  const events = useAppStore((s) => s.events)
  const palette = useAppStore((s) => s.palette)
  const glow = useAppStore((s) => s.glow)
  const showRange = useAppStore((s) => s.showRange)
  const audioEnabled = useAppStore((s) => s.audioEnabled)
  const prevCursorRef = useRef(cursor)
  
  // Audio feedback on events
  useEffect(() => {
    if (!audioEnabled || cursor <= prevCursorRef.current) {
      prevCursorRef.current = cursor
      return
    }
    
    const event = events[cursor]
    if (event) {
      switch (event.type) {
        case 'compare':
          audioFeedback.compare()
          break
        case 'swap':
          audioFeedback.swap()
          break
        case 'pivot':
          audioFeedback.pivot()
          break
        case 'overwrite':
          audioFeedback.overwrite()
          break
      }
    }
    prevCursorRef.current = cursor
  }, [cursor, audioEnabled, events])
  const active = useMemo(() => {
    const ev = events[cursor]
    if (!ev) return {}
    if (ev.type === 'compare' || ev.type === 'swap') return { i: ev.i, j: ev.j }
    if (ev.type === 'pivot') return { pivot: ev.index }
    // search back for a range/partition/merge to shade
    for (let k = cursor; k >= 0; k--) {
      const e = events[k]
      if (e.type === 'range') return { range: { l: e.left, r: e.right } }
      if (e.type === 'partition') return { pivot: e.pivot, range: { l: e.left, r: e.right } }
      if (e.type === 'merge') return { range: { l: e.left, r: e.right } }
    }
    return {}
  }, [cursor, events])
  useBarsRenderer(canvasRef, { values, active, palette, glow, showRange })
  return <canvas ref={canvasRef} className="w-full h-full" />
}
