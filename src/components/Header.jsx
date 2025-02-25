import { Search, ShoppingCart, User, Menu, X, LogOut } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/reducers/userReducer";
import { refreshUserData, fetchCategories } from "../store/actions/userActions";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showAuthMenu, setShowAuthMenu] = useState(false);
  const dropdownRef = useRef(null);
  const authMenuRef = useRef(null);
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { categories } = useSelector((state) => state.categories);

  // Cart dropdown functionality
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const cartDropdownRef = useRef(null);
  const { cart } = useSelector((state) => state.shoppingCart);

  // Calculate total items in cart
  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Close cart dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        cartDropdownRef.current &&
        !cartDropdownRef.current.contains(event.target)
      ) {
        setShowCartDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const toggleMenu = () => setIsOpen(!isOpen);
  const handleLogout = () => {
    dispatch(logout());
    setIsDropdownOpen(false);
  };

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (authMenuRef.current && !authMenuRef.current.contains(event.target)) {
        setShowAuthMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(refreshUserData());
    }
  }, [dispatch]);

  const renderAuthenticatedSection = () => (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-2 focus:outline-none"
      >
        {user?.avatar ? (
          !user.avatar.includes("identicon") ? (
            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
              <User className="h-6 w-6 text-gray-400" />
            </div>
          ) : (
            <img
              src={user.avatar}
              alt={user.name}
              className="h-8 w-8 rounded-full ring-2 ring-offset-2 ring-transparent hover:ring-blue-500 transition-all duration-200"
            />
          )
        ) : (
          <User className="h-8 w-8 p-1 rounded-full bg-gray-100" />
        )}
        <span className="text-gray-700 hidden md:block">{user?.name}</span>
      </button>
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 py-2 min-w-48 max-w-md bg-white rounded-lg shadow-xl z-50">
          <div className="px-4 py-2 border-b">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.name}
            </p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 space-x-2"
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            <span>Sign out</span>
          </button>
        </div>
      )}
    </div>
  );

  const renderAuthSection = () => {
    if (isAuthenticated) {
      return renderAuthenticatedSection();
    }
    return (
      <div className="relative" ref={authMenuRef}>
        <button
          className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          aria-label="Authentication menu"
          onClick={() => setShowAuthMenu(!showAuthMenu)}
        >
          <User className="h-6 w-6 text-gray-600 hover:text-gray-900" />
        </button>
        {showAuthMenu && (
          <div className="absolute right-0 mt-2 py-1 w-48 bg-white rounded-lg shadow-xl z-50">
            <Link
              to="/login"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
              onClick={() => setShowAuthMenu(false)}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Login
            </Link>
            <Link
              to="/signup"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
              onClick={() => setShowAuthMenu(false)}
            >
              <User className="h-4 w-4 mr-2" />
              Sign Up
            </Link>
          </div>
        )}
      </div>
    );
  };

  const renderCartDropdown = () => (
    <div className="relative" ref={cartDropdownRef}>
      <button
        className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 relative"
        aria-label="Shopping cart"
        onClick={() => setShowCartDropdown(!showCartDropdown)}
      >
        <ShoppingCart className="h-6 w-6 text-gray-600 hover:text-gray-900" />
        {cartItemsCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-blue-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
            {cartItemsCount}
          </span>
        )}
      </button>

      {showCartDropdown && (
        <div className="absolute right-0 mt-2 py-2 w-72 bg-white rounded-lg shadow-xl z-50">
          <div className="px-4 py-2 border-b">
            <p className="text-sm font-medium text-gray-900">
              {cartItemsCount} {cartItemsCount === 1 ? "item" : "items"} in cart
            </p>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {cart.length === 0 ? (
              <div className="px-4 py-4 text-center text-gray-500 text-sm">
                Your cart is empty
              </div>
            ) : (
              cart.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="px-4 py-3 border-b last:border-b-0 flex items-center"
                >
                  <div className="w-12 h-12 flex-shrink-0">
                    <img
                      src={
                        item.image ||
                        "https://placehold.co/100x100/gray/white?text=No+Image"
                      }
                      alt={item.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.quantity} × ${item.price?.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))
            )}

            {cart.length > 3 && (
              <div className="px-4 py-2 text-center text-sm text-gray-500">
                +{cart.length - 3} more items
              </div>
            )}
          </div>

          <div className="px-4 pt-2 pb-4 border-t mt-2">
            <Link
              to="/cart"
              className="block w-full px-4 py-2 bg-blue-600 text-white text-center rounded-md hover:bg-blue-700 transition-colors"
              onClick={() => setShowCartDropdown(false)}
            >
              View Cart
            </Link>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <header className="w-full py-4 px-8 bg-white shadow-sm flex items-center">
        <div className="flex-1 flex justify-start">
          <Link to="/" className="text-xl font-bold text-(--Bandage-Rengi)">
            Bandage
          </Link>
        </div>
        <nav className="flex-1 hidden md:flex items-center justify-center space-x-6">
          <Link
            to="/"
            className="text-(--ikinci-metin-rengi) hover:text-(--Bandage-Rengi)"
          >
            Home
          </Link>
          <Link
            to="/shop"
            className="text-(--ikinci-metin-rengi) hover:text-(--Bandage-Rengi)"
          >
            Shop
          </Link>
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
          <div className="relative group" ref={dropdownRef}>
            <button
              className="text-(--ikinci-metin-rengi) hover:text-(--Bandage-Rengi)"
              onMouseEnter={() => setIsDropdownOpen(true)}
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
                {/* Gender categories */}
                <div className="flex">
                  {/* Men's categories */}
                  <div className="w-1/2 border-r">
                    <h3 className="px-4 py-2 font-medium text-gray-900 bg-gray-100">
                      Erkek
                    </h3>
                    <div className="py-1">
                      {categoriesByGender.erkek?.map((category) => (
                        <Link
                          key={category.id}
                          to={`/shop/erkek/${category.title.toLowerCase()}/${
                            category.id
                          }`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          {category.title}
                        </Link>
                      ))}
                      {!categoriesByGender.erkek?.length && (
                        <p className="px-4 py-2 text-sm text-gray-500">
                          Loading...
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
                      {categoriesByGender.kadin?.map((category) => (
                        <Link
                          key={category.id}
                          to={`/shop/kadin/${category.title.toLowerCase()}/${
                            category.id
                          }`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          {category.title}
                        </Link>
                      ))}
                      {!categoriesByGender.kadin?.length && (
                        <p className="px-4 py-2 text-sm text-gray-500">
                          Loading...
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
              </div>
            )}
          </div>
        </nav>
        <div className="flex-1 flex items-center justify-end space-x-4">
          {renderAuthSection()}
          <Search className="cursor-pointer text-gray-600 hover:text-gray-900" />
          {renderCartDropdown()}
          {isOpen ? (
            <X
              onClick={toggleMenu}
              className="focus:outline-none cursor-pointer text-gray-600 hover:text-gray-900 md:hidden"
            />
          ) : (
            <Menu
              onClick={toggleMenu}
              className="focus:outline-none cursor-pointer text-gray-600 hover:text-gray-900 md:hidden"
            />
          )}
        </div>
      </header>
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
          <li>
            <Link
              to="/shop"
              className="block px-4 py-2 text-(--ikinci-metin-rengi) text-2xl font-semibold hover:bg-gray-100"
              onClick={toggleMenu}
            >
              Shop
            </Link>
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
    </>
  );
}

export default Header;
