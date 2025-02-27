import React, { useState } from "react";
import { useSelector } from "react-redux";
import FilterBar from "./filters/FilterBar";

const ShopFilterSection = ({
  filters,
  handleCategoryChange,
  handleTextSearch,
  handlePriceChange,
  resetFilters,
  applyFilters,
}) => {
  const [isFilterVisible, setIsFilterVisible] = useState(true);
  const { categories } = useSelector((state) => state.categories);

  // Mobil görünümde filtre toggle butonu
  const toggleFilters = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  return (
    <>
      <div className="md:hidden mb-6">
        <button
          onClick={toggleFilters}
          className="flex items-center justify-center w-full py-2 px-4 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium transition-colors hover:bg-gray-50"
        >
          {isFilterVisible ? "Filtreleri Gizle" : "Filtreleri Göster"}
        </button>
      </div>

      <aside className="col-span-12 md:col-span-3">
        <div
          className={`${
            isFilterVisible ? "block" : "hidden"
          } md:block w-full bg-white p-5 rounded-lg shadow-sm`}
        >
          <FilterBar
            filterText={filters.text}
            setFilterText={handleTextSearch}
            categories={categories}
            selectedCategory={filters.category}
            handleCategoryChange={handleCategoryChange}
            priceValues={filters.priceRange}
            handlePriceChange={handlePriceChange}
            resetFilters={resetFilters}
            applyFilters={applyFilters}
          />
        </div>
      </aside>
    </>
  );
};

export default ShopFilterSection;
