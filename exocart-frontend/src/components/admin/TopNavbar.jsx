import {
  Bell,
  Settings,
  Search,
  User,
  LogOut,
  Store,
  X,
  Package,
  ShoppingCart,
  CheckCircle,
  AlertTriangle,
  Save,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function TopNavbar() {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");

  // Notifications
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Settings
  const [showSettings, setShowSettings] = useState(false);

  const [settings, setSettings] = useState({
    storeName: "ExoCart",
    deliveryFee: "40",
    minimumOrder: "199",
  });

  // Profile
  const [showProfile, setShowProfile] = useState(false);

  // =====================================================
  // LOAD SETTINGS
  // =====================================================

  useEffect(() => {
    const savedSettings = localStorage.getItem("exocartSettings");

    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);

        setSettings({
          storeName: parsed.storeName || "ExoCart",
          deliveryFee: parsed.deliveryFee || "40",
          minimumOrder: parsed.minimumOrder || "199",
        });

        setNotificationsEnabled(
          parsed.notificationsEnabled !== false
        );
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    }
  }, []);

  // =====================================================
  // FETCH NOTIFICATIONS
  // =====================================================

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");

      const headers = token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {};

      const [ordersResponse, productsResponse] = await Promise.all([
        fetch("http://localhost:8080/api/orders/admin/all", {
          headers,
        }),

        fetch("http://localhost:8080/api/products", {
          headers,
        }),
      ]);

      const newNotifications = [];

      // =================================================
      // ORDERS
      // =================================================

      if (ordersResponse.ok) {
        const orders = await ordersResponse.json();

        orders.forEach((order) => {
          const status = order.orderStatus?.toLowerCase();

          if (status === "placed") {
            newNotifications.push({
              id: `order-${order.orderId}`,
              type: "order",
              title: "New order received",
              message: `Order #${order.orderId} from ${
                order.customerName || "Customer"
              }`,
              action: "/admin/orders",
              unread: true,
            });
          }

          if (status === "delivered") {
            newNotifications.push({
              id: `delivered-${order.orderId}`,
              type: "delivered",
              title: "Order delivered",
              message: `Order #${order.orderId} has been delivered`,
              action: "/admin/orders",
              unread: false,
            });
          }

          if (status === "cancelled") {
            newNotifications.push({
              id: `cancelled-${order.orderId}`,
              type: "cancelled",
              title: "Order cancelled",
              message: `Order #${order.orderId} was cancelled`,
              action: "/admin/orders",
              unread: false,
            });
          }
        });
      }

      // =================================================
      // PRODUCTS / LOW STOCK
      // =================================================

      if (productsResponse.ok) {
        const products = await productsResponse.json();

        products.forEach((product) => {
          if (
            Number(product.stock) > 0 &&
            Number(product.stock) <= 5
          ) {
            newNotifications.push({
              id: `stock-${product.id}`,
              type: "stock",
              title: "Low stock alert",
              message: `${product.name} has only ${product.stock} items left`,
              action: "/admin/products",
              unread: true,
            });
          }
        });
      }

      setNotifications(newNotifications.slice(0, 20));
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    toast.success("Logged out successfully!");

    navigate("/login");
  };

  // =====================================================
  // SEARCH
  // =====================================================

  const handleSearch = (e) => {
    e.preventDefault();

    const keyword = searchQuery.trim().toLowerCase();

    if (!keyword) {
      toast.info("Enter something to search.");
      return;
    }

    if (keyword.includes("order")) {
      navigate("/admin/orders");
      return;
    }

    if (keyword.includes("product")) {
      navigate("/admin/products");
      return;
    }

    if (keyword.includes("user")) {
      navigate("/admin/users");
      return;
    }

    if (keyword.includes("report")) {
      navigate("/admin/reports");
      return;
    }

    toast.info(
      `No admin section found for "${searchQuery}".`
    );
  };

  // =====================================================
  // SAVE SETTINGS
  // =====================================================

  const handleSaveSettings = () => {
    const updatedSettings = {
      ...settings,
      notificationsEnabled,
    };

    localStorage.setItem(
      "exocartSettings",
      JSON.stringify(updatedSettings)
    );

    setShowSettings(false);

    toast.success("Settings saved successfully!");
  };

  // =====================================================
  // MARK ALL READ
  // =====================================================

  const markAllAsRead = () => {
    setNotifications((previous) =>
      previous.map((notification) => ({
        ...notification,
        unread: false,
      }))
    );

    toast.success("Notifications marked as read");
  };

  // =====================================================
  // NOTIFICATION CLICK
  // =====================================================

  const handleNotificationClick = (notification) => {
    setNotifications((previous) =>
      previous.map((item) =>
        item.id === notification.id
          ? {
              ...item,
              unread: false,
            }
          : item
      )
    );

    setShowNotifications(false);

    navigate(notification.action);
  };

  const unreadCount = notifications.filter(
    (notification) => notification.unread
  ).length;

  // =====================================================
  // NOTIFICATION ICON
  // =====================================================

  const getNotificationIcon = (type) => {
    if (type === "order") {
      return (
        <ShoppingCart
          size={18}
          className="text-green-400"
        />
      );
    }

    if (type === "stock") {
      return (
        <AlertTriangle
          size={18}
          className="text-yellow-400"
        />
      );
    }

    if (type === "delivered") {
      return (
        <CheckCircle
          size={18}
          className="text-blue-400"
        />
      );
    }

    return (
      <Package
        size={18}
        className="text-red-400"
      />
    );
  };

  return (
    <>
      {/* =====================================================
          TOP NAVBAR
      ===================================================== */}

      <div className="flex items-center justify-between mb-8">

        {/* LEFT */}

        <div>
          <h1 className="text-3xl font-bold text-white">
            Dashboard Overview
          </h1>

          <p className="text-slate-400 mt-2">
            Welcome back, Admin 👋
          </p>
        </div>

        {/* RIGHT */}

        <div className="flex items-center gap-4">

          {/* SEARCH */}

          <form
            onSubmit={handleSearch}
            className="relative"
          >
            <Search
              size={18}
              className="absolute left-3 top-3 text-slate-400"
            />

            <input
              type="text"
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(e.target.value)
              }
              placeholder="Search..."
              className="
                bg-[#081225]
                border
                border-slate-700
                rounded-xl
                py-2.5
                pl-10
                pr-4
                text-white
                text-sm
                outline-none
                focus:border-green-400
                w-56
                transition
              "
            />
          </form>

          {/* NOTIFICATION BUTTON */}

          <button
            type="button"
            onClick={() =>
              setShowNotifications(
                !showNotifications
              )
            }
            className="
              relative
              cursor-pointer
              p-2
              rounded-lg
              hover:bg-slate-800
              transition
            "
          >
            <Bell
              size={22}
              className="text-slate-300"
            />

            {notificationsEnabled &&
              unreadCount > 0 && (
                <span
                  className="
                    absolute
                    -top-1
                    -right-1
                    min-w-4
                    h-4
                    px-1
                    text-[10px]
                    rounded-full
                    bg-red-500
                    text-white
                    flex
                    items-center
                    justify-center
                  "
                >
                  {unreadCount > 9
                    ? "9+"
                    : unreadCount}
                </span>
              )}
          </button>

          {/* SETTINGS BUTTON */}

          <button
            type="button"
            onClick={() =>
              setShowSettings(true)
            }
            className="
              cursor-pointer
              p-2
              rounded-lg
              hover:bg-slate-800
              transition
            "
          >
            <Settings
              size={22}
              className="text-slate-300"
            />
          </button>

          {/* PROFILE */}

          <button
            type="button"
            onClick={() =>
              setShowProfile(!showProfile)
            }
            className="
              flex
              items-center
              gap-3
              cursor-pointer
              bg-[#081225]
              px-3
              py-2
              rounded-xl
              border
              border-slate-800
              hover:border-green-500/40
              transition
            "
          >
            <div
              className="
                w-10
                h-10
                rounded-full
                bg-green-500
                flex
                items-center
                justify-center
              "
            >
              <User
                size={20}
                className="text-white"
              />
            </div>

            <div className="text-left">
              <h3 className="text-white font-medium">
                Admin
              </h3>

              <p className="text-slate-400 text-xs">
                Administrator
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* =====================================================
          NOTIFICATION PANEL
      ===================================================== */}

      {showNotifications && (
        <div
          className="
            absolute
            right-40
            top-20
            z-50
            w-96
            max-w-[calc(100vw-2rem)]
            bg-[#081225]
            border
            border-slate-700
            rounded-2xl
            shadow-2xl
            overflow-hidden
          "
        >
          {/* HEADER */}

          <div
            className="
              px-5
              py-4
              border-b
              border-slate-800
              flex
              items-center
              justify-between
            "
          >
            <div>
              <h3 className="text-white font-semibold">
                Notifications
              </h3>

              <p className="text-xs text-slate-500 mt-1">
                {unreadCount} unread notification
                {unreadCount !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="flex items-center gap-3">

              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="
                    text-xs
                    text-green-400
                    hover:text-green-300
                    cursor-pointer
                  "
                >
                  Mark all as read
                </button>
              )}

              <button
                type="button"
                onClick={() =>
                  setShowNotifications(false)
                }
                className="
                  text-slate-500
                  hover:text-white
                  cursor-pointer
                "
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* CONTENT */}

          {!notificationsEnabled ? (
            <div className="p-8 text-center">
              <Bell
                size={32}
                className="mx-auto text-slate-600"
              />

              <p className="text-slate-400 text-sm mt-3">
                Notifications are disabled.
              </p>

              <button
                type="button"
                onClick={() => {
                  setShowNotifications(false);
                  setShowSettings(true);
                }}
                className="
                  mt-4
                  text-green-400
                  text-sm
                  hover:text-green-300
                  cursor-pointer
                "
              >
                Enable notifications
              </button>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center">
              <CheckCircle
                size={34}
                className="mx-auto text-green-400"
              />

              <p className="text-white font-medium mt-3">
                You're all caught up!
              </p>

              <p className="text-slate-500 text-xs mt-1">
                No new notifications
              </p>
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">

              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() =>
                    handleNotificationClick(
                      notification
                    )
                  }
                  className={
                    notification.unread
                      ? "w-full flex gap-3 text-left px-5 py-4 border-b border-slate-800 hover:bg-slate-800/50 transition cursor-pointer bg-green-500/5"
                      : "w-full flex gap-3 text-left px-5 py-4 border-b border-slate-800 hover:bg-slate-800/50 transition cursor-pointer"
                  }
                >
                  <div
                    className="
                      w-9
                      h-9
                      shrink-0
                      rounded-lg
                      bg-slate-800
                      flex
                      items-center
                      justify-center
                    "
                  >
                    {getNotificationIcon(
                      notification.type
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">

                      <p className="text-sm font-medium text-white">
                        {notification.title}
                      </p>

                      {notification.unread && (
                        <span
                          className="
                            w-2
                            h-2
                            shrink-0
                            rounded-full
                            bg-green-400
                            mt-1.5
                          "
                        />
                      )}
                    </div>

                    <p className="text-xs text-slate-400 mt-1">
                      {notification.message}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =====================================================
          PROFILE MENU
      ===================================================== */}

      {showProfile && (
        <div
          className="
            absolute
            right-8
            top-20
            z-50
            w-52
            bg-[#081225]
            border
            border-slate-700
            rounded-xl
            shadow-2xl
            p-2
          "
        >
          <button
            type="button"
            onClick={() =>
              navigate("/home")
            }
            className="
              w-full
              flex
              items-center
              gap-3
              px-3
              py-2.5
              rounded-lg
              text-slate-300
              hover:bg-slate-800
              hover:text-white
              transition
              cursor-pointer
            "
          >
            <Store size={18} />
            Back to Store
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="
              w-full
              flex
              items-center
              gap-3
              px-3
              py-2.5
              rounded-lg
              text-red-400
              hover:bg-red-500/10
              transition
              cursor-pointer
            "
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      )}

      {/* =====================================================
          SETTINGS MODAL
      ===================================================== */}

      {showSettings && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            px-4
          "
        >
          {/* BACKDROP */}

          <div
            className="
              absolute
              inset-0
              bg-black/70
              backdrop-blur-sm
            "
            onClick={() =>
              setShowSettings(false)
            }
          />

          {/* MODAL */}

          <div
            className="
              relative
              w-full
              max-w-md
              bg-[#081225]
              border
              border-slate-700
              rounded-2xl
              p-6
              shadow-2xl
            "
          >
            {/* CLOSE */}

            <button
              type="button"
              onClick={() =>
                setShowSettings(false)
              }
              className="
                absolute
                right-4
                top-4
                text-slate-400
                hover:text-white
                cursor-pointer
              "
            >
              <X size={20} />
            </button>

            {/* ICON */}

            <div
              className="
                w-11
                h-11
                rounded-xl
                bg-green-500/10
                flex
                items-center
                justify-center
                mb-4
              "
            >
              <Settings
                size={22}
                className="text-green-400"
              />
            </div>

            <h2 className="text-xl font-bold text-white">
              Admin Settings
            </h2>

            <p className="text-sm text-slate-400 mt-2">
              Manage your ExoCart store preferences.
            </p>

            {/* STORE NAME */}

            <div className="mt-6">
              <label className="block text-sm text-slate-300 mb-2">
                Store Name
              </label>

              <input
                type="text"
                value={settings.storeName}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    storeName: e.target.value,
                  })
                }
                className="
                  w-full
                  bg-[#020817]
                  border
                  border-slate-700
                  rounded-xl
                  px-4
                  py-2.5
                  text-white
                  outline-none
                  focus:border-green-400
                "
              />
            </div>

            {/* DELIVERY FEE */}

            <div className="mt-4">
              <label className="block text-sm text-slate-300 mb-2">
                Delivery Fee
              </label>

              <div className="relative">
                <span
                  className="
                    absolute
                    left-4
                    top-2.5
                    text-slate-500
                  "
                >
                  ₹
                </span>

                <input
                  type="number"
                  min="0"
                  value={settings.deliveryFee}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      deliveryFee:
                        e.target.value,
                    })
                  }
                  className="
                    w-full
                    bg-[#020817]
                    border
                    border-slate-700
                    rounded-xl
                    px-4
                    py-2.5
                    pl-8
                    text-white
                    outline-none
                    focus:border-green-400
                  "
                />
              </div>
            </div>

            {/* MINIMUM ORDER */}

            <div className="mt-4">
              <label className="block text-sm text-slate-300 mb-2">
                Minimum Order Amount
              </label>

              <div className="relative">
                <span
                  className="
                    absolute
                    left-4
                    top-2.5
                    text-slate-500
                  "
                >
                  ₹
                </span>

                <input
                  type="number"
                  min="0"
                  value={settings.minimumOrder}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      minimumOrder:
                        e.target.value,
                    })
                  }
                  className="
                    w-full
                    bg-[#020817]
                    border
                    border-slate-700
                    rounded-xl
                    px-4
                    py-2.5
                    pl-8
                    text-white
                    outline-none
                    focus:border-green-400
                  "
                />
              </div>
            </div>

            {/* NOTIFICATIONS TOGGLE */}

            <div
              className="
                mt-5
                flex
                items-center
                justify-between
                p-4
                rounded-xl
                bg-[#020817]
                border
                border-slate-700
              "
            >
              <div>
                <p className="text-sm font-medium text-white">
                  Notifications
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  Receive admin notifications
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setNotificationsEnabled(
                    !notificationsEnabled
                  )
                }
                className={
                  notificationsEnabled
                    ? "relative w-11 h-6 rounded-full bg-green-500 transition cursor-pointer"
                    : "relative w-11 h-6 rounded-full bg-slate-700 transition cursor-pointer"
                }
              >
                <span
                  className={
                    notificationsEnabled
                      ? "absolute top-1 left-6 w-4 h-4 bg-white rounded-full transition"
                      : "absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition"
                  }
                />
              </button>
            </div>

            {/* BUTTONS */}

            <div className="flex gap-3 mt-6">

              <button
                type="button"
                onClick={() =>
                  setShowSettings(false)
                }
                className="
                  flex-1
                  bg-slate-700
                  hover:bg-slate-600
                  text-white
                  py-2.5
                  rounded-xl
                  font-medium
                  transition
                  cursor-pointer
                "
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveSettings}
                className="
                  flex-1
                  bg-green-500
                  hover:bg-green-400
                  text-black
                  py-2.5
                  rounded-xl
                  font-semibold
                  transition
                  cursor-pointer
                  flex
                  items-center
                  justify-center
                  gap-2
                "
              >
                <Save size={17} />
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TopNavbar;