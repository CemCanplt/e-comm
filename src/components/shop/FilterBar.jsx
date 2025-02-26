import React from "react";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import { fetchProducts } from "../../store/actions/productActions";

const FilterBar = ({
  filterText,
  setFilterText,
  expandedFilterSections,
  toggleFilterSection,
  categories,
  selectedCategory,
  setSelectedCategory,
  navigateToCategory,
  priceValues,
  handlePriceRangeChange,
  priceRange,
  dispatch,
  filterProducts,
  sortOption, // Add the missing sortOption prop
  history,
  showFilters,
  resetFilters,
  setShowFilters, // Add the missing setShowFilters prop
}) => {
  return (
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

      {/* Search Filter */}
      <div className="mb-6 border-b pb-6">
        <div className="flex items-center justify-between cursor-pointer mb-4">
          <h3 className="font-bold text-gray-900">Search</h3>
        </div>
        <div className="relative">
          <input
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-9 pr-4 py-2 border rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
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
          <div className="space-y-2 max-h-60 overflow-y-auto">
            <button
              onClick={() => navigateToCategory({ id: "all" })}
              className={`block w-full text-left px-3 py-2 text-sm rounded-md ${
                selectedCategory === "All"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              All Categories
            </button>

            {categories?.map((category) => (
              <button
                key={category.id}
                onClick={() => navigateToCategory(category)}
                className={`block w-full text-left px-3 py-2 text-sm rounded-md ${
                  selectedCategory === category.id
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {category.title}
                <span className="text-xs text-gray-500 ml-1">
                  ({category.gender === "k" ? "W" : "M"})
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Price Range filter */}
      <div className="mb-6 border-b pb-6">
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
                <label className="block text-xs text-gray-500 mb-1">Min</label>
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
                <label className="block text-xs text-gray-500 mb-1">Max</label>
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
              onClick={() => {
                dispatch(filterProducts());
                // Use the sortOption prop when dispatching
                dispatch(
                  fetchProducts({
                    limit: 12,
                    offset: 0,
                    category_id:
                      selectedCategory !== "All" ? selectedCategory : "",
                    filter: filterText,
                    sort:
                      sortOption && sortOption !== "featured" ? sortOption : "",
                  })
                );
                // Close filters on mobile after applying
                if (window.innerWidth < 768) {
                  setShowFilters && setShowFilters(false);
                }
              }}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
            >
              Apply Filter
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default FilterBar;
