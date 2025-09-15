// CartContext.jsx
import React, { createContext, useState, useContext } from "react";
import Notification from "./Notification"; // Import the notification component

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  const addToCart = (product, quantity = 1, selectedColor, selectedSize) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (item) =>
          item.id === product.id &&
          item.color === selectedColor &&
          item.size === selectedSize
      );

      if (existing) {
        showNotification(`${product.brand || product.name} quantity increased in cart!`);
        return prev.map((item) =>
          item.id === product.id &&
          item.color === selectedColor &&
          item.size === selectedSize
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      showNotification(`${product.brand || product.name} added to cart!`);
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          brand: product.brand || product.name, // Use product name as fallback
          description: product.description,
          price: product.price,
          originalPrice: product.originalPrice || product.price,
          discount: product.originalPrice
            ? Math.round(
                ((product.originalPrice - product.price) /
                  product.originalPrice) *
                  100
              )
            : 0,
          image: product.images ? product.images[0] : product.image,
          rating: product.rating || 5,
          color: selectedColor || product.colors?.[0] || "",
          size: selectedSize || product.sizes?.[0] || "",
          quantity,
        },
      ];
    });
  };

  const updateQuantity = (id, change) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const deleteItem = (id) => {
    const item = cartItems.find(item => item.id === id);
    if (item) {
      showNotification(`${item.brand || item.name} removed from cart!`, 'info');
    }
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, updateQuantity, deleteItem }}
    >
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

export const useCart = () => useContext(CartContext);