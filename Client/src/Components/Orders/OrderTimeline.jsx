import PropTypes from "prop-types";
import { CheckCircle, Circle, XCircle } from "lucide-react";
import {
  ORDER_STATUS_STEPS,
  formatOrderPrice,
  getOrderStatusLabel,
} from "../../lib/orders";

const OrderTimeline = ({ order }) => {
  const historyStatuses = new Set(
    order.statusHistory?.map((entry) => entry.status) || []
  );
  const isCancelled = order.orderStatus === "cancelled";
  const activeIndex = ORDER_STATUS_STEPS.indexOf(order.orderStatus);

  const statusClass = (status, index) => {
    if (isCancelled) return "text-gray-400";
    if (historyStatuses.has(status) || index <= activeIndex) {
      return "text-green-700";
    }
    return "text-gray-400";
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ORDER_STATUS_STEPS.map((status, index) => {
          const reached = historyStatuses.has(status) || index <= activeIndex;
          const Icon = reached && !isCancelled ? CheckCircle : Circle;

          return (
            <div
              key={status}
              className="flex items-center gap-3 rounded-lg border border-amber-100 bg-amber-50 px-4 py-3"
            >
              <Icon className={`h-5 w-5 ${statusClass(status, index)}`} />
              <span className="text-sm font-medium text-gray-800">
                {getOrderStatusLabel(status)}
              </span>
            </div>
          );
        })}

        {isCancelled && (
          <div className="flex items-center gap-3 rounded-lg border border-red-100 bg-red-50 px-4 py-3">
            <XCircle className="h-5 w-5 text-red-600" />
            <span className="text-sm font-medium text-red-700">Cancelled</span>
          </div>
        )}
      </div>

      <div>
        <h3 className="mb-3 text-lg font-normal text-customBrown">
          Status History
        </h3>
        <div className="space-y-3">
          {order.statusHistory?.map((entry, index) => (
            <div
              key={`${entry.status}-${entry.changedAt}-${index}`}
              className="rounded-lg border border-gray-100 bg-white px-4 py-3"
            >
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-medium text-gray-800">{entry.label}</p>
                <p className="text-sm text-gray-500">
                  {new Date(entry.changedAt).toLocaleString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              {entry.note && (
                <p className="mt-1 text-sm text-gray-600">{entry.note}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-lg font-normal text-customBrown">
          Order Items
        </h3>
        <div className="space-y-3">
          {order.items?.map((item) => (
            <div
              key={`${item.productId}-${item.productName}`}
              className="flex gap-3 rounded-lg border border-gray-100 bg-white p-3"
            >
              <img
                src={item.productImage || "/placeholder-image.jpg"}
                alt={item.productName}
                className="h-20 w-20 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 font-medium text-gray-800">
                  {item.productName}
                </p>
                <p className="text-sm text-gray-600">
                  Qty {item.quantity} | Size {item.productSize || "N/A"}
                </p>
                <p className="mt-1 font-semibold text-orange-600">
                  {formatOrderPrice(item.subtotal)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderTimeline;

OrderTimeline.propTypes = {
  order: PropTypes.shape({
    orderStatus: PropTypes.string.isRequired,
    statusHistory: PropTypes.arrayOf(
      PropTypes.shape({
        status: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        note: PropTypes.string,
        changedAt: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.instanceOf(Date),
        ]),
      })
    ),
    items: PropTypes.arrayOf(
      PropTypes.shape({
        productId: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
        productName: PropTypes.string.isRequired,
        productImage: PropTypes.string,
        productSize: PropTypes.string,
        quantity: PropTypes.number.isRequired,
        subtotal: PropTypes.number.isRequired,
      })
    ),
  }).isRequired,
};
