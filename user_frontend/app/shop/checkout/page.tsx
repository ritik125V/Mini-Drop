"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import AddressAccordion from "@/component/ui/AddressAccordion";
import { button } from "framer-motion/client";

interface Address {
  _id: string;
  [key: string]: any;
}

const CART_KEY = "user-cart";

export default function CheckoutPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [warehouseId, setWarehouseId] = useState("");
  const [addressId, setAddressId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [address, setAddress] = useState<any>(null);

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
        setAddress(res.data.user.address || null);
        
      } catch (err) {
        // Not logged in → redirect
        // router.replace("/auth/login");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    setCart(stored);
  }, []);

  const productsPayload = cart.map(item => ({
    productId: item.productId,
    name: item.name,
    quantity: item.quantity,
    unitPrice: item.basePrice,
    totalPrice: item.basePrice * item.quantity,
  }));

  const totalAmount = productsPayload.reduce(
    (sum, p) => sum + p.totalPrice,
    0
  );

  const placeOrder = async () => {
    if ( !warehouseId || !addressId) {
      console.log("Validation failed" , { warehouseId, addressId });
      setError("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await axios.post(
        process.env.NEXT_PUBLIC_API_ONE_BASE+"/customer/place-order" ||"http://localhost:5000/api/v1/customer/place-order",
        {
          warehouseId,
          addressId,
          products: productsPayload,
        },
        {
          withCredentials: true,
        }
      );

      setSuccess(true);
      localStorage.removeItem(CART_KEY);
    } catch (err) {
      console.error(err);
      setError("Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#F7F7F2] flex items-center justify-center text-black">
        <div className="bg-white p-6 rounded-xl text-center">
          <h2 className="text-lg font-semibold">Order placed 🎉</h2>
          <p className="text-sm text-black/60 mt-2">
            Your order will arrive soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F2] pb-28">
      <div className="max-w-md mx-auto px-4 pt-4">
        <h1 className="text-lg font-semibold text-black">Checkout</h1>

        {/* User Inputs */}
        <div className="mt-4 space-y-3">
          {/* <input
            value={userId}
            onChange={e => setUserId(e.target.value)}
            placeholder="User ID"
            className="w-full px-4 py-2 rounded-lg border text-sm"
          /> */}

          <input
            value={warehouseId}
            onChange={e => setWarehouseId(e.target.value)}
            placeholder="Warehouse ID"
            className="w-full px-4 py-2 rounded-lg border text-sm"
          />

     {address && address.length > 0 ? (
  address.map((addr: any) => (
    <AddressAccordion
      key={addr._id}
      address={addr}
      onSelectAddress={(id: string, nearestWarehouseId?: string) => {
        setAddressId(id);
        setWarehouseId(nearestWarehouseId || "");
      }}
    />
  ))
) : (
  <p className="text-sm text-black/60">No saved addresses</p>
)}

        </div>

        {/* Order Summary */}
        <div className="mt-6 bg-white rounded-xl p-4">
          <h2 className="text-sm font-semibold text-black mb-3">
            Order Summary
          </h2>

          <div className="space-y-2">
            {productsPayload.map(item => (
              <div
                key={item.productId}
                className="flex justify-between text-sm"
              >
                <span className="text-black/70">
                  {item.name} × {item.quantity}
                </span>
                <span className="font-medium">
                  ₹{item.totalPrice}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 border-t pt-3 flex justify-between">
            <span className="font-medium text-black">Total</span>
            <span className="font-bold text-black">₹{totalAmount}</span>
          </div>
        </div>

        {error && (
          <div className="mt-4 text-sm text-red-600">
            {error}
          </div>
        )}
      </div>

      {/* Sticky Place Order Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-3">
        <div className="max-w-md mx-auto">
          <button
            disabled={loading}
            onClick={placeOrder}
            className="w-full bg-yellow-400 py-3 rounded-full font-bold text-black disabled:opacity-60"
          >
            {loading ? "Placing order…" : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
}
