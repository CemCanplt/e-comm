import React from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

const ProductCard = ({ product }) => {
  const history = useHistory();
  const { items: categories } = useSelector((state) => state.categories);

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
    // Find category info from Redux store
    const categoryInfo = categories.find(
      (cat) => cat.id === product.category_id
    );

    // Ensure we have a valid product ID
    const productId = product.id || product.product_id;
    if (!productId) {
      console.error("Missing product ID:", product);
      return "/shop"; // Fallback to shop page if invalid
    }

    // Default values
    let gender = "erkek";
    let categoryName = "kategori";

    // Get gender and category name from category info
    if (categoryInfo) {
      gender = categoryInfo.genderText || "erkek";
      categoryName =
        categoryInfo.slug ||
        categoryInfo.title
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "");
    } else {
      // Fallback to product data
      if (
        product.gender === "k" ||
        product.gender === "kadin" ||
        product.gender === "women"
      ) {
        gender = "kadin";
      }
      if (product.category) {
        categoryName = product.category
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-");
      }
    }

    // Debug information
    console.log("Building Product URL:", {
      gender,
      categoryName,
      productId,
      categoryInfo,
      rawProduct: product,
    });

    // Always use the full URL structure
    return `/product/${gender}/${categoryName}/${productId}`;
  };

  const handleProductClick = (e) => {
    e.preventDefault();
    const url = getProductUrl();
    console.log("Navigating to:", url);
    history.push(url);
  };

  return (
    <div
      className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer transition-all hover:shadow-md"
      onClick={handleProductClick}
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

