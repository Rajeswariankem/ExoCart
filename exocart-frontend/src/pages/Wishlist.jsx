import {
  Heart,
  ShoppingCart,
  Trash2,
  ArrowLeft,
  ArrowRight,
  PackageOpen,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

function Wishlist() {
  const navigate = useNavigate();

  const {
    wishlistItems,
    removeFromWishlist,
  } = useWishlist();

  const { addToCart } = useCart();

  // Resolve product image correctly
  const getProductImage = (product) => {
    const imagePath = product.image || product.imageUrl;

    if (!imagePath) {
      return null;
    }

    // If image is already a valid imported/browser URL
    if (
      imagePath.startsWith("http://") ||
      imagePath.startsWith("https://") ||
      imagePath.startsWith("data:")
    ) {
      return imagePath;
    }

    // Get only the filename
    const fileName = imagePath.split("/").pop();

    try {
      return new URL(
        `../assets/products/${fileName}`,
        import.meta.url
      ).href;
    } catch {
      return imagePath;
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product.id);
  };

  return (
    <div className="min-h-screen bg-[#020817] text-white">

      {/* ================= HEADER ================= */}

      <header className="border-b border-slate-800">

        <div className="max-w-6xl mx-auto px-5 py-6">

          <div className="flex items-center justify-between gap-4">

            <div className="flex items-center gap-4">

              <div className="
                w-12 h-12
                rounded-xl
                bg-pink-500/10
                border border-pink-500/20
                flex items-center justify-center
              ">
                <Heart
                  size={25}
                  className="text-pink-400"
                  fill="currentColor"
                />
              </div>

              <div>

                <h1 className="text-2xl md:text-3xl font-bold">
                  My{" "}
                  <span className="text-pink-400">
                    Wishlist
                  </span>
                </h1>

                <p className="text-sm text-slate-400 mt-1">
                  Your favorite products saved in one place
                </p>

              </div>

            </div>

            <button
              onClick={() => navigate("/home")}
              className="
                flex items-center gap-2
                px-4 py-2.5
                rounded-xl
                border border-slate-700
                text-sm font-medium
                text-slate-300
                hover:border-green-500
                hover:text-green-400
                transition-all duration-300
                cursor-pointer
              "
            >
              <ArrowLeft size={17} />
              Back to Home
            </button>

          </div>

        </div>

      </header>

      {/* ================= MAIN ================= */}

      <main className="max-w-6xl mx-auto px-5 py-7">

        {/* ================= EMPTY ================= */}

        {wishlistItems.length === 0 ? (

          <div className="
            min-h-[55vh]
            flex items-center justify-center
          ">

            <div className="text-center">

              <div className="
                w-20 h-20
                rounded-2xl
                bg-[#07101f]
                border border-slate-800
                flex items-center justify-center
                mx-auto mb-5
              ">
                <PackageOpen
                  size={35}
                  className="text-slate-500"
                />
              </div>

              <h2 className="text-xl font-semibold mb-2">
                Your wishlist is empty
              </h2>

              <p className="text-sm text-slate-500 mb-6">
                Save products you love and find them here later.
              </p>

              <button
                onClick={() => navigate("/home")}
                className="
                  inline-flex
                  items-center
                  gap-2
                  bg-green-500
                  hover:bg-transparent
                  border border-green-500
                  hover:text-green-400
                  text-black
                  text-sm
                  font-semibold
                  px-5 py-2.5
                  rounded-xl
                  transition-all duration-300
                  group
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

        ) : (

          <>

            {/* ================= TOP BAR ================= */}

            <div className="
              flex items-center justify-between
              mb-5
            ">

              <p className="text-sm text-slate-400">

                <span className="text-white font-semibold">
                  {wishlistItems.length}
                </span>{" "}

                {wishlistItems.length === 1
                  ? "item"
                  : "items"}{" "}
                saved

              </p>

              <button
                onClick={() => navigate("/products")}
                className="
                  flex items-center gap-2
                  text-sm
                  text-slate-400
                  hover:text-green-400
                  transition
                  cursor-pointer
                "
              >
                Continue Shopping
                <ArrowRight size={16} />
              </button>

            </div>

            {/* ================= PRODUCT GRID ================= */}

            <div className="
              grid
              grid-cols-2
              sm:grid-cols-3
              lg:grid-cols-4
              gap-4
            ">

              {wishlistItems.map((product) => {

                const productImage =
                  getProductImage(product);

                return (

                  <div
                    key={product.id}
                    className="
                      group
                      bg-[#07101f]
                      border border-slate-800
                      rounded-2xl
                      overflow-hidden
                      hover:border-slate-700
                      transition-all duration-200
                    "
                  >

                    {/* ================= IMAGE ================= */}

                    <div className="
                      relative
                      h-40
                      bg-[#020817]
                      flex items-center justify-center
                      p-4
                    ">

                      {productImage ? (

                        <img
                          src={productImage}
                          alt={product.name}
                          className="
                            h-full
                            w-full
                            object-contain
                            group-hover:scale-105
                            transition-transform duration-300
                          "
                          onError={(e) => {
                            e.currentTarget.style.display =
                              "none";
                          }}
                        />

                      ) : (

                        <PackageOpen
                          size={45}
                          className="text-slate-700"
                        />

                      )}

                      {/* Remove */}

                      <button
                        type="button"
                        onClick={() =>
                          removeFromWishlist(product.id)
                        }
                        className="
                          absolute
                          top-3
                          right-3
                          w-8 h-8
                          rounded-lg
                          bg-[#07101f]/90
                          border border-slate-700
                          flex items-center justify-center
                          text-slate-400
                          hover:text-red-400
                          hover:border-red-500/40
                          transition
                          cursor-pointer
                        "
                        title="Remove from wishlist"
                      >
                        <Trash2 size={15} />
                      </button>

                    </div>

                    {/* ================= DETAILS ================= */}

                    <div className="p-4">

                      <p className="
                        text-[11px]
                        text-green-400
                        mb-1
                      ">
                        {product.category}
                      </p>

                      <h3 className="
                        text-sm
                        font-semibold
                        text-white
                        truncate
                      ">
                        {product.name}
                      </h3>

                      {product.unit && (
                        <p className="
                          text-xs
                          text-slate-500
                          mt-1
                        ">
                          {product.unit}
                        </p>
                      )}

                      <div className="
                        flex
                        items-center
                        justify-between
                        gap-2
                        mt-4
                      ">

                        <span className="
                          text-lg
                          font-bold
                          text-white
                        ">
                          ₹
                          {Number(product.price).toFixed(2)}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            handleAddToCart(product)
                          }
                          className="
                            flex
                            items-center
                            justify-center
                            gap-1.5
                            bg-green-500
                            hover:bg-transparent
                            border border-green-500
                            hover:text-green-400
                            text-black
                            font-semibold
                            text-xs
                            px-3
                            py-2
                            rounded-lg
                            transition-all duration-300
                            cursor-pointer
                          "
                        >
                          <ShoppingCart size={14} />
                          Add
                        </button>

                      </div>

                    </div>

                  </div>

                );
              })}

            </div>

          </>
        )}

      </main>

    </div>
  );
}

export default Wishlist;