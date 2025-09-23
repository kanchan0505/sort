import React, { useCallback, useEffect, useMemo, useState } from 'react'
import ReactFlow, { Background, Controls, MiniMap, Node, Edge, NodeProps, Position } from 'reactflow'
import 'reactflow/dist/style.css'
import { useAppStore } from '@/store/useAppStore'

type FlowNodeData = {
  label: string
  eventIndex: number
  type: 'partition' | 'merge' | 'range' | 'pivot'
  depth: number
  active?: boolean
}

function FlowNode({ data }: NodeProps<FlowNodeData>) {
  const seek = useAppStore((s) => s.seek)
  const cursor = useAppStore((s) => s.cursor)
  const isActive = data.eventIndex <= cursor
  
  const handleClick = useCallback(() => {
    seek(data.eventIndex)
  }, [data.eventIndex, seek])
  
  const getNodeStyle = () => {
    const baseClasses = "px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 border-2 shadow-lg backdrop-blur-sm"
    
    if (data.type === 'partition') {
      return `${baseClasses} ${isActive 
        ? 'bg-blue-600/90 border-blue-400 shadow-blue-500/30 scale-105' 
        : 'bg-blue-900/60 border-blue-600/50 hover:border-blue-400 hover:shadow-blue-500/20'}`
    } else if (data.type === 'merge') {
      return `${baseClasses} ${isActive 
        ? 'bg-purple-600/90 border-purple-400 shadow-purple-500/30 scale-105' 
        : 'bg-purple-900/60 border-purple-600/50 hover:border-purple-400 hover:shadow-purple-500/20'}`
    } else if (data.type === 'pivot') {
      return `${baseClasses} ${isActive 
        ? 'bg-yellow-600/90 border-yellow-400 shadow-yellow-500/30 scale-105' 
        : 'bg-yellow-900/60 border-yellow-600/50 hover:border-yellow-400 hover:shadow-yellow-500/20'}`
    } else {
      return `${baseClasses} ${isActive 
        ? 'bg-green-600/90 border-green-400 shadow-green-500/30 scale-105' 
        : 'bg-green-900/60 border-green-600/50 hover:border-green-400 hover:shadow-green-500/20'}`
    }
  }
  
  return (
    <div
      onClick={handleClick}
      className={getNodeStyle()}
      style={{ minWidth: '140px' }}
    >
      <div className="text-sm font-semibold text-white">{data.label}</div>
      <div className="text-xs text-slate-200 mt-1">
        {isActive ? '✓ Executed' : 'Click to seek'}
      </div>
    </div>
  )
}

export default function AlgorithmFlow() {
  const cursor = useAppStore((s) => s.cursor)
  const events = useAppStore((s) => s.events)
  const [nodes, setNodes] = useState<Node<FlowNodeData>[]>([])
  const [edges, setEdges] = useState<Edge[]>([])

  const nodeTypes = useMemo(() => ({
    flowNode: FlowNode
  }), [])

  const compute = useMemo(() => {
    const nodes: Node<FlowNodeData>[] = []
    const edges: Edge[] = []
    let id = 0
    const levelCounts: Record<number, number> = {}
    
    // First pass: collect all merge/partition events
    const relevantEvents = events
      .map((ev, idx) => ({ ...ev, eventIndex: idx }))
      .filter(ev => ev.type === 'partition' || ev.type === 'merge' || ev.type === 'pivot' || ev.type === 'range')
    
    // Group by depth for better tree visualization
    for (let k = 0; k < relevantEvents.length; k++) {
      const ev = relevantEvents[k]
      if (ev.eventIndex > cursor) break
      
      const depth = Math.floor(k / 3) // Simple depth calculation
      levelCounts[depth] = (levelCounts[depth] || 0) + 1
      
      const nid = `${id++}`
      let label = ''
      
      if (ev.type === 'partition') {
        label = `Partition [${ev.left},${ev.right}]`
      } else if (ev.type === 'merge') {
        label = `Merge [${ev.left},${ev.right}]`
      } else if (ev.type === 'pivot') {
        label = `Pivot @${ev.index}`
      } else if (ev.type === 'range') {
        label = `Range [${ev.left},${ev.right}]`
      }
      
      // Improved layout - horizontal spread and vertical layers
      const x = 100 + (levelCounts[depth] - 1) * 200
      const y = 80 + depth * 120
      
      nodes.push({
        id: nid,
        position: { x, y },
        type: 'flowNode',
        data: {
          label,
          eventIndex: ev.eventIndex,
          type: ev.type as any,
          depth,
          active: ev.eventIndex <= cursor
        },
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top
      })
      
      // Connect to previous node in same level or parent level
      if (id > 1) {
        const prevId = `${id - 2}`
        edges.push({
          id: `e${prevId}-${nid}`,
          source: prevId,
          target: nid,
          animated: ev.eventIndex <= cursor,
          style: { 
            stroke: ev.type === 'partition' ? '#3b82f6' 
                   : ev.type === 'merge' ? '#a855f7'
                   : ev.type === 'pivot' ? '#eab308'
                   : '#10b981',
            strokeWidth: ev.eventIndex <= cursor ? 3 : 1,
            opacity: ev.eventIndex <= cursor ? 1 : 0.5
          }
        })
      }
    }
    
    return { nodes, edges }
  }, [cursor, events])

  useEffect(() => {
    const t = setTimeout(() => {
      setNodes(compute.nodes)
      setEdges(compute.edges)
    }, 16)
    return () => clearTimeout(t)
  }, [compute])

  return (
    <div className="w-full h-full relative">
      <ReactFlow 
        nodes={nodes} 
        edges={edges} 
        nodeTypes={nodeTypes}
        fitView 
        fitViewOptions={{ padding: 0.2 }}
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}
        defaultViewport={{ x: 0, y: 0, zoom: 0.7 }}
        minZoom={0.3}
        maxZoom={1.5}
      >
        <MiniMap 
          maskColor="rgba(15, 23, 42, 0.8)" 
          nodeColor={(node) => {
            const data = node.data as FlowNodeData
            return data.type === 'partition' ? '#3b82f6' 
                 : data.type === 'merge' ? '#a855f7'
                 : data.type === 'pivot' ? '#eab308'
                 : '#10b981'
          }} 
          nodeStrokeColor="rgba(203, 213, 225, 0.5)"
          className="!bg-slate-800/50 !border-slate-600"
        />
        <Controls 
          showInteractive={false}
          className="!bg-slate-800/50 !border-slate-600"
        />
        <Background 
          color="rgba(100, 116, 139, 0.3)" 
          gap={20} 
          size={1}
        />
      </ReactFlow>
      
      {/* Legend */}
      <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur rounded-lg p-3 border border-slate-700">
        <div className="text-xs font-semibold text-slate-300 mb-2">Legend</div>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-slate-300">Partition</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded"></div>
            <span className="text-slate-300">Merge</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span className="text-slate-300">Pivot</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-slate-300">Range</span>
          </div>
        </div>
      </div>
    </div>
  )
}
