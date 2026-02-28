"use client";

import React from "react";
import Logo from "../../resources/logos/MD-logo_transparent_bg.png";
import { motion } from "framer-motion";
import Image from "next/image";

function FullPageLoader() {
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
        }}
      >
        {/* Swinging Logo */}
        <motion.div
          className="relative"
          animate={{ rotate: [-6, 6, -6] }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            transformOrigin: "50% -12px",
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

        <motion.p
          className="text-xs font-medium tracking-wide text-gray-500"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          dropping things at your doorstep...
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

/* ========================= */
/* BUTTON LOADER */
/* ========================= */

function ButtonLoader({ message }: { message?: string }) {
  return (
    <div className="relative w-full overflow-hidden flex items-center justify-center py-2">
      
      <motion.div
        className="flex items-center gap-2 whitespace-nowrap"
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <span className="text-gray-700 text-sm font-medium">
          {message || "getting"}
        </span>

        <motion.span
          className="font-bold text-red-500 text-sm"
          animate={{ rotate: [-6, 4, -6] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ display: "inline-block" }}
        >
          legends
        </motion.span>

        <span className="text-gray-700 text-sm font-medium">
          onboard
        </span>

        {/* Logo at end */}
        <Image
          src={Logo}
          alt="Mini-Drop Logo"
          className="w-5 h-auto"
        />
      </motion.div>
    </div>
  );
}

/* ========================= */
/* PRODUCT PAGE LOADER */
/* ========================= */

function ProductPageLoader() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-6">
      
      {/* Breathing pulse logo */}
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 1.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Image
          src={Logo}
          alt="Mini-Drop Logo"
          className="w-16 h-auto"
        />
      </motion.div>

      {/* Skeleton shimmer block */}
      <motion.div
        className="w-48 h-4 rounded-md bg-gray-200"
        animate={{
          opacity: [0.4, 1, 0.4],
        }}
        transition={{
          duration: 1.4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="w-32 h-3 rounded-md bg-gray-200"
        animate={{
          opacity: [0.4, 1, 0.4],
        }}
        transition={{
          duration: 1.4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.2,
        }}
      />
    </div>
  );
}

/* ========================= */
/* MAIN SWITCH */
/* ========================= */

function Loader({
  component,
  name,
  message,
  color,
  success,
}: {
  name?: string;
  message?: string;
  color?: string;
  component?: any;
  success?: boolean;
}) {
  switch (component) {
    case "btn":
      return <ButtonLoader message={message} />;

    case "productPage":
      return <ProductPageLoader />;

    default:
      return <FullPageLoader />;
  }
}

export default Loader;
