"use client";

import { useRouter } from "next/navigation";
import { ChevronRight, Package, MapPin, HelpCircle, LogOut } from "lucide-react";

export default function AccountPage() {
  const router = useRouter();

  // TEMP user data (replace with real API later)
  const user = {
    name: "Ritik Verma",
    phone: "+91 9XXXXXXXXX",
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <div className="px-4 py-4 border-b border-neutral-200">
        <h1 className="text-lg font-semibold">Account</h1>
      </div>

      {/* User Info */}
      <div className="px-4 py-5 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold text-lg">
          {user.name.charAt(0)}
        </div>

        <div>
          <p className="font-semibold">{user.name}</p>
          <p className="text-sm text-neutral-500">{user.phone}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 space-y-2">
        {/* Orders */}
        <button
          onClick={() => router.push("/shop/orders")}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-neutral-50 hover:bg-neutral-100 transition"
        >
          <div className="flex items-center gap-3">
            <Package className="w-5 h-5 text-neutral-700" />
            <span className="font-medium">My Orders</span>
          </div>
          <ChevronRight className="w-5 h-5 text-neutral-400" />
        </button>

        {/* Addresses */}
        <button
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-neutral-50 hover:bg-neutral-100 transition"
        >
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-neutral-700" />
            <span className="font-medium">Saved Addresses</span>
          </div>
          <ChevronRight className="w-5 h-5 text-neutral-400" />
        </button>

        {/* Help */}
        <button
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-neutral-50 hover:bg-neutral-100 transition"
        >
          <div className="flex items-center gap-3">
            <HelpCircle className="w-5 h-5 text-neutral-700" />
            <span className="font-medium">Help & Support</span>
          </div>
          <ChevronRight className="w-5 h-5 text-neutral-400" />
        </button>
      </div>

      {/* Logout */}
      <div className="px-4 mt-6">
        <button className="w-full py-3 rounded-xl border border-neutral-200 text-sm font-semibold text-red-600 hover:bg-red-50 transition">
          Log out
        </button>
      </div>
    </div>
  );
}
