// ProductDetail.jsx
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { gsap } from "gsap";
import infoproducts from "./ProductsInfo"; // Shared dataset
import { useCart } from "./CartContext";
import { useWishlist } from "./WishlistContext";

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { wishlistItems, toggleWishlist } = useWishlist();

  // Product states
  const [currentProduct, setCurrentProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Similar products states
  const [similarProducts, setSimilarProducts] = useState([]);
  const [similarProductsIndex, setSimilarProductsIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  // Refs
  const sectionRef = useRef(null);
  const similarProductsRef = useRef(null);

  // Fetch product data based on productId
  useEffect(() => {
    setLoading(true);

    const product = infoproducts.find((p) => p.id === parseInt(productId));

    if (product) {
      setCurrentProduct(product);
      setSelectedColor(product.colors?.[0] || "");
      setSelectedSize(product.sizes?.[0] || "");

      const similar = infoproducts
        .filter((p) => p.category === product.category && p.id !== product.id)
        .slice(0, 8);
      setSimilarProducts(similar);

      // Reset scroll to top on product change
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/products/all");
    }

    setLoading(false);
  }, [productId, navigate]);

  // Safe check for wishlist status
  const isInWishlist = currentProduct
    ? wishlistItems.some((item) => item.id === currentProduct.id)
    : false;

  // Color mapping for swatches
  const colorMap = {
    black: "#000000",
    red: "#FF0000",
    blue: "#0066CC",
    navy: "#000080",
    "navy blue": "#000080",
    pink: "#FF69B4",
    white: "#FFFFFF",
    grey: "#808080",
    gray: "#808080",
    beige: "#F5F5DC",
    nude: "#D4A574",
    peach: "#FFCBA4",
    yellow: "#FFFF00",
    green: "#008000",
    rose: "#FF007F",
    wine: "#722F37",
    "wine red": "#722F37",
    multi: "linear-gradient(45deg, #FF0000, #00FF00, #0000FF)",
  };

  // Adjust similar products per page on resize
  useEffect(() => {
    const updateItemsPerPage = () => {
      const width = window.innerWidth;
      if (width < 768) setItemsPerPage(2);
      else if (width < 1024) setItemsPerPage(3);
      else setItemsPerPage(4);
    };

    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  // Animate product details + similar products
  useEffect(() => {
    if (!loading && currentProduct) {
      gsap.fromTo(
        ".product-detail-section",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );

      gsap.fromTo(
        ".similar-products-section",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: "power2.out" }
      );
    }
  }, [loading, currentProduct]);

  // Similar products carousel
  const nextSimilarProducts = () => {
    if (similarProductsIndex < similarProducts.length - itemsPerPage) {
      setSimilarProductsIndex((prev) => prev + 1);
    }
  };

  const prevSimilarProducts = () => {
    if (similarProductsIndex > 0) {
      setSimilarProductsIndex((prev) => prev - 1);
    }
  };

  // Helper components
  const ColorCircle = ({ color, size = "w-4 h-4" }) => {
    const colorValue = colorMap[color.toLowerCase()] || color;
    return (
      <div
        className={`${size} rounded-full border-2 border-gray-300`}
        style={{ background: colorValue }}
      />
    );
  };

  const SimilarProductCard = ({ product }) => {
    const [hoverIndex, setHoverIndex] = useState(0);

    const handleProductClick = () => {
      navigate(`/product/${product.id}`);
    };

    const discount = product.originalPrice
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100
        )
      : 0;

    return (
      <div
        className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer"
        onClick={handleProductClick}
      >
        <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
          <img
            src={product.images[hoverIndex]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform hover:scale-105"
            onMouseEnter={() => product.images[1] && setHoverIndex(1)}
            onMouseLeave={() => setHoverIndex(0)}
          />
          {discount > 0 && (
            <span className="absolute top-2 left-2 bg-pink-500 text-white text-xs px-2 py-1 rounded">
              {discount}% OFF
            </span>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex gap-1">
              {product.colors.slice(0, 4).map((color, idx) => (
                <ColorCircle key={idx} color={color} />
              ))}
            </div>
            {product.colors.length > 4 && (
              <span className="text-gray-500 text-sm">
                +{product.colors.length - 4}
              </span>
            )}
          </div>
          <h3 className="text-gray-800 font-medium mb-1 text-sm">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">
              ₹{product.price}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ₹{product.originalPrice}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-20 w-20 border-b-2 border-pink-600 rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  // Product not found
  if (!currentProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">
            Product Not Found
          </h2>
          <button
            onClick={() => navigate("/products/all")}
            className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  const discount = currentProduct.originalPrice
    ? Math.round(
        ((currentProduct.originalPrice - currentProduct.price) /
          currentProduct.originalPrice) *
          100
      )
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center text-sm text-gray-600">
          <button
            onClick={() => navigate(-1)}
            className="hover:text-gray-900 flex items-center"
          >
            ← Back
          </button>
          <span className="mx-2">/</span>
          <span className="text-gray-900 capitalize">
            {currentProduct.category}
          </span>
        </div>
      </div>

      {/* Product Section */}
      <section
        ref={sectionRef}
        className="product-detail-section py-6 md:py-12 bg-white"
      >
        <div className="container mx-auto px-4 md:px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
          {/* Left: Images - Mobile: Full width, Desktop: Side layout */}
          <div className="order-1 lg:order-1">
            {/* Desktop Layout - Side by side */}
            <div className="hidden lg:flex gap-4">
              <div className="flex-1">
                <img
                  src={currentProduct.images[currentImageIndex]}
                  alt={currentProduct.name}
                  className="w-full h-[600px] object-cover rounded-lg"
                />
              </div>
              <div className="flex flex-col gap-2 w-28">
                {currentProduct.images.map((img, idx) => (
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
              {/* Main Image - Full width on mobile */}
              <div className="w-full mb-4">
                <img
                  src={currentProduct.images[currentImageIndex]}
                  alt={currentProduct.name}
                  className="w-full h-[400px] md:h-[500px] object-cover rounded-lg"
                />
              </div>
              
              {/* Thumbnail Images - Below main image on mobile */}
              <div className="flex gap-2 justify-center overflow-x-auto px-2">
                {currentProduct.images.map((img, idx) => (
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
          <div className="order-2 lg:order-2 space-y-4 lg:space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              {currentProduct.name}
            </h2>
            <div className="flex items-center gap-3 flex-wrap">
              <p className="text-xl md:text-2xl font-bold">₹{currentProduct.price}</p>
              {currentProduct.originalPrice && (
                <p className="text-lg md:text-xl text-gray-500 line-through">
                  ₹{currentProduct.originalPrice}
                </p>
              )}
              {discount > 0 && (
                <span className="bg-pink-500 text-white text-sm px-3 py-1 rounded-full">
                  {discount}% OFF
                </span>
              )}
            </div>
            <p className="text-gray-600 text-sm md:text-base">{currentProduct.description}</p>

            {/* Colors */}
            {currentProduct.colors && (
              <div>
                <p className="font-bold mb-2 text-sm md:text-base">Color: {selectedColor}</p>
                <div className="flex gap-2 md:gap-3 flex-wrap">
                  {currentProduct.colors.map((color, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 md:w-12 md:h-12 border-2 rounded-lg flex items-center justify-center ${
                        selectedColor === color
                          ? "border-black"
                          : "border-gray-300"
                      }`}
                    >
                      <ColorCircle color={color} size="w-6 h-6 md:w-8 md:h-8" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {currentProduct.sizes && (
              <div>
                <p className="font-bold mb-2 text-sm md:text-base">Size: {selectedSize}</p>
                <div className="flex gap-2 md:gap-3 flex-wrap">
                  {currentProduct.sizes.map((size, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-2 md:px-4 md:py-2 border-2 font-medium text-sm md:text-base ${
                        selectedSize === size
                          ? "bg-black text-white border-black"
                          : "bg-white text-black border-gray-300"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Cart */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
              <div className="flex items-center border rounded w-fit">
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
                  className="flex-1 bg-black text-white py-3 px-4 md:px-6 hover:bg-gray-800 rounded text-sm md:text-base"
                  onClick={() =>
                    addToCart(currentProduct, quantity, selectedColor, selectedSize)
                  }
                >
                  Add To Cart
                </button>

                {/* Add to wishlist */}
                <button
                  onClick={() => toggleWishlist(currentProduct)}
                  className={`p-3 border rounded transition ${
                    isInWishlist
                      ? "bg-pink-100 border-pink-400 text-pink-600"
                      : "border-gray-300 hover:bg-gray-100"
                  }`}
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
            <button className="w-full bg-pink-600 text-white py-3 rounded hover:bg-pink-700 text-sm md:text-base">
              Buy It Now
            </button>
          </div>
        </div>
      </section>

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <section
          ref={similarProductsRef}
          className="similar-products-section py-8 md:py-12 bg-gray-50"
        >
          <div className="container mx-auto px-4 md:px-6 lg:px-12">
            <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8">Similar Products</h2>
            <div className="relative">
              {similarProducts.length > itemsPerPage && (
                <>
                  <button
                    onClick={prevSimilarProducts}
                    disabled={similarProductsIndex === 0}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-20  w-5 lg:w-10 h-10 md:w-fit md:px-2 md:h-14 bg-pink-200 hover:bg-pink-300 disabled:bg-gray-300 
                    rounded-sm md:rounded-md -translate-x-3 md:translate-x-0"
                  >
                    <ChevronLeft className="text-white w-5 h-5" />
                  </button>
                  <button
                    onClick={nextSimilarProducts}
                    disabled={
                      similarProductsIndex >=
                      similarProducts.length - itemsPerPage
                    }
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-20 
                        w-5 lg:w-10 h-10 md:w-fit md:px-2 md:h-14 
                        bg-pink-200 hover:bg-pink-300 disabled:bg-gray-300 
                        rounded-sm md:rounded-md translate-x-3 md:translate-x-0"
                  >
                    <ChevronRight className="text-white w-5 h-5" />
                  </button>
                </>
              )}
              <div
                className={
                  similarProducts.length > itemsPerPage ? "mx-4 lg:mx-12 md:mx-12" : ""
                }
              >
                <div
                  className={`grid gap-4 md:gap-6 ${
                    itemsPerPage === 2
                      ? "grid-cols-2"
                      : itemsPerPage === 3
                      ? "grid-cols-3"
                      : "grid-cols-4"
                  }`}
                >
                  {similarProducts
                    .slice(
                      similarProductsIndex,
                      similarProductsIndex + itemsPerPage
                    )
                    .map((p) => (
                      <SimilarProductCard key={p.id} product={p} />
                    ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;