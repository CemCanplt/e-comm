import axios from "axios";
import { CATEGORY_ACTIONS } from "../reducers/categoryReducer";

export const fetchCategoriesStart = () => ({
  type: CATEGORY_ACTIONS.FETCH_CATEGORIES_START,
});

export const fetchCategoriesSuccess = (categories) => ({
  type: CATEGORY_ACTIONS.FETCH_CATEGORIES_SUCCESS,
  payload: categories,
});

export const fetchCategoriesFailure = (error) => ({
  type: CATEGORY_ACTIONS.FETCH_CATEGORIES_FAILURE,
  payload: error,
});

export const fetchCategories = () => {
  return (dispatch) => {
    dispatch({
      type: CATEGORY_ACTIONS.FETCH_CATEGORIES_START,
    });

    // Kategorileri çek
    axios.get(
      "https://workintech-fe-ecommerce.onrender.com/categories"
    ).then(categoriesResponse => {
      const categoriesData = categoriesResponse.data;

      // Her kategori için code'dan slug ve gender bilgisi oluştur
      const categoriesWithSlugs = categoriesData.map((category) => {
        const code = category.code || "";
        const parts = code.split(":");

        return {
          ...category,
          genderCode: parts[0] || "",
          slug:
            parts[1] ||
            category.title
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^a-z0-9-]/g, ""),
          genderText: parts[0] === "k" ? "kadin" : "erkek",
        };
      });

      // Ürünleri çek (daha yüksek limit ile)
      return axios.get(
        "https://workintech-fe-ecommerce.onrender.com/products?limit=500"
      ).then(productsResponse => {
        const productsData = productsResponse.data.products;

        // Her kategori için ürün sayısını hesapla
        const categoriesWithCounts = categoriesWithSlugs.map((category) => {
          const count = productsData.filter(
            (product) => product.category_id === category.id
          ).length;

          return {
            ...category,
            productCount: count,
          };
        });

        dispatch({
          type: CATEGORY_ACTIONS.FETCH_CATEGORIES_SUCCESS,
          payload: categoriesWithCounts,
        });
      });
    }).catch(error => {
      console.error("Error fetching categories:", error);
      dispatch({
        type: CATEGORY_ACTIONS.FETCH_CATEGORIES_FAILURE,
        payload: error.message,
      });
    });
  };
};
