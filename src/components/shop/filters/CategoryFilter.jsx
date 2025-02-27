import React from "react";

const CategoryFilter = ({ categories = [], selectedCategory, onChange }) => {
  // Kategorileri tekil hale getirme
  const uniqueCategories = categories.reduce((acc, current) => {
    const exists = acc.find((item) => item.title === current.title);
    if (!exists) {
      acc.push(current);
    }
    return acc;
  }, []);

  return (
    <div className="flex flex-col space-y-2">
      <button
        onClick={() => onChange(null)}
        className={`flex items-center justify-between w-full px-3 py-2 rounded-md transition-colors ${
          !selectedCategory
            ? "bg-blue-50 text-blue-700 font-medium"
            : "text-gray-700 hover:bg-gray-50"
        }`}
      >
        <span>All Categories</span>
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
          {categories.length}
        </span>
      </button>

      {uniqueCategories.map((category) => (
        <button
          key={category.id}
          onClick={() => onChange(category.id)}
          className={`flex items-center justify-between w-full px-3 py-2 rounded-md transition-colors ${
            selectedCategory === category.id
              ? "bg-blue-50 text-blue-700 font-medium"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          <span className="truncate">{category.title}</span>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full ml-2 flex-shrink-0">
            {category.productCount || 0}
          </span>
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
