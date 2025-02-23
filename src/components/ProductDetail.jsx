import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { mockProducts } from "../data/mockProducts";

function ProductDetail() {
  // Get the product ID from the URL parameters
  const { id } = useParams();
  // Initialize the product state and the selected image index
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  // Initialize the quantity state to 1
  const [quantity, setQuantity] = useState(1);

  // Simulate fetching product data
  useEffect(() => {
    // Find the product in the mockProducts array that matches the product ID
    const foundProduct = mockProducts.find((p) => p.id === parseInt(id));
    // Set the product state to the found product
    setProduct(foundProduct);
  }, [id]);

  // If the product is not found, show a loading spinner
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Mobile View */}
      <div className="md:hidden">
        <div className="space-y-4">
          {/* Product Images */}
          <div className="aspect-w-1 aspect-h-1 bg-gray-100 rounded-lg overflow-hidden">
            {/* Show the main product image */}
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-gray-600">{product.category}</p>

            {/* Price */}
            <div className="flex items-center gap-2">
              {/* Show the discounted price if it exists */}
              {product.discount ? (
                <>
                  <span className="text-2xl text-red-600 font-bold">
                    ${product.discount}
                  </span>
                  <span className="text-gray-400 line-through">
                    ${product.price}
                  </span>
                </>
              ) : (
                <span className="text-2xl text-gray-900 font-bold">
                  ${product.price}
                </span>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="text-yellow-400">
                {/* Show the rating as a string of stars */}
                {"★".repeat(Math.floor(product.rating))}
              </div>
              <span className="text-gray-600">({product.rating} / 5)</span>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <label className="text-gray-700">Quantity:</label>
              <div className="flex items-center border rounded-lg overflow-hidden">
                {/* Decrease the quantity by 1 if it's greater than 1 */}
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 hover:bg-gray-100"
                >
                  -
                </button>
                {/* Show the current quantity */}
                <span className="px-4 py-1">{quantity}</span>
                {/* Increase the quantity by 1 */}
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button className="w-full py-3 px-8 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:grid grid-cols-2 gap-8">
        {/* Left Column - Images */}
        <div className="space-y-4">
          {/* Main product image */}
          <div className="aspect-w-4 aspect-h-3 bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Image gallery */}
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-w-1 aspect-h-1 rounded-lg overflow-hidden border-2
                ${
                  selectedImage === index
                    ? "border-blue-500"
                    : "border-transparent"
                }`}
              >
                {/* Show the image gallery thumbnail */}
                <img
                  src={product.image}
                  alt={`${product.name} view ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column - Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-lg text-gray-600 mt-2">{product.category}</p>
          </div>

          {/* Price */}
          <div className="flex items-center gap-4">
            {/* Show the discounted price if it exists */}
            {product.discount ? (
              <span className="text-3xl font-bold">
                ${product.discount}
                <span className="text-xl text-gray-400 line-through ml-2">
                  ${product.price}
                </span>
              </span>
            ) : (
              <span className="text-3xl text-gray-900 font-bold">
                ${product.price}
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="text-yellow-400 text-xl">
              {/* Show the rating as a string of stars */}
              {"★".repeat(Math.floor(product.rating))}
            </div>
            <span className="text-gray-600">({product.rating} / 5)</span>
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-6">
            <label className="text-lg text-gray-700">Quantity:</label>
            <div className="flex items-center border rounded-lg overflow-hidden">
              {/* Decrease the quantity by 1 if it's greater than 1 */}
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 border-r hover:bg-gray-100"
              >
                -
              </button>
              {/* Show the current quantity */}
              <span className="px-6 py-2">{quantity}</span>
              {/* Increase the quantity by 1 */}
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-2 border-l hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button className="w-full py-4 px-8 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
