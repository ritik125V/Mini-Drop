"use client";

import React, { useEffect, useState, useCallback } from "react";
import Header from "@/component/header";
import { io, Socket } from "socket.io-client";
import { p } from "framer-motion/client";
import { useRouter } from "next/navigation";

/* ================= SOCKET INSTANCE ================= */
const socket: Socket = io("http://localhost:5000", {
  transports: ["websocket"],
  autoConnect: true,
});

type Order = Record<string, any>;

export default function OrdersPage() {
  const [warehouseId, setWarehouseId] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  /* ========== READ WAREHOUSE ID ========== */
  useEffect(() => {
    const data = JSON.parse(
      localStorage.getItem("store-operator-data") || "{}"
    );
    if (data?.warehouseId) {
      setWarehouseId(data.warehouseId);
    }
  }, []);

  /* ========== FETCH ORDERS ========== */
  const fetchOrders = useCallback(async () => {
    if (!warehouseId) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_API_ONE_BASE+"/warehouse/get-orders?warehouseId="+warehouseId ||
        `http://localhost:5000/api/v1/warehouse/get-orders?warehouseId=${warehouseId}`
      );
      const data = await res.json();
      setOrders(data?.orders || []);
    } catch {
      setError("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  }, [warehouseId]);

  /* ========== INITIAL FETCH ========== */
  useEffect(() => {
    if (warehouseId) {
      fetchOrders();
    }
  }, [warehouseId, fetchOrders]);

  /* ========== SOCKET: JOIN ROOM + LISTEN ========== */
  useEffect(() => {
    if (!warehouseId) return;

    const joinWarehouseRoom = () => {
      console.log("✅ Socket connected:", socket.id);
      console.log("➡️ Joining warehouse room:", warehouseId);
      socket.emit("order-listener", warehouseId);
    };

    socket.on("connect", joinWarehouseRoom);

    socket.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err.message);
    });

    socket.on("new-order", (data) => {
      console.log("📦 New order received:", data);
      if (data?.refresh) {
        fetchOrders(); // 🔥 AUTO REFRESH ORDERS
      }
    });

    // hot-reload / already-connected case
    if (socket.connected) {
      joinWarehouseRoom();
    }

    return () => {
      socket.off("connect", joinWarehouseRoom);
      socket.off("connect_error");
      socket.off("new-order");
    };
  }, [warehouseId, fetchOrders]);

  /* ========== STATUS STYLES ========== */
  const statusStyles = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-amber-100 text-amber-700";
      case "packing":
        return "bg-blue-100 text-blue-700";
      case "out for delivery":
      case "delivered":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Header />

      <div className="mx-auto max-w-5xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">
          Warehouse Orders
        </h1>

        {loading && <p className="text-sm text-gray-500">Loading orders…</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}

        {!loading && orders.length === 0 && (
          <p className="text-sm text-gray-500">No orders found.</p>
        )}

        <div className="space-y-4">
          {orders.map((order) => {
            const total = order.products?.reduce(
              (sum: number, p: any) => sum + (p.totalPrice || 0),
              0
            );

            return (
              <div
                key={order._id}
                onClick={(e)=>{
                  router.push(`/current-order/${order._id}`)
                }}
                className="rounded-xl bg-white cursor-pointer p-5 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">
                      Order #{order._id.slice(-6)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-800">
                    {order.customerInfo?.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {order.customerInfo?.phone}
                  </p>
                </div>

                <div className="mt-4 space-y-2 border-t pt-4">
                  {order.products.map((p: any) => (
                    <div key={p._id} className="flex justify-between text-sm">
                      <span className="text-gray-700">
                        {p.name} × {p.quantity}
                      </span>
                      <span className="font-medium text-gray-900">
                        ₹{p.totalPrice}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex justify-between border-t pt-4">
                  <span className="text-xs text-gray-500">
                    Warehouse: {order.warehouseId}
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                    ₹{total}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
