"use client"

import React from 'react'
import { motion } from 'framer-motion'

export default function AnimatedDiv({ children, className = '' }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.28 }} className={className}>
      {children}
    </motion.div>
  )
}