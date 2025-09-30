// src/Redux/slices/authSlice.js - Updated for better API integration and error handling
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../../services/api';

// Helper to handle token management
const getStoredToken = () => localStorage.getItem('token');
const setStoredToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

// Helper to clear all auth-related storage
const clearAuthStorage = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('guestSessionId');
  // Clear any other auth-related items
};

// Login user
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await apiService.login(email, password);
      
      // Store token
      if (response.data?.accessToken) {
        setStoredToken(response.data.accessToken);
      }
      
      return response.data;
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
      const response = await apiService.register(userData);
      
      // Store token if provided
      if (response.data?.accessToken) {
        setStoredToken(response.data.accessToken);
      }
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

// Get user profile
export const getUserProfile = createAsyncThunk(
  'auth/getUserProfile',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getStoredToken();
      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      const response = await apiService.getUserProfile();
      return response.data;
    } catch (error) {
      // If token is invalid, clear it
      if (error.message.includes('token') || 
          error.message.includes('unauthorized') || 
          error.message.includes('401')) {
        clearAuthStorage();
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
      const token = getStoredToken();
      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      const response = await apiService.updateUserProfile(profileData);
      return response.data;
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
      const response = await apiService.googleAuth(googleData);
      
      // Store token
      if (response.data?.accessToken) {
        setStoredToken(response.data.accessToken);
      }
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Google authentication failed');
    }
  }
);

// Logout user
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const token = getStoredToken();
      if (token) {
        try {
          // Call logout endpoint to invalidate token on server
          await apiService.logout();
        } catch (error) {
          // Don't fail logout if server call fails
          console.warn('Server logout failed:', error.message);
        }
      }
      
      // Always clear local storage
      clearAuthStorage();
      
      // Clear cart and wishlist when logging out
      // These will be handled by the respective slices listening to this action
      
      return true;
    } catch (error) {
      // Still clear local storage even if there's an error
      clearAuthStorage();
      return rejectWithValue(error.message || 'Logout failed');
    }
  }
);

// Refresh token
export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const token = getStoredToken();
      if (!token) {
        return rejectWithValue('No token to refresh');
      }

      const response = await apiService.refreshToken();
      
      // Store new token
      if (response.data?.accessToken) {
        setStoredToken(response.data.accessToken);
      }
      
      return response.data;
    } catch (error) {
      // If refresh fails, clear token
      clearAuthStorage();
      return rejectWithValue(error.message || 'Token refresh failed');
    }
  }
);

// Forgot password
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await apiService.forgotPassword(email);
      return response.data || response;
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
      const response = await apiService.resetPassword(token, password);
      return response.data || response;
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
      const token = getStoredToken();
      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      const response = await apiService.changePassword(currentPassword, newPassword);
      return response.data || response;
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
      const response = await apiService.verifyEmail(token);
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.message || 'Email verification failed');
    }
  }
);

// Check authentication status (useful for app initialization)
export const checkAuthStatus = createAsyncThunk(
  'auth/checkAuthStatus',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const token = getStoredToken();
      if (!token) {
        return rejectWithValue('No token found');
      }

      // Try to get user profile to verify token is still valid
      const response = await apiService.getUserProfile();
      return response.data;
    } catch (error) {
      // Token is invalid, clear it
      clearAuthStorage();
      return rejectWithValue('Authentication expired');
    }
  }
);

// Resend verification email
export const resendVerificationEmail = createAsyncThunk(
  'auth/resendVerificationEmail',
  async (email, { rejectWithValue }) => {
    try {
      const response = await apiService.resendVerificationEmail(email);
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to resend verification email');
    }
  }
);

