"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import AnimatedDiv from "@/component/animatedDiv";
import {
  addToCart,
  updateCartQuantity,
} from "@/functions/cart_functions";
import { useParams, useRouter } from "next/navigation";
import Header from "@/component/layout/Header";
import Loader from "@/component/ui/Loader";
import {
  Plus,
  Minus,
  ShoppingCart,
  Flame,
  AlertTriangle,
} from "lucide-react";

const CART_KEY = "user-cart";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qty, setQty] = useState(0);
  const [loginStatus, setLoginStatus] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchProduct() {
      try {
        setLoading(true);

        const { data } = await axios.get(
          process.env.NEXT_PUBLIC_API_ONE_BASE +
            "/customers/product-info",
          {
            params: { productId: id },
            withCredentials: true,
          }
        );

        if (!mounted) return;

        setLoginStatus(data.login_status);
        setProduct(data.product || null);

        const cart = JSON.parse(
          localStorage.getItem(CART_KEY) || "[]"
        );
        const item = cart.find(
          (i: any) => i.productId === data?.product?.productId
        );
        if (item) setQty(item.quantity);
      } catch (err: any) {
        if (err.response?.status === 401) {
          router.push("/auth/login");
        }
        setError("Failed to load product");
      } finally {
        mounted && setLoading(false);
      }
    }

    fetchProduct();
    return () => {
      mounted = false;
    };
  }, [id, router]);

  /* ---------------- STOCK UI ---------------- */

  const stockBadge = () => {
    if (!product.isActive)
      return (
        <span className="flex items-center gap-1 text-xs text-gray-500">
          <AlertTriangle size={14} /> Not available
        </span>
      );

    if (product.stock === 0)
      return (
        <span className="flex items-center gap-1 text-xs text-red-500">
          <AlertTriangle size={14} /> Out of stock
        </span>
      );

    if (product.stock <= 5)
      return (
        <span className="flex items-center gap-1 text-xs text-orange-500">
          <Flame size={14} /> Few left
        </span>
      );

    return null;
  };

  /* ---------------- CART HANDLERS ---------------- */

  const increase = () => {
    const newQty = qty + 1;
    setQty(newQty);
    updateCartQuantity(product.productId, newQty);
  };

  const decrease = () => {
    const newQty = qty - 1;
    if (newQty < 0) return;
    setQty(newQty);
    updateCartQuantity(product.productId, newQty);
  };

  /* ---------------- STATES ---------------- */

  if (loading) return <Loader />;

  if (error)
    return (
      <div className="min-h-screen grid place-items-center">
        {error}
      </div>
    );

  if (!product)
    return (
      <div className="min-h-screen grid place-items-center">
        Product not found
      </div>
    );

  const isDisabled =
    !product.isActive || product.stock === 0;

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-[#F7F7F2] pb-28">
      <Header address_viewMode={false} isLogedIn={loginStatus} />

      <AnimatedDiv>
        <div className="max-w-md mx-auto px-4 pt-4">
          {/* IMAGE */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-56 object-contain transition-transform duration-300 hover:scale-105"
            />
          </div>

          {/* INFO */}
          <div className="mt-4 space-y-2">
            {stockBadge()}

            <h1 className="text-lg font-semibold">
              {product.name}
            </h1>

            <p className="text-sm text-black/60">
              {product.brand} • {product.unitSize}{" "}
              {product.unitType}
            </p>

            {/* PRICE + CART */}
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xl font-bold">
                ₹{product.basePrice}
              </span>

              {qty === 0 ? (
                <button
                  disabled={isDisabled}
                  onClick={() => {
                    setQty(1);
                    addToCart(product);
                  }}
                  className="flex items-center gap-2 bg-yellow-400 px-4 py-2 rounded-full font-bold active:scale-95 transition disabled:opacity-40"
                >
                  <ShoppingCart size={16} /> ADD
                </button>
              ) : (
                <div className="flex items-center gap-4 bg-yellow-400 rounded-full px-3 py-2 animate-scale-in">
                  <button onClick={decrease}>
                    <Minus size={16} />
                  </button>
                  <span className="font-semibold">{qty}</span>
                  <button onClick={increase}>
                    <Plus size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* TAGS */}
            {product.tags?.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {product.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="text-xs bg-white px-3 py-1 rounded-full text-black/70 shadow-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </AnimatedDiv>

      {/* STICKY CART */}
      {qty > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-3 animate-slide-up">
          <div className="max-w-md mx-auto flex items-center justify-between">
            <span className="font-medium">
              {qty} item • ₹{qty * product.basePrice}
            </span>
            <button
              onClick={() => router.push("/shop/cart")}
              className="bg-yellow-400 px-5 py-2 rounded-full font-bold active:scale-95 transition"
            >
              View Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
