import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import Navbar from "../components/user/Navbar";
import Footer from "../components/user/Footer";

import ProductHeader from "../components/product/ProductHeader";
import FilterSidebar from "../components/product/FilterSidebar";
import SortBar from "../components/product/SortBar";
import ProductGrid from "../components/product/ProductGrid";
import Pagination from "../components/product/Pagination";
import CategoryTabs from "../components/product/CategoryTabs";

import amulMilk from "../assets/products/amul-milk.png";
import amulButter from "../assets/products/amul-butter.png";
import amulPaneer from "../assets/products/amul-paneer.png";
import amulCurd from "../assets/products/amul-curd.png";

import apple from "../assets/products/apple.png";
import banana from "../assets/products/banana.png";
import orange from "../assets/products/orange.png";
import grapes from "../assets/products/grapes.png";
import tomato from "../assets/products/tomato.png";
import potato from "../assets/products/potato.png";
import carrot from "../assets/products/carrot.png";
import onion from "../assets/products/onion.png";
import cucumber from "../assets/products/cucumber.png";
import garlic from "../assets/products/garlic.png";

import bread from "../assets/products/bread.png";
import brownBread from "../assets/products/brown-bread.png";

import lays from "../assets/products/lays.png";
import kurkure from "../assets/products/kurkure.png";
import oreo from "../assets/products/oreo.png";

import coke from "../assets/products/coke.png";
import sprite from "../assets/products/sprite.png";
import pepsi from "../assets/products/pepsi.png";

import nescafe from "../assets/products/nescafe.png";
import bru from "../assets/products/bru.png";
import maggi from "../assets/products/maggi.png";

import atta from "../assets/products/atta.png";
import rice from "../assets/products/rice.png";
import oil from "../assets/products/oil.png";
import masala from "../assets/products/masala.png";

import colgate from "../assets/products/colgate.png";
import dove from "../assets/products/dove.png";
import surf from "../assets/products/surf.png";
import vim from "../assets/products/vim.png";

const PRODUCT_IMAGES = {
  "amul-milk.png": amulMilk,
  "amul-butter.png": amulButter,
  "amul-paneer.png": amulPaneer,
  "amul-curd.png": amulCurd,

  "apple.png": apple,
  "banana.png": banana,
  "orange.png": orange,
  "grapes.png": grapes,
  "tomato.png": tomato,
  "potato.png": potato,
  "carrot.png": carrot,
  "onion.png": onion,
  "cucumber.png": cucumber,
  "garlic.png": garlic,

  "bread.png": bread,
  "brown-bread.png": brownBread,

  "lays.png": lays,
  "kurkure.png": kurkure,
  "oreo.png": oreo,

  "coke.png": coke,
  "sprite.png": sprite,
  "pepsi.png": pepsi,

  "nescafe.png": nescafe,
  "bru.png": bru,
  "maggi.png": maggi,

  "atta.png": atta,
  "rice.png": rice,
  "oil.png": oil,
  "masala.png": masala,

  "colgate.png": colgate,
  "dove.png": dove,
  "surf.png": surf,
  "vim.png": vim,
};

const ITEMS_PER_PAGE = 8;

function applyCategoryFilter(products, selectedCategory) {
  if (selectedCategory === "All") {
    return products;
  }

  return products.filter(
    (product) =>
      product.category?.toLowerCase() === selectedCategory.toLowerCase()
  );
}

function applySearchFilter(products, searchQuery) {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  if (!normalizedQuery) {
    return products;
  }

  return products.filter((product) =>
    product.name?.toLowerCase().includes(normalizedQuery)
  );
}

function applyPriceFilter(products, selectedPriceRange) {
  return products.filter(
    (product) => Number(product.price) <= Number(selectedPriceRange)
  );
}

function applyRatingFilter(products, selectedRating) {
  if (!selectedRating) {
    return products;
  }

  const minimumRating = Number(selectedRating);

  return products.filter(
    (product) => Number(product.rating || 4.5) >= minimumRating
  );
}

