"use client"

import React from "react";
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export interface Product {
  _id: string;
  productId: string;
  name: string;
  brand?: string;
  category?: string;
  tags?: string[];
  unitSize?: number;
  unitType?: string;
  basePrice: number;
  imageUrl?: string;
}

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const router = useRouter()

  const price = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(product.basePrice);

  function onView() {
    const id = product._id ?? product.productId
    router.push(`/product/${id}`)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} whileHover={{ scale: 1.01, y: -3 }} transition={{ type: 'spring', stiffness: 300, damping: 24 }} className="bg-[#0b0b0b] border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
      <div className="relative h-10 bg-zinc-900 flex items-center justify-center">
        {/* <motion.img
          src={product.imageUrl}
          alt={product.name}
          className="object-cover w-full h-40"
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.25 }}
        /> */}
        <div className="absolute top-2 left-2 bg-black/50 text-xs px-2 py-1 rounded text-white">
          {product.unitSize}{product.unitType ? ` ${product.unitType}` : ""}
        </div>
      </div>

      <div className="p-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold">{product.name}</h3>
            <p className="text-xs text-gray-400">{product.brand}</p>
            <p className="text-xs text-gray-400">{product._id}</p>
            
          </div>
          <div className="text-right">
            <p className="text-sm font-bold">{price}</p>
            <p className="text-xs text-gray-400">Incl. taxes</p>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <button onClick={(e) => { e.stopPropagation(); console.log('Add to cart', product); }} className="flex-1 bg-green-600 text-white text-sm py-2 rounded-md hover:bg-green-500">Add</button>
          <button onClick={(e) => { e.stopPropagation(); onView(); }} className="w-20 bg-white text-black text-sm py-2 rounded-md">View</button>
        </div>

        {product.tags && product.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {product.tags.slice(0, 3).map((t) => (
              <span key={t} className="text-xs bg-zinc-800 px-2 py-1 rounded text-gray-300">{t}</span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;
