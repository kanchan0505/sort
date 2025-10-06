# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

SortFlow is an interactive algorithm visualization application built with React, TypeScript, and Vite. It provides three visualization modes:
1. **Sorting Algorithms** - Interactive visualization of sorting algorithms with bar charts
2. **Graph Algorithms** - Pathfinding and graph traversal algorithms with maze visualization  
3. **Tree Data Structures** - Binary Search Trees, AVL Trees, and Binary Trees with step-by-step node insertion and comparison

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npx tsc --noEmit

# Check specific file types
npx tsc --noEmit --target ES2020 --module ESNext --jsx react-jsx src/**/*.ts src/**/*.tsx
```

## Architecture Overview

### Multi-Application Structure
The app uses React Router with three main routes:
- `/` - Sorting algorithms visualization (main App.tsx)
- `/graphs` - Graph algorithms and maze pathfinding (GraphsApp.tsx)
- `/trees` - Tree data structures visualization (TreesApp.tsx)

### State Management Pattern
All applications use **Zustand** for state management with separate stores:
- `src/store/useAppStore.ts` - Sorting algorithms state
- `src/graph/store/useGraphStore.ts` - Graph algorithms state
- `src/trees/store/useTreeStore.ts` - Tree data structures state

Each store follows the same pattern:
- Generator-based algorithm execution
- Event-driven visualization updates
- Timeline/cursor-based animation playback
- Speed controls and step-through debugging

### Algorithm Implementation Pattern
All algorithms are implemented as **generator functions** that yield events:

**Sorting Algorithms** (`src/algorithms/`):
- Event types: `compare`, `swap`, `overwrite`, `merge`, `partition`, `pivot`
- Files: `bubble.ts`, `insertion.ts`, `selection.ts`, `merge.ts`, `quick.ts`, `heap.ts`

**Graph Algorithms** (`src/graph/algorithms/`):
- Event types: `visit`, `enqueue`, `dequeue`, `relax`, `path`, `connect`
- Includes: BFS (grid), Dijkstra, A*, DFS, Prim's MST, Kruskal's MST, Topological Sort, Bellman-Ford

**Tree Algorithms** (`src/trees/algorithms/`):
- Event types: `insert`, `compare`, `navigate`, `create`, `rotate`, `highlight`, `found`, `notFound`
- Includes: Binary Search Tree, AVL Tree (self-balancing), Binary Tree (level-order)

### Visualization Components

**Sorting Visualizations**:
- `BarsCanvas` - Animated bar chart visualization
- `AlgorithmFlow` - ReactFlow-based algorithm step flow diagram
- `MetricsPanel` - Real-time algorithm metrics

**Graph Visualizations**:
- `MazePanel` - Grid-based pathfinding visualization
- `InteractiveGraphPanel` - Node-edge graph visualization
- `GraphMetricsPanel` - Graph algorithm metrics

**Tree Visualizations**:
- `TreeVisualizationPanel` - Node-based tree structure with edges
- `TreeNode` - Individual tree node component with highlighting
- `TreeEdge` - Tree edge component showing parent-child relationships
- `TreeMetricsPanel` - Tree algorithm metrics and properties

### Key Patterns

**Event-Driven Animation System**:
- Algorithms yield events during execution
- Events are stored in timeline arrays
- Cursor-based playback allows scrubbing through algorithm execution
- Timeline snapshots enable efficient state reconstruction

**Player/Scheduler System** (`src/player/`):
- `timeline.ts` - Builds event timelines from generators
- `scheduler.ts` - Handles playback timing and controls

**Theme System** (`src/utils/theme.ts`):
- Dark/light theme support
- Color palette variations (default, high-contrast, colorblind-friendly)

## File Structure Navigation

```
src/
├── algorithms/          # Sorting algorithm implementations
├── graph/
│   ├── algorithms/      # Graph algorithm implementations
│   └── store/          # Graph state management
├── trees/
│   ├── algorithms/      # Tree algorithm implementations
│   ├── components/      # Tree visualization components
│   └── store/          # Tree state management
├── components/         # Shared UI components
├── views/             # Sorting visualization components
├── store/             # Main app state management
├── player/            # Animation timeline system
└── utils/             # Utilities (theme, self-check)
```

## Development Guidelines

### Adding New Algorithms

**For Sorting Algorithms**:
1. Create algorithm file in `src/algorithms/` following generator pattern
2. Export function that yields `SortingEvent` objects
3. Add to `src/algorithms/index.ts` registry
4. Algorithm will automatically appear in UI dropdown

**For Graph Algorithms**:
1. Create algorithm file in `src/graph/algorithms/` 
2. Export function that yields `GraphEvent` objects
3. Add to `src/graph/algorithms/index.ts` registry
4. Update `useGraphStore.generate()` method to handle new algorithm

**For Tree Algorithms**:
1. Create algorithm file in `src/trees/algorithms/`
2. Export function that yields `TreeEvent` objects
3. Add to `src/trees/algorithms/index.ts` registry
4. Algorithm will automatically appear in UI dropdown

### Event Types to Use

**Sorting Events**:
- `compare` - Highlight two elements being compared
- `swap` - Swap two elements
- `overwrite` - Set element at index to new value
- `merge`, `partition`, `pivot` - Algorithm-specific operations

**Graph Events**:
- `visit` - Mark node as visited
- `enqueue`/`dequeue` - Queue operations
- `relax` - Update shortest distance
- `path` - Final path result
- `connect` - MST edge connection

**Tree Events**:
- `insert` - Start inserting a value
- `compare` - Compare values at nodes
- `navigate` - Move between nodes
- `create` - Create new node
- `rotate` - Perform tree rotation (AVL)
- `highlight` - Highlight node for various reasons

### Keyboard Shortcuts
- `Space` - Play/pause animation
- `Arrow Left/Right` - Step backward/forward through algorithm

### Self-Check System
The app includes a development-mode self-check system (`src/utils/selfCheck.ts`) that validates algorithm correctness by comparing generator output with expected sorted results.

## TypeScript Configuration
- Uses path aliases: `@/*` maps to `src/*`
- Strict mode enabled
- React JSX transform
- ES2020 target with modern module resolution