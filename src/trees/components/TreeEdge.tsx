import React from 'react'

interface TreeEdgeProps {
  from: { x: number; y: number }
  to: { x: number; y: number }
  isHighlighted?: boolean
  direction: 'left' | 'right'
}

export default function TreeEdge({ from, to, isHighlighted, direction }: TreeEdgeProps) {
  // Calculate SVG path
  const dx = to.x - from.x
  const dy = to.y - from.y
  const length = Math.sqrt(dx * dx + dy * dy)
  
  // Create path string for smooth curve
  const midX = from.x + dx / 2
  const midY = from.y + dy / 3
  
  const pathData = `M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`
  
  const edgeStyle = isHighlighted 
    ? "stroke-blue-400 stroke-2 drop-shadow-lg animate-pulse" 
    : "stroke-slate-500 stroke-1"

  return (
    <g>
      <path
        d={pathData}
        fill="none"
        className={`${edgeStyle} transition-all duration-300`}
        markerEnd="url(#arrowhead)"
      />
      {/* Direction indicator */}
      <text
        x={midX}
        y={midY - 10}
        className="fill-slate-400 text-xs font-mono"
        textAnchor="middle"
      >
        {direction === 'left' ? 'L' : 'R'}
      </text>
    </g>
  )
}