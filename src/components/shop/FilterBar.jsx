import React from "react";
import FilterHeader from "./filters/FilterHeader";
import SearchFilter from "./filters/SearchFilter";
import CategoryFilter from "./filters/CategoryFilter";
import PriceRangeFilter from "./filters/PriceRangeFilter";

const FilterBar = ({
  categories,
  selectedCategory,
  filterText,
  setFilterText,
  applyTextFilter,
  expandedFilterSections,
  toggleFilterSection,
  handleCategoryChange,
  priceValues,
  handlePriceRangeChange,
  applyPriceFilter,
  priceRange,
  resetFilters,
}) => {
  return (
    <>
      <FilterHeader title="Filters" onReset={resetFilters} />

      <SearchFilter
        filterText={filterText}
        setFilterText={setFilterText}
        applyFilter={applyTextFilter}
      />

      <CategoryFilter
        expandedFilterSections={expandedFilterSections}
        toggleFilterSection={toggleFilterSection}
        categories={categories}
        selectedCategory={selectedCategory}
        handleCategoryChange={handleCategoryChange}
      />

      <PriceRangeFilter
        expandedFilterSections={expandedFilterSections}
        toggleFilterSection={toggleFilterSection}
        priceValues={priceValues}
        handlePriceRangeChange={handlePriceRangeChange}
        priceRange={priceRange}
        applyPriceFilter={applyPriceFilter}
      />
    </>
  );
};

export default FilterBar;
