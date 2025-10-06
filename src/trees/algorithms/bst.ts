import type { TreeEvent, TreeNode, TreeAlgoGenerator } from './types'

let nodeIdCounter = 0
const generateNodeId = () => `node-${++nodeIdCounter}`

export const binarySearchTreeInsert: TreeAlgoGenerator = function* (
  values: number[]
): Generator<TreeEvent> {
  let root: TreeNode | null = null
  const nodes = new Map<string, TreeNode>()

  for (const value of values) {
    yield { type: 'insert', value, nodeId: '' }
    
    if (!root) {
      const nodeId = generateNodeId()
      root = {
        value,
        left: null,
        right: null,
        id: nodeId
      }
      nodes.set(nodeId, root)
      yield { type: 'create', nodeId, value }
      continue
    }

    // Insert into existing tree
    let current = root
    let parent: TreeNode | null = null
    let direction: 'left' | 'right' | null = null

    while (current) {
      yield { type: 'highlight', nodeId: current.id, reason: 'current' }
      
      if (value === current.value) {
        yield { type: 'compare', nodeId: current.id, value, comparison: 'equal' }
        break // Duplicate, skip insertion
      } else if (value < current.value) {
        yield { type: 'compare', nodeId: current.id, value, comparison: 'less' }
        parent = current
        direction = 'left'
        
        if (current.left) {
          yield { type: 'navigate', from: current.id, to: current.left.id, direction: 'left' }
          current = current.left
        } else {
          // Create new node on left
          const nodeId = generateNodeId()
          const newNode: TreeNode = {
            value,
            left: null,
            right: null,
            id: nodeId
          }
          current.left = newNode
          nodes.set(nodeId, newNode)
          yield { type: 'create', nodeId, value, parentId: current.id, direction: 'left' }
          break
        }
      } else {
        yield { type: 'compare', nodeId: current.id, value, comparison: 'greater' }
        parent = current
        direction = 'right'
        
        if (current.right) {
          yield { type: 'navigate', from: current.id, to: current.right.id, direction: 'right' }
          current = current.right
        } else {
          // Create new node on right
          const nodeId = generateNodeId()
          const newNode: TreeNode = {
            value,
            left: null,
            right: null,
            id: nodeId
          }
          current.right = newNode
          nodes.set(nodeId, newNode)
          yield { type: 'create', nodeId, value, parentId: current.id, direction: 'right' }
          break
        }
      }
    }
  }

  yield { type: 'done', finalRoot: root?.id || null }
}

export const binarySearchTreeSearch: TreeAlgoGenerator = function* (
  root: TreeNode | null,
  searchValue: number
): Generator<TreeEvent> {
  if (!root) {
    yield { type: 'notFound', value: searchValue }
    return
  }

  let current: TreeNode | null = root

  while (current) {
    yield { type: 'highlight', nodeId: current.id, reason: 'searching' }
    
    if (searchValue === current.value) {
      yield { type: 'compare', nodeId: current.id, value: searchValue, comparison: 'equal' }
      yield { type: 'found', nodeId: current.id, value: searchValue }
      return
    } else if (searchValue < current.value) {
      yield { type: 'compare', nodeId: current.id, value: searchValue, comparison: 'less' }
      if (current.left) {
        yield { type: 'navigate', from: current.id, to: current.left.id, direction: 'left' }
        current = current.left
      } else {
        break
      }
    } else {
      yield { type: 'compare', nodeId: current.id, value: searchValue, comparison: 'greater' }
      if (current.right) {
        yield { type: 'navigate', from: current.id, to: current.right.id, direction: 'right' }
        current = current.right
      } else {
        break
      }
    }
  }

  yield { type: 'notFound', value: searchValue }
}