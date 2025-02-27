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

// fetchProducts fonksiyonunu basitleştir
export const fetchProducts = (params = {}) => {
  return async (dispatch) => {
    try {
      // Loading başlat
      dispatch(fetchProductsStart());

      // API parametrelerini oluştur
      const queryParams = new URLSearchParams();

      // Gender parametresi kontrolü ve ekleme
      if (params.gender) {
        console.log(`Gender API parametresi: ${params.gender}`);
        queryParams.append("gender", params.gender);
      }

      // Diğer parametreler...
      queryParams.append("limit", params.limit || "12");
      if (params.offset !== undefined) {
        queryParams.append("offset", params.offset);
      }

      if (params.category_id)
        queryParams.append("category_id", params.category_id);
      if (params.filter) queryParams.append("filter", params.filter);
      if (params.sort) queryParams.append("sort", params.sort);
      if (params.priceMin !== undefined)
        queryParams.append("price_min", params.priceMin);
      if (params.priceMax !== undefined)
        queryParams.append("price_max", params.priceMax);

      // API çağrısı
      const url = `${API_URL}/products${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;
      console.log("API çağrısı URL:", url);

      const response = await axios.get(url);

      // Dönen ürün verisinin tam yapısını incele
      if (response.data.products && response.data.products.length > 0) {
        console.log(
          "API'den dönen ilk ürün verisi:",
          response.data.products[0]
        );

        // Gender bilgisini farklı alanlardan çıkarmaya çalış
        const productSample = response.data.products[0];
        console.log("Olası gender alanları:", {
          gender: productSample.gender,
          categoryGender: productSample.category?.gender,
          categoryTitle: productSample.category?.title,
          title: productSample.title,
          name: productSample.name,
          description: productSample.description,
        });
      }

      // API'den dönen ürünlerin gender değerlerini kontrol et
      if (response.data.products && response.data.products.length > 0) {
        const genderSamples = {};
        response.data.products.forEach((product) => {
          if (product.gender) {
            genderSamples[product.gender] =
              (genderSamples[product.gender] || 0) + 1;
          }
        });
        console.log("API ürünlerindeki gender değerleri:", genderSamples);
      }

      // Ürünleri state'e kaydet
      dispatch(fetchProductsSuccess(response.data.products));
      dispatch(setTotalProducts(response.data.total));

      return response.data;
    } catch (error) {
      console.error("API hatası:", error);
      dispatch(fetchProductsFailure(error));
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
