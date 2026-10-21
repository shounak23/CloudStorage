import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  accessToken: null,         // ← add this
  isAuthenticated: false,
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;           // ← user object
      state.accessToken = action.payload.accessToken; // ← token
      state.isAuthenticated = true;
    },

    setAuthLoading: (state, action) => {
      state.loading = action.payload;
    },

    logout: (state) => {
      state.user = null;
      state.accessToken = null;    // ← clear token on logout
      state.isAuthenticated = false;
      state.loading = false;
    },
  },
});

export const {
  setCredentials,
  setAuthLoading,
  logout,
} = authSlice.actions;

export default authSlice.reducer;