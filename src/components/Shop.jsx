import { useState, useEffect } from "react";
import {
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  Grid,
  List,
  ArrowLeft,
  ArrowRight,
  Search,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  setSortBy,
  setPriceRange,
  filterProducts,
} from "../store/reducers/productReducer";
import { fetchProducts } from "../store/actions/productActions";
import { Link, useHistory, useParams } from "react-router-dom";
import { fetchCategories } from "../store/actions/categoryActions";
import FilterBar from "./shop/FilterBar";
import ProductGrid from "./shop/ProductGrid";

// Category Card Component
const CategoryCard = ({ category, onClick }) => (
  <div
    className="relative rounded-lg overflow-hidden shadow-md cursor-pointer transition-transform hover:scale-105 flex-grow flex-shrink-0 basis-full sm:basis-[calc(50%-0.5rem)] md:basis-[calc(33.333%-0.67rem)] lg:basis-[calc(25%-0.75rem)]"
    onClick={onClick}
  >
    <div className="aspect-w-16 aspect-h-9">
      <img
        src={
          category.img ||
          `https://placehold.co/600x400/23a6f0/ffffff?text=${category.title}`
        }
        alt={category.title}
        className="w-full h-40 object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
    </div>
    <div className="absolute bottom-0 left-0 right-0 p-4">
      <h3 className="text-white font-bold text-lg">{category.title}</h3>
      <div className="flex items-center">
        <span className="text-yellow-400 text-sm">
          {"★".repeat(Math.floor(category.rating || 4))}
        </span>
        <span className="ml-1 text-white text-xs">
          {category.products_count || 0} products
        </span>
      </div>
    </div>
  </div>
);

