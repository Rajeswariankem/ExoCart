import { useEffect, useState, useRef } from "react";
import {
  ArrowLeft,
  ShoppingCart,
  User,
  MapPin,
  Phone,
  CalendarDays,
  CreditCard,
  IndianRupee,
  Package,
  ChevronDown,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function AdminOrders() {

  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] =
    useState(null);
    const statusOptions = [
      "Placed",
      "Processing",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ];

  // ================= FETCH ORDERS =================

  const fetchOrders = async () => {

    try {

      setLoading(true);

      const token =
        localStorage.getItem("token");

      if (!token) {
        toast.error("Please login as admin.");
        navigate("/login");
        return;
      }

      const response = await fetch(
        "http://localhost:8080/api/orders/admin/all",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      if (
        response.status === 401 ||
        response.status === 403
      ) {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        toast.error(
          "Session expired. Please login again."
        );

        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          "Failed to fetch orders"
        );
      }

      const data =
        await response.json();

      const sortedOrders =
        [...data].sort(
          (a, b) =>
            new Date(b.orderDate) -
            new Date(a.orderDate)
        );

      setOrders(sortedOrders);

    } catch (error) {

      console.error(
        "Admin orders error:",
        error
      );

      toast.error(
        "Failed to load orders."
      );

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ================= STATUS UPDATE =================

  const handleStatusChange = async (
    orderId,
    status
  ) => {

    try {

      setUpdatingOrderId(orderId);

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8080/api/orders/admin/${orderId}/status`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            status,
          }),
        }
      );

      if (!response.ok) {

        const message =
          await response.text();

        throw new Error(
          message ||
          "Failed to update order"
        );
      }

      const updatedOrder =
        await response.json();

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === orderId
            ? updatedOrder
            : order
        )
      );

      toast.success(
        `Order #${orderId} updated to ${status}`
      );

    } catch (error) {

      console.error(
        "Status update error:",
        error
      );

      toast.error(
        error.message ||
        "Failed to update order status."
      );

    } finally {

      setUpdatingOrderId(null);

    }
  };

  // ================= STATUS STYLE =================

  const getStatusStyle = (status) => {

    switch (status) {

      case "Delivered":
        return "text-blue-400 bg-blue-500/10 border-blue-500/20";

      case "Processing":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";

      case "Out for Delivery":
        return "text-purple-400 bg-purple-500/10 border-purple-500/20";

      case "Cancelled":
        return "text-red-400 bg-red-500/10 border-red-500/20";

      default:
        return "text-green-400 bg-green-500/10 border-green-500/20";
    }
  };

  // ================= DATE =================

  const formatDate = (date) => {

    if (!date) return "N/A";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatTime = (date) => {

    if (!date) return "";

    return new Date(date).toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // ================= LOADING =================

  if (loading) {

    return (
      <div className="min-h-screen bg-[#020817] flex items-center justify-center">

        <div className="text-center">

          <div className="
            w-10
            h-10
            border-4
            border-slate-700
            border-t-green-500
            rounded-full
            animate-spin
            mx-auto
            mb-4
          " />

          <p className="text-slate-400">
            Loading orders...
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020817]">

      {/* ================= HEADER ================= */}

      <div className="
        border-b
        border-slate-800
        bg-[#020817]
      ">

        <div className="
          max-w-7xl
          mx-auto
          px-6
          py-7
        ">

          <button
            type="button"
            onClick={() =>
              navigate("/admin")
            }
            className="
              flex
              items-center
              gap-2
              px-3
              py-2
              rounded-lg
              border
              border-slate-700
              text-slate-300
              text-sm
              hover:border-green-500
              hover:text-green-400
              transition
              cursor-pointer
              mb-5
            "
          >
            <ArrowLeft size={16} />
            Dashboard
          </button>

          <div className="
            flex
            items-center
            justify-between
          ">

            <div>

              <h1 className="
                text-4xl
                font-bold
                text-white
              ">
                Orders
              </h1>

              <p className="
                text-slate-400
                mt-2
              ">
                Manage customer orders
              </p>

            </div>

            <div className="
              flex
              items-center
              gap-3
              bg-[#081225]
              border
              border-slate-800
              rounded-xl
              px-4
              py-3
            ">

              <ShoppingCart
                size={20}
                className="text-green-400"
              />

              <div>

                <p className="
                  text-white
                  font-bold
                ">
                  {orders.length}
                </p>

                <p className="
                  text-slate-500
                  text-xs
                ">
                  Total Orders
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ================= CONTENT ================= */}

      <div className="
        max-w-7xl
        mx-auto
        px-6
        py-8
      ">

        {orders.length === 0 ? (

          <div className="
            bg-[#081225]
            border
            border-slate-800
            rounded-2xl
            py-20
            text-center
          ">

            <ShoppingCart
              size={42}
              className="
                text-slate-600
                mx-auto
                mb-4
              "
            />

            <h2 className="
              text-white
              text-lg
              font-semibold
            ">
              No orders yet
            </h2>

            <p className="
              text-slate-500
              text-sm
              mt-2
            ">
              Customer orders will appear here.
            </p>

          </div>

        ) : (

          <div className="
            bg-[#081225]
            border
            border-slate-800
            rounded-2xl
            overflow-hidden
          ">

            <div className="
              overflow-x-auto
            ">

              <table className="
                w-full
                text-sm
              ">

                <thead>

                  <tr className="
                    border-b
                    border-slate-800
                    text-slate-500
                  ">

                    <th className="
                      text-left
                      px-5
                      py-4
                      font-medium
                    ">
                      Order
                    </th>

                    <th className="
                      text-left
                      px-5
                      py-4
                      font-medium
                    ">
                      Customer
                    </th>

                    <th className="
                      text-left
                      px-5
                      py-4
                      font-medium
                    ">
                      Delivery
                    </th>

                    <th className="
                      text-left
                      px-5
                      py-4
                      font-medium
                    ">
                      Payment
                    </th>

                    <th className="
                      text-left
                      px-5
                      py-4
                      font-medium
                    ">
                      Amount
                    </th>

                    <th className="
                      text-left
                      px-5
                      py-4
                      font-medium
                    ">
                      Status
                    </th>

                    <th className="
                      text-left
                      px-5
                      py-4
                      font-medium
                    ">
                      Date
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {orders.map((order) => (

                    <tr
                      key={order.orderId}
                      className="
                        border-b
                        border-slate-800/70
                        last:border-0
                        hover:bg-slate-800/20
                        transition
                      "
                    >

                      {/* ORDER */}

                      <td className="px-5 py-5">

                        <div className="
                          flex
                          items-center
                          gap-3
                        ">

                          <div className="
                            w-9
                            h-9
                            rounded-lg
                            bg-green-500/10
                            flex
                            items-center
                            justify-center
                          ">

                            <Package
                              size={18}
                              className="text-green-400"
                            />

                          </div>

                          <span className="
                            text-white
                            font-semibold
                          ">
                            #{order.orderId}
                          </span>

                        </div>

                      </td>

                      {/* CUSTOMER */}

                      <td className="px-5 py-5">

                        <div>

                          <div className="
                            flex
                            items-center
                            gap-2
                            text-white
                            font-medium
                          ">

                            <User size={15} className="text-slate-500" />

                            {order.customerName}

                          </div>

                          <div className="
                            flex
                            items-center
                            gap-2
                            text-slate-500
                            text-xs
                            mt-1
                          ">

                            <Phone size={13} />

                            {order.phoneNumber}

                          </div>

                        </div>

                      </td>

                      {/* DELIVERY */}

                      <td className="px-5 py-5">

                        <div className="
                          max-w-[190px]
                        ">

                          <div className="
                            flex
                            items-start
                            gap-2
                            text-slate-300
                          ">

                            <MapPin
                              size={15}
                              className="
                                text-pink-400
                                mt-0.5
                                flex-shrink-0
                              "
                            />

                            <span>
                              {order.deliveryAddress}
                            </span>

                          </div>

                          <p className="
                            text-slate-500
                            text-xs
                            mt-1
                            ml-5
                          ">
                            {order.city} - {order.pincode}
                          </p>

                        </div>

                      </td>

                      {/* PAYMENT */}

                      <td className="px-5 py-5">

                        <div className="
                          flex
                          items-center
                          gap-2
                        ">

                          <CreditCard
                            size={16}
                            className="text-purple-400"
                          />

                          <span className="text-slate-300">
                            {order.paymentMethod}
                          </span>

                        </div>

                        <span className="
                          text-xs
                          text-slate-500
                          ml-6
                        ">
                          {order.paymentStatus}
                        </span>

                      </td>

                      {/* AMOUNT */}

                      <td className="px-5 py-5">

                        <div className="
                          flex
                          items-center
                          text-green-400
                          font-bold
                        ">

                          <IndianRupee size={15} />

                          {Number(
                            order.totalAmount || 0
                          ).toFixed(2)}

                        </div>

                      </td>

                      {/* STATUS */}

                      <td className="px-5 py-5">

                        <div className="relative w-[180px]">

                          {/* Selected Status */}

                          <button
                            type="button"
                            disabled={
                              updatingOrderId === order.orderId
                            }
                            onClick={() =>
                              setOpenDropdown(
                                openDropdown === order.orderId
                                  ? null
                                  : order.orderId
                              )
                            }
                            className={`
                              w-full
                              flex
                              items-center
                              justify-between
                              px-3
                              py-2.5
                              rounded-lg
                              border
                              text-xs
                              font-semibold
                              transition-all
                              duration-200
                              cursor-pointer
                              bg-[#020817]
                              ${getStatusStyle(order.orderStatus)}
                              hover:brightness-125
                              disabled:cursor-not-allowed
                              disabled:opacity-60
                            `}
                          >

                            <span>
                              {updatingOrderId === order.orderId
                                ? "Updating..."
                                : order.orderStatus}
                            </span>

                            <ChevronDown
                              size={16}
                              className={`
                                transition-transform
                                duration-200
                                ${
                                  openDropdown === order.orderId
                                    ? "rotate-180"
                                    : ""
                                }
                              `}
                            />

                          </button>


                          {/* Dropdown */}

                          {openDropdown === order.orderId && (

                            <div
                              className="
                                absolute
                                left-0
                                top-[calc(100%+6px)]
                                z-50
                                w-full
                                overflow-hidden
                                rounded-xl
                                border
                                border-slate-700
                                bg-[#081225]
                                shadow-2xl
                                shadow-black/40
                                p-1
                              "
                            >

                              {statusOptions.map((status) => (

                                <button
                                  key={status}
                                  type="button"
                                  onClick={() => {
                                    setOpenDropdown(null);

                                    if (
                                      status !== order.orderStatus
                                    ) {
                                      handleStatusChange(
                                        order.orderId,
                                        status
                                      );
                                    }
                                  }}
                                  className={`
                                    w-full
                                    flex
                                    items-center
                                    justify-between
                                    px-3
                                    py-2.5
                                    rounded-lg
                                    text-left
                                    text-xs
                                    font-semibold
                                    transition-all
                                    duration-200
                                    cursor-pointer

                                    ${
                                      status === order.orderStatus
                                        ? "bg-green-500/10 text-green-400"
                                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                    }
                                  `}
                                >

                                  <span>
                                    {status}
                                  </span>

                                  {status === order.orderStatus && (
                                    <span className="
                                      w-1.5
                                      h-1.5
                                      rounded-full
                                      bg-green-400
                                    " />
                                  )}

                                </button>

                              ))}

                            </div>

                          )}

                        </div>

                      </td>

                      {/* DATE */}

                      <td className="px-5 py-5">

                        <div className="
                          flex
                          items-center
                          gap-2
                          text-slate-400
                        ">

                          <CalendarDays
                            size={15}
                          />

                          <div>

                            <p>
                              {formatDate(
                                order.orderDate
                              )}
                            </p>

                            <p className="
                              text-xs
                              text-slate-600
                              mt-0.5
                            ">
                              {formatTime(
                                order.orderDate
                              )}
                            </p>

                          </div>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

        )}

      </div>

    </div>
  );
}

export default AdminOrders;