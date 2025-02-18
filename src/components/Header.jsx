import { Search, ShoppingCart, User, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/slices/userSlice";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.user);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
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
          {isAuthenticated ? (
            <div className="flex items-center space-x-3">
              {user?.avatar && (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-8 w-8 rounded-full"
                />
              )}
              <span className="text-gray-700">{user?.name}</span>
              <button
                onClick={handleLogout}
                className="text-[#737373] hover:text-[#252B42]"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-[#737373] hover:text-[#252B42]">
                Login
              </Link>
              <Link
                to="/signup"
                className="text-[#737373] hover:text-[#252B42]"
              >
                Sign Up
              </Link>
            </>
          )}

          <Search className="cursor-pointer text-gray-600 hover:text-gray-900" />
          <ShoppingCart className="cursor-pointer text-gray-600 hover:text-gray-900" />

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
          {isAuthenticated && (
            <li>
              <button
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
                className="block w-full px-4 py-2 text-[#737373] text-2xl font-semibold hover:bg-gray-100"
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </nav>
    </>
  );
}

export default Header;
