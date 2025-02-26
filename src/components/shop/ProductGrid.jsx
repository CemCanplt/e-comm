import React from "react";
import { ArrowLeft, ArrowRight, Loader } from "lucide-react";
import { Link, useHistory } from "react-router-dom";

const ProductCard = ({ product, viewMode, onClick }) => {
  // Get history object for navigation
  const history = useHistory();

  const getImageUrl = () => {
    if (product.images && Array.isArray(product.images)) {
      // Images bir array ise ve içinde objeler varsa
      if (product.images[0] && product.images[0].url) {
        return product.images[0].url;
      }
      // Images bir string array ise
      if (typeof product.images[0] === "string") {
        return product.images[0];
      }
    }
    // Single image string ise
    if (product.image) {
      return product.image;
    }
    // Hiçbiri yoksa placeholder
    return "https://placehold.co/300x300/gray/white?text=No+Image";
  };

  // Improved navigation function using React Router
  const handleProductClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const productUrl = `/shop/product/${product.id}`;
    history.push(productUrl);

    if (onClick) {
      onClick(product);
    }
  };

  return (
    <div
      className={`block bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer transition-all hover:shadow-md ${
        viewMode === "list" ? "flex" : ""
      }`}
      onClick={handleProductClick}
      role="button"
      aria-label={`View ${product.name} details`}
    >
      <div
        className={`${viewMode === "list" ? "w-1/3" : "aspect-w-1 aspect-h-1"}`}
      >
        <img
          src={getImageUrl()}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      </div>

      <div className={`p-4 ${viewMode === "list" ? "w-2/3" : ""}`}>
        <h3 className="font-medium text-gray-900 mb-2 truncate">
          {product.name}
        </h3>

        <div className="flex justify-between items-center">
          <div>
            {product.discount_price ? (
              <div className="flex items-center gap-2">
                <span className="text-red-600 font-bold">
                  ${product.discount_price}
                </span>
                <span className="text-gray-400 line-through text-sm">
                  ${product.price}
                </span>
              </div>
            ) : (
              <span className="font-bold">${product.price}</span>
            )}
          </div>

          <div className="flex items-center">
            <div className="text-yellow-400 text-sm">
              {"★".repeat(Math.floor(product.rating || 0))}
            </div>
            <span className="text-xs text-gray-600 ml-1">
              ({product.rating || 0})
            </span>
          </div>
        </div>

        {viewMode === "list" && product.description && (
          <p className="text-gray-600 mt-2 text-sm line-clamp-2">
            {product.description}
          </p>
        )}
      </div>
    </div>
  );
};

const ProductGrid = ({
  isLoading,
  products,
  viewMode,
  totalPages,
  page,
  handlePageChange,
  resetFilters,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-4 h-72">
            <div className="bg-gray-200 h-40 mb-4 rounded"></div>
            <div className="bg-gray-200 h-4 w-3/4 mb-2 rounded"></div>
            <div className="bg-gray-200 h-4 w-1/2 mb-4 rounded"></div>
            <div className="bg-gray-200 h-4 w-1/3 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          No Products Found
        </h3>
        <p className="text-gray-500 mb-6">
          Try adjusting your filters or search criteria.
        </p>
        <button
          onClick={resetFilters}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Clear Filters
        </button>
      </div>
    );
  }

  return (
    <>
      <div
        className={`${
          viewMode === "list"
            ? "space-y-4"
            : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        }`}
      >
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            viewMode={viewMode}
            onClick={(product) => {
              console.log("Clicked product:", product.id);
            }}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center space-x-1">
            <button
              onClick={() => handlePageChange(Math.max(1, page - 1))}
              disabled={page === 1}
              className={`px-3 py-2 rounded ${
                page === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            {[...Array(totalPages)].map((_, i) => {
              // Only show limited page numbers with ellipsis
              if (
                totalPages <= 7 ||
                i === 0 ||
                i === totalPages - 1 ||
                (page - 3 <= i && i <= page + 1)
              ) {
                return (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`w-10 h-10 flex items-center justify-center rounded-full ${
                      page === i + 1
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {i + 1}
                  </button>
                );
              } else if (
                (i === 1 && page > 4) ||
                (i === totalPages - 2 && page < totalPages - 4)
              ) {
                return (
                  <span key={i} className="px-2">
                    ...
                  </span>
                );
              } else {
                return null;
              }
            })}

            <button
              onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className={`px-3 py-2 rounded ${
                page === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </nav>
        </div>
      )}
    </>
  );
};

export default ProductGrid;
