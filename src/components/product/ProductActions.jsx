import React from 'react';
import { ShoppingCart as CardIcon, Truck, Shield } from 'lucide-react';

const ProductActions = ({ 
  quantity, 
  setQuantity, 
  handleAddToCard,
  isMobile = false 
}) => {
  if (isMobile) {
    return (
      <div className="space-y-4">
        {/* Quantity */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantity:
          </label>
          <div className="flex items-center justify-center border rounded-md bg-white shadow-sm">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-12 py-2.5 flex items-center justify-center text-gray-600 hover:bg-gray-100 font-medium"
            >
              <span className="text-center">-</span>
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, parseInt(e.target.value) || 1))
              }
              className="w-16 text-center border-x px-0 py-2.5 text-gray-800"
              min="1"
            />
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-12 py-2.5 flex items-center justify-center text-gray-600 hover:bg-gray-100 font-medium"
            >
              <span className="text-center">+</span>
            </button>
          </div>
        </div>

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
    <>
      <div className="border-t border-b py-6 flex items-end justify-center flex-wrap">
        {/* Quantity Selector */}
        <div className="w-full md:w-1/2 md:pr-2 mb-4 md:mb-0">
          <label className="block text-gray-700 mb-2">Quantity:</label>
          <div className="inline-flex items-center border rounded-md">
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

        {/* Add to Card Button */}
        <div className="w-full md:w-1/2 md:pl-2">
          <button
            onClick={handleAddToCard}
            className="w-full py-3 px-8 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <CardIcon className="w-5 h-5 mr-2" />
            Add to Card
          </button>
        </div>
      </div>

      {/* Shipping & Returns Info */}
      <div className="flex flex-wrap">
        <div className="w-full md:w-1/2 flex items-center mb-2 md:mb-0">
          <Truck className="w-5 h-5 text-gray-400 mr-2" />
          <span className="text-sm text-gray-600">
            Free shipping over $50
          </span>
        </div>
        <div className="w-full md:w-1/2 flex items-center">
          <Shield className="w-5 h-5 text-gray-400 mr-2" />
          <span className="text-sm text-gray-600">
            30 days return policy
          </span>
        </div>
      </div>
    </>
  );
};

export default ProductActions;