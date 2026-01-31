"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

export default function Page() {
  const params = useParams();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const STATUS_STYLES: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    accepted: "bg-blue-100 text-blue-700",
    packing: "bg-purple-100 text-purple-700",
    "out for delivery": "bg-indigo-100 text-indigo-700",
    cancelled: "bg-red-100 text-red-700",
    rejected: "bg-red-100 text-red-700",
  };

  async function fetchOrderDetails(orderId: string) {
    try {
      const res = await axios.get(
        process.env.NEXT_PUBLIC_API_ONE_BASE + "/warehouse/order-info" ||
          "http://localhost:5000/api/v1/warehouse/order-info",
        { params: { orderId } }
      );
      setOrder(res.data?.order);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(newStatus: string) {
    if (!order || newStatus === order.status) return;

    try {
      setUpdating(true);

      await axios.put(
        process.env.NEXT_PUBLIC_API_ONE_BASE +
          "/warehouse/update-order-status" ||
          "http://localhost:5000/api/v1/warehouse/update-order-status",
        {
          orderId: order._id,
          status: newStatus,
        }
      );

      // Optimistic update
      setOrder((prev: any) => ({
        ...prev,
        status: newStatus,
      }));
    } catch (error) {
      console.error(error);
      alert("Failed to update order status");
    } finally {
      setUpdating(false);
    }
  }

  useEffect(() => {
    if (orderId) fetchOrderDetails(orderId);
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading order details…
      </div>
    );
  }

  if (!order) {
    return <div className="p-6 text-red-500">Order not found</div>;
  }

  const totalAmount = order.products.reduce(
    (sum: number, p: any) => sum + p.totalPrice,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center">
          <div>
            <h1 className="text-lg font-semibold">Order #{order._id}</h1>
            <p className="text-sm text-gray-500">
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>

          {/* STATUS DROPDOWN */}
          <div className="relative">
            <select
              value={order.status}
              disabled={updating}
              onChange={(e) => handleStatusChange(e.target.value)}
              className={`
                px-3 py-1 rounded-full text-sm font-medium cursor-pointer
                outline-none border-none
                ${STATUS_STYLES[order.status]}
                ${updating ? "opacity-60 cursor-not-allowed" : ""}
              `}
            >
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="packing">Packing</option>
              <option value="out for delivery">Out for delivery</option>
              <option value="cancelled">Cancelled</option>
              <option value="rejected">Rejected</option>
            </select>

            {updating && (
              <span className="absolute -bottom-5 right-0 text-xs text-gray-500">
                Updating…
              </span>
            )}
          </div>
        </div>

        {/* Delivery Address */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h2 className="font-semibold mb-2">Delivery Address</h2>
          <p className="text-sm font-medium">
            {order.customer.deliveryAddress.title}
          </p>
          <p className="text-sm text-gray-600">
            {order.customer.deliveryAddress.addressLine1}
          </p>
          <p className="text-sm text-gray-600">
            {order.customer.deliveryAddress.addressLine2}
          </p>
          <p className="text-sm text-gray-600">
            {order.customer.deliveryAddress.city},{" "}
            {order.customer.deliveryAddress.state}
          </p>
        </div>

        {/* Customer Info */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h2 className="font-semibold mb-2">Customer Details</h2>
          <p className="text-sm">
            <span className="font-medium">Name:</span>{" "}
            {order.customer.name}
          </p>
          <p className="text-sm">
            <span className="font-medium">Phone:</span>{" "}
            {order.customer.phone}
          </p>
        </div>

        {/* Products */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h2 className="font-semibold mb-4">Items</h2>
          <div className="space-y-3">
            {order.products.map((product: any) => (
              <div
                key={product._id}
                className="flex justify-between items-center border-b pb-3 last:border-b-0"
              >
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-gray-500">
                    ₹{product.unitPrice} × {product.quantity}
                  </p>
                </div>
                <p className="font-semibold">₹{product.totalPrice}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Price Summary */}
        <div className="bg-white p-4 rounded-xl shadow-sm space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Item Total</span>
            <span>₹{totalAmount}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg">
            <span>Total Payable</span>
            <span>₹{totalAmount}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
