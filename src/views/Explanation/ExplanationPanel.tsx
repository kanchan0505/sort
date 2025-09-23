import React, { useMemo, useState } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { algoTheory } from '@/algorithms/metadata'
import { narrateRun } from '@/utils/narrator'

export default function ExplanationPanel() {
  const algo = useAppStore((s) => s.algo)
  const events = useAppStore((s) => s.events)
  const cursor = useAppStore((s) => s.cursor)
  const theory = algoTheory[algo]
  const [showLive, setShowLive] = useState(false)

  const runComplete = cursor >= events.length - 1 && events.length > 0
  const summary = useMemo(() => narrateRun(events), [events])

  return (
    <div className="panel p-3">
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="text-sm opacity-70">Theory</div>
          <div className="text-lg font-semibold">{theory.name}</div>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={showLive} onChange={() => setShowLive((v) => !v)} />
          Show summary while running
        </label>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <section>
          <h3 className="font-semibold mb-1">How it works</h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            {theory.howItWorks.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
          <div className="grid grid-cols-2 gap-3 text-sm mt-3">
            <div>
              <div className="opacity-70 text-xs">Time (best)</div>
              <div>{theory.properties.time.best}</div>
            </div>
            <div>
              <div className="opacity-70 text-xs">Time (avg)</div>
              <div>{theory.properties.time.average}</div>
            </div>
            <div>
              <div className="opacity-70 text-xs">Time (worst)</div>
              <div>{theory.properties.time.worst}</div>
            </div>
            <div>
              <div className="opacity-70 text-xs">Space</div>
              <div>{theory.properties.space}</div>
            </div>
            <div>
              <div className="opacity-70 text-xs">Stable</div>
              <div>{theory.properties.stable ? 'Yes' : 'No'}</div>
            </div>
            <div>
              <div className="opacity-70 text-xs">In-place</div>
              <div>{theory.properties.inPlace ? 'Yes' : 'No'}</div>
            </div>
          </div>
          {theory.notes?.length ? (
            <ul className="list-disc list-inside space-y-1 text-xs mt-3 opacity-80">
              {theory.notes.map((n, i) => (
                <li key={i}>{n}</li>
              ))}
            </ul>
          ) : null}
        </section>
        <section>
          <h3 className="font-semibold mb-1">What happened in this run</h3>
          {!runComplete && !showLive ? (
            <div className="text-xs opacity-70">Summary will appear after the run completes.</div>
          ) : (
            <ul className="list-disc list-inside space-y-1 text-sm">
              {summary.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
