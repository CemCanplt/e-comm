import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import userReducer from './slices/userSlice';

const rootReducer = combineReducers({
  user: userReducer,
  // Gelecekte eklenecek reducerlar:
  // products: productsReducer,
  // cart: cartReducer,
  // orders: ordersReducer,
  // ...
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;