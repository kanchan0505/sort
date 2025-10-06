import React, { useMemo } from 'react'
import { useGraphStore } from '@/graph/store/useGraphStore'
import { IconTarget, IconFlag, IconRoute } from '@tabler/icons-react'

export default function MazePanel() {
  const grid = useGraphStore(s => s.grid)
  const start = useGraphStore(s => s.start)
  const goal = useGraphStore(s => s.goal)
  const setStart = useGraphStore(s => s.setStart)
  const setGoal = useGraphStore(s => s.setGoal)
  const setGrid = useGraphStore(s => s.setGrid)
  const visited = useGraphStore(s => s.visitedSet())
  const path = useGraphStore(s => s.currentPath())
  const generate = useGraphStore(s => s.generate)

  const pathSet = useMemo(() => {
    const set = new Set<string>()
    for (const cell of path) {
      set.add(cell)
    }
    return set
  }, [path])

  const handleCellClick = (r: number, c: number) => {
    if (r === start[0] && c === start[1]) return
    if (r === goal[0] && c === goal[1]) return
    
    const newGrid = grid.map(row => [...row])
    newGrid[r][c] = newGrid[r][c] === 1 ? 0 : 1
    setGrid(newGrid)
  }

  const generateRandomMaze = () => {
    const newGrid = Array.from({ length: 15 }, () => Array.from({ length: 24 }, () => Math.random() > 0.7 ? 1 : 0))
    // Ensure start and goal are clear
    newGrid[start[0]][start[1]] = 0
    newGrid[goal[0]][goal[1]] = 0
    setGrid(newGrid)
  }

  const clearMaze = () => {
    const newGrid = Array.from({ length: 15 }, () => Array.from({ length: 24 }, () => 0))
    setGrid(newGrid)
  }

  return (
    <div className="panel p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
          <h2 className="text-xl font-bold text-white">Maze Pathfinding</h2>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={generateRandomMaze}
            className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-all"
          >
            Random Maze
          </button>
          <button 
            onClick={clearMaze}
            className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded-lg transition-all"
          >
            Clear
          </button>
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
                  onClick={() => handleCellClick(r, c)}
                  className={`
                    aspect-square rounded-sm transition-all duration-200 border border-slate-700/50 cursor-pointer
                    ${isWall ? 'bg-slate-600 hover:bg-slate-500' :
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
