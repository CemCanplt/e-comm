import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ChevronDown } from "lucide-react";
import { fetchCategories } from "../../store/actions/categoryActions";

function Navigation() {
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const menuRef = useRef(null);
  const { categories, categoriesLoading } = useSelector(
    (state) => state.categories
  );
  const dispatch = useDispatch();

  // Fetch categories when component mounts
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowCategoryMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Group categories by gender
  const womenCategories = categories.filter((cat) => cat.gender === "k");
  const menCategories = categories.filter((cat) => cat.gender === "e");

  return (
    <nav className="flex-1 hidden md:flex items-center justify-center space-x-6">
      <Link
        to="/"
        className="text-(--ikinci-metin-rengi) hover:text-(--Bandage-Rengi)"
      >
        Home
      </Link>

      {/* Shop with dropdown */}
      <div className="relative" ref={menuRef}>
        <button
          className="flex items-center text-(--ikinci-metin-rengi) hover:text-(--Bandage-Rengi) focus:outline-none"
          onClick={() => setShowCategoryMenu(!showCategoryMenu)}
        >
          <span>Shop</span>
          <ChevronDown
            className={`ml-1 w-4 h-4 transition-transform ${
              showCategoryMenu ? "rotate-180" : ""
            }`}
          />
        </button>

        {showCategoryMenu && (
          <div className="absolute top-full left-0 mt-2 w-auto min-w-max bg-white rounded-lg shadow-lg z-50 py-3">
            {/* Gender sections side by side */}
            <div className="flex flex-wrap md:flex-nowrap md:max-w-4xl">
              {/* Women's section */}
              <div className="w-full md:w-1/2 px-4 py-2 md:border-r md:min-w-[14rem]">
                <Link
                  to="/shop/kadin"
                  className="block font-medium text-gray-900 mb-2 hover:text-blue-600 transition-colors"
                  onClick={() => setShowCategoryMenu(false)}
                >
                  Women
                </Link>
                <ul className="space-y-1 mt-2">
                  {womenCategories.map((category) => (
                    <li key={`women-${category.id}`}>
                      <Link
                        to={`/shop/kadin/${category.title
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                        className="block px-2 py-1 rounded hover:bg-gray-100 text-sm text-gray-700"
                        onClick={() => setShowCategoryMenu(false)}
                      >
                        {category.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Men's section */}
              <div className="w-full md:w-1/2 px-4 py-2 md:min-w-[14rem]">
                <Link
                  to="/shop/erkek"
                  className="block font-medium text-gray-900 mb-2 hover:text-blue-600 transition-colors"
                  onClick={() => setShowCategoryMenu(false)}
                >
                  Men
                </Link>
                <ul className="space-y-1 mt-2">
                  {menCategories.map((category) => (
                    <li key={`men-${category.id}`}>
                      <Link
                        to={`/shop/erkek/${category.title
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                        className="block px-2 py-1 rounded hover:bg-gray-100 text-sm text-gray-700"
                        onClick={() => setShowCategoryMenu(false)}
                      >
                        {category.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border-t my-2"></div>

            <div className="px-4 pt-2">
              <Link
                to="/shop"
                className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700"
                onClick={() => setShowCategoryMenu(false)}
              >
                View All Products
              </Link>
            </div>
          </div>
        )}
      </div>

      <a
        href="#"
        className="text-(--ikinci-metin-rengi) hover:text-(--Bandage-Rengi)"
      >
        Pricing
      </a>
      <Link
        to="/contact"
        className="text-(--ikinci-metin-rengi) hover:text-(--Bandage-Rengi)"
      >
        Contact
      </Link>
    </nav>
  );
}

export default Navigation;
