import React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

const CategoryFilter = ({
  expandedFilterSections,
  toggleFilterSection,
  categories,
  selectedCategory,
  handleCategorySelect,
  navigateToCategory,
  setShowFilters
}) => {
  // Kategori seçimini yönet
  const onSelectCategory = (category) => {
    handleCategorySelect(category);

    if (window.innerWidth < 768) {
      setShowFilters && setShowFilters(false);
    }
  };

  return (
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
        <div className="space-y-2 max-h-72 overflow-y-auto">
          <button
            onClick={() => navigateToCategory({ id: "all" })}
            className={`flex w-full items-center justify-between px-3 py-2 text-sm rounded-md ${
              selectedCategory === "All"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <span className="font-medium">All Categories</span>
          </button>

          {/* Filtrelenmiş kategorileri göster */}
          {categories?.map((category) => (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category)}
              className={`flex w-full items-center justify-between px-3 py-2 text-sm rounded-md ${
                selectedCategory === category.id
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center">
                <span>{category.title}</span>
              </div>
              <span className="text-xs text-gray-500 bg-gray-50 rounded-full px-2 py-1">
                {category.productCount || 0}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;