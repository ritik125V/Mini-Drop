"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import OrderStatus from "@/component/ws";

export default function CurrentOrderPage() {
  const params = useParams();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  /* ---------------- Fetch Order ---------------- */
  useEffect(() => {
    if (!orderId) return;

    axios
      .get(
        process.env.NEXT_PUBLIC_API_ONE_BASE +
          "/customer/track-order" ||
          "http://localhost:5000/api/v1/customer/track-order",
        { params: { orderId } }
      )
      .then((res) => {
        setOrder(res.data.order);
        console.log(res.data.order);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
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

  const totalAmount = order.products.reduce(
    (sum: number, p: any) => sum + p.totalPrice,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <div className="max-w-xl mx-auto pb-24">

        {/* Header */}
        <div className="bg-white px-4 py-4 border-b">
          <h1 className="text-lg font-semibold">
            Order #{order._id.slice(-6)}
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Placed on {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        {/* Live Status */}
        <div className="bg-white mt-3 px-4 py-4">
          <OrderStatus
            orderId={orderId}
            defaultStatus={order.status}
          />
        </div>

        {/* Items */}
        <div className="bg-white mt-3 px-4 py-4">
          <h2 className="font-semibold mb-3">Items</h2>

          <div className="space-y-3">
            {order.products.map((product: any) => (
              <div
                key={product._id}
                className="flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-sm">
                    {product.name}
                  </p>
                  <p className="text-xs text-neutral-500">
                    ₹{product.unitPrice} × {product.quantity}
                  </p>
                </div>
                <p className="font-semibold text-sm">
                  ₹{product.totalPrice}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Price Summary */}
        <div className="bg-white mt-3 px-4 py-4 space-y-2">
          <div className="flex justify-between text-sm text-neutral-600">
            <span>Item total</span>
            <span>₹{totalAmount}</span>
          </div>
          <div className="flex justify-between text-sm text-neutral-600">
            <span>Delivery fee</span>
            <span>₹0</span>
          </div>
          <div className="flex justify-between font-semibold text-base">
            <span>Total paid</span>
            <span>₹{totalAmount}</span>
          </div>
        </div>

        {/* Delivery Details */}
        <div className="bg-white mt-3 px-4 py-4 space-y-3">
          <div>
            <p className="text-xs text-neutral-500">Delivering to</p>
            <p className="font-medium text-sm">
              {order.customer.name}
            </p>
            <p className="text-sm text-neutral-600">
              {order.customer.phone}
            </p>
          </div>

          <div>
            <p className="text-xs text-neutral-500">
              Delivery address
            </p>
            <p className="text-sm">
              {address.addressLine1},
              {address.addressLine2 && ` ${address.addressLine2},`}
              {address.city}, {address.state}
            </p>
          </div>
        </div>

        {/* Warehouse */}
        <div className="bg-white mt-3 px-4 py-4 text-sm text-neutral-600">
          <span className="font-medium">Warehouse:</span>{" "}
          {order.warehouseId}
        </div>

      </div>
    </div>
  );
}
