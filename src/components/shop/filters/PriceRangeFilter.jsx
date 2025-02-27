import React, { useState } from "react";

const PriceRangeFilter = ({ onChange }) => {
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const handleApplyFilter = () => {
    const min = minPrice === "" ? 0 : Number(minPrice);
    const max = maxPrice === "" ? null : Number(maxPrice);

    if (max !== null && min > max) {
      // Eğer minimum fiyat maksimumdan büyükse, değerleri değiştir
      onChange([max, min]);
    } else {
      onChange([min, max || 999999]);
    }
  };

  return (
    <div className="px-2 py-4 space-y-4">
      <div className="space-y-4">
        <div>
          <label
            htmlFor="minPrice"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Minimum Price
          </label>
          <input
            type="number"
            id="minPrice"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full px-3 py-2 border rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="$0"
            min="0"
          />
        </div>

        <div>
          <label
            htmlFor="maxPrice"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Maximum Price
          </label>
          <input
            type="number"
            id="maxPrice"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full px-3 py-2 border rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="No limit"
            min="0"
          />
        </div>
      </div>

      <button
        onClick={handleApplyFilter}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
      >
        Apply Price Filter
      </button>
    </div>
  );
};

export default PriceRangeFilter;
