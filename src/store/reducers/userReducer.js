const initialState = {
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null,
  addressList: [],
  creditCards: [],
  roles: [],
  theme: "light",
  language: "en",
  token: localStorage.getItem("token"),
  isAuthenticated: !!localStorage.getItem("token"), // Check for token on init
  loading: false,
  error: null,
};

// Action Types
export const USER_ACTIONS = {
  SET_USER: "SET_USER",
  SET_ADDRESS_LIST: "SET_ADDRESS_LIST",
  SET_CREDIT_CARDS: "SET_CREDIT_CARDS",
  SET_ROLES: "SET_ROLES",
  SET_THEME: "SET_THEME",
  SET_LANGUAGE: "SET_LANGUAGE",
  SET_TOKEN: "SET_TOKEN",
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  LOGOUT: "LOGOUT",
};

// Action Creators
export const setUser = (user) => ({
  type: USER_ACTIONS.SET_USER,
  payload: user,
});

export const setAddressList = (addressList) => ({
  type: USER_ACTIONS.SET_ADDRESS_LIST,
  payload: addressList,
});

export const setCreditCards = (creditCards) => ({
  type: USER_ACTIONS.SET_CREDIT_CARDS,
  payload: creditCards,
});

export const setRoles = (roles) => ({
  type: USER_ACTIONS.SET_ROLES,
  payload: roles,
});

export const setTheme = (theme) => ({
  type: USER_ACTIONS.SET_THEME,
  payload: theme,
});

export const setLanguage = (language) => ({
  type: USER_ACTIONS.SET_LANGUAGE,
  payload: language,
});

export const setToken = (token) => ({
  type: USER_ACTIONS.SET_TOKEN,
  payload: token,
});

export const setLoading = (loading) => ({
  type: USER_ACTIONS.SET_LOADING,
  payload: loading,
});

export const setError = (error) => ({
  type: USER_ACTIONS.SET_ERROR,
  payload: error,
});

export const logout = () => ({
  type: USER_ACTIONS.LOGOUT,
});

// Reducer
const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_ACTIONS.SET_USER:
      localStorage.setItem("user", JSON.stringify(action.payload));
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case USER_ACTIONS.SET_ADDRESS_LIST:
      return { ...state, addressList: action.payload };
    case USER_ACTIONS.SET_CREDIT_CARDS:
      return { ...state, creditCards: action.payload };
    case USER_ACTIONS.SET_ROLES:
      return { ...state, roles: action.payload };
    case USER_ACTIONS.SET_THEME:
      return { ...state, theme: action.payload };
    case USER_ACTIONS.SET_LANGUAGE:
      return { ...state, language: action.payload };
    case USER_ACTIONS.SET_TOKEN:
      if (action.payload) {
        localStorage.setItem("token", action.payload);
      } else {
        localStorage.removeItem("token");
      }
      return {
        ...state,
        token: action.payload,
        isAuthenticated: !!action.payload,
      };
    case USER_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case USER_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    case USER_ACTIONS.LOGOUT:
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return {
        ...initialState,
        token: null,
        isAuthenticated: false,
        user: null,
      };
    default:
      return state;
  }
};

export default userReducer;
