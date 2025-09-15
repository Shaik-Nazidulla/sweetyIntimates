//Topbar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {useState} from "react";
import SignIn from "../pages/SignIn";
import { useCart } from "./CartContext";


const Topbar = () => {
  const navigate = useNavigate();
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const { cartItems } = useCart();

  const openSignIn = () => setIsSignInOpen(true);
  const closeSignIn = () => setIsSignInOpen(false);
  


  return (
    <>
      {/* First Navbar - Promotional Banner */}
      <div className="bg-pink-100 flex justify-center items-center text-black text-xs py-2 px-4">
        <div className="flex items-center justify-center text-center space-x-4 max-w-6xl w-full">
          <span className="font-medium text-xs sm:text-sm">
            NEW BRA AND SWIMMING COLLECTIONS: SHOP NOW!
          </span>
          <button className="text-gray-600 hover:text-gray-800 underline text-xs transition-all duration-200 hover:scale-105 transform">
            DETAILS
          </button>
          <button className="bg-white border border-gray-300 text-gray-700 px-3 py-1 text-xs hover:bg-gray-50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 rounded-sm">
            VIEW OFFERS
          </button>
        </div>
      </div>

      {/* Second Navbar */}
      <div className="bg-[#EEEEEE] border-b border-[#EEEEEE]">
        <div className="flex flex-col lg:flex-row justify-between items-center px-4 sm:px-6 py-3 space-y-3 lg:space-y-0 max-w-7xl mx-auto">
          
          {/* Left links */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start space-x-4 sm:space-x-6 text-xs text-black">
            <a href="#" className="hover:underline hover:text-pink-500 transition-all duration-200 hover:scale-105 transform py-1">FAQs</a>
            <a href="#" className="hover:underline hover:text-pink-500 transition-all duration-200 hover:scale-105 transform py-1">eCards</a>
            <a href="#" className="hover:underline hover:text-pink-500 transition-all duration-200 hover:scale-105 transform py-1">Gift Card</a>
            <a href="#" className="hover:underline hover:text-pink-500 transition-all duration-200 hover:scale-105 transform py-1">Online Help</a>
          </div>

          {/* Right icons */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            {/* Sign In */}
            <button 
            onClick={openSignIn}
            className="flex items-center space-x-1 text-pink-500 hover:text-pink-600 hover:bg-pink-50 px-2 py-1 rounded-md transition-all duration-200 hover:scale-105 hover:shadow-sm transform group">
              <svg className="w-4 h-4 group-hover:rotate-6 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-xs font-medium hidden sm:inline">SIGN IN</span>
            </button>

            {/* Wishlist */}
            <button 
            onClick={() => navigate("/Wishlist")}className="flex items-center space-x-1 text-pink-500 hover:text-pink-600 hover:bg-pink-50 px-2 py-1 rounded-md transition-all duration-200 hover:scale-105 hover:shadow-sm transform group relative">
              <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="text-xs font-medium hidden sm:inline">WISHLIST</span>
            </button>

            {/* Cart */}
<button
  onClick={() => navigate("/cart")}
  className="flex items-center space-x-1 text-pink-500 hover:text-pink-600 hover:bg-pink-50 px-2 py-1 rounded-md transition-all duration-200 hover:scale-105 hover:shadow-sm transform group relative"
>
  <svg
    className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 4H4m3 9v6a1 1 0 001 1h10a1 1 0 001-1v-6"
    />
  </svg>
  <span className="text-xs font-medium hidden sm:inline">CART</span>

  {/* 🔹 Always show badge */}
  <span
    className={`absolute -top-1 -right-1 text-xs rounded-full w-4 h-4 flex items-center justify-center transition-colors duration-200 ${
      cartItems.length > 0
        ? "bg-pink-500 text-white"
        : "bg-gray-300 text-black"
    }`}
  >
    {cartItems.length}
  </span>
</button>


            
          </div>
        </div>
      </div>
      {/* SignIn Modal */}
      <SignIn isOpen={isSignInOpen} onClose={closeSignIn} />
    </>
  );
};

export default Topbar;
