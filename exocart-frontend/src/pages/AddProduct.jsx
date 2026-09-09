import { useState } from "react";
import { toast } from "react-toastify";

import Sidebar from "../components/admin/Sidebar";
import TopNavbar from "../components/admin/TopNavbar";

import { addProduct } from "../services/productService";
import { useNavigate } from "react-router-dom";

function AddProduct() {

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    imageUrl: "",
    category: ""
  });

  const [imageError, setImageError] = useState(false);

  const navigate = useNavigate();

  // ================= HANDLE CHANGE =================

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

    // Reset preview error when URL changes
    if (name === "imageUrl") {
      setImageError(false);
    }
  };

  // ================= HANDLE SUBMIT =================

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await addProduct(formData);

      toast.success(
        "Product Added Successfully"
      );

      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
        imageUrl: "",
        category: ""
      });

      setImageError(false);

      navigate("/admin/products");

    } catch (error) {

      toast.error(
        "Failed to Add Product"
      );

      console.log(error);

    }
  };

  return (
    <div className="
      min-h-screen
      bg-[#020817]
      flex
    ">

      <Sidebar />

      <div className="
        flex-1
        p-8
      ">

        <TopNavbar />

        <div className="
          bg-[#081225]
          border
          border-slate-800
          rounded-2xl
          p-3
          mt-8
          max-w-2xl
          mx-auto
        ">

          <h2 className="
            text-2xl
            font-bold
            text-white
            mb-3
          ">
            Add Product
          </h2>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            {/* Product Name */}

            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="
                w-full
                bg-[#020817]
                border
                border-slate-700
                rounded-xl
                px-4
                py-3
                text-white
                outline-none
                focus:border-green-500
              "
            />

            {/* Description */}

            <textarea
              name="description"
              placeholder="Product Description"
              value={formData.description}
              onChange={handleChange}
              required
              className="
                w-full
                h-24
                bg-[#020817]
                border
                border-slate-700
                rounded-xl
                px-4
                py-3
                text-white
                outline-none
                focus:border-green-500
                resize-none
              "
            />

            {/* Price & Stock */}

            <div className="
              grid
              grid-cols-2
              gap-4
            ">

              <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                className="
                  bg-[#020817]
                  border
                  border-slate-700
                  rounded-xl
                  px-4
                  py-3
                  text-white
                  outline-none
                  focus:border-green-500
                "
              />

              <input
                type="number"
                name="stock"
                placeholder="Stock Quantity"
                value={formData.stock}
                onChange={handleChange}
                required
                min="0"
                className="
                  bg-[#020817]
                  border
                  border-slate-700
                  rounded-xl
                  px-4
                  py-2.5
                  text-white
                  outline-none
                  focus:border-green-500
                "
              />

            </div>

            {/* Category & Image */}

            <div className="
              grid
              grid-cols-2
              gap-4
            ">

              <input
                type="text"
                name="category"
                placeholder="Category"
                value={formData.category}
                onChange={handleChange}
                required
                className="
                  bg-[#020817]
                  border
                  border-slate-700
                  rounded-xl
                  px-4
                  py-2.5
                  text-white
                  outline-none
                  focus:border-green-500
                "
              />

              <input
                type="url"
                name="imageUrl"
                placeholder="Image URL"
                value={formData.imageUrl}
                onChange={handleChange}
                required
                className="
                  bg-[#020817]
                  border
                  border-slate-700
                  rounded-xl
                  px-4
                  py-2.5
                  text-white
                  outline-none
                  focus:border-green-500
                "
              />

            </div>

            {/* ================= IMAGE PREVIEW ================= */}

            {formData.imageUrl && (

              <div className="
                border
                border-slate-700
                rounded-xl
                p-3
              ">

                <p className="
                  text-slate-400
                  text-sm
                  mb-3
                ">
                  Image Preview
                </p>

                {!imageError ? (

                  <img
                    src={formData.imageUrl.trim()}
                    alt="Product Preview"
                    onError={() =>
                      setImageError(true)
                    }
                    onLoad={() =>
                      setImageError(false)
                    }
                    className="
                      h-48
                      w-full
                      object-contain
                      rounded-lg
                      bg-[#020817]
                    "
                  />

                ) : (

                  <div className="
                    h-48
                    w-full
                    rounded-lg
                    bg-[#020817]
                    border
                    border-red-500/20
                    flex
                    flex-col
                    items-center
                    justify-center
                    text-center
                  ">

                    <p className="
                      text-red-400
                      text-sm
                      font-medium
                    ">
                      Unable to load image
                    </p>

                    <p className="
                      text-slate-500
                      text-xs
                      mt-1
                    ">
                      Please check the image URL
                    </p>

                  </div>

                )}

              </div>

            )}

            {/* Submit Button */}

            <button
              type="submit"
              className="
                w-full
                bg-green-500
                hover:bg-green-600
                text-white
                py-2.5
                rounded-xl
                font-semibold
                transition-all
                duration-300
                hover:scale-[1.01]
                cursor-pointer
              "
            >
              Add Product
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default AddProduct;