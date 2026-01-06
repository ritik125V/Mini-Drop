"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { json } from "stream/consumers";

export default function ProductPage() {
  const params = useParams();
  const id = params?.id as string;

  const [product, setProduct] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [warehouseId, setWarehouseId] = useState(JSON.parse(localStorage.getItem('store-operator-data') || '{}')?.warehouseId || '');
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();

    async function fetchProduct() {
      try {
        setLoading(true);
        const res = await axios.get(
          process.env.NEXT_PUBLIC_API_ONE_BASE+"/customers/product-info" ||
          "http://localhost:5000/api/v1/customers/product-info",
          {
            params: { productId: id },
            signal: controller.signal,
          }
        );
        console.log("res is : " , res);
        
        setProduct(res.data?.product );
      } catch (err) {
        if (axios.isCancel(err)) return;
        setError("Failed to load product information.");
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
    return () => controller.abort();
  }, [id]);

  async function addProductToWarehouse(
    warehouseId: string,
    productId: string,
    quantity: number,
    tags:Array<string>,
    name:string
  ) {
    if (!warehouseId || !productId || quantity <= 0) {
      setError("Invalid input");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setSuccessMsg(null);
      console.log("data is " , warehouseId , tags , name , quantity);
      
      await axios.post(
        process.env.NEXT_PUBLIC_API_ONE_BASE+"/warehouse/add-product" ||
        "http://localhost:5000/api/v1/warehouse/add-product",
        {
          warehouseId,
          productId,
          quantity,
          tags,
          name
        }
      );

      setSuccessMsg("Product added to warehouse successfully.");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
          err.message ??
          "Failed to add product"
      );
    } finally {
      setSubmitting(false);
    }
  }

  const productId =
    product?.productId ?? product?._id ?? product?.id ?? "";

  /* ---------- UI ---------- */

  if (loading)
    return <div className="p-6 text-gray-400">Loading product…</div>;

  if (error)
    return <div className="p-6 bg-red-100 text-red-700">{error}</div>;

  if (!product)
    return <div className="p-6 text-gray-400">No product found</div>;

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-6">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded overflow-hidden">
          <img
            src={product.imageUrl || product.image}
            alt={product.name}
            className="w-full h-72 object-cover"
          />
        </div>

        <div className="md:col-span-2">
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <h1 className="text-2xl font-bold">{product.productId}</h1>
          <p className="text-sm text-gray-400">
            {product.brand} • {product.category}
          </p>

          <div className="mt-4 text-2xl font-extrabold">
            ₹{product.basePrice ?? product.price}
          </div>

          <div className="mt-6 bg-zinc-900 p-4 rounded">
            <h4 className="mb-2 font-semibold">Add to Warehouse</h4>
            <div className="flex gap-2">
              <input
                placeholder="Warehouse ID"
                value={warehouseId}
                onChange={(e) => setWarehouseId(e.target.value)}
                className="bg-zinc-800 px-2 py-1 rounded"
              />
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(+e.target.value)}
                className="bg-zinc-800 px-2 py-1 rounded w-24"
              />
              <button
                disabled={submitting}
                onClick={() =>
                  addProductToWarehouse(warehouseId, productId, quantity , product.tags , product.name)
                }
                className="bg-blue-600 px-4 py-1 rounded disabled:opacity-50"
              >
                {submitting ? "Adding…" : "Add"}
              </button>
            </div>
            {successMsg && (
              <p className="text-green-400 mt-2">{successMsg}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
