import { useState } from "react";
import {
  FiRefreshCw,
  FiGrid,
  FiDollarSign,
  FiStar,
  FiPackage,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";

function FilterSidebar({
  selectedCategory,
  onCategoryChange,
  selectedPriceRange,
  onPriceChange,
  selectedRating,
  onRatingChange,
  inStockOnly,
  onAvailabilityChange,
  onResetFilters,
}) {
  const [openCategory, setOpenCategory] = useState(true);
  const [openPrice, setOpenPrice] = useState(true);
  const [openRating, setOpenRating] = useState(true);
  const [openStock, setOpenStock] = useState(true);

  const resetFilters = () => {
    setOpenCategory(true);
    setOpenPrice(true);
    setOpenRating(true);
    setOpenStock(true);
    onResetFilters?.();
  };

  return (
    <aside className="w-full rounded-2xl border border-slate-800 bg-[#0B1224] p-5 shadow-sm sticky top-24 h-fit lg:w-60">
      <div className="flex justify-between items-center border-b border-slate-800 pb-5">
        <h2 className="text-xl font-bold text-white">Filters</h2>

        <button
          onClick={resetFilters}
          className="flex items-center gap-2 text-sm text-green-400 hover:text-green-300 transition cursor-pointer"
        >
          <FiRefreshCw size={14} />
          Reset
        </button>
      </div>

      <div className="py-5 border-b border-slate-800">
        <div
          onClick={() => setOpenCategory(!openCategory)}
          className="flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <FiGrid className="text-green-400" />
            <h3 className="text-[15px] font-semibold text-white">Categories</h3>
          </div>

          {openCategory ? (
            <FiChevronUp className="text-slate-400" />
          ) : (
            <FiChevronDown className="text-slate-400" />
          )}
        </div>

        {openCategory && (
          <div className="space-y-3 mt-4">
            <label className="flex items-center gap-3 text-sm text-slate-300">
              <input
                type="radio"
                name="sidebar-category"
                checked={selectedCategory === "All"}
                onChange={() => onCategoryChange?.("All")}
                className="accent-green-500"
              />
              All Categories
            </label>

            <label className="flex items-center gap-3 text-sm text-slate-300">
              <input
                type="radio"
                name="sidebar-category"
                checked={selectedCategory === "Fruits"}
                onChange={() => onCategoryChange?.("Fruits")}
                className="accent-green-500"
              />
              Fruits
            </label>

            <label className="flex items-center gap-3 text-sm text-slate-300">
              <input
                type="radio"
                name="sidebar-category"
                checked={selectedCategory === "Vegetables"}
                onChange={() => onCategoryChange?.("Vegetables")}
                className="accent-green-500"
              />
              Vegetables
            </label>

            <label className="flex items-center gap-3 text-sm text-slate-300">
              <input
                type="radio"
                name="sidebar-category"
                checked={selectedCategory === "Dairy"}
                onChange={() => onCategoryChange?.("Dairy")}
                className="accent-green-500"
              />
              Dairy
            </label>

            <label className="flex items-center gap-3 text-sm text-slate-300">
              <input
                type="radio"
                name="sidebar-category"
                checked={selectedCategory === "Bakery"}
                onChange={() => onCategoryChange?.("Bakery")}
                className="accent-green-500"
              />
              Bakery
            </label>

            <label className="flex items-center gap-3 text-sm text-slate-300">
              <input
                type="radio"
                name="sidebar-category"
                checked={selectedCategory === "Snacks"}
                onChange={() => onCategoryChange?.("Snacks")}
                className="accent-green-500"
              />
              Snacks
            </label>

            <label className="flex items-center gap-3 text-sm text-slate-300">
              <input
                type="radio"
                name="sidebar-category"
                checked={selectedCategory === "Beverages"}
                onChange={() => onCategoryChange?.("Beverages")}
                className="accent-green-500"
              />
              Beverages
            </label>

            <label className="flex items-center gap-3 text-sm text-slate-300">
              <input
                type="radio"
                name="sidebar-category"
                checked={selectedCategory === "Rice & Atta"}
                onChange={() => onCategoryChange?.("Rice & Atta")}
                className="accent-green-500"
              />
              Rice & Atta
            </label>

            <label className="flex items-center gap-3 text-sm text-slate-300">
              <input
                type="radio"
                name="sidebar-category"
                checked={selectedCategory === "Masala & Oil"}
                onChange={() => onCategoryChange?.("Masala & Oil")}
                className="accent-green-500"
              />
              Masala & Oil
            </label>

            <label className="flex items-center gap-3 text-sm text-slate-300">
              <input
                type="radio"
                name="sidebar-category"
                checked={selectedCategory === "Skincare"}
                onChange={() => onCategoryChange?.("Skincare")}
                className="accent-green-500"
              />
              Skincare
            </label>

            <label className="flex items-center gap-3 text-sm text-slate-300">
              <input
                type="radio"
                name="sidebar-category"
                checked={selectedCategory === "Household"}
                onChange={() => onCategoryChange?.("Household")}
                className="accent-green-500"
              />
              Household
            </label>

            <label className="flex items-center gap-3 text-sm text-slate-300">
              <input
                type="radio"
                name="sidebar-category"
                checked={selectedCategory === "Non Veg"}
                onChange={() => onCategoryChange?.("Non Veg")}
                className="accent-green-500"
              />
              Non Veg
            </label>
          </div>
        )}
      </div>

      <div className="py-5 border-b border-slate-800">
        <div
          onClick={() => setOpenPrice(!openPrice)}
          className="flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <FiDollarSign className="text-green-400" />
            <h3 className="text-[15px] font-semibold text-white">Price Range</h3>
          </div>

          {openPrice ? (
            <FiChevronUp className="text-slate-400" />
          ) : (
            <FiChevronDown className="text-slate-400" />
          )}
        </div>

        {openPrice && (
          <>
            <input
              type="range"
              min="0"
              max="1000"
              step="50"
              value={selectedPriceRange}
              onChange={(e) => onPriceChange?.(Number(e.target.value))}
              className="w-full mt-5 accent-green-500"
            />

            <div className="flex justify-between items-center mt-3">
              <span className="text-xs text-slate-400">₹0</span>

              <span className="px-3 py-1 rounded-lg bg-green-500/20 text-green-400 text-sm font-medium">
                ₹{selectedPriceRange}
              </span>

              <span className="text-xs text-slate-400">₹1000</span>
            </div>
          </>
        )}
      </div>

      <div className="py-5 border-b border-slate-800">
        <div
          onClick={() => setOpenRating(!openRating)}
          className="flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <FiStar className="text-yellow-400" />
            <h3 className="text-[15px] font-semibold text-white">Rating</h3>
          </div>

          {openRating ? (
            <FiChevronUp className="text-slate-400" />
          ) : (
            <FiChevronDown className="text-slate-400" />
          )}
        </div>

        {openRating && (
          <div className="space-y-3 mt-4">
            <label className="flex items-center gap-3 text-sm text-slate-300">
              <input
                type="radio"
                name="rating"
                checked={selectedRating === "4"}
                onChange={() => onRatingChange?.("4")}
                className="accent-green-500"
              />
              4★ & above
            </label>

            <label className="flex items-center gap-3 text-sm text-slate-300">
              <input
                type="radio"
                name="rating"
                checked={selectedRating === "3"}
                onChange={() => onRatingChange?.("3")}
                className="accent-green-500"
              />
              3★ & above
            </label>

            <label className="flex items-center gap-3 text-sm text-slate-300">
              <input
                type="radio"
                name="rating"
                checked={selectedRating === "2"}
                onChange={() => onRatingChange?.("2")}
                className="accent-green-500"
              />
              2★ & above
            </label>
          </div>
        )}
      </div>

      <div className="py-5">
        <div
          onClick={() => setOpenStock(!openStock)}
          className="flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <FiPackage className="text-green-400" />
            <h3 className="text-[15px] font-semibold text-white">Availability</h3>
          </div>

          {openStock ? (
            <FiChevronUp className="text-slate-400" />
          ) : (
            <FiChevronDown className="text-slate-400" />
          )}
        </div>

        {openStock && (
          <label className="flex items-center gap-3 mt-4 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => onAvailabilityChange?.(e.target.checked)}
              className="accent-green-500"
            />
            In Stock Only
          </label>
        )}
      </div>
    </aside>
  );
}

export default FilterSidebar;
