import { FiSearch } from "react-icons/fi";
import basket from "../../assets/basket.png";
import { useNavigate } from "react-router-dom";

function ProductHeader({ searchQuery = "", onSearchChange }) {
    const navigate = useNavigate();
  return (
    <section className="max-w-7xl mx-auto px-6 pt-8 pb-3">
      <div className="grid grid-cols-1 lg:grid-cols-3 items-start gap-6">
        <div>
          <p className="text-sm text-slate-400 mb-2">
            <span
              onClick={() => navigate("/home")}
              className="cursor-pointer hover:text-green-400 transition-colors duration-200"
            >
              Home
            </span>

            <span className="mx-2 text-slate-600">/</span>

            <span className="text-white">Products</span>
          </p>

          <h1 className="text-4xl font-bold text-white">Our Products</h1>

          <p className="mt-2 text-sm text-slate-400 leading-6 max-w-xs">
            Fresh groceries delivered
            <br />
            to your doorstep.
          </p>

          <div className="flex items-center gap-2 mt-3">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>

            <p className="text-xs text-slate-500">
              <span className="text-green-400 font-semibold">120+</span>
              <span className="ml-1">products available</span>
            </p>
          </div>
        </div>

        <div className="pt-18 flex justify-center">
          <div className="relative w-full max-w-sm">
            <FiSearch
              size={18}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={searchQuery}
              onChange={(event) => onSearchChange?.(event.target.value)}
              placeholder="Search products..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-14 pr-5 text-white placeholder:text-slate-500 focus:outline-none focus:border-green-400 transition"
            />
          </div>
        </div>

        <div className="pt-2 hidden lg:flex justify-end">
          <img src={basket} alt="Basket" className="w-[230px] object-contain" />
        </div>
      </div>
    </section>
  );
}

export default ProductHeader;