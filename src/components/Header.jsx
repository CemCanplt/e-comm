import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  LogOut,
  // ChevronDown,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/reducers/userReducer";
import { refreshUserData } from "../store/actions/userActions";

function Header() {
  // State management
  const [isOpen, setIsOpen] = useState(false); // Mobile menu state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // User dropdown state
  const [showAuthMenu, setShowAuthMenu] = useState(false); // Auth menu visibility

  // Refs for click outside detection
  const dropdownRef = useRef(null);
  const authMenuRef = useRef(null);

  // Redux hooks
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.user);

  // Toggle mobile menu
  const toggleMenu = () => setIsOpen(!isOpen);

  // Handle user logout
  const handleLogout = () => {
    dispatch(logout());
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close auth menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (authMenuRef.current && !authMenuRef.current.contains(event.target)) {
        setShowAuthMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sayfa yüklendiğinde kullanıcı bilgilerini yenile
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(refreshUserData());
    }
  }, [dispatch]);

  // Render authenticated user section
  const renderAuthenticatedSection = () => (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-2 focus:outline-none"
      >
        {user?.avatar ? (
          !user.avatar.includes("identicon") ? ( // Gravatar URL'i henüz yüklenmemişse
            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
              <User className="h-6 w-6 text-gray-400" />
            </div>
          ) : (
            <img
              src={user.avatar}
              alt={user.name}
              className="h-8 w-8 rounded-full ring-2 ring-offset-2 ring-transparent 
              hover:ring-blue-500 transition-all duration-200"
            />
          )
        ) : (
          <User className="h-8 w-8 p-1 rounded-full bg-gray-100" />
        )}
        <span className="text-gray-700 hidden md:block">{user?.name}</span>
      </button>

      {/* User Dropdown Menu */}
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
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 
            hover:bg-gray-100 space-x-2"
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            <span>Sign out</span>
          </button>
        </div>
      )}
    </div>
  );

  // Render non-authenticated section
  const renderAuthSection = () => {
    if (isAuthenticated) {
      return renderAuthenticatedSection();
    }

    return (
      <div
        className="relative"
        ref={authMenuRef}
        onMouseEnter={() => setShowAuthMenu(true)}
        onMouseLeave={() => setShowAuthMenu(false)}
      >
        {/* User Icon Button */}
        <button
          className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          aria-label="Authentication menu"
        >
          <User className="h-6 w-6 text-gray-600 hover:text-gray-900" />
        </button>

        {/* Auth Dropdown Menu */}
        <div
          className={`absolute right-0 mt-2 py-1 w-48 bg-white rounded-lg shadow-xl z-50 
          transform transition-all duration-200 ${
            showAuthMenu
              ? "opacity-100 translate-y-0 visible"
              : "opacity-0 -translate-y-2 invisible"
          }`}
        >
          <Link
            to="/login"
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 
            transition-colors duration-150"
            onClick={() => setShowAuthMenu(false)}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Login
          </Link>
          <Link
            to="/signup"
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 
            transition-colors duration-150"
            onClick={() => setShowAuthMenu(false)}
          >
            <User className="h-4 w-4 mr-2" />
            Sign Up
          </Link>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Main Header */}
      <header className="w-full py-4 px-8 bg-white shadow-sm flex items-center">
        {/* Left Section */}
        <div className="flex-1 flex justify-start">
          <Link to="/" className="text-xl font-bold text-(--Bandage-Rengi)">
            Bandage
          </Link>
        </div>

        {/* Center Section - Navigation */}
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
          <Link // Changed from <a> to <Link>
            to="/contact" // Added to prop
            className="text-(--ikinci-metin-rengi) hover:text-(--Bandage-Rengi)"
          >
            Contact
          </Link>
        </nav>

        {/* Right Section */}
        <div className="flex-1 flex items-center justify-end space-x-4">
          {renderAuthSection()}
          <Search className="cursor-pointer text-gray-600 hover:text-gray-900" />
          <ShoppingCart className="cursor-pointer text-gray-600 hover:text-gray-900" />

          {/* Mobile Menu Toggle */}
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

      {/* Mobile Navigation Menu */}
      <nav
        className={`${
          isOpen ? "block" : "hidden"
        } md:hidden bg-white shadow-sm w-full text-center py-6`}
      >
        <ul className="py-2 flex flex-col space-y-4">
          <li>
            <Link
              to="/"
              className="block px-4 py-2 text-(--ikinci-metin-rengi) text-2xl font-semibold 
              hover:bg-gray-100"
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
            <Link // Changed from <a> to <Link>
              to="/contact" // Added to prop
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
                  className="block px-4 py-2 text-(--ikinci-metin-rengi) text-2xl font-semibold 
                  hover:bg-gray-100"
                  onClick={toggleMenu}
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/signup"
                  className="block px-4 py-2 text-(--ikinci-metin-rengi) text-2xl font-semibold 
                  hover:bg-gray-100"
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
