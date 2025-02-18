const initialState = {
  cart: [],
  payment: null,
  address: null,
};

// Action Types
export const SHOPPING_CART_ACTIONS = {
  SET_CART: "SET_CART",
  SET_PAYMENT: "SET_PAYMENT",
  SET_ADDRESS: "SET_ADDRESS",
};

// Action Creators
export const setCart = (cart) => ({
  type: SHOPPING_CART_ACTIONS.SET_CART,
  payload: cart,
});

export const setPayment = (payment) => ({
  type: SHOPPING_CART_ACTIONS.SET_PAYMENT,
  payload: payment,
});

export const setAddress = (address) => ({
  type: SHOPPING_CART_ACTIONS.SET_ADDRESS,
  payload: address,
});

// Reducer
const shoppingCartReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOPPING_CART_ACTIONS.SET_CART:
      return { ...state, cart: action.payload };
    case SHOPPING_CART_ACTIONS.SET_PAYMENT:
      return { ...state, payment: action.payload };
    case SHOPPING_CART_ACTIONS.SET_ADDRESS:
      return { ...state, address: action.payload };
    default:
      return state;
  }
};

export default shoppingCartReducer;