import { useState, useEffect } from "react";
import { Filter } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  setSortBy,
  setPriceRange,
  filterProducts,
} from "../store/reducers/productReducer";
import { fetchProducts } from "../store/actions/productActions";
import { useHistory, useParams } from "react-router-dom";
import { fetchCategories } from "../store/actions/categoryActions";

// Alt bileşenler
const CategoryCard = ({ category, onClick }) => (
  <div
    className="relative rounded-lg overflow-hidden shadow-md cursor-pointer transition-transform hover:scale-105 flex-grow flex-shrink-0 basis-full sm:basis-[calc(50%-0.5rem)] md:basis-[calc(33.333%-0.67rem)] lg:basis-[calc(20%-0.8rem)]"
    onClick={onClick}
  >
    <img
      src={category.img}
      alt={category.title}
      className="w-full h-40 object-cover"
    />
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
      <h3 className="text-white font-bold">{category.title}</h3>
      <div className="flex items-center text-yellow-400">
        {"★".repeat(Math.floor(category.rating))}
        <span className="ml-1 text-white text-sm">{category.rating}</span>
      </div>
    </div>
  </div>
);

const ProductCard = ({ product, viewMode, onClick }) => (
  <div
    onClick={onClick}
    className={`bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer transition-transform hover:scale-105 ${
      viewMode === "list" ? "flex" : "block"
    }`}
  >
    <img
      src={
        product.image || "https://placehold.co/300x300/gray/white?text=No+Image"
      }
      alt={product.name}
      className={`${viewMode === "list" ? "w-48" : "w-full h-48"} object-cover`}
    />
    <div className="p-4 flex-1">
      <h3 className="font-bold text-gray-900">{product.name}</h3>
      <p className="text-gray-600">{product.category || "Uncategorized"}</p>
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {product.discount_price ? (
            <>
              <span className="text-red-600 font-bold">
                ${product.discount_price}
              </span>
              <span className="text-gray-400 line-through">
                ${product.price}
              </span>
            </>
          ) : (
            <span className="text-gray-900 font-bold">${product.price}</span>
          )}
        </div>
        <div className="text-yellow-400">
          {"★".repeat(Math.floor(product.rating || 0))}
        </div>
      </div>
    </div>
  </div>
);

function Shop() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { gender, categoryId } = useParams();
  const { productList, sortBy, priceRange, filteredProducts, fetchState } =
    useSelector((state) => state.product);
  const { categories, loading: categoriesLoading } = useSelector(
    (state) => state.categories
  );

  // State
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [priceValues, setPriceValues] = useState([
    priceRange.current[0],
    priceRange.current[1],
  ]);
  const [selectedGenderFilter, setSelectedGenderFilter] = useState("all");

  // Check if products are loading
  const isProductsLoading = fetchState === "FETCHING";

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  // Handle URL params
  useEffect(() => {
    if (categoryId) setSelectedCategory(categoryId);
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

  // Filtered data
  const filteredCategories = categories
    ? selectedGenderFilter === "all"
      ? categories
      : categories.filter((cat) => cat.gender === selectedGenderFilter)
    : [];

  const displayedProducts =
    selectedCategory === "All"
      ? filteredProducts || productList
      : (filteredProducts || productList).filter(
          (p) => p.category_id === parseInt(selectedCategory)
        );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Gender Filter */}
      <section className="mb-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Featured Categories</h2>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            {["all", "e", "k"].map((gender) => (
              <button
                key={gender}
                onClick={() => setSelectedGenderFilter(gender)}
                className={`px-4 py-2 rounded-md ${
                  selectedGenderFilter === gender
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {gender === "all" ? "All" : gender === "e" ? "Men" : "Women"}
              </button>
            ))}
          </div>
        </div>

        {/* Categories */}
        {categoriesLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2">Loading categories...</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-4">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  onClick={() => navigateToCategory(category)}
                />
              ))
            ) : (
              <div className="w-full text-center py-8">
                No categories found.
              </div>
            )}
          </div>
        )}
      </section>

      {/* Mobile filter button */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setShowFilters((prev) => !prev)}
          className="flex items-center justify-center w-full py-2 px-4 bg-gray-100 rounded-lg text-gray-700 font-medium"
        >
          <Filter className="w-5 h-5 mr-2" />
          Filters
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar filters */}
        <aside
          className={`${
            showFilters ? "block" : "hidden"
          } md:block w-full md:w-64 bg-white p-4 rounded-lg shadow-sm`}
        >
          {/* Categories filter */}
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Categories</h3>
              <ul className="list-none max-h-80 overflow-y-auto">
                <li>
                  <button
                    onClick={() => setSelectedCategory("All")}
                    className={`block w-full text-left px-3 py-2 rounded-lg ${
                      selectedCategory === "All"
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    All Categories
                  </button>
                </li>
                {categoriesLoading ? (
                  <li className="px-3 py-2">Loading categories...</li>
                ) : (
                  categories.map((category) => (
                    <li key={category.id}>
                      <button
                        onClick={() => {
                          setSelectedCategory(category.id);
                          navigateToCategory(category);
                        }}
                        className={`block w-full text-left px-3 py-2 rounded-lg ${
                          selectedCategory === category.id
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {category.title}
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>

            {/* Price range filter */}
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Price Range</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <input
                    type="number"
                    name="min"
                    value={priceValues[0]}
                    onChange={handlePriceRangeChange}
                    className="w-full p-2 border rounded"
                    min={priceRange.min}
                    max={priceRange.max}
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    name="max"
                    value={priceValues[1]}
                    onChange={handlePriceRangeChange}
                    className="w-full p-2 border rounded"
                    min={priceRange.min}
                    max={priceRange.max}
                  />
                </div>
                <div className="space-y-2">
                  {["min", "max"].map((type, i) => (
                    <input
                      key={type}
                      type="range"
                      min={priceRange.min}
                      max={priceRange.max}
                      value={priceValues[i]}
                      onChange={(e) =>
                        handlePriceRangeChange({
                          target: { name: type, value: e.target.value },
                        })
                      }
                      className="w-full"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1">
          {/* Sorting and view controls */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <select
              value={sortBy}
              onChange={(e) => dispatch(setSortBy(e.target.value))}
              className="w-full md:w-48 p-2 border rounded-lg"
            >
              {["featured", "price-low", "price-high", "newest"].map(
                (option) => (
                  <option key={option} value={option}>
                    {option === "featured"
                      ? "Featured"
                      : option === "price-low"
                      ? "Price: Low to High"
                      : option === "price-high"
                      ? "Price: High to Low"
                      : "Newest"}
                  </option>
                )
              )}
            </select>

            <div className="hidden md:flex gap-2">
              {["grid", "list"].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`p-2 rounded ${
                    viewMode === mode
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600"
                  }`}
                >
                  {mode === "grid" ? "Grid View" : "List View"}
                </button>
              ))}
            </div>
          </div>

          {/* Products */}
          {isProductsLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600">Loading products...</p>
            </div>
          ) : displayedProducts.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">
                No products found with the current filters.
              </p>
            </div>
          ) : (
            <div
              className={`grid ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1"
              } gap-6`}
            >
              {displayedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  viewMode={viewMode}
                  onClick={() => history.push(`/shop/product/${product.id}`)}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Shop;
