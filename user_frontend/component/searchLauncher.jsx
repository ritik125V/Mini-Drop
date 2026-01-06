"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function SearchLauncher() {
  const router = useRouter()

  return (
    <motion.button
      onClick={() => router.push('/shop/search')}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.995 }}
      transition={{ duration: 0.12 }}
      className="w-full max-w-xl mx-auto flex items-center gap-3 bg-white/6 hover:bg-white/10 border border-white/10 px-4 py-3 rounded-lg text-left"
      aria-label="Open search page"
    >
      <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" /></svg>
      <div className="flex-1">
        <div className="text-sm text-gray-200">Search for products, brands, categories...</div>
        <div className="text-xs text-gray-400 mt-0.5">Tap to open search</div>
      </div>
      <div className="text-xs text-gray-400">⌘K</div>
    </motion.button>
  )
}
