import { useEffect, useState } from "react";
import { useCart } from "../../Contexts/Contexts";
import { FaCartArrowDown } from "react-icons/fa";
import {
  FiTrash2,
  FiShoppingBag,
  FiPlusCircle,
  FiMinusCircle,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { buildApiUrl } from "../../lib/api";
import { formatOrderPrice, saveStoredCodOrder } from "../../lib/orders";

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    clearCart,
    isCartLoading,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  const [isBuying, setIsBuying] = useState(false);
  const [customer, setCustomer] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [formError, setFormError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const savePurchasedProducts = (products, order) => {
    try {
      const existingProducts =
        JSON.parse(localStorage.getItem("purchasedProducts")) || [];
      const newProducts = products.map((product) => ({
        ...product,
        purchaseDate: order.createdAt || new Date().toISOString(),
        orderCode: order.orderCode,
        trackingCode: order.trackingCode,
        orderStatus: order.orderStatus,
      }));
      localStorage.setItem(
        "purchasedProducts",
        JSON.stringify([...existingProducts, ...newProducts])
      );
      window.dispatchEvent(new Event("purchasedProductsUpdated"));
      return true;
    } catch (error) {
      console.error("Failed to save purchased products:", error);
      return false;
    }
  };

  const handleBuyAll = async () => {
    const trimmedCustomer = {
      fullName: customer.fullName.trim(),
      phone: customer.phone.trim(),
      addressLine1: customer.addressLine1.trim(),
      addressLine2: customer.addressLine2.trim(),
      city: customer.city.trim(),
      state: customer.state.trim(),
      pincode: customer.pincode.trim(),
    };

    if (!trimmedCustomer.fullName) {
      setFormError("Customer name is required");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(trimmedCustomer.phone)) {
      setFormError("Enter a valid 10 digit Indian mobile number");
      return;
    }
    if (!trimmedCustomer.addressLine1) {
      setFormError("Delivery address is required");
      return;
    }
    if (!trimmedCustomer.city) {
      setFormError("City is required");
      return;
    }
    if (!trimmedCustomer.state) {
      setFormError("State is required");
      return;
    }
    if (!/^\d{6}$/.test(trimmedCustomer.pincode)) {
      setFormError("Enter a valid 6 digit pincode");
      return;
    }

    setFormError("");
    setIsBuying(true);
    try {
      const orderItems = cartItems.map((item) => ({
        productId: item._id ?? item.id,
        productName: item.product_name || item.name,
        productPrice: item.product_price ?? item.price,
        productImage: item.product_image?.[0] || item.image || "",
        productSize: item.product_size || item.size,
        quantity: item.quantity || 1,
      }));

      const response = await fetch(buildApiUrl("/api/orders/cod"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: orderItems, customer: trimmedCustomer }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create your COD order");
      }

      const order = data.order;
      saveStoredCodOrder(order);

      const saveSuccess = savePurchasedProducts(cartItems, order);
      if (!saveSuccess) throw new Error("Failed to save your purchase");

      await fetch(buildApiUrl("/api/checkout/increment"), {
        method: "POST",
      });

      clearCart();
      navigate(`/order-confirmation/${order.trackingCode}`);
    } catch (err) {
      console.error("Error creating COD order:", err);
      alert(err.message || "Failed to create your COD order. Please try again.");
    } finally {
      setIsBuying(false);
    }
  };

  const formatPrice = (price) => {
    return formatOrderPrice(price);
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) =>
        total + Number(item.product_price ?? item.price ?? 0) * (item.quantity || 1),
      0
    );
  };

  if (isCartLoading) {
    return (
      <motion.div
        className="flex justify-center items-center min-h-[60vh]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"
        ></motion.div>
      </motion.div>
    );
  }

  if (!isCartLoading && cartItems.length === 0) {
    return (
      <motion.div
        className="flex flex-col justify-center items-center min-h-[60vh] text-center p-6 bg-gradient-to-b from-amber-50 to-amber-100 mt-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="bg-gray-100 p-8 rounded-full mb-6 mt-20"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
        >
          <FiShoppingBag className="text-gray-400 text-5xl" />
        </motion.div>
        <motion.h2
          className="text-2xl font-medium text-gray-700 mb-2"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
        >
          Your cart is empty
        </motion.h2>
        <motion.p
          className="text-gray-500 max-w-md mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Looks like you have not added anything to your cart yet. Start shopping
          to see items here.
        </motion.p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/products")}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium w-full sm:w-auto"
          >
            Shop Now
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/your-products")}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium w-full sm:w-auto"
          >
            Your Products
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="px-4 sm:px-6 py-12 pt-20 pb-32 bg-gradient-to-b from-amber-50 to-amber-100 font-times font-normal mt-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Mobile Header */}
      <div className="md:hidden top-0 z-10 bg-customBrown text-white p-4 mb-6 shadow-md">
        <h1 className="text-3xl font-normal text-center">Your Cart</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-6 max-w-7xl mx-auto mt-20">
        {/* Cart Items */}
        <div className="w-full md:w-2/3">
          <h1 className="hidden md:block text-3xl md:text-4xl font-normal text-customBrown mb-6">
            Your Cart
          </h1>
          <div className="space-y-3">
            <AnimatePresence>
              {cartItems.map((item) => (
                <motion.div
                  key={item._id ?? item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  layout
                  className="rounded-lg shadow-sm border border-gray-100 p-3 flex gap-3 hover:shadow-md bg-white"
                >
                  <Link
                    to={`/product-details/${item._id ?? item.id}`}
                    className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24"
                  >
                    <motion.img
                      whileHover={{ scale: 1.05 }}
                      src={
                        item.product_image?.[0]
                          ? item.product_image[0].replace(
                              "/upload/",
                              "/upload/w_400,q_auto,f_auto/"
                            )
                          : "/placeholder-image.jpg"
                      }
                      loading="lazy"
                      alt={item.product_name || item.name || "Product"}
                      className="w-full h-full rounded-lg object-cover"
                    />
                  </Link>
                  <div className="flex-1 flex flex-col">
                    <h2 className="text-lg sm:text-xl font-normal text-gray-800 line-clamp-2">
                      {item.product_name || item.name}
                    </h2>
                    <p className="text-orange-600 font-bold mt-1 text-sm sm:text-base">
                      {formatPrice(item.product_price ?? item.price)}
                    </p>
                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => decreaseQuantity(item._id ?? item.id)}
                        className="text-gray-600 hover:text-red-500"
                      >
                        <FiMinusCircle className="w-5 h-5" />
                      </button>
                      <span className="text-sm font-medium w-6 text-center">
                        {item.quantity || 1}
                      </span>
                      <button
                        onClick={() => increaseQuantity(item._id ?? item.id)}
                        className="text-gray-600 hover:text-green-500"
                      >
                        <FiPlusCircle className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="mt-auto flex justify-end">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeFromCart(item._id ?? item.id)}
                        className="flex items-center gap-1 bg-red-400 hover:bg-red-500 text-white px-3 py-1 sm:py-2 text-xs sm:text-sm font-medium rounded"
                      >
                        <FiTrash2 className="text-sm" />
                        <span className="hidden xs:inline">Remove</span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full md:w-1/3">
          <motion.div
            className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 md:sticky md:top-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl sm:text-2xl font-normal text-gray-800 mb-3">
              Order Summary
            </h2>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm sm:text-base">
                <span className="text-gray-600">
                  Items ({cartItems.length})
                </span>
                <span className="font-bold">
                  {formatPrice(calculateTotal())}
                </span>
              </div>
              <div className="border-t border-gray-200 my-2"></div>
              <div className="space-y-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
                <div>
                  <p className="text-sm font-medium text-amber-900">
                    Delivery Details
                  </p>
                  <p className="text-xs text-amber-800">
                    Required before placing a COD order.
                  </p>
                </div>

                <input
                  value={customer.fullName}
                  onChange={(event) =>
                    setCustomer((current) => ({
                      ...current,
                      fullName: event.target.value,
                    }))
                  }
                  placeholder="Full name"
                  className="w-full rounded border border-amber-200 px-3 py-2 text-sm outline-none focus:border-orange-500"
                />
                <input
                  value={customer.phone}
                  onChange={(event) =>
                    setCustomer((current) => ({
                      ...current,
                      phone: event.target.value,
                    }))
                  }
                  placeholder="Mobile number"
                  inputMode="numeric"
                  maxLength={10}
                  className="w-full rounded border border-amber-200 px-3 py-2 text-sm outline-none focus:border-orange-500"
                />
                <textarea
                  value={customer.addressLine1}
                  onChange={(event) =>
                    setCustomer((current) => ({
                      ...current,
                      addressLine1: event.target.value,
                    }))
                  }
                  placeholder="Address line 1"
                  rows={2}
                  className="w-full resize-none rounded border border-amber-200 px-3 py-2 text-sm outline-none focus:border-orange-500"
                />
                <input
                  value={customer.addressLine2}
                  onChange={(event) =>
                    setCustomer((current) => ({
                      ...current,
                      addressLine2: event.target.value,
                    }))
                  }
                  placeholder="Address line 2 (optional)"
                  className="w-full rounded border border-amber-200 px-3 py-2 text-sm outline-none focus:border-orange-500"
                />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <input
                    value={customer.city}
                    onChange={(event) =>
                      setCustomer((current) => ({
                        ...current,
                        city: event.target.value,
                      }))
                    }
                    placeholder="City"
                    className="w-full rounded border border-amber-200 px-3 py-2 text-sm outline-none focus:border-orange-500"
                  />
                  <input
                    value={customer.state}
                    onChange={(event) =>
                      setCustomer((current) => ({
                        ...current,
                        state: event.target.value,
                      }))
                    }
                    placeholder="State"
                    className="w-full rounded border border-amber-200 px-3 py-2 text-sm outline-none focus:border-orange-500"
                  />
                </div>
                <input
                  value={customer.pincode}
                  onChange={(event) =>
                    setCustomer((current) => ({
                      ...current,
                      pincode: event.target.value,
                    }))
                  }
                  placeholder="Pincode"
                  inputMode="numeric"
                  maxLength={6}
                  className="w-full rounded border border-amber-200 px-3 py-2 text-sm outline-none focus:border-orange-500"
                />
                {formError && (
                  <p className="rounded bg-red-50 px-3 py-2 text-xs text-red-700">
                    {formError}
                  </p>
                )}
              </div>
              <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
                <p className="text-sm font-medium text-amber-900">
                  Payment Method
                </p>
                <p className="text-sm text-amber-800">Cash on Delivery</p>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg sm:text-xl font-normal">Total</span>
                <span className="text-orange-600 font-bold text-lg sm:text-xl">
                  {formatPrice(calculateTotal())}
                </span>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleBuyAll}
              disabled={isBuying}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors text-sm sm:text-base"
            >
              <motion.span
                animate={isBuying ? { rotate: 360 } : {}}
                transition={
                  isBuying
                    ? { repeat: Infinity, duration: 1, ease: "linear" }
                    : {}
                }
              >
                <FaCartArrowDown />
              </motion.span>
              {isBuying
                ? "Processing..."
                : `Place COD Order (${cartItems.length} ${
                    cartItems.length > 1 ? "items" : "item"
                  })`}
            </motion.button>
            <p className="text-xs text-gray-500 mt-3 text-center">
              Your delivery details are saved with this COD order for dispatch.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Mobile Checkout Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-3 z-20">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div>
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-lg font-bold text-orange-600">
              {formatPrice(calculateTotal())}
            </p>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleBuyAll}
            disabled={isBuying}
            className="bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg font-medium flex items-center gap-2 text-sm"
          >
            <FaCartArrowDown />
            {isBuying ? "Processing..." : "Place COD Order"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default Cart;
