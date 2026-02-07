"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronDown, MapPin ,HatGlasses,UserRound  } from "lucide-react";

import logo from "../../resources/logos/MD-logo_transparent_bg.png";

interface HeaderProps {
  iswarehouse_present?: boolean;
  address_viewMode?: boolean;
  address?: any;
  eta?: number | null;
  distance?: number | null;
  isLogedIn?: boolean;
  onChangeCurrentAddress?: () => void;
}

export default function Header({
  address,
  eta,
  distance ,
  address_viewMode,
  iswarehouse_present,
  isLogedIn,
  onChangeCurrentAddress,
}: HeaderProps) {
  const router = useRouter();

  function HandleChangeAddress() {
    onChangeCurrentAddress && onChangeCurrentAddress();
  }
  const bufferTime: number = distance ? distance * 2 : 10;
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-neutral-200">
      <div className="sm:px-4 sm:py-3 py-2 flex items-center justify-between max-w-7xl mx-auto">
        {/* Left */}
        <div className="min-w-0 flex items-center gap-2">
          <Image
            src={logo}
            alt="MD logo"
            onClick={() => router.push("/shop/home")}
            className="w-20 -ml-2.5 sm:ml-0 -mr-2 sm:mr-0 h-10 sm:w-24 sm:h-12 object-contain cursor-pointer hover:scale-105 duration-150"
          />

          {(address_viewMode || iswarehouse_present) && (
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-1 text-neutral-500">
                <MapPin size={12} className="shrink-0" />
                <span className="text-[11px]">Deliver to</span>

                <button
                  onClick={HandleChangeAddress}
                  className="ml-1 p-0.5 rounded hover:bg-neutral-100 text-blue-600 hover:text-blue-700 transition"
                  aria-label="Change delivery address"
                >
                  <ChevronDown size={14} />
                </button>
              </div>

              {address ? (
                <p className="text-xs font-semibold truncate max-w-[220px]">
                  {address?.road && `${address.road}, `}
                  {address?.suburb && `${address.suburb}, `}
                  {address?.city}
                </p>
              ) : (
                <p className="text-xs font-medium text-neutral-400">
                  Locating your address…
                </p>
              )}

              {eta && distance && (
                <p className="text-[11px] text-neutral-500">
                  <span className="text-[13px] font-semibold text-red-400">
                    ⚡ {eta + Math.trunc(bufferTime)} min
                  </span>{" "}
                  • {distance} km
                </p>
              )}
            </div>
          )}
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          {isLogedIn ? (
            <button
              onClick={() => router.push("/shop/account")}
              className="shrink-0 items-center flex rounded-full bg-neutral-100 px-4 py-1.5 text-sm font-medium hover:bg-neutral-200 transition"
            >
              <UserRound size={14} className="inline mr-1" />
              Account
            </button>
          ) : (
            <button
              onClick={() => router.push("/auth/login")}
              className="shrink-0 flex items-center rounded-full bg-neutral-100 px-4 py-1.5 text-sm font-medium hover:bg-neutral-200 transition"
            >
              <HatGlasses size={14} className="inline mr-1" />
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
