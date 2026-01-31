"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { getSocket } from "@/lib/socket/socket_client";



export default function OrderStatus({ orderId , defaultStatus }) {
  const [status, setStatus] = useState(defaultStatus);

  // 1️⃣ Fetch initial order state
  useEffect(() => {
    if (!orderId) return;

    async function fetchOrder() {
      const res = await fetch(
        process.env.NEXT_PUBLIC_API_ONE_BASE+"/customer/get-order/"+orderId||
        `http://localhost:5000/api/v1/customer/get-order/${orderId}`
      );
      const data = await res.json();
      setStatus(data.order.status);
    }

    fetchOrder();
  }, [orderId]);

  useEffect(() => {
    if (!orderId) return;
    const socket =getSocket()
    socket.emit("join-order", orderId);
    const handler = (data) => {
      console.log("Live update:", data);
      setStatus(data.status);
    };

    socket.on("order-status-updated", handler);

    return () => {
      socket.off("order-status-updated", handler);
      socket.emit("leave-order", orderId); // optional
    };
  }, [orderId]);
  const STATUS_STYLES = {
    pending: "bg-yellow-200 font-semibold ",
    accepted: "bg-blue-200 font-semibold ",
    packing: "bg-green-100 font-semibold ",
    "out for delivery": "bg-green-200 font-semibold ",
    cancelled: "bg-red-200 font-semibold ",
    rejected: "bg-red-200 font-semibold ",
    delivered: "bg-green-300 font-semibold ",
  }
  return (
    <div className="py-2 px-1">
      <div className="flex justify-center ">
        <p className={STATUS_STYLES[status] + "bg-gray-100 text-black px-2 py-1 rounded-xl"}>
        Your order is {status}
      </p>
      </div>
    </div>
  );
}
