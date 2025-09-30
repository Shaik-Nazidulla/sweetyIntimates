// HomeProductDetailSection.jsx - Updated with API integration
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { getAllProducts } from '../Redux/slices/productsSlice';
import { useCart } from "./CartContext";
import { useWishlist } from "./WishlistContext";

const HomeProductDetailSection = () => {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const detailsRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { addToCart: addToCartHandler } = useCart();
  const { addToWishlist, removeFromWishlist, isItemInWishlist } = useWishlist();

  // Redux state
  const { 
    products,
    loading,
    error
  } = useSelector(state => state.products);

  // Local state
  const [latestProduct, setLatestProduct] = useState(null);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addingToWishlist, setAddingToWishlist] = useState(false);

  // Get selected color object
  const selectedColor = latestProduct?.colors?.[selectedColorIndex];
  
  // Check if product is in wishlist
  const isInWishlist = latestProduct ? isItemInWishlist(latestProduct._id) : false;

  // Fetch latest products on component mount
  useEffect(() => {
    dispatch(getAllProducts({ page: 1, limit: 10 }));
  }, [dispatch]);

  // Set latest product when products are loaded
  useEffect(() => {
    if (products.length > 0) {
      // Get the most recent product (assuming the API returns them in order)
      const latest = products[0]; // or products[products.length - 1] depending on API sorting
      setLatestProduct(latest);
      
      // Set default values
      if (latest.colors?.length > 0) {
        setSelectedColorIndex(0);
        const firstColor = latest.colors[0];
        const availableSize = firstColor.sizeStock?.find(size => size.stock > 0);
        setSelectedSize(availableSize?.size || "");
        setCurrentImageIndex(0);
      }
    }
  }, [products]);

  const handleBuyNow = async () => {
  if (!latestProduct || !selectedColor || !selectedSize) return;
  
  setAddingToCart(true);
  
  try {
    // Get current selected image
    const currentImages = selectedColor?.images || [];
    const selectedImage = currentImages[currentImageIndex] || currentImages[0] || '';
    
    // Use the cart context to add to cart
    const result = await addToCartHandler(
      latestProduct,  // Changed from currentProduct to latestProduct
      quantity, 
      selectedColor.colorName, 
      selectedSize, 
      selectedImage
    );

    if (result.success) {
      // Navigate to checkout after successfully adding to cart
      navigate('/checkout');
    } else {
      console.error('Failed to add to cart for Buy Now');
    }
  } catch (error) {
    console.error('Failed to add to cart for Buy Now:', error);
  } finally {
    setAddingToCart(false);
  }
};

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!latestProduct || !selectedColor || !selectedSize) return;
    
    setAddingToCart(true);
    
    try {
      const currentImages = selectedColor?.images || [];
      const selectedImage = currentImages[currentImageIndex] || currentImages[0] || '';
      
      const result = await addToCartHandler(
        latestProduct, 
        quantity, 
        selectedColor.colorName, 
        selectedSize, 
        selectedImage
      );

      if (result.success) {
        console.log('Added to cart successfully');
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setAddingToCart(false);
    }
  };

  // Handle wishlist toggle
  const handleWishlistToggle = async () => {
    if (!latestProduct) return;

    setAddingToWishlist(true);

    try {
      if (isInWishlist) {
        await removeFromWishlist(latestProduct._id);
      } else {
        const productForWishlist = {
          _id: latestProduct._id,
          id: latestProduct._id,
          name: latestProduct.name,
          brand: latestProduct.name,
          price: latestProduct.price,
          originalPrice: latestProduct.originalPrice,
          image: selectedColor?.images?.[0] || latestProduct.images?.[0] || '',
          images: latestProduct.images || [],
          description: latestProduct.description
        };
        
        await addToWishlist(productForWishlist);
      }
    } catch (error) {
      console.error('Failed to update wishlist:', error);
    } finally {
      setAddingToWishlist(false);
    }
  };

  // Handle color selection
  const handleColorChange = (colorIndex) => {
    setSelectedColorIndex(colorIndex);
    setCurrentImageIndex(0);
    
    // Update size selection for new color
    const newColor = latestProduct.colors[colorIndex];
    if (newColor.sizeStock) {
      const availableSize = newColor.sizeStock.find(size => size.stock > 0);
      setSelectedSize(availableSize?.size || "");
    }
  };

  // Navigate to product detail page
  const handleViewFullDetails = () => {
    if (latestProduct) {
      navigate(`/product/${latestProduct._id}`);
    }
  };

  // Helper component for color circles
  const ColorCircle = ({ color, size = 'w-4 h-4', isSelected = false }) => {
    const colorValue = color.colorHex || '#CCCCCC';
    
    return (
      <div 
        className={`${size} rounded-full border-2 flex-shrink-0 ${
          isSelected ? 'border-gray-800' : 'border-gray-300'
        }`}
        style={{ 
          backgroundColor: colorValue
        }}
        title={color.colorName}
      />
    );
  };

  // Loading state
  if (loading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="animate-pulse">
              <div className="bg-gray-300 h-[600px] rounded-lg"></div>
            </div>
            <div className="animate-pulse space-y-4">
              <div className="bg-gray-300 h-8 rounded w-3/4"></div>
              <div className="bg-gray-300 h-6 rounded w-1/2"></div>
              <div className="bg-gray-300 h-4 rounded w-full"></div>
              <div className="bg-gray-300 h-12 rounded w-full"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <p className="text-red-600">Failed to load latest product: {error}</p>
        </div>
      </section>
    );
  }

  // No product state
  if (!latestProduct) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <p className="text-gray-600">No products available</p>
        </div>
      </section>
    );
  }

  const discount = latestProduct.originalPrice
    ? Math.round(
        ((latestProduct.originalPrice - latestProduct.price) / latestProduct.originalPrice) * 100
      )
    : 0;

  // Get current images based on selected color
  const currentImages = selectedColor?.images || [];
  const currentImage = currentImages[currentImageIndex] || currentImages[0];

  return (
    <section ref={sectionRef} className="py-12 bg-white">
      <div className="container mx-auto px-4 md:px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
        {/* Left: Images */}
        <div ref={imageRef} className="order-1 lg:order-1">
          {/* Desktop Layout - Side by side */}
          <div className="hidden lg:flex gap-4">
            <div className="flex-1">
              <img
                src={currentImage}
                alt={`${latestProduct.name} - ${selectedColor?.colorName}`}
                className="w-full h-[600px] object-cover rounded-lg"
              />
            </div>
            <div className="flex flex-col gap-2 w-28">
              {currentImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`border-2 ${
                    currentImageIndex === idx
                      ? "border-gray-800"
                      : "border-gray-200"
                  } rounded-lg overflow-hidden`}
                >
                  <img
                    src={img}
                    alt={`thumb-${idx}`}
                    className="w-full h-[142px] object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Layout - Stacked */}
          <div className="lg:hidden">
            <div className="w-full mb-4">
              <img
                src={currentImage}
                alt={`${latestProduct.name} - ${selectedColor?.colorName}`}
                className="w-full h-[400px] md:h-[500px] object-cover rounded-lg"
              />
            </div>
            
            <div className="flex gap-2 justify-center overflow-x-auto px-2">
              {currentImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`border-2 ${
                    currentImageIndex === idx
                      ? "border-gray-800"
                      : "border-gray-200"
                  } rounded-lg overflow-hidden flex-shrink-0`}
                >
                  <img
                    src={img}
                    alt={`thumb-${idx}`}
                    className="w-16 h-20 sm:w-20 sm:h-24 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Details */}
        <div ref={detailsRef} className="order-2 lg:order-2 space-y-4 lg:space-y-6">
          {/* NEW Badge */}
          <div>
            <span className="bg-pink-600 text-white px-6 py-2 rounded-full text-sm font-bold uppercase">
              NEW
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            {latestProduct.name}
          </h2>

          {/* Reviews Summary */}
          {latestProduct.ratings && latestProduct.ratings.length > 0 ? (
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => {
                  const avgRating = latestProduct.ratings.reduce((acc, rating) => 
                    acc + (rating.rating || rating), 0) / latestProduct.ratings.length;
                  return (
                    <svg
                      key={star}
                      className={`w-4 h-4 ${
                        star <= Math.round(avgRating)
                          ? 'text-pink-500 fill-current'
                          : 'text-gray-300'
                      }`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  );
                })}
                <span className="ml-2 text-sm text-gray-600">
                  ({latestProduct.ratings.length} review{latestProduct.ratings.length !== 1 ? 's' : ''})
                </span>
              </div>
            </div>
          ) : (
            <div className="mb-4">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className="w-4 h-4 text-gray-300"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-500">New Product</span>
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-3 flex-wrap">
            <p className="text-xl md:text-2xl font-bold">₹{latestProduct.price}</p>
            {latestProduct.originalPrice && (
              <p className="text-lg md:text-xl text-gray-500 line-through">
                ₹{latestProduct.originalPrice}
              </p>
            )}
            {discount > 0 && (
              <span className="bg-pink-500 text-white text-sm px-3 py-1 rounded-full">
                {discount}% OFF
              </span>
            )}
          </div>

          {latestProduct.description && (
            <p className="text-gray-600 text-sm md:text-base">{latestProduct.description}</p>
          )}

          {/* Colors */}
          {latestProduct.colors && latestProduct.colors.length > 0 && (
            <div>
              <p className="font-bold mb-2 text-sm md:text-base">
                Color: {selectedColor?.colorName}
              </p>
              <div className="flex gap-2 md:gap-3 flex-wrap">
                {latestProduct.colors.map((color, idx) => (
                  <button
                    key={color._id}
                    onClick={() => handleColorChange(idx)}
                    className={`w-12 h-12 md:w-14 md:h-14 border-2 rounded-lg flex items-center justify-center p-1 ${
                      selectedColorIndex === idx
                        ? "border-black"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <ColorCircle color={color} size="w-8 h-8 md:w-10 md:h-10" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {selectedColor?.sizeStock && selectedColor.sizeStock.length > 0 && (
            <div>
              <p className="font-bold mb-2 text-sm md:text-base">Size: {selectedSize}</p>
              <div className="flex gap-2 md:gap-3 flex-wrap">
                {selectedColor.sizeStock.map((sizeObj, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedSize(sizeObj.size)}
                    disabled={sizeObj.stock === 0}
                    className={`px-3 py-2 md:px-4 md:py-2 border-2 font-medium text-sm md:text-base rounded-md ${
                      selectedSize === sizeObj.size
                        ? "bg-black text-white border-black"
                        : sizeObj.stock === 0
                        ? "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
                        : "bg-white text-black border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {sizeObj.size.toUpperCase()}
                    {sizeObj.stock === 0 && (
                      <span className="block text-xs">Out of Stock</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity + Cart */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
            <div className="flex items-center border-2 rounded w-fit bg-gray-200">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 hover:bg-gray-100"
              >
                -
              </button>
              <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 hover:bg-gray-100"
              >
                +
              </button>
            </div>
            
            <div className="flex gap-2 flex-1">
              <button
                className="flex-1 bg-black text-white py-3 px-4 md:px-6 hover:bg-gray-800 rounded text-sm md:text-base disabled:bg-gray-400"
                onClick={handleAddToCart}
                disabled={!selectedSize || !selectedColor || addingToCart}
              >
                {addingToCart ? 'Adding...' : 'Add To Cart'}
              </button>

              <button
                onClick={handleWishlistToggle}
                disabled={addingToWishlist}
                className={`p-3 border rounded-full transition ${
                  isInWishlist
                    ? "bg-pink-100 border-pink-400 text-pink-600"
                    : "border-gray-300 hover:bg-gray-100"
                } ${addingToWishlist ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <svg
                  className="w-5 h-5"
                  fill={isInWishlist ? "currentColor" : "none"}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <button 
              onClick={handleBuyNow}
              className="w-full bg-pink-600 text-white py-3 rounded hover:bg-pink-700 text-sm md:text-base disabled:bg-gray-400"
              disabled={!selectedSize || !selectedColor || addingToCart}
            >
              {addingToCart ? 'Processing...' : 'Buy It Now'}
            </button>

          {/* View Full Details Button */}
          <button 
            onClick={handleViewFullDetails}
            className="w-full bg-gray-100 text-gray-800 py-3 rounded hover:bg-gray-200 text-sm md:text-base font-medium border border-gray-300"
          >
            View Full Details
          </button>
        </div>
      </div>
    </section>
  );
};

export default HomeProductDetailSection;