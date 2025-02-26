const initialState = {
  cart: [],
};

// Action Types
export const CART_ACTIONS = {
  SET_CART: "SET_CART",
  ADD_TO_CART: "ADD_TO_CART",
  REMOVE_FROM_CART: "REMOVE_FROM_CART",
  UPDATE_CART_ITEM: "UPDATE_CART_ITEM",
  CLEAR_CART: "CLEAR_CART",
};

// Action Creators
export const setCart = (cart) => ({
  type: CART_ACTIONS.SET_CART,
  payload: cart,
});

export const addToCart = (item) => ({
  type: CART_ACTIONS.ADD_TO_CART,
  payload: item,
});

export const removeFromCart = (itemId) => ({
  type: CART_ACTIONS.REMOVE_FROM_CART,
  payload: itemId,
});

export const updateCartItem = (itemId, updates) => ({
  type: CART_ACTIONS.UPDATE_CART_ITEM,
  payload: { itemId, updates },
});

export const clearCart = () => ({
  type: CART_ACTIONS.CLEAR_CART,
});

// Persist cart to localStorage
const saveCartToStorage = (cart) => {
  try {
    localStorage.setItem("cart", JSON.stringify(cart));
  } catch (error) {
    console.error("Could not save cart to localStorage", error);
  }
};

// Load cart from localStorage
const loadCartFromStorage = () => {
  try {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  } catch (error) {
    console.error("Could not load cart from localStorage", error);
    return [];
  }
};

// Initialize state with saved cart
initialState.cart = loadCartFromStorage();

// Reducer
const shoppingCartReducer = (state = initialState, action) => {
  let updatedCart;

  switch (action.type) {
    case CART_ACTIONS.SET_CART:
      saveCartToStorage(action.payload);
      return {
        ...state,
        cart: action.payload,
      };

    case CART_ACTIONS.ADD_TO_CART:
      const existingItemIndex = state.cart.findIndex(
        (item) => item.id === action.payload.id
      );

      if (existingItemIndex !== -1) {
        // Update existing item quantity
        updatedCart = state.cart.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        // Add new item
        updatedCart = [...state.cart, action.payload];
      }

      saveCartToStorage(updatedCart);
      return {
        ...state,
        cart: updatedCart,
      };

    case CART_ACTIONS.REMOVE_FROM_CART:
      updatedCart = state.cart.filter((item) => item.id !== action.payload);
      saveCartToStorage(updatedCart);
      return {
        ...state,
        cart: updatedCart,
      };

    case CART_ACTIONS.UPDATE_CART_ITEM:
      updatedCart = state.cart.map((item) =>
        item.id === action.payload.itemId
          ? { ...item, ...action.payload.updates }
          : item
      );
      saveCartToStorage(updatedCart);
      return {
        ...state,
        cart: updatedCart,
      };

    case CART_ACTIONS.CLEAR_CART:
      saveCartToStorage([]);
      return {
        ...state,
        cart: [],
      };

    default:
      return state;
  }
};

export default shoppingCartReducer;
