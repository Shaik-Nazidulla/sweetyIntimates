// src/hooks/useWishlist.js - Updated for new API integration
import { useSelector, useDispatch } from 'react-redux';
import { useCallback, useEffect } from 'react';
import {
  createWishlist,
  getWishlist,
  addToWishlist,
  checkWishlistItem,
  toggleWishlistItem,
  removeFromWishlist,
  getWishlistCount,
  moveWishlistItemToCart,
  clearWishlist,
  clearWishlistError,
  addToWishlistLocal,
  removeFromWishlistLocal,
  updateItemCheck
} from '../Redux/slices/WishlistSlice';

export const useWishlist = () => {
  const dispatch = useDispatch();
  
  // Get all wishlist state from Redux
  const {
    wishlist,
    items,
    loading,
    error,
    total,
    count,
    creating,
    adding,
    removing,
    toggling,
    checking,
    moving,
    itemChecks
  } = useSelector(state => state.wishlist);

  // Check if user is authenticated
  const isAuthenticated = () => !!localStorage.getItem('token');

  // Load wishlist on mount for authenticated users
  useEffect(() => {
    if (isAuthenticated()) {
      dispatch(getWishlist());
    }
  }, [dispatch]);

  // Create wishlist
  const createUserWishlist = useCallback(async (name = "My Wishlist", isPublic = false) => {
    try {
      await dispatch(createWishlist({ name, isPublic })).unwrap();
      return { success: true };
    } catch (error) {
      console.error('Failed to create wishlist:', error);
      return { success: false, error };
    }
  }, [dispatch]);

  // Add item to wishlist
  const addItemToWishlist = useCallback(async (product) => {
    if (!isAuthenticated()) {
      console.warn('User must be authenticated to use wishlist');
      return { success: false, error: 'Authentication required' };
    }

    const productId = product.id || product._id;
    const priceWhenAdded = product.price;

    try {
      // Optimistic update
      dispatch(addToWishlistLocal({ product, priceWhenAdded }));

      // API call
      await dispatch(addToWishlist({ productId, priceWhenAdded })).unwrap();
      return { success: true };
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
      // Revert optimistic update
      dispatch(removeFromWishlistLocal(productId));
      return { success: false, error };
    }
  }, [dispatch]);

  // Remove item from wishlist
  const removeItemFromWishlist = useCallback(async (productId) => {
    if (!isAuthenticated()) {
      return { success: false, error: 'Authentication required' };
    }

    try {
      // Optimistic update
      dispatch(removeFromWishlistLocal(productId));

      // API call
      await dispatch(removeFromWishlist(productId)).unwrap();
      return { success: true };
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
      // Refresh wishlist to restore correct state
      dispatch(getWishlist());
      return { success: false, error };
    }
  }, [dispatch]);

  // Toggle wishlist item (add/remove)
  const toggleWishlistItem = useCallback(async (product) => {
    if (!isAuthenticated()) {
      return { success: false, error: 'Authentication required' };
    }

    const productId = product.id || product._id;
    const priceWhenAdded = product.price;
    const isCurrentlyInWishlist = itemChecks[productId] || false;

    try {
      // Optimistic update
      if (isCurrentlyInWishlist) {
        dispatch(removeFromWishlistLocal(productId));
      } else {
        dispatch(addToWishlistLocal({ product, priceWhenAdded }));
      }

      // API call
      const result = await dispatch(toggleWishlistItem({ productId, priceWhenAdded })).unwrap();
      
      // Refresh wishlist to get latest state
      dispatch(getWishlist());
      
      return { success: true, action: result.action };
    } catch (error) {
      console.error('Failed to toggle wishlist item:', error);
      // Revert optimistic update
      dispatch(updateItemCheck({ productId, exists: isCurrentlyInWishlist }));
      return { success: false, error };
    }
  }, [dispatch, itemChecks]);

  // Check if item exists in wishlist
  const checkIfInWishlist = useCallback(async (productId) => {
    if (!isAuthenticated()) {
      return { success: false, exists: false };
    }

    // Return cached result if available
    if (itemChecks.hasOwnProperty(productId)) {
      return { success: true, exists: itemChecks[productId] };
    }

    try {
      const result = await dispatch(checkWishlistItem(productId)).unwrap();
      return { success: true, exists: result.exists };
    } catch (error) {
      console.error('Failed to check wishlist item:', error);
      return { success: false, exists: false, error };
    }
  }, [dispatch, itemChecks]);

  // Move item to cart and remove from wishlist
  const moveItemToCart = useCallback(async (productId) => {
    if (!isAuthenticated()) {
      return { success: false, error: 'Authentication required' };
    }

    try {
      await dispatch(moveWishlistItemToCart(productId)).unwrap();
      return { success: true };
    } catch (error) {
      console.error('Failed to move item to cart:', error);
      return { success: false, error };
    }
  }, [dispatch]);

  // Move all items to cart
  const moveAllToCart = useCallback(async () => {
    if (!isAuthenticated() || items.length === 0) {
      return { success: false, error: 'No items to move or authentication required' };
    }

    try {
      const results = await Promise.allSettled(
        items.map(item => {
          const productId = item.product._id || item.product;
          return dispatch(moveWishlistItemToCart(productId)).unwrap();
        })
      );

      const successes = results.filter(result => result.status === 'fulfilled').length;
      const failures = results.filter(result => result.status === 'rejected').length;

      return { 
        success: failures === 0, 
        moved: successes, 
        failed: failures 
      };
    } catch (error) {
      console.error('Failed to move items to cart:', error);
      return { success: false, error };
    }
  }, [dispatch, items]);

  // Clear entire wishlist
  const clearWishlistItems = useCallback(async () => {
    if (!isAuthenticated()) {
      return { success: false, error: 'Authentication required' };
    }

    if (items.length === 0) {
      return { success: true, message: 'Wishlist is already empty' };
    }

    try {
      // Remove all items individually (API doesn't have clear all endpoint)
      const results = await Promise.allSettled(
        items.map(item => {
          const productId = item.product._id || item.product;
          return dispatch(removeFromWishlist(productId)).unwrap();
        })
      );

      const failures = results.filter(result => result.status === 'rejected').length;
      
      if (failures === 0) {
        dispatch(clearWishlist());
        return { success: true };
      } else {
        // Refresh to get current state
        dispatch(getWishlist());
        return { success: false, error: `Failed to remove ${failures} items` };
      }
    } catch (error) {
      console.error('Failed to clear wishlist:', error);
      return { success: false, error };
    }
  }, [dispatch, items]);

  // Refresh wishlist data
  const refreshWishlist = useCallback(() => {
    if (isAuthenticated()) {
      dispatch(getWishlist());
    }
  }, [dispatch]);

  // Get wishlist count
  const getCount = useCallback(async () => {
    if (!isAuthenticated()) {
      return { success: false, count: 0 };
    }

    try {
      await dispatch(getWishlistCount()).unwrap();
      return { success: true };
    } catch (error) {
      console.error('Failed to get wishlist count:', error);
      return { success: false, error };
    }
  }, [dispatch]);

  // Clear errors
  const clearErrors = useCallback(() => {
    dispatch(clearWishlistError());
  }, [dispatch]);

  // Helper functions
  const isItemInWishlist = useCallback((productId) => {
    return itemChecks[productId] || false;
  }, [itemChecks]);

  const getWishlistItemsCount = useCallback(() => {
    return count || total || items.length;
  }, [count, total, items.length]);

  const isWishlistEmpty = useCallback(() => {
    return items.length === 0;
  }, [items]);

  const getWishlistTotal = useCallback(() => {
    return items.reduce((total, item) => total + (item.priceWhenAdded || 0), 0);
  }, [items]);

  // Transform items for backward compatibility with existing component
  const wishlistItems = items.map(item => ({
    id: item.product._id || item.product,
    _id: item._id,
    addedAt: item.addedAt,
    priceWhenAdded: item.priceWhenAdded,
    // Include product data if populated
    ...((typeof item.product === 'object') ? item.product : {})
  }));

  return {
    // State
    wishlist,
    items,
    wishlistItems, // Backward compatibility
    loading,
    error,
    total,
    count: getWishlistItemsCount(),
    
    // Loading states
    creating,
    adding,
    removing,
    toggling,
    checking,
    moving,
    
    // Item checks cache
    itemChecks,
    
    // Actions
    addToWishlist: addItemToWishlist,
    removeFromWishlist: removeItemFromWishlist,
    toggleWishlist: toggleWishlistItem,
    moveToCart: moveItemToCart,
    moveAllToCart,
    clearWishlist: clearWishlistItems,
    createWishlist: createUserWishlist,
    checkWishlistItem: checkIfInWishlist,
    refreshWishlist,
    getWishlistCount: getCount,
    clearErrors,
    
    // Helpers
    isItemInWishlist,
    isWishlistEmpty,
    getWishlistTotal,
    isAuthenticated: isAuthenticated(),
    
    // Computed values
    totalValue: getWishlistTotal(),
    itemCount: getWishlistItemsCount()
  };
};