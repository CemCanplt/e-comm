import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ShoppingCart, User, Menu, X, Search } from "lucide-react";
import CartDropdown from "./header/CartDropdown";
import ShopDropdown from "./header/ShopDropdown";
import { fetchCategories } from "../store/actions/categoryActions";

function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { user } = useSelector((state) => state.user);
  const { cart } = useSelector((state) =>
    state.shoppingCard?.card ? state.shoppingCard : { card: [] }
  );
  const dispatch = useDispatch();

  // Fetch categories when component mounts
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Close menu when location changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setCartOpen(false);
  }, [location]);

  // Calculate cart item count
  const cartItemCount = cart?.card
    ? cart.card.reduce((sum, item) => sum + (item.quantity || 0), 0)
    : 0;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="font-bold text-xl text-[#252b42]">
              Bandage
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === "/"
                  ? "text-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              Home
            </Link>

            {/* Shop Dropdown - make sure it has the same styling as other links */}
            <ShopDropdown />

            <Link
              to="/about"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === "/about"
                  ? "text-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === "/contact"
                  ? "text-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              Contact
            </Link>
            <Link
              to="/team"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === "/team"
                  ? "text-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              Team
            </Link>
          </nav>

          {/* User and Cart */}
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <div className="cursor-pointer relative">
                <Link to={user ? "/profile" : "/login"}>
                  <User className="h-6 w-6 text-gray-700 hover:text-blue-600" />
                </Link>
              </div>
            </div>

            {/* Search icon */}
            <div className="relative">
              <Search className="h-6 w-6 text-gray-700 hover:text-blue-600 cursor-pointer" />
            </div>

            <div className="relative">
              <button
                className="relative"
                onClick={() => setCartOpen(!cartOpen)}
              >
                <ShoppingCart className="h-6 w-6 text-gray-700 hover:text-blue-600" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
              {cartOpen && <CartDropdown onClose={() => setCartOpen(false)} />}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${mobileMenuOpen ? "block" : "hidden"} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-lg">
          <Link
            to="/"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
          >
            Home
          </Link>
          <Link
            to="/shop"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
          >
            Shop
          </Link>
          <div className="pl-6">
            <Link
              to="/shop/kadin"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            >
              Women
            </Link>
            <Link
              to="/shop/erkek"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            >
              Men
            </Link>
          </div>
          <Link
            to="/about"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
          >
            Contact
          </Link>
          <Link
            to="/team"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
          >
            Team
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
