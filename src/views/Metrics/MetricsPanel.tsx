import React from 'react'
import { IconSearch, IconArrowsSort, IconEdit, IconChartLine } from '@tabler/icons-react'
import { useAppStore } from '@/store/useAppStore'

export default function MetricsPanel() {
  const metrics = useAppStore((s) => s.metrics())
  const total = useAppStore((s) => s.events.length)
  const cursor = useAppStore((s) => s.cursor)

  const metricsData = [
    { label: 'Comparisons', value: metrics.comparisons, icon: IconSearch, color: 'text-blue-400' },
    { label: 'Swaps', value: metrics.swaps, icon: IconArrowsSort, color: 'text-purple-400' },
    { label: 'Overwrites', value: metrics.overwrites, icon: IconEdit, color: 'text-green-400' },
    { label: 'Progress', value: `${Math.max(cursor, 0)} / ${total}`, icon: IconChartLine, color: 'text-yellow-400' },
  ]

  return (
    <div className="panel p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"></div>
        <h2 className="text-lg font-semibold">Performance Metrics</h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metricsData.map((metric, i) => {
          const IconComponent = metric.icon
          return (
            <div 
              key={metric.label}
              className="bg-slate-800 border border-slate-600 rounded-lg p-4 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg animate-in"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex justify-center mb-2">
                <IconComponent size={24} className={metric.color} />
              </div>
              <div className="text-xs text-slate-400 mb-1">{metric.label}</div>
              <div className={`text-xl font-bold ${metric.color}`}>{metric.value}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
