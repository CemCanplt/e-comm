import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { ArrowLeft, ArrowRight, Search } from "lucide-react"; // Bu satırı ekleyin
import LoadingSpinner from "../common/LoadingSpinner";
import { fetchProducts } from "../../store/actions/productActions";

const ProductCard = ({ product, viewMode, onClick }) => {
  const history = useHistory();
  const categories = useSelector((state) => state.categories.categories);

  // Fix image handling
  const getProductImage = (product) => {
    if (!product)
      return "https://placehold.co/300x300/gray/white?text=No+Image";

    if (product.images) {
      if (typeof product.images === "string") {
        try {
          return JSON.parse(product.images)[0];
        } catch (e) {
          return product.images;
        }
      } else if (Array.isArray(product.images)) {
        if (product.images[0] && typeof product.images[0] === "object") {
          return (
            product.images[0].url ||
            "https://placehold.co/300x300/gray/white?text=No+Image"
          );
        }
        return product.images[0];
      }
    }

    return (
      product.image || "https://placehold.co/300x300/gray/white?text=No+Image"
    );
  };

  // Improved navigation function using React Router
  const handleProductClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Bu kategori ID'sini kullanarak categoryInfo'yu al
    if (product.category_id) {
      // Redux'tan kategorileri al
      const category = categories.find((cat) => cat.id === product.category_id);

      if (category) {
        // Kategori bilgilerini kullan
        const genderText = category.genderCode === "k" ? "kadin" : "erkek";
        const slug =
          category.slug ||
          category.title
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "");

        // URL oluştur - product ile başlayan URL
        const productUrl = `/product/${genderText}/${slug}/${product.id}`;
        console.log("Navigating to:", productUrl);

        history.push(productUrl);
      } else {
        // Kategori bulunamadıysa fallback çözüm
        const gender = product.gender === "k" ? "kadin" : "erkek";
        const defaultSlug =
          product.category?.toLowerCase().replace(/[^a-z0-9-]/g, "-") ||
          "kategori";

        history.push(`/product/${gender}/${defaultSlug}/${product.id}`);
      }
    } else {
      // Son çare - sadece ID'ye göre URL
      history.push(`/product/kategori/urun/${product.id}`);
    }

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
          src={getProductImage(product)}
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
  handlePageChange: parentHandlePageChange, // Rename the prop
  resetFilters,
  itemsPerPage,
  categoryId,
  filterText,
  sortOption,
  selectedGenderFilter,
}) => {
  const dispatch = useDispatch();
  const [currentPage, setPage] = useState(page);

  // Update the handlePageChange function
  const handlePageChange = (newPage) => {
    setPage(newPage);

    // Preserve current filters and sort when changing pages
    const params = {
      limit: itemsPerPage,
      offset: (newPage - 1) * itemsPerPage,
      category_id: categoryId ? parseInt(categoryId) : undefined,
      filter: filterText || undefined,
      sort: sortOption !== "featured" ? sortOption : undefined,
    };

    dispatch(fetchProducts(params));

    // Call parent handler if provided
    if (parentHandlePageChange) {
      parentHandlePageChange(newPage);
    }

    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <LoadingSpinner message="Loading products..." />
      </div>
    );
  }

  // No products found display
  if (products.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-lg shadow-sm">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
          <Search className="h-10 w-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Ürün Bulunamadı
        </h3>
        <p className="text-gray-500 mb-6">
          {filterText
            ? `"${filterText}" ile ilgili ürün bulunamadı.`
            : selectedGenderFilter === "k"
            ? "Kadın ürünleri kategorisinde ürün bulunamadı."
            : selectedGenderFilter === "e"
            ? "Erkek ürünleri kategorisinde ürün bulunamadı."
            : "Filtrelerinize uygun ürün bulunamadı."}
        </p>
        <button
          onClick={resetFilters}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Filtreleri Temizle
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
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-2 rounded ${
                currentPage === 1
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
                (currentPage - 3 <= i && i <= currentPage + 1)
              ) {
                return (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`w-10 h-10 flex items-center justify-center rounded-full ${
                      currentPage === i + 1
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {i + 1}
                  </button>
                );
              } else if (
                (i === 1 && currentPage > 4) ||
                (i === totalPages - 2 && currentPage < totalPages - 4)
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
              onClick={() =>
                handlePageChange(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className={`px-3 py-2 rounded ${
                currentPage === totalPages
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
