import React, { useMemo, useState } from 'react'
import { IconSettings, IconPlayerPlay, IconPlayerPause, IconPlayerTrackPrev, IconPlayerTrackNext, IconRefresh, IconDice, IconBolt, IconEdit, IconCheck, IconX } from '@tabler/icons-react'
import { algorithmOptions } from '@/algorithms'
import { useAppStore } from '@/store/useAppStore'

export default function ControlPanel() {
  const [size, setSize] = useState(10)
  const [manualInput, setManualInput] = useState('')
  const [showManualInput, setShowManualInput] = useState(false)
  const [inputError, setInputError] = useState('')
  
  const algo = useAppStore((s) => s.algo)
  const setAlgo = useAppStore((s) => s.setAlgo)
  const randomize = useAppStore((s) => s.randomize)
  const setInput = useAppStore((s) => s.setInput)
  const generate = useAppStore((s) => s.generate)
  const currentArray = useAppStore((s) => s.currentArray())
  const play = useAppStore((s) => s.play)
  const pause = useAppStore((s) => s.pause)
  const step = useAppStore((s) => s.step)
  const setSpeed = useAppStore((s) => s.setSpeed)
  const speed = useAppStore((s) => s.speed)
  const playing = useAppStore((s) => s.playing)
  const events = useAppStore((s) => s.events)
  const cursor = useAppStore((s) => s.cursor)

  const progress = useMemo(() => (events.length ? ((cursor + 1) / events.length) * 100 : 0), [events, cursor])

  // Update array in store when size changes
  const handleSizeChange = (newSize: number) => {
    setSize(newSize);
    // Randomize new array with new size
    randomize(newSize);
  };

  const handleManualInput = () => {
    try {
      const numbers = manualInput.split(',').map(s => {
        const num = parseInt(s.trim())
        if (isNaN(num)) throw new Error('Invalid number')
        return num
      }).filter(n => !isNaN(n))
      
      if (numbers.length === 0) {
        setInputError('Please enter at least one number')
        return
      }
      
      if (numbers.length > 256) {
        setInputError('Maximum 256 numbers allowed')
        return
      }
      
      setInput(numbers)
      setInputError('')
      setShowManualInput(false)
      setManualInput('')
    } catch (e) {
      setInputError('Please enter valid numbers separated by commas (e.g., 5,2,8,1,9)')
    }
  }

  return (
    <div className="panel p-4 w-full">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
        <h2 className="text-lg font-semibold">Controls</h2>
      </div>

      {/* Responsive controls container */}
      <div className="flex flex-col gap-4 items-stretch sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
        {/* Algorithm Selection */}
  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-slate-800 border border-slate-600 rounded-lg p-3 w-full sm:w-auto">
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
  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-slate-800 border border-slate-600 rounded-lg p-3 w-full sm:w-auto">
          <label className="text-sm font-medium text-slate-300">Array ({currentArray.length} items)</label>
          {!showManualInput ? (
            <>
              <input
                type="number"
                className="w-full sm:w-20 bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={size}
                min={5}
                max={256}
                onChange={(e) => handleSizeChange(Math.max(5, Math.min(256, Number(e.target.value))))}
              />
              <button 
                className="btn-primary w-full sm:w-auto hover:scale-105 active:scale-95 flex items-center gap-2" 
                onClick={() => randomize(size)}
              >
                <IconDice size={16} />
                Randomize
              </button>
              <button 
                className="bg-purple-600 w-full sm:w-auto hover:bg-purple-700 text-white px-3 py-2 rounded-lg transition-all hover:scale-105 active:scale-95 flex items-center gap-2" 
                onClick={() => setShowManualInput(true)}
              >
                <IconEdit size={16} />
                Manual Input
              </button>
            </>
          ) : (
            <div className="flex flex-col sm:flex-row items-stretch gap-2 w-full">
              <input
                type="text"
                placeholder="Enter numbers: 5,2,8,1,9"
                className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                value={manualInput}
                onChange={(e) => { setManualInput(e.target.value); setInputError(''); }}
                onKeyDown={(e) => e.key === 'Enter' && handleManualInput()}
              />
              <div className="flex gap-2 sm:gap-0">
                <button 
                  className="bg-green-600 w-full sm:w-auto hover:bg-green-700 text-white px-3 py-2 rounded-lg transition-all hover:scale-105 active:scale-95" 
                  onClick={handleManualInput}
                >
                  <IconCheck size={16} />
                </button>
                <button 
                  className="bg-red-600 w-full sm:w-auto hover:bg-red-700 text-white px-3 py-2 rounded-lg transition-all hover:scale-105 active:scale-95" 
                  onClick={() => { setShowManualInput(false); setManualInput(''); setInputError(''); }}
                >
                  <IconX size={16} />
                </button>
              </div>
            </div>
          )}
          <button 
            className="btn-primary w-full sm:w-auto hover:scale-105 active:scale-95 flex items-center gap-2" 
            onClick={generate}
          >
            <IconBolt size={16} />
            Generate
          </button>
        </div>
        
        {/* Error Message */}
        {inputError && (
          <div className="bg-red-900/50 border border-red-700 rounded-lg p-3 text-red-300 text-sm w-full">
            {inputError}
          </div>
        )}

        {/* Playback Controls */}
  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-slate-800 border border-slate-600 rounded-lg p-3 w-full sm:w-auto">
          <button 
            className={`px-4 py-2 w-full sm:w-auto rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${playing ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white hover:scale-105 active:scale-95`}
            onClick={playing ? pause : play}
          >
            {playing ? <IconPlayerPause size={16} /> : <IconPlayerPlay size={16} />}
            {playing ? 'Pause' : 'Play'}
          </button>
          <button 
            className="px-4 py-2 w-full sm:w-auto rounded-lg font-medium bg-gray-600 hover:bg-gray-700 text-white transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2" 
            onClick={() => step(-1)}
          >
            <IconPlayerTrackPrev size={16} />
            Back
          </button>
          <button 
            className="px-4 py-2 w-full sm:w-auto rounded-lg font-medium bg-gray-600 hover:bg-gray-700 text-white transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2" 
            onClick={() => step(1)}
          >
            <IconPlayerTrackNext size={16} />
            Step
          </button>
        </div>

        {/* Speed Control */}
  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-slate-800 border border-slate-600 rounded-lg p-3 w-full sm:w-auto">
          <IconRefresh size={18} className="text-slate-400" />
          <label className="text-sm font-medium text-slate-300">Speed</label>
          <input
            type="range"
            min={0.25}
            max={5}
            step={0.25}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-full sm:w-24"
          />
          <span className="w-full sm:w-12 text-right text-sm font-mono text-slate-300">{speed.toFixed(2)}x</span>
        </div>
      </div>
    </div>
  )
}
