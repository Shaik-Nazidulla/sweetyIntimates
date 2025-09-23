// src/Redux/slices/authSlice.js - Updated for better API compatibility
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Helper to handle API responses consistently
const handleApiResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || `HTTP error! status: ${response.status}`);
  }
  
  return data;
};

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Login user
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await handleApiResponse(response);
      
      // Store token in localStorage
      if (data.data?.accessToken) {
        localStorage.setItem('token', data.data.accessToken);
      }
      
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

// Register user
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      const data = await handleApiResponse(response);
      
      // Store token in localStorage
      if (data.data?.accessToken) {
        localStorage.setItem('token', data.data.accessToken);
      }
      
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

// Get user profile
export const getUserProfile = createAsyncThunk(
  'auth/getUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      
      const data = await handleApiResponse(response);
      return data.data;
    } catch (error) {
      // If token is invalid, clear it
      if (error.message.includes('token') || error.message.includes('unauthorized')) {
        localStorage.removeItem('token');
      }
      return rejectWithValue(error.message || 'Failed to fetch profile');
    }
  }
);

// Update user profile
export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(profileData),
      });
      
      const data = await handleApiResponse(response);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update profile');
    }
  }
);

// Google authentication
export const googleAuth = createAsyncThunk(
  'auth/googleAuth',
  async (googleData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(googleData),
      });
      
      const data = await handleApiResponse(response);
      
      // Store token in localStorage
      if (data.data?.accessToken) {
        localStorage.setItem('token', data.data.accessToken);
      }
      
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Google authentication failed');
    }
  }
);

// Logout user
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // Call logout endpoint to invalidate token on server
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: getAuthHeaders(),
        });
      }
      
      // Always clear local storage regardless of API call result
      localStorage.removeItem('token');
      localStorage.removeItem('guestSessionId'); // Clear guest session if exists
      
      return true;
    } catch (error) {
      // Still clear local storage even if API call fails
      localStorage.removeItem('token');
      localStorage.removeItem('guestSessionId');
      return rejectWithValue(error.message || 'Logout failed');
    }
  }
);

// Refresh token
export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No token to refresh');
      }

      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      
      const data = await handleApiResponse(response);
      
      // Store new token
      if (data.data?.accessToken) {
        localStorage.setItem('token', data.data.accessToken);
      }
      
      return data.data;
    } catch (error) {
      // If refresh fails, clear token
      localStorage.removeItem('token');
      return rejectWithValue(error.message || 'Token refresh failed');
    }
  }
);

// Forgot password
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await handleApiResponse(response);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Password reset request failed');
    }
  }
);

// Reset password
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, password }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });
      
      const data = await handleApiResponse(response);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Password reset failed');
    }
  }
);

// Change password (for authenticated users)
export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async ({ currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      
      const data = await handleApiResponse(response);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Password change failed');
    }
  }
);

// Verify email
export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async ({ token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
      
      const data = await handleApiResponse(response);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Email verification failed');
    }
  }
);

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,
  
  // Profile specific states
  profileLoading: false,
  profileError: null,
  
  // Password related states
  passwordLoading: false,
  passwordError: null,
  passwordSuccess: null,
  
  // Email verification states
  emailVerificationLoading: false,
  emailVerificationError: null,
  emailVerificationSuccess: null,
  
  // General success messages
  successMessage: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.profileError = null;
      state.passwordError = null;
      state.passwordSuccess = null;
      state.emailVerificationError = null;
      state.emailVerificationSuccess = null;
      state.successMessage = null;
      localStorage.removeItem('token');
      localStorage.removeItem('guestSessionId');
    },
    clearAuthErrors: (state) => {
      state.error = null;
      state.profileError = null;
      state.passwordError = null;
      state.emailVerificationError = null;
    },
    clearSuccessMessages: (state) => {
      state.successMessage = null;
      state.passwordSuccess = null;
      state.emailVerificationSuccess = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    updateUserData: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user || action.payload;
        state.token = action.payload.accessToken;
        state.isAuthenticated = true;
        state.error = null;
        state.successMessage = 'Login successful!';
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      });

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user || action.payload;
        state.token = action.payload.accessToken;
        state.isAuthenticated = true;
        state.error = null;
        state.successMessage = 'Registration successful!';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      });

    // Get Profile
    builder
      .addCase(getUserProfile.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.user = action.payload;
        state.profileError = null;
        state.isAuthenticated = true;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload;
        // If token is invalid, logout
        if (action.payload?.includes('token') || action.payload?.includes('unauthorized')) {
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
          localStorage.removeItem('token');
        }
      });

    // Update Profile
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.user = action.payload;
        state.profileError = null;
        state.successMessage = 'Profile updated successfully!';
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload;
      });

    // Google Auth
    builder
      .addCase(googleAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user || action.payload;
        state.token = action.payload.accessToken;
        state.isAuthenticated = true;
        state.error = null;
        state.successMessage = 'Google authentication successful!';
      })
      .addCase(googleAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      });

    // Logout
    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
        state.profileError = null;
        state.passwordError = null;
        state.passwordSuccess = null;
        state.emailVerificationError = null;
        state.emailVerificationSuccess = null;
        state.successMessage = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        // Still logout locally even if server call fails
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = action.payload;
      });

    // Refresh Token
    builder
      .addCase(refreshToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.accessToken;
        state.user = action.payload.user || state.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // If refresh fails, logout
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });

    // Forgot Password
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.passwordLoading = true;
        state.passwordError = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.passwordLoading = false;
        state.passwordSuccess = 'Password reset email sent successfully!';
        state.passwordError = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.passwordLoading = false;
        state.passwordError = action.payload;
        state.passwordSuccess = null;
      });

    // Reset Password
    builder
      .addCase(resetPassword.pending, (state) => {
        state.passwordLoading = true;
        state.passwordError = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.passwordLoading = false;
        state.passwordSuccess = 'Password reset successfully!';
        state.passwordError = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.passwordLoading = false;
        state.passwordError = action.payload;
        state.passwordSuccess = null;
      });

    // Change Password
    builder
      .addCase(changePassword.pending, (state) => {
        state.passwordLoading = true;
        state.passwordError = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.passwordLoading = false;
        state.passwordSuccess = 'Password changed successfully!';
        state.passwordError = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.passwordLoading = false;
        state.passwordError = action.payload;
        state.passwordSuccess = null;
      });

    // Verify Email
    builder
      .addCase(verifyEmail.pending, (state) => {
        state.emailVerificationLoading = true;
        state.emailVerificationError = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.emailVerificationLoading = false;
        state.emailVerificationSuccess = 'Email verified successfully!';
        state.emailVerificationError = null;
        // Update user verification status if user is logged in
        if (state.user) {
          state.user.emailVerified = true;
        }
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.emailVerificationLoading = false;
        state.emailVerificationError = action.payload;
        state.emailVerificationSuccess = null;
      });
  },
});

export const { 
  logout, 
  clearAuthErrors, 
  clearSuccessMessages, 
  setUser, 
  updateUserData 
} = authSlice.actions;

export default authSlice.reducer;