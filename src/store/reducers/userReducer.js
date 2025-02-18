const initialState = {
  user: null,
  token: localStorage.getItem("token"),
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Action Types
export const USER_ACTIONS = {
  SET_USER: "SET_USER",
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
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null,
      };

    case USER_ACTIONS.SET_TOKEN:
      if (action.payload) {
        localStorage.setItem("token", action.payload);
      } else {
        localStorage.removeItem("token");
      }
      return {
        ...state,
        token: action.payload,
      };

    case USER_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case USER_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case USER_ACTIONS.LOGOUT:
      localStorage.removeItem("token");
      return {
        ...initialState,
        token: null,
      };

    default:
      return state;
  }
};

export default userReducer;
