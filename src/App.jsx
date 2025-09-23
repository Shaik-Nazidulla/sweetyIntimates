// sweetyintimate/src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./Redux/store";

// Pages
import Home from "./pages/Home";
import Products from "./components/Products";
import ProductDetail from "./components/ProductDetail";
import SearchResults from "./components/SearchResults";
import Wishlist from "./components/Wishlist";
import Cart from "./components/cart";
import UserProfile from "./pages/UserProfile";

// Components
import Topbar from "./components/Topbar";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Context Providers
import { CartProvider } from "./components/CartContext";
import { WishlistProvider } from "./components/WishlistContext";

import "./App.css";

function App() {
  return (
    <Provider store={store}>
      <CartProvider>
        <WishlistProvider>
          <Router>
            <div className="font-sans">
              {/* Global Layout Components */}
              <Topbar />
              <Navbar />

              <Routes>
                {/* Home */}
                <Route path="/" element={<Home />} />

                {/* Dynamic product routes */}
                <Route path="/products" element={<Products />} />
                <Route path="/products/:category" element={<Products />} />
                <Route
                  path="/products/:category/:subcategory"
                  element={<Products />}
                />

                {/* Product details */}
                <Route path="/product/:productId" element={<ProductDetail />} />

                {/* Cart & Wishlist */}
                <Route path="/cart" element={<Cart />} />
                <Route path="/wishlist" element={<Wishlist />} />

                {/* Search */}
                <Route path="/search" element={<SearchResults />} />

                {/* User Profile */}
                <Route path="/profile" element={<UserProfile />} />

                {/* Auth routes (can be removed as SignIn modal handles both) */}
                <Route path="/login" element={<div>Login Page - Use SignIn Modal Instead</div>} />
                <Route path="/register" element={<div>Register Page - Use SignIn Modal Instead</div>} />
              </Routes>

              {/* Global Footer */}
              <Footer />
            </div>
          </Router>
        </WishlistProvider>
      </CartProvider>
    </Provider>
  );
}

export default App;