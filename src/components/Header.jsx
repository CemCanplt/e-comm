import { Search, ShoppingCart, User, Menu, X } from "lucide-react";
import { useState } from "react";

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <header className="w-full py-4 px-8 bg-white shadow-sm flex items-center justify-between">
        {/* Sol Taraftaki Logo */}
        <h1 className="text-xl font-bold text-[#252B42]">Bandage</h1>

        {/* Sağ Taraftaki İkonlar */}
        <div className="flex items-center space-x-4">
          <User className="cursor-pointer text-gray-600 hover:text-gray-900" />
          <Search className="cursor-pointer text-gray-600 hover:text-gray-900" />
          <ShoppingCart className="cursor-pointer text-gray-600 hover:text-gray-900" />

          {/* Hamburger Menü Butonu */}

          {isOpen ? (
            <X
              onClick={toggleMenu}
              className="md:hidden focus:outline-none cursor-pointer text-gray-600 hover:text-gray-900"
            />
          ) : (
            <Menu
              onClick={toggleMenu}
              className="md:hidden focus:outline-none cursor-pointer text-gray-600 hover:text-gray-900"
            />
          )}
        </div>
      </header>

      {/* Hamburger Menü İçeriği */}
      <nav
        className={`${
          isOpen ? "block" : "hidden"
        } md:hidden bg-white shadow-sm w-full text-center py-6`}
      >
        <ul className="py-2 flex flex-col space-y-4">
          <li>
            <a
              href="#"
              className="block px-4 py-2 text-[#737373] text-2xl font-semibold hover:bg-gray-100"
              onClick={toggleMenu}
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="#"
              className="block px-4 py-2 text-[#737373] text-2xl font-semibold hover:bg-gray-100"
              onClick={toggleMenu}
            >
              Product
            </a>
          </li>
          <li>
            <a
              href="#"
              className="block px-4 py-2 text-[#737373] text-2xl font-semibold hover:bg-gray-100"
              onClick={toggleMenu}
            >
              Pricing
            </a>
          </li>
          <li>
            <a
              href="#"
              className="block px-4 py-2 text-[#737373] text-2xl font-semibold hover:bg-gray-100"
              onClick={toggleMenu}
            >
              Contact
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default Header;
