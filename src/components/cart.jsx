// cart.jsx - Updated for new API integration
import { useSelector } from 'react-redux';
import { useCart } from "../hooks/useCart";
import { useWishlist } from "./WishlistContext";
import { apiService } from '../services/api';
import { useNavigate } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

// ⭐ Enhanced Reusable Cart Item Component
const CartItem = ({ item, updateQuantity, deleteItem, addToWishlist, renderStars }) => {
  const itemRef = useRef(null);
  const quantityRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const element = itemRef.current;

    const handleMouseEnter = () => {
      gsap.to(element, {
        scale: 1.01,
        boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(element, {
        scale: 1,
        boxShadow: "none",
        duration: 0.3,
        ease: "power2.out",
      });
    };

    if (element) {
      element.addEventListener("mouseenter", handleMouseEnter);
      element.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        element.removeEventListener("mouseenter", handleMouseEnter);
        element.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, []);

  const goToDetail = () => {
    navigate(`/product/${item.product?._id || item._id}`);
  };

  const handleQuantityChange = async (change) => {
    if (quantityRef.current) {
      gsap.to(quantityRef.current, {
        scale: 1.2,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
      });
    }

    if (item.quantity === 1 && change === -1) {
      handleDelete();
    } else {
      const newQuantity = Math.max(1, item.quantity + change);
      await updateQuantity(item._id, newQuantity);
    }
  };

  const handleDelete = () => {
    gsap.to(itemRef.current, {
      x: -100,
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => deleteItem(item._id),
    });
  };

  const handleAddToWishlist = () => {
    addToWishlist(item);
    const button = itemRef.current?.querySelector(".wishlist-btn");
    if (button) {
      gsap.to(button, {
        scale: 1.1,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
      });
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: item.product?.name || item.name,
      text: `Check out this amazing product: ${item.product?.name || item.name}`,
      url: `${window.location.origin}/product/${item.product?._id || item._id}`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert("Product link copied to clipboard!");
      }
    } catch (err) {
      console.log("Error sharing:", err);
    }
  };

  // FIXED: Add proper null checks and fallbacks for price calculation
  const currentPrice = item.product?.price || item.price || 0;
  const originalPrice = item.product?.originalPrice || (currentPrice > 0 ? currentPrice * 1.2 : 0);
  const discount = originalPrice > 0 && currentPrice > 0 
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  return (
    <div
      ref={itemRef}
      className="flex gap-4 py-4 border-b border-gray-200 last:border-b-0 items-start transition-all duration-300"
    >
      <img
        src={item.selectedImage || item.product?.images?.[0] || item.image}
        alt={item.product?.name || item.name}
        className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg object-cover flex-shrink-0 cursor-pointer hover:scale-105 transition-transform duration-300"
        onClick={goToDetail}
      />

      {/* Mobile Layout */}
      <div className="flex-1 lg:hidden">
        <div
          className="text-base sm:text-lg font-semibold text-gray-800 mb-1 hover:text-pink-600 transition-colors cursor-pointer"
          onClick={goToDetail}
        >
          {item.product?.name || item.name}
        </div>
        <div className="text-gray-600 text-xs sm:text-sm mb-2">
          {item.product?.description || item.description}
        </div>
        <div className="text-pink-600 text-sm mb-2">
          {renderStars(item.product?.rating || 5)}
        </div>

        {/* Color and Size */}
        {(item.color?.colorName || item.size) && (
          <div className="flex gap-2 mb-2">
            {item.color?.colorName && (
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                Color: {item.color.colorName}
              </span>
            )}
            {item.size && (
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                Size: {item.size.toUpperCase()}
              </span>
            )}
          </div>
        )}

        <div className="mb-3">
          {discount > 0 && (
            <div className="bg-pink-600 text-white text-xs px-2 py-1 rounded mb-1 inline-block animate-pulse">
              Limited time deal
            </div>
          )}
          <div className="flex items-center gap-2">
            {discount > 0 && (
              <div className="text-sm text-pink-600 font-semibold">{discount}%</div>
            )}
            <div className="text-lg font-semibold text-gray-800">
              ₹{currentPrice > 0 ? currentPrice.toLocaleString() : '0'}
            </div>
            {originalPrice > currentPrice && (
              <div className="text-sm text-gray-500 line-through">
                M.R.P: ₹{originalPrice.toLocaleString()}
              </div>
            )}
          </div>
        </div>

        <div className="text-gray-600 text-xs mb-4">
          FREE delivery <span className="font-semibold text-gray-800">Tomorrow 8am - 12pm</span>
        </div>

        {/* Quantity + Actions */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center border border-pink-300 rounded-full overflow-hidden">
            <button
              className="w-8 h-8 flex items-center justify-center text-lg text-gray-600 hover:bg-pink-100 hover:text-pink-600"
              onClick={() => handleQuantityChange(-1)}
            >
              {item.quantity === 1 ? "🗑️" : "-"}
            </button>
            <input
              ref={quantityRef}
              type="text"
              value={item.quantity || 1}
              readOnly
              className="w-10 text-center bg-transparent text-sm font-medium"
            />
            <button
              className="w-8 h-8 flex items-center justify-center text-lg text-gray-600 hover:bg-pink-100 hover:text-pink-600"
              onClick={() => handleQuantityChange(1)}
            >
              +
            </button>
          </div>

          <div className="flex gap-2 text-xs">
            <button
              className="wishlist-btn text-pink-600 hover:underline"
              onClick={handleAddToWishlist}
            >
              Add to Wishlist
            </button>
            <span className="text-gray-300">|</span>
            <button className="text-pink-600 hover:underline" onClick={handleShare}>
              Share
            </button>
          </div>
        </div>

        {/* Item Total */}
        <div className="text-right">
          <div className="text-lg font-semibold text-gray-800">
            ₹{(item.itemTotal || (currentPrice * (item.quantity || 1))).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex flex-1 gap-4">
        <div className="flex-1 pr-5">
          <div
            className="text-base font-semibold text-gray-800 mb-1 hover:text-pink-600 cursor-pointer"
            onClick={goToDetail}
          >
            {item.product?.name || item.name}
          </div>
          <div className="text-gray-600 text-sm mb-2">
            {item.product?.description || item.description}
          </div>
          <div className="text-pink-600 text-sm mb-2">
            {renderStars(item.product?.rating || 5)}
          </div>

          {/* Color and Size */}
          {(item.color?.colorName || item.size) && (
            <div className="flex gap-2 mb-2">
              {item.color?.colorName && (
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  Color: {item.color.colorName}
                </span>
              )}
              {item.size && (
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  Size: {item.size.toUpperCase()}
                </span>
              )}
            </div>
          )}

          <div className="text-gray-600 text-xs mb-4">
            FREE delivery <span className="font-semibold text-gray-800">Tomorrow 8am - 12pm</span>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center border border-pink-300 rounded-full overflow-hidden">
              <button
                className="w-8 h-8 flex items-center justify-center text-lg text-gray-600 hover:bg-pink-100 hover:text-pink-600"
                onClick={() => handleQuantityChange(-1)}
              >
                {item.quantity === 1 ? "🗑️" : "-"}
              </button>
              <input
                ref={quantityRef}
                type="text"
                value={item.quantity || 1}
                readOnly
                className="w-10 text-center bg-transparent text-sm font-medium"
              />
              <button
                className="w-8 h-8 flex items-center justify-center text-lg text-gray-600 hover:bg-pink-100 hover:text-pink-600"
                onClick={() => handleQuantityChange(1)}
              >
                +
              </button>
            </div>

            <div className="flex gap-2 text-xs">
              <button 
                className="wishlist-btn text-pink-600 hover:underline" 
                onClick={handleAddToWishlist}
              >
                Add to Wishlist
              </button>
              <span className="text-gray-300">|</span>
              <button className="text-pink-600 hover:underline" onClick={handleShare}>
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="text-right min-w-28">
          {discount > 0 && (
            <div className="bg-pink-600 text-white text-xs px-2 py-1 rounded mb-1 inline-block animate-pulse">
              Limited time deal
            </div>
          )}
          {discount > 0 && (
            <div className="text-sm text-pink-600 font-semibold">{discount}%</div>
          )}
          <div className="text-lg font-semibold text-gray-800">
            ₹{currentPrice > 0 ? currentPrice.toLocaleString() : '0'}
          </div>
          {originalPrice > currentPrice && (
            <div className="text-sm text-gray-500 line-through mt-1">
              M.R.P: ₹{originalPrice.toLocaleString()}
            </div>
          )}
          <div className="text-lg font-semibold text-gray-800 mt-2">
            Total: ₹{(item.itemTotal || (currentPrice * (item.quantity || 1))).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

// ⭐ Deal Item Component
const DealItem = ({ deal, addToCart, renderStars }) => {
  const itemRef = useRef(null);
  const navigate = useNavigate();

  const goToDetail = () => navigate(`/product/${deal._id || deal.id}`);

  const handleAddToCart = async () => {
    const button = itemRef.current?.querySelector(".add-to-cart-btn");
    if (button) {
      gsap.to(button, { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 });
    }
    
    // Transform deal object to match expected format
    const dealData = {
      id: deal._id || deal.id,
      _id: deal._id || deal.id,
      name: deal.name,
      brand: deal.name,
      price: deal.price,
      originalPrice: deal.originalPrice || deal.price * 1.2,
      images: deal.images || [],
      image: deal.images && deal.images.length > 0 ? deal.images[0] : '',
      colors: deal.colors || [],
      sizes: deal.sizeStock ? deal.sizeStock.map(s => s.size) : ['M']
    };
    
    await addToCart(dealData, 1, '', 'M');
  };

  const originalPrice = deal.originalPrice || deal.price * 1.2;
  const discount = Math.round(((originalPrice - deal.price) / originalPrice) * 100);

  return (
    <div ref={itemRef} className="flex gap-3 py-3 border-b border-gray-200 last:border-b-0">
      <img
        src={deal.images && deal.images.length > 0 ? deal.images[0] : '/placeholder-image.jpg'}
        alt={deal.name}
        className="w-16 h-16 sm:w-20 sm:h-20 rounded-md object-cover cursor-pointer"
        onClick={goToDetail}
      />
      <div className="flex-1">
        <div
          onClick={goToDetail}
          className="text-sm font-semibold text-gray-800 mb-1 cursor-pointer hover:text-pink-600"
        >
          {deal.name}
        </div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-pink-600 text-xs">{renderStars(deal.rating || 5)}</span>
          <span className="text-pink-600 text-xs font-semibold">-{discount}%</span>
          <span className="text-sm font-semibold text-gray-800">₹{deal.price.toLocaleString()}</span>
        </div>
        <div className="text-gray-600 text-xs mb-2">{deal.description || deal.name}</div>
        <button
          className="add-to-cart-btn bg-pink-600 text-white py-1 px-3 rounded-2xl text-xs font-medium hover:bg-pink-700"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

// ⭐ Coupon Component
const CouponSection = ({ onApplyDiscount, onRemoveDiscount, hasDiscount, appliedDiscount, loading }) => {
  const [couponCode, setCouponCode] = useState('');
  const [showCouponInput, setShowCouponInput] = useState(false);

  const handleApplyCoupon = async () => {
    if (couponCode.trim()) {
      const result = await onApplyDiscount(couponCode.trim());
      if (result.success) {
        setCouponCode('');
        setShowCouponInput(false);
      }
    }
  };

  const handleRemoveDiscount = async () => {
    await onRemoveDiscount();
  };

  if (hasDiscount && appliedDiscount) {
    return (
      <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
        <div className="flex flex-col">
          <span className="text-green-600 text-sm font-medium">✓ Discount Applied</span>
          <span className="text-green-700 text-xs">
            {appliedDiscount.code} - ₹{appliedDiscount.discountAmount?.toLocaleString()} off
          </span>
        </div>
        <button
          onClick={handleRemoveDiscount}
          disabled={loading}
          className="text-red-600 text-xs hover:underline disabled:opacity-50"
        >
          Remove
        </button>
      </div>
    );
  }

  return (
    <div className="mb-3">
      {!showCouponInput ? (
        <button
          onClick={() => setShowCouponInput(true)}
          className="w-full bg-white border border-pink-300 text-pink-600 py-3 rounded-3xl text-sm font-semibold hover:bg-pink-50 transition-colors"
        >
          Add Coupon
        </button>
      ) : (
        <div className="flex gap-2">
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="Enter coupon code"
            className="flex-1 px-3 py-2 border border-pink-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
          />
          <button
            onClick={handleApplyCoupon}
            disabled={!couponCode.trim() || loading}
            className="bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Applying...' : 'Apply'}
          </button>
          <button
            onClick={() => {
              setShowCouponInput(false);
              setCouponCode('');
            }}
            className="text-gray-500 px-2 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

const Cart = () => {
  const { 
    items: cartItems, 
    totals,
    totalItems,
    totalPrice,
    updateItemQuantity,
    deleteItem,
    addItemToCart,
    applyDiscount,
    removeDiscount,
    hasDiscount,
    appliedDiscount,
    applyingDiscount,
    removingDiscount,
    clearCartItems
  } = useCart();
  
  const { addToWishlist } = useWishlist();
  const containerRef = useRef(null);
  const [deals, setDeals] = useState([]);
  const [dealsLoading, setDealsLoading] = useState(false);

  const renderStars = (rating) => "★".repeat(Math.floor(rating));
  
  // Use totals from API or fallback to calculated values
  const getTotalItems = () => totals?.itemCount || totalItems || 0;
  const getSubtotal = () => totals?.subtotal || cartItems.reduce((t, i) => t + (i.itemTotal || i.product.price * i.quantity), 0) || 0;
  const getDiscountAmount = () => totals?.discountAmount || 0;
  const getTotalAmount = () => totals?.total || totalPrice || (getSubtotal() - getDiscountAmount());

  // Fetch popular deals from API
  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setDealsLoading(true);
        const response = await apiService.getAllProducts(1, 6);
        
        if (response && response.products) {
          // Filter out products that are already in cart
          const availableDeals = response.products.filter(
            (product) => !cartItems.find((cartItem) => cartItem.product._id === product._id)
          );
          setDeals(availableDeals);
        }
      } catch (error) {
        console.error('Failed to fetch deals:', error);
        setDeals([]);
      } finally {
        setDealsLoading(false);
      }
    };

    fetchDeals();
  }, [cartItems]);

  const handleApplyDiscount = async (code) => {
    return await applyDiscount(code);
  };

  const handleRemoveDiscount = async () => {
    return await removeDiscount();
  };

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 });
    }
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Mobile Layout */}
      <div className="lg:hidden p-3 pb-24" ref={containerRef}>
        {/* Summary */}
        <div className="bg-white rounded-xl p-4 shadow-lg mb-4">
          <div className="text-base font-semibold mb-2">
            Subtotal ({getTotalItems()} items): ₹{getSubtotal().toLocaleString()}
          </div>
          {getDiscountAmount() > 0 && (
            <div className="text-sm text-green-600 mb-2">
              Discount: -₹{getDiscountAmount().toLocaleString()}
            </div>
          )}
          <div className="text-xl font-semibold mb-4 text-pink-600">
            Total: ₹{getTotalAmount().toLocaleString()}
          </div>
          <div className="flex flex-col gap-3">
            <CouponSection 
              onApplyDiscount={handleApplyDiscount}
              onRemoveDiscount={handleRemoveDiscount}
              hasDiscount={hasDiscount}
              appliedDiscount={appliedDiscount}
              loading={applyingDiscount || removingDiscount}
            />
            <button 
              className="bg-pink-600 text-white py-3 rounded-3xl text-sm font-semibold hover:bg-pink-700 disabled:opacity-50" 
              disabled={!cartItems.length}
            >
              Proceed to Buy ({getTotalItems()} items)
            </button>
          </div>
        </div>

        {/* Cart */}
        <div className="bg-white rounded-xl shadow-lg mb-4">
          <div className="flex justify-between items-center text-lg font-semibold p-4 border-b">
            <div className="flex items-center gap-2">
              Shopping Cart <span className="text-gray-500 text-sm">({getTotalItems()} items)</span>
            </div>
            {cartItems.length > 0 && (
              <button
                onClick={clearCartItems}
                className="text-red-600 text-sm hover:underline"
              >
                Clear All
              </button>
            )}
          </div>
          <div className="px-4">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center text-center py-10">
                <div className="text-4xl text-gray-300 mb-4">🛒</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Your cart is empty</h3>
                <p className="text-gray-500 mb-6 text-sm">Add items to get started with your shopping</p>
                <button 
                  className="bg-pink-600 text-white py-3 px-6 rounded-2xl text-sm" 
                  onClick={() => (window.location.href = "/")}
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <CartItem 
                  key={item._id} 
                  item={item} 
                  updateQuantity={updateItemQuantity} 
                  deleteItem={deleteItem} 
                  addToWishlist={addToWishlist} 
                  renderStars={renderStars} 
                />
              ))
            )}
          </div>
        </div>

        {/* Deals */}
        <div className="bg-white rounded-xl shadow-lg">
          <div className="text-lg font-semibold text-center p-4 border-b">Popular Deals</div>
          <div className="px-4 pb-4">
            {dealsLoading ? (
              <div className="text-center py-8 text-gray-500">Loading deals...</div>
            ) : deals.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No deals available</div>
            ) : (
              deals.map((deal) => (
                <DealItem 
                  key={deal._id} 
                  deal={deal} 
                  addToCart={addItemToCart} 
                  renderStars={renderStars} 
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block p-5" ref={containerRef}>
        <div className="max-w-7xl mx-auto flex gap-5 h-[calc(100vh-40px)]">
          
          {/* Cart Section */}
          <div className="flex-1 bg-white rounded-xl shadow-lg flex flex-col">
            <div className="flex justify-between items-center text-xl font-semibold p-5 border-b">
              <div className="flex items-center gap-2">
                Shopping Cart <span className="text-gray-500 text-base">({getTotalItems()} items)</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-gray-500 text-base">Price</span>
                {cartItems.length > 0 && (
                  <button
                    onClick={clearCartItems}
                    className="text-red-600 text-sm hover:underline"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-5 hide-scrollbar">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-20">
                  <div className="text-6xl text-gray-300 mb-4">🛒</div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">Your cart is empty</h3>
                  <p className="text-gray-500 mb-6">Add items to get started with your shopping</p>
                  <button
                    className="bg-pink-600 text-white py-3 px-6 rounded-2xl font-medium hover:bg-pink-700"
                    onClick={() => (window.location.href = "/")}
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <CartItem
                    key={item._id}
                    item={item}
                    updateQuantity={updateItemQuantity}
                    deleteItem={deleteItem}
                    addToWishlist={addToWishlist}
                    renderStars={renderStars}
                  />
                ))
              )}
            </div>
          </div>

          {/* Summary + Deals */}
          <div className="w-2/5 flex flex-col h-full">
            {/* Subtotal (fixed height, content auto) */}
            <div className="bg-white rounded-xl p-5 shadow-lg mb-5">
              <div className="text-lg font-semibold mb-2">
                Subtotal ({getTotalItems()} items): ₹{getSubtotal().toLocaleString()}
              </div>
              {getDiscountAmount() > 0 && (
                <div className="text-base text-green-600 mb-2">
                  Discount: -₹{getDiscountAmount().toLocaleString()}
                </div>
              )}
              <div className="text-2xl font-semibold mb-5 text-pink-600">
                Total: ₹{getTotalAmount().toLocaleString()}
              </div>
              <div className="flex flex-col gap-3">
                <CouponSection 
                  onApplyDiscount={handleApplyDiscount}
                  onRemoveDiscount={handleRemoveDiscount}
                  hasDiscount={hasDiscount}
                  appliedDiscount={appliedDiscount}
                  loading={applyingDiscount || removingDiscount}
                />
                <button
                  className="bg-pink-600 text-white py-3 rounded-3xl text-sm font-semibold hover:bg-pink-700 disabled:opacity-50"
                  disabled={!cartItems.length}
                >
                  Proceed to Buy ({getTotalItems()} items)
                </button>
              </div>
            </div>

            {/* Deals (fills rest, scrolls) */}
            <div className="bg-white rounded-xl shadow-lg flex-1 flex flex-col min-h-0">
              <div className="text-lg font-semibold text-center p-5 border-b">
                Popular Deals
              </div>
              <div className="flex-1 overflow-y-auto px-5 pb-5 hide-scrollbar">
                {dealsLoading ? (
                  <div className="text-center py-8 text-gray-500">Loading deals...</div>
                ) : deals.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No deals available</div>
                ) : (
                  deals.map((deal) => (
                    <DealItem
                      key={deal._id}
                      deal={deal}
                      addToCart={addItemToCart}
                      renderStars={renderStars}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Hide scrollbar + animations
const styles = `
  .hide-scrollbar::-webkit-scrollbar { display: none; }
  .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:.7;} }
  .animate-pulse { animation: pulse 2s infinite; }
`;

if (!document.querySelector("#cart-styles")) {
  const styleElement = document.createElement("style");
  styleElement.id = "cart-styles";
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}

export default Cart;