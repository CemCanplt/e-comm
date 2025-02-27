import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchCategories } from "../store/actions/categoryActions";
import ShopHeader from "./shop/ShopHeader";
import ShopFilterSection from "./shop/ShopFilterSection";
import ShopProducts from "./shop/ShopProducts";

// Custom hooks
import useShopFilters from "../hooks/useShopFilters";

function Shop() {
  const dispatch = useDispatch();
  const { gender, categorySlug, categoryId } = useParams();
  const { categories } = useSelector((state) => state.categories);

  // Default UI state as a fallback
  const [defaultUi, setDefaultUi] = useState({
    viewMode: "grid",
    showFilters: false,
    expandedSections: {
      categories: true,
      price: true,
    },
  });

  // Use the custom hook for filter management
  const {
    filters,
    ui,
    setUi,
    handleGenderChange,
    handleCategoryChange,
    handleTextSearch,
    handleSortChange,
    handlePriceChange,
    handlePageChange,
    resetFilters,
    toggleFilterSection,
    filteredCategories,
    applyFilters,
  } = useShopFilters({ gender, categoryId, categories }) || {};

  // Fetch categories on mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // useEffect içinde başlangıç veri çekme işlemini ekleyin:
  useEffect(() => {
    // Sayfa ilk yüklendiğinde tüm ürünleri çek
    dispatch(fetchProducts({ limit: 12, offset: 0 }));
  }, [dispatch]);

  // Initialize filters from URL params
  useEffect(() => {
    if (categories?.length > 0) {
      // Set gender filter from URL
      if (gender && handleGenderChange) {
        const genderCode = gender === "kadin" ? "k" : "e";
        handleGenderChange(genderCode);
      }

      // Set category filter from URL
      if (categoryId && handleCategoryChange) {
        handleCategoryChange(categoryId);
      }
    }
  }, [
    categories,
    gender,
    categoryId,
    handleGenderChange,
    handleCategoryChange,
  ]);

  // Page title calculation
  const pageTitle = gender
    ? gender === "kadin"
      ? "Women's Collection"
      : "Men's Collection"
    : "All Products";

  // Use either the hook's UI state or the default UI state
  const currentUi = ui || defaultUi;
  const setCurrentUi = setUi || setDefaultUi;

  // Use safe default values for filters
  const currentFilters = filters || {
    gender: gender ? (gender === "kadin" ? "k" : "e") : "all",
    category: categoryId ? parseInt(categoryId) : "All",
    text: "",
    sort: "featured",
    page: 1,
    priceRange: [0, 1000],
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Shop header with breadcrumb and gender filters */}
      <ShopHeader
        gender={gender}
        categorySlug={categorySlug}
        category={categories?.find((c) => c.id === currentFilters.category)}
        selectedGenderFilter={currentFilters.gender}
        handleGenderChange={handleGenderChange || (() => {})}
        pageTitle={pageTitle}
      />

      {/* Mobile filter toggle button */}
      <div className="md:hidden mb-6">
        <button
          onClick={() =>
            setCurrentUi((prev) => ({
              ...prev,
              showFilters: !currentUi.showFilters,
            }))
          }
          className="flex items-center justify-center w-full py-2 px-4 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium transition-colors hover:bg-gray-50"
        >
          {currentUi.showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Filter sidebar */}
        <ShopFilterSection
          filters={currentFilters}
          ui={currentUi}
          setUi={setCurrentUi}
          expandedFilterSections={currentUi.expandedSections}
          toggleFilterSection={toggleFilterSection || (() => {})}
          handleCategoryChange={handleCategoryChange || (() => {})}
          handleTextSearch={handleTextSearch || (() => {})}
          handlePriceChange={handlePriceChange || (() => {})}
          resetFilters={resetFilters || (() => {})}
          filteredCategories={filteredCategories || []}
          applyFilters={applyFilters || (() => {})}
        />

        {/* Product grid area */}
        <ShopProducts
          filters={currentFilters}
          ui={currentUi}
          setUi={setCurrentUi}
          handleSortChange={handleSortChange || (() => {})}
          handlePageChange={handlePageChange || (() => {})}
          resetFilters={resetFilters || (() => {})}
          selectedGenderFilter={currentFilters.gender}
          sortOption={currentFilters.sort}
          viewMode={currentUi.viewMode}
          setViewMode={(mode) =>
            setCurrentUi((prev) => ({ ...prev, viewMode: mode }))
          }
          filterText={currentFilters.text}
        />
      </div>
    </div>
  );
}

export default Shop;
