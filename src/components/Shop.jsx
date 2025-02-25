import { useState, useEffect } from "react";
import { Filter } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  setSortBy,
  setPriceRange,
  filterProducts,
  setProductList,
} from "../store/reducers/productReducer";
import { mockProducts } from "../data/mockProducts";
import { useHistory, useParams, Link } from "react-router-dom";
import { fetchCategories } from "../store/actions/categoryActions";

function Shop() {
  const dispatch = useDispatch();
  const { productList, sortBy, priceRange, filteredProducts } = useSelector(
    (state) => state.product
  );
  const { categories, loading } = useSelector((state) => state.categories);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [priceValues, setPriceValues] = useState([
    priceRange.current[0],
    priceRange.current[1],
  ]);
  const [selectedGenderFilter, setSelectedGenderFilter] = useState("all");

  const history = useHistory();
  const { gender, categoryName, categoryId } = useParams();

  // Fetch products and categories on component mount
  useEffect(() => {
    dispatch(setProductList(mockProducts));
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (categoryId) {
      setSelectedCategory(categoryId);
    }

    // Update gender filter based on URL params
    if (gender === "kadin") {
      setSelectedGenderFilter("k");
    } else if (gender === "erkek") {
      setSelectedGenderFilter("e");
    }
  }, [categoryId, gender]);

  const filterProductsByCategory = (products) =>
    selectedCategory === "All"
      ? products
      : products.filter(({ category }) => category === selectedCategory);

  const handlePriceRangeChange = (e) => {
    const value = parseInt(e.target.value);
    const index = e.target.name === "min" ? 0 : 1;
    const newValues = priceValues.map((v, i) => (i === index ? value : v));

    if (newValues[0] > newValues[1]) {
      newValues[index] = priceValues[index];
    } else {
      setPriceValues(newValues);
      dispatch(setPriceRange(newValues));
      dispatch(filterProducts());
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleSort = (e) => {
    dispatch(setSortBy(e.target.value));
  };

  const displayedProducts = filterProductsByCategory(
    filteredProducts || productList
  );

  // Filter categories based on selected gender
  const filteredCategories = categories
    ? selectedGenderFilter === "all"
      ? categories
      : categories.filter(
          (category) => category.gender === selectedGenderFilter
        )
    : [];

  // Function to navigate to category
  const navigateToCategory = (category) => {
    const genderText = category.gender === "k" ? "kadin" : "erkek";
    history.push(
      `/shop/${genderText}/${category.title.toLowerCase()}/${category.id}`
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Featured Categories Section */}
      <section className="mb-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Featured Categories</h2>

          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <button
              onClick={() => setSelectedGenderFilter("all")}
              className={`px-4 py-2 rounded-md transition-colors ${
                selectedGenderFilter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedGenderFilter("e")}
              className={`px-4 py-2 rounded-md transition-colors ${
                selectedGenderFilter === "e"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Men
            </button>
            <button
              onClick={() => setSelectedGenderFilter("k")}
              className={`px-4 py-2 rounded-md transition-colors ${
                selectedGenderFilter === "k"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Women
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2">Loading categories...</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-4">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <div
                  key={category.id}
                  className="relative rounded-lg overflow-hidden shadow-md cursor-pointer transition-transform hover:scale-105 flex-grow flex-shrink-0 basis-full sm:basis-[calc(50%-0.5rem)] md:basis-[calc(33.333%-0.67rem)] lg:basis-[calc(20%-0.8rem)]"
                  onClick={() => navigateToCategory(category)}
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
                      <span className="ml-1 text-white text-sm">
                        {category.rating}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full text-center py-8">
                No categories found for the selected filter.
              </div>
            )}
          </div>
        )}
      </section>

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
        <aside
          className={`${
            showFilters ? "block" : "hidden"
          } md:block w-full md:w-64 bg-white p-4 rounded-lg shadow-sm`}
        >
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Categories</h3>
              <ul className="list-none max-h-80 overflow-y-auto">
                <li>
                  <button
                    onClick={() => handleCategoryChange("All")}
                    className={`block w-full text-left px-3 py-2 rounded-lg ${
                      selectedCategory === "All"
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    All Categories
                  </button>
                </li>
                {loading ? (
                  <li className="px-3 py-2">Loading categories...</li>
                ) : (
                  categories.map((category) => (
                    <li key={category.id}>
                      <button
                        onClick={() => {
                          handleCategoryChange(category.id);
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
                    className="w-full"
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
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1">
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

          {displayedProducts.length === 0 ? (
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
                <div
                  key={product.id}
                  onClick={() => history.push(`/shop/product/${product.id}`)}
                  className={`bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer
                  transition-transform hover:scale-105 
                  ${viewMode === "list" ? "flex" : "block"}`}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className={`${
                      viewMode === "list" ? "w-48" : "w-full h-48"
                    } object-cover`}
                  />
                  <div className="p-4 flex-1">
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
          )}
        </main>
      </div>
    </div>
  );
}

export default Shop;
