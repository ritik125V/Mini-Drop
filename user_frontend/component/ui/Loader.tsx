"use client"
import React from 'react'
import Logo from "../../resources/logos/MD-logo_transparent_bg.png";
import {motion} from 'framer-motion'
import Image from 'next/image'
function Loader() {
 return (
  <motion.div
    className="flex h-screen items-center justify-center bg-white"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2 }}
  >
    <motion.div
      className="flex flex-col items-center gap-3"
      initial={{ scale: 0.98, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        mass: 0.8,
      }}
    >
      {/* Logo */}
      <motion.div
  className="relative"
  animate={{ rotate: [-6, 6, -6] }}
  transition={{
    duration: 1.6,
    repeat: Infinity,
    ease: "easeInOut",
  }}
  style={{
    transformOrigin: "50% -12px", // pin is slightly above the logo
    willChange: "transform",
  }}
>
  <Image
    src={Logo}
    alt="Mini-Drop Logo"
    className="w-28 h-auto"
    priority
  />
</motion.div>


      {/* Text */}
      <motion.p className="text-xs   font-medium tracking-wide text-gray-500"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        dropping things at your doorstep...
      </motion.p>
    </motion.div>
  </motion.div>
)


}

export default Loader