const initialState = {
  user: null,
  token: getStoredToken(),
  isAuthenticated: !!getStoredToken(),
  isInitialized: false, // Track if auth status has been checked
  
  // General loading states
  loading: false,
  error: null,
  
  // Specific loading states
  loginLoading: false,
  registerLoading: false,
  profileLoading: false,
  updateProfileLoading: false,
  googleAuthLoading: false,
  logoutLoading: false,
  refreshTokenLoading: false,
  
  // Password related states
  forgotPasswordLoading: false,
  resetPasswordLoading: false,
  changePasswordLoading: false,
  passwordError: null,
  passwordSuccess: null,
  
  // Email verification states
  emailVerificationLoading: false,
  resendVerificationLoading: false,
  emailVerificationError: null,
  emailVerificationSuccess: null,
  
  // Profile specific states
  profileError: null,
  
  // General success messages
  successMessage: null,
  
  // Auth check states
  checkingAuth: false,
  authCheckError: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isInitialized = true;
      state.error = null;
      state.profileError = null;
      state.passwordError = null;
      state.passwordSuccess = null;
      state.emailVerificationError = null;
      state.emailVerificationSuccess = null;
      state.successMessage = null;
      state.authCheckError = null;
      clearAuthStorage();
    },
    
    clearAuthErrors: (state) => {
      state.error = null;
      state.profileError = null;
      state.passwordError = null;
      state.emailVerificationError = null;
      state.authCheckError = null;
    },
    
    clearSuccessMessages: (state) => {
      state.successMessage = null;
      state.passwordSuccess = null;
      state.emailVerificationSuccess = null;
    },
    
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isInitialized = true;
    },
    
    updateUserData: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    
    setInitialized: (state) => {
      state.isInitialized = true;
    },
    
    // Reset specific error states
    clearLoginError: (state) => {
      state.error = null;
    },
    
    clearProfileError: (state) => {
      state.profileError = null;
    },
    
    clearPasswordError: (state) => {
      state.passwordError = null;
    },
    
    clearEmailVerificationError: (state) => {
      state.emailVerificationError = null;
    },
  },
  
  extraReducers: (builder) => {
    // Check Auth Status
    builder
      .addCase(checkAuthStatus.pending, (state) => {
        state.checkingAuth = true;
        state.authCheckError = null;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.checkingAuth = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isInitialized = true;
        state.authCheckError = null;
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.checkingAuth = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isInitialized = true;
        state.authCheckError = action.payload;
      });

    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loginLoading = true;
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loginLoading = false;
        state.loading = false;
        state.user = action.payload.user || action.payload;
        state.token = action.payload.accessToken;
        state.isAuthenticated = true;
        state.isInitialized = true;
        state.error = null;
        state.successMessage = 'Login successful!';
        
        // Trigger cart merge - dispatch this from your login component
        state.needsCartMerge = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginLoading = false;
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.isInitialized = true;
      });

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.registerLoading = true;
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.registerLoading = false;
        state.loading = false;
        state.user = action.payload.user || action.payload;
        state.token = action.payload.accessToken;
        state.isAuthenticated = true;
        state.isInitialized = true;
        state.error = null;
        state.successMessage = 'Registration successful!';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerLoading = false;
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.isInitialized = true;
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
        state.isInitialized = true;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload;
        state.isInitialized = true;
        
        // If token is invalid, logout
        if (action.payload?.includes('token') || 
            action.payload?.includes('unauthorized') ||
            action.payload?.includes('Authentication expired')) {
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
        }
      });

    // Update Profile
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.updateProfileLoading = true;
        state.profileError = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.updateProfileLoading = false;
        state.user = action.payload;
        state.profileError = null;
        state.successMessage = 'Profile updated successfully!';
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.updateProfileLoading = false;
        state.profileError = action.payload;
      });

    // Google Auth
    builder
      .addCase(googleAuth.pending, (state) => {
        state.googleAuthLoading = true;
        state.loading = true;
        state.error = null;
      })
      .addCase(googleAuth.fulfilled, (state, action) => {
        state.googleAuthLoading = false;
        state.loading = false;
        state.user = action.payload.user || action.payload;
        state.token = action.payload.accessToken;
        state.isAuthenticated = true;
        state.isInitialized = true;
        state.error = null;
        state.successMessage = 'Google authentication successful!';
      })
      .addCase(googleAuth.rejected, (state, action) => {
        state.googleAuthLoading = false;
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.isInitialized = true;
      });

    // Logout
    builder
      .addCase(logoutUser.pending, (state) => {
        state.logoutLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.logoutLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isInitialized = true;
        state.error = null;
        state.profileError = null;
        state.passwordError = null;
        state.passwordSuccess = null;
        state.emailVerificationError = null;
        state.emailVerificationSuccess = null;
        state.successMessage = null;
        state.authCheckError = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.logoutLoading = false;
        // Still logout locally even if server call fails
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isInitialized = true;
        state.error = action.payload;
      });

    // Refresh Token
    builder
      .addCase(refreshToken.pending, (state) => {
        state.refreshTokenLoading = true;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.refreshTokenLoading = false;
        state.token = action.payload.accessToken;
        state.user = action.payload.user || state.user;
        state.isAuthenticated = true;
        state.isInitialized = true;
        state.error = null;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.refreshTokenLoading = false;
        state.error = action.payload;
        // If refresh fails, logout
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isInitialized = true;
      });

    // Forgot Password
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.forgotPasswordLoading = true;
        state.passwordError = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.forgotPasswordLoading = false;
        state.passwordSuccess = 'Password reset email sent successfully!';
        state.passwordError = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.forgotPasswordLoading = false;
        state.passwordError = action.payload;
        state.passwordSuccess = null;
      });

    // Reset Password
    builder
      .addCase(resetPassword.pending, (state) => {
        state.resetPasswordLoading = true;
        state.passwordError = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.resetPasswordLoading = false;
        state.passwordSuccess = 'Password reset successfully!';
        state.passwordError = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.resetPasswordLoading = false;
        state.passwordError = action.payload;
        state.passwordSuccess = null;
      });

    // Change Password
    builder
      .addCase(changePassword.pending, (state) => {
        state.changePasswordLoading = true;
        state.passwordError = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.changePasswordLoading = false;
        state.passwordSuccess = 'Password changed successfully!';
        state.passwordError = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.changePasswordLoading = false;
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

    // Resend Verification Email
    builder
      .addCase(resendVerificationEmail.pending, (state) => {
        state.resendVerificationLoading = true;
        state.emailVerificationError = null;
      })
      .addCase(resendVerificationEmail.fulfilled, (state, action) => {
        state.resendVerificationLoading = false;
        state.emailVerificationSuccess = 'Verification email sent successfully!';
        state.emailVerificationError = null;
      })
      .addCase(resendVerificationEmail.rejected, (state, action) => {
        state.resendVerificationLoading = false;
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
  updateUserData,
  setInitialized,
  clearLoginError,
  clearProfileError,
  clearPasswordError,
  clearEmailVerificationError
} = authSlice.actions;

export default authSlice.reducer;