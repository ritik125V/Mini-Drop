"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import AnimatedDiv from '../../../../component/animatedDiv';
import {
  addToCart,
  updateCartQuantity,
} from '../../../../functions/cart_functions.js'
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Header from "@/component/layout/Header";
import Loader from "@/component/ui/Loader";

const CART_KEY = "user-cart";

export default function ProductPage({ params }: { params: { id: string } }) {
  const { id } = useParams();

  const [product, setProduct] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(0);

  const router = useRouter();


  // Fetch product (Axios)
  useEffect(() => {
    let mounted = true;

    async function fetchProduct() {
      try {
        setLoading(true);

        const { data } = await axios.get(
          process.env.NEXT_PUBLIC_API_ONE_BASE+"/customers/product-info" ||
          "http://localhost:5000/api/v1/customers/product-info",
          {
            params: { productId: id },
             withCredentials: true,
          }
        );
        
        
        if (!mounted) return;

        setProduct(data?.product || null);

        // Load quantity from cart
        const cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
        const item = cart.find(
          (i: any) => i.productId === data?.product?.productId
        );
        if (item) setQty(item.quantity);
      } catch (err:any) {
        console.error("error  :",err);
        if(err.status===401){
          router.push("/auth/login");
        }
        if (mounted) setError("Failed to load product");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchProduct();

    return () => {
      mounted = false;
    };
  }, [id]);

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

  if (loading) {
    return (
     <Loader />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F7F7F2] flex items-center justify-center text-black">
        {error}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F7F7F2] flex items-center justify-center text-black">
        Product not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F2] pb-24">
      <Header 
         address_viewMode = {false}
      />
      <AnimatedDiv>
        <div className="max-w-md mx-auto px-4 pt-4">
          {/* Image */}
          <div className="bg-white rounded-2xl p-4">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-56 object-contain"
            />
          </div>

          {/* Info */}
          <div className="mt-4">
            <h1 className="text-lg font-semibold text-black">
              {product.name}
            </h1>

            <p className="text-sm text-black/60 mt-1">
              {product.brand} • {product.unitSize} {product.unitType}
            </p>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-xl font-bold text-black">
                ₹{product.basePrice}
              </span>

              {qty === 0 ? (
                <button
                  onClick={() => {
                    setQty(1);
                    addToCart(product);
                  }}
                  className="bg-yellow-400 px-4 py-2 rounded-full text-sm font-bold text-black active:scale-95"
                >
                  ADD
                </button>
              ) : (
                <div className="flex items-center gap-3 bg-yellow-400 rounded-full px-3 py-1.5">
                  <button onClick={decrease} className="font-bold">
                    −
                  </button>
                  <span className="text-sm font-semibold">{qty}</span>
                  <button onClick={increase} className="font-bold">
                    +
                  </button>
                </div>
              )}
            </div>

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {product.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="text-xs bg-white px-2 py-1 rounded-full text-black/70"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </AnimatedDiv>

      {/* Sticky Bottom Bar */}
      {qty > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-3">
          <div className="max-w-md mx-auto flex items-center justify-between">
            <span className="text-sm font-medium text-black">
              {qty} item • ₹{qty * product.basePrice}
            </span>
            <button 
            onClick={()=>{
              router.push("/shop/cart")
            }}
            className="bg-yellow-400 px-5 py-2 rounded-full font-bold text-black">
              View Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
