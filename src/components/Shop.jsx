import { useState, useEffect } from "react";
import { Filter } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { fetchCategories } from "../store/actions/categoryActions";
import { fetchProducts } from "../store/actions/productActions";
import { setGenderFilter } from "../store/reducers/productReducer";

// Components
import ShopBreadcrumb from "./shop/ShopBreadcrumb";
import GenderFilter from "./shop/GenderFilter";
import FilterBar from "./shop/FilterBar";
import ProductToolbar from "./shop/ProductToolbar";
import ProductGrid from "./shop/ProductGrid";

// Services
import GenderFilterService from "../services/GenderFilterService";

function Shop() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { gender, categorySlug, categoryId } = useParams();

  // Redux store state
  const { productList, priceRange, total, fetchState } = useSelector(
    (state) => state.product
  );
  const { categories } = useSelector((state) => state.categories);

  // UI state
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [expandedFilterSections, setExpandedFilterSections] = useState({
    categories: true,
    price: true,
  });

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedGenderFilter, setSelectedGenderFilter] = useState(
    gender === "kadin" ? "k" : gender === "erkek" ? "e" : "all"
  );
  const [filterText, setFilterText] = useState("");
  const [sortOption, setSortOption] = useState("featured");
  const [page, setPage] = useState(1);
  const [priceValues, setPriceValues] = useState([
    priceRange?.min || 0,
    priceRange?.max || 1000,
  ]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Loading state
  const isProductsLoading = fetchState === "FETCHING";

  // Load categories
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Load initial products
  useEffect(() => {
    const params = { limit: 12, offset: 0 };

    if (gender) {
      params.gender = gender === "kadin" ? "k" : "e";
      setSelectedGenderFilter(params.gender);
    }

    if (categoryId) {
      params.category_id = parseInt(categoryId);
      setSelectedCategory(parseInt(categoryId));
    }

    dispatch(fetchProducts(params));
  }, [dispatch, gender, categoryId]);

  // Apply local gender filtering
  useEffect(() => {
    if (productList?.length) {
      const filtered = GenderFilterService.filterProductsByGender(
        productList,
        categories,
        selectedGenderFilter === "all" ? null : selectedGenderFilter
      );
      setFilteredProducts(filtered);
    }
  }, [productList, categories, selectedGenderFilter]);

  // Handle gender filter change
  const handleGenderChange = (gender) => {
    if (
      (gender === "all" && selectedGenderFilter === "all") ||
      gender === selectedGenderFilter
    ) {
      return;
    }

    // Update local state
    setSelectedGenderFilter(gender);
    setPage(1);

    // Update Redux state
    dispatch(setGenderFilter(gender === "all" ? null : gender));

    // Update URL
    const newUrl =
      gender === "all"
        ? "/shop"
        : `/shop/${gender === "k" ? "kadin" : "erkek"}`;
    history.push(newUrl);

    // Reset category if one is selected
    if (selectedCategory !== "All") {
      setSelectedCategory("All");
    }

    // Fetch products from server with gender filter
    const params = {
      limit: 12,
      offset: 0,
    };

    if (gender !== "all") {
      params.gender = gender;
    }

    dispatch(fetchProducts(params));
  };

  // Toggle filter sections
  const toggleFilterSection = (section) => {
    setExpandedFilterSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Handle price range change
  const handlePriceRangeChange = (e) => {
    const { name, value } = e.target;
    const newValue = Number(value);

    setPriceValues((prev) =>
      name === "min" ? [newValue, prev[1]] : [prev[0], newValue]
    );
  };

  // Apply filters with API call
  const applyFilters = () => {
    const params = {
      limit: 12,
      offset: (page - 1) * 12,
    };

    if (selectedCategory !== "All") params.category_id = selectedCategory;
    if (selectedGenderFilter !== "all") params.gender = selectedGenderFilter;
    if (filterText) params.filter = filterText;
    if (sortOption !== "featured") params.sort = sortOption;
    if (priceValues[0] > (priceRange?.min || 0))
      params.priceMin = priceValues[0];
    if (priceValues[1] < (priceRange?.max || 1000))
      params.priceMax = priceValues[1];

    dispatch(fetchProducts(params));
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });

    const params = {
      limit: 12,
      offset: (newPage - 1) * 12,
    };

    if (selectedGenderFilter !== "all") params.gender = selectedGenderFilter;
    if (selectedCategory !== "All") params.category_id = selectedCategory;

    dispatch(fetchProducts(params));
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedCategory("All");
    setSelectedGenderFilter("all");
    setFilterText("");
    setSortOption("featured");
    setPriceValues([priceRange?.min || 0, priceRange?.max || 1000]);
    setPage(1);
    history.push("/shop");
    dispatch(fetchProducts({ limit: 12, offset: 0 }));
  };

  // Handle category selection
  const handleCategorySelect = (category) => {
    if (category.id === "all") {
      setSelectedCategory("All");

      const url =
        selectedGenderFilter !== "all"
          ? `/shop/${selectedGenderFilter === "k" ? "kadin" : "erkek"}`
          : "/shop";

      history.push(url);
    } else {
      setSelectedCategory(category.id);

      const genderCode = category.gender || category.genderCode || "e";
      const genderText = genderCode === "k" ? "kadin" : "erkek";

      const slug =
        category.slug ||
        category.title
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "");

      history.push(`/shop/${genderText}/${slug}/${category.id}`);
    }

    const params = { limit: 12, offset: 0 };

    if (category.id !== "all") {
      params.category_id = category.id;

      if (category.gender || category.genderCode) {
        const genderCode = category.gender || category.genderCode;
        params.gender = genderCode;
        setSelectedGenderFilter(genderCode);
      }
    }

    dispatch(fetchProducts(params));
  };

  // Page title based on gender
  const pageTitle = gender
    ? gender === "kadin"
      ? "Women's Collection"
      : "Men's Collection"
    : "All Products";

  const totalPages = Math.ceil(total / 12);
  const displayedProducts =
    filteredProducts.length > 0 ? filteredProducts : productList || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <ShopBreadcrumb
        gender={gender}
        categorySlug={categorySlug}
        category={
          selectedCategory !== "All" && categories
            ? categories.find((cat) => cat.id === selectedCategory)
            : null
        }
      />

      {/* Gender Filter */}
      <section className="mb-8">
        <GenderFilter
          selectedGenderFilter={selectedGenderFilter}
          onGenderChange={handleGenderChange}
          title={pageTitle}
        />
      </section>

      {/* Mobile filter button */}
      <div className="md:hidden mb-6">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-center w-full py-2 px-4 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium transition-colors hover:bg-gray-50"
        >
          <Filter className="w-5 h-5 mr-2" />
          {showFilters ? "Filtreleri Gizle" : "Filtreleri Göster"}
        </button>
      </div>

      {/* Main content area */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar filters */}
        <FilterBar
          filterText={filterText}
          setFilterText={setFilterText}
          expandedFilterSections={expandedFilterSections}
          toggleFilterSection={toggleFilterSection}
          categories={categories}
          selectedCategory={selectedCategory}
          handleCategorySelect={handleCategorySelect}
          priceValues={priceValues}
          handlePriceRangeChange={handlePriceRangeChange}
          priceRange={priceRange}
          sortOption={sortOption}
          setSortOption={setSortOption}
          showFilters={showFilters}
          resetFilters={resetFilters}
          setShowFilters={setShowFilters}
          applyFilters={applyFilters}
        />

        {/* Main content */}
        <main className="flex-1">
          <ProductToolbar
            displayedProducts={displayedProducts}
            total={total}
            sortOption={sortOption}
            setSortOption={setSortOption}
            viewMode={viewMode}
            setViewMode={setViewMode}
            applyFilters={applyFilters}
          />

          <ProductGrid
            isLoading={isProductsLoading}
            products={displayedProducts}
            viewMode={viewMode}
            totalPages={totalPages}
            page={page}
            handlePageChange={handlePageChange}
            resetFilters={resetFilters}
            selectedGenderFilter={selectedGenderFilter}
            filterText={filterText}
          />
        </main>
      </div>
    </div>
  );
}

export default Shop;
