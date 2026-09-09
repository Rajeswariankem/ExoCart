import {
  LayoutDashboard,
  PlusCircle,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  LogOut,
  Store,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    toast.success("Logged out successfully!");

    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition cursor-pointer ${
      isActive
        ? "bg-green-500/20 text-green-400"
        : "text-slate-300 hover:bg-slate-800 hover:text-white"
    }`;

  return (
    <div className="w-64 min-h-screen bg-[#081225] border-r border-slate-800 flex flex-col">

      {/* ================= LOGO ================= */}

      <div className="p-6 border-b border-slate-800">

        <h1
          onClick={() => navigate("/admin")}
          className="text-3xl font-bold text-white cursor-pointer"
        >
          Exo<span className="text-green-400">Cart</span>
        </h1>

      </div>

      {/* ================= MENU ================= */}

      <div className="flex-1 p-4 space-y-2">

        {/* Dashboard */}

        <NavLink
          to="/admin"
          end
          className={linkClass}
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        {/* Add Product */}

        <NavLink
          to="/admin/add-product"
          className={linkClass}
        >
          <PlusCircle size={20} />
          <span>Add Product</span>
        </NavLink>

        {/* Products */}

        <NavLink
          to="/admin/products"
          className={linkClass}
        >
          <Package size={20} />
          <span>Products</span>
        </NavLink>

        {/* Orders */}

        <NavLink
          to="/admin/orders"
          className={linkClass}
        >
          <ShoppingCart size={20} />
          <span>Orders</span>
        </NavLink>

        {/* Users */}

        <NavLink
          to="/admin/users"
          className={linkClass}
        >
          <Users size={20} />
          <span>Users</span>
        </NavLink>

        {/* Reports */}

        <NavLink
          to="/admin/reports"
          className={linkClass}
        >
          <BarChart3 size={20} />
          <span>Reports</span>
        </NavLink>

      </div>

      {/* ================= BOTTOM ================= */}

      <div className="p-4 border-t border-slate-800 space-y-2">

        {/* Back to Store */}

        <button
          type="button"
          onClick={() => navigate("/home")}
          className="
            w-full
            flex
            items-center
            gap-3
            text-slate-300
            hover:bg-slate-800
            hover:text-white
            px-4
            py-3
            rounded-xl
            cursor-pointer
            transition
          "
        >
          <Store size={20} />
          <span>Back to Store</span>
        </button>

        {/* Logout */}

        <button
          type="button"
          onClick={handleLogout}
          className="
            w-full
            flex
            items-center
            gap-3
            text-red-400
            hover:bg-red-500/10
            hover:text-red-300
            px-4
            py-3
            rounded-xl
            cursor-pointer
            transition
          "
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>

      </div>

    </div>
  );
}

export default Sidebar;