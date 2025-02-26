
import { Link } from "react-router-dom";

const ShopBreadcrumb = ({ gender, categoryId, categories }) => {
  return (
    <nav className="mb-6 text-sm">
      <ol className="flex items-center space-x-1">
        <li>
          <Link to="/" className="text-gray-500 hover:text-gray-700 transition-colors">
            Home
          </Link>
        </li>
        <li className="text-gray-500">/</li>
        <li>
          <Link to="/shop" className="text-gray-500 hover:text-gray-700 transition-colors">
            Shop
          </Link>
        </li>
        {gender && (
          <>
            <li className="text-gray-500">/</li>
            <li className="text-gray-700 font-medium">
              {gender === "kadin" ? "Women" : "Men"}
            </li>
          </>
        )}
        {categoryId && (
          <>
            <li className="text-gray-500">/</li>
            <li className="text-gray-700 font-medium truncate max-w-[150px]">
              {categories?.find((c) => c.id === parseInt(categoryId))?.title || "Category"}
            </li>
          </>
        )}
      </ol>
    </nav>
  );
};

export default ShopBreadcrumb;