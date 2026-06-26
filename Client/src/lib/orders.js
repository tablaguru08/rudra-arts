export const ORDER_STATUS_LABELS = {
  order_placed: "Order placed",
  confirmed: "Confirmed",
  packed: "Packed",
  shipped: "Shipped",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const ORDER_STATUS_STEPS = [
  "order_placed",
  "confirmed",
  "packed",
  "shipped",
  "out_for_delivery",
  "delivered",
];

export const formatOrderPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(price) || 0);

export const getOrderStatusLabel = (status) =>
  ORDER_STATUS_LABELS[status] || "Order placed";

export const getStoredCodOrders = () => {
  try {
    return JSON.parse(localStorage.getItem("codOrders")) || [];
  } catch {
    return [];
  }
};

export const saveStoredCodOrder = (order) => {
  const existingOrders = getStoredCodOrders();
  const withoutDuplicate = existingOrders.filter(
    (item) => item.trackingCode !== order.trackingCode
  );

  localStorage.setItem(
    "codOrders",
    JSON.stringify([order, ...withoutDuplicate])
  );

  window.dispatchEvent(new Event("codOrdersUpdated"));
};

export const buildOrderWhatsAppMessage = (order) => {
  let message = `*COD Order - ${order.orderCode}*\n\n`;
  message += "Hello, I placed a Cash on Delivery order on Rudra Arts.\n\n";

  order.items.forEach((item, index) => {
    message += `*${index + 1}. ${item.productName}*\n`;
    message += `Quantity: ${item.quantity}\n`;
    message += `Size: ${item.productSize || "N/A"}\n`;
    message += `Subtotal: ${formatOrderPrice(item.subtotal)}\n\n`;
  });

  message += `*Total Amount:* ${formatOrderPrice(order.totalAmount)}\n`;
  message += `*Tracking Code:* ${order.trackingCode}\n\n`;
  message +=
    "Please confirm availability and collect my delivery details here on WhatsApp.";

  return message;
};

export const buildOrderWhatsAppUrl = (order) => {
  const phoneNumber = "917028996666";
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    buildOrderWhatsAppMessage(order)
  )}`;
};
