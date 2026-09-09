import { useEffect, useMemo, useState } from "react";

import {
  ArrowLeft,
  BarChart3,
  IndianRupee,
  ShoppingCart,
  PackageCheck,
  XCircle,
  CreditCard,
  TrendingUp,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function AdminReports() {

  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH ORDERS =================

  const fetchOrders = async () => {

    try {

      setLoading(true);

      const token =
        localStorage.getItem("token");

      if (!token) {

        toast.error(
          "Please login as admin."
        );

        navigate("/login");
        return;
      }

      const response = await fetch(
        "http://localhost:8080/api/orders/admin/all",
        {
          method: "GET",
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
          "Session expired. Please login again.",
          {
            toastId: "admin-session-expired",
          }
        );

        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          "Failed to fetch reports"
        );
      }

      const data =
        await response.json();

      setOrders(data);

    } catch (error) {

      console.error(
        "Reports error:",
        error
      );

      toast.error(
        "Failed to load reports."
      );

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ================= REPORT DATA =================

  const reportData = useMemo(() => {

    const totalOrders =
      orders.length;

    const totalRevenue =
      orders
        .filter(
          (order) =>
            order.orderStatus !== "Cancelled"
        )
        .reduce(
          (total, order) =>
            total +
            Number(order.totalAmount || 0),
          0
        );

    const deliveredOrders =
      orders.filter(
        (order) =>
          order.orderStatus === "Delivered"
      ).length;

    const cancelledOrders =
      orders.filter(
        (order) =>
          order.orderStatus === "Cancelled"
      ).length;

    const placedOrders =
      orders.filter(
        (order) =>
          order.orderStatus === "Placed"
      ).length;

    const processingOrders =
      orders.filter(
        (order) =>
          order.orderStatus === "Processing"
      ).length;

    const outForDeliveryOrders =
      orders.filter(
        (order) =>
          order.orderStatus ===
          "Out for Delivery"
      ).length;

    const codOrders =
      orders.filter(
        (order) =>
          order.paymentMethod === "COD"
      ).length;

    const upiOrders =
      orders.filter(
        (order) =>
          order.paymentMethod === "UPI"
      ).length;

    const cardOrders =
      orders.filter(
        (order) =>
          order.paymentMethod === "CARD"
      ).length;

    const averageOrderValue =
      totalOrders > 0
        ? totalRevenue /
          orders.filter(
            (order) =>
              order.orderStatus !==
              "Cancelled"
          ).length
        : 0;

    return {
      totalOrders,
      totalRevenue,
      deliveredOrders,
      cancelledOrders,
      placedOrders,
      processingOrders,
      outForDeliveryOrders,
      codOrders,
      upiOrders,
      cardOrders,
      averageOrderValue:
        Number.isFinite(averageOrderValue)
          ? averageOrderValue
          : 0,
    };

  }, [orders]);

  // ================= STATUS DATA =================

  const statusData = [
    {
      label: "Placed",
      value: reportData.placedOrders,
      className:
        "bg-green-500",
      textClass:
        "text-green-400",
    },
    {
      label: "Processing",
      value: reportData.processingOrders,
      className:
        "bg-yellow-400",
      textClass:
        "text-yellow-400",
    },
    {
      label: "Out for Delivery",
      value:
        reportData.outForDeliveryOrders,
      className:
        "bg-purple-400",
      textClass:
        "text-purple-400",
    },
    {
      label: "Delivered",
      value:
        reportData.deliveredOrders,
      className:
        "bg-blue-400",
      textClass:
        "text-blue-400",
    },
    {
      label: "Cancelled",
      value:
        reportData.cancelledOrders,
      className:
        "bg-red-400",
      textClass:
        "text-red-400",
    },
  ];

  // ================= PAYMENT DATA =================

  const paymentData = [
    {
      label: "Cash on Delivery",
      short: "COD",
      value:
        reportData.codOrders,
      color:
        "bg-purple-400",
    },
    {
      label: "UPI",
      short: "UPI",
      value:
        reportData.upiOrders,
      color:
        "bg-green-400",
    },
    {
      label: "Card",
      short: "CARD",
      value:
        reportData.cardOrders,
      color:
        "bg-blue-400",
    },
  ];

  // ================= LOADING =================

  if (loading) {

    return (
      <div className="
        min-h-screen
        bg-[#020817]
        flex
        items-center
        justify-center
      ">

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
            Loading reports...
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="
      min-h-screen
      bg-[#020817]
    ">

      {/* ================= HEADER ================= */}

      <div className="
        border-b
        border-slate-800
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
                Reports
              </h1>

              <p className="
                text-slate-400
                mt-2
              ">
                Overview of your store performance
              </p>

            </div>

            <div className="
              w-12
              h-12
              rounded-xl
              bg-green-500/10
              flex
              items-center
              justify-center
            ">

              <BarChart3
                size={24}
                className="text-green-400"
              />

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

        {/* ================= STAT CARDS ================= */}

        <div className="
          grid
          grid-cols-1
          sm:grid-cols-2
          xl:grid-cols-4
          gap-5
        ">

          {/* Revenue */}

          <div className="
            bg-[#081225]
            border
            border-slate-800
            rounded-2xl
            p-5
            hover:border-green-500/30
            transition
          ">

            <div className="
              flex
              items-center
              justify-between
            ">

              <div>

                <p className="
                  text-slate-500
                  text-sm
                ">
                  Total Revenue
                </p>

                <h2 className="
                  text-3xl
                  font-bold
                  text-white
                  mt-2
                ">
                  ₹
                  {reportData.totalRevenue.toLocaleString(
                    "en-IN"
                  )}
                </h2>

              </div>

              <div className="
                w-12
                h-12
                rounded-xl
                bg-green-500/10
                flex
                items-center
                justify-center
              ">

                <IndianRupee
                  size={24}
                  className="text-green-400"
                />

              </div>

            </div>

          </div>

          {/* Orders */}

          <div className="
            bg-[#081225]
            border
            border-slate-800
            rounded-2xl
            p-5
            hover:border-green-500/30
            transition
          ">

            <div className="
              flex
              items-center
              justify-between
            ">

              <div>

                <p className="
                  text-slate-500
                  text-sm
                ">
                  Total Orders
                </p>

                <h2 className="
                  text-3xl
                  font-bold
                  text-white
                  mt-2
                ">
                  {reportData.totalOrders}
                </h2>

              </div>

              <div className="
                w-12
                h-12
                rounded-xl
                bg-blue-500/10
                flex
                items-center
                justify-center
              ">

                <ShoppingCart
                  size={24}
                  className="text-blue-400"
                />

              </div>

            </div>

          </div>

          {/* Delivered */}

          <div className="
            bg-[#081225]
            border
            border-slate-800
            rounded-2xl
            p-5
            hover:border-green-500/30
            transition
          ">

            <div className="
              flex
              items-center
              justify-between
            ">

              <div>

                <p className="
                  text-slate-500
                  text-sm
                ">
                  Delivered
                </p>

                <h2 className="
                  text-3xl
                  font-bold
                  text-white
                  mt-2
                ">
                  {reportData.deliveredOrders}
                </h2>

              </div>

              <div className="
                w-12
                h-12
                rounded-xl
                bg-blue-500/10
                flex
                items-center
                justify-center
              ">

                <PackageCheck
                  size={24}
                  className="text-blue-400"
                />

              </div>

            </div>

          </div>

          {/* Cancelled */}

          <div className="
            bg-[#081225]
            border
            border-slate-800
            rounded-2xl
            p-5
            hover:border-red-500/30
            transition
          ">

            <div className="
              flex
              items-center
              justify-between
            ">

              <div>

                <p className="
                  text-slate-500
                  text-sm
                ">
                  Cancelled
                </p>

                <h2 className="
                  text-3xl
                  font-bold
                  text-white
                  mt-2
                ">
                  {reportData.cancelledOrders}
                </h2>

              </div>

              <div className="
                w-12
                h-12
                rounded-xl
                bg-red-500/10
                flex
                items-center
                justify-center
              ">

                <XCircle
                  size={24}
                  className="text-red-400"
                />

              </div>

            </div>

          </div>

        </div>

        {/* ================= SECOND ROW ================= */}

        <div className="
          grid
          grid-cols-1
          lg:grid-cols-2
          gap-6
          mt-6
        ">

          {/* ORDER STATUS */}

          <div className="
            bg-[#081225]
            border
            border-slate-800
            rounded-2xl
            p-6
          ">

            <div className="
              flex
              items-center
              justify-between
              mb-6
            ">

              <div>

                <h2 className="
                  text-xl
                  font-bold
                  text-white
                ">
                  Order Status
                </h2>

                <p className="
                  text-slate-500
                  text-sm
                  mt-1
                ">
                  Current order distribution
                </p>

              </div>

              <BarChart3
                size={21}
                className="text-green-400"
              />

            </div>

            <div className="space-y-5">

              {statusData.map((item) => {

                const percentage =
                  reportData.totalOrders > 0
                    ? (
                        item.value /
                        reportData.totalOrders
                      ) * 100
                    : 0;

                return (
                  <div
                    key={item.label}
                  >

                    <div className="
                      flex
                      items-center
                      justify-between
                      mb-2
                    ">

                      <div className="
                        flex
                        items-center
                        gap-2
                      ">

                        <span
                          className={`
                            w-2
                            h-2
                            rounded-full
                            ${item.className}
                          `}
                        />

                        <span className="
                          text-slate-300
                          text-sm
                        ">
                          {item.label}
                        </span>

                      </div>

                      <span className={`
                        text-sm
                        font-semibold
                        ${item.textClass}
                      `}>
                        {item.value}
                      </span>

                    </div>

                    <div className="
                      h-2
                      bg-slate-800
                      rounded-full
                      overflow-hidden
                    ">

                      <div
                        className={`
                          h-full
                          rounded-full
                          transition-all
                          duration-700
                          ${item.className}
                        `}
                        style={{
                          width:
                            `${percentage}%`,
                        }}
                      />

                    </div>

                  </div>
                );

              })}

            </div>

          </div>

          {/* PAYMENT METHODS */}

          <div className="
            bg-[#081225]
            border
            border-slate-800
            rounded-2xl
            p-6
          ">

            <div className="
              flex
              items-center
              justify-between
              mb-6
            ">

              <div>

                <h2 className="
                  text-xl
                  font-bold
                  text-white
                ">
                  Payment Methods
                </h2>

                <p className="
                  text-slate-500
                  text-sm
                  mt-1
                ">
                  Orders by payment method
                </p>

              </div>

              <CreditCard
                size={21}
                className="text-purple-400"
              />

            </div>

            <div className="space-y-5">

              {paymentData.map((item) => {

                const percentage =
                  reportData.totalOrders > 0
                    ? (
                        item.value /
                        reportData.totalOrders
                      ) * 100
                    : 0;

                return (
                  <div
                    key={item.short}
                  >

                    <div className="
                      flex
                      items-center
                      justify-between
                      mb-2
                    ">

                      <div className="
                        flex
                        items-center
                        gap-3
                      ">

                        <div className="
                          w-9
                          h-9
                          rounded-lg
                          bg-slate-800
                          flex
                          items-center
                          justify-center
                        ">

                          <CreditCard
                            size={17}
                            className="text-slate-300"
                          />

                        </div>

                        <div>

                          <p className="
                            text-white
                            text-sm
                            font-medium
                          ">
                            {item.label}
                          </p>

                          <p className="
                            text-slate-500
                            text-xs
                          ">
                            {percentage.toFixed(0)}%
                          </p>

                        </div>

                      </div>

                      <span className="
                        text-white
                        font-semibold
                      ">
                        {item.value}
                      </span>

                    </div>

                    <div className="
                      h-2
                      bg-slate-800
                      rounded-full
                      overflow-hidden
                    ">

                      <div
                        className={`
                          h-full
                          rounded-full
                          ${item.color}
                        `}
                        style={{
                          width:
                            `${percentage}%`,
                        }}
                      />

                    </div>

                  </div>
                );

              })}

            </div>

          </div>

        </div>

        {/* ================= PERFORMANCE ================= */}

        <div className="
          bg-[#081225]
          border
          border-slate-800
          rounded-2xl
          p-6
          mt-6
        ">

          <div className="
            flex
            items-center
            gap-3
            mb-6
          ">

            <div className="
              w-10
              h-10
              rounded-xl
              bg-green-500/10
              flex
              items-center
              justify-center
            ">

              <TrendingUp
                size={20}
                className="text-green-400"
              />

            </div>

            <div>

              <h2 className="
                text-xl
                font-bold
                text-white
              ">
                Store Performance
              </h2>

              <p className="
                text-slate-500
                text-sm
                mt-1
              ">
                Key performance indicators
              </p>

            </div>

          </div>

          <div className="
            grid
            grid-cols-1
            sm:grid-cols-3
            gap-4
          ">

            {/* Average Order */}

            <div className="
              rounded-xl
              bg-[#020817]
              border
              border-slate-800
              p-5
            ">

              <p className="
                text-slate-500
                text-sm
              ">
                Average Order Value
              </p>

              <p className="
                text-2xl
                font-bold
                text-green-400
                mt-2
              ">
                ₹
                {reportData.averageOrderValue.toFixed(
                  2
                )}
              </p>

            </div>

            {/* Delivery Rate */}

            <div className="
              rounded-xl
              bg-[#020817]
              border
              border-slate-800
              p-5
            ">

              <p className="
                text-slate-500
                text-sm
              ">
                Delivery Rate
              </p>

              <p className="
                text-2xl
                font-bold
                text-blue-400
                mt-2
              ">
                {reportData.totalOrders > 0
                  ? (
                      (
                        reportData.deliveredOrders /
                        reportData.totalOrders
                      ) *
                      100
                    ).toFixed(1)
                  : "0.0"}%
              </p>

            </div>

            {/* Cancellation Rate */}

            <div className="
              rounded-xl
              bg-[#020817]
              border
              border-slate-800
              p-5
            ">

              <p className="
                text-slate-500
                text-sm
              ">
                Cancellation Rate
              </p>

              <p className="
                text-2xl
                font-bold
                text-red-400
                mt-2
              ">
                {reportData.totalOrders > 0
                  ? (
                      (
                        reportData.cancelledOrders /
                        reportData.totalOrders
                      ) *
                      100
                    ).toFixed(1)
                  : "0.0"}%
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminReports;