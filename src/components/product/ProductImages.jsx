import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ProductImages = ({ 
  product, 
  selectedImage, 
  setSelectedImage,
  isMobile = false 
}) => {
  if (!product || !product.images) return null;

  const handleImageChange = (index) => {
    setSelectedImage(index);
  };

  const navigateImage = (direction) => {
    if (direction === "next") {
      setSelectedImage((prev) => (prev + 1) % product.images.length);
    } else {
      setSelectedImage(
        (prev) => (prev - 1 + product.images.length) % product.images.length
      );
    }
  };

  // Mobile view for product images
  if (isMobile) {
    return (
      <>
        {/* Product Images */}
        <div className="aspect-w-1 aspect-h-1 bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={product.images[selectedImage]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Image navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => navigateImage("prev")}
            className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="flex space-x-1">
            {product.images.map((_, index) => (
              <button
                key={index}
                onClick={() => handleImageChange(index)}
                className={`w-2 h-2 rounded-full ${
                  selectedImage === index ? "bg-blue-600" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => navigateImage("next")}
            className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </>
    );
  }

  // Desktop view
  return (
    <div className="w-full md:w-1/2 pr-4 space-y-6">
      {/* Main product image */}
      <div className="aspect-w-4 aspect-h-3 bg-gray-50 rounded-lg overflow-hidden">
        <img
          src={product.images[selectedImage]}
          alt={product.name}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Image gallery */}
      <div className="flex flex-wrap gap-3">
        {product.images.map((image, index) => (
          <button
            key={index}
            onClick={() => handleImageChange(index)}
            className={`flex-grow-0 flex-shrink-0 basis-[calc(20%-0.6rem)] aspect-w-1 aspect-h-1 rounded-lg overflow-hidden border-2
            ${
              selectedImage === index
                ? "border-blue-500"
                : "border-transparent hover:border-gray-300"
            }`}
          >
            <img
              src={image}
              alt={`${product.name} view ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;