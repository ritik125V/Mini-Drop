"use client";

import React from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Ellipsis } from "lucide-react";

import logo from "../../../resources/logos/MD-logo_transparent_bg.png";

export default function Page() {
  const router = useRouter();

  const [form, setForm] = React.useState({
    username: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        process.env.NEXT_PUBLIC_API_ONE_BASE + "/customer/signup",
        form
      );

      if (res.data.success) {
        router.push("/login");
      } else {
        setError(res.data.message || "Signup failed");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-md p-6">
        
        {/* Brand */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <Image src={logo} alt="Mini Drop logo" width={40} height={40} />
          <h1 className="text-lg font-semibold text-gray-800">
            Mini<span className="text-gray-500">Drop</span>
          </h1>
        </div>

        {/* Heading */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Create Account
          </h2>
          <p className="text-sm text-gray-500">
            Sign up to get started
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignup} className="flex flex-col gap-4">

          <Input label="Username" name="username" value={form.username} onChange={handleChange} />
          <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
          <Input label="Mobile Number" name="phone" type="tel" value={form.phone} onChange={handleChange} />
          <Input label="Address" name="address" value={form.address} onChange={handleChange} />
          <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} />

          {error && (
            <p className="text-xs text-red-500 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`rounded-lg py-2 text-sm font-medium transition
              ${loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-900"}
            `}
          >
            {loading ? <Ellipsis className="mx-auto animate-pulse" /> : "Sign Up"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-xs text-gray-500 text-center mt-6">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/auth/login")}
            className="text-black cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

/* Reusable Input */
function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-600">{label}</label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required
        className="border rounded-lg px-3 py-2 text-sm outline-none
                   focus:ring-2 focus:ring-black/10 focus:border-gray-400"
      />
    </div>
  );
}
