import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import fileReducer from "./slices/fileSlice";
import themeReducer from "./slices/themeSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    files: fileReducer,
    themes: themeReducer,
  },
});
