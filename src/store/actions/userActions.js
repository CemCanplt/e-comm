import axios from "axios";
import md5 from "md5";
import {
  setUser,
  setToken as setTokenAction,
  setLoading,
  setError,
  setRoles,
  logout,
  USER_ACTIONS,
} from "../reducers/userReducer";
import { setCategories } from "../reducers/productReducer";

const API_URL = "https://workintech-fe-ecommerce.onrender.com";

// Helper function to handle API errors
const handleApiError = (error, defaultMessage = "An error occurred") => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data) {
    return error.response.data;
  }
  return defaultMessage;
};

export const refreshUserData = () => {
  return (dispatch, getState) => {
    const { token } = getState().user;
    if (!token) return Promise.resolve();

    return axios
      .get(`${API_URL}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        dispatch(setUser(response.data));
        return response.data;
      })
      .catch((error) => {
        console.error("Failed to refresh user data:", error);
        const errorMessage = handleApiError(
          error,
          "Failed to refresh user data"
        );
        dispatch(setError(errorMessage));
        dispatch(logout());
        throw error;
      });
  };
};

export const loginUser = ({ email, password, rememberMe, switchAccount }) => {
  return (dispatch) => {
    dispatch(setLoading(true));
    dispatch(setError(null)); // Clear previous errors

    if (switchAccount) {
      dispatch(setTokenAction(null));
    }

    return axios
      .post(`${API_URL}/login`, {
        email,
        password,
      })
      .then((response) => {
        const { token, name, email: userEmail, role_id } = response.data;
        const hash = md5(email.toLowerCase().trim());
        const gravatarUrl = `https://www.gravatar.com/avatar/${hash}?d=identicon`;

        const userWithAvatar = {
          name,
          email: userEmail,
          role_id,
          avatar: gravatarUrl,
          rememberMe,
        };

        dispatch(setUser(userWithAvatar));
        dispatch(setTokenAction(token, rememberMe));

        return response.data;
      })
      .catch((error) => {
        const errorMessage = handleApiError(error, "Login failed");
        dispatch(setError(errorMessage));
        throw error;
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };
};

export const fetchRoles = () => {
  return (dispatch) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    return axios
      .get(`${API_URL}/roles`)
      .then((response) => {
        dispatch(setRoles(response.data));
        return response.data;
      })
      .catch((error) => {
        const errorMessage = handleApiError(error, "Failed to fetch roles");
        dispatch(setError(errorMessage));
        throw error;
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };
};

export const autoLogin = () => {
  return (dispatch) => {
    const token = localStorage.getItem("token");
    if (!token) return Promise.resolve();

    dispatch(setLoading(true));

    return axios
      .get(`${API_URL}/verify`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        dispatch(setTokenAction(token));
        return dispatch(refreshUserData());
      })
      .catch((error) => {
        const errorMessage = handleApiError(error, "Auto login failed");
        dispatch(setError(errorMessage));
        dispatch(logout());
        throw error;
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };
};

// Fetch categories thunk action
export const fetchCategories = () => {
  return (dispatch) => {
    return axios
      .get("https://workintech-fe-ecommerce.onrender.com/categories")
      .then((response) => {
        dispatch({
          type: "FETCH_CATEGORIES_SUCCESS",
          payload: response.data,
        });
      })
      .catch((error) => {
        console.error("Failed to fetch categories:", error);
      });
  };
};
