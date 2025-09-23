import React from 'react'
import { useGraphStore } from '@/graph/store/useGraphStore'
import { IconListNumbers, IconArrowDownCircle, IconBolt, IconAlertTriangle, IconTopologyStar3 } from '@tabler/icons-react'

export default function GraphMetricsPanel() {
  const metrics = useGraphStore(s => s.metrics)
  const topo = useGraphStore(s => s.topoOrder())
  const neg = useGraphStore(s => s.negativeCycle())
  const cur = useGraphStore(s => s.currentEvent())

  return (
    <div className="panel p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-lime-500 rounded-full"></div>
        <IconTopologyStar3 size={20} className="text-emerald-400" />
        <h2 className="text-lg font-semibold">Metrics</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3">
          <div className="text-slate-400 text-sm flex items-center gap-2"><IconBolt size={16}/>Visits</div>
          <div className="text-2xl font-semibold mt-1">{metrics.visits}</div>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3">
          <div className="text-slate-400 text-sm flex items-center gap-2"><IconArrowDownCircle size={16}/>Relax</div>
          <div className="text-2xl font-semibold mt-1">{metrics.relaxations}</div>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3">
          <div className="text-slate-400 text-sm flex items-center gap-2">Enq</div>
          <div className="text-2xl font-semibold mt-1">{metrics.enq}</div>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3">
          <div className="text-slate-400 text-sm flex items-center gap-2">Deq</div>
          <div className="text-2xl font-semibold mt-1">{metrics.deq}</div>
        </div>
      </div>
      {topo.length > 0 && (
        <div className="mt-4 bg-slate-800 border border-slate-700 rounded-lg p-3">
          <div className="text-slate-400 text-sm flex items-center gap-2"><IconListNumbers size={16}/>Topological Order</div>
          <div className="mt-1 font-mono text-sm text-slate-200 break-all">{topo.join(' → ')}</div>
        </div>
      )}
      {neg && (
        <div className="mt-4 bg-red-900/30 border border-red-700 rounded-lg p-3">
          <div className="text-red-300 text-sm flex items-center gap-2"><IconAlertTriangle size={16}/>Negative Cycle Detected</div>
          {neg.length > 0 && <div className="mt-1 font-mono text-sm text-red-200 break-all">{neg.join(' → ')}</div>}
        </div>
      )}
      {cur && (
        <div className="mt-4 text-xs text-slate-400">
          Current: <code className="font-mono">{JSON.stringify(cur)}</code>
        </div>
      )}
    </div>
  )
}
