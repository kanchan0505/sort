import React from 'react'
import { motion } from 'framer-motion'

export default function PageSlide({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ x: 40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -40, opacity: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="flex-1 w-full min-h-0 flex flex-col"
    >
      {children}
    </motion.div>
  )
}
