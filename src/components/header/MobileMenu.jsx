import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { ChevronDown, ChevronUp } from "lucide-react";

function MobileMenu({ isOpen, toggleMenu, isAuthenticated }) {
  const [showCategories, setShowCategories] = useState(false);
  const { categories } = useSelector((state) => state.categories);

  // Group categories by gender
  const womenCategories = categories.filter((cat) => cat.gender === "k");
  const menCategories = categories.filter((cat) => cat.gender === "e");

  return (
    <nav
      className={`${
        isOpen ? "block" : "hidden"
      } md:hidden bg-white shadow-sm w-full text-center py-6`}
    >
      <ul className="py-2 flex flex-col space-y-4">
        <li>
          <Link
            to="/"
            className="block px-4 py-2 text-(--ikinci-metin-rengi) text-2xl font-semibold hover:bg-gray-100"
            onClick={toggleMenu}
          >
            Home
          </Link>
        </li>

        {/* Shop with expandable categories */}
        <li>
          <div className="relative">
            <button
              onClick={() => setShowCategories(!showCategories)}
              className="w-full flex items-center justify-center px-4 py-2 text-(--ikinci-metin-rengi) text-2xl font-semibold hover:bg-gray-100"
            >
              <span>Shop</span>
              {showCategories ? (
                <ChevronUp className="ml-2 w-5 h-5" />
              ) : (
                <ChevronDown className="ml-2 w-5 h-5" />
              )}
            </button>

            {showCategories && (
              <div className="bg-gray-50 py-2">
                {/* Women's section */}
                <div className="mb-4">
                  <Link
                    to="/shop/kadin"
                    className="block text-lg font-medium text-gray-900 px-4 py-2 hover:bg-gray-100"
                    onClick={toggleMenu}
                  >
                    Women
                  </Link>
                  <ul className="mt-1">
                    {womenCategories.map((category) => (
                      <li key={`women-mobile-${category.id}`}>
                        <Link
                          to={`/shop/kadin/${category.title
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                          className="block px-8 py-2 text-gray-700 hover:bg-gray-100"
                          onClick={toggleMenu}
                        >
                          {category.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Men's section */}
                <div className="mb-4">
                  <Link
                    to="/shop/erkek"
                    className="block text-lg font-medium text-gray-900 px-4 py-2 hover:bg-gray-100"
                    onClick={toggleMenu}
                  >
                    Men
                  </Link>
                  <ul className="mt-1">
                    {menCategories.map((category) => (
                      <li key={`men-mobile-${category.id}`}>
                        <Link
                          to={`/shop/erkek/${category.title
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                          className="block px-8 py-2 text-gray-700 hover:bg-gray-100"
                          onClick={toggleMenu}
                        >
                          {category.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="px-4">
                  <Link
                    to="/shop"
                    className="block px-4 py-2 text-(--ikinci-metin-rengi) text-2xl font-semibold hover:bg-gray-100"
                    onClick={toggleMenu}
                  >
                    View All Products
                  </Link>
                </div>
              </div>
            )}
          </div>
        </li>

        <li>
          <a
            href="#"
            className="block px-4 py-2 text-(--ikinci-metin-rengi) text-2xl font-semibold hover:bg-gray-100"
            onClick={toggleMenu}
          >
            Pricing
          </a>
        </li>
        <li>
          <Link
            to="/contact"
            className="block px-4 py-2 text-(--ikinci-metin-rengi) text-2xl font-semibold hover:bg-gray-100"
            onClick={toggleMenu}
          >
            Contact
          </Link>
        </li>
        {!isAuthenticated && (
          <>
            <li>
              <Link
                to="/login"
                className="block px-4 py-2 text-(--ikinci-metin-rengi) text-2xl font-semibold hover:bg-gray-100"
                onClick={toggleMenu}
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                to="/signup"
                className="block px-4 py-2 text-(--ikinci-metin-rengi) text-2xl font-semibold hover:bg-gray-100"
                onClick={toggleMenu}
              >
                Sign Up
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default MobileMenu;
