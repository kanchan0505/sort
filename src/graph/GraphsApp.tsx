import React, { useEffect } from 'react'
import GraphAppBar from './GraphAppBar'
import PageSlide from '@/components/PageSlide'
import MazePanel from '@/graph/MazePanel'
import InteractiveGraphPanel from '@/graph/InteractiveGraphPanel'
import { useGraphStore } from '@/graph/store/useGraphStore'
import GraphMetricsPanel from './GraphMetricsPanel'
import GraphExplanationDialog from './GraphExplanationDialog'

export default function GraphsApp() {
  const generate = useGraphStore(s => s.generate)
  useEffect(() => { generate() }, [])
  
  return (
    <div className="h-screen flex flex-col bg-slate-900">
      <GraphAppBar />
      <PageSlide>
        <main className="flex-1 p-6 overflow-y-auto overflow-x-hidden min-h-0 space-y-6">
          <GraphMetricsPanel />
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <MazePanel />
            <InteractiveGraphPanel />
          </div>
          <GraphExplanationDialog />
        </main>
      </PageSlide>
    </div>
  )
}
