// src/services/api.js - Updated with proper cart API endpoints
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

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('token');
  }

  // ===== PRODUCT APIs =====
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

  // ===== AUTH APIs =====
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

  async getUserProfile() {
    return this.request('/auth/profile');
  }

  // ===== CART APIs (Updated to match your API responses) =====

  // 1. Add items to cart (POST /cart) - Works for authenticated users
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

  // 2. Get user cart (GET /cart) - Basic cart data
  async getUserCart() {
    return this.request('/cart');
  }

  // 3. Get cart with details (GET /cart/details) - Includes totals and product details
  async getCartDetails() {
    return this.request('/cart/details');
  }

  // 4. Update cart item by item ID (PUT /cart/item/:itemId)
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

  // 5. Remove item from cart (DELETE /cart/product/:productId?size=&colorName=)
  async removeFromCart(productId, size = '', colorName = '') {
    const params = new URLSearchParams();
    if (size) params.append('size', size.toLowerCase());
    if (colorName) params.append('colorName', colorName);
    
    const queryString = params.toString();
    const endpoint = `/cart/product/${productId}${queryString ? `?${queryString}` : ''}`;
    
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  // 6. Clear cart items (DELETE /cart/clear)
  async clearCart() {
    return this.request('/cart/clear', {
      method: 'DELETE',
    });
  }

  // 7. Validate cart (POST /cart/validate)
  async validateCart() {
    return this.request('/cart/validate', {
      method: 'POST',
    });
  }

  // ===== GUEST CART APIs =====

  // 8. Add items to guest cart (POST /cart/guest/:sessionId/product/:productId)
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

  // 9. Update guest cart item by item ID (PUT /cart/guest/:sessionId/item/:itemId)
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

  // 10. Remove item from guest cart (DELETE /cart/guest/:sessionId/product/:productId?size=&colorName=)
  async removeFromGuestCart(sessionId, productId, size = '', colorName = '') {
    const params = new URLSearchParams();
    if (size) params.append('size', size.toLowerCase());
    if (colorName) params.append('colorName', colorName);
    
    const queryString = params.toString();
    const endpoint = `/cart/guest/${sessionId}/product/${productId}${queryString ? `?${queryString}` : ''}`;
    
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  // 11. Get guest cart (GET /cart/guest/:sessionId)
  async getGuestCart(sessionId) {
    return this.request(`/cart/guest/${sessionId}`);
  }

  // 12. Get guest cart with details (simulated - since API doesn't have this endpoint)
  async getGuestCartDetails(sessionId) {
    try {
      const response = await this.getGuestCart(sessionId);
      if (response.data) {
        // Transform guest cart to match cart details format
        const guestCart = response.data;
        
        // Calculate totals for guest cart
        let subtotal = 0;
        const transformedItems = [];
        
        for (const item of guestCart.items) {
          // For guest cart, we might need to fetch product details separately
          // This is a limitation of guest carts - they might not have full product info
          const itemTotal = 0; // Would need product price to calculate
          subtotal += itemTotal;
          
          transformedItems.push({
            _id: item._id,
            product: {
              _id: item.product, // Only has product ID in guest cart
              name: 'Product', // Would need to fetch full product details
              price: 0 // Would need to fetch from product API
            },
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            selectedImage: item.selectedImage,
            addedAt: item.addedAt,
            itemTotal: itemTotal
          });
        }
        
        return {
          data: {
            cart: {
              _id: guestCart._id,
              user: null, // Guest cart
              appliedCoupon: {},
              appliedVoucher: {}
            },
            items: transformedItems,
            totals: {
              subtotal,
              discountAmount: 0,
              total: subtotal,
              itemCount: guestCart.items.length
            }
          }
        };
      }
    } catch (error) {
      // If guest cart doesn't exist, return empty cart structure
      return {
        data: {
          cart: null,
          items: [],
          totals: {
            subtotal: 0,
            discountAmount: 0,
            total: 0,
            itemCount: 0
          }
        }
      };
    }
  }

  // 13. Merge cart (POST /cart/merge)
  async mergeCart(sessionId) {
    return this.request('/cart/merge', {
      method: 'POST',
      body: JSON.stringify({ sessionId }),
    });
  }

  // ===== DISCOUNT APIs =====

  // 14. Apply discount (POST /cart/apply-discount)
  async applyDiscount(code, type = 'coupon') {
    return this.request('/cart/apply-discount', {
      method: 'POST',
      body: JSON.stringify({ code, type }),
    });
  }

  // 15. Remove discount (DELETE /cart/remove-discount)
  async removeDiscount(type = "all") {
    return this.request('/cart/remove-discount', {
      method: 'DELETE',
      body: JSON.stringify({ type }),
    });
  }

  // 16. Get discount by code (GET /discount/code/:code)
  async getDiscountByCode(code) {
    return this.request(`/discount/code/${code}`);
  }

  // ===== SMART CART METHODS (handles both authenticated and guest users) =====

  // Smart add to cart - automatically chooses between user/guest cart
  async smartAddToCart(productId, quantity = 1, size = 'M', color = {}, selectedImage = '') {
    if (this.isAuthenticated()) {
      return this.addToCart(productId, quantity, size, color, selectedImage);
    } else {
      const sessionId = this.getSessionId();
      return this.addToGuestCart(sessionId, productId, quantity, size, color, selectedImage);
    }
  }

  // Smart get cart details - automatically chooses between user/guest cart
  async smartGetCartDetails() {
    if (this.isAuthenticated()) {
      return this.getCartDetails();
    } else {
      const sessionId = this.getSessionId();
      return this.getGuestCartDetails(sessionId);
    }
  }

  // Smart update cart item
  async smartUpdateCartItem(itemId, quantity, size, color = {}, selectedImage = '') {
    if (this.isAuthenticated()) {
      return this.updateCartItem(itemId, quantity, size, color, selectedImage);
    } else {
      const sessionId = this.getSessionId();
      return this.updateGuestCartItem(sessionId, itemId, quantity, size, color, selectedImage);
    }
  }

  // Smart remove from cart
  async smartRemoveFromCart(productId, size = '', colorName = '') {
    if (this.isAuthenticated()) {
      return this.removeFromCart(productId, size, colorName);
    } else {
      const sessionId = this.getSessionId();
      return this.removeFromGuestCart(sessionId, productId, size, colorName);
    }
  }

  // Smart clear cart
  async smartClearCart() {
    if (this.isAuthenticated()) {
      return this.clearCart();
    } else {
      // For guest users, just clear the session ID
      localStorage.removeItem('guestSessionId');
      return { data: { items: [] } };
    }
  }

  // ===== WISHLIST APIs (keeping existing ones) =====
  async createWishlist(name = "My Wishlist", isPublic = false) {
    return this.request('/wishlist/create', {
      method: 'POST',
      body: JSON.stringify({ name, isPublic }),
    });
  }

  async getWishlist() {
    return this.request('/wishlist');
  }

  async addToWishlist(productId, priceWhenAdded) {
    return this.request('/wishlist/add', {
      method: 'POST',
      body: JSON.stringify({ productId, priceWhenAdded }),
    });
  }

  async removeFromWishlist(productId) {
    return this.request(`/wishlist/remove/${productId}`, {
      method: 'DELETE',
    });
  }

  async toggleWishlistItem(productId, priceWhenAdded) {
    return this.request('/wishlist/toggle', {
      method: 'POST',
      body: JSON.stringify({ productId, priceWhenAdded }),
    });
  }

  // ===== CATEGORY APIs =====
  async getCategories() {
    return this.request('/category');
  }

  async getCategoryById(categoryId) {
    return this.request(`/category/${categoryId}`);
  }

  // ===== SUBCATEGORY APIs =====
  async getSubcategoriesByCategory(categoryId) {
    return this.request(`/subcategory/category/${categoryId}`);
  }

  async getSubcategoryById(subcategoryId) {
    return this.request(`/subcategory/${subcategoryId}`);
  }
}

export const apiService = new ApiService();