import Link from "next/link";

async function getOrders() {
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_ONE_BASE+"/customer/get-orders?phone=100100100"||
    "http://localhost:5000/api/v1/customer/get-orders?phone=100100100",
    {
      cache: "no-store", // always fresh data
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch orders");
  }

  return res.json();
}

export default async function OrdersPage() {
  const data = await getOrders();
  const orders = data.orders || [];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 && (
        <p className="text-gray-600">No orders found</p>
      )}

      <div className="space-y-4">
        {orders.map((order) => (
          <Link
            key={order._id}
            href={`/shop/current-order/${order._id}`}
            className="block bg-white p-4 rounded-lg shadow hover:shadow-md transition"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">
                  {order.customer.name}
                </p>
                <p className="text-sm text-gray-600">
                  {order.customer.deliveryAddress.addressLine1},{" "}
                  {order.customer.deliveryAddress.city}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm font-medium">
                  Status: {order.status}
                </p>
                <p className="text-xs text-gray-500">
                  Phone: {order.customer.phone}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
