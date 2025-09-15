// cart.jsx
import { useCart } from "./CartContext";
import { useWishlist } from "./WishlistContext";
import infoproducts from "./ProductsInfo";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useRef } from "react";
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

  const handleQuantityChange = (change) => {
    gsap.to(quantityRef.current, {
      scale: 1.2,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut",
    });

    if (item.quantity === 1 && change === -1) {
      handleDelete();
    } else {
      updateQuantity(item.id, change);
    }
  };

  const handleDelete = () => {
    gsap.to(itemRef.current, {
      x: -100,
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => deleteItem(item.id),
    });
  };

  const handleAddToWishlist = () => {
    addToWishlist(item);
    const button = itemRef.current.querySelector(".wishlist-btn");
    gsap.to(button, {
      scale: 1.1,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
    });
  };

  const handleShare = async () => {
    const shareData = {
      title: item.brand,
      text: `Check out this amazing product: ${item.description}`,
      url: `${window.location.origin}/product/${item.id}`,
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

  return (
    <div
      ref={itemRef}
      className="flex gap-4 py-4 border-b border-gray-200 last:border-b-0 items-start transition-all duration-300"
    >
      <img
        src={item.image}
        alt={item.description}
        className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg object-cover flex-shrink-0 cursor-pointer hover:scale-105 transition-transform duration-300"
        onClick={goToDetail}
      />

      {/* Mobile Layout */}
      <div className="flex-1 lg:hidden">
        <div
          className="text-base sm:text-lg font-semibold text-gray-800 mb-1 hover:text-pink-600 transition-colors cursor-pointer"
          onClick={goToDetail}
        >
          {item.brand}
        </div>
        <div className="text-gray-600 text-xs sm:text-sm mb-2">{item.description}</div>
        <div className="text-pink-600 text-sm mb-2">{renderStars(item.rating)}</div>

        <div className="mb-3">
          <div className="bg-pink-600 text-white text-xs px-2 py-1 rounded mb-1 inline-block animate-pulse">
            Limited time deal
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm text-pink-600 font-semibold">{item.discount}%</div>
            <div className="text-lg font-semibold text-gray-800">₹{item.price.toLocaleString()}</div>
            <div className="text-sm text-gray-500 line-through">
              M.R.P: ₹{item.originalPrice.toLocaleString()}
            </div>
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
              value={item.quantity}
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

      {/* Desktop Layout */}
      <div className="hidden lg:flex flex-1 gap-4">
        <div className="flex-1 pr-5">
          <div
            className="text-base font-semibold text-gray-800 mb-1 hover:text-pink-600 cursor-pointer"
            onClick={goToDetail}
          >
            {item.brand}
          </div>
          <div className="text-gray-600 text-sm mb-2">{item.description}</div>
          <div className="text-pink-600 text-sm mb-2">{renderStars(item.rating)}</div>
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
                value={item.quantity}
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
              <button className="wishlist-btn text-pink-600 hover:underline" onClick={handleAddToWishlist}>
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
          <div className="bg-pink-600 text-white text-xs px-2 py-1 rounded mb-1 inline-block animate-pulse">
            Limited time deal
          </div>
          <div className="text-sm text-pink-600 font-semibold">{item.discount}%</div>
          <div className="text-lg font-semibold text-gray-800">₹{item.price.toLocaleString()}</div>
          <div className="text-sm text-gray-500 line-through mt-1">
            M.R.P: ₹{item.originalPrice.toLocaleString()}
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

  const goToDetail = () => navigate(`/product/${deal.id}`);

  const handleAddToCart = () => {
    const button = itemRef.current.querySelector(".add-to-cart-btn");
    gsap.to(button, { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 });
    addToCart(deal);
  };

  return (
    <div ref={itemRef} className="flex gap-3 py-3 border-b border-gray-200 last:border-b-0">
      <img
        src={deal.images ? deal.images[0] : deal.image}
        alt={deal.description}
        className="w-16 h-16 sm:w-20 sm:h-20 rounded-md object-cover cursor-pointer"
        onClick={goToDetail}
      />
      <div className="flex-1">
        <div
          onClick={goToDetail}
          className="text-sm font-semibold text-gray-800 mb-1 cursor-pointer hover:text-pink-600"
        >
          {deal.brand || deal.name}
        </div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-pink-600 text-xs">{renderStars(deal.rating || 5)}</span>
          <span className="text-pink-600 text-xs font-semibold">
            -{deal.discount || Math.round(((deal.originalPrice - deal.price) / deal.originalPrice) * 100)}%
          </span>
          <span className="text-sm font-semibold text-gray-800">₹{deal.price.toLocaleString()}</span>
        </div>
        <div className="text-gray-600 text-xs mb-2">{deal.description}</div>
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

const Cart = () => {
  const { cartItems, updateQuantity, deleteItem, addToCart } = useCart();
  const { addToWishlist } = useWishlist();
  const containerRef = useRef(null);

  const deals = infoproducts.filter((p) => !cartItems.find((c) => c.id === p.id)).slice(0, 6);

  const renderStars = (rating) => "★".repeat(rating);
  const getTotalItems = () => cartItems.reduce((t, i) => t + i.quantity, 0);
  const getTotalAmount = () => cartItems.reduce((t, i) => t + i.price * i.quantity, 0);

  useEffect(() => {
    gsap.fromTo(containerRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 });
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Mobile Layout */}
      <div className="lg:hidden p-3 pb-24" ref={containerRef}>
        {/* Summary */}
        <div className="bg-white rounded-xl p-4 shadow-lg mb-4">
          <div className="text-base font-semibold mb-2">Subtotal ({getTotalItems()} items)</div>
          <div className="text-xl font-semibold mb-4">₹{getTotalAmount().toLocaleString()}</div>
          <div className="flex flex-col gap-3">
            <button className="bg-pink-600 text-white py-3 rounded-3xl text-sm font-semibold" disabled={!cartItems.length}>
              Add Coupon
            </button>
            <button className="bg-pink-600 text-white py-3 rounded-3xl text-sm font-semibold" disabled={!cartItems.length}>
              Proceed to Buy
            </button>
          </div>
        </div>

        {/* Cart */}
        <div className="bg-white rounded-xl shadow-lg mb-4">
          <div className="flex justify-between items-center text-lg font-semibold p-4 border-b">
            <div className="flex items-center gap-2">
              Shopping Cart <span className="text-gray-500 text-sm">({getTotalItems()} items)</span>
            </div>
          </div>
          <div className="px-4">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center text-center py-10">
                <div className="text-4xl text-gray-300 mb-4">🛒</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Your cart is empty</h3>
                <p className="text-gray-500 mb-6 text-sm">Add items to get started with your shopping</p>
                <button className="bg-pink-600 text-white py-3 px-6 rounded-2xl text-sm" onClick={() => (window.location.href = "/")}>
                  Start Shopping
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <CartItem key={item.id} item={item} updateQuantity={updateQuantity} deleteItem={deleteItem} addToWishlist={addToWishlist} renderStars={renderStars} />
              ))
            )}
          </div>
        </div>

        {/* Deals */}
        <div className="bg-white rounded-xl shadow-lg">
          <div className="text-lg font-semibold text-center p-4 border-b">Popular Deals</div>
          <div className="px-4 pb-4">
            {deals.map((deal) => (
              <DealItem key={deal.id} deal={deal} addToCart={addToCart} renderStars={renderStars} />
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      {/* Desktop Layout */}
<div className="hidden lg:block p-5" ref={containerRef}>
  <div className="max-w-7xl mx-auto flex gap-5 h-[calc(100vh-40px)]">
    
    {/* Cart Section */}
    <div className="flex-1 bg-white rounded-xl shadow-lg flex flex-col">
      <div className="flex justify-between items-center text-xl font-semibold p-5 border-b">
        <div className="flex items-center gap-2">
          Shopping Cart <span className="text-gray-500 text-base">({getTotalItems()} items)</span>
        </div>
        <span className="text-gray-500 text-base">Price</span>
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
              key={item.id}
              item={item}
              updateQuantity={updateQuantity}
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
        <div className="text-lg font-semibold mb-2">Subtotal ({getTotalItems()} items)</div>
        <div className="text-2xl font-semibold mb-5">₹{getTotalAmount().toLocaleString()}</div>
        <div className="flex flex-col gap-3">
          <button
            className="bg-pink-600 text-white py-3 rounded-3xl text-sm font-semibold"
            disabled={!cartItems.length}
          >
            Add Coupon
          </button>
          <button
            className="bg-pink-600 text-white py-3 rounded-3xl text-sm font-semibold"
            disabled={!cartItems.length}
          >
            Proceed to Buy
          </button>
        </div>
      </div>

      {/* Deals (fills rest, scrolls) */}
      <div className="bg-white rounded-xl shadow-lg flex-1 flex flex-col min-h-0">
        <div className="text-lg font-semibold text-center p-5 border-b">
          Popular Deals
        </div>
        <div className="flex-1 overflow-y-auto px-5 pb-5 hide-scrollbar">
          {deals.map((deal) => (
            <DealItem
              key={deal.id}
              deal={deal}
              addToCart={addToCart}
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
