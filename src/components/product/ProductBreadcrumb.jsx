import React from 'react';
import { Link } from 'react-router-dom';

const ProductBreadcrumb = ({ product }) => {
  if (!product) return null;

  return (
    <nav className="mb-6 text-sm">
      <ol className="flex items-center space-x-1">
        <li>
          <Link to="/" className="text-gray-500 hover:text-gray-700">
            Home
          </Link>
        </li>
        <li className="text-gray-500">/</li>
        <li>
          <Link to="/shop" className="text-gray-500 hover:text-gray-700">
            Shop
          </Link>
        </li>
        {product?.category && (
          <>
            <li className="text-gray-500">/</li>
            <li>
              <Link
                to={`/shop/${
                  product.gender === "k" ? "kadin" : "erkek"
                }/${product.category
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")}`}
                className="text-gray-500 hover:text-gray-700"
              >
                {product.category}
              </Link>
            </li>
          </>
        )}
        <li className="text-gray-500">/</li>
        <li className="text-gray-700 font-medium truncate">
          {product?.name}
        </li>
      </ol>
    </nav>
  );
};

export default ProductBreadcrumb;