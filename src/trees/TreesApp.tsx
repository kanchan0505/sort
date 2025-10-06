import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconArrowLeft, IconTree } from '@tabler/icons-react'
import { useTreeStore } from './store/useTreeStore'
import TreeVisualizationPanel from './TreeVisualizationPanel'
import TreeControlsPanel from './TreeControlsPanel'
import TreeMetricsPanel from './TreeMetricsPanel'
import PageSlide from '@/components/PageSlide'

export default function TreesApp() {
  const navigate = useNavigate()
  const generate = useTreeStore(s => s.generate)

  useEffect(() => {
    // Initialize with default tree
    generate()
  }, [])

  return (
    <div className="h-screen flex flex-col bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800/90 backdrop-blur-sm border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-slate-700"
            >
              <IconArrowLeft size={20} />
              <span className="font-medium">SortFlow</span>
            </button>
            <div className="h-8 w-px bg-slate-600"></div>
            <div className="flex items-center gap-3">
              <IconTree size={24} className="text-emerald-400" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                TreeFlow
              </h1>
            </div>
          </div>
          
          <div className="text-sm text-slate-400">
            Interactive Tree Data Structure Visualizer
          </div>
        </div>
      </header>

      <PageSlide>
        <main className="flex-1 p-6 overflow-y-auto overflow-x-hidden min-h-0">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Controls */}
            <TreeControlsPanel />
            
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Tree Visualization - Takes 2 columns */}
              <div className="xl:col-span-2">
                <TreeVisualizationPanel />
              </div>
              
              {/* Metrics Panel */}
              <div className="xl:col-span-1">
                <TreeMetricsPanel />
              </div>
            </div>

            {/* Info Panel */}
            <div className="panel p-6 bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-slate-600">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold text-emerald-400">Tree Data Structures</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-300 mt-4">
                  <div className="space-y-1">
                    <div className="font-medium text-blue-400">Binary Search Tree</div>
                    <div>Ordered tree structure with efficient search, insert, and delete operations</div>
                  </div>
                  <div className="space-y-1">
                    <div className="font-medium text-purple-400">AVL Tree</div>
                    <div>Self-balancing BST that maintains optimal height through rotations</div>
                  </div>
                  <div className="space-y-1">
                    <div className="font-medium text-green-400">Binary Tree</div>
                    <div>General tree structure with level-order insertion pattern</div>
                  </div>
                </div>
                <div className="text-xs text-slate-500 mt-4">
                  Watch step-by-step visualization of tree construction, node comparisons, and balancing operations
                </div>
              </div>
            </div>
          </div>
        </main>
      </PageSlide>
    </div>
  )
}