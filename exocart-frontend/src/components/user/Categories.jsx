import fruits from "../../assets/categories/fruits.png";
import vegetables from "../../assets/categories/vegetables.png";
import dairy from "../../assets/categories/milk.png";
import rice from "../../assets/categories/rice.png";
import snacks from "../../assets/categories/snacks.png";
import beverages from "../../assets/categories/beverages.png";
import masala from "../../assets/categories/masala and oil.png";
import meat from "../../assets/categories/meat.png";
import personalcare from "../../assets/categories/skincare.png";
import household from "../../assets/categories/household.png";

import { useNavigate } from "react-router-dom";

function Categories() {
  const navigate = useNavigate();

  const categories = [
    {
      name: "Fruits",
      image: fruits,
      size: "w-32 h-32",
      backendCategory: "Fruits",
    },
    {
      name: "Vegetables",
      image: vegetables,
      size: "w-32 h-32",
      backendCategory: "Vegetables",
    },
    {
      name: "Dairy & Milk",
      image: dairy,
      size: "w-32 h-32",
      backendCategory: "Dairy",
    },
    {
      name: "Rice & Atta",
      image: rice,
      size: "w-32 h-32",
      backendCategory: "Rice & Atta",
    },
    {
      name: "Snacks",
      image: snacks,
      size: "w-32 h-32",
      backendCategory: "Snacks",
    },
    {
      name: "Beverages",
      image: beverages,
      size: "w-36 h-36",
      backendCategory: "Beverages",
    },
    {
      name: "Masala and oils",
      image: masala,
      size: "w-24 h-24",
      backendCategory: "Masala & Oil",
    },
    {
      name: "Personal Care",
      image: personalcare,
      size: "w-24 h-24",
      backendCategory: "Skincare",
    },
    {
      name: "Eggs, meat & fish",
      image: meat,
      size: "w-26 h-26",
      backendCategory: "Non Veg",
    },
    {
      name: "Household",
      image: household,
      size: "w-26 h-26",
      backendCategory: "Household",
    },
  ];

  const handleExploreAll = () => {
    navigate("/products");
  };

  const handleCategoryClick = (category) => {
    navigate(
      `/products?category=${encodeURIComponent(
        category.backendCategory
      )}`
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 mt-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-extrabold text-white">
          Shop by Category
        </h2>

        <button
          type="button"
          onClick={handleExploreAll}
          className="
            px-4
            py-2
            rounded-xl
            bg-green-500/10
            border
            border-green-500/30
            text-green-400
            hover:bg-green-500
            hover:text-black
            transition-all
            duration-300
            font-medium
            cursor-pointer
          "
        >
          Explore All
        </button>
      </div>

      <div
        className="
          flex
          gap-4
          overflow-x-auto
          categories-scroll
          py-2
        "
      >
        {categories.map((category) => (
          <div
            key={category.name}
            onClick={() => handleCategoryClick(category)}
            className="
              min-w-[160px]
              h-[180px]
              flex-shrink-0
              bg-[#081225]
              border
              border-slate-800
              rounded-2xl
              px-4
              py-5
              cursor-pointer
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-green-500/70
              hover:shadow-[0_0_20px_rgba(34,197,94,0.15)]
              text-center
            "
          >
            <div className="h-28 flex items-center justify-center mb-4">
              <img
                src={category.image}
                alt={category.name}
                className={`${category.size} object-contain`}
              />
            </div>

            <h3 className="text-white text-sm font-semibold leading-tight">
              {category.name}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Categories;