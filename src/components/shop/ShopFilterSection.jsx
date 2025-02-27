import React from "react";
import { Filter } from "lucide-react";
import FilterBar from "./FilterBar";
import { useSelector } from "react-redux";

const MobileFilterButton = ({ showFilters, setShowFilters }) => (
  <div className="md:hidden mb-6">
    <button
      onClick={() => setShowFilters(!showFilters)}
      className="flex items-center justify-center w-full py-2 px-4 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium transition-colors hover:bg-gray-50"
    >
      <Filter className="mr-2 h-5 w-5" />
      {showFilters ? "Hide Filters" : "Show Filters"}
    </button>
  </div>
);

// Props ile geçirelim, useContext kullanımını kaldıralım
const ShopFilterSection = ({
  filters,
  expandedFilterSections,
  toggleFilterSection,
  handleCategoryChange,
  handleTextSearch,
  handlePriceChange,
  resetFilters,
  ui,
  setUi,
  filteredCategories,
  applyFilters,
}) => {
  const { priceRange } = useSelector((state) => state.product);

  return (
    <>
      <MobileFilterButton
        showFilters={ui.showFilters}
        setShowFilters={(showFilters) =>
          setUi((prev) => ({ ...prev, showFilters }))
        }
      />

      <aside className="col-span-12 md:col-span-3">
        <div
          className={`${
            ui.showFilters ? "block" : "hidden"
          } md:block w-full bg-white p-5 rounded-lg shadow-sm`}
        >
          <FilterBar
            filterText={filters.text}
            setFilterText={(text) => handleTextSearch(text)}
            expandedFilterSections={expandedFilterSections}
            toggleFilterSection={toggleFilterSection}
            categories={filteredCategories}
            selectedCategory={filters.category}
            handleCategoryChange={handleCategoryChange}
            priceValues={filters.priceRange}
            handlePriceRangeChange={handlePriceChange}
            priceRange={priceRange || { min: 0, max: 1000 }}
            resetFilters={resetFilters}
            applyTextFilter={() => applyFilters()}
          />
        </div>
      </aside>
    </>
  );
};

export default ShopFilterSection;
