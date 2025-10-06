import React, { useMemo } from 'react'
import { useTreeStore } from './store/useTreeStore'
import TreeNodeComponent from './components/TreeNode'
import TreeEdge from './components/TreeEdge'
import { IconTree, IconSearch, IconRoute, IconRefresh } from '@tabler/icons-react'

export default function TreeVisualizationPanel() {
  const nodes = useTreeStore(s => s.getAllNodes())
  const getNodePosition = useTreeStore(s => s.getNodePosition)
  const highlightedNodes = useTreeStore(s => s.getHighlightedNodes())
  const currentEvent = useTreeStore(s => s.getCurrentEvent())
  const rootNodeId = useTreeStore(s => s.rootNodeId)
  const mode = useTreeStore(s => s.mode)

  const edges = useMemo(() => {
    const edgeList: Array<{
      from: { x: number; y: number }
      to: { x: number; y: number }
      direction: 'left' | 'right'
      isHighlighted: boolean
    }> = []

    nodes.forEach(node => {
      const nodePos = getNodePosition(node.id)
      
      if (node.left) {
        const leftPos = getNodePosition(node.left.id)
        edgeList.push({
          from: nodePos,
          to: leftPos,
          direction: 'left',
          isHighlighted: highlightedNodes.has(node.id) || highlightedNodes.has(node.left.id)
        })
      }
      
      if (node.right) {
        const rightPos = getNodePosition(node.right.id)
        edgeList.push({
          from: nodePos,
          to: rightPos,
          direction: 'right',
          isHighlighted: highlightedNodes.has(node.id) || highlightedNodes.has(node.right.id)
        })
      }
    })

    return edgeList
  }, [nodes, getNodePosition, highlightedNodes])

  return (
    <div className="panel p-6 h-[600px]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
          <IconTree size={20} className="text-emerald-400" />
          <h2 className="text-xl font-bold text-white">Tree Visualization</h2>
        </div>
        
        <div className="flex items-center gap-4 text-sm">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-lg ${mode === 'insert' ? 'bg-blue-600' : 'bg-slate-700'}`}>
            <IconRefresh size={16} />
            Insert Mode
          </div>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-lg ${mode === 'search' ? 'bg-yellow-600' : 'bg-slate-700'}`}>
            <IconSearch size={16} />
            Search Mode
          </div>
          <div className="text-slate-400">
            Nodes: {nodes.length}
          </div>
        </div>
      </div>

      {/* Current Event Display */}
      {currentEvent && (
        <div className="mb-4 p-3 bg-slate-800 border border-slate-600 rounded-lg text-sm">
          <div className="font-medium text-slate-300">Current Operation:</div>
          <div className="text-slate-400 mt-1">
            {currentEvent.type === 'insert' && `Inserting value: ${currentEvent.value}`}
            {currentEvent.type === 'compare' && `Comparing ${currentEvent.value} with node ${currentEvent.nodeId} - Result: ${currentEvent.comparison}`}
            {currentEvent.type === 'navigate' && `Navigating ${currentEvent.direction} from ${currentEvent.from} to ${currentEvent.to}`}
            {currentEvent.type === 'create' && `Creating new node with value ${currentEvent.value}`}
            {currentEvent.type === 'rotate' && `Performing ${currentEvent.rotationType} rotation on node ${currentEvent.nodeId}`}
            {currentEvent.type === 'highlight' && `Highlighting node ${currentEvent.nodeId} - Reason: ${currentEvent.reason}`}
            {currentEvent.type === 'found' && `Found value ${currentEvent.value} at node ${currentEvent.nodeId}`}
            {currentEvent.type === 'notFound' && `Value ${currentEvent.value} not found in tree`}
          </div>
        </div>
      )}

      {/* Tree Visualization Area */}
      <div className="relative h-[480px] bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-600 overflow-hidden">
        {nodes.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-500">
            <div className="text-center">
              <IconTree size={48} className="mx-auto mb-2 opacity-50" />
              <div>No tree generated yet</div>
              <div className="text-sm mt-1">Configure input and click Generate to start</div>
            </div>
          </div>
        ) : (
          <>
            {/* SVG for edges */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon
                    points="0 0, 10 3.5, 0 7"
                    className="fill-slate-500"
                  />
                </marker>
              </defs>
              {edges.map((edge, index) => (
                <TreeEdge
                  key={index}
                  from={edge.from}
                  to={edge.to}
                  direction={edge.direction}
                  isHighlighted={edge.isHighlighted}
                />
              ))}
            </svg>

            {/* Tree nodes */}
            {nodes.map(node => {
              const position = getNodePosition(node.id)
              const isHighlighted = highlightedNodes.has(node.id)
              
              return (
                <TreeNodeComponent
                  key={node.id}
                  node={node}
                  position={position}
                  isHighlighted={isHighlighted}
                  currentEvent={isHighlighted ? currentEvent : undefined}
                />
              )
            })}
          </>
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
          <span>Current</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-600 rounded-full"></div>
          <span>Searching</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-600 rounded-full"></div>
          <span>Found/Equal</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
          <span>Less Than</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
          <span>Greater Than</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-emerald-600 rounded-full"></div>
          <span>New Node</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-600 rounded-full"></div>
          <span>Imbalance</span>
        </div>
      </div>
    </div>
  )
}