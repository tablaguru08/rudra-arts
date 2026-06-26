import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PackageCheck } from "lucide-react";
import { motion } from "framer-motion";
import { buildApiUrl } from "../../lib/api";
import {
  formatOrderPrice,
  getOrderStatusLabel,
  saveStoredCodOrder,
} from "../../lib/orders";
import OrderTimeline from "./OrderTimeline";

const OrderConfirmation = () => {
  const { trackingCode } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const loadOrder = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          buildApiUrl(`/api/orders/track/${trackingCode}`)
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Order not found");
        }

        setOrder(data.order);
        saveStoredCodOrder(data.order);
      } catch (err) {
        setError(err.message || "Failed to load your order");
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [trackingCode]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-gradient-to-b from-amber-50 to-amber-100 pt-24">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-[60vh] bg-gradient-to-b from-amber-50 to-amber-100 px-4 pt-32 text-center">
        <h1 className="text-3xl font-normal text-customBrown">
          Order not found
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-gray-600">
          {error || "We could not find this COD order."}
        </p>
        <Link
          to="/track-order"
          className="mt-6 inline-flex rounded-lg bg-orange-600 px-5 py-3 text-white hover:bg-orange-700"
        >
          Track another order
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 px-4 py-12 pt-32 font-times"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-lg border border-green-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-3 text-green-700">
                <PackageCheck className="h-8 w-8" />
                <h1 className="text-3xl font-normal text-customBrown">
                  COD Order Placed
                </h1>
              </div>
              <p className="text-gray-600">
                Your Cash on Delivery order has been placed. Use the tracking
                code below to follow the order status.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-amber-50 p-4">
              <p className="text-xs uppercase text-gray-500">Order Code</p>
              <p className="font-semibold text-gray-900">{order.orderCode}</p>
            </div>
            <div className="rounded-lg bg-amber-50 p-4">
              <p className="text-xs uppercase text-gray-500">Tracking Code</p>
              <p className="font-semibold text-gray-900">
                {order.trackingCode}
              </p>
            </div>
            <div className="rounded-lg bg-amber-50 p-4">
              <p className="text-xs uppercase text-gray-500">Status</p>
              <p className="font-semibold text-gray-900">
                {getOrderStatusLabel(order.orderStatus)}
              </p>
            </div>
            <div className="rounded-lg bg-amber-50 p-4">
              <p className="text-xs uppercase text-gray-500">COD Amount</p>
              <p className="font-semibold text-orange-600">
                {formatOrderPrice(order.totalAmount)}
              </p>
            </div>
          </div>

          <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            Delivery details were collected before placing this COD order.
          </p>
        </div>

        <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
          <OrderTimeline order={order} />
        </div>
      </div>
    </motion.div>
  );
};

export default OrderConfirmation;
