import {
  User,
  Mail,
  Phone,
  Heart,
  Package,
  ArrowRight,
  ShoppingBag,
  ArrowLeft,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { LogOut } from "lucide-react";

function Account() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login first.");
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:8080/api/users/me",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            toast.error("Session expired. Please login again.");
            navigate("/login");
            return;
          }

          throw new Error("Unable to fetch account details.");
        }

        const data = await response.json();

        console.log("Current User:", data);

        setUser(data);
      } catch (error) {
        console.error("Account Error:", error);
        toast.error("Unable to load account details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [navigate]);

  const name = user?.name || "ExoCart User";
  const email = user?.email || "Not available";
  const phone = user?.phoneNumber || "Not available";
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    toast.success("Logged out successfully!");

    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#020817] text-white">

      {/* ================= HEADER ================= */}

      <div className="border-b border-slate-800">

        <div className="max-w-5xl mx-auto px-5 py-7">

          <div className="flex items-center justify-between gap-4">

            {/* Account Title */}

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <User
                  size={25}
                  className="text-green-400"
                />
              </div>

              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  My{" "}
                  <span className="text-green-400">
                    Account
                  </span>
                </h1>

                <p className="text-sm text-slate-400 mt-1">
                  Manage your account and orders
                </p>
              </div>

            </div>

            {/* Header Actions */}

            <div className="flex items-center gap-2">

              {/* Back to Home */}

              <button
                type="button"
                onClick={() => navigate("/home")}
                className="
                  flex
                  items-center
                  gap-2
                  px-4
                  py-2.5
                  rounded-xl
                  border
                  border-slate-700
                  text-sm
                  font-medium
                  text-slate-300
                  hover:border-green-500
                  hover:text-green-400
                  transition-all
                  duration-300
                  cursor-pointer
                "
              >
                <ArrowLeft size={17} />
                Back to Home
              </button>

              {/* Logout */}

              <button
                type="button"
                onClick={handleLogout}
                className="
                  flex
                  items-center
                  gap-2
                  px-4
                  py-2.5
                  rounded-xl
                  border
                  border-red-500/30
                  text-sm
                  font-medium
                  text-red-400
                  hover:border-red-500
                  hover:bg-red-500/10
                  transition-all
                  duration-300
                  cursor-pointer
                "
              >
                <LogOut size={17} />
                Logout
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* ================= MAIN ================= */}

      <main className="max-w-5xl mx-auto px-5 py-7">

        {/* ================= PROFILE CARD ================= */}

        <div className="bg-[#07101f] border border-slate-800 rounded-2xl overflow-hidden">

          {/* Profile Header */}

          <div className="px-5 py-5 border-b border-slate-800">

            <div className="flex items-center gap-4">

              <div className="w-14 h-14 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">

                <User
                  size={27}
                  className="text-green-400"
                />

              </div>

              <div>

                {loading ? (
                  <>
                    <div className="h-5 w-32 bg-slate-800 rounded animate-pulse"></div>

                    <div className="h-3 w-40 bg-slate-800 rounded mt-2 animate-pulse"></div>
                  </>
                ) : (
                  <>
                    <h2 className="text-lg font-semibold">
                      {name}
                    </h2>

                    <p className="text-sm text-slate-500 mt-0.5">
                      Your ExoCart account
                    </p>
                  </>
                )}

              </div>

            </div>

          </div>

          {/* Account Details */}

          <div className="px-5 py-5">

            <h3 className="text-sm font-semibold text-slate-300 mb-4">
              Account Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              {/* Name */}

              <div className="bg-[#020817] border border-slate-800 rounded-xl p-4">

                <div className="flex items-center gap-2 mb-2">

                  <User
                    size={16}
                    className="text-green-400"
                  />

                  <span className="text-xs text-slate-500">
                    Full Name
                  </span>

                </div>

                {loading ? (
                  <div className="h-4 w-28 bg-slate-800 rounded animate-pulse"></div>
                ) : (
                  <p className="text-sm font-medium truncate">
                    {name}
                  </p>
                )}

              </div>

              {/* Email */}

              <div className="bg-[#020817] border border-slate-800 rounded-xl p-4">

                <div className="flex items-center gap-2 mb-2">

                  <Mail
                    size={16}
                    className="text-blue-400"
                  />

                  <span className="text-xs text-slate-500">
                    Email
                  </span>

                </div>

                {loading ? (
                  <div className="h-4 w-36 bg-slate-800 rounded animate-pulse"></div>
                ) : (
                  <p className="text-sm font-medium truncate">
                    {email}
                  </p>
                )}

              </div>

              {/* Phone */}

              <div className="bg-[#020817] border border-slate-800 rounded-xl p-4">

                <div className="flex items-center gap-2 mb-2">

                  <Phone
                    size={16}
                    className="text-purple-400"
                  />

                  <span className="text-xs text-slate-500">
                    Phone
                  </span>

                </div>

                {loading ? (
                  <div className="h-4 w-28 bg-slate-800 rounded animate-pulse"></div>
                ) : (
                  <p className="text-sm font-medium">
                    {phone}
                  </p>
                )}

              </div>

            </div>

          </div>

        </div>

        {/* ================= QUICK ACTIONS ================= */}

        <div className="mt-6">

          <h2 className="text-lg font-semibold mb-4">
            Your Activity
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* ================= WISHLIST ================= */}

            <button
              type="button"
              onClick={() => navigate("/wishlist")}
              className="
                group
                w-full
                text-left
                bg-[#07101f]
                border border-slate-800
                hover:border-pink-500/40
                rounded-2xl
                p-5
                transition-all
                duration-200
                cursor-pointer
              "
            >

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-4">

                  <div className="
                    w-12
                    h-12
                    rounded-xl
                    bg-pink-500/10
                    flex
                    items-center
                    justify-center
                  ">

                    <Heart
                      size={23}
                      className="text-pink-400"
                    />

                  </div>

                  <div>

                    <h3 className="font-semibold text-white">
                      Wishlist
                    </h3>

                    <p className="text-xs text-slate-500 mt-1">
                      View your saved products
                    </p>

                  </div>

                </div>

                <ArrowRight
                  size={19}
                  className="
                    text-slate-600
                    group-hover:text-pink-400
                    group-hover:translate-x-1
                    transition-all
                  "
                />

              </div>

            </button>

            {/* ================= MY ORDERS ================= */}

            <button
              type="button"
              onClick={() => navigate("/orders")}
              className="
                group
                w-full
                text-left
                bg-[#07101f]
                border border-slate-800
                hover:border-blue-500/40
                rounded-2xl
                p-5
                transition-all
                duration-200
                cursor-pointer
              "
            >

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-4">

                  <div className="
                    w-12
                    h-12
                    rounded-xl
                    bg-blue-500/10
                    flex
                    items-center
                    justify-center
                  ">

                    <Package
                      size={23}
                      className="text-blue-400"
                    />

                  </div>

                  <div>

                    <h3 className="font-semibold text-white">
                      My Orders
                    </h3>

                    <p className="text-xs text-slate-500 mt-1">
                      Track your previous orders
                    </p>

                  </div>

                </div>

                <ArrowRight
                  size={19}
                  className="
                    text-slate-600
                    group-hover:text-blue-400
                    group-hover:translate-x-1
                    transition-all
                  "
                />

              </div>

            </button>

          </div>

        </div>

        {/* ================= SHOPPING CARD ================= */}

        <div className="
          mt-6
          rounded-2xl
          border border-dashed border-slate-700
          bg-[#07101f]/70
          px-5
          py-4
        ">

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">

                <ShoppingBag
                  size={19}
                  className="text-green-400"
                />

              </div>

              <div>

                <p className="text-sm font-semibold">
                  Ready to shop?
                </p>

                <p className="text-xs text-slate-500 mt-0.5">
                  Explore fresh groceries and daily essentials
                </p>

              </div>

            </div>

            <button
              type="button"
              onClick={() => navigate("/home")}
              className="
                flex
                items-center
                gap-2
                bg-green-500
                hover:bg-transparent
                border border-green-500
                hover:text-green-400
                text-black
                text-sm
                font-semibold
                px-5
                py-2.5
                rounded-xl
                transition-all
                duration-300
                group
                cursor-pointer
              "
            >
              Start Shopping

              <ArrowRight
                size={16}
                className="
                  group-hover:translate-x-1
                  transition-transform
                "
              />

            </button>

          </div>

        </div>

      </main>

    </div>
  );
}

export default Account;