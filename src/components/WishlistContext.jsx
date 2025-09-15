// WishlistContext.jsx
import React, { createContext, useState, useContext } from "react";
import Notification from "./Notification"; // Import the notification component

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  const addToWishlist = (product) => {
    setWishlistItems((prev) => {
      if (prev.find((item) => item.id === product.id)) {
        showNotification(`${product.brand || product.name} is already in wishlist!`, 'info');
        return prev; // already in wishlist
      }
      showNotification(`${product.brand || product.name} added to wishlist!`);
      return [...prev, product];
    });
  };

  const removeFromWishlist = (id) => {
    const item = wishlistItems.find(item => item.id === id);
    if (item) {
      showNotification(`${item.brand || item.name} removed from wishlist!`, 'info');
    }
    setWishlistItems((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleWishlist = (product) => {
    setWishlistItems((prev) => {
      const isInWishlist = prev.find((item) => item.id === product.id);
      if (isInWishlist) {
        showNotification(`${product.brand || product.name} removed from wishlist!`, 'info');
        return prev.filter((item) => item.id !== product.id);
      } else {
        showNotification(`${product.brand || product.name} added to wishlist!`);
        return [...prev, product];
      }
    });
  };

  return (
    <WishlistContext.Provider
      value={{ wishlistItems, addToWishlist, removeFromWishlist, toggleWishlist }}
    >
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

export const useWishlist = () => useContext(WishlistContext);