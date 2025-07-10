"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen bg-[#ffec4a]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{
          opacity: [0, 1, 1, 0],
          scale: [0.9, 1, 1, 0.9],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="w-24 h-24 md:w-32 md:h-32"
      >
        <img
          src="/uge30gul-512.png"
          alt="UGE 30 Logo"
          className="w-full h-full object-contain"
        />
      </motion.div>
      <p className="mt-4 text-sm font-medium text-black opacity-60">
        Loading...
      </p>
    </div>
  );
}
