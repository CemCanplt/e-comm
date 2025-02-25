import axios from "axios";
import { PRODUCT_ACTIONS } from "../reducers/productReducer";

// API base URL
const API_URL = "https://workintech-fe-ecommerce.onrender.com";

// Action creators for product fetching
export const fetchProductsStart = () => ({
  type: PRODUCT_ACTIONS.SET_FETCH_STATE,
  payload: "FETCHING",
});

export const fetchProductsSuccess = (products) => ({
  type: PRODUCT_ACTIONS.SET_PRODUCT_LIST,
  payload: products,
});

export const fetchProductsFailure = (error) => ({
  type: PRODUCT_ACTIONS.SET_FETCH_STATE,
  payload: "FAILED",
});

export const setTotalProducts = (total) => ({
  type: PRODUCT_ACTIONS.SET_TOTAL,
  payload: total,
});

// Thunk action to fetch products
export const fetchProducts = (params = {}) => {
  return async (dispatch) => {
    dispatch(fetchProductsStart());

    try {
      const response = await axios.get(`${API_URL}/products`, {
        params: {
          limit: params.limit || 25,
          offset: params.offset || 0,
          filter: params.filter || "",
          category_id: params.categoryId || "",
          sort: params.sort || "",
        },
      });

      const { total, products } = response.data;

      // Set total and products in the store
      dispatch(setTotalProducts(total));
      dispatch(fetchProductsSuccess(products));

      // After fetching products, filter them based on current price range
      dispatch({ type: PRODUCT_ACTIONS.FILTER_PRODUCTS });

      dispatch({
        type: PRODUCT_ACTIONS.SET_FETCH_STATE,
        payload: "FETCHED",
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      dispatch(fetchProductsFailure(error.message));
      throw error;
    }
  };
};

// Fetch a single product by ID
export const fetchProductById = (productId) => {
  return async (dispatch) => {
    dispatch({
      type: PRODUCT_ACTIONS.SET_SINGLE_PRODUCT_LOADING,
      payload: true,
    });

    try {
      const response = await axios.get(`${API_URL}/products/${productId}`);

      // Ensure images are properly processed
      const productData = response.data;

      // Convert images to array if it's not already an array
      if (productData.images && typeof productData.images === "string") {
        try {
          productData.images = JSON.parse(productData.images);
        } catch (e) {
          // If parsing fails, create an array with the string
          productData.images = [productData.images];
        }
      }

      // If no images array exists but there's an image field, create images array
      if (!productData.images && productData.image) {
        productData.images = [productData.image];
      }

      // If no images at all, set a placeholder
      if (!productData.images) {
        productData.images = [
          "https://placehold.co/300x300/gray/white?text=No+Image",
        ];
      }

      dispatch({
        type: PRODUCT_ACTIONS.SET_SINGLE_PRODUCT,
        payload: productData,
      });

      return productData;
    } catch (error) {
      console.error("Error fetching product details:", error);
      dispatch({
        type: PRODUCT_ACTIONS.SET_SINGLE_PRODUCT_ERROR,
        payload: error.message,
      });
      throw error;
    } finally {
      dispatch({
        type: PRODUCT_ACTIONS.SET_SINGLE_PRODUCT_LOADING,
        payload: false,
      });
    }
  };
};

// Fetch related products
export const fetchRelatedProducts = (categoryId, currentProductId) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${API_URL}/products`, {
        params: {
          category_id: categoryId,
          limit: 4,
        },
      });

      // Filter out the current product and limit to 4 items
      const relatedProducts = response.data.products
        .filter((product) => product.id !== parseInt(currentProductId))
        .slice(0, 4);

      dispatch({
        type: PRODUCT_ACTIONS.SET_RELATED_PRODUCTS,
        payload: relatedProducts,
      });

      return relatedProducts;
    } catch (error) {
      console.error("Error fetching related products:", error);
      throw error;
    }
  };
};
