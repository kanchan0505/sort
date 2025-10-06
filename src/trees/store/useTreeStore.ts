import { create } from 'zustand'
import type { TreeEvent, TreeNode, TreeAlgorithmId } from '../algorithms/types'
import { treeAlgorithms } from '../algorithms'

type State = {
  algo: TreeAlgorithmId
  events: TreeEvent[]
  cursor: number
  playing: boolean
  speed: number
  input: number[]
  searchValue: number
  currentTree: Map<string, TreeNode>
  rootNodeId: string | null
  // metrics
  metrics: { comparisons: number; creations: number; rotations: number; navigations: number }
  // operation mode
  mode: 'insert' | 'search'
}

type Actions = {
  setAlgo: (a: State['algo']) => void
  setInput: (values: number[]) => void
  setSearchValue: (value: number) => void
  setMode: (mode: State['mode']) => void
  generate: () => void
  generateSearch: () => void
  play: () => void
  pause: () => void
  step: (n?: number) => void
  seek: (i: number) => void
  setSpeed: (s: number) => void
  // Tree state helpers
  getNodePosition: (nodeId: string) => { x: number; y: number }
  getAllNodes: () => TreeNode[]
  getHighlightedNodes: () => Set<string>
  getCurrentEvent: () => TreeEvent | undefined
}

// Tree layout calculation
const calculateNodePosition = (
  nodeId: string, 
  tree: Map<string, TreeNode>, 
  rootId: string | null,
  nodeWidth = 60,
  nodeHeight = 60,
  levelHeight = 120
): { x: number; y: number } => {
  if (!rootId || !tree.has(nodeId)) {
    return { x: 400, y: 50 }
  }

  // BFS to calculate positions
  const positions = new Map<string, { x: number; y: number; level: number }>()
  const queue: Array<{ id: string; x: number; level: number }> = [{ id: rootId, x: 400, level: 0 }]
  positions.set(rootId, { x: 400, y: 50, level: 0 })

  while (queue.length > 0) {
    const { id, x, level } = queue.shift()!
    const node = tree.get(id)
    if (!node) continue

    const childY = 50 + (level + 1) * levelHeight
    const horizontalSpacing = Math.max(100, 200 / Math.pow(2, level))

    if (node.left && !positions.has(node.left.id)) {
      const leftX = x - horizontalSpacing
      positions.set(node.left.id, { x: leftX, y: childY, level: level + 1 })
      queue.push({ id: node.left.id, x: leftX, level: level + 1 })
    }

    if (node.right && !positions.has(node.right.id)) {
      const rightX = x + horizontalSpacing
      positions.set(node.right.id, { x: rightX, y: childY, level: level + 1 })
      queue.push({ id: node.right.id, x: rightX, level: level + 1 })
    }
  }

  return positions.get(nodeId) || { x: 400, y: 50 }
}

