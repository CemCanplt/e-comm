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

// Fetch products with filtering, sorting, and pagination
export const fetchProducts = (params = {}) => {
  return async (dispatch) => {
    try {
      // Set loading state
      dispatch({
        type: PRODUCT_ACTIONS.SET_PRODUCTS_LOADING,
        payload: true,
      });

      // Build query parameters
      const queryParams = new URLSearchParams();

      if (params.category_id) {
        queryParams.append("category_id", params.category_id);
      }

      if (params.filter) {
        queryParams.append("filter", params.filter);
      }

      if (params.sort) {
        queryParams.append("sort", params.sort);
      }

      if (params.limit) {
        queryParams.append("limit", params.limit);
      }

      if (params.offset) {
        queryParams.append("offset", params.offset);
      }

      const queryString = queryParams.toString();
      const url = `${API_URL}/products${queryString ? `?${queryString}` : ""}`;

      console.log("Fetching products from:", url);
      const response = await axios.get(url);

      // Update products in the store
      dispatch({
        type: PRODUCT_ACTIONS.SET_PRODUCTS,
        payload: response.data.products,
      });

      // Update total count in the store
      dispatch({
        type: PRODUCT_ACTIONS.SET_TOTAL_COUNT,
        payload: response.data.total,
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      dispatch({
        type: PRODUCT_ACTIONS.SET_PRODUCTS_ERROR,
        payload: error.message,
      });
    } finally {
      dispatch({
        type: PRODUCT_ACTIONS.SET_PRODUCTS_LOADING,
        payload: false,
      });
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
