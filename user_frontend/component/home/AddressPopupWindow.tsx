import React, { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, X, Home } from "lucide-react"

interface AddressPopupWindowProps {
  userAddress?: string[]
  onSelect: (address: string) => void
  onClose: () => void
  onCurrentLocationSelect: () => void
  open?: boolean
} 

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

const modalVariants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.35,
    },
  },
  exit: {
    opacity: 0,
    y: 40,
    scale: 0.95,
    transition: { duration: 0.25 },
  },
}

const AddressPopupWindow = ({
  userAddress,
  onSelect,
  onClose,
  onCurrentLocationSelect,
  open,
}: AddressPopupWindowProps) => {
  const isOpen = open ?? true

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [onClose])

  return (
    <AnimatePresence>
      
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            variants={modalVariants }
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative z-10 w-[90%] max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-1 text-gray-500 hover:bg-gray-100"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div className="mb-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                <MapPin className="text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                Choose delivery location
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Select a saved address or use your current location
              </p>
            </div>

            {/* Current location */}
            <button
              onClick={onCurrentLocationSelect}
              className="mb-4 active:scale-95 duration-150 flex w-full items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700 hover:bg-blue-100"
            >
              <MapPin size={16} />
              Deliver to current location
            </button>

            {/* Address list */}
            <div className="max-h-52 space-y-2 overflow-y-auto">
              {userAddress && userAddress.length > 0 ? (
                userAddress.map((address, index) => (
                  <button
                    key={index}
                    onClick={() => onSelect(address)}
                    className="flex w-full items-start gap-3 rounded-xl px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Home size={16} className="mt-0.5 text-gray-500" />
                    <span>{address}</span>
                  </button>
                ))
              ) : (
                <p className="text-center text-sm text-gray-500">
                  No saved addresses
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )
    </AnimatePresence>
  )
}

export default AddressPopupWindow
