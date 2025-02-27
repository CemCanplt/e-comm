
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const ShopBreadcrumb = ({ gender, categorySlug, category }) => {
  return (
    <nav className="flex py-3 mb-4 text-sm">
      <ol className="flex items-center flex-wrap">
        <li className="flex items-center">
          <Link to="/" className="text-gray-500 hover:text-gray-700">
            Home
          </Link>
          <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
        </li>

        <li className="flex items-center">
          <Link to="/shop" className="text-gray-500 hover:text-gray-700">
            Shop
          </Link>

          {gender && (
            <>
              <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
              <Link
                to={`/shop/${gender}`}
                className={
                  !categorySlug
                    ? "text-blue-600 font-medium"
                    : "text-gray-500 hover:text-gray-700"
                }
              >
                {gender === "kadin" ? "Women" : "Men"}
              </Link>
            </>
          )}

          {categorySlug && category && (
            <>
              <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
              <span className="text-blue-600 font-medium">
                {category.title}
              </span>
            </>
          )}
        </li>
      </ol>
    </nav>
  );
};

export default ShopBreadcrumb;
