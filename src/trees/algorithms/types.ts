export interface TreeNode {
  value: number
  left: TreeNode | null
  right: TreeNode | null
  height?: number // For AVL trees
  id: string
}

export type TreeEvent = 
  | { type: 'insert'; value: number; nodeId: string }
  | { type: 'compare'; nodeId: string; value: number; comparison: 'equal' | 'less' | 'greater' }
  | { type: 'navigate'; from: string; to: string; direction: 'left' | 'right' }
  | { type: 'create'; nodeId: string; value: number; parentId?: string; direction?: 'left' | 'right' }
  | { type: 'rotate'; nodeId: string; rotationType: 'left' | 'right' | 'leftRight' | 'rightLeft' }
  | { type: 'highlight'; nodeId: string; reason: 'imbalance' | 'current' | 'searching' }
  | { type: 'balance'; nodeId: string; oldHeight: number; newHeight: number }
  | { type: 'done'; finalRoot: string | null }
  | { type: 'found'; nodeId: string; value: number }
  | { type: 'notFound'; value: number }

export type TreeAlgorithmId = 'bst' | 'avl' | 'binary-tree'

export type TreeAlgoGenerator = (...args: any[]) => Generator<TreeEvent>

export interface TreeStructure {
  root: TreeNode | null
  nodes: Map<string, TreeNode>
}