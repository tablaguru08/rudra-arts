import mongoose from "mongoose";
import Order, { ORDER_STATUSES } from "../models/Order.js";
import Product from "../models/Products.js";

const STATUS_LABELS = {
  order_placed: "Order placed",
  confirmed: "Confirmed",
  packed: "Packed",
  shipped: "Shipped",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const createCode = (prefix) =>
  `${prefix}-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

const createTrackingCode = () =>
  `RA${Date.now().toString(36).toUpperCase()}${Math.floor(
    1000 + Math.random() * 9000
  )}`;

const sanitizeOrder = (order, { includeCustomer = false } = {}) => {
  const payload = {
    id: order._id,
    orderCode: order.orderCode,
    trackingCode: order.trackingCode,
    items: order.items,
    totalAmount: order.totalAmount,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    orderStatus: order.orderStatus,
    statusHistory: order.statusHistory,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };

  if (includeCustomer) {
    payload.customer = order.customer;
  }

  return payload;
};

const normalizeCustomer = (customer = {}) => ({
  fullName: String(customer.fullName || "").trim(),
  phone: String(customer.phone || "").trim(),
  addressLine1: String(customer.addressLine1 || "").trim(),
  addressLine2: String(customer.addressLine2 || "").trim(),
  city: String(customer.city || "").trim(),
  state: String(customer.state || "").trim(),
  pincode: String(customer.pincode || "").trim(),
});

const getCustomerValidationError = (customer) => {
  if (!customer.fullName) return "Customer name is required";
  if (!/^[6-9]\d{9}$/.test(customer.phone)) {
    return "Enter a valid 10 digit Indian mobile number";
  }
  if (!customer.addressLine1) return "Delivery address is required";
  if (!customer.city) return "City is required";
  if (!customer.state) return "State is required";
  if (!/^\d{6}$/.test(customer.pincode)) return "Enter a valid 6 digit pincode";
  return "";
};

const normalizeItems = (items = []) =>
  items
    .map((item) => ({
      productId: String(item.productId || item.id || "").trim(),
      productName: String(item.productName || item.name || "").trim(),
      productPrice: Number(item.productPrice ?? item.price) || 0,
      productImage: item.productImage || item.image || "",
      productSize: item.productSize || item.size || "N/A",
      quantity: Math.max(1, Math.min(Number(item.quantity) || 1, 99)),
    }))
    .filter((item) => item.productId);

export const createCodOrder = async (req, res) => {
  try {
    const requestedItems = Array.isArray(req.body.items) ? req.body.items : [];
    const items = normalizeItems(req.body.items);
    const customer = normalizeCustomer(req.body.customer);
    const customerError = getCustomerValidationError(customer);

    if (customerError) {
      return res.status(400).json({ error: customerError });
    }

    if (!items.length) {
      return res.status(400).json({ error: "At least one product is required" });
    }

    if (items.length !== requestedItems.length) {
      return res.status(400).json({ error: "One or more products are invalid" });
    }

    const mongoProductIds = [
      ...new Set(
        items
          .map((item) => item.productId)
          .filter((productId) => mongoose.Types.ObjectId.isValid(productId))
      ),
    ];
    const products = mongoProductIds.length
      ? await Product.find({ _id: { $in: mongoProductIds } })
      : [];

    if (products.length !== mongoProductIds.length) {
      return res.status(400).json({ error: "One or more products are invalid" });
    }

    const productMap = new Map(
      products.map((product) => [product._id.toString(), product])
    );

    const orderItems = items.map((item) => {
      const product = productMap.get(item.productId);
      const productPrice = product
        ? Number(product.product_price) || 0
        : item.productPrice;
      const productName = product ? product.product_name : item.productName;
      const productImage = product
        ? product.product_image?.[0] || ""
        : item.productImage;
      const productSize = product
        ? product.product_size || "N/A"
        : item.productSize;

      return {
        productId: item.productId,
        productName,
        productPrice,
        productImage,
        productSize,
        quantity: item.quantity,
        subtotal: productPrice * item.quantity,
      };
    });

    if (orderItems.some((item) => !item.productName)) {
      return res.status(400).json({ error: "One or more products are invalid" });
    }

    const totalAmount = orderItems.reduce((sum, item) => sum + item.subtotal, 0);
    const initialStatus = "order_placed";

    const order = await Order.create({
      orderCode: createCode("RA-COD"),
      trackingCode: createTrackingCode(),
      customer,
      items: orderItems,
      totalAmount,
      paymentMethod: "COD",
      paymentStatus: "pending_cod",
      orderStatus: initialStatus,
      statusHistory: [
        {
          status: initialStatus,
          label: STATUS_LABELS[initialStatus],
          note: "COD order placed with customer delivery details.",
        },
      ],
    });

    return res
      .status(201)
      .json({ order: sanitizeOrder(order, { includeCustomer: true }) });
  } catch (err) {
    console.error("Error creating COD order:", err);
    return res.status(500).json({ error: "Failed to create COD order" });
  }
};

export const trackOrder = async (req, res) => {
  try {
    const trackingCode = String(req.params.trackingCode || "").trim();
    const order = await Order.findOne({ trackingCode });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    return res.status(200).json({ order: sanitizeOrder(order) });
  } catch (err) {
    console.error("Error tracking order:", err);
    return res.status(500).json({ error: "Failed to load order tracking" });
  }
};

export const listAdminOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).limit(100);
    return res.status(200).json({
      orders: orders.map((order) => sanitizeOrder(order, { includeCustomer: true })),
    });
  } catch (err) {
    console.error("Error listing orders:", err);
    return res.status(500).json({ error: "Failed to load orders" });
  }
};

export const updateAdminOrderStatus = async (req, res) => {
  try {
    const { status, note = "" } = req.body;

    if (!ORDER_STATUSES.includes(status)) {
      return res.status(400).json({ error: "Invalid order status" });
    }

    const paymentStatus =
      status === "delivered"
        ? "collected"
        : status === "cancelled"
        ? "cancelled"
        : undefined;

    const update = {
      orderStatus: status,
      $push: {
        statusHistory: {
          status,
          label: STATUS_LABELS[status],
          note,
          changedAt: new Date(),
        },
      },
    };

    if (paymentStatus) {
      update.paymentStatus = paymentStatus;
    }

    const order = await Order.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    return res.status(200).json({ order: sanitizeOrder(order) });
  } catch (err) {
    console.error("Error updating order status:", err);
    return res.status(500).json({ error: "Failed to update order status" });
  }
};
