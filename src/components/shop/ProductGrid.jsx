import React from "react";
import { Link } from "react-router-dom";
import { Heart, Star, Search } from "lucide-react";

const ProductGrid = ({
  products = [],
  viewMode = "grid",
  isLoading,
  totalPages,
  page = 1,
  handlePageChange,
  resetFilters,
  selectedGenderFilter,
  filterText,
  categories = [],
}) => {
  // İlk yükleme durumunda boş durum gösterme
  if (isLoading || fetchState === "FETCHING") {
    return (
      <div className="py-12 flex justify-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

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
            ? `No products found matching "${filterText}"`
            : selectedGenderFilter === "k"
            ? "No products found in women's category"
            : selectedGenderFilter === "e"
            ? "No products found in men's category"
            : "No products match your current filters"}
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

  // Function to get gender type based on product's category
  const getGenderType = (productCategoryId) => {
    if (!categories || categories.length === 0) return "kadin";

    const category = categories.find((cat) => cat.id === productCategoryId);
    if (category) {
      return (category.gender || category.genderCode) === "k"
        ? "kadin"
        : "erkek";
    }

    return "kadin"; // Default to women's category
  };

  // Function to get category slug
  const getCategorySlug = (productCategoryId) => {
    if (!categories || categories.length === 0) return "category";

    const category = categories.find((cat) => cat.id === productCategoryId);
    if (category) {
      return (
        category.slug ||
        category.title
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "")
      );
    }

    return "category";
  };

  // Get proper product image
  const getProductImage = (product) => {
    if (product.images) {
      if (typeof product.images === "string") {
        try {
          const parsed = JSON.parse(product.images);
          return Array.isArray(parsed) && parsed.length > 0
            ? parsed[0]
            : product.image || "https://via.placeholder.com/300";
        } catch (e) {
          return product.images;
        }
      } else if (Array.isArray(product.images) && product.images.length > 0) {
        if (typeof product.images[0] === "object") {
          return product.images[0].url || "https://via.placeholder.com/300";
        }
        return product.images[0];
      }
    }

    return product.image || "https://via.placeholder.com/300";
  };

  return (
    <div className="space-y-6">
      {/* Products grid */}
      <div
        className={`grid ${
          viewMode === "grid"
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            : "grid-cols-1 gap-4"
        }`}
      >
        {products.map((product) => {
          const genderType = getGenderType(product.category_id);
          const categorySlug = getCategorySlug(product.category_id);
          const productImage = getProductImage(product);

          return viewMode === "grid" ? (
            <GridCard
              key={product.id}
              product={product}
              genderType={genderType}
              categorySlug={categorySlug}
              productImage={productImage}
            />
          ) : (
            <ListCard
              key={product.id}
              product={product}
              genderType={genderType}
              categorySlug={categorySlug}
              productImage={productImage}
            />
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="flex flex-wrap items-center gap-2">
            {/* Previous button */}
            {page > 1 && (
              <button
                onClick={() => handlePageChange(page - 1)}
                className="px-3 py-1 bg-white text-gray-700 hover:bg-gray-50 rounded-md"
              >
                &lt;
              </button>
            )}

            {/* First page */}
            {page > 3 && (
              <>
                <button
                  onClick={() => handlePageChange(1)}
                  className="px-3 py-1 bg-white text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  1
                </button>
                {page > 4 && <span className="px-1">...</span>}
              </>
            )}

            {/* Pages around current page */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              return pageNum > 0 && pageNum <= totalPages ? pageNum : null;
            })
              .filter(Boolean)
              .map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-1 rounded-md ${
                    pageNum === page
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </button>
              ))}

            {/* Last page */}
            {page < totalPages - 2 && (
              <>
                {page < totalPages - 3 && <span className="px-1">...</span>}
                <button
                  onClick={() => handlePageChange(totalPages)}
                  className="px-3 py-1 bg-white text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  {totalPages}
                </button>
              </>
            )}

            {/* Next button */}
            {page < totalPages && (
              <button
                onClick={() => handlePageChange(page + 1)}
                className="px-3 py-1 bg-white text-gray-700 hover:bg-gray-50 rounded-md"
              >
                &gt;
              </button>
            )}
          </nav>
        </div>
      )}
    </div>
  );
};

// Product Grid Card View
const GridCard = ({ product, genderType, categorySlug, productImage }) => (
  <article className="group bg-white rounded-lg shadow-sm overflow-hidden transition-shadow hover:shadow-md flex flex-col">
    <div className="relative">
      <Link to={`/product/${genderType}/${categorySlug}/${product.id}`}>
        <img
          src={productImage}
          alt={product.name}
          className="w-full h-52 object-cover object-center"
        />
      </Link>
      <button
        className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white backdrop-blur-sm text-gray-700 hover:text-red-500"
        aria-label="Add to wishlist"
      >
        <Heart className="h-5 w-5" />
      </button>
    </div>

    <div className="p-4 flex flex-col flex-grow">
      <h2 className="text-sm font-medium text-gray-700 line-clamp-1 mb-1">
        <Link to={`/product/${genderType}/${categorySlug}/${product.id}`}>
          {product.name}
        </Link>
      </h2>

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

      <div className="flex items-center justify-between mt-auto">
        <p className="font-bold text-gray-900">
          ${product.price ? parseFloat(product.price).toFixed(2) : "0.00"}
        </p>
      </div>
    </div>
  </article>
);

// Product List Card View
const ListCard = ({ product, genderType, categorySlug, productImage }) => (
  <article className="bg-white rounded-lg shadow-sm overflow-hidden flex transition-shadow hover:shadow-md">
    <Link
      to={`/product/${genderType}/${categorySlug}/${product.id}`}
      className="w-32 h-32 md:w-48 md:h-48 flex-shrink-0"
    >
      <img
        src={productImage}
        alt={product.name}
        className="w-full h-full object-cover object-center"
      />
    </Link>

    <div className="p-4 flex flex-col flex-grow">
      <div className="flex justify-between">
        <h2 className="text-lg font-medium text-gray-800 mb-2">
          <Link to={`/product/${genderType}/${categorySlug}/${product.id}`}>
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

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {product.description || "No description available"}
      </p>

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

      <div className="mt-auto pt-2 flex justify-between items-center">
        <p className="font-bold text-xl text-gray-900">
          ${product.price ? parseFloat(product.price).toFixed(2) : "0.00"}
        </p>
      </div>
    </div>
  </article>
);

export default ProductGrid;
