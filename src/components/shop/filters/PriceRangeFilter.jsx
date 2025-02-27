import React, { useRef, useEffect } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

const PriceRangeFilter = ({
  expandedFilterSections,
  toggleFilterSection,
  priceValues,
  handlePriceRangeChange,
  priceRange,
  fetchFilteredProducts
}) => {
  const priceTimeoutRef = useRef(null);

  // Component unmount olduğunda timer'ları temizle
  useEffect(() => {
    return () => {
      if (priceTimeoutRef.current) clearTimeout(priceTimeoutRef.current);
    };
  }, []);

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

    // Zamanlayıcı ile debounce yaparak API çağrısını geciktir
    if (priceTimeoutRef.current) {
      clearTimeout(priceTimeoutRef.current);
    }

    priceTimeoutRef.current = setTimeout(() => {
      // API'yi çağır - fiyat filtresini sunucu tarafında uygula
      fetchFilteredProducts({
        priceMin: newMin,
        priceMax: newMax,
        offset: 0, // Önemli: Sayfa 1'e dön
      });
    }, 500);
  };

  return (
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
  );
};

export default PriceRangeFilter;