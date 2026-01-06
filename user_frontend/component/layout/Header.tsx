"use client";

import React from "react";
import { useRouter } from "next/navigation";
interface HeaderProps {
  address?: any;
  eta?: number | null;
  distance?: string | null;
}

export default function Header({ address, eta, distance }: HeaderProps) {
    const router = useRouter();
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-neutral-200">
      <div className="px-4 py-3 flex items-center justify-between max-w-7xl mx-auto">
        {/* Location */}
        <div className="min-w-0">
          <p className="text-[11px] text-neutral-500">Deliver to</p>

          <p className="text-sm font-semibold truncate max-w-[220px]">
            {address?.road && `${address.road}, `}
            {address?.suburb && `${address.suburb}, `}
            {address?.city}
          </p>

          {eta && distance && (
            <p className="text-[11px] text-neutral-500 mt-0.5">
              {eta + 10} min • {distance} km
            </p>
          )}
        </div>

        {/* Account */}
        <button
        onClick={() => router.push("/shop/account")}
        className="shrink-0 rounded-full bg-neutral-100 px-4 py-1.5 text-sm font-medium hover:bg-neutral-200 transition">
          Account
        </button>
      </div>
    </header>
  );
}
