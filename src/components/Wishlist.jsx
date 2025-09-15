// wishlist.jsx
import { useWishlist } from "./WishlistContext";
import { useCart } from "./CartContext";
import infoproducts from "./ProductsInfo";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

// ⭐ Reusable Wishlist Item Component
const WishlistItem = ({ item, removeFromWishlist, addToCart, renderStars }) => {
  const itemRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // GSAP hover animations
    const element = itemRef.current;
    
    const handleMouseEnter = () => {
      gsap.to(element, { 
        scale: 1.02, 
        boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
        duration: 0.3, 
        ease: "power2.out" 
      });
    };

    const handleMouseLeave = () => {
      gsap.to(element, { 
        scale: 1, 
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        duration: 0.3, 
        ease: "power2.out" 
      });
    };

    element.addEventListener("mouseenter", handleMouseEnter);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mouseenter", handleMouseEnter);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const goToDetail = () => {
    navigate(`/product/${item.id}`);
  };

  const handleAddToCart = () => {
    addToCart(item);
    // Show feedback animation
    const button = itemRef.current.querySelector('.add-to-cart-btn');
    gsap.to(button, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
    });
  };

  const handleRemove = () => {
    // Animate removal
    gsap.to(itemRef.current, {
      x: -100,
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => removeFromWishlist(item.id)
    });
  };

  return (
    <div 
      ref={itemRef}
      className="flex gap-4 py-4 px-4 bg-white rounded-lg shadow-sm border border-gray-100 mb-4 transition-all duration-300"
    >
      <img
        src={item.images ? item.images[0] : item.image}
        alt={item.description}
        className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg object-cover flex-shrink-0 cursor-pointer"
        onClick={goToDetail}
      />
      
      {/* Mobile Layout - Single Column */}
      <div className="flex-1 lg:hidden">
        <div 
          className="text-base sm:text-lg font-semibold text-gray-800 mb-1 cursor-pointer hover:text-pink-600 transition-colors"
          onClick={goToDetail}
        >
          {item.brand || item.name}
        </div>
        <div className="text-gray-600 text-xs sm:text-sm mb-2 leading-relaxed">
          {item.description}
        </div>
        <div className="text-pink-600 text-sm mb-2">{renderStars(item.rating || 5)}</div>
        
        {/* Price Section for Mobile */}
        <div className="flex items-center gap-2 mb-3">
          <div className="text-lg font-semibold text-gray-800">
            ₹{item.price.toLocaleString()}
          </div>
          {item.originalPrice && (
            <div className="text-sm text-gray-500 line-through">
              ₹{item.originalPrice.toLocaleString()}
            </div>
          )}
          {(item.discount || item.originalPrice) && (
            <div className="text-sm text-pink-600 font-semibold">
              ({item.discount || Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% off)
            </div>
          )}
        </div>

        {/* Status for Mobile */}
        <div className="text-xs text-green-600 font-medium mb-3">
          ✓ In Stock • FREE delivery
        </div>
        {(item.discount || item.originalPrice) && (
          <div className="bg-pink-600 text-white text-xs px-2 py-1 rounded mb-3 inline-block">
            Limited time deal
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 flex-wrap">
          <button
            className="add-to-cart-btn bg-pink-600 text-white py-2 px-4 rounded-2xl text-sm font-medium hover:bg-pink-700 transition-colors"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
          <button
            className="border border-pink-600 text-pink-600 py-2 px-4 rounded-2xl text-sm font-medium hover:bg-pink-50 transition-colors"
            onClick={handleRemove}
          >
            Remove
          </button>
          <button 
            className="text-pink-600 hover:underline text-sm"
            onClick={goToDetail}
          >
            View Details
          </button>
        </div>
      </div>

      {/* Desktop Layout - Two Columns */}
      <div className="hidden lg:flex flex-1 gap-4">
        {/* Left Column - Product Info */}
        <div className="flex-1 pr-5">
          <div 
            className="text-base sm:text-lg font-semibold text-gray-800 mb-1 cursor-pointer hover:text-pink-600 transition-colors"
            onClick={goToDetail}
          >
            {item.brand || item.name}
          </div>
          <div className="text-gray-600 text-xs sm:text-sm mb-2 leading-relaxed">
            {item.description}
          </div>
          <div className="text-pink-600 text-sm mb-2">{renderStars(item.rating || 5)}</div>
          
          {/* Price Section */}
          <div className="flex items-center gap-2 mb-3">
            <div className="text-lg font-semibold text-gray-800">
              ₹{item.price.toLocaleString()}
            </div>
            {item.originalPrice && (
              <div className="text-sm text-gray-500 line-through">
                ₹{item.originalPrice.toLocaleString()}
              </div>
            )}
            {(item.discount || item.originalPrice) && (
              <div className="text-sm text-pink-600 font-semibold">
                ({item.discount || Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% off)
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 flex-wrap">
            <button
              className="add-to-cart-btn bg-pink-600 text-white py-2 px-4 rounded-2xl text-sm font-medium hover:bg-pink-700 transition-colors"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
            <button
              className="border border-pink-600 text-pink-600 py-2 px-4 rounded-2xl text-sm font-medium hover:bg-pink-50 transition-colors"
              onClick={handleRemove}
            >
              Remove
            </button>
            <button 
              className="text-pink-600 hover:underline text-sm"
              onClick={goToDetail}
            >
              View Details
            </button>
          </div>
        </div>

        {/* Right Column - Availability Status */}
        <div className="text-right min-w-24 flex-shrink-0">
          <div className="text-xs text-green-600 font-medium mb-1">
            ✓ In Stock
          </div>
          <div className="text-xs text-gray-500">
            FREE delivery
          </div>
          {(item.discount || item.originalPrice) && (
            <div className="bg-pink-600 text-white text-xs px-2 py-1 rounded mt-2 inline-block">
              Limited time deal
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ⭐ Reusable Recommendation Item Component
const RecommendationItem = ({ item, addToCart, addToWishlist, renderStars }) => {
  const itemRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const element = itemRef.current;
    
    const handleMouseEnter = () => {
      gsap.to(element, { 
        y: -5,
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        duration: 0.3, 
        ease: "power2.out" 
      });
    };

    const handleMouseLeave = () => {
      gsap.to(element, { 
        y: 0,
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        duration: 0.3, 
        ease: "power2.out" 
      });
    };

    element.addEventListener("mouseenter", handleMouseEnter);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mouseenter", handleMouseEnter);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const goToDetail = () => {
    navigate(`/product/${item.id}`);
  };

  return (
    <div 
      ref={itemRef}
      className="flex gap-3 py-3 border-b border-gray-200 last:border-b-0 transition-all duration-300"
    >
      <img
        src={item.images ? item.images[0] : item.image}
        alt={item.description}
        className="w-16 h-16 sm:w-20 sm:h-20 rounded-md object-cover flex-shrink-0 cursor-pointer"
        onClick={goToDetail}
      />
      <div className="flex-1">
        <div
          onClick={goToDetail}
          className="text-sm sm:text-base font-semibold text-gray-800 mb-1 cursor-pointer hover:text-pink-600 transition-colors"
        >
          {item.brand || item.name}
        </div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-pink-600 text-xs">{renderStars(item.rating || 5)}</span>
          {(item.discount || item.originalPrice) && (
            <span className="text-pink-600 text-xs font-semibold">
              -{item.discount || Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}%
            </span>
          )}
          <span className="text-sm font-semibold text-gray-800">
            ₹{item.price.toLocaleString()}
          </span>
        </div>
        <div className="text-gray-600 text-xs mb-2 leading-tight line-clamp-2">
          {item.description}
        </div>
        <div className="flex gap-2">
          <button
            className="bg-pink-600 text-white py-1 px-3 rounded-2xl text-xs font-medium hover:bg-pink-700 transition-colors"
            onClick={() => addToCart(item)}
          >
            Add to Cart
          </button>
          <button
            className="border border-pink-600 text-pink-600 py-1 px-3 rounded-2xl text-xs font-medium hover:bg-pink-50 transition-colors"
            onClick={() => addToWishlist(item)}
          >
            ♡
          </button>
        </div>
      </div>
    </div>
  );
};

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, addToWishlist } = useWishlist();
  const { addToCart } = useCart();
  const containerRef = useRef(null);
  
  // Recommendations based on wishlist or popular products
  const recommendations = infoproducts
    .filter(product => !wishlistItems.find(item => item.id === product.id))
    .slice(0, 6);

  const renderStars = (rating) => "★".repeat(rating);
  const getTotalItems = () => wishlistItems.length;

  useEffect(() => {
    // Initial animation for the entire container
    gsap.fromTo(containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
    );
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Mobile Layout */}
      <div className="lg:hidden">
        <div 
          ref={containerRef}
          className="p-3 pb-24" // Add bottom padding for footer
        >
          {/* Quick Actions - Mobile First */}
          <div className="bg-white rounded-xl p-4 shadow-lg mb-4">
            <div className="text-base font-semibold text-gray-800 mb-4">
              Quick Actions
            </div>
            <div className="flex flex-col gap-3">
              <button 
                className="w-full bg-pink-600 text-white py-3 rounded-3xl text-sm font-semibold hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => {
                  wishlistItems.forEach(item => addToCart(item));
                }}
                disabled={wishlistItems.length === 0}
              >
                Add All to Cart
              </button>
              <button 
                className="w-full border border-pink-600 text-pink-600 py-3 rounded-3xl text-sm font-semibold hover:bg-pink-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => {
                  if (wishlistItems.length > 0 && confirm('Are you sure you want to clear your entire wishlist?')) {
                    wishlistItems.forEach(item => removeFromWishlist(item.id));
                  }
                }}
                disabled={wishlistItems.length === 0}
              >
                Clear Wishlist
              </button>
            </div>
          </div>

          {/* Wishlist Items */}
          <div className="bg-white rounded-xl shadow-lg mb-4">
            <div className="flex justify-between items-center text-lg font-semibold text-gray-800 p-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <span className="text-pink-600">♡</span>
                My Wishlist
                <span className="text-gray-500 text-sm font-medium">
                  ({getTotalItems()} items)
                </span>
              </div>
            </div>
            
            <div className="p-2">
              {wishlistItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-10">
                  <div className="text-4xl text-gray-300 mb-4">♡</div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    Your wishlist is empty
                  </h3>
                  <p className="text-gray-500 mb-6 text-sm">
                    Save items you love by clicking the heart icon
                  </p>
                  <button
                    className="bg-pink-600 text-white py-3 px-6 rounded-2xl font-medium hover:bg-pink-700 transition-colors text-sm"
                    onClick={() => window.location.href = '/'}
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                wishlistItems.map((item) => (
                  <WishlistItem
                    key={item.id}
                    item={item}
                    removeFromWishlist={removeFromWishlist}
                    addToCart={addToCart}
                    renderStars={renderStars}
                  />
                ))
              )}
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-xl shadow-lg">
            <div className="text-lg font-semibold text-gray-800 p-4 text-center border-b border-gray-200">
              You Might Also Like
            </div>
            <div className="px-4 pb-4">
              {recommendations.map((item) => (
                <RecommendationItem
                  key={item.id}
                  item={item}
                  addToCart={addToCart}
                  addToWishlist={addToWishlist}
                  renderStars={renderStars}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block p-5">
        <div 
          ref={containerRef}
          className="max-w-7xl mx-auto flex flex-row gap-5 h-[calc(100vh-40px)]"
        >
          {/* Left - Wishlist */}
          <div className="flex-1 bg-white rounded-xl shadow-lg flex flex-col">
            <div className="flex justify-between items-center text-xl font-semibold text-gray-800 p-5 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <span className="text-pink-600">♡</span>
                My Wishlist
                <span className="text-gray-500 text-base font-medium">
                  ({getTotalItems()} items)
                </span>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto px-5 py-2 hide-scrollbar">
              {wishlistItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-20">
                  <div className="text-6xl text-gray-300 mb-4">♡</div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    Your wishlist is empty
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Save items you love by clicking the heart icon
                  </p>
                  <button
                    className="bg-pink-600 text-white py-3 px-6 rounded-2xl font-medium hover:bg-pink-700 transition-colors"
                    onClick={() => window.location.href = '/'}
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                wishlistItems.map((item) => (
                  <WishlistItem
                    key={item.id}
                    item={item}
                    removeFromWishlist={removeFromWishlist}
                    addToCart={addToCart}
                    renderStars={renderStars}
                  />
                ))
              )}
            </div>
          </div>

          {/* Right - Actions + Recommendations */}
          <div className="w-2/5 flex flex-col gap-5">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-5 shadow-lg">
              <div className="text-lg font-semibold text-gray-800 mb-4">
                Quick Actions
              </div>
              <div className="flex flex-col gap-3">
                <button 
                  className="w-full bg-pink-600 text-white py-3 rounded-3xl text-sm font-semibold hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => {
                    wishlistItems.forEach(item => addToCart(item));
                  }}
                  disabled={wishlistItems.length === 0}
                >
                  Add All to Cart
                </button>
                <button 
                  className="w-full border border-pink-600 text-pink-600 py-3 rounded-3xl text-sm font-semibold hover:bg-pink-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => {
                    if (wishlistItems.length > 0 && confirm('Are you sure you want to clear your entire wishlist?')) {
                      wishlistItems.forEach(item => removeFromWishlist(item.id));
                    }
                  }}
                  disabled={wishlistItems.length === 0}
                >
                  Clear Wishlist
                </button>
              </div>
            </div>
            
            {/* Recommendations */}
            <div className="bg-white rounded-xl shadow-lg flex flex-col flex-1 min-h-0">
              <div className="text-lg font-semibold text-gray-800 p-5 pb-3 text-center border-b border-gray-200">
                You Might Also Like
              </div>
              <div className="flex-1 overflow-y-auto px-5 pb-5 hide-scrollbar">
                {recommendations.map((item) => (
                  <RecommendationItem
                    key={item.id}
                    item={item}
                    addToCart={addToCart}
                    addToWishlist={addToWishlist}
                    renderStars={renderStars}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Hide scrollbar utility
const styles = `
  .hide-scrollbar::-webkit-scrollbar { display: none; }
  .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  .line-clamp-2 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
`;

if (!document.querySelector('#wishlist-styles')) {
  const styleElement = document.createElement('style');
  styleElement.id = 'wishlist-styles';
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}

export default Wishlist;