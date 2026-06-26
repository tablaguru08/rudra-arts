import { useEffect, useState } from "react";
import { RefreshCw, Truck } from "lucide-react";
import DashboardLayout from "./DashboardLayout";
import { buildApiUrl } from "../../lib/api";
import {
  ORDER_STATUS_LABELS,
  formatOrderPrice,
  getOrderStatusLabel,
} from "../../lib/orders";

const ORDER_STATUSES = [
  "order_placed",
  "confirmed",
  "packed",
  "shipped",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

const OrdersManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const [error, setError] = useState("");

  const loadOrders = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(buildApiUrl("/api/orders/admin"));
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load orders");
      }

      setOrders(data.orders || []);
    } catch (err) {
      setError(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    setUpdatingId(orderId);
    setError("");

    try {
      const response = await fetch(
        buildApiUrl(`/api/orders/admin/${orderId}/status`),
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status,
            note: `Status changed to ${getOrderStatusLabel(status)} from admin dashboard.`,
          }),
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update order status");
      }

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId ? data.order : order
        )
      );
    } catch (err) {
      setError(err.message || "Failed to update order status");
    } finally {
      setUpdatingId("");
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-100 p-6 font-outfit">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">COD Orders</h1>
            <p className="mt-1 text-gray-600">
              Update order status for customer tracking and dispatch.
            </p>
          </div>
          <button
            onClick={loadOrders}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2 font-medium text-white hover:bg-gray-800 disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-10 text-center">
            <Truck className="mx-auto mb-3 h-10 w-10 text-gray-400" />
            <h2 className="text-xl font-semibold text-gray-800">
              No COD orders yet
            </h2>
            <p className="mt-2 text-gray-500">
              New customer COD orders will appear here after checkout.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => (
              <article
                key={order.id}
                className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {order.orderCode}
                    </h2>
                    <p className="text-sm text-gray-600">
                      Tracking: {order.trackingCode}
                    </p>
                    <p className="text-sm text-gray-600">
                      Placed:{" "}
                      {new Date(order.createdAt).toLocaleString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[520px]">
                    <div className="rounded-lg bg-gray-50 p-3">
                      <p className="text-xs uppercase text-gray-500">Amount</p>
                      <p className="font-semibold text-orange-600">
                        {formatOrderPrice(order.totalAmount)}
                      </p>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-3">
                      <p className="text-xs uppercase text-gray-500">
                        Payment
                      </p>
                      <p className="font-semibold text-gray-900">
                        {order.paymentStatus}
                      </p>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-3">
                      <p className="text-xs uppercase text-gray-500">Status</p>
                      <p className="font-semibold text-gray-900">
                        {getOrderStatusLabel(order.orderStatus)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_260px]">
                  <div className="space-y-4">
                    {order.customer && (
                      <div className="rounded-lg border border-orange-100 bg-orange-50 p-4">
                        <h3 className="mb-2 text-sm font-semibold text-gray-900">
                          Customer Delivery Details
                        </h3>
                        <div className="grid gap-2 text-sm text-gray-700 sm:grid-cols-2">
                          <p>
                            <span className="font-medium">Name:</span>{" "}
                            {order.customer.fullName}
                          </p>
                          <p>
                            <span className="font-medium">Phone:</span>{" "}
                            {order.customer.phone}
                          </p>
                          <p className="sm:col-span-2">
                            <span className="font-medium">Address:</span>{" "}
                            {order.customer.addressLine1}
                            {order.customer.addressLine2
                              ? `, ${order.customer.addressLine2}`
                              : ""}
                            , {order.customer.city}, {order.customer.state} -{" "}
                            {order.customer.pincode}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      {order.items?.map((item) => (
                        <div
                          key={`${order.id}-${item.productId}`}
                          className="flex gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3"
                        >
                          <img
                            src={item.productImage || "/placeholder-image.jpg"}
                            alt={item.productName}
                            className="h-16 w-16 rounded-lg object-cover"
                          />
                          <div className="min-w-0">
                            <p className="line-clamp-2 text-sm font-medium text-gray-800">
                              {item.productName}
                            </p>
                            <p className="text-xs text-gray-600">
                              Qty {item.quantity} | {item.productSize || "N/A"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Update Status
                    </label>
                    <select
                      value={order.orderStatus}
                      disabled={updatingId === order.id}
                      onChange={(event) =>
                        updateStatus(order.id, event.target.value)
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:opacity-60"
                    >
                      {ORDER_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {ORDER_STATUS_LABELS[status]}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default OrdersManager;
