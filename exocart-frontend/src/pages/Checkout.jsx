import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Lock,
  MapPin,
  Smartphone,
  Wallet,
} from "lucide-react";

import { useCart } from "../context/CartContext";

function Checkout() {
  const navigate = useNavigate();

  const {
    cartItems,
    cartTotal,
    clearCart,
  } = useCart();

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState("");

  // --------------------------------
  // PLACED ORDER SUMMARY
  // --------------------------------

  const [placedOrderSummary, setPlacedOrderSummary] = useState({
    subtotal: 0,
    deliveryFee: 0,
    finalTotal: 0,
  });

  // --------------------------------
  // STORE SETTINGS
  // --------------------------------

  const [storeSettings, setStoreSettings] = useState({
    deliveryFee: 40,
    minimumOrder: 199,
  });

  // --------------------------------
  // ADDRESS
  // --------------------------------

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  // --------------------------------
  // CARD
  // --------------------------------

  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const [upiId, setUpiId] = useState("");

  // --------------------------------
  // LOAD ADMIN SETTINGS
  // --------------------------------

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

  // --------------------------------
  // TOTAL ITEMS
  // --------------------------------

  const totalItems = cartItems.reduce(
    (total, item) =>
      total + Number(item.quantity || 0),
    0
  );

  // --------------------------------
  // ORDER CALCULATION
  // --------------------------------

  const subtotal = Number(cartTotal) || 0;

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

  // --------------------------------
  // ADDRESS VALIDATION
  // --------------------------------

  const isAddressComplete =
    address.name.trim() &&
    address.phone.trim() &&
    address.address.trim() &&
    address.city.trim() &&
    address.pincode.trim();

  // --------------------------------
  // PAYMENT VALIDATION
  // --------------------------------

  const isPaymentComplete =
    paymentMethod === "cod"
      ? true
      : paymentMethod === "upi"
      ? upiId.trim() !== ""
      : cardDetails.cardNumber.trim() !== "" &&
        cardDetails.expiry.trim() !== "" &&
        cardDetails.cvv.trim() !== "";

  // --------------------------------
  // PLACE ORDER
  // --------------------------------

  const handlePlaceOrder = async () => {
    setOrderError("");

    // Minimum order validation
    if (!minimumOrderReached) {
      toast.error(
        `Minimum order amount is ₹${minimumOrder.toFixed(
          2
        )}. Add ₹${amountRemaining.toFixed(2)} more.`
      );
      return;
    }

    // Address validation
    if (!isAddressComplete) {
      toast.error(
        "Please enter your complete delivery address."
      );
      return;
    }

    // Payment validation
    if (!isPaymentComplete) {
      toast.error(
        "Please enter your payment details."
      );
      return;
    }

    if (isPlacingOrder) {
      return;
    }

    setIsPlacingOrder(true);

    try {
      // --------------------------------
      // PAYMENT METHOD
      // --------------------------------

      const backendPaymentMethod =
        paymentMethod === "cod"
          ? "COD"
          : paymentMethod === "upi"
          ? "UPI"
          : "CARD";

      // --------------------------------
      // ORDER DATA
      // --------------------------------

      const orderData = {
        customerName: address.name,
        phoneNumber: address.phone,
        deliveryAddress: address.address,
        city: address.city,
        pincode: address.pincode,

        totalAmount: finalTotal,

        paymentMethod: backendPaymentMethod,

        items: cartItems.map((item) => ({
          productId: Number(item.id),
          productName: item.name,
          price: Number(item.price),
          quantity: Number(item.quantity),
        })),
      };

      // --------------------------------
      // TOKEN
      // --------------------------------

      const token =
        localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      // --------------------------------
      // SEND ORDER
      // --------------------------------

      const response = await fetch(
        "http://localhost:8080/api/orders",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(orderData),
        }
      );

      // --------------------------------
      // SESSION EXPIRED
      // --------------------------------

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

      // --------------------------------
      // ORDER ERROR
      // --------------------------------

      if (!response.ok) {
        throw new Error(
          "Unable to place order. Please try again."
        );
      }

      const data =
        await response.json();

      // --------------------------------
      // SAVE ORDER ID
      // --------------------------------

      setOrderId(data.orderId);

      // --------------------------------
      // SAVE ORDER AMOUNTS
      // IMPORTANT:
      // DO THIS BEFORE clearCart()
      // --------------------------------

      setPlacedOrderSummary({
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        finalTotal: finalTotal,
      });

      // --------------------------------
      // CLEAR CART
      // --------------------------------

      clearCart();

      // --------------------------------
      // SUCCESS
      // --------------------------------

      setOrderPlaced(true);

    } catch (error) {
      console.error(
        "Order placement error:",
        error
      );

      setOrderError(
        "Unable to place your order. Please make sure the backend is running and try again."
      );
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // --------------------------------
  // SUCCESS SCREEN
  // --------------------------------

 // --------------------------------
 // SUCCESS SCREEN
 // --------------------------------

 if (orderPlaced) {
   return (
     <div className="flex min-h-screen items-center justify-center bg-[#020817] px-4 text-white">

       <div className="w-full max-w-md">

         <div className="rounded-2xl border border-slate-800 bg-[#0B1224] p-6 text-center shadow-2xl">

           {/* SUCCESS ICON */}

           <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-green-500/20 bg-green-500/10">

             <CheckCircle2
               size={34}
               className="text-green-400"
             />

           </div>

           {/* TITLE */}

           <h1 className="text-2xl font-bold text-white">
             Order Placed!
           </h1>

           <p className="mt-2 text-sm text-slate-400">
             Your order has been placed successfully.
           </p>

           {/* ORDER DETAILS */}

           <div className="mt-5 rounded-xl border border-slate-800 bg-[#07101F] p-4 text-left">

             {/* ORDER ID */}

             <div className="flex items-center justify-between border-b border-slate-800 pb-3">

               <span className="text-xs text-slate-400">
                 Order ID
               </span>

               <span className="text-sm font-semibold text-green-400">
                 #{orderId}
               </span>

             </div>

             {/* PAYMENT */}

             <div className="flex items-center justify-between pt-3">

               <span className="text-xs text-slate-400">
                 Payment
               </span>

               <span className="text-sm font-semibold text-white">
                 {paymentMethod === "cod"
                   ? "Cash on Delivery"
                   : paymentMethod === "upi"
                   ? "UPI"
                   : "Card"}
               </span>

             </div>

             {/* SUBTOTAL */}

             <div className="flex items-center justify-between pt-3">

               <span className="text-xs text-slate-400">
                 Subtotal
               </span>

               <span className="text-sm font-semibold text-white">
                 ₹{placedOrderSummary.subtotal.toFixed(2)}
               </span>

             </div>

             {/* DELIVERY */}

             <div className="flex items-center justify-between pt-3">

               <span className="text-xs text-slate-400">
                 Delivery
               </span>

               <span className="text-sm font-semibold text-white">
                 ₹{placedOrderSummary.deliveryFee.toFixed(2)}
               </span>

             </div>

             {/* TOTAL */}

             <div className="mt-3 flex items-center justify-between border-t border-slate-800 pt-3">

               <span className="text-xs text-slate-400">
                 Amount
               </span>

               <span className="text-base font-bold text-green-400">
                 ₹{placedOrderSummary.finalTotal.toFixed(2)}
               </span>

             </div>

           </div>

           {/* CONTINUE SHOPPING */}

           <button
             type="button"
             onClick={() => navigate("/products")}
             className="mt-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-green-500 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-green-400"
           >
             Continue Shopping
             <ArrowRight size={16} />
           </button>

         </div>

       </div>

     </div>
   );
 }

  // --------------------------------
  // EMPTY CART
  // --------------------------------

  if (
    !cartItems ||
    cartItems.length === 0
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020817] px-4 text-white">

        <div className="text-center">

          <h1 className="text-2xl font-bold">
            Your cart is empty
          </h1>

          <p className="mt-2 text-slate-400">
            Add some products before checking out.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/products")
            }
            className="mt-6 cursor-pointer rounded-xl bg-green-500 px-6 py-3 font-semibold text-slate-950 hover:bg-green-400"
          >
            Browse Products
          </button>

        </div>

      </div>
    );
  }

  // --------------------------------
  // CHECKOUT PAGE
  // --------------------------------

  return (
    <div className="min-h-screen bg-[#020817] text-white">

      {/* HEADER */}

      <header className="border-b border-slate-800 bg-[#041126]">

        <div className="mx-auto flex max-w-7xl items-center px-6 py-4">

          <button
            type="button"
            onClick={() => navigate("/cart")}
            className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-300 transition hover:text-green-400"
          >
            <ArrowLeft size={18} />
            Back to Cart
          </button>

          <div className="mx-auto flex items-center gap-2">

            <div className="h-2 w-2 rounded-full bg-green-400" />

            <span className="font-bold text-white">
              Secure Checkout
            </span>

          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">

            <Lock
              size={14}
              className="text-green-400"
            />

            Secure

          </div>

        </div>

      </header>

      {/* MAIN */}

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        <div className="mb-8">

          <h1 className="text-3xl font-bold">
            Checkout
          </h1>

          <p className="mt-2 text-slate-400">
            Complete your details to place your order.
          </p>

        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">

          {/* LEFT */}

          <div className="space-y-5">

            {/* DELIVERY ADDRESS */}

            <section className="rounded-2xl border border-slate-800 bg-[#0B1224] p-6">

              <div className="mb-6 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10">

                  <MapPin
                    size={20}
                    className="text-green-400"
                  />

                </div>

                <div>

                  <h2 className="text-lg font-bold">
                    Delivery Address
                  </h2>

                  <p className="text-sm text-slate-400">
                    Where should we deliver your order?
                  </p>

                </div>

              </div>

              <div className="grid gap-4 sm:grid-cols-2">

                <input
                  type="text"
                  placeholder="Full Name"
                  value={address.name}
                  onChange={(e) =>
                    setAddress({
                      ...address,
                      name: e.target.value,
                    })
                  }
                  className="rounded-xl border border-slate-700 bg-[#07101F] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-green-500"
                />

                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={address.phone}
                  onChange={(e) =>
                    setAddress({
                      ...address,
                      phone: e.target.value,
                    })
                  }
                  className="rounded-xl border border-slate-700 bg-[#07101F] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-green-500"
                />

                <textarea
                  placeholder="House No, Street, Area"
                  value={address.address}
                  onChange={(e) =>
                    setAddress({
                      ...address,
                      address: e.target.value,
                    })
                  }
                  rows="3"
                  className="resize-none rounded-xl border border-slate-700 bg-[#07101F] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-green-500 sm:col-span-2"
                />

                <input
                  type="text"
                  placeholder="City"
                  value={address.city}
                  onChange={(e) =>
                    setAddress({
                      ...address,
                      city: e.target.value,
                    })
                  }
                  className="rounded-xl border border-slate-700 bg-[#07101F] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-green-500"
                />

                <input
                  type="text"
                  placeholder="Pincode"
                  value={address.pincode}
                  onChange={(e) =>
                    setAddress({
                      ...address,
                      pincode: e.target.value,
                    })
                  }
                  className="rounded-xl border border-slate-700 bg-[#07101F] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-green-500"
                />

              </div>

            </section>

            {/* PAYMENT */}

            <section className="rounded-2xl border border-slate-800 bg-[#0B1224] p-6">

              <div className="mb-6 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10">

                  <Wallet
                    size={20}
                    className="text-green-400"
                  />

                </div>

                <div>

                  <h2 className="text-lg font-bold">
                    Payment Method
                  </h2>

                  <p className="text-sm text-slate-400">
                    Choose how you want to pay.
                  </p>

                </div>

              </div>

              {/* PAYMENT OPTIONS */}

              <div className="grid gap-3 sm:grid-cols-3">

                {/* COD */}

                <button
                  type="button"
                  onClick={() =>
                    setPaymentMethod("cod")
                  }
                  className={`cursor-pointer rounded-xl border p-4 text-left transition ${
                    paymentMethod === "cod"
                      ? "border-green-500 bg-green-500/10"
                      : "border-slate-700 bg-[#07101F] hover:border-slate-600"
                  }`}
                >

                  <Wallet
                    size={22}
                    className={
                      paymentMethod === "cod"
                        ? "text-green-400"
                        : "text-slate-400"
                    }
                  />

                  <p className="mt-3 font-semibold">
                    Cash on Delivery
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Pay when your order arrives
                  </p>

                </button>

                {/* UPI */}

                <button
                  type="button"
                  onClick={() =>
                    setPaymentMethod("upi")
                  }
                  className={`cursor-pointer rounded-xl border p-4 text-left transition ${
                    paymentMethod === "upi"
                      ? "border-green-500 bg-green-500/10"
                      : "border-slate-700 bg-[#07101F] hover:border-slate-600"
                  }`}
                >

                  <Smartphone
                    size={22}
                    className={
                      paymentMethod === "upi"
                        ? "text-green-400"
                        : "text-slate-400"
                    }
                  />

                  <p className="mt-3 font-semibold">
                    UPI
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Pay securely using UPI
                  </p>

                </button>

                {/* CARD */}

                <button
                  type="button"
                  onClick={() =>
                    setPaymentMethod("card")
                  }
                  className={`cursor-pointer rounded-xl border p-4 text-left transition ${
                    paymentMethod === "card"
                      ? "border-green-500 bg-green-500/10"
                      : "border-slate-700 bg-[#07101F] hover:border-slate-600"
                  }`}
                >

                  <CreditCard
                    size={22}
                    className={
                      paymentMethod === "card"
                        ? "text-green-400"
                        : "text-slate-400"
                    }
                  />

                  <p className="mt-3 font-semibold">
                    Card
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Credit or debit card
                  </p>

                </button>

              </div>

              {/* UPI */}

              {paymentMethod === "upi" && (
                <div className="mt-5">

                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    UPI ID
                  </label>

                  <input
                    type="text"
                    placeholder="example@upi"
                    value={upiId}
                    onChange={(e) =>
                      setUpiId(e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-700 bg-[#07101F] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-green-500"
                  />

                </div>
              )}

              {/* CARD */}

              {paymentMethod === "card" && (
                <div className="mt-5 space-y-4">

                  <div>

                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Card Number
                    </label>

                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardDetails.cardNumber}
                      onChange={(e) =>
                        setCardDetails({
                          ...cardDetails,
                          cardNumber:
                            e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-700 bg-[#07101F] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-green-500"
                    />

                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">

                    <div>

                      <label className="mb-2 block text-sm font-medium text-slate-300">
                        Expiry Date
                      </label>

                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardDetails.expiry}
                        onChange={(e) =>
                          setCardDetails({
                            ...cardDetails,
                            expiry:
                              e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-slate-700 bg-[#07101F] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-green-500"
                      />

                    </div>

                    <div>

                      <label className="mb-2 block text-sm font-medium text-slate-300">
                        CVV
                      </label>

                      <input
                        type="password"
                        placeholder="•••"
                        value={cardDetails.cvv}
                        onChange={(e) =>
                          setCardDetails({
                            ...cardDetails,
                            cvv: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-slate-700 bg-[#07101F] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-green-500"
                      />

                    </div>

                  </div>

                </div>
              )}

            </section>

          </div>

          {/* RIGHT SUMMARY */}

          <aside className="h-fit rounded-2xl border border-slate-800 bg-[#0B1224] p-6 lg:sticky lg:top-24">

            <h2 className="text-xl font-bold">
              Order Summary
            </h2>

            <div className="mt-5 max-h-[300px] space-y-4 overflow-y-auto pr-1">

              {cartItems.map((item) => (

                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3"
                >

                  <div className="flex min-w-0 items-center gap-3">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-800 bg-[#07101F]">

                      {item.image ||
                      item.imageUrl ? (

                        <img
                          src={
                            item.image ||
                            item.imageUrl
                          }
                          alt={item.name}
                          className="h-full w-full object-contain"
                        />

                      ) : (

                        <div className="text-xs text-slate-500">
                          No Image
                        </div>

                      )}

                    </div>

                    <div className="min-w-0">

                      <p className="truncate text-sm font-medium text-white">
                        {item.name}
                      </p>

                      <p className="text-xs text-slate-500">
                        Qty: {item.quantity}
                      </p>

                    </div>

                  </div>

                  <p className="shrink-0 text-sm font-semibold">
                    ₹
                    {(
                      Number(item.price) *
                      Number(item.quantity)
                    ).toFixed(2)}
                  </p>

                </div>

              ))}

            </div>

            <div className="my-5 border-t border-slate-800" />

            {/* SUBTOTAL */}

            <div className="space-y-3 text-sm">

              <div className="flex justify-between text-slate-400">

                <span>
                  Items ({totalItems})
                </span>

                <span>
                  ₹{subtotal.toFixed(2)}
                </span>

              </div>

              {/* DELIVERY */}

              <div className="flex justify-between text-slate-400">

                <span>
                  Delivery Fee
                </span>

                <span
                  className={
                    minimumOrderReached
                      ? "font-medium text-green-400"
                      : "text-slate-500"
                  }
                >
                  {minimumOrderReached
                    ? `₹${deliveryFee.toFixed(2)}`
                    : "—"}
                </span>

              </div>

            </div>

            {/* MINIMUM ORDER WARNING */}

            {!minimumOrderReached && (

              <div className="mt-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-3">

                <p className="text-xs font-semibold text-yellow-400">
                  Minimum order: ₹
                  {minimumOrder.toFixed(2)}
                </p>

                <p className="mt-1 text-[11px] leading-5 text-slate-400">
                  Add ₹
                  {amountRemaining.toFixed(2)}
                  {" "}
                  more to place your order.
                </p>

              </div>

            )}

            {/* MINIMUM REACHED */}

            {minimumOrderReached && (

              <div className="mt-4 rounded-xl border border-green-500/20 bg-green-500/5 p-3">

                <p className="text-xs font-semibold text-green-400">
                  Minimum order reached
                </p>

                <p className="mt-1 text-[11px] text-slate-500">
                  Delivery fee of ₹
                  {deliveryFee.toFixed(2)}
                  {" "}
                  has been applied.
                </p>

              </div>

            )}

            <div className="my-5 border-t border-slate-800" />

            {/* TOTAL */}

            <div className="flex items-center justify-between">

              <span className="text-lg font-bold">
                Total
              </span>

              <span className="text-2xl font-black text-green-400">
                ₹{finalTotal.toFixed(2)}
              </span>

            </div>

            {/* ERROR */}

            {orderError && (

              <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {orderError}
              </div>

            )}

            {/* PLACE ORDER */}

            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={
                isPlacingOrder ||
                !minimumOrderReached
              }
              className={`group mt-6 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 font-bold transition ${
                isPlacingOrder ||
                !minimumOrderReached
                  ? "cursor-not-allowed bg-slate-700 text-slate-500"
                  : "cursor-pointer bg-green-500 text-slate-950 hover:bg-green-400"
              }`}
            >

              {isPlacingOrder
                ? "Processing..."
                : !minimumOrderReached
                ? "Minimum Order Required"
                : paymentMethod === "cod"
                ? "Place Order"
                : "Pay"}

              {!isPlacingOrder &&
                minimumOrderReached && (
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                )}

            </button>

            {/* SECURE */}

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">

              <Lock size={13} />

              Your payment information is secure

            </div>

          </aside>

        </div>

      </main>

    </div>
  );
}

export default Checkout;