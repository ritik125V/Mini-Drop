import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, X, Home } from "lucide-react";

interface AddressPopupWindowProps {
  userAddress: any[];
  onSelect: (address: any) => void;
  onClose: () => void;
  onCurrentLocationSelect: () => void;
}

const AddressPopupWindow = ({
  userAddress,
  onSelect,
  onClose,
  onCurrentLocationSelect,
}: AddressPopupWindowProps) => {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);
  console.log("Rendering AddressPopupWindow with addresses:", userAddress);
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ y: 40, scale: 0.95, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          exit={{ y: 40, scale: 0.95, opacity: 0 }}
          className="relative z-10 w-[90%] max-w-md rounded-2xl bg-white p-6 shadow-xl"
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-1 text-gray-500 hover:bg-gray-100"
          >
            <X size={18} />
          </button>

          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
              <MapPin className="text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold">
              Choose delivery location
            </h2>
            <p className="text-sm text-gray-500">
              Select a saved address or use your current location
            </p>
          </div>

          <button
            onClick={onCurrentLocationSelect}
            className="mb-4 flex w-full items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700 hover:bg-blue-100"
          >
            <MapPin size={16} />
            Deliver to current location
          </button>

          <div className="max-h-52 space-y-2 overflow-y-auto">
            {userAddress.length > 0 ? (
              userAddress.map((addr, i) => (
                <button
                  key={i}
                  onClick={() => onSelect(addr)}
                  className="flex flex-col items-start border-gray-300 border  w-full  gap-3 rounded-xl px-4 py-3 text-left text-sm hover:bg-gray-100"
                >
                  
                  <span className="flex items-center gap-1 font-semibold ">
                    <Home size={16} className=" text-gray-500" />
                    {addr.title || "Saved address"}</span>
                  <span className="text-xs text-gray-500">{addr.addressLine1 + ", " + addr.addressLine2}</span>
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
    </AnimatePresence>
  );
};

export default AddressPopupWindow;
