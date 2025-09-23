import React, { useMemo } from 'react'
import { useGraphStore } from '@/graph/store/useGraphStore'
import { IconTarget, IconFlag, IconRoute } from '@tabler/icons-react'

export default function MazePanel() {
  const grid = useGraphStore(s => s.grid)
  const start = useGraphStore(s => s.start)
  const goal = useGraphStore(s => s.goal)
  const visited = useGraphStore(s => s.visitedSet())
  const path = useGraphStore(s => s.currentPath())

  const pathSet = useMemo(() => {
    const set = new Set<string>()
    for (const cell of path) {
      set.add(cell)
    }
    return set
  }, [path])

  return (
    <div className="panel p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
          <h2 className="text-xl font-bold text-white">Maze Pathfinding</h2>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2 text-green-400">
            <IconTarget size={16} />
            Start
          </div>
          <div className="flex items-center gap-2 text-red-400">
            <IconFlag size={16} />
            Goal
          </div>
          <div className="flex items-center gap-2 text-blue-400">
            <IconRoute size={16} />
            Path
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 border border-slate-600">
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${grid[0]?.length || 24}, 1fr)` }}>
          {grid.map((row, r) => 
            row.map((cell, c) => {
              const key = `${r},${c}`
              const isStart = r === start[0] && c === start[1]
              const isGoal = r === goal[0] && c === goal[1]
              const isVisited = visited.has(key)
              const isInPath = pathSet.has(key)
              const isWall = cell === 1
              
              return (
                <div
                  key={key}
                  className={`
                    aspect-square rounded-sm transition-all duration-200 border border-slate-700/50
                    ${isWall ? 'bg-slate-600' :
                      isStart ? 'bg-green-500 shadow-lg shadow-green-500/50' :
                      isGoal ? 'bg-red-500 shadow-lg shadow-red-500/50' :
                      isInPath ? 'bg-blue-500 shadow-md shadow-blue-500/50' :
                      isVisited ? 'bg-purple-400/70' :
                      'bg-slate-700/30 hover:bg-slate-600/50'}
                  `}
                >
                  {isStart && <IconTarget className="w-full h-full p-0.5 text-white" />}
                  {isGoal && <IconFlag className="w-full h-full p-0.5 text-white" />}
                  {isInPath && !isStart && !isGoal && (
                    <div className="w-full h-full bg-blue-400 rounded-sm animate-pulse"></div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
