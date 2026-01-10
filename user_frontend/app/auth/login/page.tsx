"use client";

import React from "react";
import Image from "next/image";
import logo from "../../../resources/logos/MD-logo_transparent_bg.png";

function Page() {
  return (
    <div className="min-h-screen flex flex-col  items-center justify-center text-sm text-neutral-500">
      <div className="flex justify-center items-center ">
        <Image
            className=""
          src={logo}
          alt="MD logo"
          width={100}
          height={100}
        />
        <h1 className="font-bold text-md">Mini Drop.</h1>
      </div>
      <div className="flex flex-col justify-center items-center ">
        <form action="" className="flex flex-col justify-center m-1 gap-2 items-center ">
            <input placeholder="Mobile Number" type="text" className="border rounded-lg shadow-xs px-2 py-1 border-gray-300"/>
            <input type="text" placeholder="password" className="border rounded-lg shadow-xs px-2 py-1 border-gray-300" />
            </form> 
      </div>
    </div>
  );
}

export default Page;
