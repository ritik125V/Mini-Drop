"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react';

export default function SearchLauncher() {
  const router = useRouter()

  return (
    <motion.button
      onClick={() => router.push('/shop/search')}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.995 }}
      transition={{ duration: 0.12 }}
      className="w-full max-w-xl  mx-auto flex items-center gap-3 bg-white/6 hover:bg-white/10 border border-gray-300 px-4 py-3 rounded-lg text-left"
      aria-label="Open search page"
    >
     <Search width={14}/>
      <div className="flex-1">
        <div className="text-sm text-gray-500">Search for products, brands, categories...</div>
      </div>
      
    </motion.button>
  )
}
