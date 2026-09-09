import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Minus,
  Plus,
  Trash2,
  Receipt,
  Truck,
  Leaf,
  ShieldCheck,
  Lock,
  ArrowRight,
} from "lucide-react";

import { useEffect, useState } from "react";

import { useCart } from "../context/CartContext";
import cartIllustration from "../assets/cart-illustration.png";

function Cart() {
  const navigate = useNavigate();

  const {
    cartItems,
    cartTotal,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  // =====================================================
  // STORE SETTINGS
  // =====================================================

  const [storeSettings, setStoreSettings] = useState({
    deliveryFee: 40,
    minimumOrder: 199,
  });

  // =====================================================
  // LOAD ADMIN SETTINGS
  // =====================================================

  useEffect(() => {
    const loadSettings = () => {
      const savedSettings =
        localStorage.getItem("exocartSettings");

      if (!savedSettings) {
        return;
      }

      try {
        const parsedSettings =
          JSON.parse(savedSettings);

        setStoreSettings({
          deliveryFee:
            Number(parsedSettings.deliveryFee) >= 0
              ? Number(parsedSettings.deliveryFee)
              : 40,

          minimumOrder:
            Number(parsedSettings.minimumOrder) >= 0
              ? Number(parsedSettings.minimumOrder)
              : 199,
        });
      } catch (error) {
        console.error(
          "Failed to load ExoCart settings:",
          error
        );
      }
    };

    loadSettings();

    window.addEventListener(
      "storage",
      loadSettings
    );

    return () => {
      window.removeEventListener(
        "storage",
        loadSettings
      );
    };
  }, []);

  // =====================================================
  // CART CALCULATIONS
  // =====================================================

  const totalItems = cartItems.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );

  const subtotal =
    Number(cartTotal) || 0;

  const deliveryFee =
    Number(storeSettings.deliveryFee) || 0;

  const minimumOrder =
    Number(storeSettings.minimumOrder) || 0;

  const minimumOrderReached =
    subtotal >= minimumOrder;

  const amountRemaining =
    Math.max(
      minimumOrder - subtotal,
      0
    );

  const finalTotal =
    minimumOrderReached
      ? subtotal + deliveryFee
      : subtotal;

  // =====================================================
  // CHECKOUT
  // =====================================================

  const handleCheckout = () => {
    if (!minimumOrderReached) {
      return;
    }

    navigate("/checkout");
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#020817] text-white">

      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="relative h-[250px]">

          {/* LEFT HEADER */}

          <div className="relative z-20 pt-8">

            <button
              type="button"
              onClick={() =>
                navigate("/products")
              }
              className="
                mb-6
                flex
                h-10
                cursor-pointer
                items-center
                gap-2
                rounded-xl
                border
                border-green-500/60
                bg-[#071426]
                px-4
                text-sm
                font-semibold
                text-white
                transition-all
                duration-300
                hover:bg-green-500
                hover:text-slate-950
              "
            >
              <ArrowLeft size={17} />
              Continue Shopping
            </button>

            <h1 className="
              text-4xl
              font-black
              leading-none
              tracking-tight
            ">
              Your{" "}
              <span className="text-green-400">
                Cart
              </span>
            </h1>

            <p className="
              mt-3
              text-sm
              text-slate-400
            ">
              Review your items and proceed to checkout
            </p>

          </div>

          {/* CART ILLUSTRATION */}

          <div className="
            pointer-events-none
            absolute
            right-[-40px]
            top-[0px]
            z-0
            hidden
            h-[250px]
            w-[390px]
            lg:block
          ">

            <img
              src={cartIllustration}
              alt="Shopping cart"
              className="
                h-full
                w-full
                object-contain
                object-right-top
                mix-blend-screen
              "
            />

          </div>

        </div>

        {/* =====================================================
            EMPTY CART
        ===================================================== */}

        {cartItems.length === 0 ? (

          <div className="
            flex
            min-h-[350px]
            flex-col
            items-center
            justify-center
            rounded-2xl
            border
            border-slate-800
            bg-[#071426]
            text-center
          ">

            <div className="
              mb-4
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-full
              bg-green-500/10
              text-green-400
            ">
              <Truck size={30} />
            </div>

            <h2 className="text-xl font-bold">
              Your cart is empty
            </h2>

            <p className="
              mt-2
              text-sm
              text-slate-500
            ">
              Add some fresh groceries to get started.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/products")
              }
              className="
                mt-5
                flex
                cursor-pointer
                items-center
                gap-2
                rounded-xl
                bg-green-500
                px-5
                py-2.5
                text-sm
                font-semibold
                text-slate-950
                transition
                hover:bg-green-400
              "
            >
              Start Shopping
              <ArrowRight size={16} />
            </button>

          </div>

        ) : (

          <>

            {/* =====================================================
                MAIN CONTENT
            ===================================================== */}

            <div className="
              grid
              gap-6
              lg:grid-cols-[1fr_350px]
            ">

              {/* =================================================
                  CART ITEMS
              ================================================= */}

              <div className="space-y-3">

                {cartItems.map((item) => (

                  <div
                    key={item.id}
                    className="
                      group
                      flex
                      min-h-[150px]
                      items-center
                      gap-4
                      rounded-2xl
                      border
                      border-slate-800
                      bg-[#071426]
                      p-4
                      transition-all
                      duration-300
                      hover:border-green-500/40
                    "
                  >

                    {/* IMAGE */}

                    <div className="
                      flex
                      h-24
                      w-24
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-[#0b1727]
                    ">

                      {item.image ||
                      item.imageUrl ? (

                        <img
                          src={
                            item.image ||
                            item.imageUrl
                          }
                          alt={item.name}
                          className="
                            h-20
                            w-20
                            object-contain
                            transition-transform
                            duration-300
                            group-hover:scale-105
                          "
                        />

                      ) : (

                        <div className="
                          h-16
                          w-16
                          rounded-full
                          bg-slate-800
                        " />

                      )}

                    </div>

                    {/* DETAILS */}

                    <div className="
                      min-w-0
                      flex-1
                    ">

                      <p className="
                        text-[9px]
                        font-semibold
                        uppercase
                        tracking-[0.3em]
                        text-green-400
                      ">
                        {item.category}
                      </p>

                      <h2 className="
                        mt-1
                        text-base
                        font-bold
                        text-white
                      ">
                        {item.name}
                      </h2>

                      <p className="
                        mt-1
                        text-xs
                        text-slate-400
                      ">
                        {item.unit}
                      </p>

                      <p className="
                        mt-2
                        text-base
                        font-bold
                        text-white
                      ">
                        ₹{item.price}
                      </p>

                      <span className="
                        mt-2
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-full
                        bg-green-500/10
                        px-2.5
                        py-1
                        text-[10px]
                        font-semibold
                        text-green-400
                      ">
                        <span className="
                          h-1.5
                          w-1.5
                          rounded-full
                          bg-green-400
                        " />

                        In stock
                      </span>

                    </div>

                    {/* CONTROLS */}

                    <div className="
                      flex
                      shrink-0
                      flex-col
                      items-end
                      gap-3
                    ">

                      {/* QUANTITY */}

                      <div className="
                        flex
                        h-9
                        items-center
                        rounded-lg
                        border
                        border-green-500/60
                        bg-[#0b1727]
                        px-0.5
                      ">

                        <button
                          type="button"
                          onClick={() =>
                            decreaseQuantity(
                              item.id
                            )
                          }
                          className="
                            flex
                            h-8
                            w-8
                            cursor-pointer
                            items-center
                            justify-center
                            rounded-md
                            text-slate-300
                            transition
                            hover:bg-green-500/10
                            hover:text-green-400
                          "
                        >
                          <Minus size={14} />
                        </button>

                        <span className="
                          flex
                          min-w-8
                          justify-center
                          text-sm
                          font-bold
                          text-white
                        ">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            increaseQuantity(
                              item.id
                            )
                          }
                          disabled={
                            item.quantity >=
                            Number(item.stock)
                          }
                          className="
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            rounded-md
                            text-green-400
                            transition
                            hover:bg-green-500/10
                            disabled:cursor-not-allowed
                            disabled:text-slate-600
                          "
                        >
                          <Plus size={14} />
                        </button>

                      </div>

                      {/* REMOVE */}

                      <button
                        type="button"
                        onClick={() =>
                          removeFromCart(
                            item.id
                          )
                        }
                        className="
                          flex
                          cursor-pointer
                          items-center
                          gap-1.5
                          text-xs
                          font-semibold
                          text-red-400
                          transition
                          hover:text-red-300
                        "
                      >
                        <Trash2 size={14} />
                        Remove
                      </button>

                    </div>

                  </div>

                ))}

              </div>

              {/* =================================================
                  ORDER SUMMARY
              ================================================= */}

              <div className="
                h-fit
                rounded-2xl
                border
                border-green-500/40
                bg-[#071426]
                p-5
                shadow-lg
                shadow-black/20
              ">

                {/* SUMMARY HEADER */}

                <div className="
                  flex
                  items-center
                  gap-3
                ">

                  <div className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-lg
                    bg-green-500/10
                    text-green-400
                  ">
                    <Receipt size={19} />
                  </div>

                  <div>

                    <h2 className="text-lg font-bold">
                      Order Summary
                    </h2>

                    <p className="
                      text-xs
                      text-slate-500
                    ">
                      Your order details
                    </p>

                  </div>

                </div>

                <div className="
                  my-5
                  border-t
                  border-slate-800
                " />

                {/* SUBTOTAL */}

                <div className="
                  flex
                  items-center
                  justify-between
                  text-sm
                ">

                  <span className="text-slate-400">
                    Subtotal ({totalItems} items)
                  </span>

                  <span className="
                    font-semibold
                    text-white
                  ">
                    ₹{subtotal.toFixed(2)}
                  </span>

                </div>

                {/* DELIVERY */}

                <div className="
                  mt-3
                  flex
                  items-center
                  justify-between
                  text-sm
                ">

                  <span className="text-slate-400">
                    Delivery
                  </span>

                  {minimumOrderReached ? (

                    <span className="
                      font-semibold
                      text-green-400
                    ">
                      ₹{deliveryFee.toFixed(2)}
                    </span>

                  ) : (

                    <span className="
                      font-semibold
                      text-slate-500
                    ">
                      —
                    </span>

                  )}

                </div>

                {/* MINIMUM ORDER MESSAGE */}

                {!minimumOrderReached && (

                  <div className="
                    mt-4
                    rounded-xl
                    border
                    border-yellow-500/20
                    bg-yellow-500/5
                    p-3
                  ">

                    <p className="
                      text-xs
                      font-semibold
                      text-yellow-400
                    ">
                      Minimum order: ₹
                      {minimumOrder.toFixed(2)}
                    </p>

                    <p className="
                      mt-1
                      text-[11px]
                      leading-5
                      text-slate-400
                    ">
                      Add ₹
                      {amountRemaining.toFixed(2)}
                      {" "}
                      more to place your order.
                    </p>

                  </div>

                )}

                {/* MINIMUM ORDER REACHED */}

                {minimumOrderReached && (

                  <div className="
                    mt-4
                    rounded-xl
                    border
                    border-green-500/20
                    bg-green-500/5
                    p-3
                  ">

                    <p className="
                      text-xs
                      font-semibold
                      text-green-400
                    ">
                      Minimum order reached
                    </p>

                    <p className="
                      mt-1
                      text-[11px]
                      text-slate-500
                    ">
                      Delivery fee of ₹
                      {deliveryFee.toFixed(2)}
                      {" "}
                      has been applied.
                    </p>

                  </div>

                )}

                <div className="
                  my-5
                  border-t
                  border-slate-800
                " />

                {/* TOTAL */}

                <div className="
                  flex
                  items-center
                  justify-between
                ">

                  <span className="
                    text-lg
                    font-bold
                  ">
                    Total
                  </span>

                  <span className="
                    text-xl
                    font-black
                    text-green-400
                  ">
                    ₹{finalTotal.toFixed(2)}
                  </span>

                </div>

                {/* CHECKOUT BUTTON */}

                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={!minimumOrderReached}
                  className="
                    group
                    mt-5
                    flex
                    h-11
                    w-full
                    cursor-pointer
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-green-500
                    bg-green-500
                    text-sm
                    font-bold
                    text-slate-950
                    transition-all
                    duration-300
                    hover:bg-[#071426]
                    hover:text-green-400
                    hover:shadow-lg
                    hover:shadow-green-500/10
                    active:scale-[0.98]
                    disabled:cursor-not-allowed
                    disabled:border-slate-700
                    disabled:bg-slate-700
                    disabled:text-slate-500
                    disabled:hover:bg-slate-700
                    disabled:hover:text-slate-500
                    disabled:hover:shadow-none
                  "
                >

                  <Lock size={15} />

                  <span>
                    {minimumOrderReached
                      ? "Proceed to Checkout"
                      : "Minimum Order Required"}
                  </span>

                  <ArrowRight
                    size={16}
                    className="
                      transition-transform
                      duration-300
                      group-hover:translate-x-1
                    "
                  />

                </button>

                {/* DELIVERY INFO */}

                <div className="
                  mt-4
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  border
                  border-slate-800
                  bg-[#0b1727]
                  p-3
                ">

                  <div className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    bg-green-500/10
                    text-green-400
                  ">
                    <Truck size={18} />
                  </div>

                  <div>

                    <p className="
                      text-sm
                      font-semibold
                    ">
                      Delivery Fee
                    </p>

                    <p className="
                      text-[11px]
                      text-slate-500
                    ">
                      ₹{deliveryFee.toFixed(2)}
                      {" "}
                      on orders above ₹
                      {minimumOrder.toFixed(2)}
                    </p>

                  </div>

                </div>

              </div>

            </div>

            {/* =====================================================
                BENEFITS
            ===================================================== */}

            <div className="
              mt-7
              grid
              gap-4
              border-t
              border-slate-800
              pt-6
              md:grid-cols-3
            ">

              {/* FRESH PRODUCTS */}

              <div className="
                flex
                items-center
                gap-3
              ">

                <div className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  bg-green-500/10
                  text-green-400
                ">
                  <Leaf size={20} />
                </div>

                <div>

                  <p className="
                    text-sm
                    font-semibold
                  ">
                    Fresh Products
                  </p>

                  <p className="
                    text-xs
                    text-slate-500
                  ">
                    Quality guaranteed
                  </p>

                </div>

              </div>

              {/* FAST DELIVERY */}

              <div className="
                flex
                items-center
                gap-3
              ">

                <div className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  bg-green-500/10
                  text-green-400
                ">
                  <Truck size={20} />
                </div>

                <div>

                  <p className="
                    text-sm
                    font-semibold
                  ">
                    Fast Delivery
                  </p>

                  <p className="
                    text-xs
                    text-slate-500
                  ">
                    At your doorstep
                  </p>

                </div>

              </div>

              {/* SECURE PAYMENT */}

              <div className="
                flex
                items-center
                gap-3
              ">

                <div className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  bg-green-500/10
                  text-green-400
                ">
                  <ShieldCheck size={20} />
                </div>

                <div>

                  <p className="
                    text-sm
                    font-semibold
                  ">
                    Secure Payments
                  </p>

                  <p className="
                    text-xs
                    text-slate-500
                  ">
                    Safe and hassle-free
                  </p>

                </div>

              </div>

            </div>

            {/* =====================================================
                BOTTOM MESSAGE
            ===================================================== */}

            <div className="
              flex
              justify-end
              pb-6
              pt-4
            ">

              <p className="
                text-right
                text-sm
                italic
                text-slate-500
              ">
                Good Food,
                <br />

                <span className="text-green-400">
                  Happier You!
                </span>
              </p>

            </div>

          </>

        )}

      </div>

    </div>
  );
}

export default Cart;