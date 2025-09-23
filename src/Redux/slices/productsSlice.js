// src/redux/slices/productsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Async thunks for API calls

// Get all products
export const getAllProducts = createAsyncThunk(
  'products/getAllProducts',
  async ({ page = 1, limit = 12 } = {}, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/product/products?page=${page}&limit=${limit}`);
      const data = await response.json();
      
      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to fetch products');
      }
      
      // Handle nested data structure from API
      return data.data || data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Search products
export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async ({ query, page = 1, limit = 12 }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/product/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
      const data = await response.json();
      
      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to search products');
      }
      
      // Handle nested data structure from API
      return data.data || data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Get product by ID
export const getProductById = createAsyncThunk(
  'products/getProductById',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/product/${productId}`);
      const data = await response.json();
      
      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to fetch product');
      }
      
      // Handle nested data structure from API
      return data.data || data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Get products by category
export const getProductsByCategory = createAsyncThunk(
  'products/getProductsByCategory',
  async ({ categoryId, page = 1, limit = 12 }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/product/category/${categoryId}?page=${page}&limit=${limit}`);
      const data = await response.json();
      
      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to fetch products by category');
      }
      
      // Handle nested data structure from API
      return data.data || data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Get products by subcategory
export const getProductsBySubcategory = createAsyncThunk(
  'products/getProductsBySubcategory',
  async ({ subcategoryId, page = 1, limit = 12, isActive = true }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/product/subcategory/${subcategoryId}?page=${page}&limit=${limit}&isActive=${isActive}`);
      const data = await response.json();
      
      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to fetch products by subcategory');
      }
      
      // Handle nested data structure from API
      return data.data || data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Get available sizes for a product
export const getAvailableSizes = createAsyncThunk(
  'products/getAvailableSizes',
  async ({ productId, colorName }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/product/${productId}/colors/${encodeURIComponent(colorName)}/sizes`);
      const data = await response.json();
      
      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to fetch available sizes');
      }
      
      // Handle nested data structure from API
      return { productId, colorName, sizes: data.data || data };
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

const initialState = {
  // Products list
  products: [],
  total: 0,
  page: 1,
  pages: 1,
  currentProduct: null,
  productSizes: {},
  searchResults: [],
  searchTotal: 0,
  searchPage: 1,
  searchPages: 1,
  searchQuery: '',
  loading: false,
  searchLoading: false,
  productLoading: false,
  sizesLoading: false,
  error: null,
  searchError: null,
  productError: null,
  sizesError: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProducts: (state) => {
      state.products = [];
      state.total = 0;
      state.page = 1;
      state.pages = 1;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchTotal = 0;
      state.searchPage = 1;
      state.searchPages = 1;
      state.searchQuery = '';
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
      state.productError = null;
    },
    clearErrors: (state) => {
      state.error = null;
      state.searchError = null;
      state.productError = null;
      state.sizesError = null;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    }
  },
  extraReducers: (builder) => {
    // Get all products
    builder
      .addCase(getAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products || [];
        state.total = action.payload.total || 0;
        state.page = action.payload.page || 1;
        state.pages = action.payload.pages || 1;
        state.error = null;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Search products
    builder
      .addCase(searchProducts.pending, (state) => {
        state.searchLoading = true;
        state.searchError = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload.products || [];
        state.searchTotal = action.payload.total || 0;
        state.searchPage = action.payload.page || 1;
        state.searchPages = action.payload.pages || 1;
        state.searchError = null;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.searchLoading = false;
        state.searchError = action.payload;
      });

    // Get product by ID
    builder
      .addCase(getProductById.pending, (state) => {
        state.productLoading = true;
        state.productError = null;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.productLoading = false;
        state.currentProduct = action.payload;
        state.productError = null;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.productLoading = false;
        state.productError = action.payload;
      });

    // Get products by category
    builder
      .addCase(getProductsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products || [];
        state.total = action.payload.total || 0;
        state.page = action.payload.page || 1;
        state.pages = action.payload.pages || 1;
        state.error = null;
      })
      .addCase(getProductsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get products by subcategory
    builder
      .addCase(getProductsBySubcategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductsBySubcategory.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products || [];
        state.total = action.payload.total || 0;
        state.page = action.payload.page || 1;
        state.pages = action.payload.pages || 1;
        state.error = null;
      })
      .addCase(getProductsBySubcategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get available sizes
    builder
      .addCase(getAvailableSizes.pending, (state) => {
        state.sizesLoading = true;
        state.sizesError = null;
      })
      .addCase(getAvailableSizes.fulfilled, (state, action) => {
        state.sizesLoading = false;
        const { productId, colorName, sizes } = action.payload;

        if (!state.productSizes[productId]) {
          state.productSizes[productId] = {};
        }
        state.productSizes[productId][colorName] = sizes;
        state.sizesError = null;
      })
      .addCase(getAvailableSizes.rejected, (state, action) => {
        state.sizesLoading = false;
        state.sizesError = action.payload;
      });
  },
});

export const {
  clearProducts,
  clearSearchResults,
  clearCurrentProduct,
  clearErrors,
  setSearchQuery
} = productsSlice.actions;

export default productsSlice.reducer;