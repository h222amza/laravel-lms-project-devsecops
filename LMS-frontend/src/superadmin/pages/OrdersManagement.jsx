// src/superadmin/pages/OrdersManagement.jsx
import { useEffect, useState } from "react";
import { getAllOrders, getOrderDetails } from "../../api/superAdmin";

export default function OrdersManagement() {
  const [orders, setOrders] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const loadOrders = async () => {
    try {
      setLoadingList(true);
      setError("");
      const res = await getAllOrders();
      // response: { orders: [ ... ] }
      const list = res.data?.orders || res.data?.data || res.data || [];
      setOrders(list);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders.");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleViewDetails = async (orderId) => {
    if (!orderId) return;

    try {
      setLoadingDetail(true);
      setError("");
      const res = await getOrderDetails(orderId);
      // response: { order: { ... } }
      const detail = res.data?.order || res.data;
      setSelectedOrder(detail);
    } catch (err) {
      console.error("Error fetching order details:", err);
      setError("Failed to load order details.");
    } finally {
      setLoadingDetail(false);
    }
  };

  const formatStatus = (status) => {
    if (!status) return "unknown";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatPayment = (method) => {
    if (!method) return "N/A";
    return method.replace(/_/g, " ");
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Orders Management
        </h1>
        <p className="text-sm text-slate-500">
          View all orders and inspect their details.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Orders table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-900">All Orders</h2>
          <span className="text-xs text-slate-500">Total: {orders.length}</span>
        </div>

        {loadingList ? (
          <p className="text-xs text-slate-500">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-xs text-slate-500">No orders found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left px-3 py-2 font-medium text-slate-600">
                    ID
                  </th>
                  <th className="text-left px-3 py-2 font-medium text-slate-600">
                    Order Code
                  </th>
                  <th className="text-left px-3 py-2 font-medium text-slate-600">
                    User
                  </th>
                  <th className="text-left px-3 py-2 font-medium text-slate-600">
                    Email
                  </th>
                  <th className="text-left px-3 py-2 font-medium text-slate-600">
                    Total Price
                  </th>
                  <th className="text-left px-3 py-2 font-medium text-slate-600">
                    Payment Method
                  </th>
                  <th className="text-left px-3 py-2 font-medium text-slate-600">
                    Status
                  </th>
                  <th className="text-left px-3 py-2 font-medium text-slate-600">
                    Created At
                  </th>
                  <th className="text-left px-3 py-2 font-medium text-slate-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const user = order.user || {};
                  return (
                    <tr
                      key={order.id}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <td className="px-3 py-2">{order.id}</td>
                      <td className="px-3 py-2 font-mono text-xs">
                        {order.order_code}
                      </td>
                      <td className="px-3 py-2">
                        {user.name} {user.lastName}
                      </td>
                      <td className="px-3 py-2 text-xs text-slate-500">
                        {user.email}
                      </td>
                      <td className="px-3 py-2">
                        ${Number(order.total_price || 0).toFixed(2)}
                      </td>
                      <td className="px-3 py-2 text-xs">
                        {formatPayment(order.payment_method)}
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-[11px] font-medium border ${
                            order.status === "completed"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          {formatStatus(order.status)}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-xs text-slate-500">
                        {new Date(order.created_at).toLocaleString()}
                      </td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => handleViewDetails(order.id)}
                          className="px-3 py-1 rounded-lg border border-slate-300 text-xs text-slate-700 hover:bg-slate-100"
                        >
                          View details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order details panel */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-900">
            Order Details
          </h2>
          {selectedOrder && (
            <span className="text-xs text-slate-500">
              Order #{selectedOrder.id} – {selectedOrder.order_code}
            </span>
          )}
        </div>

        {loadingDetail ? (
          <p className="text-xs text-slate-500">Loading order details...</p>
        ) : !selectedOrder ? (
          <p className="text-xs text-slate-500">
            Select an order to see its details.
          </p>
        ) : (
          <div className="space-y-4">
            {/* Basic info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p>
                  <span className="font-medium text-slate-700">User: </span>
                  {selectedOrder.user?.name} {selectedOrder.user?.lastName} (
                  {selectedOrder.user?.email})
                </p>
                <p>
                  <span className="font-medium text-slate-700">
                    Total price:{" "}
                  </span>
                  ${Number(selectedOrder.total_price || 0).toFixed(2)}
                </p>
                <p>
                  <span className="font-medium text-slate-700">
                    Payment method:{" "}
                  </span>
                  {formatPayment(selectedOrder.payment_method)}
                </p>
              </div>
              <div className="space-y-1">
                <p>
                  <span className="font-medium text-slate-700">Status: </span>
                  {formatStatus(selectedOrder.status)}
                </p>
                <p className="text-xs text-slate-500">
                  Created: {new Date(selectedOrder.created_at).toLocaleString()}
                </p>
                <p className="text-xs text-slate-500">
                  Updated: {new Date(selectedOrder.updated_at).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Items */}
            <div>
              <h3 className="text-xs font-semibold text-slate-700 mb-2">
                Items
              </h3>
              {selectedOrder.items && selectedOrder.items.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="text-left px-3 py-2 font-medium text-slate-600">
                          Course
                        </th>
                        <th className="text-left px-3 py-2 font-medium text-slate-600">
                          Price
                        </th>
                        <th className="text-left px-3 py-2 font-medium text-slate-600">
                          Course ID
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item) => (
                        <tr key={item.id} className="border-b border-slate-100">
                          <td className="px-3 py-2">
                            {item.course?.name || "Unknown course"}
                          </td>
                          <td className="px-3 py-2">
                            ${Number(item.price || 0).toFixed(2)}
                          </td>
                          <td className="px-3 py-2 text-xs text-slate-500">
                            {item.course_id}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-xs text-slate-500">
                  No items found for this order.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