function applyAvailabilityFilter(products, inStockOnly) {
  if (!inStockOnly) {
    return products;
  }

  return products.filter((product) => Number(product.stock) > 0);
}

function sortProducts(products, selectedSort) {
  const sortedProducts = [...products];

  switch (selectedSort) {
    case "Newest":
      return sortedProducts.sort(
        (a, b) => Number(b.id || 0) - Number(a.id || 0)
      );

    case "Oldest":
      return sortedProducts.sort(
        (a, b) => Number(a.id || 0) - Number(b.id || 0)
      );

    case "Price Low to High":
      return sortedProducts.sort(
        (a, b) => Number(a.price) - Number(b.price)
      );

    case "Price High to Low":
      return sortedProducts.sort(
        (a, b) => Number(b.price) - Number(a.price)
      );

    case "Name A-Z":
      return sortedProducts.sort((a, b) =>
        (a.name || "").localeCompare(b.name || "")
      );

    case "Name Z-A":
      return sortedProducts.sort((a, b) =>
        (b.name || "").localeCompare(a.name || "")
      );

    case "Popular":
    default:
      return sortedProducts.sort(
        (a, b) => Number(b.rating || 0) - Number(a.rating || 0)
      );
  }
}

// NOTE: Client-side filtering/sorting/pagination removed — backend handles these.

