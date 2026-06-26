import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { buildApiUrl } from "../../lib/api";
import {
  formatOrderPrice,
  getOrderStatusLabel,
  saveStoredCodOrder,
} from "../../lib/orders";
import OrderTimeline from "./OrderTimeline";

const TrackOrder = () => {
  const { trackingCode } = useParams();
  const navigate = useNavigate();
  const [searchCode, setSearchCode] = useState(trackingCode || "");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    setSearchCode(trackingCode || "");
    if (trackingCode) {
      loadOrder(trackingCode);
    } else {
      setOrder(null);
      setError("");
    }
  }, [trackingCode]);

  const loadOrder = async (code) => {
    const trimmedCode = String(code || "").trim();

    if (!trimmedCode) {
      setError("Enter a tracking code to view your order.");
      setOrder(null);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        buildApiUrl(`/api/orders/track/${trimmedCode}`)
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Order not found");
      }

      setOrder(data.order);
      saveStoredCodOrder(data.order);
    } catch (err) {
      setOrder(null);
      setError(err.message || "Failed to load order tracking");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedCode = searchCode.trim();

    if (!trimmedCode) {
      setError("Enter a tracking code to view your order.");
      return;
    }

    navigate(`/track-order/${trimmedCode}`);
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 px-4 py-12 pt-32 font-times"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-normal text-customBrown md:text-4xl">
            Track Your COD Order
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            Enter your tracking code to view your COD order status.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mb-8 flex max-w-2xl flex-col gap-3 rounded-lg border border-amber-100 bg-white p-4 shadow-sm sm:flex-row"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-amber-600" />
            <input
              value={searchCode}
              onChange={(event) => setSearchCode(event.target.value)}
              placeholder="Enter tracking code"
              className="w-full rounded-lg border border-amber-200 py-3 pl-10 pr-4 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-orange-600 px-6 py-3 font-medium text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Loading..." : "Track Order"}
          </button>
        </form>

        {error && (
          <div className="mx-auto mb-8 max-w-2xl rounded-lg border border-red-100 bg-red-50 p-4 text-center text-red-700">
            {error}
          </div>
        )}

        {order && (
          <div className="space-y-6">
            <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-xs uppercase text-gray-500">Order Code</p>
                  <p className="font-semibold text-gray-900">
                    {order.orderCode}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500">
                    Tracking Code
                  </p>
                  <p className="font-semibold text-gray-900">
                    {order.trackingCode}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500">Status</p>
                  <p className="font-semibold text-gray-900">
                    {getOrderStatusLabel(order.orderStatus)}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500">COD Amount</p>
                  <p className="font-semibold text-orange-600">
                    {formatOrderPrice(order.totalAmount)}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
              <OrderTimeline order={order} />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TrackOrder;
