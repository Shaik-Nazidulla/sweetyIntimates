// src/components/WishlistContext.jsx - Updated to work with Redux
import React, { createContext, useContext } from "react";
import { useWishlist as useWishlistHook } from "../hooks/useWishlist";
import Notification from "./Notification";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const {
    // State
    wishlistItems,
    loading,
    error,
    count,
    
    // Actions from hook
    addToWishlist: addToWishlistAction,
    removeFromWishlist: removeFromWishlistAction,
    toggleWishlist: toggleWishlistAction,
    
    // Other actions
    moveToCart,
    moveAllToCart,
    clearWishlist,
    refreshWishlist,
    
    // Helpers
    isItemInWishlist,
    isWishlistEmpty,
    getWishlistTotal,
    isAuthenticated
  } = useWishlistHook();

  // Notification state
  const [notification, setNotification] = React.useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  // Wrapper functions with notifications
  const addToWishlist = async (product) => {
    if (!isAuthenticated) {
      showNotification('Please login to use wishlist', 'error');
      return { success: false };
    }

    const result = await addToWishlistAction(product);
    
    if (result.success) {
      showNotification(`${product.brand || product.name} added to wishlist!`);
    } else {
      showNotification(
        result.error === 'Authentication required' 
          ? 'Please login to use wishlist' 
          : `Failed to add ${product.brand || product.name} to wishlist`,
        'error'
      );
    }
    
    return result;
  };

  const removeFromWishlist = async (productId) => {
    const item = wishlistItems.find(item => (item.id || item._id) === productId);
    const result = await removeFromWishlistAction(productId);
    
    if (result.success && item) {
      showNotification(`${item.brand || item.name} removed from wishlist!`, 'info');
    } else if (!result.success) {
      showNotification('Failed to remove item from wishlist', 'error');
    }
    
    return result;
  };

  const toggleWishlist = async (product) => {
    if (!isAuthenticated) {
      showNotification('Please login to use wishlist', 'error');
      return { success: false };
    }

    const productId = product.id || product._id;
    const wasInWishlist = isItemInWishlist(productId);
    
    const result = await toggleWishlistAction(product);
    
    if (result.success) {
      const action = result.action || (wasInWishlist ? 'removed' : 'added');
      const message = action === 'added' 
        ? `${product.brand || product.name} added to wishlist!`
        : `${product.brand || product.name} removed from wishlist!`;
      const type = action === 'added' ? 'success' : 'info';
      
      showNotification(message, type);
    } else {
      showNotification(
        `Failed to ${wasInWishlist ? 'remove from' : 'add to'} wishlist`,
        'error'
      );
    }
    
    return result;
  };

  // Move item to cart with notification
  const moveItemToCart = async (productId) => {
    const item = wishlistItems.find(item => (item.id || item._id) === productId);
    const result = await moveToCart(productId);
    
    if (result.success && item) {
      showNotification(`${item.brand || item.name} moved to cart!`);
    } else if (!result.success) {
      showNotification('Failed to move item to cart', 'error');
    }
    
    return result;
  };

  // Move all items to cart with notification
  const moveAllItemsToCart = async () => {
    if (isWishlistEmpty()) {
      showNotification('Your wishlist is empty', 'info');
      return { success: false };
    }

    const result = await moveAllToCart();
    
    if (result.success) {
      showNotification(`All items moved to cart!`);
    } else {
      const message = result.moved > 0 
        ? `${result.moved} items moved to cart, ${result.failed} failed`
        : 'Failed to move items to cart';
      showNotification(message, result.moved > 0 ? 'info' : 'error');
    }
    
    return result;
  };

  // Clear wishlist with notification
  const clearWishlistItems = async () => {
    if (isWishlistEmpty()) {
      showNotification('Your wishlist is already empty', 'info');
      return { success: true };
    }

    const result = await clearWishlist();
    
    if (result.success) {
      showNotification('Wishlist cleared!', 'info');
    } else {
      showNotification('Failed to clear wishlist', 'error');
    }
    
    return result;
  };

  // Enhanced context value with backward compatibility
  const contextValue = {
    // Original API for backward compatibility
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    
    // Extended API
    moveToCart: moveItemToCart,
    moveAllToCart: moveAllItemsToCart,
    clearWishlist: clearWishlistItems,
    refreshWishlist,
    
    // State
    loading,
    error,
    count,
    
    // Helpers
    isItemInWishlist,
    isWishlistEmpty,
    totalValue: getWishlistTotal(),
    isAuthenticated
  };

  return (
    <WishlistContext.Provider value={contextValue}>
      {children}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};