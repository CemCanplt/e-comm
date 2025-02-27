import React, { useRef, useEffect } from "react";
import { Search, ChevronDown, ChevronUp, X } from "lucide-react";

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
  sortOption,
  showFilters,
  resetFilters,
  setShowFilters,
  fetchFilteredProducts,
}) => {
  // Çeşitli referanslar
  const searchInputRef = useRef(null);
  const priceTimeoutRef = useRef(null);

  // Tek state olarak filterText kullanıyoruz ve direkt parent'tan geliyor
  // handleInputChange fonksiyonu direkt parent state'i güncelliyor
  const handleInputChange = (e) => {
    setFilterText(e.target.value);
  };

  // Enter tuşuna basıldığında veya Search butonuna tıklandığında arama yapılır
  const handleSearch = () => {
    console.log("Arama yapılıyor:", filterText);

    // API çağrısı yap
    fetchFilteredProducts({ filter: filterText });
  };

  // Enter tuşuna basıldığında arama yap
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  // Temizle butonuna tıklandığında
  const clearSearch = () => {
    // State'i temizle
    setFilterText("");

    // Input'a fokuslan
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }

    // Filtreyi temizle ve API çağrısı yap
    fetchFilteredProducts({ filter: "" });
    console.log("Filtre temizlendi");
  };

  // Component unmount olduğunda timer'ları temizle
  useEffect(() => {
    return () => {
      if (priceTimeoutRef.current) clearTimeout(priceTimeoutRef.current);
    };
  }, []);

  // Kategori seçimi
  const handleCategorySelect = (category) => {
    setSelectedCategory(category.id);
    navigateToCategory(category);

    if (window.innerWidth < 768) {
      setShowFilters && setShowFilters(false);
    }
  };

  // Fiyat aralığı değişikliği
  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    const newValue = Number(value);
    let newMin = priceValues[0];
    let newMax = priceValues[1];

    if (name === "min") {
      newMin = newValue;
      handlePriceRangeChange(e);
    } else {
      newMax = newValue;
      handlePriceRangeChange(e);
    }

    if (priceTimeoutRef.current) {
      clearTimeout(priceTimeoutRef.current);
    }

    priceTimeoutRef.current = setTimeout(() => {
      fetchFilteredProducts({ priceMin: newMin, priceMax: newMax });
    }, 500);
  };

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
        <div className="flex flex-col gap-2 w-full">
          <div className="relative w-full">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
            >
              <input
                ref={searchInputRef}
                type="text"
                value={filterText}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Search"
                className="w-full px-4 py-2 border rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </form>
            {filterText && (
              <button
                onClick={clearSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 hover:text-gray-600 rounded-full flex items-center justify-center hover:bg-gray-100"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button
            onClick={handleSearch}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-colors"
          >
            <Search size={20} />
          </button>
        </div>
      </div>

      {/* Diğer filtreler aynı kalıyor */}
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

            {categories?.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category)}
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
                  onChange={handlePriceChange}
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
                  onChange={handlePriceChange}
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
                onChange={(e) => {
                  handlePriceChange({
                    target: { name: "min", value: e.target.value },
                  });
                }}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer range-sm"
              />
              <input
                type="range"
                min={priceRange.min}
                max={priceRange.max}
                value={priceValues[1]}
                onChange={(e) => {
                  handlePriceChange({
                    target: { name: "max", value: e.target.value },
                  });
                }}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer range-sm"
              />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default FilterBar;
