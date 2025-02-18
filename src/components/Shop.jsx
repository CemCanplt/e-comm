import { useState, useEffect } from "react";
import { Filter } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  setSortBy,
  setPriceRange,
  filterProducts,
  setProductList,
} from "../store/reducers/productReducer";
import { mockProducts, categories } from "../data/mockProducts";

function Shop() {
  const dispatch = useDispatch();
  const { productList, sortBy, priceRange, filteredProducts } = useSelector(
    (state) => state.product
  );

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [priceValues, setPriceValues] = useState([
    priceRange.current[0],
    priceRange.current[1],
  ]);

  // Initialize products on component mount
  useEffect(() => {
    dispatch(setProductList(mockProducts));
  }, [dispatch]);

  // Filter products by category and price
  const filterProductsByCategory = (products) => {
    if (selectedCategory === "All") return products;
    return products.filter((product) => product.category === selectedCategory);
  };

  // Price range change handler
  const handlePriceRangeChange = (e) => {
    const value = parseInt(e.target.value);
    const isMin = e.target.name === "min";
    let newValues = [...priceValues];

    if (isMin) {
      newValues[0] = Math.min(value, priceValues[1]);
    } else {
      newValues[1] = Math.max(value, priceValues[0]);
    }

    setPriceValues(newValues);
    dispatch(setPriceRange(newValues));
    dispatch(filterProducts());
  };

  // Category change handler
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  // Sort handler
  const handleSort = (e) => {
    dispatch(setSortBy(e.target.value));
  };

  // Get filtered and sorted products
  const displayedProducts = filterProductsByCategory(
    filteredProducts || productList
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Mobile Filter Button */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-center w-full py-2 px-4 bg-gray-100 rounded-lg text-gray-700 font-medium"
        >
          <Filter className="w-5 h-5 mr-2" />
          Filters
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters Sidebar */}
        <aside
          className={`${
            showFilters ? "block" : "hidden"
          } md:block w-full md:w-64 bg-white p-4 rounded-lg shadow-sm`}
        >
          <div className="space-y-6">
            {/* Categories */}
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`block w-full text-left px-3 py-2 rounded-lg 
                    ${
                      selectedCategory === category
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
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
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Sort and View Options */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <select
                value={sortBy}
                onChange={handleSort}
                className="w-full md:w-48 p-2 border rounded-lg"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest</option>
              </select>
            </div>

            {/* View Mode Toggles - Desktop Only */}
            <div className="hidden md:flex gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded ${
                  viewMode === "grid"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600"
                }`}
              >
                Grid View
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded ${
                  viewMode === "list"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600"
                }`}
              >
                List View
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div
            className={`grid ${
              viewMode === "grid"
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1"
            } gap-6`}
          >
            {displayedProducts.map((product) => (
              <div
                key={product.id}
                className={`bg-white rounded-lg shadow-sm overflow-hidden 
                ${viewMode === "list" ? "flex" : "block"}`}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className={`w-full object-cover ${
                    viewMode === "list" ? "w-48" : "h-48"
                  }`}
                />
                <div className="p-4">
                  <h3 className="font-bold text-gray-900">{product.name}</h3>
                  <p className="text-gray-600">{product.category}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {product.discount ? (
                        <>
                          <span className="text-red-600 font-bold">
                            ${product.discount}
                          </span>
                          <span className="text-gray-400 line-through">
                            ${product.price}
                          </span>
                        </>
                      ) : (
                        <span className="text-gray-900 font-bold">
                          ${product.price}
                        </span>
                      )}
                    </div>
                    <div className="text-yellow-400">
                      {"★".repeat(Math.floor(product.rating))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Shop;
