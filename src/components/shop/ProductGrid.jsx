import React from "react";
import { Link } from "react-router-dom";
import { Heart, Star, Search } from "lucide-react";

const ProductGrid = ({
  products = [],
  totalPages,
  currentPage,
  onPageChange,
  onResetFilters,
  filterText,
}) => {
  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-lg shadow-sm text-center">
        <div className="bg-gray-100 p-4 rounded-full mb-4">
          <Search className="h-10 w-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          No Products Found
        </h3>
        <p className="text-gray-500 mb-6">
          {filterText
            ? `No products matching "${filterText}" found`
            : "No products match the selected filters"}
        </p>
        <button
          onClick={onResetFilters}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Clear Filters
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

const ProductCard = ({ product }) => {
  const getProductImage = () => {
    if (product.images) {
      if (typeof product.images === "string") {
        try {
          const parsed = JSON.parse(product.images);
          return Array.isArray(parsed) && parsed.length > 0
            ? parsed[0]
            : product.image ||
                "https://placehold.co/300x300/gray/white?text=No+Image";
        } catch (e) {
          return product.images;
        }
      } else if (Array.isArray(product.images) && product.images.length > 0) {
        return typeof product.images[0] === "object"
          ? product.images[0].url
          : product.images[0];
      }
    }
    return (
      product.image || "https://placehold.co/300x300/gray/white?text=No+Image"
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <article className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col transition-shadow hover:shadow-md">
      <Link
        to={`/product/${product.gender === "k" ? "women" : "men"}/${
          product.category_slug ||
          product.category?.toLowerCase().replace(/\s+/g, "-") ||
          "category"
        }/${product.id}`}
        className="block relative pb-[100%] overflow-hidden"
      >
        <img
          src={getProductImage()}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover object-center"
          onError={(e) => {
            e.target.src =
              "https://placehold.co/300x300/gray/white?text=No+Image";
          }}
        />
      </Link>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-medium text-gray-800">
            <Link
              to={`/product/${product.gender === "k" ? "women" : "men"}/${
                product.category_slug ||
                product.category?.toLowerCase().replace(/\s+/g, "-") ||
                "category"
              }/${product.id}`}
            >
              {product.name}
            </Link>
          </h2>
          <button
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-700 hover:text-red-500"
            aria-label="Add to wishlist"
          >
            <Heart className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= Math.round(product.rating || 0)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-2">
            ({product.rating_count || 0})
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description || "No description available"}
        </p>

        <div className="mt-auto">
          {product.discount_price ? (
            <div className="flex items-center gap-2">
              <p className="font-bold text-xl text-red-600">
                {formatPrice(product.discount_price)}
              </p>
              <p className="text-gray-400 line-through">
                {formatPrice(product.price)}
              </p>
            </div>
          ) : (
            <p className="font-bold text-xl text-gray-900">
              {formatPrice(product.price)}
            </p>
          )}
        </div>
      </div>
    </article>
  );
};

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) pages.push("...");
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex justify-center mt-8">
      <nav className="flex flex-wrap items-center gap-2">
        {currentPage > 1 && (
          <button
            onClick={() => onPageChange(currentPage - 1)}
            className="px-3 py-1 bg-white text-gray-700 hover:bg-gray-50 rounded-md"
          >
            Previous
          </button>
        )}

        {getPageNumbers().map((page, index) => (
          <React.Fragment key={index}>
            {page === "..." ? (
              <span className="px-2 text-gray-500">...</span>
            ) : (
              <button
                onClick={() => onPageChange(page)}
                className={`px-3 py-1 rounded-md ${
                  page === currentPage
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}

        {currentPage < totalPages && (
          <button
            onClick={() => onPageChange(currentPage + 1)}
            className="px-3 py-1 bg-white text-gray-700 hover:bg-gray-50 rounded-md"
          >
            Next
          </button>
        )}
      </nav>
    </div>
  );
};

export default ProductGrid;
