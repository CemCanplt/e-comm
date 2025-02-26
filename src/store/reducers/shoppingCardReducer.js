const initialState = {
  card: [],
};

// Action Types
export const CARD_ACTIONS = {
  SET_CARD: "SET_CARD",
  ADD_TO_CARD: "ADD_TO_CARD",
  REMOVE_FROM_CARD: "REMOVE_FROM_CARD",
  UPDATE_CARD_ITEM: "UPDATE_CARD_ITEM",
  CLEAR_CARD: "CLEAR_CARD",
};

// Action Creators
export const setCard = (card) => ({
  type: CARD_ACTIONS.SET_CARD,
  payload: card,
});

export const addToCard = (item) => ({
  type: CARD_ACTIONS.ADD_TO_CARD,
  payload: item,
});

export const removeFromCard = (itemId) => ({
  type: CARD_ACTIONS.REMOVE_FROM_CARD,
  payload: itemId,
});

export const updateCardItem = (itemId, updates) => ({
  type: CARD_ACTIONS.UPDATE_CARD_ITEM,
  payload: { itemId, updates },
});

export const clearCard = () => ({
  type: CARD_ACTIONS.CLEAR_CARD,
});

// Persist card to localStorage
const saveCardToStorage = (card) => {
  try {
    localStorage.setItem("card", JSON.stringify(card));
  } catch (error) {
    console.error("Could not save card to localStorage", error);
  }
};

// Load card from localStorage
const loadCardFromStorage = () => {
  try {
    const storedCard = localStorage.getItem("card");
    return storedCard ? JSON.parse(storedCard) : [];
  } catch (error) {
    console.error("Could not load card from localStorage", error);
    return [];
  }
};

// Initialize state with saved card
initialState.card = loadCardFromStorage();

// Reducer
const shoppingCardReducer = (state = initialState, action) => {
  let updatedCard;

  switch (action.type) {
    case CARD_ACTIONS.SET_CARD:
      saveCardToStorage(action.payload);
      return {
        ...state,
        card: action.payload,
      };

    case CARD_ACTIONS.ADD_TO_CARD:
      const existingItemIndex = state.card.findIndex(
        (item) => item.id === action.payload.id
      );

      if (existingItemIndex !== -1) {
        // Update existing item quantity
        updatedCard = state.card.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        // Add new item
        updatedCard = [...state.card, action.payload];
      }

      saveCardToStorage(updatedCard);
      return {
        ...state,
        card: updatedCard,
      };

    case CARD_ACTIONS.REMOVE_FROM_CARD:
      updatedCard = state.card.filter((item) => item.id !== action.payload);
      saveCardToStorage(updatedCard);
      return {
        ...state,
        card: updatedCard,
      };

    case CARD_ACTIONS.UPDATE_CARD_ITEM:
      updatedCard = state.card.map((item) =>
        item.id === action.payload.itemId
          ? { ...item, ...action.payload.updates }
          : item
      );
      saveCardToStorage(updatedCard);
      return {
        ...state,
        card: updatedCard,
      };

    case CARD_ACTIONS.CLEAR_CARD:
      saveCardToStorage([]);
      return {
        ...state,
        card: [],
      };

    default:
      return state;
  }
};

export default shoppingCardReducer;
