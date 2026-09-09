import { useEffect, useState } from "react";
import { Package, ShoppingCart, Users, IndianRupee } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Sidebar from "../components/admin/Sidebar";
import TopNavbar from "../components/admin/TopNavbar";
import StatCard from "../components/admin/StatCard";


function AdminDashboard() {

  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    users: 0,
    revenue: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      // No login → go to login page
      if (!token) {
        navigate("/login");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [
        productsResponse,
        ordersResponse,
        usersResponse,
      ] = await Promise.all([
        fetch(
          "http://localhost:8080/api/products",
          {
            headers,
          }
        ),

        fetch(
          "http://localhost:8080/api/orders/admin/all",
          {
            headers,
          }
        ),

        fetch(
          "http://localhost:8080/api/users/count",
          {
            headers,
          }
        ),
      ]);

      // Unauthorized
      if (
        productsResponse.status === 401 ||
        productsResponse.status === 403 ||
        ordersResponse.status === 401 ||
        ordersResponse.status === 403 ||
        usersResponse.status === 401 ||
        usersResponse.status === 403
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        toast.error("Please login as admin.");
        navigate("/login");
        return;
      }

      if (
        !productsResponse.ok ||
        !ordersResponse.ok ||
        !usersResponse.ok
      ) {
        throw new Error(
          "Unable to load dashboard data."
        );
      }

      const products =
        await productsResponse.json();

      const orders =
        await ordersResponse.json();

      const users =
        await usersResponse.json();

      const totalRevenue = orders.reduce(
        (total, order) =>
          total + Number(order.totalAmount || 0),
        0
      );

      const sortedOrders = [...orders]
        .sort(
          (a, b) =>
            new Date(b.orderDate) -
            new Date(a.orderDate)
        )
        .slice(0, 5);

      setStats({
        products: products.length,
        orders: orders.length,
        users: Number(users),
        revenue: totalRevenue,
      });

      setRecentOrders(sortedOrders);

    } catch (err) {
      console.error(
        "Dashboard Error:",
        err
      );

      setError(
        "Unable to load dashboard data. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatRevenue = (value) => {

    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`;
    }

    if (value >= 1000) {
      return `₹${(value / 1000).toFixed(1)}K`;
    }

    return `₹${value.toFixed(0)}`;
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

  if (loading) {

    return (
      <div className="min-h-screen bg-[#020817] flex">

        <Sidebar />

        <div className="flex-1 flex items-center justify-center">

          <div className="text-center">

            <div className="w-10 h-10 border-4 border-slate-700 border-t-green-500 rounded-full animate-spin mx-auto mb-4"></div>

            <p className="text-sm text-slate-400">
              Loading dashboard...
            </p>

          </div>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020817] flex">

      <Sidebar />

      <div className="flex-1 p-8 overflow-y-auto">

        <TopNavbar />

        {/* ERROR */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* ================= STAT CARDS ================= */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mt-8">

          <StatCard
            title="Total Products"
            value={stats.products}
            icon={
              <Package
                size={24}
                className="text-green-400"
              />
            }
          />

          <StatCard
            title="Total Orders"
            value={stats.orders}
            icon={
              <ShoppingCart
                size={24}
                className="text-green-400"
              />
            }
          />

          <StatCard
            title="Total Users"
            value={stats.users}
            icon={
              <Users
                size={24}
                className="text-green-400"
              />
            }
          />

          <StatCard
            title="Revenue"
            value={formatRevenue(stats.revenue)}
            icon={
              <IndianRupee
                size={24}
                className="text-green-400"
              />
            }
          />

        </div>

        {/* ================= RECENT ORDERS ================= */}

        <div className="mt-8 bg-[#081225] border border-slate-800 rounded-2xl overflow-hidden">

          <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">

            <div>

              <h2 className="text-lg font-bold text-white">
                Recent Orders
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                Latest orders placed by customers
              </p>

            </div>

            <button
              type="button"
              className="text-sm text-green-400 hover:text-green-300 transition cursor-pointer"
              onClick={() => {
                window.location.href =
                  "/admin/orders";
              }}
            >
              View All
            </button>

          </div>

          {recentOrders.length === 0 ? (

            <div className="px-6 py-12 text-center">

              <ShoppingCart
                size={30}
                className="text-slate-600 mx-auto mb-3"
              />

              <p className="text-sm text-slate-500">
                No orders yet.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full text-sm">

                <thead>

                  <tr className="border-b border-slate-800 text-slate-500">

                    <th className="text-left px-6 py-4 font-medium">
                      Order
                    </th>

                    <th className="text-left px-6 py-4 font-medium">
                      Customer
                    </th>

                    <th className="text-left px-6 py-4 font-medium">
                      Amount
                    </th>

                    <th className="text-left px-6 py-4 font-medium">
                      Payment
                    </th>

                    <th className="text-left px-6 py-4 font-medium">
                      Status
                    </th>

                    <th className="text-left px-6 py-4 font-medium">
                      Date
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {recentOrders.map((order) => (

                    <tr
                      key={order.orderId}
                      className="border-b border-slate-800/70 last:border-0 hover:bg-slate-800/20 transition"
                    >

                      <td className="px-6 py-4">

                        <span className="font-semibold text-white">
                          #{order.orderId}
                        </span>

                      </td>

                      <td className="px-6 py-4">

                        <span className="text-slate-300">
                          {order.customerName}
                        </span>

                      </td>

                      <td className="px-6 py-4">

                        <span className="font-semibold text-green-400">
                          ₹
                          {Number(
                            order.totalAmount || 0
                          ).toFixed(2)}
                        </span>

                      </td>

                      <td className="px-6 py-4">

                        <span className="text-slate-400">
                          {order.paymentMethod}
                        </span>

                      </td>

                      <td className="px-6 py-4">

                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full border text-[11px] font-semibold ${getStatusStyle(
                            order.orderStatus
                          )}`}
                        >
                          {order.orderStatus}
                        </span>

                      </td>

                      <td className="px-6 py-4">

                        <span className="text-slate-500">
                          {formatDate(
                            order.orderDate
                          )}
                        </span>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

        {/* ================= QUICK ACTIONS ================= */}

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">

          <button
            type="button"
            onClick={() =>
              (window.location.href =
                "/admin/add-product")
            }
            className="text-left bg-[#081225] border border-slate-800 rounded-2xl p-5 hover:border-green-500/40 hover:-translate-y-1 transition-all cursor-pointer"
          >

            <Package
              size={22}
              className="text-green-400 mb-3"
            />

            <h3 className="text-white font-semibold">
              Add Product
            </h3>

            <p className="text-xs text-slate-500 mt-1">
              Add a new grocery product
            </p>

          </button>

          <button
            type="button"
            onClick={() =>
              (window.location.href =
                "/admin/products")
            }
            className="text-left bg-[#081225] border border-slate-800 rounded-2xl p-5 hover:border-green-500/40 hover:-translate-y-1 transition-all cursor-pointer"
          >

            <ShoppingCart
              size={22}
              className="text-green-400 mb-3"
            />

            <h3 className="text-white font-semibold">
              Manage Products
            </h3>

            <p className="text-xs text-slate-500 mt-1">
              View, edit or delete products
            </p>

          </button>

          <button
            type="button"
            onClick={() =>
              (window.location.href =
                "/admin/orders")
            }
            className="text-left bg-[#081225] border border-slate-800 rounded-2xl p-5 hover:border-green-500/40 hover:-translate-y-1 transition-all cursor-pointer"
          >

            <Users
              size={22}
              className="text-green-400 mb-3"
            />

            <h3 className="text-white font-semibold">
              Manage Orders
            </h3>

            <p className="text-xs text-slate-500 mt-1">
              View and manage customer orders
            </p>

          </button>

        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;