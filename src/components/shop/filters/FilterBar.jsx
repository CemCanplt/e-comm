import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import SearchFilter from "./SearchFilter";
import CategoryFilter from "./CategoryFilter";
import PriceRangeFilter from "./PriceRangeFilter";

const FilterSection = ({ title, isExpanded, onToggle, children }) => (
  <div className="py-4 border-b border-gray-200 last:border-0">
    <button
      className="flex items-center justify-between w-full text-left"
      onClick={onToggle}
    >
      <h3 className="text-sm font-medium text-gray-900">{title}</h3>
      {isExpanded ? (
        <ChevronUp className="h-5 w-5 text-gray-500" />
      ) : (
        <ChevronDown className="h-5 w-5 text-gray-500" />
      )}
    </button>
    {isExpanded && <div className="mt-4">{children}</div>}
  </div>
);

const FilterBar = ({
  categories,
  selectedCategory,
  filterText,
  setFilterText,
  handleCategoryChange,
  handlePriceChange,
  resetFilters,
}) => {
  const [expandedSections, setExpandedSections] = useState({
    search: true,
    categories: true,
    price: true,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        <button
          onClick={resetFilters}
          className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          Reset Filters
        </button>
      </div>

      <div className="flex flex-col space-y-4">
        <FilterSection
          title="Search"
          isExpanded={expandedSections.search}
          onToggle={() => toggleSection("search")}
        >
          <SearchFilter
            value={filterText}
            onChange={setFilterText}
            onSearch={() => {}}
          />
        </FilterSection>

        <FilterSection
          title="Categories"
          isExpanded={expandedSections.categories}
          onToggle={() => toggleSection("categories")}
        >
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onChange={handleCategoryChange}
          />
        </FilterSection>

        <FilterSection
          title="Price Range"
          isExpanded={expandedSections.price}
          onToggle={() => toggleSection("price")}
        >
          <PriceRangeFilter onChange={handlePriceChange} />
        </FilterSection>
      </div>
    </div>
  );
};

export default FilterBar;
