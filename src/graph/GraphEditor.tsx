import React, { useMemo, useCallback } from 'react'
import ReactFlow, { Background, Controls, Node, Edge, addEdge, Connection, OnConnect } from 'reactflow'
import { useGraphStore } from '@/graph/store/useGraphStore'

export default function GraphEditor() {
  const graph = useGraphStore(s => s.graph)
  const setGraph = useGraphStore(s => s.setGraph)

  const nodes = useMemo<Node[]>(() => {
    const ids = Object.keys(graph)
    return ids.map((id, idx) => ({ id, position: { x: 80 + (idx%4)*160, y: 80 + Math.floor(idx/4)*120 }, data: { label: id } }))
  }, [graph])

  const edges = useMemo<Edge[]>(() => {
    const arr: Edge[] = []
    for (const u of Object.keys(graph)) for (const { to, w } of graph[u]) arr.push({ id: `${u}-${to}`, source: u, target: to, label: String(w) })
    return arr
  }, [graph])

  const onConnect: OnConnect = useCallback((conn: Connection) => {
    if (!conn.source || !conn.target) return
    const u = conn.source, v = conn.target
    setGraph({
      ...graph,
      [u]: [...(graph[u] || []), { to: v, w: 1 }],
      [v]: graph[v] || [],
    })
  }, [graph, setGraph])

  return (
    <div className="panel p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-3 h-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"></div>
        <h2 className="text-lg font-semibold">Graph Editor (drag nodes, connect edges)</h2>
      </div>
      <div className="h-[400px] rounded-lg overflow-hidden bg-slate-800">
        <ReactFlow nodes={nodes} edges={edges} onConnect={onConnect as any} fitView>
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </div>
  )
}
