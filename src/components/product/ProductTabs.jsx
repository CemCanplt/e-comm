import React from 'react';

const ProductTabs = ({ product, activeTab, setActiveTab }) => {
  if (!product) return null;

  const tabs = ["description", "specifications", "reviews"];

  return (
    <div className="bg-white rounded-lg shadow-sm mb-8 overflow-hidden">
      <div className="border-b">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-4 font-medium text-sm focus:outline-none ${
                activeTab === tab
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {activeTab === "description" && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Product Description
            </h3>
            <p className="text-gray-600 whitespace-pre-line">
              {product.description ||
                "No description available for this product."}
            </p>
          </div>
        )}

        {activeTab === "specifications" && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Product Specifications
            </h3>
            <div className="flex flex-wrap">
              <div className="w-full md:w-1/2 pr-2 border-b py-3">
                <span className="font-medium text-gray-700">Brand:</span>
                <span className="float-right text-gray-600">
                  {product.brand || "Unknown"}
                </span>
              </div>
              <div className="w-full md:w-1/2 pl-2 border-b py-3">
                <span className="font-medium text-gray-700">Material:</span>
                <span className="float-right text-gray-600">
                  Premium Quality
                </span>
              </div>
              <div className="w-full md:w-1/2 pr-2 border-b py-3">
                <span className="font-medium text-gray-700">Category:</span>
                <span className="float-right text-gray-600">
                  {product.category || "Uncategorized"}
                </span>
              </div>
              <div className="w-full md:w-1/2 pl-2 border-b py-3">
                <span className="font-medium text-gray-700">Stock:</span>
                <span className="float-right text-gray-600">Available</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Customer Reviews
            </h3>
            <div className="flex items-center gap-2 mb-6">
              <div className="text-yellow-400 text-xl">
                {"★".repeat(Math.floor(product.rating || 0))}
              </div>
              <span className="text-gray-600">
                ({product.rating || 0} out of 5)
              </span>
            </div>
            <p className="text-gray-600">
              No reviews yet. Be the first to review this product.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;