import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { ChevronDown } from "lucide-react";

const ShopDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { categories } = useSelector((state) => state.categories);
  const womenCategories =
    categories?.filter((cat) => cat.gender === "k" || cat.genderCode === "k") ||
    [];
  const menCategories =
    categories?.filter((cat) => cat.gender === "e" || cat.genderCode === "e") ||
    [];

  // Handle document clicks to close dropdown when clicking outside
  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (isOpen && !event.target.closest(".shop-dropdown")) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleDocumentClick);
    return () => document.removeEventListener("click", handleDocumentClick);
  }, [isOpen]);

  // Helper function to get category image
  const getCategoryImage = (category) => {
    return (
      category.img ||
      `https://placehold.co/240x320/f5f5f5/939393?text=${category.title}`
    );
  };

  return (
    <div className="relative shop-dropdown">
      {/* Shop button with dropdown toggle */}
      <button
        className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 flex items-center gap-1"
        onClick={(e) => {
          e.stopPropagation(); // Prevent document click from immediately closing
          setIsOpen(!isOpen);
        }}
      >
        Shop
        <ChevronDown
          size={16}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div className="absolute left-0 bg-white z-50 mt-1 rounded-lg shadow-xl w-[840px] -translate-x-1/3">
          <div className="flex p-5 gap-6">
            {/* Women's Categories */}
            <div className="w-1/2">
              <div className="mb-3 border-b pb-2">
                <Link
                  to="/shop/kadin"
                  className="text-base font-semibold text-pink-600 hover:text-pink-700 flex items-center transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Women's Collection
                </Link>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {womenCategories.slice(0, 6).map((category) => (
                  <Link
                    key={category.id}
                    to={`/shop/kadin/${
                      category.slug ||
                      category.title.toLowerCase().replace(/\s+/g, "-")
                    }/${category.id}`}
                    className="group/item"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="relative rounded overflow-hidden aspect-[3/4] mb-1 group-hover/item:shadow-md transition-all">
                      <img
                        src={getCategoryImage(category)}
                        alt={category.title}
                        className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                        <p className="text-white px-2 py-1 text-xs font-medium">
                          {category.title}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-2 text-right">
                <Link
                  to="/shop/kadin"
                  className="text-pink-600 hover:text-pink-800 text-xs font-medium inline-block"
                  onClick={() => setIsOpen(false)}
                >
                  View All →
                </Link>
              </div>
            </div>

            {/* Men's Categories */}
            <div className="w-1/2">
              <div className="mb-3 border-b pb-2">
                <Link
                  to="/shop/erkek"
                  className="text-base font-semibold text-blue-600 hover:text-blue-700 flex items-center transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Men's Collection
                </Link>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {menCategories.slice(0, 6).map((category) => (
                  <Link
                    key={category.id}
                    to={`/shop/erkek/${
                      category.slug ||
                      category.title.toLowerCase().replace(/\s+/g, "-")
                    }/${category.id}`}
                    className="group/item"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="relative rounded overflow-hidden aspect-[3/4] mb-1 group-hover/item:shadow-md transition-all">
                      <img
                        src={getCategoryImage(category)}
                        alt={category.title}
                        className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                        <p className="text-white px-2 py-1 text-xs font-medium">
                          {category.title}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-2 text-right">
                <Link
                  to="/shop/erkek"
                  className="text-blue-600 hover:text-blue-800 text-xs font-medium inline-block"
                  onClick={() => setIsOpen(false)}
                >
                  View All →
                </Link>
              </div>
            </div>
          </div>

          {/* Simplified bottom panel with Shop All - Colored button */}
          <div className="bg-gray-50 rounded-b-lg py-3 px-4 border-t flex justify-center items-center">
            <Link
              to="/shop"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Shop All Products
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopDropdown;
