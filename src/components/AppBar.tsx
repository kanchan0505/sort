import React from 'react'
import { IconPalette, IconEyeStar, IconChartBar, IconVolume, IconSun, IconMoon } from '@tabler/icons-react'
import { useAppStore } from '@/store/useAppStore'
import { useNavigate } from 'react-router-dom'

export default function AppBar() {
  const navigate = useNavigate()
  const palette = useAppStore((s) => s.palette)
  const setPalette = useAppStore((s) => s.setPalette)
  const glow = useAppStore((s) => s.glow)
  const toggleGlow = useAppStore((s) => s.toggleGlow)
  const showRange = useAppStore((s) => s.showRange)
  const toggleRange = useAppStore((s) => s.toggleRange)
  const theme = useAppStore((s) => s.theme)
  const toggleTheme = useAppStore((s) => s.toggleTheme)
  const audioEnabled = useAppStore((s) => s.audioEnabled)
  const toggleAudio = useAppStore((s) => s.toggleAudio)

  return (
    <div className="bg-slate-900/80 border-b border-slate-700 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-baseline gap-6">
          <div className="flex items-baseline gap-3">
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              SortFlow
            </h1>
            <span className="text-sm text-slate-400 animate-pulse">
              Interactive algorithm visualizer
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/graphs')}
              className="px-3 py-1 text-sm rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-all hover:scale-105"
            >
              Graphs
            </button>
            <button
              onClick={() => navigate('/trees')}
              className="px-3 py-1 text-sm rounded-lg bg-green-600 hover:bg-green-700 text-white transition-all hover:scale-105"
            >
              Trees
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Visual Controls */}
          <div className="flex items-center gap-3 px-3 py-1 rounded-lg bg-slate-800 border border-slate-600">
            <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-blue-400 transition-colors">
              <input 
                type="checkbox" 
                checked={glow} 
                onChange={toggleGlow}
                className="w-3 h-3 accent-blue-500 rounded"
              />
              <IconEyeStar size={16} />
              Glow
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-purple-400 transition-colors">
              <input 
                type="checkbox" 
                checked={showRange} 
                onChange={toggleRange}
                className="w-3 h-3 accent-purple-500 rounded"
              />
              <IconChartBar size={16} />
              Range
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-green-400 transition-colors">
              <input 
                type="checkbox" 
                checked={audioEnabled} 
                onChange={toggleAudio}
                className="w-3 h-3 accent-green-500 rounded"
              />
              <IconVolume size={16} />
              Audio
            </label>
          </div>

          {/* Palette Selector */}
          <div className="flex items-center gap-2">
            <IconPalette size={16} className="text-slate-400" />
            <select
              className="bg-slate-800 border border-slate-600 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={palette}
              onChange={(e) => setPalette(e.target.value as any)}
            >
              <option value="default">Default</option>
              <option value="high-contrast">High Contrast</option>
              <option value="colorblind">Colorblind Safe</option>
            </select>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-all transform hover:scale-105 active:scale-95"
          >
            {theme === 'dark' ? <IconSun size={16} /> : <IconMoon size={16} />}
            <span className="text-sm font-medium">
              {theme === 'dark' ? 'Light' : 'Dark'}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}