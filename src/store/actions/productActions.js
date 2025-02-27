import axios from "axios";
import { PRODUCT_ACTIONS } from "../reducers/productReducer";

// API base URL
const API_URL = "https://workintech-fe-ecommerce.onrender.com";

// Set fetch state
export const setFetchState = (fetchState) => ({
  type: PRODUCT_ACTIONS.SET_FETCH_STATE,
  payload: fetchState,
});

// Set product list
export const setProductList = (products) => ({
  type: PRODUCT_ACTIONS.SET_PRODUCT_LIST,
  payload: products,
});

// Set total product count
export const setTotal = (total) => ({
  type: PRODUCT_ACTIONS.SET_TOTAL,
  payload: total,
});

// Update fetchProducts to handle pagination better
export const fetchProducts = (params = {}) => {
  return async (dispatch, getState) => {
    try {
      // Set loading state
      dispatch(setFetchState("FETCHING"));

      // Prepare query parameters
      const queryParams = new URLSearchParams();

      // Önemli: gender parametresi varsa bunu kaydet
      const genderFilter = params.gender || null;

      // Add gender parameter if provided
      if (params.gender) {
        console.log(`Gender API parametresi: ${params.gender}`);
        queryParams.append("gender", params.gender);
      }

      // Ensure pagination parameters are present and have default values
      const limit = params.limit || 12;
      const offset = params.offset !== undefined ? params.offset : 0;

      queryParams.append("limit", limit.toString());
      queryParams.append("offset", offset.toString());

      // Add other parameters
      if (params.category_id) {
        queryParams.append("category_id", params.category_id);
      }
      if (params.filter) {
        queryParams.append("filter", params.filter);
      }
      if (params.sort) {
        queryParams.append("sort", params.sort);
      }
      if (params.priceMin !== undefined) {
        queryParams.append("price_min", params.priceMin);
      }
      if (params.priceMax !== undefined) {
        queryParams.append("price_max", params.priceMax);
      }

      const url = `${API_URL}/products${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;
      console.log(`Fetching products: Page ${offset / limit + 1}, URL:`, url);

      // Fetch products
      const productResponse = await axios.get(url);

      // Log the number of products received and check if the response makes sense
      console.log(
        `Received ${productResponse.data.products.length} products, total: ${productResponse.data.total}`
      );

      if (productResponse.data.products.length > 0) {
        console.log("First product ID:", productResponse.data.products[0].id);
        console.log(
          "Last product ID:",
          productResponse.data.products[
            productResponse.data.products.length - 1
          ].id
        );
      }

      // Ürünleri Redux store'a kaydet, gender filtresini de aktar
      if (genderFilter) {
        // Eğer bir cinsiyet filtresi varsa, özel SET_PRODUCT_LIST_WITH_GENDER action'ını kullan
        dispatch({
          type: PRODUCT_ACTIONS.SET_PRODUCT_LIST_WITH_GENDER,
          payload: {
            products: productResponse.data.products,
            gender: genderFilter,
          },
        });
      } else {
        // Normal ürün listesi güncelleme işlemi
        dispatch(setProductList(productResponse.data.products));
      }

      dispatch(setTotal(productResponse.data.total));

      return productResponse.data;
    } catch (error) {
      console.error("Ürünleri getirirken hata oluştu:", error);
      dispatch(setFetchState("FAILED"));
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
