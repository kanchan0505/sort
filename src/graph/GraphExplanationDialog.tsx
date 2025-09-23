import React, { useMemo, useState } from 'react'
import { IconInfoCircle, IconX } from '@tabler/icons-react'
import { useGraphStore } from '@/graph/store/useGraphStore'
import { graphAlgoTheory } from '@/graph/algorithms/theory'

export default function GraphExplanationDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const algo = useGraphStore(s => s.algo)
  const events = useGraphStore(s => s.events)
  const cursor = useGraphStore(s => s.cursor)

  const theory = graphAlgoTheory[algo]
  const runComplete = cursor >= events.length - 1 && events.length > 0

  const summary = useMemo(() => {
    const bullets: string[] = []
    let visits = 0, relax = 0
    for (const ev of events) {
      if (ev.type === 'visit') visits++
      if (ev.type === 'relax') relax++
    }
    if (visits) bullets.push(`Visited ${visits} nodes`)
    if (relax) bullets.push(`Relaxed ${relax} edges`)
    if (algo === 'topo') bullets.push('Produced a topological order')
    if (algo === 'prim' || algo === 'kruskal') bullets.push('Constructed an MST')
    if (algo === 'bellman-ford') bullets.push('Detected negative cycles if present')
    return { bullets }
  }, [events, algo])

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-emerald-600 to-blue-600 text-white p-4 rounded-full shadow-2xl hover:shadow-emerald-500/25 transform hover:scale-110 transition-all duration-300 z-50"
        aria-label="Open Graph Theory"
      >
        <IconInfoCircle size={24} />
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-700 bg-slate-800/50">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">{theory.name}</h2>
            <p className="text-sm text-slate-400 mt-1">Graph algorithm theory and execution summary</p>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-700 rounded-lg transition-colors" aria-label="Close">
            <IconX size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-slate-900">
          <div className="grid md:grid-cols-2 gap-6">
            <section className="space-y-4">
              <p className="text-slate-200 text-sm leading-relaxed">{theory.overview}</p>
              <div>
                <h3 className="text-lg font-semibold mb-3 text-blue-400">How it works</h3>
                <ul className="space-y-2">
                  {theory.howItWorks.map((step, i) => (
                    <li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-800 border border-slate-700">
                      <span className="flex items-center justify-center w-6 h-6 bg-blue-500 text-white text-xs rounded-full font-semibold mt-0.5">{i+1}</span>
                      <span className="text-sm text-slate-200">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-slate-800 border border-slate-700">
                  <div className="text-xs text-slate-400 mb-1">Time</div>
                  <div className="font-mono text-green-400">{theory.complexity.time}</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-800 border border-slate-700">
                  <div className="text-xs text-slate-400 mb-1">Space</div>
                  <div className="font-mono text-blue-400">{theory.complexity.space}</div>
                </div>
              </div>
              {theory.notes?.length ? (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-yellow-400">Notes</h3>
                  <ul className="space-y-2">
                    {theory.notes.map((note, i) => (
                      <li key={i} className="p-3 rounded-lg bg-yellow-900/20 border border-yellow-700/30 text-sm text-yellow-200">{note}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </section>

            <section className="space-y-4">
              <h3 className="text-lg font-semibold mb-3 text-green-400">Execution Summary</h3>
              {!runComplete ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
                  <p className="text-slate-400">Summary will appear after the run completes</p>
                </div>
              ) : (
                <div className="max-h-64 overflow-y-auto border border-slate-700 rounded-lg bg-slate-800/50 p-4">
                  <div className="space-y-3">
                    {summary.bullets.map((b, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-800 border border-slate-700">
                        <span className="flex items-center justify-center w-5 h-5 bg-green-500 text-white text-xs rounded-full font-semibold mt-0.5">✓</span>
                        <span className="text-sm text-slate-200">{b}</span>
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
