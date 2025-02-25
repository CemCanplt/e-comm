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
  return async (dispatch) => {
    dispatch(fetchCategoriesStart());
    try {
      const response = await axios.get(
        "https://workintech-fe-ecommerce.onrender.com/categories"
      );
      dispatch(fetchCategoriesSuccess(response.data));
    } catch (error) {
      dispatch(fetchCategoriesFailure(error.message));
    }
  };
};