function ProductPage() {
  // --------------------------------
  // READ VALUES FROM URL
  // --------------------------------
  const [searchParams] = useSearchParams();

  const categoryFromUrl = searchParams.get("category") || "All";
  const keywordFromUrl = searchParams.get("keyword") || "";

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  const controllerRef = useRef(null);
  const prevSearchRef = useRef("");

  // --------------------------------
  // CATEGORY
  // --------------------------------
  const [selectedCategory, setSelectedCategory] = useState(
    categoryFromUrl
  );

  // --------------------------------
  // SEARCH
  // --------------------------------
  const [searchQuery, setSearchQuery] =
    useState(keywordFromUrl);

  const [selectedSort, setSelectedSort] = useState("Popular");
  const [selectedPriceRange, setSelectedPriceRange] = useState(1000);
  const [selectedRating, setSelectedRating] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // --------------------------------
  // UPDATE VALUES FROM URL
  // --------------------------------
  useEffect(() => {
    setSelectedCategory(categoryFromUrl);
    setSearchQuery(keywordFromUrl);
    setCurrentPage(1);
  }, [categoryFromUrl, keywordFromUrl]);

  // --------------------------------
  // SORT MAP
  // --------------------------------
  const SORT_MAP = {
    Popular: "id,desc",
    Newest: "id,desc",
    Oldest: "id,asc",
    "Price Low to High": "price,asc",
    "Price High to Low": "price,desc",
    "Name A-Z": "name,asc",
    "Name Z-A": "name,desc",
  };

  // --------------------------------
  // FORMAT PRODUCTS
  // --------------------------------
  const formatProducts = (items) =>
    (items || []).map((product) => ({
      ...product,
      image: PRODUCT_IMAGES[product.imageUrl] || null,
      stock: Number(product.stock || 0),
      rating: product.rating || 4.5,
      popularity: product.popularity || 0,
      createdAt: product.id || 0,
      unit: product.unit || "per pack",
    }));

  // --------------------------------
  // FETCH PRODUCTS
  // --------------------------------
  const performFetch = async (signal) => {
    try {
      setError("");

      const params = new URLSearchParams();

      // pagination
      params.set("page", Math.max(0, currentPage - 1));
      params.set("size", ITEMS_PER_PAGE);

      // category
      if (
        selectedCategory &&
        selectedCategory !== "All"
      ) {
        params.set("category", selectedCategory);
      }

      // keyword
      if (
        searchQuery &&
        searchQuery.trim() !== ""
      ) {
        params.set(
          "keyword",
          searchQuery.trim()
        );
      }

      // price range
      params.set("minPrice", 0);
      params.set(
        "maxPrice",
        selectedPriceRange
      );

      // rating
      if (selectedRating) {
        params.set(
          "rating",
          selectedRating
        );
      }

      // stock
      if (inStockOnly) {
        params.set("stock", true);
      }

      // sort
      const mappedSort =
        SORT_MAP[selectedSort] || "id,desc";

      params.set("sort", mappedSort);

      const url =
        `http://localhost:8080/api/products/filter?${params.toString()}`;

      const res = await fetch(url, {
        signal,
      });

      if (!res.ok) {
        throw new Error(
          "Failed to fetch products"
        );
      }

      const data = await res.json();

      setProducts(
        formatProducts(
          data.content || []
        )
      );

      setTotalPages(
        Number(data.totalPages || 1)
      );
    } catch (err) {
      if (err.name === "AbortError") {
        return;
      }

      console.error(
        "Error fetching products:",
        err
      );

      setError(
        "Unable to load products. Please try again."
      );

      setProducts([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------
  // IMMEDIATE FETCH
  // --------------------------------
  const fetchProductsImmediate = () => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    const controller =
      new AbortController();

    controllerRef.current = controller;

    performFetch(
      controller.signal
    ).finally(() => {
      if (
        controllerRef.current ===
        controller
      ) {
        controllerRef.current = null;
      }
    });
  };

  // --------------------------------
  // CATEGORIES
  // --------------------------------
  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        products
          .map(
            (product) =>
              product.category
          )
          .filter(Boolean)
      ),
    ];

    return [
      "All",
      ...uniqueCategories,
    ];
  }, [products]);

  const safeCurrentPage = Math.min(
    currentPage,
    Math.max(1, totalPages)
  );

  const paginatedProducts = products;

  // --------------------------------
  // RESET FILTERS
  // --------------------------------
  const resetFilters = () => {
    setSelectedCategory("All");
    setSearchQuery("");
    setSelectedSort("Popular");
    setSelectedPriceRange(1000);
    setSelectedRating("");
    setInStockOnly(false);
    setCurrentPage(1);
  };

  // --------------------------------
  // CATEGORY CHANGE
  // --------------------------------
  const handleCategoryChange = (
    category
  ) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  // --------------------------------
  // SEARCH CHANGE
  // --------------------------------
  const handleSearchChange = (
    value
  ) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  // --------------------------------
  // SORT CHANGE
  // --------------------------------
  const handleSortChange = (
    value
  ) => {
    setSelectedSort(value);
    setCurrentPage(1);
  };

  // --------------------------------
  // PRICE CHANGE
  // --------------------------------
  const handlePriceChange = (
    value
  ) => {
    setSelectedPriceRange(value);
    setCurrentPage(1);
  };

  // --------------------------------
  // RATING CHANGE
  // --------------------------------
  const handleRatingChange = (
    value
  ) => {
    setSelectedRating(value);
    setCurrentPage(1);
  };

  // --------------------------------
  // AVAILABILITY CHANGE
  // --------------------------------
  const handleAvailabilityChange = (
    value
  ) => {
    setInStockOnly(value);
    setCurrentPage(1);
  };

  // --------------------------------
  // FETCH WHEN FILTERS CHANGE
  // --------------------------------
  useEffect(() => {
    const searchChanged =
      prevSearchRef.current !==
      searchQuery;

    if (controllerRef.current) {
      controllerRef.current.abort();
      controllerRef.current = null;
    }

    const controller =
      new AbortController();

    controllerRef.current =
      controller;

    if (searchChanged) {
      const timeout =
        setTimeout(() => {
          performFetch(
            controller.signal
          ).finally(() => {
            if (
              controllerRef.current ===
              controller
            ) {
              controllerRef.current =
                null;
            }
          });
        }, 300);

      prevSearchRef.current =
        searchQuery;

      return () => {
        clearTimeout(timeout);
        controller.abort();
      };
    }

    performFetch(
      controller.signal
    ).finally(() => {
      if (
        controllerRef.current ===
        controller
      ) {
        controllerRef.current =
          null;
      }
    });

    return () => {
      controller.abort();
    };
  }, [
    selectedCategory,
    searchQuery,
    selectedSort,
    selectedPriceRange,
    selectedRating,
    inStockOnly,
    currentPage,
  ]);

  return (
    <div className="min-h-screen bg-[#020817] text-white">
      <Navbar />

      <ProductHeader
        searchQuery={searchQuery}
        onSearchChange={
          handleSearchChange
        }
      />

      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">

        {/* CATEGORY + SORT */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <CategoryTabs
              categories={categories}
              selectedCategory={
                selectedCategory
              }
              onCategoryChange={
                handleCategoryChange
              }
            />
          </div>

          <div className="lg:ml-auto">
            <SortBar
              selectedSort={
                selectedSort
              }
              onSortChange={
                handleSortChange
              }
            />
          </div>
        </div>

        {/* PRODUCTS AREA */}
        <div className="mt-4 grid gap-4 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-5">

          {/* FILTER SIDEBAR */}
          <div className="lg:w-60 lg:sticky lg:top-24 lg:self-start">
            <FilterSidebar
              selectedCategory={
                selectedCategory
              }
              onCategoryChange={
                handleCategoryChange
              }
              selectedPriceRange={
                selectedPriceRange
              }
              onPriceChange={
                handlePriceChange
              }
              selectedRating={
                selectedRating
              }
              onRatingChange={
                handleRatingChange
              }
              inStockOnly={
                inStockOnly
              }
              onAvailabilityChange={
                handleAvailabilityChange
              }
              onResetFilters={
                resetFilters
              }
            />
          </div>

          {/* PRODUCT GRID */}
          <div className="min-w-0">

            {/* LOADING */}
            {loading && (
              <div className="flex min-h-[300px] items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-green-400" />

                  <p className="text-slate-400">
                    Loading products...
                  </p>
                </div>
              </div>
            )}

            {/* ERROR */}
            {!loading && error && (
              <div className="flex min-h-[300px] items-center justify-center">
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-8 py-6 text-center">
                  <p className="text-red-400">
                    {error}
                  </p>

                  <button
                    type="button"
                    onClick={
                      fetchProductsImmediate
                    }
                    className="mt-4 cursor-pointer rounded-lg bg-green-500 px-5 py-2 font-semibold text-slate-950 transition hover:bg-green-400"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {/* EMPTY */}
            {!loading &&
              !error &&
              paginatedProducts.length ===
                0 && (
                <div className="flex min-h-[300px] items-center justify-center">
                  <div className="text-center">
                    <h2 className="text-xl font-semibold text-white">
                      No products found
                    </h2>

                    <p className="mt-2 text-slate-400">
                      Try changing your search or filters.
                    </p>

                    <button
                      type="button"
                      onClick={
                        resetFilters
                      }
                      className="mt-5 cursor-pointer rounded-lg bg-green-500 px-5 py-2 font-semibold text-slate-950 hover:bg-green-400"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              )}

            {/* PRODUCTS */}
            {!loading &&
              !error &&
              paginatedProducts.length >
                0 && (
                <ProductGrid
                  products={
                    paginatedProducts
                  }
                />
              )}
          </div>
        </div>

        {/* PAGINATION */}
        {!loading &&
          !error &&
          products.length > 0 && (
            <div className="mt-8">
              <Pagination
                currentPage={
                  safeCurrentPage
                }
                totalPages={
                  totalPages
                }
                onPageChange={
                  setCurrentPage
                }
              />
            </div>
          )}
      </div>

      <Footer />
    </div>
  );
}

export default ProductPage;