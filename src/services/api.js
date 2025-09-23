// src/services/api.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('token');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Helper function to get or generate session ID
  getSessionId() {
    let sessionId = localStorage.getItem('guestSessionId');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('guestSessionId', sessionId);
    }
    return sessionId;
  }

  // Product APIs (keeping existing ones)
  async getAllProducts(page = 1, limit = 12) {
    return this.request(`/product/products?page=${page}&limit=${limit}`);
  }

  async searchProducts(query, page = 1, limit = 12) {
    return this.request(`/product/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
  }

  async getProductById(productId) {
    return this.request(`/product/${productId}`);
  }

  async getProductsByCategory(categoryId, page = 1, limit = 12) {
    return this.request(`/product/category/${categoryId}?page=${page}&limit=${limit}`);
  }

  async getProductsBySubcategory(subcategoryId, page = 1, limit = 12, isActive = true) {
    return this.request(`/product/subcategory/${subcategoryId}?page=${page}&limit=${limit}&isActive=${isActive}`);
  }

  async getAvailableSizes(productId, colorName) {
    return this.request(`/product/${productId}/colors/${encodeURIComponent(colorName)}/sizes`);
  }

  // Category APIs (keeping existing)
  async getCategories() {
    return this.request('/category');
  }

  // Auth APIs (keeping existing)
  async getUserProfile() {
    return this.request('/auth/profile');
  }

  async updateUserProfile(profileData) {
    return this.request('/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify(profileData),
    });
  }

  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  // ===== UPDATED CART APIs =====

  // 1. Add items to cart (authenticated users)
  async addToCart(productId, quantity = 1, size = 'M', color = {}, selectedImage = '') {
    return this.request('/cart', {
      method: 'POST',
      body: JSON.stringify({ 
        product: productId, 
        quantity, 
        size: size.toLowerCase(),
        color,
        selectedImage
      }),
    });
  }

  // 2. Get user cart (simple)
  async getUserCart() {
    return this.request('/cart');
  }

  // 3. Get cart with details (includes product info and totals)
  async getCartDetails() {
    return this.request('/cart/details');
  }

  // 4. Update cart item by item ID
  async updateCartItem(itemId, quantity, size, color = {}, selectedImage = '') {
    return this.request(`/cart/item/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ 
        quantity, 
        size: size.toLowerCase(),
        color,
        selectedImage
      }),
    });
  }

  // 5. Remove item from cart (with query parameters for size and color)
  async removeFromCart(productId, size, colorName) {
    const params = new URLSearchParams();
    if (size) params.append('size', size.toLowerCase());
    if (colorName) params.append('colorName', colorName);
    
    const queryString = params.toString();
    const endpoint = `/cart/product/${productId}${queryString ? `?${queryString}` : ''}`;
    
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  // 6. Clear all cart items
  async clearCart() {
    return this.request('/cart/clear', {
      method: 'DELETE',
    });
  }

  // 7. Validate cart
  async validateCart() {
    return this.request('/cart/validate', {
      method: 'POST',
    });
  }

  // ===== GUEST CART APIs =====

  // 8. Add items to guest cart
  async addToGuestCart(sessionId, productId, quantity = 1, size = 'M', color = {}, selectedImage = '') {
    return this.request(`/cart/guest/${sessionId}/product/${productId}`, {
      method: 'POST',
      body: JSON.stringify({ 
        quantity, 
        size: size.toLowerCase(),
        color,
        selectedImage
      }),
    });
  }

  // 9. Update guest cart item by item ID
  async updateGuestCartItem(sessionId, itemId, quantity, size, color = {}, selectedImage = '') {
    return this.request(`/cart/guest/${sessionId}/item/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ 
        quantity, 
        size: size.toLowerCase(),
        color,
        selectedImage
      }),
    });
  }

  // 10. Remove item from guest cart
  async removeFromGuestCart(sessionId, productId, size, colorName) {
    const params = new URLSearchParams();
    if (size) params.append('size', size.toLowerCase());
    if (colorName) params.append('colorName', colorName);
    
    const queryString = params.toString();
    const endpoint = `/cart/guest/${sessionId}/product/${productId}${queryString ? `?${queryString}` : ''}`;
    
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  // 11. Get guest cart
  async getGuestCart(sessionId) {
    return this.request(`/cart/guest/${sessionId}`);
  }

  // 12. Merge cart (after user logs in)
  async mergeCart(sessionId) {
    return this.request('/cart/merge', {
      method: 'POST',
      body: JSON.stringify({ sessionId }),
    });
  }

  // ===== DISCOUNT APIs =====

  // 13. Apply discount
  async applyDiscount(code, type = 'coupon') {
    return this.request('/cart/apply-discount', {
      method: 'POST',
      body: JSON.stringify({ code, type }),
    });
  }

  // 14. Remove discount
  async removeDiscount() {
    return this.request('/cart/remove-discount', {
      method: 'DELETE',
    });
  }

  // 15. Get discount by code
  async getDiscountByCode(code) {
    return this.request(`/discount/code/${code}`);
  }

  // ===== UPDATED WISHLIST APIs =====

// Create wishlist
async createWishlist(name = "My Wishlist", isPublic = false) {
  return this.request('/wishlist/create', {
    method: 'POST',
    body: JSON.stringify({ name, isPublic }),
  });
}

// Get user's wishlist
async getWishlist() {
  return this.request('/wishlist');
}

// Add item to wishlist
async addToWishlist(productId, priceWhenAdded) {
  return this.request('/wishlist/add', {
    method: 'POST',
    body: JSON.stringify({ productId, priceWhenAdded }),
  });
}

// Check if item exists in wishlist
async checkWishlistItem(productId) {
  return this.request(`/wishlist/check/${productId}`);
}

// Toggle wishlist item
async toggleWishlistItem(productId, priceWhenAdded) {
  return this.request('/wishlist/toggle', {
    method: 'POST',
    body: JSON.stringify({ productId, priceWhenAdded }),
  });
}

// Remove item from wishlist
async removeFromWishlist(productId) {
  return this.request(`/wishlist/remove/${productId}`, {
    method: 'DELETE',
  });
}

// Get wishlist item count
async getWishlistCount() {
  return this.request('/wishlist/count');
}

// Move item to cart
async moveWishlistItemToCart(productId) {
  return this.request(`/wishlist/move-to-cart/${productId}`);
}
}

export const apiService = new ApiService();