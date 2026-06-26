import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiCalendar,
  FiLayers,
  FiPackage,
  FiShoppingBag,
  FiTag,
} from "react-icons/fi";
import { buildApiUrl } from "../../lib/api";
import {
  formatOrderPrice,
  getOrderStatusLabel,
  getStoredCodOrders,
  saveStoredCodOrder,
} from "../../lib/orders";

const YourProducts = () => {
  const [orders, setOrders] = useState([]);
  const [legacyProducts, setLegacyProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      const storedOrders = getStoredCodOrders();
      const storedProducts =
        JSON.parse(localStorage.getItem("purchasedProducts")) || [];
      const trackingCodes = [
        ...new Set(
          [
            ...storedOrders.map((order) => order.trackingCode),
            ...storedProducts.map((product) => product.trackingCode),
          ].filter(Boolean)
        ),
      ];

      setLegacyProducts(
        storedProducts.filter((product) => !product.trackingCode)
      );

      if (!trackingCodes.length) {
        setOrders(storedOrders);
        setLoading(false);
        return;
      }

      try {
        const refreshedOrders = await Promise.all(
          trackingCodes.map(async (trackingCode) => {
            const response = await fetch(
              buildApiUrl(`/api/orders/track/${trackingCode}`)
            );

            if (!response.ok) return null;

            const data = await response.json();
            saveStoredCodOrder(data.order);
            return data.order;
          })
        );

        setOrders(refreshedOrders.filter(Boolean));
      } catch (error) {
        console.error("Failed to refresh COD orders:", error);
        setOrders(storedOrders);
      } finally {
        setLoading(false);
      }
    };

    window.scrollTo({ top: 0, behavior: "smooth" });
    loadOrders();
  }, []);

  const hasOrders = orders.length > 0 || legacyProducts.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 px-4 py-12 pt-32 font-times sm:px-6"
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="mb-2 text-3xl font-normal text-customBrown md:text-4xl">
            Your Orders
          </h1>
          <p className="mx-auto max-w-2xl text-gray-600">
            Track COD orders and view products you selected for purchase.
          </p>
        </motion.div>

        {loading && (
          <div className="flex justify-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
          </div>
        )}

        {!loading && !hasOrders && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-6 rounded-full bg-white p-6 shadow-md">
              <FiShoppingBag className="text-4xl text-gray-400" />
            </div>
            <h2 className="mb-2 text-2xl font-medium text-gray-700">
              No orders yet
            </h2>
            <p className="mb-6 max-w-md text-gray-500">
              Your COD orders and purchased products will appear here after
              checkout.
            </p>
            <Link
              to="/products"
              className="rounded-lg bg-orange-600 px-6 py-3 font-medium text-white hover:bg-orange-700"
            >
              Continue Shopping
            </Link>
          </div>
        )}

        {!loading && orders.length > 0 && (
          <div className="mb-10 space-y-5">
            {orders.map((order) => (
              <motion.article
                key={order.trackingCode}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg border border-amber-100 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="mb-2 flex items-center gap-2 text-customBrown">
                      <FiPackage className="h-5 w-5" />
                      <h2 className="text-xl font-normal">
                        {order.orderCode}
                      </h2>
                    </div>
                    <p className="text-sm text-gray-600">
                      Tracking Code:{" "}
                      <span className="font-medium text-gray-900">
                        {order.trackingCode}
                      </span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Status:{" "}
                      <span className="font-medium text-orange-700">
                        {getOrderStatusLabel(order.orderStatus)}
                      </span>
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <p className="text-lg font-semibold text-orange-600">
                      {formatOrderPrice(order.totalAmount)}
                    </p>
                    <Link
                      to={`/track-order/${order.trackingCode}`}
                      className="rounded-lg bg-orange-600 px-4 py-2 text-center font-medium text-white hover:bg-orange-700"
                    >
                      Track Order
                    </Link>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {order.items?.map((item) => (
                    <div
                      key={`${order.trackingCode}-${item.productId}`}
                      className="flex gap-3 rounded-lg border border-gray-100 bg-amber-50 p-3"
                    >
                      <img
                        src={item.productImage || "/placeholder-image.jpg"}
                        alt={item.productName}
                        className="h-20 w-20 rounded-lg object-cover"
                      />
                      <div className="min-w-0">
                        <p className="line-clamp-2 font-medium text-gray-800">
                          {item.productName}
                        </p>
                        <p className="text-sm text-gray-600">
                          Qty {item.quantity} | Size {item.productSize || "N/A"}
                        </p>
                        <p className="font-semibold text-orange-600">
                          {formatOrderPrice(item.subtotal)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {!loading && legacyProducts.length > 0 && (
          <div>
            <h2 className="mb-4 text-2xl font-normal text-customBrown">
              Previous Products
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {legacyProducts.map((product, index) => (
                <motion.div
                  key={`${product._id}-${index}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md"
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={product.product_image?.[0]}
                      alt={product.product_name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="space-y-2 p-4">
                    <h3 className="line-clamp-2 text-lg font-normal text-gray-800">
                      {product.product_name}
                    </h3>
                    <div className="flex items-center text-gray-700">
                      <FiTag className="mr-2 text-orange-500" />
                      <span className="font-medium">
                        {formatOrderPrice(product.product_price)}
                      </span>
                    </div>

                    {product.product_size && (
                      <div className="flex items-center text-gray-700">
                        <FiLayers className="mr-2 text-orange-500" />
                        <span>Size: {product.product_size}</span>
                      </div>
                    )}

                    <div className="flex items-center text-sm text-gray-500">
                      <FiCalendar className="mr-2 text-orange-500" />
                      <span>
                        Purchased:{" "}
                        {new Date(product.purchaseDate).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default YourProducts;
