import React from "react";
import { Check, Truck, Shield, ShoppingCart as CardIcon } from "lucide-react";

const ProductInfo = ({
  product,
  isMobile = false,
  quantity,
  setQuantity,
  handleAddToCard,
}) => {
  if (!product) return null;

  // Price display section
  const PriceDisplay = () => (
    <div className="flex items-center space-x-2">
      {product.discount_price ? (
        <>
          <span className="text-2xl font-bold text-red-600">
            ${parseFloat(product.discount_price).toFixed(2)}
          </span>
          <span className="text-gray-500 line-through">
            ${parseFloat(product.price).toFixed(2)}
          </span>
        </>
      ) : (
        <span className="text-2xl font-bold">
          ${parseFloat(product.price).toFixed(2)}
        </span>
      )}
    </div>
  );

  // Stars rating display
  const RatingDisplay = () => (
    <div className="flex items-center space-x-2">
      <div className="text-yellow-400 flex">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={
              i < Math.floor(product.rating || 0) ? "" : "text-gray-300"
            }
          >
            ★
          </span>
        ))}
      </div>
      <span className="text-gray-600 text-sm">
        ({product.rating || 0} Reviews)
      </span>
    </div>
  );

  if (isMobile) {
    return (
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-900 mb-1">{product.name}</h1>
        <p className="text-gray-600 text-sm mb-2">{product.category}</p>

        {/* Rating & Reviews */}
        <RatingDisplay />

        {/* Price */}
        <div className="mb-4">
          <PriceDisplay />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full md:w-1/2 pl-4 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
        <p className="text-lg text-gray-600 mt-2">{product.category}</p>
      </div>

      {/* Rating & Reviews */}
      <RatingDisplay />

      {/* Price */}
      <div className="flex items-center gap-4">
        <PriceDisplay />
      </div>

      {/* Short Description */}
      <p className="text-gray-600">
        {product.description?.substring(0, 150)}...
      </p>

      {/* Availability */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center text-green-600">
          <Check size={16} className="mr-2" />
          <span>In Stock</span>
        </div>

        {/* Quantity Selector */}
        <div className="mt-2">
          <label className="block text-sm text-gray-700 mb-2">Quantity:</label>
          <div className="inline-flex items-center border rounded-md mb-4">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-4 py-2 hover:rounded-md border-r hover:bg-gray-100"
            >
              -
            </button>
            <p className="px-4">{quantity}</p>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-4 hover:rounded-md py-2 border-l hover:bg-gray-100"
            >
              +
            </button>
          </div>
        </div>

        {/* Add to Cart Button - Moved here from ProductActions */}
        <div className="mb-4">
          <button
            onClick={handleAddToCard}
            className="w-full py-3 px-8 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <CardIcon className="w-5 h-5 mr-2" />
            Add to Card
          </button>
        </div>

        {/* Shipping & Returns Info */}
        <div className="flex flex-wrap gap-4 mt-2">
          <div className="flex items-center">
            <Truck className="w-5 h-5 text-gray-400 mr-2" />
            <span className="text-sm text-gray-600">
              Free shipping over $50
            </span>
          </div>
          <div className="flex items-center">
            <Shield className="w-5 h-5 text-gray-400 mr-2" />
            <span className="text-sm text-gray-600">30 days return policy</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
