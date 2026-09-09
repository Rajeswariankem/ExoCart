import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  ArrowRight,
  Package,
  ShoppingBag,
  Truck,
  Clock,
  XCircle,
  CreditCard,
  User,
  MapPin,
  Phone,
  CalendarDays,
  Wallet,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function MyOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingOrderId, setCancellingOrderId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        "http://localhost:8080/api/orders",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();

      console.log("Orders:", data);

      setOrders([...data].reverse());

    } catch (err) {
      console.error("Error fetching orders:", err);

      setError(
        "Unable to load your orders. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

const [showCancelDialog, setShowCancelDialog] = useState(false);
const [selectedOrderId, setSelectedOrderId] = useState(null);

  // ================= CANCEL ORDER =================
 const openCancelDialog = (orderId) => {
   setSelectedOrderId(orderId);
   setShowCancelDialog(true);
 };

 const handleCancelOrder = async () => {
   if (!selectedOrderId) return;

   try {
     setCancellingOrderId(selectedOrderId);

     const token = localStorage.getItem("token");

     if (!token) {
       toast.error("Please login to cancel your order.");
       navigate("/login");
       return;
     }

     const response = await fetch(
       `http://localhost:8080/api/orders/${selectedOrderId}/cancel`,
       {
         method: "PATCH",
         headers: {
           Authorization: `Bearer ${token}`,
         },
       }
     );

     if (response.status === 401 || response.status === 403) {
       localStorage.removeItem("token");
       localStorage.removeItem("user");

       toast.error("Session expired. Please login again.");
       navigate("/login");
       return;
     }

     if (!response.ok) {
       const message = await response.text();
       throw new Error(message || "Unable to cancel order");
     }

     const updatedOrder = await response.json();

     setOrders((prevOrders) =>
       prevOrders.map((order) =>
         order.orderId === selectedOrderId
           ? updatedOrder
           : order
       )
     );

     setShowCancelDialog(false);
     setSelectedOrderId(null);

     toast.success("Order cancelled successfully!");

   } catch (err) {
     console.error("Cancel order error:", err);

     toast.error(
       err.message ||
         "Unable to cancel the order. Please try again."
     );

   } finally {
     setCancellingOrderId(null);
   }
 };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPaymentLabel = (method) => {
    if (method === "COD") return "Cash on Delivery";
    if (method === "UPI") return "UPI";
    if (method === "CARD") return "Card";

    return method || "N/A";
  };

  const getStatusStyle = (status) => {
    if (status === "Delivered") {
      return "text-blue-400 bg-blue-500/10 border-blue-500/20";
    }

    if (status === "Cancelled") {
      return "text-red-400 bg-red-500/10 border-red-500/20";
    }

    if (status === "Processing") {
      return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
    }

    return "text-green-400 bg-green-500/10 border-green-500/20";
  };

  const totalOrders = orders.length;

  const deliveredOrders = orders.filter(
    (order) =>
      order.orderStatus?.toLowerCase() === "delivered"
  ).length;

  const processingOrders = orders.filter(
    (order) =>
      order.orderStatus?.toLowerCase() === "processing"
  ).length;

  const cancelledOrders = orders.filter(
    (order) =>
      order.orderStatus?.toLowerCase() === "cancelled"
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020817] text-white flex items-center justify-center">
        <div className="text-center">

          <div className="w-9 h-9 border-4 border-slate-700 border-t-green-500 rounded-full animate-spin mx-auto mb-4"></div>

          <p className="text-sm text-slate-400">
            Loading your orders...
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020817] text-white">

      {/* ================= HEADER ================= */}
      <header className="border-b border-slate-800/80">

        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-7">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <ShoppingBag
                  size={25}
                  className="text-green-400"
                />
              </div>

              <div>

                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                  My{" "}
                  <span className="text-green-400">
                    Orders
                  </span>
                </h1>

                <p className="text-sm text-slate-400 mt-1">
                  Track and manage your orders
                </p>

              </div>

            </div>

            <button
              onClick={() => navigate("/home")}
              className="self-start md:self-auto flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 text-sm text-slate-300 hover:border-green-500 hover:text-green-400 transition-all duration-200 cursor-pointer"
            >
              <ArrowLeft size={17} />
              Continue Shopping
            </button>

          </div>

        </div>

      </header>

      {/* ================= MAIN ================= */}
      <main className="max-w-7xl mx-auto px-5 lg:px-8 py-7">

        {/* ERROR */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* ================= EMPTY ================= */}
        {!error && orders.length === 0 && (
          <div className="min-h-[55vh] flex items-center justify-center">

            <div className="text-center">

              <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto mb-5">

                <Package
                  size={30}
                  className="text-slate-500"
                />

              </div>

              <h2 className="text-xl font-semibold mb-2">
                No orders yet
              </h2>

              <p className="text-sm text-slate-500 mb-5">
                Looks like you haven't placed an order yet.
              </p>

              <button
                onClick={() => navigate("/home")}
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-semibold px-5 py-2.5 rounded-xl transition cursor-pointer"
              >
                Start Shopping
                <ArrowRight size={17} />
              </button>

            </div>

          </div>
        )}

        {/* ================= ORDERS CONTENT ================= */}
        {!error && orders.length > 0 && (
          <>

            {/* ================= SUMMARY BAR ================= */}
            <div className="rounded-2xl border border-slate-800 bg-[#07101f] px-4 py-4 mb-6">

              <div className="grid grid-cols-2 lg:grid-cols-4">

                {/* Total */}
                <div className="flex items-center gap-3 px-4 py-2 border-r border-slate-800">

                  <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
                    <ShoppingBag
                      size={20}
                      className="text-green-400"
                    />
                  </div>

                  <div>
                    <p className="text-lg font-bold">
                      {totalOrders}
                    </p>

                    <p className="text-xs text-slate-500">
                      Total Orders
                    </p>
                  </div>

                </div>

                {/* Delivered */}
                <div className="flex items-center gap-3 px-4 py-2 lg:border-r border-slate-800">

                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                    <Truck
                      size={20}
                      className="text-blue-400"
                    />
                  </div>

                  <div>
                    <p className="text-lg font-bold">
                      {deliveredOrders}
                    </p>

                    <p className="text-xs text-slate-500">
                      Delivered
                    </p>
                  </div>

                </div>

                {/* Processing */}
                <div className="flex items-center gap-3 px-4 py-2 border-r border-slate-800">

                  <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center shrink-0">
                    <Clock
                      size={20}
                      className="text-yellow-400"
                    />
                  </div>

                  <div>
                    <p className="text-lg font-bold">
                      {processingOrders}
                    </p>

                    <p className="text-xs text-slate-500">
                      Processing
                    </p>
                  </div>

                </div>

                {/* Cancelled */}
                <div className="flex items-center gap-3 px-4 py-2">

                  <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
                    <XCircle
                      size={20}
                      className="text-red-400"
                    />
                  </div>

                  <div>
                    <p className="text-lg font-bold">
                      {cancelledOrders}
                    </p>

                    <p className="text-xs text-slate-500">
                      Cancelled
                    </p>
                  </div>

                </div>

              </div>

            </div>

            {/* ================= ORDER LIST ================= */}
            <div className="space-y-4">

              {orders.map((order) => {

                const canCancel =
                  order.orderStatus?.toLowerCase() === "placed" ||
                  order.orderStatus?.toLowerCase() === "processing";

                return (
                  <div
                    key={order.orderId}
                    className="group rounded-2xl border border-slate-800 bg-[#07101f] overflow-hidden hover:border-slate-700 transition-all duration-200"
                  >

                    {/* ================= ORDER HEADER ================= */}
                    <div className="px-5 py-4 border-b border-slate-800/80">

                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                        {/* Left */}
                        <div className="flex items-center gap-4">

                          <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">

                            <Package
                              size={21}
                              className="text-green-400"
                            />

                          </div>

                          <div>

                            <div className="flex items-center gap-2 flex-wrap">

                              <span className="text-lg font-bold">
                                #{order.orderId}
                              </span>

                              <span
                                className={`px-2.5 py-1 rounded-full border text-[11px] font-semibold ${getStatusStyle(
                                  order.orderStatus
                                )}`}
                              >
                                {order.orderStatus}
                              </span>

                            </div>

                            <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500">

                              <CalendarDays size={14} />

                              <span>
                                {formatDate(order.orderDate)}
                              </span>

                              <span className="text-slate-700">
                                •
                              </span>

                              <span>
                                {formatTime(order.orderDate)}
                              </span>

                            </div>

                          </div>

                        </div>

                        {/* Right */}
                        <div className="flex items-center justify-between lg:justify-end gap-5">

                          <div className="text-left lg:text-right">

                            <p className="text-[11px] text-slate-500 uppercase tracking-wider">
                              Total
                            </p>

                            <p className="text-xl font-bold text-green-400">
                              ₹
                              {Number(
                                order.totalAmount
                              ).toFixed(2)}
                            </p>

                          </div>

                          {/* CANCEL BUTTON */}
                          {canCancel && (
                            <button
                              type="button"
                              onClick={() =>
                                openCancelDialog(order.orderId)
                              }
                              disabled={
                                cancellingOrderId ===
                                order.orderId
                              }
                              className="
                                flex items-center gap-2
                                px-4 py-2.5
                                rounded-xl
                                border border-red-500/30
                                bg-red-500/10
                                text-red-400
                                text-sm font-semibold
                                hover:bg-red-500
                                hover:text-white
                                hover:border-red-500
                                transition-all duration-200
                                cursor-pointer
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                              "
                            >
                              <XCircle size={16} />

                              {cancellingOrderId ===
                              order.orderId
                                ? "Cancelling..."
                                : "Cancel Order"}
                            </button>
                          )}

                        </div>

                      </div>

                    </div>

                    {/* ================= ORDER DETAILS ================= */}
                    <div className="px-5 py-4">

                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-800">

                        {/* PAYMENT */}
                        <div className="py-3 sm:py-0 sm:px-4 first:pl-0">

                          <div className="flex items-center gap-2 mb-2">

                            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">

                              <CreditCard
                                size={16}
                                className="text-purple-400"
                              />

                            </div>

                            <span className="text-xs text-slate-500">
                              Payment
                            </span>

                          </div>

                          <p className="text-sm font-semibold truncate">
                            {getPaymentLabel(
                              order.paymentMethod
                            )}
                          </p>

                          <span
                            className={`inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                              order.paymentStatus ===
                              "Pending"
                                ? "bg-yellow-500/10 text-yellow-400"
                                : "bg-green-500/10 text-green-400"
                            }`}
                          >
                            {order.paymentStatus}
                          </span>

                        </div>

                        {/* CUSTOMER */}
                        <div className="py-3 sm:py-0 sm:px-4">

                          <div className="flex items-center gap-2 mb-2">

                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">

                              <User
                                size={16}
                                className="text-blue-400"
                              />

                            </div>

                            <span className="text-xs text-slate-500">
                              Customer
                            </span>

                          </div>

                          <p className="text-sm font-semibold truncate">
                            {order.customerName}
                          </p>

                          <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500">

                            <Phone size={12} />

                            {order.phoneNumber}

                          </div>

                        </div>

                        {/* ADDRESS */}
                        <div className="py-3 sm:py-0 sm:px-4">

                          <div className="flex items-center gap-2 mb-2">

                            <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center">

                              <MapPin
                                size={16}
                                className="text-pink-400"
                              />

                            </div>

                            <span className="text-xs text-slate-500">
                              Delivery Address
                            </span>

                          </div>

                          <p className="text-sm font-semibold truncate">
                            {order.deliveryAddress}
                          </p>

                          <p className="text-xs text-slate-500 mt-1 truncate">
                            {order.city} - {order.pincode}
                          </p>

                        </div>

                        {/* STATUS */}
                        <div className="py-3 sm:py-0 sm:px-4 last:pr-0">

                          <div className="flex items-center gap-2 mb-2">

                            <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">

                              <Truck
                                size={16}
                                className="text-green-400"
                              />

                            </div>

                            <span className="text-xs text-slate-500">
                              Order Status
                            </span>

                          </div>

                          <p
                            className={`text-sm font-semibold ${
                              order.orderStatus ===
                              "Cancelled"
                                ? "text-red-400"
                                : "text-green-400"
                            }`}
                          >
                            {order.orderStatus}
                          </p>

                          <p className="text-xs text-slate-500 mt-1">
                            {order.orderStatus ===
                            "Cancelled"
                              ? "Order cancelled successfully"
                              : "Order successfully placed"}
                          </p>

                        </div>

                      </div>

                    </div>

                  </div>
                );
              })}

            </div>

            {/* ================= BOTTOM SHOPPING CARD ================= */}
            <div className="mt-6 rounded-2xl border border-dashed border-slate-700 bg-[#07101f]/70 px-5 py-4">

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center">

                    <Wallet
                      size={19}
                      className="text-slate-500"
                    />

                  </div>

                  <div>

                    <p className="text-sm font-semibold">
                      Want to place a new order?
                    </p>

                    <p className="text-xs text-slate-500 mt-0.5">
                      Explore our products and shop your favorites
                    </p>

                  </div>

                </div>

                <button
                  onClick={() => navigate("/home")}
                  className="flex items-center gap-2 bg-green-500 hover:bg-transparent border border-green-500 hover:text-green-400 text-black text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 group cursor-pointer"
                >
                  Start Shopping

                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>

              </div>

            </div>

          </>
        )}

      </main>
      {/* ================= CANCEL ORDER DIALOG ================= */}
      {showCancelDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">

          {/* BACKDROP */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => {
              if (!cancellingOrderId) {
                setShowCancelDialog(false);
                setSelectedOrderId(null);
              }
            }}
          ></div>

          {/* DIALOG */}
          <div className="relative w-full max-w-md rounded-2xl border border-slate-700 bg-[#081225] shadow-2xl p-6">

            {/* ICON */}
            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
              <XCircle
                size={25}
                className="text-red-400"
              />
            </div>

            {/* TITLE */}
            <h2 className="text-lg font-bold text-white">
              Cancel Order?
            </h2>

            {/* MESSAGE */}
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              Are you sure you want to cancel order{" "}
              <span className="text-white font-semibold">
                #{selectedOrderId}
              </span>
              ? This action cannot be undone.
            </p>

            {/* BUTTONS */}
            <div className="flex items-center justify-end gap-3 mt-6">

              <button
                type="button"
                disabled={cancellingOrderId !== null}
                onClick={() => {
                  setShowCancelDialog(false);
                  setSelectedOrderId(null);
                }}
                className="
                  px-4 py-2.5
                  rounded-xl
                  border border-slate-700
                  bg-transparent
                  text-slate-300
                  text-sm font-semibold
                  hover:border-slate-500
                  hover:text-white
                  transition-all duration-200
                  cursor-pointer
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                Keep Order
              </button>

              <button
                type="button"
                disabled={cancellingOrderId !== null}
                onClick={handleCancelOrder}
                className="
                  px-4 py-2.5
                  rounded-xl
                  border border-red-500
                  bg-red-500
                  text-white
                  text-sm font-semibold
                  hover:bg-red-600
                  hover:border-red-600
                  transition-all duration-200
                  cursor-pointer
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {cancellingOrderId !== null
                  ? "Cancelling..."
                  : "Yes, Cancel Order"}
              </button>

            </div>

          </div>

        </div>
      )}
    </div>
  );
}

export default MyOrders;