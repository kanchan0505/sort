 
import React, { useEffect } from 'react'
import { IconChartBar } from '@tabler/icons-react'
import AppBar from '@/components/AppBar'
import BarsCanvas from '@/views/BarsViewport/BarsCanvas'
import ControlPanel from '@/views/Controls/ControlPanel'
import MetricsPanel from '@/views/Metrics/MetricsPanel'
import ExplanationDialog from '@/components/ExplanationDialog'
import { useAppStore } from '@/store/useAppStore'
import { runSelfCheck } from '@/utils/selfCheck'

export default function App() {
  const generate = useAppStore((s) => s.generate)
  const randomize = useAppStore((s) => s.randomize)
  const seek = useAppStore((s) => s.seek)
  const eventsLen = useAppStore((s) => s.events.length)
  const cursor = useAppStore((s) => s.cursor)
  const play = useAppStore((s) => s.play)
  const pause = useAppStore((s) => s.pause)
  const step = useAppStore((s) => s.step)
  
  useEffect(() => {
    randomize(32)
    generate()
    const isDev = (import.meta as any).env ? (import.meta as any).env.DEV : process.env.NODE_ENV !== 'production'
    if (isDev) {
      try { runSelfCheck() } catch (e) { console.warn('SelfCheck error', e) }
    }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault()
        play()
      } else if (e.key === 'ArrowRight') step(1)
      else if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="h-screen flex flex-col bg-slate-900 overflow-hidden">
      <AppBar />
      
      <main className="flex-1 flex flex-col gap-4 p-6 overflow-y-auto overflow-x-hidden min-h-0">
        <div className="space-y-4">
          <ControlPanel />
          
          <div className="panel p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-300">Timeline Progress</span>
              <span className="text-xs text-slate-400">{Math.max(cursor, 0)} / {eventsLen}</span>
            </div>
            <input
              type="range"
              min={-1}
              max={Math.max(eventsLen - 1, -1)}
              value={cursor}
              onChange={(e) => seek(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
          
          <div className="panel p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
              <IconChartBar size={20} className="text-blue-400" />
              <h2 className="text-lg font-semibold">Sorting Visualization</h2>
            </div>
            <div className="h-[500px] rounded-lg overflow-hidden bg-slate-800">
              <BarsCanvas />
            </div>
          </div>
          
          <MetricsPanel />
        </div>
      </main>
      
      <ExplanationDialog />
    </div>
  )
}
