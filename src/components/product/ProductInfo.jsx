import React from 'react';
import { Check } from 'lucide-react';

const ProductInfo = ({ product, isMobile = false }) => {
  if (!product) return null;
  
  // Price display section
  const PriceDisplay = () => (
    <>
      {product.discount_price ? (
        <div className={isMobile ? "flex items-center gap-3" : "flex items-center"}>
          <span className={isMobile ? "text-2xl text-red-600 font-bold" : "text-3xl font-bold text-red-600"}>
            ${product.discount_price}
          </span>
          <span className={isMobile ? "text-sm text-gray-400 line-through" : "text-xl text-gray-400 line-through ml-2"}>
            ${product.price}
          </span>
          {!isMobile && (
            <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-sm rounded-md">
              Save ${(product.price - product.discount_price).toFixed(2)}
            </span>
          )}
        </div>
      ) : (
        <span className={isMobile ? "text-2xl text-gray-900 font-bold" : "text-3xl text-gray-900 font-bold"}>
          ${product.price}
        </span>
      )}
    </>
  );
  
  // Stars rating display
  const RatingDisplay = () => (
    <div className="flex items-center gap-2">
      <div className={`text-yellow-400 ${isMobile ? "" : "text-xl"}`}>
        {"★".repeat(Math.floor(product.rating || 0))}
      </div>
      <span className={`${isMobile ? "text-sm" : ""} text-gray-600`}>
        ({product.rating || 0} / 5)
      </span>
    </div>
  );
  
  if (isMobile) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-bold text-gray-900">
          {product.name}
        </h1>

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
        <h1 className="text-3xl font-bold text-gray-900">
          {product.name}
        </h1>
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
      <div className="flex items-center text-green-600">
        <Check size={16} className="mr-2" />
        <span>In Stock</span>
      </div>
    </div>
  );
};

export default ProductInfo;