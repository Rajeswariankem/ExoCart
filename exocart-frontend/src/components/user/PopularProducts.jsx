import amulMilk from "../../assets/products/amul-milk.png";
import bread from "../../assets/products/bread.png";
import lays from "../../assets/products/lays.png";
import coke from "../../assets/products/coke.png";
import maggi from "../../assets/products/maggi.png";
import nescafe from "../../assets/products/nescafe.png";
import surf from "../../assets/products/surf.png";
import colgate from "../../assets/products/colgate.png";

import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiHeart } from "react-icons/fi";

import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

function Products() {
    const navigate = useNavigate();
  const {
    cartItems,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  const {
    toggleWishlist,
    isInWishlist,
  } = useWishlist();

  const products = [
    {
      id: 1,
      name: "Amul Taaza Milk",
      quantity: "1 L",
      price: 32,
      image: amulMilk,
      size: "w-28 h-28",
      stock: 10,
    },
    {
      id: 2,
      name: "Harvest Gold Bread",
      quantity: "500 g",
      price: 28,
      image: bread,
      size: "w-32 h-28",
      stock: 10,
      moveUp: true,
    },
    {
      id: 3,
      name: "Lay's Classic",
      quantity: "52 g",
      price: 20,
      image: lays,
      size: "w-28 h-28",
      stock: 10,
    },
    {
      id: 4,
      name: "Coca Cola",
      quantity: "750 ml",
      price: 40,
      image: coke,
      size: "w-28 h-28",
      stock: 10,
    },
    {
      id: 5,
      name: "Maggi 2-Minute Noodles",
      quantity: "70 g",
      price: 14,
      image: maggi,
      size: "w-28 h-28",
      stock: 10,
      moveUp: true,
    },
    {
      id: 6,
      name: "Nescafe Classic",
      quantity: "50 g",
      price: 110,
      image: nescafe,
      size: "w-24 h-28",
      stock: 10,
    },
    {
      id: 7,
      name: "Surf Excel Matic",
      quantity: "1 kg",
      price: 149,
      image: surf,
      size: "w-24 h-28",
      stock: 10,
    },
    {
      id: 8,
      name: "Colgate Strong Teeth",
      quantity: "150 g",
      price: 32,
      image: colgate,
      size: "w-28 h-24",
      stock: 10,
      moveUp: true,
    },
  ];

  const getQuantity = (productId) => {
    const item = cartItems.find(
      (item) => item.id === productId
    );

    return item ? Number(item.quantity) : 0;
  };

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const handleIncrease = (product) => {
    const quantity = getQuantity(product.id);

    if (quantity < Number(product.stock)) {
      increaseQuantity(product.id);
    }
  };

  const handleDecrease = (product) => {
    const quantity = getQuantity(product.id);

    if (quantity > 0) {
      decreaseQuantity(product.id);
    }
  };

  return (
    <section className="mx-auto mt-10 max-w-7xl px-4">

      {/* HEADING */}
      <div className="mb-6 flex items-center justify-between">

        <h2 className="text-2xl font-bold text-white">
          Popular Products
        </h2>

       <button
         type="button"
         onClick={() => navigate("/products")}
         className="group flex cursor-pointer items-center gap-1 text-sm font-semibold text-green-400 transition hover:text-green-300"
       >
         View All

         <FiArrowRight
           className="transition-transform duration-300 group-hover:translate-x-1"
         />
       </button>

      </div>

      {/* PRODUCT LIST */}
      <div className="products-scroll flex gap-5 overflow-x-auto px-1 pb-2 pt-2">

        {products.map((product) => {

          const quantity = getQuantity(product.id);

          const wishlisted = isInWishlist(
            product.id
          );

          return (
            <div
              key={product.id}
              className="
                relative
                min-w-[120px]
                w-[135px]
                h-[210px]
                flex-shrink-0
                cursor-pointer
                rounded-xl
                border
                border-slate-800
                bg-[#071426]
                p-3
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-green-500/60
                hover:shadow-[0_0_20px_rgba(34,197,94,0.15)]
              "
            >

              {/* WISHLIST */}

              <button
                type="button"
                onClick={() =>
                  toggleWishlist(product)
                }
                className={`
                  absolute
                  right-2
                  top-2
                  z-20
                  flex
                  h-6
                  w-6
                  cursor-pointer
                  items-center
                  justify-center
                  rounded-full
                  border
                  transition-all
                  duration-300
                  ${
                    wishlisted
                      ? "border-red-500/40 bg-red-500/10 text-red-400"
                      : "border-slate-700 bg-[#0b1727] text-slate-400 hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400"
                  }
                `}
              >
                <FiHeart
                  size={12}
                  className={
                    wishlisted
                      ? "fill-current"
                      : ""
                  }
                />
              </button>

              {/* IMAGE */}

              <div className="flex h-[110px] items-center justify-center overflow-hidden">

                <img
                  src={product.image}
                  alt={product.name}
                  className={`${product.size} max-h-[105px] object-contain`}
                />

              </div>

              {/* DETAILS */}

              <div className="mt-1 flex flex-col">

                <h6 className="line-clamp-2 text-[12px] font-semibold leading-tight text-white">
                  {product.name}
                </h6>

                <p className="mt-1 text-[10px] text-slate-400">
                  {product.quantity}
                </p>

                {/* PRICE + BUTTON */}

                <div
                  className={`flex h-7 items-center justify-between ${
                    product.moveUp ? "-mt-1" : "mt-2"
                  }`}
                >

                  {/* PRICE */}

                  <span className="text-xs font-bold text-white">
                    ₹{product.price}
                  </span>

                  {/* CART */}

                  {quantity === 0 ? (

                    <button
                      type="button"
                      onClick={() =>
                        handleAddToCart(product)
                      }
                      className="
                        flex
                        h-6
                        w-6
                        cursor-pointer
                        items-center
                        justify-center
                        rounded-md
                        border
                        border-green-500/50
                        text-sm
                        text-green-400
                        transition-all
                        duration-300
                        hover:scale-110
                        hover:border-green-400
                        hover:bg-green-500
                        hover:text-black
                      "
                    >
                      +
                    </button>

                  ) : (

                    <div
                      className="
                        flex
                        h-6
                        items-center
                        overflow-hidden
                        rounded-md
                        border
                        border-green-500/60
                        bg-[#0b1727]
                      "
                    >

                      {/* MINUS */}

                      <button
                        type="button"
                        onClick={() =>
                          handleDecrease(product)
                        }
                        className="
                          flex
                          h-6
                          w-5
                          cursor-pointer
                          items-center
                          justify-center
                          text-green-400
                          transition
                          hover:bg-green-500/10
                        "
                      >
                        −
                      </button>

                      {/* COUNT */}

                      <span className="flex min-w-6 items-center justify-center text-[11px] font-bold text-white">
                        {quantity}
                      </span>

                      {/* PLUS */}

                      <button
                        type="button"
                        onClick={() =>
                          handleIncrease(product)
                        }
                        disabled={
                          quantity >=
                          Number(product.stock)
                        }
                        className="
                          flex
                          h-6
                          w-5
                          cursor-pointer
                          items-center
                          justify-center
                          text-green-400
                          transition
                          hover:bg-green-500/10
                          disabled:cursor-not-allowed
                          disabled:text-slate-600
                        "
                      >
                        +
                      </button>

                    </div>

                  )}

                </div>

              </div>

            </div>
          );
        })}

      </div>

    </section>
  );
}

export default Products;