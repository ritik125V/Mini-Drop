import { motion } from "framer-motion";
import { MapPinOff, ArrowRight } from "lucide-react";

export default function AddressNotServicable() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="max-w-md mx-auto px-6 pt-10 text-center"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100"
      >
        <MapPinOff className="h-6 w-6 text-gray-600" />
      </motion.div>

      <h2 className="text-lg font-semibold text-gray-900">
        Not available in your area yet
      </h2>

      <p className="mt-2 text-sm text-gray-500 leading-relaxed">
        We’re expanding quickly and this location isn’t supported just yet.
        Drop back soon — we’re getting closer every week.
      </p>

      {/* <motion.button
        whileHover={{ x: 2 }}
        whileTap={{ scale: 0.98 }}
        className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-black hover:opacity-80 transition"
        onClick={() => console.log("Open store locator")}
      >
        Find nearest store
        <ArrowRight className="h-4 w-4" />
      </motion.button> */}
    </motion.div>
  );
}
