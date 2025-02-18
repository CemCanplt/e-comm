import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/reducers/userReducer";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const [authTitle, setAuthTitle] = useState("Login"); // Değişen başlık için
  const [showAuthMenu, setShowAuthMenu] = useState(false); // Hover menüsü için
  const authMenuRef = useRef(null); // Menü referansı için

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    setIsDropdownOpen(false);
  };

  // Dropdown dışına tıklandığında kapanması için
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Otomatik değişen başlık için effect
  useEffect(() => {
    if (!isAuthenticated) {
      const interval = setInterval(() => {
        setAuthTitle((prev) => (prev === "Login" ? "Sign Up" : "Login"));
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  // Hover menüsü için click-outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (authMenuRef.current && !authMenuRef.current.contains(event.target)) {
        setShowAuthMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auth menüsünü gösteren/gizleyen fonksiyon
  const toggleAuthMenu = () => {
    setShowAuthMenu(!showAuthMenu);
  };

  // Login/Signup bölümünü güncelleyelim
  const renderAuthSection = () => {
    if (isAuthenticated) {
      return (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 focus:outline-none"
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="h-8 w-8 rounded-full ring-2 ring-offset-2 ring-transparent 
                hover:ring-blue-500 transition-all duration-200"
              />
            ) : (
              <User className="h-8 w-8 p-1 rounded-full bg-gray-100" />
            )}
            <span className="text-gray-700 hidden md:block">{user?.name}</span>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl z-50">
              <div className="px-4 py-2 border-b">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name}
                </p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 
                hover:bg-gray-100 space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign out</span>
              </button>
            </div>
          )}
        </div>
      );
    }

    return (
      <div
        className="relative w-24" // Sabit genişlik ekledik
        ref={authMenuRef}
        onMouseEnter={() => setShowAuthMenu(true)}
        onMouseLeave={() => setShowAuthMenu(false)}
      >
        <button
          className="flex items-center justify-center gap-2 w-full text-[#737373] hover:text-[#252B42] 
          transition-colors duration-200"
          onClick={toggleAuthMenu}
        >
          <span className="text-right font-medium">{authTitle}</span>
          <ChevronDown className="h-4 w-4" />
        </button>

        {/* Dropdown Menu */}
        <div
          className={`absolute right-0 mt-2 py-1 w-48 bg-white rounded-lg shadow-xl z-50 
          transform transition-all duration-200 ${
            showAuthMenu
              ? "opacity-100 translate-y-0 visible"
              : "opacity-0 -translate-y-2 invisible"
          }`}
          onMouseEnter={() => setShowAuthMenu(true)}
          onMouseLeave={() => setShowAuthMenu(false)}
        >
          <Link
            to="/login"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 
            transition-colors duration-150"
            onClick={() => setShowAuthMenu(false)}
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 
            transition-colors duration-150"
            onClick={() => setShowAuthMenu(false)}
          >
            Sign Up
          </Link>
        </div>
      </div>
    );
  };

  return (
    <>
      <header className="w-full py-4 px-8 bg-white shadow-sm flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-[#252B42]">
          Bandage
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-[#737373] hover:text-[#252B42]">
            Home
          </Link>
          <a href="#" className="text-[#737373] hover:text-[#252B42]">
            Product
          </a>
          <a href="#" className="text-[#737373] hover:text-[#252B42]">
            Pricing
          </a>
          <a href="#" className="text-[#737373] hover:text-[#252B42]">
            Contact
          </a>
        </nav>

        <div className="flex items-center space-x-4">
          {renderAuthSection()}

          <Search className="cursor-pointer text-gray-600 hover:text-gray-900" />
          <ShoppingCart className="cursor-pointer text-gray-600 hover:text-gray-900" />

          {/* Mobile Menu Button */}
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

      {/* Mobile Menu */}
      <nav
        className={`${
          isOpen ? "block" : "hidden"
        } md:hidden bg-white shadow-sm w-full text-center py-6`}
      >
        <ul className="py-2 flex flex-col space-y-4">
          <li>
            <Link
              to="/"
              className="block px-4 py-2 text-[#737373] text-2xl font-semibold hover:bg-gray-100"
              onClick={toggleMenu}
            >
              Home
            </Link>
          </li>
          {!isAuthenticated && (
            <>
              <li>
                <Link
                  to="/login"
                  className="block px-4 py-2 text-[#737373] text-2xl font-semibold hover:bg-gray-100"
                  onClick={toggleMenu}
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/signup"
                  className="block px-4 py-2 text-[#737373] text-2xl font-semibold hover:bg-gray-100"
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
