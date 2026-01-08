"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";

const CART_KEY = "user-cart";

type Product = {
  _id?: string;
  productId: string;
  name: string;
  imageUrl?: string;
  unitSize?: string;
  unitType?: string;
  basePrice: number;
  [key: string]: any;
};

type CartItem = Product & { quantity: number };

export default function ProductCard({ product }: { product: Product }) {
  const [qty, setQty] = useState(0);

  /* ---------------- Load qty ---------------- */
  useEffect(() => {
    const cart: CartItem[] = JSON.parse(
      localStorage.getItem(CART_KEY) ?? "[]"
    );
    const item = cart.find(
      (i) => i.productId === product.productId
    );
    if (item) setQty(item.quantity);
  }, [product.productId]);

  /* ---------------- Update cart ---------------- */
  const updateCart = (newQty: number) => {
    let cart: CartItem[] = JSON.parse(
      localStorage.getItem(CART_KEY) ?? "[]"
    );

    const index = cart.findIndex(
      (i) => i.productId === product.productId
    );

    if (newQty <= 0) {
      cart = cart.filter(
        (i) => i.productId !== product.productId
      );
    } else if (index !== -1) {
      cart[index].quantity = newQty;
    } else {
      cart.push({ ...product, quantity: newQty });
    }

    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    setQty(newQty);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.9999 }}
      className="bg-white rounded-2xl border border-neutral-200 p-3 flex flex-col"
    >
      {/* Image */}
      <Link
        href={`/shop/product/${product._id ?? product.productId}`}
        className="relative w-full aspect-square rounded-xl bg-neutral-50 flex items-center justify-center overflow-hidden"
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </Link>

      {/* Info */}
      <div className="mt-3 flex-1">
        <Link
          href={`/product/${product._id ?? product.productId}`}
          className="block text-sm font-medium text-neutral-900 leading-tight line-clamp-2"
        >
          {product.name}
        </Link>

        <p className="mt-0.5 text-xs text-neutral-500">
          {product.unitSize} {product.unitType}
        </p>

        <p className="mt-1 text-base font-semibold text-neutral-900">
          ₹{product.basePrice}
        </p>
      </div>

      {/* Action */}
      <div className="mt-3">
        <AnimatePresence mode="wait">
          {qty === 0 ? (
            <motion.button
              key="add"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={() => updateCart(1)}
              className="w-full rounded-full border border-yellow-400 text-yellow-600 font-semibold text-sm py-2 hover:bg-yellow-400 hover:text-black transition"
            >
              ADD
            </motion.button>
          ) : (
            <motion.div
              key="qty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center justify-between rounded-full bg-yellow-400 px-3 py-1.5"
            >
              <button
                onClick={() => updateCart(qty - 1)}
                className="text-lg font-bold text-black"
              >
                −
              </button>

              <span className="text-sm font-semibold text-black">
                {qty}
              </span>

              <button
                onClick={() => updateCart(qty + 1)}
                className="text-lg font-bold text-black"
              >
                +
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
