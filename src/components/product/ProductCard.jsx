import React from 'react';
import { useHistory } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const history = useHistory();
  
  // Create SEO-friendly slug from product name
  const slug = product.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "product";

  // Display image based on product data structure
  const displayImage = () => {
    if (!product)
      return "https://placehold.co/300x300/gray/white?text=No+Image";

    // images is an array of objects with url property
    if (
      product.images &&
      Array.isArray(product.images) &&
      product.images.length > 0
    ) {
      if (typeof product.images[0] === "object" && product.images[0]?.url) {
        return product.images[0].url;
      }
      return product.images[0]; // string URL
    }

    // Single image property
    if (product.image) {
      return product.image;
    }

    return "https://placehold.co/300x300/gray/white?text=No+Image"; // Fallback
  };

  // Format price display
  const displayPrice = () => {
    if (!product) return "$0.00";
    const price = parseFloat(product.price);
    return isNaN(price) ? "$0.00" : `$${price.toFixed(2)}`;
  };

  // Format discount price display
  const displayDiscountPrice = () => {
    if (!product || !product.discount_price) return null;
    const discountPrice = parseFloat(product.discount_price);
    return isNaN(discountPrice) ? null : `$${discountPrice.toFixed(2)}`;
  };

  // Build the product URL based on available data
  const getProductUrl = () => {
    const gender = product.gender === "k" ? "kadin" : "erkek";
    const categorySlug = product.category_slug || 
      (product.category ? product.category.toLowerCase().replace(/[^a-z0-9]+/g, "-") : "kategori");
    
    return `/product/${gender}/${categorySlug}/${product.id}`;
  };

  return (
    <div
      className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer transition-all hover:shadow-md"
      onClick={() => history.push(getProductUrl())}
    >
      <div className="aspect-w-1 aspect-h-1">
        <img
          src={displayImage()}
          alt={product.name || "Product"}
          className="w-full h-48 object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-900 truncate">
          {product.name || "Product Name"}
        </h3>
        <div className="mt-2 flex items-center justify-between">
          <div>
            {product.discount_price ? (
              <div className="flex items-center gap-2">
                <span className="text-red-600 font-bold">
                  {displayDiscountPrice()}
                </span>
                <span className="text-gray-400 line-through text-sm">
                  {displayPrice()}
                </span>
              </div>
            ) : (
              <span className="font-bold">{displayPrice()}</span>
            )}
          </div>
          <div className="text-yellow-400 text-sm">
            {"★".repeat(Math.floor(product.rating || 0))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;