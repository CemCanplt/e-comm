import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { ShoppingCart as CardIcon } from "lucide-react";

function CartDropdown() {
  const [showCardDropdown, setShowCardDropdown] = useState(false);
  const cardDropdownRef = useRef(null);
  const { card } = useSelector((state) => state.shoppingCard);

  // Calculate total items in card
  const cardItemsCount = card.reduce((total, item) => total + item.quantity, 0);

  // Close card dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        cardDropdownRef.current &&
        !cardDropdownRef.current.contains(event.target)
      ) {
        setShowCardDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={cardDropdownRef}>
      <button
        className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 relative"
        aria-label="Shopping card"
        onClick={() => setShowCardDropdown(!showCardDropdown)}
      >
        <CardIcon className="h-6 w-6 text-gray-600 hover:text-gray-900" />
        {cardItemsCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-blue-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
            {cardItemsCount}
          </span>
        )}
      </button>

      {showCardDropdown && (
        <div className="absolute right-0 mt-2 py-2 w-72 bg-white rounded-lg shadow-xl z-50">
          <div className="px-4 py-2 border-b">
            <p className="text-sm font-medium text-gray-900">
              {cardItemsCount} {cardItemsCount === 1 ? "item" : "items"} in card
            </p>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {card.length === 0 ? (
              <div className="px-4 py-4 text-center text-gray-500 text-sm">
                Your card is empty
              </div>
            ) : (
              <div className="divide-y">
                {card.map((item) => (
                  <div key={item.id} className="px-4 py-2 flex items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        {item.quantity} × ${item.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="px-4 py-2 flex justify-center mt-2">
            <Link
              to="/card"
              className="w-full py-2 bg-blue-600 text-white rounded-md text-center text-sm font-medium hover:bg-blue-700"
            >
              View Card
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartDropdown;