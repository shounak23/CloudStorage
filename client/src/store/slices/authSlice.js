import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  accessToken: null, // ← add this
  isAuthenticated: false,
  isLoading: false,
  error: null, //← login error message
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user; // ← user object
      state.accessToken = action.payload.accessToken; // ← token
      state.isAuthenticated = true;
    },

    setAuthLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    logout: (state) => {
      state.user = null;
      state.accessToken = null; // ← clear token on logout
      state.isAuthenticated = false;
      state.isLoading = false;
    },
  },
});

export const { setCredentials, setAuthLoading, logout } = authSlice.actions;

export default authSlice.reducer;
