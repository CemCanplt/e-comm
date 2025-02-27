import axios from "axios";
import { PRODUCT_ACTIONS } from "../reducers/productReducer";

// API base URL
const API_URL = "https://workintech-fe-ecommerce.onrender.com";

// Set fetch state action creator
export const setFetchState = (fetchState) => ({
  type: PRODUCT_ACTIONS.SET_FETCH_STATE,
  payload: fetchState,
});

// Set product list action creator
export const setProductList = (products) => ({
  type: PRODUCT_ACTIONS.SET_PRODUCT_LIST,
  payload: products,
});

// Set total product count action creator
export const setTotal = (total) => ({
  type: PRODUCT_ACTIONS.SET_TOTAL,
  payload: total,
});

// Fetch products thunk action - handles all filter parameters
export const fetchProducts = (params = {}) => {
  return (dispatch) => {
    dispatch(setFetchState("FETCHING"));

    const queryParams = new URLSearchParams();

    // Add all filter parameters
    const limit = params.limit || 12;
    const offset = params.offset !== undefined ? params.offset : 0;
    queryParams.append("limit", limit.toString());
    queryParams.append("offset", offset.toString());

    if (params.category_id)
      queryParams.append("category_id", params.category_id);
    if (params.gender) queryParams.append("gender", params.gender);
    if (params.filter) queryParams.append("filter", params.filter);
    if (params.sort) queryParams.append("sort", params.sort);
    if (params.priceMin) queryParams.append("price_min", params.priceMin);
    if (params.priceMax) queryParams.append("price_max", params.priceMax);

    return axios
      .get(`${API_URL}/products?${queryParams.toString()}`)
      .then((response) => {
        dispatch(setProductList(response.data.products));
        dispatch(setTotal(response.data.total));
        dispatch(setFetchState("FETCHED"));
        return response.data;
      })
      .catch((error) => {
        dispatch(setFetchState("FAILED"));
        throw error;
      });
  };
};

// Fetch a single product by ID
export const fetchProductById = (productId) => {
  return (dispatch) => {
    dispatch({
      type: PRODUCT_ACTIONS.SET_SINGLE_PRODUCT_LOADING,
      payload: true,
    });

    return axios
      .get(`${API_URL}/products/${productId}`)
      .then((response) => {
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
      })
      .catch((error) => {
        console.error("Error fetching product details:", error);
        dispatch({
          type: PRODUCT_ACTIONS.SET_SINGLE_PRODUCT_ERROR,
          payload: error.message,
        });
        throw error;
      })
      .finally(() => {
        dispatch({
          type: PRODUCT_ACTIONS.SET_SINGLE_PRODUCT_LOADING,
          payload: false,
        });
      });
  };
};

// Fetch related products
export const fetchRelatedProducts = (categoryId, currentProductId) => {
  return (dispatch) => {
    return axios
      .get(`${API_URL}/products`, {
        params: {
          category_id: categoryId,
          limit: 4,
        },
      })
      .then((response) => {
        // Filter out the current product and limit to 4 items
        const relatedProducts = response.data.products
          .filter((product) => product.id !== parseInt(currentProductId))
          .slice(0, 4);

        dispatch({
          type: PRODUCT_ACTIONS.SET_RELATED_PRODUCTS,
          payload: relatedProducts,
        });

        return relatedProducts;
      })
      .catch((error) => {
        console.error("Error fetching related products:", error);
        throw error;
      });
  };
};

// Additional actions for setting gender filter
export const setGenderFilter = (gender) => ({
  type: PRODUCT_ACTIONS.SET_GENDER_FILTER,
  payload: gender,
});
