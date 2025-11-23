import React, { useMemo, useCallback, useState } from 'react'
import ReactFlow, { 
  Background, 
  Controls, 
  Node, 
  Edge, 
  Connection, 
  Position,
  useNodesState,
  useEdgesState,
  addEdge,
  ReactFlowProvider
} from 'reactflow'
import 'reactflow/dist/style.css'
import { useGraphStore } from '@/graph/store/useGraphStore'
import { IconTarget, IconFlag, IconRoute, IconPlus } from '@tabler/icons-react'

// Note: Using default node styling instead of custom component for better reactflow compatibility

function GraphPanel({ nodes: initialNodes, edges: initialEdges }: { nodes: Node[]; edges: Edge[] }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const gStart = useGraphStore(s => s.gStart)
  const gGoal = useGraphStore(s => s.gGoal)
  const setGraphStart = useGraphStore(s => s.setGraphStart)
  const setGraphGoal = useGraphStore(s => s.setGraphGoal)
  const graph = useGraphStore(s => s.graph)
  const setGraph = useGraphStore(s => s.setGraph)

  const onConnect = useCallback((connection: Connection) => {
    if (!connection.source || !connection.target) return
    setEdges((eds) => addEdge({ ...connection, animated: true }, eds))
    
    const u = connection.source
    const v = connection.target
    setGraph({
      ...graph,
      [u]: [...(graph[u] || []).filter(e => e.to !== v), { to: v, w: 1 }],
      [v]: graph[v] || [],
    })
  }, [setEdges, graph, setGraph])

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    if (event.shiftKey) {
      setGraphGoal(node.id === gGoal ? undefined : node.id)
    } else if (event.ctrlKey || event.metaKey) {
      setGraphStart(node.id)
    }
  }, [gStart, gGoal, setGraphStart, setGraphGoal])

  React.useEffect(() => {
    setNodes(initialNodes)
    setEdges(initialEdges)
  }, [initialNodes, initialEdges, setNodes, setEdges])

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeClick={onNodeClick}
      fitView
      snapToGrid={true}
      snapGrid={[20, 20]}
    >
      <Background color="#475569" gap={12} />
      <Controls />
    </ReactFlow>
  )
}

export default function InteractiveGraphPanel() {
  const graph = useGraphStore(s => s.graph)
  const visited = useGraphStore(s => s.visitedSet())
  const path = useGraphStore(s => s.currentPath())
  const mst = useGraphStore(s => s.mstEdgeSet())

  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    const ids = Object.keys(graph).length > 0 ? Object.keys(graph) : ['a', 'b', 'c']
    const positions = [
      { x: 150, y: 100 }, { x: 400, y: 50 }, { x: 650, y: 100 }, 
      { x: 400, y: 250 }, { x: 250, y: 350 }, { x: 550, y: 350 }, 
      { x: 100, y: 450 }, { x: 700, y: 450 }
    ]
    
    const newNodes: Node[] = ids.map((id, idx) => ({
      id,
      type: 'default',
      position: positions[idx % positions.length],
      data: { label: id.toUpperCase() },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      style: {
        background: path.includes(id) ? '#2563eb' : visited.has(id) ? '#9333ea' : '#334155',
        border: path.includes(id) ? '2px solid #60a5fa' : visited.has(id) ? '2px solid #c084fc' : '2px solid #64748b',
        color: '#e2e8f0',
        borderRadius: '8px',
        padding: '8px 16px',
        fontSize: '14px',
        fontWeight: 600,
      }
    }))
    
    const newEdges: Edge[] = []
    const edgeSet = new Set<string>()
    
    for (const u of Object.keys(graph)) {
      for (const { to: v, w } of graph[u]) {
        const key = u < v ? `${u}-${v}` : `${v}-${u}`
        if (edgeSet.has(key)) continue
        edgeSet.add(key)
        
        const inMst = mst.has(key.includes('|') ? key : `${u < v ? u : v}|${u < v ? v : u}`)
        const inPath = path.includes(u) && path.includes(v)
        
        newEdges.push({ 
          id: key, 
          source: u, 
          target: v, 
          label: String(w),
          animated: inPath,
          style: {
            strokeWidth: inMst ? 3 : inPath ? 2.5 : 2,
            stroke: inMst ? '#f59e0b' : inPath ? '#3b82f6' : '#94a3b8',
          },
          labelStyle: { 
            fill: '#e2e8f0', 
            fontWeight: 600, 
            fontSize: 12,
          },
        })
      }
    }
    
    return { nodes: newNodes, edges: newEdges }
  }, [graph, visited, path, mst])

  return (
    <div className="panel p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full"></div>
          <h2 className="text-xl font-bold text-white">Interactive Graph</h2>
        </div>
        <div className="text-xs text-slate-400 space-y-1">
          <div><strong>Ctrl+Click:</strong> Set Start • <strong>Shift+Click:</strong> Set Goal</div>
          <div><strong>Drag:</strong> Move nodes • <strong>Connect:</strong> Drag from output handle</div>
        </div>
      </div>
      
      <div className="h-[500px] rounded-xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-600">
        <ReactFlowProvider>
          <GraphPanel nodes={initialNodes} edges={initialEdges} />
        </ReactFlowProvider>
      </div>
    </div>
  )
}
