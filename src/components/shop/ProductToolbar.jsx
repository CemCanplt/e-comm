import React from "react";
import { Grid, List, ArrowUpDown } from "lucide-react";

const ProductToolbar = ({
  total,
  sortOption,
  setSortOption,
  viewMode,
  setViewMode,
}) => {
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-white rounded-lg shadow-sm mb-6">
      <div className="mb-4 md:mb-0">
        <p className="text-gray-600">
          <span className="font-medium text-gray-900">{total}</span> products
          found
        </p>
      </div>

      <div className="flex flex-col md:flex-row w-full md:w-auto gap-3">
        <div className="relative">
          <div className="flex items-center p-2 border rounded-md bg-white">
            <ArrowUpDown className="w-5 h-5 text-gray-400 mr-2" />
            <select
              value={sortOption}
              onChange={handleSortChange}
              className="appearance-none bg-transparent pr-8 py-1 focus:outline-none text-gray-700"
            >
              <option value="featured">Featured</option>
              <option value="price:asc">Price: Low to High</option>
              <option value="price:desc">Price: High to Low</option>
              <option value="rating:desc">Highest Rated</option>
              <option value="rating:asc">Lowest Rated</option>
            </select>
          </div>
        </div>

        <div className="flex border rounded-md">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-l-md ${
              viewMode === "grid" ? "bg-gray-100" : "bg-white hover:bg-gray-50"
            }`}
            aria-label="Grid view"
          >
            <Grid className="w-5 h-5 text-gray-700" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-r-md ${
              viewMode === "list" ? "bg-gray-100" : "bg-white hover:bg-gray-50"
            }`}
            aria-label="List view"
          >
            <List className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductToolbar;
