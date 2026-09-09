import { useEffect, useState } from "react";
import {
  getAllProducts,
  deleteProduct,
  updateProduct,
} from "../services/productService";

import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Trash2, X } from "lucide-react";

// Load all product images from src/assets/products
const productImages = import.meta.glob(
  "../assets/products/*",
  {
    eager: true,
    query: "?url",
    import: "default",
  }
);

function getProductImage(imageName) {
  if (!imageName) return null;

  // If imageUrl is a direct online URL
  if (
    imageName.startsWith("http://") ||
    imageName.startsWith("https://")
  ) {
    return imageName;
  }

  // Otherwise use local image from assets/products
  const imagePath = `../assets/products/${imageName}`;

  return productImages[imagePath] || null;
}

function Products() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  // DELETE DIALOG
  const [deleteProductId, setDeleteProductId] = useState(null);

  const [editData, setEditData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    imageUrl: "",
  });

  const navigate = useNavigate();

  // ================= FETCH PRODUCTS =================

  const fetchProducts = async () => {
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ================= DELETE =================

  const openDeleteDialog = (id) => {
    setDeleteProductId(id);
  };

  const closeDeleteDialog = () => {
    setDeleteProductId(null);
  };

  const handleDelete = async () => {
    if (!deleteProductId) return;

    try {
      await deleteProduct(deleteProductId);

      toast.success("Product deleted successfully");

      setDeleteProductId(null);

      fetchProducts();
    } catch (error) {
      console.error(error);

      toast.error("Failed to delete product");
    }
  };

  // ================= UPDATE =================

  const handleUpdate = async () => {
    try {
      await updateProduct(
        editingProduct.id,
        editData
      );

      toast.success(
        "Product updated successfully"
      );

      setEditingProduct(null);

      fetchProducts();
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to update product"
      );
    }
  };

  return (
    <div className="flex-1 p-8 bg-[#020817] min-h-screen">

      {/* ================= HEADER ================= */}

      <div className="flex items-center justify-between mb-8">

        <div>

          <div className="flex items-center gap-3 mb-3">

            {/* BACK TO DASHBOARD */}

            <button
              type="button"
              onClick={() => navigate("/admin")}
              className="
                flex
                items-center
                gap-2
                px-3
                py-2
                rounded-lg
                border
                border-slate-700
                text-slate-300
                text-sm
                hover:border-green-500
                hover:text-green-400
                transition-all
                duration-200
                cursor-pointer
              "
            >
              <ArrowLeft size={16} />
              Dashboard
            </button>

          </div>

          <h1 className="text-4xl font-bold text-white">
            Products
          </h1>

          <p className="text-slate-400 mt-2">
            Manage your store products
          </p>

        </div>

        {/* ADD PRODUCT */}

        <Link
          to="/admin/add-product"
          className="
            bg-green-500
            hover:bg-green-600
            text-white
            px-4
            py-2
            rounded-lg
            text-sm
            font-medium
            transition
            cursor-pointer
          "
        >
          + Add Product
        </Link>

      </div>

      {/* ================= PRODUCTS ================= */}

      {products.length === 0 ? (

        <div className="text-center text-slate-400 mt-20">
          No products found
        </div>

      ) : (

        <div className="flex flex-wrap gap-5">

          {products.map((product) => (

            <div
              key={product.id}
              className="
                bg-[#081225]
                border
                border-slate-800
                rounded-xl
                overflow-hidden
                w-[260px]
                hover:border-green-500/50
                hover:-translate-y-2
                hover:shadow-xl
                hover:shadow-green-500/10
                transition-all
                duration-300
              "
            >

              {/* ================= PRODUCT IMAGE ================= */}

              <div className="h-28 bg-slate-800 overflow-hidden flex items-center justify-center">

                {getProductImage(product.imageUrl) ? (

                  <img
                    src={getProductImage(product.imageUrl)}
                    alt={product.name}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                    className="
                      w-full
                      h-full
                      object-contain
                      p-2
                      hover:scale-110
                      transition-transform
                      duration-500
                    "
                  />

                ) : (

                  <div className="text-xs text-slate-500">
                    Image not available
                  </div>

                )}

              </div>

              {/* ================= PRODUCT DETAILS ================= */}

              <div className="p-3">

                <h3 className="text-base font-semibold text-white truncate">
                  {product.name}
                </h3>

                <p className="text-slate-500 text-sm mt-1">
                  {product.category}
                </p>

                <div className="flex items-center justify-between mt-3">

                  <p className="text-green-400 text-lg font-bold">
                    ₹{product.price}
                  </p>

                  <span className="bg-green-500/10 text-green-400 px-2 py-1 rounded-lg text-xs">
                    Stock: {product.stock}
                  </span>

                </div>

                <p className="text-slate-500 text-xs mt-3 line-clamp-1">
                  {product.description}
                </p>

                {/* ================= ACTIONS ================= */}

                <div className="flex gap-2 mt-3">

                  <button
                    type="button"
                    onClick={() => {

                      setEditingProduct(product);

                      setEditData({
                        name: product.name,
                        description:
                          product.description,
                        price: product.price,
                        stock: product.stock,
                        category: product.category,
                        imageUrl:
                          product.imageUrl,
                      });

                    }}
                    className="
                      flex-1
                      bg-blue-500
                      hover:bg-blue-600
                      text-white
                      py-1.5
                      rounded-lg
                      text-sm
                      transition
                      cursor-pointer
                    "
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      openDeleteDialog(product.id)
                    }
                    className="
                      flex-1
                      bg-red-500
                      hover:bg-red-600
                      text-white
                      py-1.5
                      rounded-lg
                      text-sm
                      transition
                      cursor-pointer
                    "
                  >
                    Delete
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

      {/* ================= DELETE CONFIRMATION DIALOG ================= */}

      {deleteProductId && (

        <div
          className="
            fixed
            inset-0
            bg-black/70
            backdrop-blur-sm
            flex
            items-center
            justify-center
            z-[100]
            px-4
          "
          onClick={closeDeleteDialog}
        >

          <div
            className="
              w-full
              max-w-md
              bg-[#081225]
              border
              border-slate-700
              rounded-2xl
              shadow-2xl
              p-6
              relative
              animate-[fadeIn_0.2s_ease-out]
            "
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* CLOSE BUTTON */}

            <button
              type="button"
              onClick={closeDeleteDialog}
              className="
                absolute
                top-4
                right-4
                text-slate-500
                hover:text-white
                transition
                cursor-pointer
              "
            >
              <X size={20} />
            </button>

            {/* ICON */}

            <div
              className="
                w-12
                h-12
                rounded-xl
                bg-red-500/10
                border
                border-red-500/20
                flex
                items-center
                justify-center
                mb-4
              "
            >
              <Trash2
                size={22}
                className="text-red-400"
              />
            </div>

            {/* TITLE */}

            <h2 className="
              text-xl
              font-bold
              text-white
            ">
              Delete Product?
            </h2>

            {/* MESSAGE */}

            <p className="
              text-slate-400
              text-sm
              mt-2
              leading-6
            ">
              Are you sure you want to delete this
              product? This action cannot be undone.
            </p>

            {/* BUTTONS */}

            <div className="
              flex
              gap-3
              mt-6
            ">

              <button
                type="button"
                onClick={closeDeleteDialog}
                className="
                  flex-1
                  bg-slate-700
                  hover:bg-slate-600
                  text-white
                  py-2.5
                  rounded-xl
                  font-medium
                  transition
                  cursor-pointer
                "
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="
                  flex-1
                  bg-red-500
                  hover:bg-red-600
                  text-white
                  py-2.5
                  rounded-xl
                  font-medium
                  transition
                  cursor-pointer
                "
              >
                Delete
              </button>

            </div>

          </div>

        </div>

      )}

      {/* ================= EDIT MODAL ================= */}

      {editingProduct && (

        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">

          <div className="bg-[#081225] p-6 rounded-2xl w-[500px] max-w-full border border-slate-700">

            <h2 className="text-2xl font-bold text-white mb-5">
              Edit Product
            </h2>

            <div className="space-y-3">

              {/* NAME */}

              <input
                type="text"
                value={editData.name}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    name: e.target.value,
                  })
                }
                placeholder="Product name"
                className="
                  w-full
                  bg-[#020817]
                  border
                  border-slate-700
                  rounded-lg
                  px-4
                  py-2
                  text-white
                  outline-none
                  focus:border-green-500
                "
              />

              {/* DESCRIPTION */}

              <textarea
                value={editData.description}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    description: e.target.value,
                  })
                }
                placeholder="Product description"
                rows="3"
                className="
                  w-full
                  bg-[#020817]
                  border
                  border-slate-700
                  rounded-lg
                  px-4
                  py-2
                  text-white
                  outline-none
                  focus:border-green-500
                  resize-none
                "
              />

              {/* PRICE */}

              <input
                type="number"
                value={editData.price}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    price: e.target.value,
                  })
                }
                placeholder="Price"
                className="
                  w-full
                  bg-[#020817]
                  border
                  border-slate-700
                  rounded-lg
                  px-4
                  py-2
                  text-white
                  outline-none
                  focus:border-green-500
                "
              />

              {/* STOCK */}

              <input
                type="number"
                value={editData.stock}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    stock: e.target.value,
                  })
                }
                placeholder="Stock"
                className="
                  w-full
                  bg-[#020817]
                  border
                  border-slate-700
                  rounded-lg
                  px-4
                  py-2
                  text-white
                  outline-none
                  focus:border-green-500
                "
              />

            </div>

            {/* BUTTONS */}

            <div className="flex gap-3 mt-5">

              <button
                type="button"
                onClick={handleUpdate}
                className="
                  flex-1
                  bg-green-500
                  hover:bg-green-600
                  text-white
                  py-2
                  rounded-lg
                  cursor-pointer
                  transition
                "
              >
                Update
              </button>

              <button
                type="button"
                onClick={() =>
                  setEditingProduct(null)
                }
                className="
                  flex-1
                  bg-red-500
                  hover:bg-red-600
                  text-white
                  py-2
                  rounded-lg
                  cursor-pointer
                  transition
                "
              >
                Cancel
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Products;