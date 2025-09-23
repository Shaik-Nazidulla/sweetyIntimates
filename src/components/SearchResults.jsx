// src/components/SearchResults.jsx
import React from "react";
import { useLocation, Link } from "react-router-dom";
import allProducts from "../components/ProductsInfo"; // ✅ import your products data

const SearchResults = () => {
  const location = useLocation();

  // ✅ Get search query from URL
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query")?.toLowerCase() || "";

  // ✅ Filter products (by name, category, or subcategory)
  const filteredProducts = allProducts.filter((product) => {
  const name = product?.name?.toLowerCase() || "";
  const category = product?.category?.toLowerCase() || "";
  const subcategory = product?.subcategory?.toLowerCase() || "";

  return (
    name.includes(query) ||
    category.includes(query) ||
    subcategory.includes(query)
  );
});

  return (
    <div className="px-6 py-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Search Results for: <span className="text-pink-600">"{query}"</span>
      </h2>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg shadow-sm hover:shadow-md transition p-4"
            >
              <Link to={`/product/${product.id}`}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-md mb-3"
                />
                <h3 className="text-sm font-medium text-gray-800">
                  {product.name}
                </h3>
                <p className="text-xs text-gray-500">
                  {product.category} → {product.subcategory}
                </p>
                <p className="text-pink-600 font-semibold mt-1">
                  ₹{product.price}
                </p>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-lg">
          No products found matching your search.
        </p>
      )}
    </div>
  );
};

export default SearchResults;
