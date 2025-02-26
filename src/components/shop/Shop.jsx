import React, { useState, useEffect } from "react";
import { Filter } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchCategories } from "../../store/actions/categoryActions";
import { fetchProducts } from "../../store/actions/productActions";

// Componentler
import ShopBreadcrumb from "./ShopBreadcrumb";
import GenderFilter from "./GenderFilter";
import CategoryGrid from "./CategoryGrid";
import FilterBar from "./FilterBar";
import ProductToolbar from "./ProductToolbar";
import ProductGrid from "./ProductGrid";

// Hooks - src/hooks klasöründen import ediliyor
import { useShopFilters } from "../../hooks/useShopFilters";

function Shop() {
  const dispatch = useDispatch();
  const { gender, categorySlug, categoryId } = useParams();

  // Redux state'leri
  const { productList, priceRange, filteredProducts, fetchState, total } =
    useSelector((state) => state.product);
  const { categories, loading: categoriesLoading } = useSelector(
    (state) => state.categories
  );

  // UI state'leri
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [expandedFilterSections, setExpandedFilterSections] = useState({
    categories: true,
    price: true,
  });

  // Custom hook ile filtreleme mantığı
  const {
    selectedCategory,
    setSelectedCategory,
    selectedGenderFilter,
    filterText,
    setFilterText,
    sortOption,
    setSortOption,
    page,
    priceValues,
    filteredCategories,
    navigateToCategory,
    handleGenderChange,
    fetchFilteredProducts,
    updateUrlWithFilters,
    handlePriceRangeChange,
    resetFilters,
    handlePageChange,
    itemsPerPage, // Hook'tan gelen değer
  } = useShopFilters({
    priceRange,
    gender,
    categoryId,
    categorySlug,
    categories,
  });

  // Kategorileri yükleme
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Filtreleme bölümlerini açıp kapatma
  const toggleFilterSection = (section) => {
    setExpandedFilterSections({
      ...expandedFilterSections,
      [section]: !expandedFilterSections[section],
    });
  };

  // Ürünleri yükleme
  useEffect(() => {
    fetchFilteredProducts();
  }, [fetchFilteredProducts]);

  // Kategori değiştiğinde ürünleri güncelle
  useEffect(() => {
    if (selectedCategory && selectedCategory !== "All") {
      const params = {
        limit: itemsPerPage,
        offset: 0,
        category_id: parseInt(selectedCategory),
      };

      dispatch(fetchProducts(params));
    }
  }, [selectedCategory, dispatch, itemsPerPage]);

  // Görüntülenen ürünler
  const displayedProducts = filteredProducts || productList || [];

  // Başlık belirleme
  const pageTitle = gender
    ? gender === "kadin"
      ? "Women's Collection"
      : "Men's Collection"
    : "All Products";

  // Yükleme durumu
  const isProductsLoading = fetchState === "FETCHING";

  // Toplam sayfa sayısı
  const totalPages = Math.ceil(total / 12);

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <ShopBreadcrumb
          gender={gender}
          categoryId={categoryId}
          categories={categories}
        />

        {/* Gender & Categories Section */}
        <section className="mb-8">
          <GenderFilter
            selectedGenderFilter={selectedGenderFilter}
            onGenderChange={handleGenderChange}
            title={pageTitle}
          />

          {/* Categories Grid - sadece bir cinsiyet seçildiğinde göster */}
          {selectedGenderFilter !== "all" && (
            <div className="flex flex-col mt-6">
              <h2 className="text-xl font-bold mb-4">Kategoriler</h2>
              <div className="">
                <CategoryGrid
                  categories={filteredCategories}
                  isLoading={categoriesLoading}
                  onCategoryClick={navigateToCategory}
                />
              </div>
            </div>
          )}
        </section>

        {/* Mobile filter button */}
        <div className="md:hidden mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center w-full py-2 px-4 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium transition-colors hover:bg-gray-50"
          >
            <Filter className="w-5 h-5 mr-2" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        {/* Ana içerik bölümünü flex tasarımına taşı */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar filters */}
          <FilterBar
            filterText={filterText}
            setFilterText={setFilterText}
            expandedFilterSections={expandedFilterSections}
            toggleFilterSection={toggleFilterSection}
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            navigateToCategory={navigateToCategory}
            priceValues={priceValues}
            handlePriceRangeChange={handlePriceRangeChange}
            priceRange={priceRange}
            dispatch={dispatch}
            sortOption={sortOption}
            history={history}
            showFilters={showFilters}
            resetFilters={resetFilters}
            setShowFilters={setShowFilters}
          />

          {/* Main content */}
          <main className="flex-1">
            {/* Toolbar */}
            <ProductToolbar
              displayedProducts={displayedProducts}
              total={total}
              filterText={filterText}
              setFilterText={setFilterText}
              sortOption={sortOption}
              setSortOption={setSortOption}
              viewMode={viewMode}
              setViewMode={setViewMode}
              updateUrlWithFilters={updateUrlWithFilters}
              fetchFilteredProducts={fetchFilteredProducts}
            />

            {/* Products Grid */}
            <ProductGrid
              isLoading={isProductsLoading}
              products={displayedProducts}
              viewMode={viewMode}
              totalPages={totalPages}
              page={page}
              handlePageChange={handlePageChange}
              resetFilters={resetFilters}
              itemsPerPage={12}
              categoryId={categoryId}
              filterText={filterText}
              sortOption={sortOption}
            />
          </main>
        </div>
      </div>
    </div>
  );
}

export default Shop;
