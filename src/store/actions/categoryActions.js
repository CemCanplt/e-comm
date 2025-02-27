import axios from "axios";
import { CATEGORY_ACTIONS } from "../reducers/categoryReducer";

const API_URL = "https://workintech-fe-ecommerce.onrender.com";

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
    dispatch(fetchCategoriesStart());

    return axios
      .get(`${API_URL}/categories`)
      .then((response) => {
        const categoriesData = response.data;

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

        dispatch(fetchCategoriesSuccess(categoriesWithSlugs));
        return categoriesWithSlugs;
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        dispatch(fetchCategoriesFailure(error.message));
        throw error;
      });
  };
};
