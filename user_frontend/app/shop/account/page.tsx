"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  ChevronRight,
  Package,
  HelpCircle,
  LogOut,
} from "lucide-react";
import Loader from "@/component/ui/Loader";
import { errorHandler } from "@/functions/errorHandler.js";

import AddressAccordion, { Address } from "@/component/ui/AddressAccordion";

type User = {
  username: string;
  phone: string;
  email?: string;
  address?: Address[];
};

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_ONE_BASE}/customer/profile`,
          { withCredentials: true }
        );
        setUser(res.data.user);
      } catch (err) {
        errorHandler(err);
        console.error("Profile fetch failed" , err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  async function handleLogout() {
    await axios.post("/api/customer/logout");
    router.replace("/auth/login");
  }

  if (loading) {
    return (
      <Loader />
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <div className="px-4 py-4 border-b border-neutral-200">
        <h1 className="text-lg font-semibold">Account</h1>
      </div>

      {/* User Info */}
      <div className="px-4 py-5 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-yellow-400 flex items-center justify-center font-bold text-lg">
          {user.username.charAt(0)}
        </div>

        <div>
          <p className="font-semibold">{user.username}</p>
          <p className="text-sm text-neutral-500">{user.phone}</p>
          {user.email && (
            <p className="text-xs text-neutral-400">{user.email}</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 space-y-2">
        <Action
          icon={<Package />}
          label="My Orders"
          onClick={() => router.push("/shop/orders")}
        />
        <Action icon={<HelpCircle />} label="Help & Support" />
      </div>

      {/* Addresses */}
      {user.address && user.address.length > 0 ? (
        <div className="space-y-2 mt-4">
          {user.address.map(addr => (
            <AddressAccordion key={addr._id} address={addr} />
          ))}
        </div>
      ) : (
        <div className="px-4 py-3 text-sm text-neutral-500">
          No saved addresses
        </div>
      )}

      {/* Logout */}
      <div className="px-4 mt-6">
        <button
          onClick={handleLogout}
          className="w-full py-3 rounded-xl border border-neutral-200 text-sm font-semibold text-red-600 hover:bg-red-50 transition flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Log out
        </button>
      </div>
    </div>
  );
}

function Action({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-neutral-50 hover:bg-neutral-100 transition"
    >
      <div className="flex items-center gap-3">
        <span className="text-neutral-700">{icon}</span>
        <span className="font-medium">{label}</span>
      </div>
      <ChevronRight className="w-5 h-5 text-neutral-400" />
    </button>
  );
}
