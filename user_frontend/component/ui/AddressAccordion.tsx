"use client";

import { useState } from "react";
import { ChevronRight, MapPin } from "lucide-react";

export type Address = {
  _id: string;
  title: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  nearestWarehouseId?: string;
  coordinates?: [number, number];
};

type AddressAccordionProps = {
  address: Address;
  onSelectAddress?: (id: string, nearestWarehouseId?: string) => void; // ✅ OPTIONAL
  isSelected?: boolean;
};

export default function AddressAccordion({
  address,
  onSelectAddress,
  isSelected,
}: AddressAccordionProps) {
  const [open, setOpen] = useState(false);
  console.log(address);

  return (
    <div
     onClick={() => onSelectAddress?.(address._id, address.nearestWarehouseId)}
     className={`px-2 mx-2 my-1 rounded-xl overflow-hidden bg-neutral-50 ${isSelected ? "border border-blue-500" : ""}`}>
      

      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3"
      >
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-neutral-700" />
          <span className="font-medium">{address.title}</span>
        </div>

        <ChevronRight
          className={`w-5 h-5 text-neutral-400 transition-transform ${
            open ? "rotate-90" : ""
          }`}
        />
      </button>

      {/* Body */}
      <div
        className={`grid transition-all duration-300 ${
          open ? "grid-rows-[1fr] p-4" : "grid-rows-[0fr] px-4"
        }`}
      >
        <div className="overflow-hidden text-sm text-neutral-700 space-y-1">
          <p>{address.addressLine1}</p>
          {address.addressLine2 && <p>{address.addressLine2}</p>}
          <p>
            {address.city}, {address.state}
          </p>
        </div>
      </div>
    </div>
  );
}
