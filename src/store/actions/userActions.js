import axios from "axios";
import md5 from "md5";
import {
  setUser,
  setToken as setTokenAction, // setToken'ı farklı bir isimle import ediyoruz
  setLoading,
  setError,
  setRoles,
  logout,
  USER_ACTIONS, // USER_ACTIONS'ı da import ediyoruz
} from "../reducers/userReducer";
import { setCategories } from "../reducers/productReducer";

export const refreshUserData = () => {
  return async (dispatch, getState) => {
    const { token } = getState().user;
    if (!token) return;

    try {
      const response = await axios.get(
        "https://workintech-fe-ecommerce.onrender.com/user",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch(setUser(response.data));
    } catch (error) {
      console.error("Failed to refresh user data:", error);
      dispatch(logout());
    }
  };
};

export const loginUser = ({ email, password, rememberMe, switchAccount }) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      if (switchAccount) {
        dispatch(setTokenAction(null)); // setTokenAction kullanıyoruz
      }

      const response = await axios.post(
        "https://workintech-fe-ecommerce.onrender.com/login",
        {
          email,
          password,
        }
      );

      const { token, name, email: userEmail, role_id } = response.data;
      const hash = md5(email.toLowerCase().trim());
      const gravatarUrl = `https://www.gravatar.com/avatar/${hash}?d=identicon`;

      const userWithAvatar = {
        name: name,
        email: userEmail,
        role_id: role_id,
        avatar: gravatarUrl,
        rememberMe,
      };

      dispatch(setUser(userWithAvatar));
      dispatch(setTokenAction(token, rememberMe)); // setTokenAction kullanıyoruz

      return response.data;
    } catch (error) {
      dispatch(setError(error.response?.data || "Login failed"));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const fetchRoles = () => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await axios.get(
        "https://workintech-fe-ecommerce.onrender.com/roles"
      );
      dispatch(setRoles(response.data));
    } catch (error) {
      dispatch(setError("Failed to fetch roles"));
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const autoLogin = () => {
  return async (dispatch) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      // Token doğrulama
      const response = await axios.get(
        "https://workintech-fe-ecommerce.onrender.com/verify",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Token geçerliyse user bilgilerini çek
      dispatch(setToken(token));
      dispatch(refreshUserData());
    } catch (error) {
      dispatch(logout());
    }
  };
};

// Fetch categories thunk action
export const fetchCategories = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get(
        "https://workintech-fe-ecommerce.onrender.com/categories"
      );
      dispatch(setCategories(response.data));
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };
};
