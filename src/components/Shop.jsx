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
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  setSortBy,
  setPriceRange,
  filterProducts,
} from "../store/reducers/productReducer";
import { fetchProducts } from "../store/actions/productActions";
import { useHistory, useParams } from "react-router-dom";
import { fetchCategories } from "../store/actions/categoryActions";

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
  // Resim URL'sini al (images array ise ilk elemanın URL'sini, değilse doğrudan image alanını)
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

  return (
    <div
      className={`bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer transition-all hover:shadow-md ${
        viewMode === "list" ? "flex" : ""
      }`}
      onClick={onClick}
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
      {/* Diğer içerikler değişmeden kalır */}
    </div>
  );
};

// Shop Component
function Shop() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { gender, categoryId } = useParams();
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
  const itemsPerPage = 12;

  // Check if products are loading
  const isProductsLoading = fetchState === "FETCHING";

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchProducts({ limit: itemsPerPage, offset: 0 }));
    dispatch(fetchCategories());
  }, [dispatch]);

  // Handle URL params
  useEffect(() => {
    if (categoryId) setSelectedCategory(parseInt(categoryId));
    if (gender === "kadin") setSelectedGenderFilter("k");
    else if (gender === "erkek") setSelectedGenderFilter("e");
  }, [categoryId, gender]);

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
    history.push(
      `/shop/${genderText}/${category.title.toLowerCase()}/${category.id}`
    );
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
    history.push("/shop");
    dispatch(filterProducts());
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setPage(newPage);
    const offset = (newPage - 1) * itemsPerPage;
    dispatch(fetchProducts({ limit: itemsPerPage, offset }));
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Calculate total pages
  const totalPages = Math.ceil(total / itemsPerPage);

  // Filtered data
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
          <aside
            className={`${
              showFilters ? "block" : "hidden"
            } md:block w-full md:w-64 bg-white p-5 rounded-lg shadow-sm sticky top-4 self-start transition-all duration-300 ease-in-out`}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Filters</h2>
              <button
                onClick={resetFilters}
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                Reset All
              </button>
            </div>

            {/* Categories filter */}
            <div className="mb-6 border-b pb-6">
              <div
                className="flex items-center justify-between cursor-pointer mb-4"
                onClick={() => toggleFilterSection("categories")}
              >
                <h3 className="font-bold text-gray-900">Categories</h3>
                {expandedFilterSections.categories ? (
                  <ChevronUp className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                )}
              </div>

              {expandedFilterSections.categories && (
                <ul className="space-y-2 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                  <li>
                    <button
                      onClick={() => {
                        setSelectedCategory("All");
                        history.push("/shop");
                      }}
                      className={`flex items-center w-full text-left py-1 px-2 rounded ${
                        selectedCategory === "All"
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <span className="flex-1">All Categories</span>
                      <span className="text-xs text-gray-400">({total})</span>
                    </button>
                  </li>
                  {categoriesLoading ? (
                    <li className="py-1 px-2 text-gray-400 italic">
                      Loading categories...
                    </li>
                  ) : (
                    categories.map((category) => (
                      <li key={category.id}>
                        <button
                          onClick={() => {
                            setSelectedCategory(category.id);
                            navigateToCategory(category);
                          }}
                          className={`flex items-center w-full text-left py-1 px-2 rounded ${
                            selectedCategory === category.id
                              ? "bg-blue-50 text-blue-600"
                              : "text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          <span className="flex-1 truncate">
                            {category.title}
                          </span>
                          <span className="text-xs text-gray-400">
                            ({category.products_count || 0})
                          </span>
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              )}
            </div>

            {/* Price range filter */}
            <div>
              <div
                className="flex items-center justify-between cursor-pointer mb-4"
                onClick={() => toggleFilterSection("price")}
              >
                <h3 className="font-bold text-gray-900">Price Range</h3>
                {expandedFilterSections.price ? (
                  <ChevronUp className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                )}
              </div>

              {expandedFilterSections.price && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="bg-gray-50 rounded px-3 py-2 w-[45%]">
                      <label className="block text-xs text-gray-500 mb-1">
                        Min
                      </label>
                      <input
                        type="number"
                        name="min"
                        value={priceValues[0]}
                        onChange={handlePriceRangeChange}
                        className="w-full bg-transparent focus:outline-none text-gray-900"
                        min={priceRange.min}
                        max={priceRange.max}
                      />
                    </div>
                    <span className="text-gray-300">—</span>
                    <div className="bg-gray-50 rounded px-3 py-2 w-[45%]">
                      <label className="block text-xs text-gray-500 mb-1">
                        Max
                      </label>
                      <input
                        type="number"
                        name="max"
                        value={priceValues[1]}
                        onChange={handlePriceRangeChange}
                        className="w-full bg-transparent focus:outline-none text-gray-900"
                        min={priceRange.min}
                        max={priceRange.max}
                      />
                    </div>
                  </div>

                  <div className="px-1">
                    <input
                      type="range"
                      min={priceRange.min}
                      max={priceRange.max}
                      value={priceValues[0]}
                      onChange={(e) =>
                        handlePriceRangeChange({
                          target: { name: "min", value: e.target.value },
                        })
                      }
                      className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer range-sm"
                    />
                    <input
                      type="range"
                      min={priceRange.min}
                      max={priceRange.max}
                      value={priceValues[1]}
                      onChange={(e) =>
                        handlePriceRangeChange({
                          target: { name: "max", value: e.target.value },
                        })
                      }
                      className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer range-sm"
                    />
                  </div>

                  <button
                    onClick={() => dispatch(filterProducts())}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                  >
                    Apply Filter
                  </button>
                </div>
              )}
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1">
            {/* Toolbar */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
                <div className="flex items-center">
                  <span className="text-gray-600 text-sm mr-2">
                    Showing {displayedProducts.length} of {total} products
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={sortBy}
                    onChange={(e) => dispatch(setSortBy(e.target.value))}
                    className="bg-gray-50 border border-gray-300 text-gray-700 py-2 px-4 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="newest">Newest</option>
                  </select>

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

            {/* Products */}
            {isProductsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg shadow-sm p-4 h-72"
                  >
                    <div className="bg-gray-200 h-40 mb-4 rounded"></div>
                    <div className="bg-gray-200 h-4 w-3/4 mb-2 rounded"></div>
                    <div className="bg-gray-200 h-4 w-1/2 mb-4 rounded"></div>
                    <div className="bg-gray-200 h-4 w-1/3 rounded"></div>
                  </div>
                ))}
              </div>
            ) : displayedProducts.length === 0 ? (
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
            ) : (
              <>
                <div
                  className={`${
                    viewMode === "list"
                      ? "space-y-4"
                      : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  }`}
                >
                  {displayedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      viewMode={viewMode}
                      onClick={() =>
                        history.push(`/shop/product/${product.id}`)
                      }
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
                        onClick={() =>
                          handlePageChange(Math.min(totalPages, page + 1))
                        }
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
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default Shop;
