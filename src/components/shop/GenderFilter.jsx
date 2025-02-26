import React from "react";

const GenderFilter = ({ selectedGenderFilter, onGenderChange, title }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
        {title}
      </h1>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onGenderChange("all")}
          className={`px-4 py-2 rounded-md transition-colors ${
            selectedGenderFilter === "all"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-100 border"
          }`}
        >
          All
        </button>
        <button
          onClick={() => onGenderChange("e")}
          className={`px-4 py-2 rounded-md transition-colors ${
            selectedGenderFilter === "e"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-100 border"
          }`}
        >
          Men
        </button>
        <button
          onClick={() => onGenderChange("k")}
          className={`px-4 py-2 rounded-md transition-colors ${
            selectedGenderFilter === "k"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-100 border"
          }`}
        >
          Women
        </button>
      </div>
    </div>
  );
};

export default GenderFilter;