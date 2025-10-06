import React, { useMemo, useCallback, useState } from 'react'
import ReactFlow, { 
  Background, 
  Controls, 
  Node, 
  Edge, 
  Connection, 
  Position,
  NodeTypes,
  ReactFlowProvider
} from 'reactflow'
import { useGraphStore } from '@/graph/store/useGraphStore'
import { IconTarget, IconFlag, IconRoute } from '@tabler/icons-react'

// Custom node component for better visuals
function GraphNode({ data, selected }: { data: any; selected?: boolean }) {
  const visited = useGraphStore(s => s.visitedSet())
  const path = useGraphStore(s => s.currentPath())
  const gStart = useGraphStore(s => s.gStart)
  const gGoal = useGraphStore(s => s.gGoal)
  
  const isStart = data.id === gStart
  const isGoal = data.id === gGoal
  const isVisited = visited.has(data.id)
  const isInPath = path.includes(data.id)
  
  return (
    <div className={`
      px-6 py-4 rounded-xl border-2 transition-all duration-300 cursor-pointer
      min-w-[80px] min-h-[60px] flex items-center justify-center
      ${isStart ? 'bg-green-600 border-green-400 shadow-lg shadow-green-500/30' : 
        isGoal ? 'bg-red-600 border-red-400 shadow-lg shadow-red-500/30' :
        isInPath ? 'bg-blue-600 border-blue-400 shadow-lg shadow-blue-500/30' :
        isVisited ? 'bg-purple-600 border-purple-400 shadow-lg shadow-purple-500/30' :
        'bg-slate-700 border-slate-500 hover:border-slate-400'}
      ${selected ? 'ring-2 ring-white ring-opacity-60' : ''}
    `}>
      <div className="text-center">
        <div className="text-white font-bold text-lg">{data.label}</div>
        {isStart && <IconTarget className="w-4 h-4 text-white mx-auto mt-1" />}
        {isGoal && <IconFlag className="w-4 h-4 text-white mx-auto mt-1" />}
      </div>
    </div>
  )
}

const nodeTypes: NodeTypes = {
  graphNode: GraphNode
}

export default function InteractiveGraphPanel() {
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  
  const graph = useGraphStore(s => s.graph)
  const setGraph = useGraphStore(s => s.setGraph)
  const visited = useGraphStore(s => s.visitedSet())
  const path = useGraphStore(s => s.currentPath())
  const mst = useGraphStore(s => s.mstEdgeSet())
  const gStart = useGraphStore(s => s.gStart)
  const setGraphStart = useGraphStore(s => s.setGraphStart)
  const gGoal = useGraphStore(s => s.gGoal)
  const setGraphGoal = useGraphStore(s => s.setGraphGoal)

  // Update nodes and edges when graph state changes
  React.useEffect(() => {
    const ids = Object.keys(graph)
    const positions = [
      { x: 150, y: 150 }, { x: 400, y: 100 }, { x: 650, y: 150 }, { x: 400, y: 250 },
      { x: 250, y: 300 }, { x: 550, y: 300 }, { x: 150, y: 450 }, { x: 650, y: 450 }
    ]
    
    const newNodes: Node[] = ids.map((id, idx) => ({
      id,
      type: 'graphNode',
      position: positions[idx] || { x: 100 + (idx % 4) * 200, y: 100 + Math.floor(idx / 4) * 150 },
      data: { id, label: id.toUpperCase() },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    }))
    
    const newEdges: Edge[] = []
    for (const u of Object.keys(graph)) {
      for (const { to, w } of graph[u]) {
        const edgeId = `${u}-${to}`
        const key = (a: string, b: string) => a < b ? `${a}|${b}` : `${b}|${a}`
        const inMst = mst.has(key(u, to))
        const inPath = path.includes(u) && path.includes(to)
        
        newEdges.push({ 
          id: edgeId, 
          source: u, 
          target: to, 
          label: String(w),
          style: {
            strokeWidth: inMst ? 4 : inPath ? 3 : 2,
            stroke: inMst ? '#f59e0b' : inPath ? '#3b82f6' : '#64748b',
          },
          labelStyle: { 
            fill: '#e2e8f0', 
            fontWeight: 600, 
            fontSize: 14,
            background: '#1e293b',
            padding: '4px 8px',
            borderRadius: '4px'
          },
        })
      }
    }
    setNodes(newNodes)
    setEdges(newEdges)
  }, [graph, mst, path])

  const onConnect = useCallback((connection: Connection) => {
    if (!connection.source || !connection.target) return
    const u = connection.source, v = connection.target
    setGraph({
      ...graph,
      [u]: [...(graph[u] || []), { to: v, w: 1 }],
      [v]: graph[v] || [],
    })
  }, [graph, setGraph])

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    if (event.shiftKey) {
      setGraphGoal(node.id === gGoal ? undefined : node.id)
    } else if (event.ctrlKey || event.metaKey) {
      setGraphStart(node.id)
    }
  }, [gStart, gGoal, setGraphStart, setGraphGoal])

  return (
    <div className="panel p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full"></div>
          <h2 className="text-xl font-bold text-white">Interactive Graph</h2>
        </div>
        <div className="text-sm text-slate-400 space-y-1">
          <div>Ctrl+Click: Set Start • Shift+Click: Set Goal</div>
          <div>Drag nodes • Connect edges • Edit weights</div>
        </div>
      </div>
      
      <div className="h-[500px] rounded-xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-600">
        <ReactFlowProvider>
          <ReactFlow 
            nodes={nodes}
            edges={edges}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
            snapToGrid
            snapGrid={[20, 20]}
            defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          >
            <Controls className="bg-slate-800 border-slate-600" />
            <Background color="#475569" />
          </ReactFlow>
        </ReactFlowProvider>
      </div>
    </div>
  )
}