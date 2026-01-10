"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import OrderStatus from "@/component/ws";


/* ---------------- Fix Leaflet Icons ---------------- */


export default function CurrentOrderPage() {
  const params = useParams();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  /* ---------------- Fetch Order ---------------- */
  useEffect(() => {
    if (!orderId) return;

    axios
      .get(process.env.NEXT_PUBLIC_API_ONE_BASE+"/customer/track-order" || "http://localhost:5000/api/v1/customer/track-order", {
        params: { orderId },
      })
      .then((res) => {
        setOrder(res.data.order);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-neutral-500">
        Loading your order…
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-neutral-500">
        Order not found
      </div>
    );
  }

  const address = order.customer.deliveryAddress;
  const [lng, lat] = address.coordinates;

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <div className="px-4 py-4 border-b border-neutral-200">
        <h1 className="text-lg font-semibold">
          Order #{orderId.slice(-6)}
        </h1>
        <p className="text-xs text-neutral-500 mt-0.5">
          Tracking your delivery in real time
        </p>
      </div>

      {/* Live Status */}
      <div className="px-4 py-4">
        <OrderStatus
          orderId={orderId}
          defaultStatus={order.status}
        />
      </div>

      {/* Map */}
    

      {/* Order Details */}
      <div className="px-4 py-5 space-y-3">
        <div>
          <p className="text-xs text-neutral-500">Customer</p>
          <p className="font-medium">{order.customer.name}</p>
          <p className="text-sm text-neutral-600">
            {order.customer.phone}
          </p>
        </div>

        <div>
          <p className="text-xs text-neutral-500">Delivery Address</p>
          <p className="text-sm">
            {address.addressLine1}, {address.city}, {address.state}
          </p>
        </div>
      </div>
    </div>
  );
}
