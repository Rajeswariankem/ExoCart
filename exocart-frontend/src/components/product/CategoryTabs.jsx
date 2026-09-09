function CategoryTabs({ categories = [], selectedCategory = "All", onCategoryChange }) {
  return (
    <div className="w-full">
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {categories.map((category) => {
          const isActive = category === selectedCategory;

          return (
            <button
              key={category}
              type="button"
              onClick={() => onCategoryChange?.(category)}
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "border-green-500 bg-green-500 text-slate-950"
                  : "border-slate-700 bg-[#071426] text-slate-300 hover:border-green-500/60 hover:text-white"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default CategoryTabs;