// Product Card Component
const ProductCard = ({ product, viewMode, onClick }) => {
  // Get history object for navigation
  const history = useHistory();

  // Existing getImageUrl function
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

  // Yönlendirme işlevi - sorunun asıl çözümü burada
  const handleProductClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Önce konsola URL'i yazdıralım
    const productUrl = `/shop/product/${product.id}`;
    console.log("Navigating to:", productUrl);

    // Doğrudan window.location kullanarak yönlendirme yapalım
    window.location.href = productUrl;

    // onClick callback'ini çağıralım
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

      {/* Product information container */}
      <div className={`p-4 ${viewMode === "list" ? "w-2/3" : ""}`}>
        <h3 className="font-medium text-gray-900 mb-2 truncate">
          {product.name}
        </h3>

        {/* Flex container for rating and price information */}
        <div className="flex justify-between items-center">
          {/* Price information */}
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

          {/* Star rating */}
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

// Shop Component
function Shop() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { gender, categoryName, categoryId } = useParams();
  const {
    productList,
    sortBy,
    priceRange,
    filteredProducts,
    fetchState,
    total,
  } = useSelector((state) => state.product);
  const { categories, loading: categoriesLoading } = useSelector(
    (state) => state.categories
  );

  // State
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [expandedFilterSections, setExpandedFilterSections] = useState({
    categories: true,
    price: true,
  });
  const [priceValues, setPriceValues] = useState([
    priceRange.current[0],
    priceRange.current[1],
  ]);
  const [selectedGenderFilter, setSelectedGenderFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [filterText, setFilterText] = useState("");
  const [sortOption, setSortOption] = useState("featured");
  const itemsPerPage = 12;

  // Check if products are loading
  const isProductsLoading = fetchState === "FETCHING";

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Handle URL params and fetch products based on them
  useEffect(() => {
    // Set states based on URL parameters
    if (categoryId) setSelectedCategory(parseInt(categoryId));
    if (gender === "kadin") setSelectedGenderFilter("k");
    else if (gender === "erkek") setSelectedGenderFilter("e");

    // Build query parameters for API request
    const params = {
      limit: itemsPerPage,
      offset: (page - 1) * itemsPerPage,
    };

    // Add category filter if present
    if (categoryId) params.category_id = categoryId;

    // Add sort parameter if present (and not default)
    if (sortOption && sortOption !== "featured") {
      // Convert UI sort option to API format
      switch (sortOption) {
        case "price-low":
          params.sort = "price:asc";
          break;
        case "price-high":
          params.sort = "price:desc";
          break;
        case "newest":
          params.sort = "created_at:desc";
          break;
        case "rating-high":
          params.sort = "rating:desc";
          break;
        default:
          break;
      }
    }

    // Add text filter if present
    if (filterText) params.filter = filterText;

    // Fetch products with all applied parameters
    dispatch(fetchProducts(params));
  }, [dispatch, categoryId, gender, page, sortOption, filterText]);

  // Event handlers
  const handlePriceRangeChange = (e) => {
    const value = parseInt(e.target.value);
    const index = e.target.name === "min" ? 0 : 1;
    const newValues = [...priceValues];
    newValues[index] = value;

    if (newValues[0] <= newValues[1]) {
      setPriceValues(newValues);
      dispatch(setPriceRange(newValues));
      dispatch(filterProducts());
    }
  };

  const navigateToCategory = (category) => {
    const genderText = category.gender === "k" ? "kadin" : "erkek";
    // Navigate while preserving other query params
    history.push(
      `/shop/${genderText}/${category.title.toLowerCase()}/${category.id}`
    );
    // Category ID will trigger a new fetch in the useEffect
  };

  const toggleFilterSection = (section) => {
    setExpandedFilterSections({
      ...expandedFilterSections,
      [section]: !expandedFilterSections[section],
    });
  };

  const resetFilters = () => {
    setPriceValues([priceRange.min, priceRange.max]);
    dispatch(setPriceRange([priceRange.min, priceRange.max]));
    setSelectedCategory("All");
    setSelectedGenderFilter("all");
    setFilterText("");
    setSortOption("featured");
    history.push("/shop");
    // This will trigger a new fetch via useEffect
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setPage(newPage);
    // Page change will trigger a new fetch via useEffect with adjusted offset
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Apply filter handler
  const handleApplyFilter = (e) => {
    e.preventDefault();
    // Filter application is handled by the state changes and useEffect
  };

  // Calculate total pages
  const totalPages = Math.ceil(total / itemsPerPage);

  // Filtered data for UI display
  const filteredCategories = categories
    ? selectedGenderFilter === "all"
      ? categories
      : categories.filter((cat) => cat.gender === selectedGenderFilter)
    : [];

  const displayedProducts = filteredProducts || productList || [];

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <ol className="flex items-center space-x-1">
            <li>
              <a
                href="/"
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                Home
              </a>
            </li>
            <li className="text-gray-500">/</li>
            <li>
              <a
                href="/shop"
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                Shop
              </a>
            </li>
            {gender && (
              <>
                <li className="text-gray-500">/</li>
                <li className="text-gray-700 font-medium">
                  {gender === "kadin" ? "Women" : "Men"}
                </li>
              </>
            )}
            {categoryId && (
              <>
                <li className="text-gray-500">/</li>
                <li className="text-gray-700 font-medium truncate max-w-[150px]">
                  {categories?.find((c) => c.id === parseInt(categoryId))
                    ?.title || "Category"}
                </li>
              </>
            )}
          </ol>
        </nav>

        {/* Gender & Categories Section */}
        <section className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
              {gender
                ? gender === "kadin"
                  ? "Women's Collection"
                  : "Men's Collection"
                : "All Products"}
            </h1>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  setSelectedGenderFilter("all");
                  history.push("/shop");
                }}
                className={`px-4 py-2 rounded-md transition-colors ${
                  selectedGenderFilter === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100 border"
                }`}
              >
                All
              </button>
              <button
                onClick={() => {
                  setSelectedGenderFilter("e");
                  history.push("/shop/erkek");
                }}
                className={`px-4 py-2 rounded-md transition-colors ${
                  selectedGenderFilter === "e"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100 border"
                }`}
              >
                Men
              </button>
              <button
                onClick={() => {
                  setSelectedGenderFilter("k");
                  history.push("/shop/kadin");
                }}
                className={`px-4 py-2 rounded-md transition-colors ${
                  selectedGenderFilter === "k"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100 border"
                }`}
              >
                Women
              </button>
            </div>
          </div>

          {/* Categories */}
          {categoriesLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-40"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredCategories.length > 0 ? (
                filteredCategories
                  .slice(0, 8)
                  .map((category) => (
                    <CategoryCard
                      key={category.id}
                      category={category}
                      onClick={() => navigateToCategory(category)}
                    />
                  ))
              ) : (
                <div className="col-span-full text-center py-8 bg-white rounded-lg shadow-sm">
                  <p className="text-gray-500">No categories found.</p>
                </div>
              )}
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
            filterProducts={filterProducts}
            history={history}
            showFilters={showFilters}
            resetFilters={resetFilters}
          />

          {/* Main content */}
          <main className="flex-1">
            {/* Toolbar - Updated for search and sort */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
                <div className="flex items-center">
                  <span className="text-gray-600 text-sm mr-2">
                    Showing {displayedProducts.length} of {total} products
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Filter/Search Input */}
                  <form
                    onSubmit={handleApplyFilter}
                    className="flex items-center"
                  >
                    <div className="relative">
                      <input
                        type="text"
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                        placeholder="Search products..."
                        className="pl-9 pr-4 py-2 border rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </form>

                  {/* Sort Select - Updated with more options */}
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-700 py-2 px-4 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="newest">Newest</option>
                    <option value="rating-high">Highest Rated</option>
                  </select>

                  {/* View Mode Toggles */}
                  <div className="border rounded-md flex">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 ${
                        viewMode === "grid"
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <Grid className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 ${
                        viewMode === "list"
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <List className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid - Now using the ProductGrid component */}
            <ProductGrid
              isLoading={isProductsLoading}
              products={displayedProducts}
              viewMode={viewMode}
              totalPages={totalPages}
              page={page}
              handlePageChange={handlePageChange}
              resetFilters={resetFilters}
            />
          </main>
        </div>
      </div>
    </div>
  );
}

export default Shop;
