import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { User, LogOut } from "lucide-react";
import { logout } from "../../store/reducers/userReducer";

function AuthSection() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showAuthMenu, setShowAuthMenu] = useState(false);
  const dropdownRef = useRef(null);
  const authMenuRef = useRef(null);
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (authMenuRef.current && !authMenuRef.current.contains(event.target)) {
        setShowAuthMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setIsDropdownOpen(false);
  };

  if (isAuthenticated) {
    return (
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
}

export default AuthSection;