import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Loader } from "lucide-react";
import { fetchCategories } from "../../store/actions/categoryActions";

function CategoryMenu() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  
  const { categories, loading: categoriesLoading } = useSelector(
    (state) => state.categories
  );

  // Group categories by gender
  const categoriesByGender = categories
    ? categories.reduce((acc, category) => {
        const gender = category.gender === "k" ? "kadin" : "erkek";
        if (!acc[gender]) {
          acc[gender] = [];
        }
        acc[gender].push(category);
        return acc;
      }, {})
    : {};

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Dropdown açıldığında kategorileri yükle
  useEffect(() => {
    if (isDropdownOpen && (!categories || categories.length === 0)) {
      dispatch(fetchCategories());
    }
  }, [isDropdownOpen, dispatch, categories]);

  return (
    <div className="relative group" ref={dropdownRef}>
      <button
        className="text-(--ikinci-metin-rengi) hover:text-(--Bandage-Rengi)"
        onMouseEnter={() => {
          setIsDropdownOpen(true);
          if (!categories || categories.length === 0) {
            dispatch(fetchCategories());
          }
        }}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        Categories
      </button>
      {isDropdownOpen && (
        <div
          className="absolute left-0 mt-2 py-2 w-64 bg-white rounded-lg shadow-xl z-50"
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => setIsDropdownOpen(false)}
        >
          {categoriesLoading ? (
            <div className="px-4 py-8 text-center">
              <Loader className="h-6 w-6 mx-auto animate-spin text-blue-600" />
              <p className="mt-2 text-sm text-gray-500">
                Loading categories...
              </p>
            </div>
          ) : (
            <>
              <div className="flex">
                {/* Men's categories */}
                <div className="w-1/2 border-r">
                  <h3 className="px-4 py-2 font-medium text-gray-900 bg-gray-100">
                    Erkek
                  </h3>
                  <div className="py-1">
                    {categoriesByGender.erkek?.length > 0 ? (
                      categoriesByGender.erkek.map((category) => (
                        <Link
                          key={category.id}
                          to={`/shop/${category.genderText}/${category.slug}/${category.id}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          {category.title}
                          <span className="text-xs text-gray-500 ml-1">
                            ({category.productCount || 0})
                          </span>
                        </Link>
                      ))
                    ) : (
                      <p className="px-4 py-2 text-sm text-gray-500">
                        Kategori bulunamadı
                      </p>
                    )}
                  </div>
                </div>
                {/* Women's categories */}
                <div className="w-1/2">
                  <h3 className="px-4 py-2 font-medium text-gray-900 bg-gray-100">
                    Kadın
                  </h3>
                  <div className="py-1">
                    {categoriesByGender.kadin?.length > 0 ? (
                      categoriesByGender.kadin.map((category) => (
                        <Link
                          key={category.id}
                          to={`/shop/${category.genderText}/${category.slug}/${category.id}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          {category.title}
                          <span className="text-xs text-gray-500 ml-1">
                            ({category.productCount || 0})
                          </span>
                        </Link>
                      ))
                    ) : (
                      <p className="px-4 py-2 text-sm text-gray-500">
                        Kategori bulunamadı
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* View all categories link */}
              <div className="mt-2 pt-1 border-t">
                <Link
                  to="/shop"
                  className="block px-4 py-2 text-sm text-center font-medium text-blue-600 hover:bg-gray-100"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  View All Categories
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default CategoryMenu;