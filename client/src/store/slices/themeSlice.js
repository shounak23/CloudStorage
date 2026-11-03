import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: "purple",
};

const themeSlice = createSlice({
  name: "themes",
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload.theme;
      document.documentElement.setAttribute("data-theme", action.payload);
    },
  },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;
