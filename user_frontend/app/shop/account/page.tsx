"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  ChevronRight,
  Package,
  MapPin,
  HelpCircle,
  LogOut,
} from "lucide-react";

type Address = {
  _id: string;
  title: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  coordinates: [number, number];
};

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

  // Fetch profile using cookie
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await axios.get(
          process.env.NEXT_PUBLIC_API_ONE_BASE + "/customer/profile",
          {
            withCredentials: true,
          }
        );
        setUser(res.data.user);
        console.log("user : ", res.data.user);
      } catch (err) {
        // Not logged in → redirect
        // router.replace("/auth/login");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [router]);

  async function handleLogout() {
    await axios.post("/api/customer/logout");
    router.replace("/auth/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-neutral-500">Loading profile...</p>
      </div>
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
      {user.address && user.address.length > 0 ? (
        <div className="space-y-2">
          {user.address.map((addr) => (
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
        <button className="w-full py-3 rounded-xl border border-neutral-200 text-sm font-semibold text-red-600 hover:bg-red-50 transition flex items-center justify-center gap-2">
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

function AddressAccordion({ address }: { address: Address }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="px-2 mx-2 my-1 rounded-xl overflow-hidden bg-neutral-50">
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
