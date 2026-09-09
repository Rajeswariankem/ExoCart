import { AiFillHeart } from "react-icons/ai";
import {
  FiHeart,
  FiShoppingCart,
  FiStar,
  FiPlus,
  FiMinus,
} from "react-icons/fi";

import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

function ProductCard({ product = {} }) {
  const {
    name = "Product",
    category = "Grocery",
    price = 0,
    rating = 4.5,
    image,
    imageUrl,
    unit = "per pack",
    stock = 0,
  } = product;

  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  } = useWishlist();

  const {
    cartItems,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  const productImage = image || imageUrl;

  const isWishlisted = isInWishlist(product.id);

  const stockText =
    Number(stock) > 0 ? "In stock" : "Out of stock";

  const isOutOfStock = Number(stock) <= 0;

  const cartItem = cartItems.find(
    (item) => item.id === product.id
  );

  const quantity = cartItem ? cartItem.quantity : 0;

  const handleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleAddToCart = () => {
    if (!isOutOfStock) {
      addToCart(product);
    }
  };

  const handleIncrease = () => {
    if (quantity < Number(stock)) {
      increaseQuantity(product.id);
    }
  };

  const handleDecrease = () => {
    decreaseQuantity(product.id);
  };

  return (
    <article className="group relative flex h-90 w-full flex-col overflow-hidden rounded-2xl border border-[#1e293b] bg-[#071426] p-4 shadow-[0_14px_30px_rgba(0,0,0,0.17)] transition-all duration-300 hover:-translate-y-1 hover:border-green-500/75 hover:shadow-lg">

      {/* STOCK */}
      <div
        className={`absolute left-3 top-3 z-10 flex h-6 items-center rounded-full px-3 text-[10px] font-semibold uppercase tracking-[0.28em] ring-1 ${
          isOutOfStock
            ? "bg-red-500/10 text-red-400 ring-red-400/30"
            : "bg-[#0f172a] text-green-400 ring-green-400/30"
        }`}
      >
        {stockText}
      </div>

      {/* WISHLIST */}
      <button
        type="button"
        aria-label={
          isWishlisted
            ? "Remove from wishlist"
            : "Add to wishlist"
        }
        onClick={handleWishlist}
        className={`absolute right-3 top-3 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border bg-[#0f172a]/90 transition-all duration-300 ${
          isWishlisted
            ? "border-pink-500/80 bg-pink-500/10 text-pink-400"
            : "border-slate-700/80 text-slate-400 hover:border-pink-500/60 hover:text-pink-400"
        }`}
      >
        {isWishlisted ? (
          <AiFillHeart className="h-4 w-4 text-pink-400" />
        ) : (
          <FiHeart className="h-3.5 w-3.5" />
        )}
      </button>

      {/* PRODUCT IMAGE */}
      <div className="mt-4 mb-3 flex h-32.5 w-full items-center justify-center overflow-hidden rounded-xl bg-[#0b1220] pt-4.5 shadow-inner shadow-black/10">

        {productImage ? (
          <img
            src={productImage}
            alt={name}
            className="h-auto max-h-28 max-w-32.5 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="h-24 w-24 rounded-full bg-slate-800" />
        )}

      </div>

      {/* DETAILS */}
      <div className="flex flex-1 flex-col gap-0">

        {/* CATEGORY */}
        <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-green-400">
          {category}
        </p>

        {/* NAME */}
        <h3
          className="mt-1 mb-1 overflow-hidden text-base font-semibold leading-tight text-white"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {name}
        </h3>

        {/* RATING */}
        <div className="flex items-center gap-2 text-[14px] text-amber-400">
          <FiStar className="h-3.5 w-3.5 fill-current" />

          <span className="font-semibold text-slate-200">
            {rating}
          </span>
        </div>

        {/* PRICE */}
        <div className="mt-1 flex items-center justify-between gap-3">

          <div>

            <p className="text-base font-bold text-white">
              ₹{price}
            </p>

            <p className="mt-0.5 mb-2 text-xs text-slate-400">
              {unit}
            </p>

          </div>

        </div>

        {/* ADD TO CART / QUANTITY */}
        {quantity === 0 ? (

          <button
            type="button"
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            className={`mt-auto flex h-10 w-full items-center justify-center gap-2 rounded-xl border px-3 text-[15px] font-semibold transition-all duration-300 ${
              isOutOfStock
                ? "cursor-not-allowed border-slate-700 bg-slate-800 text-slate-500"
                : "cursor-pointer border-transparent bg-green-500 text-slate-950 hover:border-green-500 hover:bg-[#122d1a] hover:text-green-300"
            }`}
          >
            <FiShoppingCart className="h-4 w-4" />

            {isOutOfStock
              ? "Out of Stock"
              : "Add to Cart"}
          </button>

        ) : (

          <div className="mt-auto flex h-10 w-full items-center justify-between rounded-xl border border-green-500/60 bg-[#0b1727] px-1 shadow-inner shadow-black/20">

            {/* MINUS */}
            <button
              type="button"
              onClick={handleDecrease}
              className="flex h-8 w-9 cursor-pointer items-center justify-center rounded-lg text-slate-300 transition-all duration-200 hover:bg-green-500/15 hover:text-green-400 active:scale-90"
              aria-label="Decrease quantity"
            >
              <FiMinus className="h-4 w-4" />
            </button>

            {/* QUANTITY */}
            <span className="flex min-w-10 items-center justify-center text-[15px] font-bold text-white">
              {quantity}
            </span>

            {/* PLUS */}
            <button
              type="button"
              onClick={handleIncrease}
              disabled={quantity >= Number(stock)}
              className={`flex h-8 w-9 items-center justify-center rounded-lg transition-all duration-200 ${
                quantity >= Number(stock)
                  ? "cursor-not-allowed text-slate-600"
                  : "cursor-pointer text-green-400 hover:bg-green-500/15 hover:text-green-300 active:scale-90"
              }`}
              aria-label="Increase quantity"
            >
              <FiPlus className="h-4 w-4" />
            </button>

          </div>

        )}

      </div>
    </article>
  );
}

export default ProductCard;