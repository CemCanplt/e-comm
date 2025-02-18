const initialState = {
  categories: [],
  productList: [],
  total: 0,
  limit: 25,
  offset: 0,
  filter: "",
  fetchState: "NOT_FETCHED", // "NOT_FETCHED" , "FETCHING", "FETCHED", "FAILED"
};

// Action Types
export const PRODUCT_ACTIONS = {
  SET_CATEGORIES: "SET_CATEGORIES",
  SET_PRODUCT_LIST: "SET_PRODUCT_LIST",
  SET_TOTAL: "SET_TOTAL",
  SET_FETCH_STATE: "SET_FETCH_STATE",
  SET_LIMIT: "SET_LIMIT",
  SET_OFFSET: "SET_OFFSET",
  SET_FILTER: "SET_FILTER",
};

// Action Creators
export const setCategories = (categories) => ({
  type: PRODUCT_ACTIONS.SET_CATEGORIES,
  payload: categories,
});

export const setProductList = (productList) => ({
  type: PRODUCT_ACTIONS.SET_PRODUCT_LIST,
  payload: productList,
});

export const setTotal = (total) => ({
  type: PRODUCT_ACTIONS.SET_TOTAL,
  payload: total,
});

export const setFetchState = (fetchState) => ({
  type: PRODUCT_ACTIONS.SET_FETCH_STATE,
  payload: fetchState,
});

export const setLimit = (limit) => ({
  type: PRODUCT_ACTIONS.SET_LIMIT,
  payload: limit,
});

export const setOffset = (offset) => ({
  type: PRODUCT_ACTIONS.SET_OFFSET,
  payload: offset,
});

export const setFilter = (filter) => ({
  type: PRODUCT_ACTIONS.SET_FILTER,
  payload: filter,
});

// Reducer
const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case PRODUCT_ACTIONS.SET_CATEGORIES:
      return { ...state, categories: action.payload };
    case PRODUCT_ACTIONS.SET_PRODUCT_LIST:
      return { ...state, productList: action.payload };
    case PRODUCT_ACTIONS.SET_TOTAL:
      return { ...state, total: action.payload };
    case PRODUCT_ACTIONS.SET_FETCH_STATE:
      return { ...state, fetchState: action.payload };
    case PRODUCT_ACTIONS.SET_LIMIT:
      return { ...state, limit: action.payload };
    case PRODUCT_ACTIONS.SET_OFFSET:
      return { ...state, offset: action.payload };
    case PRODUCT_ACTIONS.SET_FILTER:
      return { ...state, filter: action.payload };
    default:
      return state;
  }
};

export default productReducer;