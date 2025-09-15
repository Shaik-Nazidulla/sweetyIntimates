import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Products from "./components/Products";
import ProductDetail from "./components/ProductDetail";
import SearchResults from "./components/SearchResults";
import Wishlist from "./components/Wishlist"; 

// Components
import Topbar from "./components/Topbar";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Cart from "./components/cart"; 
import { CartProvider } from "./components/CartContext";
import { WishlistProvider } from "./components/WishlistContext"; 
import "./App.css";

function App() {
  return (
    <Router>
      <CartProvider>
        <WishlistProvider> 
          <div className="font-sans">
            <Topbar />
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products/:category" element={<Products />} />
              <Route path="/product/:productId" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/wishlist" element={<Wishlist />} /> {/* ✅ New Route */}
              <Route path="/search" element={<SearchResults />} />
            </Routes>
            <Footer />
          </div>
        </WishlistProvider>
      </CartProvider>
    </Router>
  );
}

export default App;
