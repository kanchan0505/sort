import React, { useMemo, useState } from 'react'
import { IconSettings, IconPlayerPlay, IconPlayerPause, IconPlayerTrackPrev, IconPlayerTrackNext, IconRefresh, IconDice, IconBolt } from '@tabler/icons-react'
import { algorithmOptions } from '@/algorithms'
import { useAppStore } from '@/store/useAppStore'

export default function ControlPanel() {
  const [size, setSize] = useState(32)
  const algo = useAppStore((s) => s.algo)
  const setAlgo = useAppStore((s) => s.setAlgo)
  const randomize = useAppStore((s) => s.randomize)
  const generate = useAppStore((s) => s.generate)
  const play = useAppStore((s) => s.play)
  const pause = useAppStore((s) => s.pause)
  const step = useAppStore((s) => s.step)
  const setSpeed = useAppStore((s) => s.setSpeed)
  const speed = useAppStore((s) => s.speed)
  const playing = useAppStore((s) => s.playing)
  const events = useAppStore((s) => s.events)
  const cursor = useAppStore((s) => s.cursor)

  const progress = useMemo(() => (events.length ? ((cursor + 1) / events.length) * 100 : 0), [events, cursor])

  return (
    <div className="panel p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
        <h2 className="text-lg font-semibold">Controls</h2>
      </div>
      
      <div className="flex flex-wrap gap-4 items-center">
        {/* Algorithm Selection */}
        <div className="flex items-center gap-3 bg-slate-800 border border-slate-600 rounded-lg p-3">
          <IconSettings size={18} className="text-slate-400" />
          <label className="text-sm font-medium text-slate-300">Algorithm</label>
          <select
            className="bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={algo}
            onChange={(e) => setAlgo(e.target.value as any)}
          >
            {algorithmOptions.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>
        </div>

        {/* Array Controls */}
        <div className="flex items-center gap-3 bg-slate-800 border border-slate-600 rounded-lg p-3">
          <label className="text-sm font-medium text-slate-300">Size</label>
          <input
            type="number"
            className="w-20 bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={size}
            min={5}
            max={256}
            onChange={(e) => setSize(Math.max(5, Math.min(256, Number(e.target.value))))}
          />
          <button 
            className="btn-primary hover:scale-105 active:scale-95 flex items-center gap-2" 
            onClick={() => randomize(size)}
          >
            <IconDice size={16} />
            Randomize
          </button>
          <button 
            className="btn-primary hover:scale-105 active:scale-95 flex items-center gap-2" 
            onClick={generate}
          >
            <IconBolt size={16} />
            Generate
          </button>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2 bg-slate-800 border border-slate-600 rounded-lg p-3">
          <button 
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${playing ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white hover:scale-105 active:scale-95`}
            onClick={playing ? pause : play}
          >
            {playing ? <IconPlayerPause size={16} /> : <IconPlayerPlay size={16} />}
            {playing ? 'Pause' : 'Play'}
          </button>
          <button 
            className="px-4 py-2 rounded-lg font-medium bg-gray-600 hover:bg-gray-700 text-white transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2" 
            onClick={() => step(-1)}
          >
            <IconPlayerTrackPrev size={16} />
            Back
          </button>
          <button 
            className="px-4 py-2 rounded-lg font-medium bg-gray-600 hover:bg-gray-700 text-white transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2" 
            onClick={() => step(1)}
          >
            <IconPlayerTrackNext size={16} />
            Step
          </button>
        </div>

        {/* Speed Control */}
        <div className="flex items-center gap-3 bg-slate-800 border border-slate-600 rounded-lg p-3">
          <IconRefresh size={18} className="text-slate-400" />
          <label className="text-sm font-medium text-slate-300">Speed</label>
          <input
            type="range"
            min={0.25}
            max={5}
            step={0.25}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-24"
          />
          <span className="w-12 text-right text-sm font-mono text-slate-300">{speed.toFixed(2)}x</span>
        </div>
      </div>
    </div>
  )
}
