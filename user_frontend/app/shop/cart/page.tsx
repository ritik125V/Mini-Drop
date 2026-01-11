"use client";

import React, { useEffect, useState } from "react";
import { updateCartQuantity, removeFromCart } from "@/functions/cart_functions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/component/layout/Header";

const CART_KEY = "user-cart";

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const stored = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    setCart(stored);
  };

  const increase = (productId: string, qty: number) => {
    updateCartQuantity(productId, qty + 1);
    loadCart();
  };

  const decrease = (productId: string, qty: number) => {
    updateCartQuantity(productId, qty - 1);
    loadCart();
  };

  const removeItem = (productId: string) => {
    removeFromCart(productId);
    loadCart();
  };

  const total = cart.reduce(
    (sum, item) => sum + item.basePrice * item.quantity,
    0
  );

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#F7F7F2] flex items-center justify-center text-black">
        Your cart is empty 🛒
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F2] pb-28">
      <Header 
               address_viewMode = {false}
            />
      {/* Header */}
      <div className="max-w-md mx-auto px-4 pt-4">
        <h1 className="text-lg font-semibold text-black">Your Cart</h1>
        <p className="text-sm text-black/60">
          {cart.length} item{cart.length > 1 ? "s" : ""}
        </p>
      </div>

      {/* Cart Items */}
      <div className="max-w-md mx-auto px-4 mt-4 space-y-3">
        {cart.map(item => (
          <div
            key={item.productId}
            className="bg-white rounded-xl p-3 flex items-center gap-3"
          >
            {/* Image */}
            <div className="w-14 h-14 bg-[#F7F7F2] rounded-lg flex items-center justify-center">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-black truncate">
                {item.name}
              </p>
              <p className="text-xs text-black/60">
                ₹{item.basePrice} • {item.unitSize} {item.unitType}
              </p>

              {/* Quantity */}
              <div className="mt-2 flex items-center gap-3">
                <div className="flex items-center gap-2 bg-yellow-400 rounded-full px-3 py-1">
                  <button
                    onClick={() => decrease(item.productId, item.quantity)}
                    className="font-bold"
                  >
                    −
                  </button>
                  <span className="text-xs font-semibold">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => increase(item.productId, item.quantity)}
                    className="font-bold"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => removeItem(item.productId)}
                  className="text-xs text-black/60"
                >
                  Remove
                </button>
              </div>
            </div>

            {/* Price */}
            <div className="text-sm font-semibold text-black">
              ₹{item.basePrice * item.quantity}
            </div>
          </div>
        ))}
      </div>

      {/* Sticky Checkout Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div>
            <p className="text-xs text-black/60">Total</p>
            <p className="text-lg font-bold text-black">₹{total}</p>
          </div>

          <button
          onClick={() => {
            router.push("/shop/checkout");
          }}
          className="bg-yellow-400 px-6 py-2 rounded-full font-bold text-black">
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
