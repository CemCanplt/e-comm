import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { setUser, setToken, setLoading, setError } from '../slices/userSlice';
import md5 from 'md5';

export const loginUser = createAsyncThunk(
  'user/login',
  async ({ email, password, rememberMe }, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const response = await axios.post('https://workintech-fe-ecommerce.onrender.com/login', {
        email,
        password
      });

      const { token, user } = response.data;
      
      const hash = md5(email.toLowerCase().trim());
      const gravatarUrl = `https://www.gravatar.com/avatar/${hash}?d=identicon`;
      
      const userWithAvatar = {
        ...user,
        avatar: gravatarUrl
      };

      dispatch(setUser(userWithAvatar));
      
      if (rememberMe) {
        dispatch(setToken(token));
      }

      return response.data;
    } catch (error) {
      dispatch(setError(error.response?.data || 'Login failed'));
      throw error;
    }
  }
);

// Diğer user actions'ları buraya eklenebilir