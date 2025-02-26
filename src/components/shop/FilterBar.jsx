import React from "react";
import { Search, ChevronDown, ChevronUp } from "lucide-react";

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
  history,
  showFilters,
  resetFilters,
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
              </button>
            </li>
            {categories &&
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
                    <span className="flex-1 truncate">{category.title}</span>
                    <span className="text-xs text-gray-400">
                      ({category.products_count || 0})
                    </span>
                  </button>
                </li>
              ))}
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
              onClick={() => dispatch(filterProducts())}
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