export const useTreeStore = create<State & Actions>((set, get) => ({
  algo: 'bst',
  events: [],
  cursor: -1,
  playing: false,
  speed: 1,
  input: [10, 5, 15, 3, 7, 12, 18],
  searchValue: 7,
  currentTree: new Map(),
  rootNodeId: null,
  metrics: { comparisons: 0, creations: 0, rotations: 0, navigations: 0 },
  mode: 'insert',

  setAlgo(a) { 
    set({ algo: a })
  },
  setInput(values) { 
    set({ input: values })
  },
  setSearchValue(value) {
    set({ searchValue: value })
  },
  setMode(mode) {
    set({ mode })
  },

  generate() {
    const { algo, input } = get()
    const generator = treeAlgorithms[algo].insert(input)
    const events: TreeEvent[] = Array.from(generator)
    set({ 
      events, 
      cursor: -1, 
      metrics: { comparisons: 0, creations: 0, rotations: 0, navigations: 0 },
      currentTree: new Map(),
      rootNodeId: null,
      mode: 'insert'
    })
  },

  generateSearch() {
    const { currentTree, rootNodeId, searchValue, algo } = get()
    if (!rootNodeId || currentTree.size === 0) return
    
    const rootNode = currentTree.get(rootNodeId)
    const generator = treeAlgorithms[algo].search(rootNode || null, searchValue)
    const events: TreeEvent[] = Array.from(generator)
    set({ 
      events, 
      cursor: -1, 
      metrics: { comparisons: 0, creations: 0, rotations: 0, navigations: 0 },
      mode: 'search'
    })
  },

  play() {
    const computeMetrics = (events: TreeEvent[], upto: number) => {
      const m = { comparisons: 0, creations: 0, rotations: 0, navigations: 0 }
      for (let i = 0; i <= upto && i < events.length; i++) {
        const ev = events[i]
        if (!ev) continue
        if (ev.type === 'compare') m.comparisons++
        else if (ev.type === 'create') m.creations++
        else if (ev.type === 'rotate') m.rotations++
        else if (ev.type === 'navigate') m.navigations++
      }
      return m
    }

    const buildTreeUpToIndex = (events: TreeEvent[], index: number) => {
      const tree = new Map<string, TreeNode>()
      let root: string | null = null

      for (let i = 0; i <= index && i < events.length; i++) {
        const event = events[i]
        if (event.type === 'create') {
          const node: TreeNode = {
            value: event.value,
            left: null,
            right: null,
            id: event.nodeId
          }
          tree.set(event.nodeId, node)
          
          if (!root) {
            root = event.nodeId
          } else if (event.parentId && event.direction) {
            const parent = tree.get(event.parentId)
            if (parent) {
              if (event.direction === 'left') {
                parent.left = node
              } else {
                parent.right = node
              }
            }
          }
        }
      }

      return { tree, root }
    }

    const tick = () => {
      const { cursor, events, playing, speed } = get()
      if (!playing) return
      
      const next = Math.min(cursor + 1, events.length - 1)
      const { tree, root } = buildTreeUpToIndex(events, next)
      
      set({ 
        cursor: next, 
        metrics: computeMetrics(events, next),
        currentTree: tree,
        rootNodeId: root
      })
      
      if (next >= events.length - 1) {
        set({ playing: false })
      } else {
        setTimeout(tick, Math.max(16, 1000 / (30 * speed)))
      }
    }
    
    set({ playing: true })
    setTimeout(tick, 0)
  },

  pause() { 
    set({ playing: false })
  },

  step(n = 1) {
    const { cursor, events } = get()
    const next = Math.max(-1, Math.min(cursor + n, events.length - 1))
    
    // Build tree state up to this point
    const tree = new Map<string, TreeNode>()
    let root: string | null = null

    for (let i = 0; i <= next && i < events.length; i++) {
      const event = events[i]
      if (event.type === 'create') {
        const node: TreeNode = {
          value: event.value,
          left: null,
          right: null,
          id: event.nodeId
        }
        tree.set(event.nodeId, node)
        
        if (!root) {
          root = event.nodeId
        } else if (event.parentId && event.direction) {
          const parent = tree.get(event.parentId)
          if (parent) {
            if (event.direction === 'left') {
              parent.left = node
            } else {
              parent.right = node
            }
          }
        }
      }
    }

    // Compute metrics
    const m = { comparisons: 0, creations: 0, rotations: 0, navigations: 0 }
    for (let i = 0; i <= next && i < events.length; i++) {
      const ev = events[i]
      if (!ev) continue
      if (ev.type === 'compare') m.comparisons++
      else if (ev.type === 'create') m.creations++
      else if (ev.type === 'rotate') m.rotations++
      else if (ev.type === 'navigate') m.navigations++
    }

    set({ cursor: next, metrics: m, currentTree: tree, rootNodeId: root })
  },

  seek(i) {
    const max = get().events.length - 1
    const next = Math.max(-1, Math.min(i, max))
    get().step(next - get().cursor)
  },

  setSpeed(s) { 
    set({ speed: Math.max(0.1, Math.min(s, 20)) })
  },

  getNodePosition(nodeId) {
    const { currentTree, rootNodeId } = get()
    return calculateNodePosition(nodeId, currentTree, rootNodeId)
  },

  getAllNodes() {
    return Array.from(get().currentTree.values())
  },

  getHighlightedNodes() {
    const { events, cursor } = get()
    const highlighted = new Set<string>()
    
    if (cursor >= 0 && cursor < events.length) {
      const currentEvent = events[cursor]
      if (currentEvent && 'nodeId' in currentEvent && currentEvent.nodeId) {
        highlighted.add(currentEvent.nodeId)
      }
    }
    
    return highlighted
  },

  getCurrentEvent() {
    const { events, cursor } = get()
    if (cursor >= 0 && cursor < events.length) return events[cursor]
    return undefined
  },
}))