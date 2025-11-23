import React, { useMemo } from 'react'
import ReactFlow, { Background, Controls, Node, Edge, Position, ReactFlowProvider } from 'reactflow'
import 'reactflow/dist/style.css'
import { IconTopologyStar3 } from '@tabler/icons-react'
import { useGraphStore } from '@/graph/store/useGraphStore'

export default function GraphFlowPanel() {
  const visited = useGraphStore(s => s.visitedSet())
  const path = useGraphStore(s => s.currentPath())
  const graph = useGraphStore(s => s.graph)
  const mst = useGraphStore(s => s.mstEdgeSet())
  const neg = useGraphStore(s => s.negativeCycle())

  const { nodes, edges } = useMemo(() => {
    const ids = Object.keys(graph)
    const nodes: Node[] = ids.map((id, idx) => ({
      id,
      position: { x: 80 + (idx%4)*160, y: 80 + Math.floor(idx/4)*120 },
      data: { label: id.toUpperCase() },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    }))
    const edges: Edge[] = []
    for (const u of Object.keys(graph)) {
      for (const { to, w } of graph[u]) {
        const id = `${u}-${to}`
        edges.push({ id, source: u, target: to, label: String(w) })
      }
    }
    return { nodes, edges }
  }, [graph])

  return (
    <div className="panel p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
        <IconTopologyStar3 size={20} className="text-purple-400" />
        <h2 className="text-lg font-semibold">Graph View (React Flow)</h2>
      </div>
      <div className="h-[400px] rounded-lg overflow-hidden bg-slate-800">
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes.map(n => ({
              ...n,
              style: {
                border: '2px solid',
                borderColor: path.includes(n.id) ? '#22c55e' : visited.has(n.id) ? '#60a5fa' : '#334155',
                background: path.includes(n.id) ? '#14532d' : visited.has(n.id) ? '#0c4a6e' : '#0f172a',
                color: '#e2e8f0',
                borderRadius: 12,
                padding: 8,
              },
            }))}
            edges={edges.map(e => {
              const key = (u: string, v: string) => u < v ? `${u}|${v}` : `${v}|${u}`
              const inMst = mst.has(key(e.source, e.target))
              const inPath = path.includes(e.source) && path.includes(e.target)
              const negEdge = neg && neg.length > 0 && (()=>{
                for (let i = 0; i < neg.length; i++) {
                  const u = neg[i]
                  const v = neg[(i+1)%neg.length]
                  if ((u === e.source && v === e.target) || (u === e.target && v === e.source)) return true
                }
                return false
              })()
              return {
                ...e,
                style: {
                  strokeWidth: inMst ? 3 : 2,
                  stroke: negEdge ? '#ef4444' : inPath ? '#22c55e' : inMst ? '#f59e0b' : '#94a3b8',
                },
                labelStyle: { fill: '#e2e8f0', fontWeight: 600 },
              }
            })}
            fitView>
            <Controls />
            <Background />
          </ReactFlow>
        </ReactFlowProvider>
      </div>
    </div>
  )
}
