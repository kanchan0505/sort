import React from 'react'
import { useTreeStore } from './store/useTreeStore'
import { IconListNumbers, IconRotate, IconArrowsSplit, IconTarget } from '@tabler/icons-react'

export default function TreeMetricsPanel() {
  const metrics = useTreeStore(s => s.metrics)
  const currentEvent = useTreeStore(s => s.getCurrentEvent())
  const algo = useTreeStore(s => s.algo)
  const mode = useTreeStore(s => s.mode)
  const nodes = useTreeStore(s => s.getAllNodes())

  const getTreeHeight = () => {
    const heights = nodes.map(node => node.height ?? 0)
    return Math.max(...heights, -1) + 1
  }

  const getAlgorithmInfo = () => {
    switch (algo) {
      case 'bst':
        return {
          name: 'Binary Search Tree',
          description: 'Left child < parent < right child. No self-balancing.',
          complexity: 'O(log n) average, O(n) worst case'
        }
      case 'avl':
        return {
          name: 'AVL Tree',
          description: 'Self-balancing BST. Height difference ≤ 1 between subtrees.',
          complexity: 'O(log n) guaranteed'
        }
      case 'binary-tree':
        return {
          name: 'Binary Tree',
          description: 'Level-order insertion. No ordering constraint.',
          complexity: 'O(n) for search'
        }
      default:
        return {
          name: 'Unknown',
          description: '',
          complexity: ''
        }
    }
  }

  const algorithmInfo = getAlgorithmInfo()

  return (
    <div className="panel p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-3 h-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"></div>
        <IconListNumbers size={20} className="text-cyan-400" />
        <h2 className="text-lg font-semibold">Tree Metrics</h2>
      </div>

      {/* Algorithm Info */}
      <div className="mb-4 p-3 bg-slate-800 border border-slate-700 rounded-lg">
        <div className="text-sm font-medium text-slate-300 mb-1">{algorithmInfo.name}</div>
        <div className="text-xs text-slate-400 mb-2">{algorithmInfo.description}</div>
        <div className="text-xs text-cyan-400 font-mono">{algorithmInfo.complexity}</div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3">
          <div className="text-slate-400 text-sm flex items-center gap-2">
            <IconTarget size={16} />
            Comparisons
          </div>
          <div className="text-2xl font-semibold mt-1">{metrics.comparisons}</div>
        </div>
        
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3">
          <div className="text-slate-400 text-sm flex items-center gap-2">
            <IconArrowsSplit size={16} />
            Creations
          </div>
          <div className="text-2xl font-semibold mt-1">{metrics.creations}</div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3">
          <div className="text-slate-400 text-sm flex items-center gap-2">
            <IconRotate size={16} />
            Rotations
          </div>
          <div className="text-2xl font-semibold mt-1">{metrics.rotations}</div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3">
          <div className="text-slate-400 text-sm">Navigations</div>
          <div className="text-2xl font-semibold mt-1">{metrics.navigations}</div>
        </div>
      </div>

      {/* Tree Properties */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3">
          <div className="text-slate-400 text-sm">Tree Height</div>
          <div className="text-xl font-semibold mt-1">{nodes.length > 0 ? getTreeHeight() : 0}</div>
        </div>
        
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3">
          <div className="text-slate-400 text-sm">Total Nodes</div>
          <div className="text-xl font-semibold mt-1">{nodes.length}</div>
        </div>
      </div>

      {/* Current Operation */}
      {currentEvent && (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3">
          <div className="text-slate-400 text-sm mb-2">Current Operation</div>
          <div className="text-sm text-slate-300">
            <span className={`inline-block px-2 py-1 rounded text-xs font-medium mr-2 ${
              currentEvent.type === 'compare' ? 'bg-yellow-600' :
              currentEvent.type === 'create' ? 'bg-green-600' :
              currentEvent.type === 'rotate' ? 'bg-purple-600' :
              currentEvent.type === 'navigate' ? 'bg-blue-600' :
              'bg-slate-600'
            }`}>
              {currentEvent.type.toUpperCase()}
            </span>
            {currentEvent.type === 'compare' && `${(currentEvent as any).value} vs node`}
            {currentEvent.type === 'create' && `New node: ${(currentEvent as any).value}`}
            {currentEvent.type === 'rotate' && `${(currentEvent as any).rotationType} rotation`}
            {currentEvent.type === 'navigate' && `Moving ${(currentEvent as any).direction}`}
            {currentEvent.type === 'highlight' && `${(currentEvent as any).reason}`}
          </div>
        </div>
      )}

      {/* Mode Indicator */}
      <div className="mt-4 text-xs text-slate-500 text-center">
        Mode: {mode === 'insert' ? 'Tree Construction' : 'Tree Search'} • 
        Algorithm: {algorithmInfo.name}
      </div>
    </div>
  )
}