import type { TreeAlgoGenerator, TreeAlgorithmId } from './types'
import { binarySearchTreeInsert, binarySearchTreeSearch } from './bst'
import { avlTreeInsert, avlTreeSearch } from './avl'
import { binaryTreeInsert, binaryTreeSearch } from './binaryTree'

export const treeAlgorithms: Record<string, { name: string; insert: TreeAlgoGenerator; search: TreeAlgoGenerator }> = {
  'bst': { 
    name: 'Binary Search Tree', 
    insert: binarySearchTreeInsert,
    search: binarySearchTreeSearch
  },
  'avl': { 
    name: 'AVL Tree (Self-Balancing)', 
    insert: avlTreeInsert,
    search: avlTreeSearch
  },
  'binary-tree': { 
    name: 'Binary Tree (Level Order)', 
    insert: binaryTreeInsert,
    search: binaryTreeSearch
  },
}

export const treeAlgorithmOptions = Object.entries(treeAlgorithms).map(([id, { name }]) => ({ id, name }))

export * from './types'