const initialState = {
  categories: [],
  productList: [],
  filteredProducts: null,
  total: 0,
  limit: 25,
  offset: 0,
  filter: "",
  sortBy: "featured",
  priceRange: { min: 0, max: 1000, current: [0, 1000] },
  fetchState: "NOT_FETCHED", // "NOT_FETCHED", "FETCHING", "FETCHED", "FAILED"
  singleProduct: null,
  singleProductLoading: false,
  singleProductError: null,
  relatedProducts: [],
  genderFilter: null,
  genderMappingChecked: false,
  categoriesMap: {},
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
  SET_SINGLE_PRODUCT: "SET_SINGLE_PRODUCT",
  SET_SINGLE_PRODUCT_LOADING: "SET_SINGLE_PRODUCT_LOADING",
  SET_SINGLE_PRODUCT_ERROR: "SET_SINGLE_PRODUCT_ERROR",
  SET_RELATED_PRODUCTS: "SET_RELATED_PRODUCTS",
  SET_PRODUCTS: "SET_PRODUCTS",
  SET_TOTAL_COUNT: "SET_TOTAL_COUNT",
  SET_PRODUCTS_LOADING: "SET_PRODUCTS_LOADING",
  SET_GENDER_FILTER: "SET_GENDER_FILTER",
  SET_PRODUCT_LIST_WITH_GENDER: "SET_PRODUCT_LIST_WITH_GENDER",
  SET_CATEGORIES_MAP: "SET_CATEGORIES_MAP",
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
export const filterProducts = () => ({ type: PRODUCT_ACTIONS.FILTER_PRODUCTS });
export const setGenderFilter = (gender) => ({
  type: PRODUCT_ACTIONS.SET_GENDER_FILTER,
  payload: gender,
});

// Sorting helper function
const sortProducts = (products, sortType) => {
  if (!products || !Array.isArray(products)) return [];

  const productsCopy = [...products];

  switch (sortType) {
    case "price:asc":
      return productsCopy.sort(
        (a, b) =>
          (a.discount_price || a.price || 0) -
          (b.discount_price || b.price || 0)
      );
    case "price:desc":
      return productsCopy.sort(
        (a, b) =>
          (b.discount_price || b.price || 0) -
          (a.discount_price || a.price || 0)
      );
    case "rating:asc":
      return productsCopy.sort((a, b) => (a.rating || 0) - (b.rating || 0));
    case "rating:desc":
      return productsCopy.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    case "newest":
      return productsCopy.sort(
        (a, b) =>
          new Date(b.created_at || b.createdAt || 0) -
          new Date(a.created_at || a.createdAt || 0)
      );
    case "name:asc":
      return productsCopy.sort((a, b) =>
        (a.name || "").toLowerCase().localeCompare((b.name || "").toLowerCase())
      );
    case "name:desc":
      return productsCopy.sort((a, b) =>
        (b.name || "").toLowerCase().localeCompare((a.name || "").toLowerCase())
      );
    default: // featured
      return productsCopy;
  }
};

// Reducer
const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case PRODUCT_ACTIONS.SET_CATEGORIES:
      return { ...state, categories: action.payload };

    case PRODUCT_ACTIONS.SET_PRODUCT_LIST:
      return {
        ...state,
        productList: action.payload,
        filteredProducts: action.payload,
        genderMappingChecked: true,
        fetchState: "FETCHED",
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
        filteredProducts: sortProducts(
          state.filteredProducts || state.productList,
          action.payload
        ),
        productList: sortProducts(state.productList, action.payload),
      };

    case PRODUCT_ACTIONS.SET_PRICE_RANGE:
      return {
        ...state,
        priceRange: { ...state.priceRange, current: action.payload },
      };

    case PRODUCT_ACTIONS.FILTER_PRODUCTS:
      const filteredList = state.productList.filter(
        (product) =>
          product.price >= state.priceRange.current[0] &&
          product.price <= state.priceRange.current[1]
      );
      return { ...state, filteredProducts: filteredList };

    case PRODUCT_ACTIONS.SET_SINGLE_PRODUCT:
      return { ...state, singleProduct: action.payload };

    case PRODUCT_ACTIONS.SET_SINGLE_PRODUCT_LOADING:
      return { ...state, singleProductLoading: action.payload };

    case PRODUCT_ACTIONS.SET_SINGLE_PRODUCT_ERROR:
      return { ...state, singleProductError: action.payload };

    case PRODUCT_ACTIONS.SET_RELATED_PRODUCTS:
      return { ...state, relatedProducts: action.payload };

    case PRODUCT_ACTIONS.SET_PRODUCTS:
      return {
        ...state,
        productList: action.payload,
        filteredProducts: action.payload,
        fetchState: "FETCHED",
      };

    case PRODUCT_ACTIONS.SET_TOTAL_COUNT:
      return { ...state, total: action.payload };

    case PRODUCT_ACTIONS.SET_PRODUCTS_LOADING:
      return {
        ...state,
        fetchState: action.payload ? "FETCHING" : state.fetchState,
      };

    case PRODUCT_ACTIONS.SET_PRODUCT_LIST_WITH_GENDER:
      const { products, gender } = action.payload;
      return {
        ...state,
        productList: products,
        filteredProducts: products, // API'den gelen filtreli sonuçlar
        genderFilter: gender, // Cinsiyet filtresini sakla
        fetchState: "FETCHED",
      };

    case PRODUCT_ACTIONS.SET_GENDER_FILTER:
      return {
        ...state,
        genderFilter: action.payload,
      };

    case PRODUCT_ACTIONS.SET_CATEGORIES_MAP:
      return {
        ...state,
        categoriesMap: action.payload.reduce((map, category) => {
          map[category.id] = category;
          return map;
        }, {}),
      };

    default:
      return state;
  }
};

export default productReducer;
