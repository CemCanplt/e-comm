import { useEffect, useState } from "react";
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

  useEffect(() => {
    dispatch(fetchCategories());
    
    // Close menus when location changes
    return () => {
      setMobileMenuOpen(false);
      setCartOpen(false);
    };
  }, [dispatch, location]);

  const cartItemCount = cart?.card
    ? cart.card.reduce((sum, item) => sum + (item.quantity || 0), 0)
    : 0;
    
  const isActive = (path) => location.pathname === path ? "text-blue-600" : "text-gray-700 hover:text-blue-600";
  const linkClass = "px-3 py-2 rounded-md text-sm font-medium";
  const mobileLinkClass = "block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50";

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="font-bold text-xl text-[#252b42]">
            Bandage
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link to="/" className={`${linkClass} ${isActive("/")}`}>
              Home
            </Link>
            <ShopDropdown />
            <Link to="/about" className={`${linkClass} ${isActive("/about")}`}>
              About
            </Link>
            <Link to="/contact" className={`${linkClass} ${isActive("/contact")}`}>
              Contact
            </Link>
            <Link to="/team" className={`${linkClass} ${isActive("/team")}`}>
              Team
            </Link>
          </nav>

          {/* User and Cart */}
          <div className="flex items-center space-x-4">
            <Link to={user ? "/profile" : "/login"}>
              <User className="h-6 w-6 text-gray-700 hover:text-blue-600" />
            </Link>
            
            <Search className="h-6 w-6 text-gray-700 hover:text-blue-600 cursor-pointer" />
            
            <div className="relative">
              <button className="relative" onClick={() => setCartOpen(!cartOpen)}>
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
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${mobileMenuOpen ? "block" : "hidden"} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-lg">
          <Link to="/" className={mobileLinkClass}>Home</Link>
          <Link to="/shop" className={mobileLinkClass}>Shop</Link>
          <div className="pl-6">
            <Link to="/shop/kadin" className={mobileLinkClass}>Women</Link>
            <Link to="/shop/erkek" className={mobileLinkClass}>Men</Link>
          </div>
          <Link to="/about" className={mobileLinkClass}>About</Link>
          <Link to="/contact" className={mobileLinkClass}>Contact</Link>
          <Link to="/team" className={mobileLinkClass}>Team</Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
