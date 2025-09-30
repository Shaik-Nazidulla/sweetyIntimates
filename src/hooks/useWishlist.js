// src/hooks/useWishlist.js
import { useSelector, useDispatch } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import { apiService } from '../services/api';
import {
  createWishlist,
  getWishlist,
  addToWishlist,
  checkWishlistItem,
  toggleWishlistItem,
  removeFromWishlist,
  getWishlistCount,
  moveWishlistItemToCart,
  clearWishlistItems,
  clearWishlistError,
  addToWishlistLocal,
  removeFromWishlistLocal,
  updateItemCheck
} from '../Redux/slices/WishlistSlice';

export const useWishlist = () => {
  const dispatch = useDispatch();
  const [enrichedItems, setEnrichedItems] = useState([]);
  const [enriching, setEnriching] = useState(false);

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
    clearing,
    itemChecks
  } = useSelector(state => state.wishlist || {});

  const isAuthenticated = () => !!localStorage.getItem('token');

  // Load wishlist on mount for authenticated users
  useEffect(() => {
    if (isAuthenticated()) {
      dispatch(getWishlist());
    }
  }, [dispatch]);

  // Enrich wishlist items with product details (cached in enrichedItems)
  useEffect(() => {
    const enrichItems = async () => {
      if (!Array.isArray(items) || items.length === 0) {
        setEnrichedItems([]);
        return;
      }

      setEnriching(true);
      try {
        const enrichedPromises = items.map(async (item) => {
          const productId = typeof item.product === 'object' ? item.product._id : item.product;

          // If product object already present
          if (typeof item.product === 'object' && item.product._id) {
            const productObj = item.product;
            return {
              _id: item._id,
              id: productId,
              addedAt: item.addedAt,
              priceWhenAdded: item.priceWhenAdded,
              // full product details (preserve shape)
              ...productObj,
              image: productObj.colors?.[0]?.images?.[0] || productObj.images?.[0] || '',
              images: productObj.colors?.[0]?.images || productObj.images || [],
              colors: productObj.colors || []
            };
          }

          // otherwise fetch product details from API
          try {
            const response = await apiService.getProductById(productId);
            const product = response.data;
            return {
              _id: item._id,
              id: productId,
              addedAt: item.addedAt,
              priceWhenAdded: item.priceWhenAdded,
              name: product.name,
              brand: product.name,
              description: product.description,
              price: product.price,
              originalPrice: product.originalPrice,
              rating: product.rating || 5,
              image: product.colors?.[0]?.images?.[0] || product.images?.[0] || '',
              images: product.colors?.[0]?.images || product.images || [],
              colors: product.colors || [],
              category: product.category,
              subcategory: product.subcategory
            };
          } catch (fetchError) {
            console.error(`Failed to fetch product ${productId}:`, fetchError);
            // Minimal fallback so UI still shows item
            return {
              _id: item._id,
              id: productId,
              addedAt: item.addedAt,
              priceWhenAdded: item.priceWhenAdded,
              name: 'Product',
              price: item.priceWhenAdded,
              image: '',
              images: [],
              colors: []
            };
          }
        });

        const enriched = await Promise.all(enrichedPromises);
        setEnrichedItems(enriched);
      } catch (err) {
        console.error('Failed to enrich wishlist items:', err);
      } finally {
        setEnriching(false);
      }
    };

    enrichItems();
  }, [items]);

  // CREATE / ADD / REMOVE / TOGGLE (unchanged)
  const createUserWishlist = useCallback(async (name = "My Wishlist", isPublic = false) => {
    try {
      await dispatch(createWishlist({ name, isPublic })).unwrap();
      return { success: true };
    } catch (error) {
      console.error('Failed to create wishlist:', error);
      return { success: false, error };
    }
  }, [dispatch]);

  const addItemToWishlist = useCallback(async (product) => {
    if (!isAuthenticated()) return { success: false, error: 'Authentication required' };

    const productId = product.id || product._id;
    const priceWhenAdded = product.price;

    try {
      dispatch(addToWishlistLocal({ product, priceWhenAdded }));
      await dispatch(addToWishlist({ productId, priceWhenAdded })).unwrap();
      return { success: true };
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
      dispatch(removeFromWishlistLocal(productId));
      return { success: false, error };
    }
  }, [dispatch]);

  const removeItemFromWishlist = useCallback(async (productId) => {
    if (!isAuthenticated()) return { success: false, error: 'Authentication required' };

    try {
      dispatch(removeFromWishlistLocal(productId));
      await dispatch(removeFromWishlist(productId)).unwrap();
      return { success: true };
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
      dispatch(getWishlist());
      return { success: false, error };
    }
  }, [dispatch]);

  const toggleWishlistItemAction = useCallback(async (product) => {
    if (!isAuthenticated()) return { success: false, error: 'Authentication required' };

    const productId = product.id || product._id;
    const priceWhenAdded = product.price;
    const isCurrentlyInWishlist = itemChecks[productId] || false;

    try {
      if (isCurrentlyInWishlist) {
        dispatch(removeFromWishlistLocal(productId));
      } else {
        dispatch(addToWishlistLocal({ product, priceWhenAdded }));
      }
      const result = await dispatch(toggleWishlistItem({ productId, priceWhenAdded })).unwrap();
      dispatch(getWishlist());
      return { success: true, action: result.action };
    } catch (error) {
      console.error('Failed to toggle wishlist item:', error);
      dispatch(updateItemCheck({ productId, exists: isCurrentlyInWishlist }));
      return { success: false, error };
    }
  }, [dispatch, itemChecks]);

  const checkIfInWishlist = useCallback(async (productId) => {
    if (!isAuthenticated()) return { success: false, exists: false };

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

  // ---------- NEW/UPDATED: Move item to cart (single) ----------
  // Accepts either productId or product object; optional overrides for size/color/image
  const moveItemToCart = useCallback(async (productOrId, quantity = 1, size = 'M', colorName = '', colorHex = '', selectedImage = '') => {
    if (!isAuthenticated()) return { success: false, error: 'Authentication required' };

    // Determine productId and try to find an enriched item
    const productId = typeof productOrId === 'string' ? productOrId : (productOrId.id || productOrId._id);
    let productObj = enrichedItems.find(it => (it.id === productId || it._id === productId));

    try {
      // If we don't have product details, fetch product info from API
      if (!productObj) {
        const resp = await apiService.getProductById(productId);
        productObj = resp.data;
      }

      // Pick default color from productObj.colors[0] if caller didn't provide colorName
      const defaultColor = (productObj && Array.isArray(productObj.colors) && productObj.colors.length > 0)
        ? (productObj.colors[0])
        : { colorName: 'Default', colorHex: '#000000' };

      const finalColorName = colorName && colorName.trim() ? colorName : (defaultColor.colorName || defaultColor.name || 'Default');
      const finalColorHex = colorHex && colorHex.trim() ? colorHex : (defaultColor.colorHex || defaultColor.hex || '#000000');

      // Pick a sensible selectedImage if none passed
      const finalImage = selectedImage && selectedImage.trim()
        ? selectedImage
        : (productObj?.colors?.[0]?.images?.[0] || productObj?.images?.[0] || productObj?.image || '');

      // Dispatch the thunk that calls POST /wishlist/move-to-cart/:productId
      await dispatch(moveWishlistItemToCart({
        productId,
        quantity,
        size: size.toLowerCase(),
        colorName: finalColorName,
        colorHex: finalColorHex,
        selectedImage: finalImage
      })).unwrap();

      // Successful
      return { success: true };
    } catch (error) {
      console.error('Failed to move item to cart:', error);
      // Return a user-friendly message where possible
      const message = error?.message || (error?.payload ? error.payload : 'Failed to move item to cart');
      return { success: false, error: message };
    }
  }, [dispatch, enrichedItems]);

  // ---------- NEW/UPDATED: Move ALL wishlist items to cart (bulk) ----------
  const moveAllToCart = useCallback(async () => {
    if (!isAuthenticated()) {
      return { success: false, error: 'Authentication required' };
    }
    if (!enrichedItems || enrichedItems.length === 0) {
      return { success: false, error: 'No items to move' };
    }

    try {
      const results = await Promise.allSettled(
        enrichedItems.map(async (item) => {
          const productId = item.id || item._id;
          // Derive default color and image the same way as single-item flow
          const defaultColor = (item && Array.isArray(item.colors) && item.colors.length > 0)
            ? item.colors[0]
            : { colorName: 'Default', colorHex: '#000000' };

          const colorName = defaultColor.colorName || defaultColor.name || 'Default';
          const colorHex = defaultColor.colorHex || defaultColor.hex || '#000000';
          const selectedImage = item.image || item.images?.[0] || '';

          // call the thunk; unwrap inside map so Promise reflects success/rejection
          return dispatch(moveWishlistItemToCart({
            productId,
            quantity: 1,
            size: 'm',
            colorName,
            colorHex,
            selectedImage
          })).unwrap();
        })
      );

      const successes = results.filter(r => r.status === 'fulfilled').length;
      const failures = results.filter(r => r.status === 'rejected').length;

      return {
        success: failures === 0,
        moved: successes,
        failed: failures,
        details: results
      };
    } catch (error) {
      console.error('Failed to move all items to cart:', error);
      return { success: false, error };
    }
  }, [dispatch, enrichedItems]);

  // Clear wishlist
  const clearWishlistItemsAction = useCallback(async () => {
    if (!isAuthenticated()) return { success: false, error: 'Authentication required' };
    if (!enrichedItems || enrichedItems.length === 0) return { success: true, message: 'Wishlist already empty' };

    try {
      await dispatch(clearWishlistItems()).unwrap();
      return { success: true };
    } catch (error) {
      console.error('Failed to clear wishlist:', error);
      return { success: false, error };
    }
  }, [dispatch, enrichedItems]);

  // Refresh wishlist
  const refreshWishlist = useCallback(() => {
    if (isAuthenticated()) dispatch(getWishlist());
  }, [dispatch]);

  // Get wishlist count
  const getCount = useCallback(async () => {
    if (!isAuthenticated()) return { success: false, count: 0 };
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

  // Helpers
  const isItemInWishlist = useCallback((productId) => {
    return !!itemChecks[productId];
  }, [itemChecks]);

  const getWishlistItemsCount = useCallback(() => {
    return count || total || enrichedItems.length;
  }, [count, total, enrichedItems.length]);

  const isWishlistEmpty = useCallback(() => !enrichedItems || enrichedItems.length === 0, [enrichedItems]);

  const getWishlistTotal = useCallback(() => {
    return enrichedItems.reduce((sum, it) => sum + (it.priceWhenAdded || it.price || 0), 0);
  }, [enrichedItems]);

  return {
    // State
    wishlist,
    items: enrichedItems,
    wishlistItems: enrichedItems,
    loading: loading || enriching,
    error,
    total,
    count: getWishlistItemsCount(),

    // Loading flags
    creating,
    adding,
    removing,
    toggling,
    checking,
    moving,
    clearing,

    // Cache
    itemChecks,

    // Actions
    addToWishlist: addItemToWishlist,
    removeFromWishlist: removeItemFromWishlist,
    toggleWishlist: toggleWishlistItemAction,
    moveToCart: moveItemToCart,
    moveAllToCart,
    clearWishlist: clearWishlistItemsAction,
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
