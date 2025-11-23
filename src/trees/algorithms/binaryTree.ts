import type { TreeEvent, TreeNode, TreeAlgoGenerator } from './types'

let nodeIdCounter = 0
const generateNodeId = () => `bt-node-${++nodeIdCounter}`

export const binaryTreeInsert: TreeAlgoGenerator = function* (
  values: number[]
): Generator<TreeEvent> {
  let root: TreeNode | null = null
  const nodes = new Map<string, TreeNode>()
  const queue: TreeNode[] = []

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
      queue.push(root)
      yield { type: 'create', nodeId, value }
      continue
    }

    // Find the first node with an available child slot
    let inserted = false
    
    while (queue.length && !inserted) {
      const node = queue[0]
      yield { type: 'highlight', nodeId: node.id, reason: 'current' }
      
      if (!node.left) {
        const nodeId = generateNodeId()
        const newNode: TreeNode = {
          value,
          left: null,
          right: null,
          id: nodeId
        }
        node.left = newNode
        nodes.set(nodeId, newNode)
        queue.push(newNode)
        yield { type: 'create', nodeId, value, parentId: node.id, direction: 'left' }
        inserted = true
      } else if (!node.right) {
        const nodeId = generateNodeId()
        const newNode: TreeNode = {
          value,
          left: null,
          right: null,
          id: nodeId
        }
        node.right = newNode
        nodes.set(nodeId, newNode)
        queue.push(newNode)
        yield { type: 'create', nodeId, value, parentId: node.id, direction: 'right' }
        inserted = true
        queue.shift()
      } else {
        // Both children exist, remove from queue
        queue.shift()
      }
    }
  }

  yield { type: 'done', finalRoot: root?.id || null }
}

export const binaryTreeSearch: TreeAlgoGenerator = function* (
  root: TreeNode | null,
  searchValue: number
): Generator<TreeEvent> {
  if (!root) {
    yield { type: 'notFound', value: searchValue }
    return
  }

  // Level-order traversal for searching
  const queue: TreeNode[] = [root]

  while (queue.length > 0) {
    const current = queue.shift()!
    yield { type: 'highlight', nodeId: current.id, reason: 'searching' }
    
    if (current.value === searchValue) {
      yield { type: 'compare', nodeId: current.id, value: searchValue, comparison: 'equal' }
      yield { type: 'found', nodeId: current.id, value: searchValue }
      return
    }

    if (current.left) {
      queue.push(current.left)
    }
    if (current.right) {
      queue.push(current.right)
    }
  }

  yield { type: 'notFound', value: searchValue }
}