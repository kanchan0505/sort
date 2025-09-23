import React, { useMemo, useState } from 'react'
import { IconInfoCircle, IconX, IconCheck, IconClock, IconCpu, IconRefresh, IconMapPin } from '@tabler/icons-react'
import { useAppStore } from '@/store/useAppStore'
import { algoTheory } from '@/algorithms/metadata'
import { narrateRun } from '@/utils/narrator'

export default function ExplanationDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const algo = useAppStore((s) => s.algo)
  const events = useAppStore((s) => s.events)
  const cursor = useAppStore((s) => s.cursor)
  const theory = algoTheory[algo]
  const [showLive, setShowLive] = useState(false)

  const runComplete = cursor >= events.length - 1 && events.length > 0
  const summary = useMemo(() => narrateRun(events), [events])

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:shadow-blue-500/25 transform hover:scale-110 transition-all duration-300 z-50 animate-bounce"
      >
        <IconInfoCircle size={24} />
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700 bg-slate-800/50">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {theory.name}
            </h2>
            <p className="text-sm text-slate-400 mt-1">Algorithm theory and execution summary</p>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm">
              <input 
                type="checkbox" 
                checked={showLive} 
                onChange={() => setShowLive((v) => !v)}
                className="w-4 h-4 accent-blue-500"
              />
              Live summary
            </label>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <IconX size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-900">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Theory Section */}
            <section className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-blue-400">
                  <IconMapPin size={20} />
                  How it works
                </h3>
                <ul className="space-y-2">
                  {theory.howItWorks.map((step, i) => (
                    <li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-800 border border-slate-700">
                      <span className="flex items-center justify-center w-6 h-6 bg-blue-500 text-white text-xs rounded-full font-semibold mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-sm text-slate-200">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Properties Grid */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-purple-400">
                  <IconClock size={20} />
                  Properties
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-slate-800 border border-slate-700">
                    <div className="text-xs text-slate-400 mb-1">Best case</div>
                    <div className="font-mono text-green-400">{theory.properties.time.best}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800 border border-slate-700">
                    <div className="text-xs text-slate-400 mb-1">Average</div>
                    <div className="font-mono text-yellow-400">{theory.properties.time.average}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800 border border-slate-700">
                    <div className="text-xs text-slate-400 mb-1">Worst case</div>
                    <div className="font-mono text-red-400">{theory.properties.time.worst}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800 border border-slate-700">
                    <div className="text-xs text-slate-400 mb-1 flex items-center gap-1">
                      <IconCpu size={12} />
                      Space
                    </div>
                    <div className="font-mono text-blue-400">{theory.properties.space}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800 border border-slate-700">
                    <div className="text-xs text-slate-400 mb-1">Stable</div>
                    <div className={`font-semibold flex items-center gap-1 ${theory.properties.stable ? 'text-green-400' : 'text-red-400'}`}>
                      {theory.properties.stable ? <IconCheck size={16} /> : <IconX size={16} />}
                      {theory.properties.stable ? 'Yes' : 'No'}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800 border border-slate-700">
                    <div className="text-xs text-slate-400 mb-1">In-place</div>
                    <div className={`font-semibold flex items-center gap-1 ${theory.properties.inPlace ? 'text-green-400' : 'text-red-400'}`}>
                      {theory.properties.inPlace ? <IconCheck size={16} /> : <IconX size={16} />}
                      {theory.properties.inPlace ? 'Yes' : 'No'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {theory.notes?.length ? (
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-yellow-400">
                    <IconInfoCircle size={20} />
                    Notes
                  </h3>
                  <ul className="space-y-2">
                    {theory.notes.map((note, i) => (
                      <li key={i} className="p-3 rounded-lg bg-yellow-900/20 border border-yellow-700/30 text-sm text-yellow-200">
                        💡 {note}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </section>

            {/* Execution Summary */}
            <section className="space-y-4">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-green-400">
                <IconRefresh size={20} />
                Execution Summary
              </h3>
              
              {!runComplete && !showLive ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                  <p className="text-slate-400">Summary will appear after the run completes</p>
                </div>
              ) : (
                <div className="max-h-64 overflow-y-auto border border-slate-700 rounded-lg bg-slate-800/50 p-4">
                  <div className="space-y-3">
                    {summary.bullets.map((bullet, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-800 border border-slate-700 animate-in slide-in-from-left duration-300" style={{ animationDelay: `${i * 100}ms` }}>
                        <span className="flex items-center justify-center w-5 h-5 bg-green-500 text-white text-xs rounded-full font-semibold mt-0.5">
                          <IconCheck size={12} />
                        </span>
                        <span className="text-sm text-slate-200">{bullet}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}