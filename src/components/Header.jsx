import { Menu, X, Search } from "lucide-react";
import { useState } from "react";
import HeaderLogo from "./header/HeaderLogo";
import Navigation from "./header/Navigation";
import MobileMenu from "./header/MobileMenu";
import AuthSection from "./header/AuthSection";
import CartDropdown from "./header/CartDropdown";
import { useSelector } from "react-redux";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  const { isAuthenticated } = useSelector((state) => state.user);

  return (
    <>
      <header className="w-full py-4 px-8 bg-white shadow-sm flex items-center">
        <HeaderLogo />
        <Navigation />

        <div className="flex-1 flex items-center justify-end space-x-4">
          <AuthSection />
          <Search className="cursor-pointer text-gray-600 hover:text-gray-900" />
          <CartDropdown />

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

      <MobileMenu
        isOpen={isOpen}
        toggleMenu={toggleMenu}
        isAuthenticated={isAuthenticated}
      />
    </>
  );
}

export default Header;
