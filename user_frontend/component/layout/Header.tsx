"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { div } from "framer-motion/client";
import Image from "next/image";
import logo from "../../resources/logos/MD-logo_transparent_bg.png";


interface HeaderProps {
  address_viewMode?:boolean,
  address?: any;
  eta?: number | null;
  distance?: string | null;
}

export default function Header({ address, eta, distance ,address_viewMode  }: HeaderProps) {
    const router = useRouter();
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-neutral-200">
      <div className="sm:px-4 px-1 py-3 flex items-center justify-between max-w-7xl mx-auto ">

       
        <div className="min-w-0  flex items-center">
           <div className="flex justify-center items-center  ">
        <Image
            className="w-14"
          src={logo}
          alt="MD logo"
        />
      </div>
           {
            address_viewMode &&<div>
            <p className="text-[11px] text-neutral-500">Deliver to</p>
             {
              address? 
              <div>
                <p className="text-sm font-semibold truncate max-w-[220px]">
                  {address?.road && `${address.road}, `}
                  {address?.suburb && `${address.suburb}, `}
                  {address?.city}
                </p>
              </div>
              : <div>
                <p className="text-sm font-semibold truncate max-w-[220px]">locating you....</p>
              </div>
            }
            {eta && distance && (
            <p className="text-[11px] text-neutral-500 mt-0.5 ">
              {eta + 10} min • {distance} km
            </p>
          )}
           </div> 
           }
        </div>

        {/* Account */}
        <button
        onClick={() => router.push("/shop/account")}
        className="shrink-0  rounded-full bg-neutral-100 px-4 py-1.5 text-sm font-medium hover:bg-neutral-200 transition">
          Account
        </button>
      </div>
    </header>
  );
}
