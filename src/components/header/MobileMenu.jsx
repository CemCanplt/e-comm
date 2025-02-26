import { Link } from "react-router-dom";

function MobileMenu({ isOpen, toggleMenu, isAuthenticated }) {
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
  );
}

export default MobileMenu;