import axios from "axios";
import md5 from "md5";
import {
  setUser,
  setToken,
  setLoading,
  setError,
  setRoles, // Import setRoles
  logout, // Import logout
} from "../reducers/userReducer";

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

      // API'den gelen kullanıcı bilgilerini doğrudan dispatch et
      dispatch(setUser(response.data));
    } catch (error) {
      console.error("Failed to refresh user data:", error);
    }
  };
};

export const loginUser = ({ email, password, rememberMe, switchAccount }) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      // Eğer hesap değiştirme durumu varsa, mevcut token'ı temizle
      if (switchAccount) {
        dispatch(setToken(null));
      }

      const response = await axios.post(
        "https://workintech-fe-ecommerce.onrender.com/login",
        {
          email,
          password,
        }
      );

      // API'den gelen veriyi işle
      const { token, name, email: userEmail, role_id } = response.data;
      const hash = md5(email.toLowerCase().trim());
      const gravatarUrl = `https://www.gravatar.com/avatar/${hash}?d=identicon`;

      // Yeni formatı kullanarak user objesini oluştur
      const userWithAvatar = {
        name: name,
        email: userEmail,
        role_id: role_id,
        avatar: gravatarUrl,
      };

      dispatch(setUser(userWithAvatar));

      if (rememberMe) {
        dispatch(setToken(token));
      }

      return response.data;
    } catch (error) {
      dispatch(setError(error.response?.data || "Login failed"));
      throw error;
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

    // Set the token into axios header without Bearer prefix
    axios.defaults.headers.common["Authorization"] = token;

    try {
      const response = await axios.get(
        "https://workintech-fe-ecommerce.onrender.com/verify"
      );
      // Assuming the response contains a new token and user info
      const { token: newToken, ...userData } = response.data;

      // Renew the token if provided; otherwise keep the existing token
      const updatedToken = newToken || token;
      axios.defaults.headers.common["Authorization"] = updatedToken;
      localStorage.setItem("token", updatedToken);

      // Dispatch the user information to update the reducer
      dispatch(setUser(userData));
    } catch (error) {
      // If verification fails, remove the token and reset authentication
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
      dispatch(logout());
    }
  };
};
