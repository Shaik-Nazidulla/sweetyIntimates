//src/components/CartContext.jsx - Updated for new API structure
import React, { createContext, useContext, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import {
  addToCart as addToCartLocal,
  removeFromCart,
  updateQuantity,
  clearCart,
  addToCartAsync,
  updateCartItemAsync,
  removeFromCartAsync,
  fetchCartDetails,
  clearCartAsync,
  validateCartAsync,
  mergeCartAsync,
  applyDiscountAsync,
  removeDiscountAsync,
  clearErrors,
  syncWithApiCart
} from '../Redux/slices/cartSlice';
import { apiService } from '../services/api';
import Notification from "./Notification";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const dispatch = useDispatch();
  
  // Get cart state from Redux
  const {
    items: cartItems,
    totalItems,
    totalPrice,
    cartDetails,
    cart,
    totals,
    loading,
    addingToCart,
    updatingCart,
    removingFromCart,
    clearingCart,
    validatingCart,
    mergingCart,
    applyingDiscount,
    removingDiscount,
    error,
    addError,
    updateError,
    removeError,
    clearError,
    validateError,
    mergeError,
    discountError,
    hasDiscount,
    appliedDiscount,
    cartValidation
  } = useSelector(state => state.cart);

  const [notification, setNotification] = React.useState(null);

  // Check if user is authenticated
  const isAuthenticated = () => !!localStorage.getItem('token');

  // Load cart details on mount
  useEffect(() => {
    dispatch(fetchCartDetails());
  }, [dispatch]);

  // Show notifications for errors
  useEffect(() => {
    if (addError) {
      showNotification('Failed to add item to cart', 'error');
    }
    if (updateError) {
      showNotification('Failed to update cart item', 'error');
    }
    if (removeError) {
      showNotification('Failed to remove item from cart', 'error');
    }
    if (clearError) {
      showNotification('Failed to clear cart', 'error');
    }
    if (validateError) {
      showNotification('Cart validation failed', 'error');
    }
    if (mergeError) {
      showNotification('Failed to merge cart', 'error');
    }
    if (discountError) {
      showNotification('Discount operation failed', 'error');
    }
  }, [addError, updateError, removeError, clearError, validateError, mergeError, discountError]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  // Add to cart with color and image selection
  const addToCart = async (product, quantity = 1, selectedColor = '', selectedSize = 'M', selectedImage = '') => {
    try {
      // Prepare color object based on product data
      const colorObj = selectedColor && product.colors ? 
        product.colors.find(c => c.colorName === selectedColor || c.name === selectedColor) || 
        { colorName: selectedColor, colorHex: '#000000' } : {};

      // Use selected image or first available image
      const imageUrl = selectedImage || 
        (product.images && product.images.length > 0 ? product.images[0] : '') ||
        product.image || '';

      // Transform product data to match API expectations
      const productData = {
        _id: product.id || product._id,
        name: product.name || product.brand,
        price: product.price,
        images: product.images || [product.image],
        colors: product.colors || [],
        sizeStock: product.sizeStock || product.sizes?.map(size => ({ size, stock: 10 })) || [{ size: selectedSize, stock: 10 }]
      };

      // Immediate UI feedback
      dispatch(addToCartLocal({ 
        product: productData, 
        size: selectedSize.toLowerCase(), 
        quantity,
        color: colorObj,
        selectedImage: imageUrl
      }));

      // API call
      await dispatch(addToCartAsync({ 
        productId: productData._id, 
        quantity, 
        size: selectedSize.toLowerCase(),
        color: colorObj,
        selectedImage: imageUrl
      })).unwrap();

      showNotification(`${product.brand || product.name} added to cart!`);
      
      return { success: true };
    } catch (error) {
      console.error('Failed to add to cart:', error);
      // Remove from local state if API call failed
      dispatch(removeFromCart({ 
        productId: product.id || product._id, 
        size: selectedSize.toLowerCase(),
        colorName: selectedColor 
      }));
      showNotification(`Failed to add ${product.brand || product.name} to cart`, 'error');
      return { success: false, error };
    }
  };

  // Update cart quantity by item ID
  const updateQuantity = async (itemId, newQuantity) => {
    const item = cartItems.find(item => item._id === itemId);
    
    if (!item) {
      showNotification('Item not found in cart', 'error');
      return { success: false };
    }

    try {
      // Immediate UI feedback
      dispatch(updateQuantity({ 
        itemId, 
        quantity: newQuantity 
      }));

      // API call
      await dispatch(updateCartItemAsync({ 
        itemId,
        quantity: newQuantity,
        size: item.size,
        color: item.color,
        selectedImage: item.selectedImage
      })).unwrap();

      return { success: true };
    } catch (error) {
      console.error('Failed to update cart:', error);
      // Refresh cart to restore correct state
      dispatch(fetchCartDetails());
      showNotification('Failed to update cart item', 'error');
      return { success: false, error };
    }
  };

  // Update cart quantity by change amount (for +/- buttons)
  const updateCartQuantity = async (itemId, change) => {
    const item = cartItems.find(item => item._id === itemId);
    
    if (!item) return { success: false };

    const newQuantity = Math.max(1, item.quantity + change);
    return updateQuantity(itemId, newQuantity);
  };

  // Delete item from cart
  const deleteItem = async (itemId) => {
    const item = cartItems.find(item => item._id === itemId);
    
    if (!item) {
      showNotification('Item not found in cart', 'error');
      return { success: false };
    }

    const productId = item.product._id;
    const productName = item.product.name || item.product.brand;
    const size = item.size;
    const colorName = item.color?.colorName || '';

    try {
      // Immediate UI feedback
      dispatch(removeFromCart({ 
        productId, 
        size,
        colorName 
      }));

      // API call
      await dispatch(removeFromCartAsync({ 
        productId, 
        size,
        colorName 
      })).unwrap();

      showNotification(`${productName} removed from cart!`, 'info');
      return { success: true };
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      // Refresh cart to restore correct state
      dispatch(fetchCartDetails());
      showNotification('Failed to remove item from cart', 'error');
      return { success: false, error };
    }
  };

  // Clear entire cart
  const clearCartItems = async () => {
    try {
      await dispatch(clearCartAsync()).unwrap();
      showNotification('Cart cleared successfully!', 'info');
      return { success: true };
    } catch (error) {
      console.error('Failed to clear cart:', error);
      showNotification('Failed to clear cart', 'error');
      return { success: false, error };
    }
  };

  // Validate cart
  const validateCart = async () => {
    try {
      const result = await dispatch(validateCartAsync()).unwrap();
      
      if (!result.valid) {
        showNotification(`Cart validation issues: ${result.issues.join(', ')}`, 'warning');
      }
      
      return result;
    } catch (error) {
      console.error('Failed to validate cart:', error);
      showNotification('Failed to validate cart', 'error');
      return { valid: false, issues: ['Validation failed'] };
    }
  };

  // Add to wishlist
  const addToWishlistHandler = async (item) => {
    try {
      const productId = item.product?._id || item._id;
      await apiService.addToWishlist(productId);
      showNotification(`${item.product?.name || item.name} added to wishlist!`);
      return { success: true };
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
      showNotification('Failed to add to wishlist', 'error');
      return { success: false, error };
    }
  };

  // Handle cart merge after user login
  const mergeCart = async () => {
    try {
      const sessionId = localStorage.getItem('guestSessionId');
      if (sessionId && isAuthenticated()) {
        await dispatch(mergeCartAsync(sessionId)).unwrap();
        // Clear guest session after merge
        localStorage.removeItem('guestSessionId');
        // Refresh cart details
        dispatch(fetchCartDetails());
        showNotification('Cart merged successfully!');
        return { success: true };
      }
      return { success: false, message: 'No guest cart to merge' };
    } catch (error) {
      console.error('Failed to merge cart:', error);
      showNotification('Failed to merge cart', 'error');
      return { success: false, error };
    }
  };

  // Apply discount/coupon
  const applyDiscount = async (code, type = 'coupon') => {
    try {
      const result = await dispatch(applyDiscountAsync({ code, type })).unwrap();
      
      // Refresh cart details to get updated totals
      dispatch(fetchCartDetails());
      showNotification('Discount applied successfully!');
      return { success: true, result };
    } catch (error) {
      console.error('Failed to apply discount:', error);
      showNotification('Failed to apply discount. Please check the code and try again.', 'error');
      return { success: false, error };
    }
  };

  // Remove discount
  const removeDiscount = async () => {
    try {
      await dispatch(removeDiscountAsync()).unwrap();
      
      // Refresh cart details to get updated totals
      dispatch(fetchCartDetails());
      showNotification('Discount removed successfully!');
      return { success: true };
    } catch (error) {
      console.error('Failed to remove discount:', error);
      showNotification('Failed to remove discount', 'error');
      return { success: false, error };
    }
  };

  // Refresh cart data
  const refreshCart = () => {
    dispatch(fetchCartDetails());
  };

  // Clear all errors
  const clearAllErrors = () => {
    dispatch(clearErrors());
  };

  // Transform cart items to match the expected format for the Cart component
  const transformedCartItems = cartItems.map(item => ({
    id: item._id,
    _id: item._id,
    name: item.product.name,
    brand: item.product.name,
    description: item.product.description || item.product.name,
    price: item.product.price,
    originalPrice: item.product.originalPrice || item.product.price,
    discount: item.product.originalPrice 
      ? Math.round(((item.product.originalPrice - item.product.price) / item.product.originalPrice) * 100)
      : 0,
    image: item.selectedImage || (Array.isArray(item.product.images) ? item.product.images[0] : item.product.images),
    images: item.product.images,
    rating: item.product.rating || 5,
    color: item.color?.colorName || '',
    colorHex: item.color?.colorHex || '',
    size: item.size,
    quantity: item.quantity,
    selectedImage: item.selectedImage,
    addedAt: item.addedAt,
    itemTotal: item.itemTotal
  }));

  const contextValue = {
    // Cart data
    cartItems: transformedCartItems,
    totalItems: totals.itemCount || totalItems,
    totalPrice: totals.total || totalPrice,
    cartDetails,
    cart,
    totals,
    
    // Cart actions
    addToCart,
    updateQuantity: updateCartQuantity,
    updateItemQuantity: updateQuantity,
    deleteItem,
    clearCartItems,
    refreshCart,
    validateCart,
    
    // Wishlist
    addToWishlist: addToWishlistHandler,
    
    // User actions
    mergeCart,
    
    // Discount actions
    applyDiscount,
    removeDiscount,
    hasDiscount,
    appliedDiscount,
    
    // Loading states
    loading,
    addingToCart,
    updatingCart,
    removingFromCart,
    clearingCart,
    validatingCart,
    mergingCart,
    applyingDiscount,
    removingDiscount,
    
    // Error states and management
    error,
    addError,
    updateError,
    removeError,
    clearError,
    validateError,
    mergeError,
    discountError,
    clearAllErrors,
    
    // Validation
    cartValidation,
    
    // Utility
    isAuthenticated: isAuthenticated()
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};