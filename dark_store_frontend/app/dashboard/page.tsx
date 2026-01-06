'use client';
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ProductCard, { Product } from '@/component/productCard';
import Header from '@/component/header';
interface StoreOperatorData {
  email: string
  name: string
  phone: string
  role: string
  warehouseId?: string
  token?: string
}



export default function Dashboard() {
  const [data, setData] = useState<StoreOperatorData | null>(null)
  const [inventory, setInventory] = useState<Record<string, number>>({})
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [adding, setAdding] = useState<Record<string, boolean>>({})
  const [error, setError] = useState<string | null>(null)
  const [products, setProducts] = useState<Product[]>([]) 

  // helper to get a stable product id from multiple possible shapes
  const getProductId = (p: any): string => {
    return String(p.id ?? p._id ?? p.productId ?? p.sku ?? '')
  }

  useEffect(() => {
    try {
      const raw = localStorage.getItem('store-operator-data')
      if (!raw) return
      const parsed: StoreOperatorData = JSON.parse(raw)
      setData(parsed)
    } catch (err) {
      console.error('Failed to parse store-operator-data from localStorage', err)
    }
  }, [])

  useEffect(() => {
    if (!data) return

    const fetchProducts = async () => {
      setLoadingProducts(true)
      setError(null)
      try {
        const headers: Record<string, string> = {}
        if ((data as any).token) headers['Authorization'] = `Bearer ${(data as any).token}`

        const res = await axios.get(
          process.env.NEXT_PUBLIC_API_ONE_BASE+"/admin/products" ||'http://localhost:5000/api/v1/admin/products', { headers })
        console.log(res.data);
        
        const items: Product[] = Array.isArray(res.data) ? res.data : res.data?.products ?? []
        setProducts(items)

        // initialize inventory map if API returns stock info per product
        const initialInventory: Record<string, number> = {}
        items.forEach((p) => {
          const id = getProductId(p)
          // common places for stock in responses: p.stock, p.quantity, p.inventory
          const qty = (p as any).stock ?? (p as any).quantity ?? (p as any).inventory ?? 0
          initialInventory[id] = typeof qty === 'number' ? qty : 0
        })
        setInventory(initialInventory)
      } catch (err: any) {
        console.error('Failed to fetch products', err)
        setError(err?.message ?? 'Failed to fetch products')
      } finally {
        setLoadingProducts(false)
      }
    }

    fetchProducts()
  }, [data])

  const handleAddToWarehouse = async (product: Product) => {
    if (!data?.warehouseId) {
      alert('No warehouse ID available on your profile.')
      return
    }

    const pid = getProductId(product)

    setAdding((s) => ({ ...s, [pid]: true }))
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if ((data as any).token) headers['Authorization'] = `Bearer ${(data as any).token}`

      // POST to warehouse products endpoint (adjust if your backend differs)
      const url = 
      process.env.NEXT_PUBLIC_API_ONE_BASE+"/warehouse/"+data.warehouseId+"/products" ||
      `http://localhost:5000/api/v1/warehouse/${data.warehouseId}/products`
      // sending quantity 1 by default; backend may return updated stock for this product
      const res = await axios.post(
        url,
        { productId: pid, quantity: 1 },
        { headers }
      )

      // update local inventory from response if available, otherwise increment
      const returnedQty = res?.data?.quantity ?? res?.data?.stock ?? res?.data?.inventory
      setInventory((inv) => {
        const current = inv[pid] ?? 0
        const next = typeof returnedQty === 'number' ? returnedQty : current + 1
        return { ...inv, [pid]: next }
      })
    } catch (err) {
      console.error('Failed to add product to warehouse', err)
      alert('Failed to add product to warehouse')
    } finally {
      setAdding((s) => ({ ...s, [pid]: false }))
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <Header />
      <h1>Dashboard</h1>

      {data ? (
        <>
          <h2>Profile</h2>
          <ul>
            <li><strong>Name:</strong> {data.name}</li>
            <li><strong>Email:</strong> {data.email}</li>
            <li><strong>Phone:</strong> {data.phone}</li>
            <li><strong>Role:</strong> {data.role}</li>
          </ul>

          <h2>Warehouse</h2>
          <p><strong>ID:</strong> {data.warehouseId ?? '—'}</p>

          <hr />

          <h2>Products</h2>
          {loadingProducts ? (
            <p>Loading products…</p>
          ) : error ? (
            <p style={{ color: 'red' }}>{error}</p>
          ) : products.length === 0 ? (
            <p>No products found.</p>
          ) : (
            <div>
              {products.map((p) => (
                <ProductCard key={getProductId(p)} product={p} />
              ))}
            </div>
          )}
        </>
      ) : (
        <p>No store operator data found in localStorage (key: "store-operator-data").</p>
      )}
    </div>
  )
}