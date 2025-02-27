// src/components/shop/filters/FilterHeader.jsx
import React from "react";

const FilterHeader = ({ title, onReset }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      <button
        onClick={onReset}
        className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
      >
        Reset All
      </button>
    </div>
  );
};

export default FilterHeader;
