import axios from "axios";
import { PRODUCT_ACTIONS } from "../reducers/productReducer";

export const fetchProductsStart = () => ({
  type: PRODUCT_ACTIONS.SET_FETCH_STATE,
  payload: "FETCHING",
});

export const fetchProductsSuccess = (products, total) => (dispatch) => {
  dispatch({
    type: PRODUCT_ACTIONS.SET_PRODUCT_LIST,
    payload: products,
  });
  dispatch({
    type: PRODUCT_ACTIONS.SET_TOTAL,
    payload: total,
  });
  dispatch({
    type: PRODUCT_ACTIONS.SET_FETCH_STATE,
    payload: "FETCHED",
  });
};

export const fetchProductsFailure = (error) => ({
  type: PRODUCT_ACTIONS.SET_FETCH_STATE,
  payload: "FAILED",
});

export const fetchProducts = (params = {}) => {
  return async (dispatch) => {
    dispatch(fetchProductsStart());
    try {
      const response = await axios.get("https://workintech-fe-ecommerce.onrender.com/products", {
        params: {
          limit: params.limit || 25,
          offset: params.offset || 0,
          filter: params.filter || "",
        }
      });
      
      const { total, products } = response.data;
      dispatch(fetchProductsSuccess(products, total));
      // After fetching, also filter products based on current price range
      dispatch({ type: PRODUCT_ACTIONS.FILTER_PRODUCTS });
      
      return response.data;
    } catch (error) {
      dispatch(fetchProductsFailure(error.message));
      console.error("Error fetching products:", error);
      throw error;
    }
  };
};