import React from "react";
import { Grid, List } from "lucide-react"; // Removed Search import

const ProductToolbar = ({
  displayedProducts,
  total,
  sortOption,
  setSortOption,
  viewMode,
  setViewMode,
  fetchFilteredProducts,
}) => {
  const handleSortChange = (e) => {
    const newSortOption = e.target.value;
    setSortOption(newSortOption);

    // Immediately apply the sorting and update URL
    fetchFilteredProducts({
      sort: newSortOption,
    });
  };

  return (
    <div className="flex flex-col mb-6 bg-white p-4 rounded-lg shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left - Product count */}
        <div className="text-sm text-gray-600">
          Showing {displayedProducts.length} of {total} products
        </div>

        {/* Right - Sort Controls and View Toggles */}
        <div className="flex flex-wrap gap-4">
          {/* Sort dropdown */}
          <select
            value={sortOption}
            onChange={handleSortChange}
            className="bg-gray-50 border border-gray-300 text-gray-700 py-2 px-4 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="featured">Featured</option>
            <option value="price:asc">Price: Low to High</option>
            <option value="price:desc">Price: High to Low</option>
            <option value="rating:desc">Rating: High to Low</option>
            <option value="rating:asc">Rating: Low to High</option>
            <option value="newest">Newest First</option>
            <option value="name:asc">Name: A to Z</option>
            <option value="name:desc">Name: Z to A</option>
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
