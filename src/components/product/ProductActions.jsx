import React from "react";
import { ShoppingCart as CardIcon, Truck, Shield } from "lucide-react";

const ProductActions = ({
  quantity,
  setQuantity,
  handleAddToCard,
  isMobile = false,
}) => {
  if (isMobile) {
    return (
      <div className="space-y-4">
        {/* Add to Card Button */}
        <button
          onClick={handleAddToCard}
          className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
        >
          <CardIcon className="w-5 h-5 mr-2" />
          Add to Card
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Add to Card Button */}
      <div className="mb-6">
        <button
          onClick={handleAddToCard}
          className="w-full py-3 px-8 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
        >
          <CardIcon className="w-5 h-5 mr-2" />
          Add to Card
        </button>
      </div>
    </div>
  );
};

export default ProductActions;
