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

// Ürünleri getiren fonksiyon - cinsiyet filtresi için iyileştirildi
export const fetchProducts = (params = {}) => {
  return (dispatch, getState) => {
    // Yükleme durumunu ayarla
    dispatch(setFetchState("FETCHING"));

    // Cinsiyet parametresini kontrol edip debug mesajı yaz
    if (params.gender) {
      console.log(`Cinsiyet filtresi API'ye gönderiliyor: ${params.gender}`);
    }

    // API parametrelerini hazırla
    const queryParams = new URLSearchParams();

    // Tüm filtreleri API'ye ekle
    if (params.gender) queryParams.append("gender", params.gender);

    // Sayfalama parametrelerini ekle
    const limit = params.limit || 12;
    const offset = params.offset !== undefined ? params.offset : 0;

    queryParams.append("limit", limit.toString());
    queryParams.append("offset", offset.toString());

    // Kategori filtresi ekle
    if (params.category_id)
      queryParams.append("category_id", params.category_id);

    // Metin arama filtresi ekle
    if (params.filter) queryParams.append("filter", params.filter);

    // Sıralama ekle
    if (params.sort) queryParams.append("sort", params.sort);

    // Fiyat filtrelerini ekle
    if (params.priceMin !== undefined)
      queryParams.append("price_min", params.priceMin);
    if (params.priceMax !== undefined)
      queryParams.append("price_max", params.priceMax);

    const url = `${API_URL}/products${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    console.log("API çağrısı URL:", url);

    // API'den filtrelenmiş verileri getir
    return axios
      .get(url)
      .then((productResponse) => {
        console.log(
          `API yanıtı: ${productResponse.data.products.length} ürün, toplam: ${productResponse.data.total}`
        );

        // Redux store'a kaydet
        dispatch(setProductList(productResponse.data.products));

        // Toplam sayıyı güncelle - filtreleme sonucundaki toplam değeri kullan
        dispatch(setTotal(productResponse.data.total));

        // Yükleme durumunu güncelle
        dispatch(setFetchState("FETCHED"));

        return productResponse.data;
      })
      .catch((error) => {
        console.error("Ürünleri getirirken hata oluştu:", error);
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
