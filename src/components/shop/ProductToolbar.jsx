import React from "react";
import { Search, Grid, List } from "lucide-react";

const ProductToolbar = ({
  displayedProducts,
  total,
  filterText,
  setFilterText,
  sortOption,
  setSortOption,
  viewMode,
  setViewMode,
  updateUrlWithFilters,
  fetchFilteredProducts
}) => {
  return (
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
            onSubmit={(e) => {
              e.preventDefault();
              updateUrlWithFilters();
              fetchFilteredProducts();
            }}
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
            <button
              type="submit"
              className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Filter
            </button>
          </form>

          {/* Sort Select */}
          <select
            value={sortOption}
            onChange={(e) => {
              setSortOption(e.target.value);
              setTimeout(() => {
                updateUrlWithFilters();
                fetchFilteredProducts();
              }, 0);
            }}
            className="bg-gray-50 border border-gray-300 text-gray-700 py-2 px-4 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="featured">Featured</option>
            <option value="price:asc">Price: Low to High</option>
            <option value="price:desc">Price: High to Low</option>
            <option value="rating:asc">Rating: Low to High</option>
            <option value="rating:desc">Rating: High to Low</option>
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
  );
};

export default ProductToolbar;