const initialState = {
  categories: [],
  productList: [],
  filteredProducts: null,
  total: 0,
  limit: 25,
  offset: 0,
  filter: "",
  sortBy: "featured",
  priceRange: {
    min: 0,
    max: 1000,
    current: [0, 1000],
  },
  fetchState: "NOT_FETCHED", // "NOT_FETCHED" , "FETCHING", "FETCHED", "FAILED"

  // Add new state properties for single product
  singleProduct: null,
  singleProductLoading: false,
  singleProductError: null,
  relatedProducts: [],

  // Add genderFilter to the initial state
  genderFilter: null,
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
  SET_SORT_BY: "SET_SORT_BY",
  SET_PRICE_RANGE: "SET_PRICE_RANGE",
  FILTER_PRODUCTS: "FILTER_PRODUCTS",

  // Add new action types
  SET_SINGLE_PRODUCT: "SET_SINGLE_PRODUCT",
  SET_SINGLE_PRODUCT_LOADING: "SET_SINGLE_PRODUCT_LOADING",
  SET_SINGLE_PRODUCT_ERROR: "SET_SINGLE_PRODUCT_ERROR",
  SET_RELATED_PRODUCTS: "SET_RELATED_PRODUCTS",
  SET_PRODUCTS: "SET_PRODUCTS",
  SET_TOTAL_COUNT: "SET_TOTAL_COUNT",
  SET_PRODUCTS_LOADING: "SET_PRODUCTS_LOADING",

  // Add gender filter action type
  SET_GENDER_FILTER: "SET_GENDER_FILTER",
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

export const setSortBy = (sortType) => ({
  type: PRODUCT_ACTIONS.SET_SORT_BY,
  payload: sortType,
});

export const setPriceRange = (range) => ({
  type: PRODUCT_ACTIONS.SET_PRICE_RANGE,
  payload: range,
});

export const filterProducts = () => ({
  type: PRODUCT_ACTIONS.FILTER_PRODUCTS,
});

// Add gender filter action creator
export const setGenderFilter = (gender) => ({
  type: PRODUCT_ACTIONS.SET_GENDER_FILTER,
  payload: gender,
});

// Reducer
const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case PRODUCT_ACTIONS.SET_CATEGORIES:
      return { ...state, categories: action.payload };
    case PRODUCT_ACTIONS.SET_PRODUCT_LIST:
      return {
        ...state,
        productList: action.payload,
        // Reset filtered products when we get a new product list
        filteredProducts: null,
      };
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
    case PRODUCT_ACTIONS.SET_SORT_BY:
      return {
        ...state,
        sortBy: action.payload,
        productList: sortProducts(state.productList, action.payload),
      };
    case PRODUCT_ACTIONS.SET_PRICE_RANGE:
      return {
        ...state,
        priceRange: {
          ...state.priceRange,
          current: action.payload,
        },
      };
    case PRODUCT_ACTIONS.FILTER_PRODUCTS:
      const filteredList = state.productList.filter(
        (product) =>
          product.price >= state.priceRange.current[0] &&
          product.price <= state.priceRange.current[1]
      );
      return {
        ...state,
        filteredProducts: filteredList,
      };

    // Add new cases for single product handling
    case PRODUCT_ACTIONS.SET_SINGLE_PRODUCT:
      return { ...state, singleProduct: action.payload };
    case PRODUCT_ACTIONS.SET_SINGLE_PRODUCT_LOADING:
      return { ...state, singleProductLoading: action.payload };
    case PRODUCT_ACTIONS.SET_SINGLE_PRODUCT_ERROR:
      return { ...state, singleProductError: action.payload };
    case PRODUCT_ACTIONS.SET_RELATED_PRODUCTS:
      return { ...state, relatedProducts: action.payload };

    // Product reducer case for setting products
    case PRODUCT_ACTIONS.SET_PRODUCTS:
      return {
        ...state,
        productList: action.payload,
        filteredProducts: action.payload,
        fetchState: "FETCHED",
      };

    case PRODUCT_ACTIONS.SET_TOTAL_COUNT:
      return {
        ...state,
        total: action.payload,
      };

    case PRODUCT_ACTIONS.SET_PRODUCTS_LOADING:
      return {
        ...state,
        fetchState: action.payload ? "FETCHING" : state.fetchState,
      };

    // Add case for gender filter
    case PRODUCT_ACTIONS.SET_GENDER_FILTER:
      return {
        ...state,
        genderFilter: action.payload,
      };

    default:
      return state;
  }
};

// Sorting helper function
const sortProducts = (products, sortType) => {
  const productsCopy = [...products];

  switch (sortType) {
    case "price-low":
      return productsCopy.sort((a, b) => a.price - b.price);
    case "price-high":
      return productsCopy.sort((a, b) => b.price - a.price);
    case "newest":
      return productsCopy.sort(
        (a, b) =>
          new Date(b.created_at || b.createdAt) -
          new Date(a.created_at || a.createdAt)
      );
    default: // featured
      return productsCopy;
  }
};

export default productReducer;
