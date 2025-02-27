import React, { useRef, useEffect } from "react";
import { Search, X } from "lucide-react";

const SearchFilter = ({ value, onChange, onSearch }) => {
  const searchInputRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Delay'i 300ms'e düşürdük
    searchTimeoutRef.current = setTimeout(() => {
      onSearch();
    }, 300);
  };

  const clearSearch = () => {
    onChange("");
    onSearch();
    searchInputRef.current?.focus();
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={searchInputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          placeholder="Search products..."
          className="w-full pl-10 pr-10 py-2 border rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        {value && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchFilter;
