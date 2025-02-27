import React, { useRef } from "react";
import { Search, X } from "lucide-react";

const SearchFilter = ({ filterText, setFilterText, applyFilter }) => {
  const searchInputRef = useRef(null);

  const handleInputChange = (e) => {
    setFilterText(e.target.value);
  };

  const handleSearch = () => {
    applyFilter(filterText);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const clearSearch = () => {
    setFilterText("");

    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }

    applyFilter("");
  };

  return (
    <div className="mb-6 border-b pb-6">
      <div className="flex items-center justify-between mb-4">
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
              placeholder="Search products"
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
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchFilter;
