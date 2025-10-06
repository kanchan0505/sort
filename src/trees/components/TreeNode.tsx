import React from 'react'
import { TreeNode as TreeNodeType, TreeEvent } from '../algorithms/types'

interface TreeNodeProps {
  node: TreeNodeType
  position: { x: number; y: number }
  isHighlighted: boolean
  currentEvent?: TreeEvent
  onNodeClick?: (nodeId: string) => void
}

export default function TreeNodeComponent({ 
  node, 
  position, 
  isHighlighted, 
  currentEvent,
  onNodeClick 
}: TreeNodeProps) {
  const getNodeStyle = () => {
    let baseClasses = "absolute w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all duration-300 cursor-pointer text-white font-bold text-sm"
    
    if (isHighlighted && currentEvent) {
      switch (currentEvent.type) {
        case 'highlight':
          if (currentEvent.reason === 'current') {
            return `${baseClasses} bg-blue-600 border-blue-400 shadow-lg shadow-blue-500/50 scale-110`
          } else if (currentEvent.reason === 'searching') {
            return `${baseClasses} bg-yellow-600 border-yellow-400 shadow-lg shadow-yellow-500/50 scale-110`
          } else if (currentEvent.reason === 'imbalance') {
            return `${baseClasses} bg-red-600 border-red-400 shadow-lg shadow-red-500/50 scale-110 animate-pulse`
          }
          break
        case 'compare':
          if (currentEvent.comparison === 'equal') {
            return `${baseClasses} bg-green-600 border-green-400 shadow-lg shadow-green-500/50 scale-110`
          } else if (currentEvent.comparison === 'less') {
            return `${baseClasses} bg-orange-600 border-orange-400 shadow-lg shadow-orange-500/50 scale-110`
          } else {
            return `${baseClasses} bg-purple-600 border-purple-400 shadow-lg shadow-purple-500/50 scale-110`
          }
        case 'create':
          return `${baseClasses} bg-emerald-600 border-emerald-400 shadow-lg shadow-emerald-500/50 scale-110 animate-bounce`
        case 'found':
          return `${baseClasses} bg-green-600 border-green-400 shadow-lg shadow-green-500/50 scale-125 animate-pulse`
        case 'rotate':
          return `${baseClasses} bg-indigo-600 border-indigo-400 shadow-lg shadow-indigo-500/50 scale-110 animate-spin`
        default:
          return `${baseClasses} bg-blue-600 border-blue-400 shadow-lg shadow-blue-500/50 scale-110`
      }
    }
    
    return `${baseClasses} bg-slate-700 border-slate-500 hover:border-slate-400 hover:scale-105`
  }

  return (
    <div
      className={getNodeStyle()}
      style={{
        left: `${position.x - 32}px`,
        top: `${position.y - 32}px`,
        zIndex: isHighlighted ? 20 : 10
      }}
      onClick={() => onNodeClick?.(node.id)}
    >
      {node.value}
      {node.height !== undefined && (
        <div className="absolute -top-2 -right-2 w-5 h-5 bg-slate-600 border border-slate-400 rounded-full text-xs flex items-center justify-center">
          {node.height}
        </div>
      )}
    </div>
  )
}