import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  ChevronDown,
  ShoppingBag,
  Venus as WomanIcon,
  Mars as ManIcon,
} from "lucide-react";
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
                <div className="flex items-center font-medium text-gray-900 mb-2">
                  <WomanIcon className="h-5 w-5 text-pink-600 mr-2" />
                  <span>Women</span>
                </div>
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
                <div className="flex items-center font-medium text-gray-900 mb-2">
                  <ManIcon className="h-5 w-5 text-indigo-600 mr-2" />
                  <span>Men</span>
                </div>
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
