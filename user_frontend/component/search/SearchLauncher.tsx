"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

export default function SearchLauncher() {
  const router = useRouter();

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={() => router.push("/shop/search")}
      className="
        w-full flex items-center gap-3
        rounded-2xl border border-neutral-200
        bg-neutral-50 px-4 py-3
        text-left
        hover:bg-neutral-100 transition
      "
    >
      <Search className="w-5 h-5 text-neutral-500" />

      <span className="text-sm text-neutral-500">
        Search for groceries, fruits, snacks…
      </span>
    </motion.button>
  );
}
