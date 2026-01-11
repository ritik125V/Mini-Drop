"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { motion } from "framer-motion";

type Order = {
  _id: string;
  status: string;
  customer: {
    name: string;
    phone: string;
    deliveryAddress: {
      addressLine1: string;
      city: string;
    };
  };
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await axios.get(
          process.env.NEXT_PUBLIC_API_ONE_BASE + "/customer/get-orders",
          { withCredentials: true }
        );
        setOrders(res.data.orders || []);
        console.log("orders : ",res.data.orders);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-neutral-500">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl font-semibold mb-5"
      >
        My Orders
      </motion.h1>

      {orders.length === 0 && (
        <p className="text-gray-600 text-sm">No orders found</p>
      )}

      <div className="space-y-3">
        {orders.map((order, index) => (
          <motion.div
            key={order._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link
              href={`/shop/current-order/${order._id}`}
              className="block bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">
                    {order.customer.name}
                  </p>
                  <p className="text-sm text-neutral-600">
                    {order.customer.deliveryAddress.addressLine1},{" "}
                    {order.customer.deliveryAddress.city}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-medium capitalize">
                    {order.status}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {order.customer.phone}
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
