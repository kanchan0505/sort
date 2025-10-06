import type { TreeEvent, TreeNode, TreeAlgoGenerator } from './types'

let nodeIdCounter = 0
const generateNodeId = () => `avl-node-${++nodeIdCounter}`

function getHeight(node: TreeNode | null): number {
  return node?.height ?? -1
}

function updateHeight(node: TreeNode): void {
  node.height = Math.max(getHeight(node.left), getHeight(node.right)) + 1
}

function getBalance(node: TreeNode): number {
  return getHeight(node.left) - getHeight(node.right)
}

function* rotateRight(y: TreeNode): Generator<TreeEvent, TreeNode> {
  yield { type: 'rotate', nodeId: y.id, rotationType: 'right' }
  
  const x = y.left!
  y.left = x.right
  x.right = y
  
  updateHeight(y)
  updateHeight(x)
  
  return x
}

function* rotateLeft(x: TreeNode): Generator<TreeEvent, TreeNode> {
  yield { type: 'rotate', nodeId: x.id, rotationType: 'left' }
  
  const y = x.right!
  x.right = y.left
  y.left = x
  
  updateHeight(x)
  updateHeight(y)
  
  return y
}

export const avlTreeInsert: TreeAlgoGenerator = function* (
  values: number[]
): Generator<TreeEvent> {
  let root: TreeNode | null = null
  const nodes = new Map<string, TreeNode>()

  function* insertNode(node: TreeNode | null, value: number): Generator<TreeEvent, TreeNode | null> {
    // Base case
    if (!node) {
      const nodeId = generateNodeId()
      const newNode: TreeNode = {
        value,
        left: null,
        right: null,
        height: 0,
        id: nodeId
      }
      nodes.set(nodeId, newNode)
      yield { type: 'create', nodeId, value }
      return newNode
    }

    yield { type: 'highlight', nodeId: node.id, reason: 'current' }

    // Perform normal BST insertion
    if (value < node.value) {
      yield { type: 'compare', nodeId: node.id, value, comparison: 'less' }
      if (node.left) {
        yield { type: 'navigate', from: node.id, to: node.left.id, direction: 'left' }
      }
      node.left = yield* insertNode(node.left, value)
    } else if (value > node.value) {
      yield { type: 'compare', nodeId: node.id, value, comparison: 'greater' }
      if (node.right) {
        yield { type: 'navigate', from: node.id, to: node.right.id, direction: 'right' }
      }
      node.right = yield* insertNode(node.right, value)
    } else {
      yield { type: 'compare', nodeId: node.id, value, comparison: 'equal' }
      return node // Duplicate values not allowed
    }

    // Update height
    const oldHeight = node.height ?? 0
    updateHeight(node)
    if (node.height !== oldHeight) {
      yield { type: 'balance', nodeId: node.id, oldHeight, newHeight: node.height }
    }

    // Get balance factor
    const balance = getBalance(node)

    // Check for imbalance
    if (Math.abs(balance) > 1) {
      yield { type: 'highlight', nodeId: node.id, reason: 'imbalance' }
    }

    // Perform rotations if needed
    // Left Left Case
    if (balance > 1 && node.left && value < node.left.value) {
      return yield* rotateRight(node)
    }

    // Right Right Case
    if (balance < -1 && node.right && value > node.right.value) {
      return yield* rotateLeft(node)
    }

    // Left Right Case
    if (balance > 1 && node.left && value > node.left.value) {
      yield { type: 'rotate', nodeId: node.id, rotationType: 'leftRight' }
      node.left = yield* rotateLeft(node.left)
      return yield* rotateRight(node)
    }

    // Right Left Case
    if (balance < -1 && node.right && value < node.right.value) {
      yield { type: 'rotate', nodeId: node.id, rotationType: 'rightLeft' }
      node.right = yield* rotateRight(node.right)
      return yield* rotateLeft(node)
    }

    return node
  }

  for (const value of values) {
    yield { type: 'insert', value, nodeId: '' }
    root = yield* insertNode(root, value)
  }

  yield { type: 'done', finalRoot: root?.id || null }
}

export const avlTreeSearch: TreeAlgoGenerator = function* (
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