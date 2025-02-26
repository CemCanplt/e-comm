

const CategoryCard = ({ category, onClick }) => (
  <div
    className="relative rounded-lg overflow-hidden shadow-md cursor-pointer transition-transform hover:scale-105 flex-grow flex-shrink-0 basis-full sm:basis-[calc(50%-0.5rem)] md:basis-[calc(33.333%-0.67rem)] lg:basis-[calc(25%-0.75rem)]"
    onClick={onClick}
  >
    <div className="aspect-w-16 aspect-h-9">
      <img
        src={
          category.img ||
          `https://placehold.co/600x400/23a6f0/ffffff?text=${category.title}`
        }
        alt={category.title}
        className="w-full h-40 object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
    </div>
    <div className="absolute bottom-0 left-0 right-0 p-4">
      <h3 className="text-white font-bold text-lg">{category.title}</h3>
      <div className="flex items-center">
        <span className="text-yellow-400 text-sm">
          {"★".repeat(Math.floor(category.rating || 4))}
        </span>
        <span className="ml-1 text-white text-xs">
          {category.productCount || 0} products
        </span>
      </div>
    </div>
  </div>
);

const CategoryGrid = ({ categories, isLoading, onCategoryClick }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-lg h-40"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {categories.length > 0 ? (
        categories
          .slice(0, 8)
          .map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onClick={() => onCategoryClick(category)}
            />
          ))
      ) : (
        <div className="col-span-full text-center py-8 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500">No categories found.</p>
        </div>
      )}
    </div>
  );
};

export default CategoryGrid;