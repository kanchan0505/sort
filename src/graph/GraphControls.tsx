import React from 'react'
import { graphAlgorithmOptions } from '@/graph/algorithms'
import { useGraphStore } from '@/graph/store/useGraphStore'
import { IconSettings, IconBolt, IconPlayerPlay, IconPlayerPause, IconPlayerTrackPrev, IconPlayerTrackNext, IconRefresh } from '@tabler/icons-react'

export default function GraphControls() {
  const algo = useGraphStore(s => s.algo)
  const setAlgo = useGraphStore(s => s.setAlgo)
  const generate = useGraphStore(s => s.generate)
  const play = useGraphStore(s => s.play)
  const pause = useGraphStore(s => s.pause)
  const step = useGraphStore(s => s.step)
  const playing = useGraphStore(s => s.playing)
  const speed = useGraphStore(s => s.speed)
  const setSpeed = useGraphStore(s => s.setSpeed)
  const gStart = useGraphStore(s => s.gStart)
  const setGraphStart = useGraphStore(s => s.setGraphStart)
  const gGoal = useGraphStore(s => s.gGoal)
  const setGraphGoal = useGraphStore(s => s.setGraphGoal)

  return (
    <div className="panel p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
        <h2 className="text-lg font-semibold">Graph Controls</h2>
      </div>
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-3 bg-slate-800 border border-slate-600 rounded-lg p-3">
          <IconSettings size={18} className="text-slate-400" />
          <label className="text-sm font-medium text-slate-300">Algorithm</label>
          <select
            className="bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-sm"
            value={algo}
            onChange={(e)=> setAlgo(e.target.value as any)}
          >
            {graphAlgorithmOptions.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
          </select>
          <button className="btn-primary flex items-center gap-2" onClick={generate}>
            <IconBolt size={16} /> Generate
          </button>
        </div>
        <div className="flex items-center gap-2 bg-slate-800 border border-slate-600 rounded-lg p-3">
          <button className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${playing ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white`} onClick={playing ? pause : play}>
            {playing ? <IconPlayerPause size={16}/> : <IconPlayerPlay size={16}/>} {playing ? 'Pause' : 'Play'}
          </button>
          <button className="px-4 py-2 rounded-lg font-medium bg-gray-600 hover:bg-gray-700 text-white flex items-center gap-2" onClick={()=>step(-1)}>
            <IconPlayerTrackPrev size={16}/> Back
          </button>
          <button className="px-4 py-2 rounded-lg font-medium bg-gray-600 hover:bg-gray-700 text-white flex items-center gap-2" onClick={()=>step(1)}>
            <IconPlayerTrackNext size={16}/> Step
          </button>
        </div>
        <div className="flex items-center gap-3 bg-slate-800 border border-slate-600 rounded-lg p-3">
          <IconRefresh size={18} className="text-slate-400" />
          <label className="text-sm font-medium text-slate-300">Speed</label>
          <input type="range" min={0.25} max={5} step={0.25} value={speed} onChange={(e)=>setSpeed(Number(e.target.value))} className="w-24" />
          <span className="w-12 text-right text-sm font-mono text-slate-300">{speed.toFixed(2)}x</span>
        </div>
        <div className="flex items-center gap-3 bg-slate-800 border border-slate-600 rounded-lg p-3">
          <label className="text-sm font-medium text-slate-300">Start</label>
          <input className="w-20 bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-sm" value={gStart} onChange={(e)=>setGraphStart(e.target.value)} />
          <label className="text-sm font-medium text-slate-300">Goal</label>
          <input className="w-20 bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-sm" value={gGoal ?? ''} onChange={(e)=>setGraphGoal(e.target.value || undefined)} />
        </div>
      </div>
    </div>
  )
}
