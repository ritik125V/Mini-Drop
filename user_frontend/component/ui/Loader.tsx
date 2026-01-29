"use client"
import React from 'react'
import Logo from "../../resources/logos/MD-logo_transparent_bg.png";
import {motion} from 'framer-motion'
import Image from 'next/image'
function Loader() {
  return (
    <div className="flex flex-col h-screen items-center justify-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="flex flex-col items-center justify-center"
      >
        <Image src={Logo} alt="Mini-Drop Logo" className="w-30 h-36 animate-bounce" />
        <p className='font-bold text-gray-800'>Hold on...</p>
      </motion.div>
    </div>
  )
}

export default Loader