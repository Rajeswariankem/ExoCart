import {
  Search,
  ShoppingCart,
  User,
  MapPin,
  X,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import logo from "../../assets/logo.png";

import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

function Navbar() {
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const [address, setAddress] = useState(() => {
    return (
      localStorage.getItem("deliveryAddress") ||
      "Hyderabad 500001"
    );
  });

  const [showAddressBox, setShowAddressBox] =
    useState(false);

  const [addressInput, setAddressInput] =
    useState(address);

  // --------------------------------
  // SEARCH
  // --------------------------------

  const handleSearch = (e) => {
    e.preventDefault();

    const keyword = search.trim();

    if (!keyword) {
      navigate("/products");
      return;
    }

    const normalizedKeyword = keyword.toLowerCase();

    const categoryMap = {
      fruits: "Fruits",
      vegetables: "Vegetables",
      dairy: "Dairy",
      "dairy & milk": "Dairy",
      bakery: "Bakery",
      snacks: "Snacks",
      beverages: "Beverages",
      "rice & atta": "Rice & Atta",
      "masala & oil": "Masala & Oil",
      "masala and oils": "Masala & Oil",
      skincare: "Skincare",
      "personal care": "Skincare",
      household: "Household",
    };

    if (categoryMap[normalizedKeyword]) {
      navigate(
        `/products?category=${encodeURIComponent(
          categoryMap[normalizedKeyword]
        )}`
      );
      return;
    }

    navigate(
      `/products?keyword=${encodeURIComponent(keyword)}`
    );
  };

  // --------------------------------
  // SAVE ADDRESS
  // --------------------------------

  const handleSaveAddress = () => {
    const newAddress = addressInput.trim();

    if (!newAddress) return;

    localStorage.setItem(
      "deliveryAddress",
      newAddress
    );

    setAddress(newAddress);
    setShowAddressBox(false);
  };

  // --------------------------------
  // CLOSE ADDRESS BOX
  // --------------------------------

  const handleCloseAddress = () => {
    setAddressInput(address);
    setShowAddressBox(false);
  };

  // --------------------------------
  // ESCAPE KEY
  // --------------------------------

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowAddressBox(false);
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, []);

  return (
    <>
      <nav
        className="
          sticky top-0 z-50
          bg-[#041126]/90
          backdrop-blur-md
          border-b border-slate-800
        "
      >
        <div className="max-w-7xl mx-auto px-6 py-3">

          <div className="flex items-center justify-between gap-6">

            {/* LEFT */}

            <div className="flex items-center gap-8">

              {/* LOGO */}

              <div
                onClick={() => navigate("/home")}
                className="
                  flex items-center gap-2
                  cursor-pointer
                "
              >
                <img
                  src={logo}
                  alt="ExoCart Logo"
                  className="
                    w-10 h-10 mb-1
                    object-contain
                  "
                />

                <h1
                  className="
                    text-3xl
                    font-black
                    whitespace-nowrap
                    leading-none
                  "
                >
                  <span className="text-white">
                    Exo
                  </span>

                  <span className="text-green-400">
                    Cart
                  </span>
                </h1>
              </div>

              {/* ADDRESS */}

              <div className="relative">

                <div className="flex items-center gap-2">

                  <div className="flex flex-col leading-tight">

                    <div
                      className="
                        flex items-center gap-1
                        text-[11px]
                        text-slate-400
                      "
                    >
                      <MapPin
                        size={12}
                        className="text-green-400"
                      />

                      Deliver to
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setShowAddressBox(true)
                      }
                      className="
                        max-w-[180px]
                        truncate
                        text-left
                        text-sm
                        font-medium
                        text-white
                        hover:text-green-400
                        transition
                        cursor-pointer
                      "
                    >
                      {address}
                    </button>

                  </div>

                </div>

                {/* ADDRESS POPUP */}

                {showAddressBox && (
                  <div
                    className="
                      absolute
                      top-14
                      left-0
                      z-50
                      w-80
                      bg-[#081225]
                      border
                      border-slate-700
                      rounded-2xl
                      shadow-2xl
                      p-4
                    "
                  >

                    {/* Header */}

                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        mb-4
                      "
                    >

                      <div>

                        <h3
                          className="
                            text-white
                            font-semibold
                            text-sm
                          "
                        >
                          Delivery Address
                        </h3>

                        <p
                          className="
                            text-slate-500
                            text-xs
                            mt-1
                          "
                        >
                          Enter your delivery location
                        </p>

                      </div>

                      <button
                        type="button"
                        onClick={handleCloseAddress}
                        className="
                          w-7 h-7
                          rounded-lg
                          flex
                          items-center
                          justify-center
                          text-slate-400
                          hover:text-white
                          hover:bg-slate-800
                          transition
                          cursor-pointer
                        "
                      >
                        <X size={16} />
                      </button>

                    </div>

                    {/* Address Input */}

                    <div className="relative mb-3">

                      <MapPin
                        size={16}
                        className="
                          absolute
                          left-3
                          top-3
                          text-green-400
                        "
                      />

                      <input
                        type="text"
                        value={addressInput}
                        onChange={(e) =>
                          setAddressInput(
                            e.target.value
                          )
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSaveAddress();
                          }
                        }}
                        placeholder="Enter address or pincode"
                        autoFocus
                        className="
                          w-full
                          h-10
                          bg-[#020817]
                          border
                          border-slate-700
                          rounded-xl
                          pl-9
                          pr-3
                          text-sm
                          text-white
                          placeholder:text-slate-500
                          outline-none
                          focus:border-green-500
                          transition
                        "
                      />

                    </div>

                    {/* Save */}

                    <button
                      type="button"
                      onClick={handleSaveAddress}
                      className="
                        w-full
                        h-10
                        rounded-xl
                        border
                        border-transparent
                        bg-green-500
                        text-slate-950
                        text-sm
                        font-semibold
                        cursor-pointer
                        transition-all
                        duration-300
                        hover:border-green-500
                        hover:bg-[#122d1a]
                        hover:text-green-300
                      "
                    >
                      Save Address
                    </button>

                  </div>
                )}

              </div>

            </div>

            {/* SEARCH */}

            <form
              onSubmit={handleSearch}
              className="
                flex-1
                max-w-2xl
              "
            >

              <div
                className="
                  flex items-center gap-3
                  bg-[#081225]
                  border border-slate-700
                  rounded-xl
                  px-4
                  h-12
                  hover:border-green-500/70
                  focus-within:border-green-500
                  transition-all
                "
              >

                <button
                  type="submit"
                  className="cursor-pointer"
                >
                  <Search
                    size={18}
                    className="
                      text-slate-400
                      hover:text-green-400
                      transition
                    "
                  />
                </button>

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="
                    Search groceries, fruits, vegetables...
                  "
                  className="
                    w-full
                    bg-transparent
                    outline-none
                    text-white
                    text-sm
                    placeholder:text-slate-500
                  "
                />

              </div>

            </form>

            {/* RIGHT */}

            <div className="flex items-center gap-3">

              {/* ACCOUNT */}

              <button
                type="button"
                onClick={() =>
                  navigate("/account")
                }
                className="
                  relative
                  h-11
                  w-11
                  bg-[#081225]
                  border
                  border-slate-800
                  rounded-xl
                  flex
                  items-center
                  justify-center
                  hover:border-green-500
                  transition-all
                  cursor-pointer
                "
              >

                <User
                  size={20}
                  className="text-white"
                />

                {wishlistCount > 0 && (
                  <span
                    className="
                      absolute
                      -top-2
                      -right-2
                      h-5
                      min-w-5
                      px-1
                      rounded-full
                      bg-pink-500
                      text-white
                      text-[11px]
                      font-bold
                      flex
                      items-center
                      justify-center
                      border-2
                      border-[#041126]
                    "
                  >
                    {wishlistCount}
                  </span>
                )}

              </button>

              {/* CART */}

              <button
                type="button"
                onClick={() =>
                  navigate("/cart")
                }
                className="
                  relative
                  cursor-pointer
                  p-2.5
                  rounded-xl
                  bg-[#081225]
                  border
                  border-slate-800
                  hover:border-green-500
                  transition-all
                "
              >

                <ShoppingCart
                  size={22}
                  className="text-white"
                />

                {cartCount > 0 && (
                  <span
                    className="
                      absolute
                      -top-2
                      -right-2
                      h-5
                      min-w-5
                      px-1
                      rounded-full
                      bg-green-500
                      text-black
                      text-xs
                      font-bold
                      flex
                      items-center
                      justify-center
                      border-2
                      border-[#041126]
                    "
                  >
                    {cartCount}
                  </span>
                )}

              </button>

            </div>

          </div>

        </div>
      </nav>
    </>
  );
}

export default Navbar;