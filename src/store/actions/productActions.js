import axios from "axios";
import { PRODUCT_ACTIONS } from "../reducers/productReducer";

// API base URL
const API_URL = "https://workintech-fe-ecommerce.onrender.com";

// Cache for products
const productCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 dakika

// Helper function to get cache key
const getCacheKey = (params) => JSON.stringify(params);

// Helper function to check if cache is valid
const isCacheValid = (cacheEntry) => {
  return cacheEntry && Date.now() - cacheEntry.timestamp < CACHE_DURATION;
};

// Helper function to process product data
const processProductData = (product) => {
  if (!product || !product.id) return product;

  // Ürün ID'sini kullanarak sabit bir sayı üret
  const seed = parseInt(product.id) % 15; // 0-14 arası bir sayı

  // Puanı 3.5-5 arasında sabit tut
  const rating = (3.5 + seed / 10).toFixed(1);

  // Yorum sayısını da ID'ye göre sabit tut (50-200 arası)
  const rating_count = 50 + seed * 10;

  return {
    ...product,
    rating: parseFloat(rating),
    rating_count,
  };
};

// Helper function to process products array
const processProducts = (products) => {
  if (!Array.isArray(products)) return [];
  return products.map(processProductData);
};

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
    const limit = params.limit || 12;
    const offset = params.offset !== undefined ? params.offset : 0;

    // Add all filter parameters
    queryParams.append("limit", limit.toString());
    queryParams.append("offset", offset.toString());

    if (params.category_id)
      queryParams.append("category_id", params.category_id);
    if (params.gender) queryParams.append("gender", params.gender);
    if (params.filter) queryParams.append("filter", params.filter);
    if (params.sort) queryParams.append("sort", params.sort);
    if (params.price_min) queryParams.append("price_min", params.price_min);
    if (params.price_max) queryParams.append("price_max", params.price_max);

    const cacheKey = getCacheKey(queryParams.toString());
    const cachedData = productCache.get(cacheKey);

    if (isCacheValid(cachedData)) {
      dispatch(setProductList(cachedData.products));
      dispatch(setTotal(cachedData.total));
      dispatch(setFetchState("FETCHED"));
      return Promise.resolve(cachedData);
    }

    return axios
      .get(`${API_URL}/products?${queryParams.toString()}`)
      .then((response) => {
        const data = {
          ...response.data,
          products: processProducts(response.data.products),
        };

        // Cache the response
        productCache.set(cacheKey, {
          ...data,
          timestamp: Date.now(),
        });

        dispatch(setProductList(data.products));
        dispatch(setTotal(data.total));
        dispatch(setFetchState("FETCHED"));
        return data;
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

    const cacheKey = `product_${productId}`;
    const cachedProduct = productCache.get(cacheKey);

    if (isCacheValid(cachedProduct)) {
      dispatch({
        type: PRODUCT_ACTIONS.SET_SINGLE_PRODUCT,
        payload: cachedProduct.data,
      });
      dispatch({
        type: PRODUCT_ACTIONS.SET_SINGLE_PRODUCT_LOADING,
        payload: false,
      });
      return Promise.resolve(cachedProduct.data);
    }

    return axios
      .get(`${API_URL}/products/${productId}`)
      .then((response) => {
        let productData = processProductData(response.data);

        // Process images
        if (productData.images && typeof productData.images === "string") {
          try {
            productData.images = JSON.parse(productData.images);
          } catch (e) {
            productData.images = [productData.images];
          }
        }

        if (!productData.images && productData.image) {
          productData.images = [productData.image];
        }

        if (!productData.images) {
          productData.images = [
            "https://placehold.co/300x300/gray/white?text=No+Image",
          ];
        }

        // Cache the processed product
        productCache.set(cacheKey, {
          data: productData,
          timestamp: Date.now(),
        });

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
    const cacheKey = `related_${categoryId}_${currentProductId}`;
    const cachedProducts = productCache.get(cacheKey);

    if (isCacheValid(cachedProducts)) {
      dispatch({
        type: PRODUCT_ACTIONS.SET_RELATED_PRODUCTS,
        payload: cachedProducts.data,
      });
      return Promise.resolve(cachedProducts.data);
    }

    return axios
      .get(`${API_URL}/products`, {
        params: {
          category_id: categoryId,
          limit: 4,
        },
      })
      .then((response) => {
        const relatedProducts = processProducts(response.data.products)
          .filter((product) => product.id !== parseInt(currentProductId))
          .slice(0, 4);

        // Cache the related products
        productCache.set(cacheKey, {
          data: relatedProducts,
          timestamp: Date.now(),
        });

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
