import ProductCard from "./ProductCard";

function ProductGrid({ products = [] }) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-3 xl:grid-cols-4 items-start">
        {products.map((product, index) => (
          <div key={product.name || index} className="flex h-full w-full">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductGrid;
