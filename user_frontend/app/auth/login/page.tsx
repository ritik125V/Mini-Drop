"use client";

import React from "react";
import Image from "next/image";
import logo from "../../../resources/logos/MD-logo_transparent_bg.png";
import axios from "axios";
import { useRouter } from "next/navigation";
import { LoaderCircle } from 'lucide-react';





function Page() {
  const [phone , setphone] = React.useState("");
  const [password , setpassword] = React.useState("");
  const[loading , setloading] = React.useState(false);
  const[error , seterror] = React.useState("");

  const router = useRouter();
  console.log("api url : ",process.env.NEXT_PUBLIC_API_ONE_BASE+"/customer/login");
  

  async function handleLogin(e:any){
    e.preventDefault();
    setloading(true);
    seterror("");
    try {
      const res = await axios.post(process.env.NEXT_PUBLIC_API_ONE_BASE+"/customer/login" , {
        phone , password
      } ,{
        withCredentials:true
      })
      console.log("res : ",res.data);
      if(res.data.success){
        console.log("logged in ");
        router.push("/shop/home");
        setloading(false);
        
      }

    } catch (error) {
      alert("Something went wrong");
      console.log("error : ",error);
    }
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-md p-6">
        
        {/* Logo + Brand */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <Image
            src={logo}
            alt="Mini Drop logo"
            width={40}
            height={40}
            priority
          />
          <h1 className="text-lg font-semibold text-gray-800">  
            Mini<span className="text-gray-500">Drop</span>
          </h1>
        </div>

        {/* Heading */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Welcome Back
          </h2>
          <p className="text-sm text-gray-500">
            login to continue
          </p>
        </div>

        {/* Form */}
        <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-600">
              Mobile Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setphone(e.target.value)}
              placeholder="Enter your mobile number"
              className="border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-600">
              Password
            </label>
            <input
              value={password}
              onChange={(e) => setpassword(e.target.value)}
              type="password"
              placeholder="Enter your password"
              className="border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400"
            />
          </div>

          {/* Action */}
          <button
            onClick={handleLogin}
            type="submit"
            className="mt-2 bg-black text-white justify-center flex rounded-lg py-2 text-sm font-medium hover:bg-gray-900 transition"
          >
            {
              loading?
               <LoaderCircle/>:
               "Login"
            }
          </button>
        </form>

        {/* Footer */}
        <p className="text-xs text-gray-500 text-center mt-6">
          © {new Date().getFullYear()} Mini Drop. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default Page;
