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
  name: "files",
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

    addFile: (state, action) => {
      state.files.unshift(action.payload);
    },

    removeFile: (state, action) => {
      state.files = state.files.filter((file) => file._id !== action.payload);
    },

    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },

    setUploading: (state, action) => {
      state.uploading = action.payload;
    },
  },
});

export const {
  setFiles,
  addFile,
  removeFile,
  setUploadProgress,
  setUploading,
} = fileSlice.actions;

export default fileSlice.reducer;
