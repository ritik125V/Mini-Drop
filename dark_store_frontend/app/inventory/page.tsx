"use client";

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Header from "@/component/header";

/* ================= TYPES ================= */
interface InventoryItem {
  _id: string;
  warehouseId: string;
  productId: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
  __v?: number;
  name: string;
}

/* ================= PAGE ================= */
export default function Page() {
  const [warehouseId, setWarehouseId] = useState<string>("");
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ========== READ WAREHOUSE ID ========== */
  useEffect(() => {
    try {
      const data = JSON.parse(
        localStorage.getItem("store-operator-data") || "{}"
      );
      if (data?.warehouseId) {
        setWarehouseId(data.warehouseId);
      }
    } catch (err) {
      console.error("Failed to read store-operator-data:", err);
    }
  }, []);

  /* ========== FETCH INVENTORY ========== */
  const fetchInventory = useCallback(async () => {
    if (!warehouseId) return;

    setLoading(true);
    setError(null);

    try {
      const res = await axios.get(
        process.env.NEXT_PUBLIC_API_ONE_BASE+"/warehouse/current-inventory" ||
        "http://localhost:5000/api/v1/warehouse/current-inventory",
        {
          params: { warehouseId },
        }
      );

      const data = res.data;

      setItems(Array.isArray(data?.inventory) ? data.inventory : []);
      setCount(
        typeof data?.inventoryCount === "number"
          ? data.inventoryCount
          : Array.isArray(data?.inventory)
          ? data.inventory.length
          : null
      );
    } catch (err: any) {
      console.error("Error fetching inventory:", err);
      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.message ?? err.message
          : "Failed to load inventory"
      );
      setItems([]);
      setCount(null);
    } finally {
      setLoading(false);
    }
  }, [warehouseId]);

  /* ========== INITIAL FETCH ========== */
  useEffect(() => {
    if (warehouseId) {
      fetchInventory();
    }
  }, [warehouseId, fetchInventory]);

  /* ================= UI ================= */
  return (
    <div className="p-6">
      <Header />

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Inventory</h1>

        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-400">
            Warehouse: <strong>{warehouseId || "—"}</strong>
          </div>

          <button
            onClick={fetchInventory}
            className="bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-50"
            disabled={loading || !warehouseId}
          >
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {!warehouseId ? (
        <p className="text-gray-400">No warehouse ID found.</p>
      ) : loading && items.length === 0 ? (
        <p className="text-gray-400">Loading inventory…</p>
      ) : items.length === 0 ? (
        <p className="text-gray-400">No inventory records found.</p>
      ) : (
        <>
          <div className="mb-4 text-sm text-gray-400">
            Total items: {count ?? items.length}
          </div>

          <div className="overflow-auto rounded bg-zinc-900 p-2">
            <table className="min-w-full text-left text-white">
              <thead>
                <tr className="text-sm text-gray-300 border-b border-zinc-700">
                  <th className="py-2 px-3">Product Name</th>
                  <th className="py-2 px-3">Product ID</th>
                  <th className="py-2 px-3">Stock</th>
                  <th className="py-2 px-3">Created At</th>
                  <th className="py-2 px-3">Updated At</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it._id} className="border-b border-zinc-800">
                    <td className="py-2 px-3 text-sm">{it.name}</td>
                    <td className="py-2 px-3 text-sm">{it.productId}</td>
                    <td className="py-2 px-3 text-sm">{it.stock}</td>
                    <td className="py-2 px-3 text-sm">
                      {new Date(it.createdAt).toLocaleString()}
                    </td>
                    <td className="py-2 px-3 text-sm">
                      {new Date(it.updatedAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
