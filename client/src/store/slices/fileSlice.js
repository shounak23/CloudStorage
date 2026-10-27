import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  files: [], //← list of files
  isLoading: false, //← for API calls
  error: null,
  cursor: null, //← for pagination
  hasMore: true, //← for load more button
  search: "", //← current search text
  sortBy: "createdAt", //← current sort field
  order: "desc", //← current sort order
  fileType: "", //← current filter type
};

const fileSlice = createSlice({
  name: "file",
  initialState,
  reducers: {
    setFiles: (state, action) => {
      state.files = action.payload.files;
      state.isLoading = false;
    },

    setFileLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    logout: (state) => {
      state.files = null;
      state.isLoading = false;
    },
  },
});

export const { setFiles, setFileLoading, logout } = fileSlice.actions;

export default fileSlice.reducer;
