import React from 'react'
import { useNavigate } from 'react-router-dom'
import { IconArrowLeft, IconPlayerPlay, IconPlayerPause, IconPlayerTrackPrev, IconPlayerTrackNext, IconBolt, IconSettings } from '@tabler/icons-react'
import { useGraphStore } from '@/graph/store/useGraphStore'
import { graphAlgorithmOptions } from '@/graph/algorithms'

export default function GraphAppBar() {
  const navigate = useNavigate()
  const algo = useGraphStore(s => s.algo)
  const setAlgo = useGraphStore(s => s.setAlgo)
  const generate = useGraphStore(s => s.generate)
  const play = useGraphStore(s => s.play)
  const pause = useGraphStore(s => s.pause)
  const step = useGraphStore(s => s.step)
  const playing = useGraphStore(s => s.playing)
  const speed = useGraphStore(s => s.speed)
  const setSpeed = useGraphStore(s => s.setSpeed)
  const events = useGraphStore(s => s.events)

  const handleAlgoChange = (newAlgo: string) => {
    setAlgo(newAlgo)
    setTimeout(() => generate(), 0)
  }

  return (
    <header className="bg-slate-800/90 backdrop-blur-sm border-b border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-slate-700"
          >
            <IconArrowLeft size={20} />
            <span className="font-medium">SortFlow</span>
          </button>
          <div className="h-8 w-px bg-slate-600"></div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
            GraphFlow
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Algorithm Selector */}
          <div className="flex items-center gap-3 bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2">
            <IconSettings size={18} className="text-slate-400" />
            <select
              className="bg-transparent border-none text-sm font-medium text-slate-200 focus:outline-none"
              value={algo}
              onChange={(e) => handleAlgoChange(e.target.value as any)}
            >
              {graphAlgorithmOptions.map(o => <option key={o.id} value={o.id} className="bg-slate-800">{o.name}</option>)}
            </select>
            <button 
              className="ml-2 px-3 py-1 bg-gradient-to-r from-emerald-500 to-blue-500 text-white text-sm font-medium rounded-md hover:from-emerald-600 hover:to-blue-600 transition-all flex items-center gap-2"
              onClick={generate}
            >
              <IconBolt size={14} /> Generate
            </button>
          </div>

          {/* Playback Controls */}
          <div className="flex items-center gap-2 bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2">
            <button 
              className="px-3 py-1 rounded-md font-medium transition-all flex items-center gap-2 text-sm bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={playing ? pause : play}
              disabled={events.length === 0}
            >
              {playing ? <IconPlayerPause size={14}/> : <IconPlayerPlay size={14}/>}
            </button>
            <button 
              className="p-1 text-slate-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
              onClick={() => step(-1)}
              disabled={events.length === 0}
            >
              <IconPlayerTrackPrev size={16}/>
            </button>
            <button 
              className="p-1 text-slate-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
              onClick={() => step(1)}
              disabled={events.length === 0}
            >
              <IconPlayerTrackNext size={16}/>
            </button>
          </div>

          {/* Speed Control */}
          <div className="flex items-center gap-3 bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2">
            <label className="text-sm font-medium text-slate-300">Speed</label>
            <input 
              type="range" 
              min={0.25} 
              max={5} 
              step={0.25} 
              value={speed} 
              onChange={(e) => setSpeed(Number(e.target.value))} 
              className="w-20 slider" 
            />
            <span className="w-12 text-right text-sm font-mono text-slate-300">{speed.toFixed(1)}x</span>
          </div>
        </div>
      </div>
    </header>
  )
}
