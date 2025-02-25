import { createStore, combineReducers, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";
import logger from "redux-logger";
import userReducer from "./reducers/userReducer";
import productReducer from "./reducers/productReducer";
import shoppingCartReducer from "./reducers/shoppingCartReducer";
import categoryReducer from "./reducers/categoryReducer";

const rootReducer = combineReducers({
  user: userReducer,
  product: productReducer,
  shoppingCart: shoppingCartReducer,
  categories: categoryReducer,
});

const middleware = [thunk, logger];

const store = createStore(rootReducer, applyMiddleware(...middleware));

export default store;
