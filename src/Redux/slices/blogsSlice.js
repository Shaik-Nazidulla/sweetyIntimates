// src/redux/blogsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../../services/api";
export const getAllBlogs = createAsyncThunk(
  "blogs/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const result = await apiService.getAllBlogs();
      return result.data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch blogs");
    }
  }
);

export const getBlogById = createAsyncThunk(
  "blogs/getById",
  async (blogId, { rejectWithValue }) => {
    try {
      const result = await apiService.getBlogById(blogId);
      return result.data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch blog");
    }
  }
);

const initialState = {
  blogs: [],              
  currentBlog: null,      
  isLoading: false,       
  error: null,          
};

const blogsSlice = createSlice({
  name: "blogs",
  initialState,
  reducers: {
    
    clearCurrentBlog(state) {
      state.currentBlog = null;
    },
    
    clearError(state) {
      state.error = null;
    },
    
    resetBlogsState(state) {
      state.blogs = [];
      state.currentBlog = null;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ====================================================================
      // GET ALL BLOGS
      // ====================================================================
      .addCase(getAllBlogs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllBlogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.blogs = action.payload;
        state.error = null;
      })
      .addCase(getAllBlogs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to load blogs";
      })

      // ====================================================================
      // GET BLOG BY ID
      // ====================================================================
      .addCase(getBlogById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getBlogById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentBlog = action.payload;
        state.error = null;
      })
      .addCase(getBlogById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to load blog";
        state.currentBlog = null;
      });
  },
});

// ========================================================================
// ACTIONS EXPORT
// ========================================================================

export const { 
  clearCurrentBlog, 
  clearError, 
  resetBlogsState 
} = blogsSlice.actions;

// ========================================================================
// SELECTORS
// ========================================================================

export const selectBlogs = (state) => state.blogs.blogs;

export const selectCurrentBlog = (state) => state.blogs.currentBlog;

export const selectBlogsLoading = (state) => state.blogs.isLoading;

export const selectBlogsError = (state) => state.blogs.error;

export const selectBlogsCount = (state) => state.blogs.blogs.length;

export const selectHasBlogs = (state) => state.blogs.blogs.length > 0;

export default blogsSlice.reducer;