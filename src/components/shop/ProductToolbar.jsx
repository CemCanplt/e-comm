import React from "react";
import { ArrowUpDown } from "lucide-react";

const ProductToolbar = ({ total, sortOption, onSortChange }) => {
  const handleSortChange = (e) => {
    onSortChange(e.target.value);
  };

  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "price:asc", label: "Price: Low to High" },
    { value: "price:desc", label: "Price: High to Low" },
    { value: "rating:desc", label: "Most Rated" },
    { value: "rating:asc", label: "Least Rated" },
    { value: "newest", label: "Newest First" },
    { value: "name:asc", label: "Name: A to Z" },
    { value: "name:desc", label: "Name: Z to A" },
  ];

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-white rounded-lg shadow-sm mb-6">
      <div className="mb-4 md:mb-0">
        <p className="text-gray-600">
          <span className="font-medium text-gray-900">{total}</span> products
          found
        </p>
      </div>

      <div className="relative">
        <div className="flex items-center p-2 border rounded-md bg-white">
          <ArrowUpDown className="w-5 h-5 text-gray-400 mr-2" />
          <select
            value={sortOption}
            onChange={handleSortChange}
            className="appearance-none bg-transparent pr-8 py-1 focus:outline-none text-gray-700"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ProductToolbar;
