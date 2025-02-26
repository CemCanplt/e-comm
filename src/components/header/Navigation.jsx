import { Link } from "react-router-dom";
import CategoryMenu from "./CategoryMenu";

function Navigation() {
  return (
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
      <CategoryMenu />
    </nav>
  );
}

export default Navigation;