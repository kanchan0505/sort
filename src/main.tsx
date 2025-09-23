import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/globals.css'
import 'reactflow/dist/style.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import GraphsApp from './graph/GraphsApp'
import { AnimatePresence } from 'framer-motion'

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/graphs', element: <GraphsApp /> },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AnimatePresence mode="wait">
      <RouterProvider router={router} />
    </AnimatePresence>
  </React.StrictMode>
)
