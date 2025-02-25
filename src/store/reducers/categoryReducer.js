const initialState = {
  categories: [],
  loading: false,
  error: null,
};

export const CATEGORY_ACTIONS = {
  FETCH_CATEGORIES_START: "FETCH_CATEGORIES_START",
  FETCH_CATEGORIES_SUCCESS: "FETCH_CATEGORIES_SUCCESS",
  FETCH_CATEGORIES_FAILURE: "FETCH_CATEGORIES_FAILURE",
};

// Reducer
const categoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case CATEGORY_ACTIONS.FETCH_CATEGORIES_START:
      return { ...state, loading: true, error: null };
    case CATEGORY_ACTIONS.FETCH_CATEGORIES_SUCCESS:
      return { ...state, categories: action.payload, loading: false };
    case CATEGORY_ACTIONS.FETCH_CATEGORIES_FAILURE:
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

export default categoryReducer;