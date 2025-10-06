import React, { useState } from 'react'
import { IconSettings, IconPlayerPlay, IconPlayerPause, IconPlayerTrackPrev, IconPlayerTrackNext, IconBolt, IconSearch, IconEdit, IconCheck, IconX } from '@tabler/icons-react'
import { useTreeStore } from './store/useTreeStore'
import { treeAlgorithmOptions } from './algorithms'

export default function TreeControlsPanel() {
  const [manualInput, setManualInput] = useState('')
  const [showManualInput, setShowManualInput] = useState(false)
  const [inputError, setInputError] = useState('')

  const algo = useTreeStore(s => s.algo)
  const setAlgo = useTreeStore(s => s.setAlgo)
  const input = useTreeStore(s => s.input)
  const setInput = useTreeStore(s => s.setInput)
  const searchValue = useTreeStore(s => s.searchValue)
  const setSearchValue = useTreeStore(s => s.setSearchValue)
  const mode = useTreeStore(s => s.mode)
  const setMode = useTreeStore(s => s.setMode)
  const generate = useTreeStore(s => s.generate)
  const generateSearch = useTreeStore(s => s.generateSearch)
  const play = useTreeStore(s => s.play)
  const pause = useTreeStore(s => s.pause)
  const step = useTreeStore(s => s.step)
  const setSpeed = useTreeStore(s => s.setSpeed)
  const speed = useTreeStore(s => s.speed)
  const playing = useTreeStore(s => s.playing)
  const events = useTreeStore(s => s.events)
  const cursor = useTreeStore(s => s.cursor)

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
      
      if (numbers.length > 20) {
        setInputError('Maximum 20 numbers allowed for tree visualization')
        return
      }
      
      setInput(numbers)
      setInputError('')
      setShowManualInput(false)
      setManualInput('')
    } catch (e) {
      setInputError('Please enter valid numbers separated by commas (e.g., 10,5,15,3,7)')
    }
  }

  return (
    <div className="space-y-4">
      {/* Algorithm Selection */}
      <div className="panel p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
          <h2 className="text-lg font-semibold">Tree Controls</h2>
        </div>
        
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-3 bg-slate-800 border border-slate-600 rounded-lg p-3">
            <IconSettings size={18} className="text-slate-400" />
            <label className="text-sm font-medium text-slate-300">Algorithm</label>
            <select
              className="bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              value={algo}
              onChange={(e) => setAlgo(e.target.value as any)}
            >
              {treeAlgorithmOptions.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
          </div>

          {/* Mode Selection */}
          <div className="flex items-center gap-2 bg-slate-800 border border-slate-600 rounded-lg p-2">
            <button
              className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                mode === 'insert' 
                ? 'bg-blue-600 text-white' 
                : 'text-slate-400 hover:text-white'
              }`}
              onClick={() => setMode('insert')}
            >
              Insert
            </button>
            <button
              className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                mode === 'search' 
                ? 'bg-yellow-600 text-white' 
                : 'text-slate-400 hover:text-white'
              }`}
              onClick={() => setMode('search')}
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Input Controls */}
      <div className="panel p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
          <h2 className="text-lg font-semibold">Input Configuration</h2>
        </div>

        {/* Tree Input */}
        <div className="mb-4">
          <div className="flex items-center gap-3 bg-slate-800 border border-slate-600 rounded-lg p-3">
            <label className="text-sm font-medium text-slate-300">Tree Values ({input.length} items)</label>
            {!showManualInput ? (
              <>
                <div className="text-sm text-slate-400 font-mono">
                  [{input.join(', ')}]
                </div>
                <button 
                  className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg transition-all hover:scale-105 active:scale-95 flex items-center gap-2" 
                  onClick={() => setShowManualInput(true)}
                >
                  <IconEdit size={16} />
                  Edit
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="text"
                  placeholder="Enter numbers: 10,5,15,3,7,12,18"
                  className="flex-1 bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  value={manualInput}
                  onChange={(e) => { setManualInput(e.target.value); setInputError(''); }}
                  onKeyDown={(e) => e.key === 'Enter' && handleManualInput()}
                />
                <button 
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition-all hover:scale-105 active:scale-95" 
                  onClick={handleManualInput}
                >
                  <IconCheck size={16} />
                </button>
                <button 
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition-all hover:scale-105 active:scale-95" 
                  onClick={() => { setShowManualInput(false); setManualInput(''); setInputError(''); }}
                >
                  <IconX size={16} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Search Input */}
        <div className="flex items-center gap-3 bg-slate-800 border border-slate-600 rounded-lg p-3">
          <IconSearch size={18} className="text-slate-400" />
          <label className="text-sm font-medium text-slate-300">Search Value</label>
          <input
            type="number"
            className="w-24 bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
            value={searchValue}
            onChange={(e) => setSearchValue(Number(e.target.value))}
          />
          <button 
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded-lg transition-all hover:scale-105 active:scale-95 flex items-center gap-2" 
            onClick={generateSearch}
            disabled={input.length === 0}
          >
            <IconSearch size={16} />
            Search
          </button>
        </div>

        {/* Error Message */}
        {inputError && (
          <div className="mt-3 bg-red-900/50 border border-red-700 rounded-lg p-3 text-red-300 text-sm">
            {inputError}
          </div>
        )}
      </div>

      {/* Generation & Playback Controls */}
      <div className="panel p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <button 
            className="btn-primary hover:scale-105 active:scale-95 flex items-center gap-2" 
            onClick={generate}
          >
            <IconBolt size={16} />
            Generate Tree
          </button>

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

        {/* Progress */}
        {events.length > 0 && (
          <div className="mt-4 panel p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-300">Animation Progress</span>
              <span className="text-xs text-slate-400">{Math.max(cursor, 0)} / {events.length}</span>
            </div>
            <input
              type="range"
              min={-1}
              max={Math.max(events.length - 1, -1)}
              value={cursor}
              onChange={(e) => useTreeStore.getState().seek(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        )}
      </div>
    </div>
  )
}