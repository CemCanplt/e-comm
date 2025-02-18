import axios from "axios";
import md5 from "md5";
import {
  setUser,
  setToken,
  setLoading,
  setError,
} from "../reducers/userReducer";

export const loginUser = ({ email, password, rememberMe }) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await axios.post(
        "https://workintech-fe-ecommerce.onrender.com/login",
        {
          email,
          password,
        }
      );

      const { token, user } = response.data;

      const hash = md5(email.toLowerCase().trim());
      const gravatarUrl = `https://www.gravatar.com/avatar/${hash}?d=identicon`;

      const userWithAvatar = {
        ...user,
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

// Diğer user actions'ları buraya eklenebilir
