import React from "react";

// Skeleton loader component
const CategorySkeleton = () => (
  <div className="w-full sm:w-1/2 md:w-1/3 xl:w-1/6 p-2">
    <div className="relative rounded-lg aspect-[3/4] bg-gray-200 animate-pulse shadow-md">
      <div className="absolute bottom-0 p-4 w-full">
        <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
      </div>
    </div>
  </div>
);

const CategoryCard = ({ category, onClick }) => (
  <div className="w-full sm:w-1/2 md:w-1/3 xl:w-1/6 p-2">
    <div
      className="relative rounded-lg overflow-hidden shadow-md cursor-pointer transition-all hover:scale-105 hover:shadow-lg aspect-[3/4]"
      onClick={() => onClick(category)}
    >
      <img
        src={
          category.img ||
          `https://placehold.co/600x800/23a6f0/ffffff?text=${category.title}`
        }
        alt={category.title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
        <h3 className="text-white font-bold text-lg">{category.title}</h3>
        <div className="flex items-center">
          <span className="text-yellow-400 text-sm">
            {"★".repeat(Math.floor(category.rating || 4))}
          </span>
          <span className="ml-1 text-white text-xs">
            {category.productCount || 0} ürün
          </span>
        </div>
      </div>
    </div>
  </div>
);

const CategoryGrid = ({ categories, isLoading, onCategoryClick }) => {
  if (isLoading) {
    return (
      <div className="flex flex-wrap -mx-2">
        {[...Array(6)].map((_, i) => (
          <CategorySkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap -mx-2">
      {categories && categories.length > 0 ? (
        categories
          .slice(0, 12)
          .map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onClick={onCategoryClick}
            />
          ))
      ) : (
        <div className="w-full text-center py-8 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500">Kategori bulunamadı.</p>
        </div>
      )}
    </div>
  );
};

export default CategoryGrid;
