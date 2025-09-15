// Home-ProductDetailSection.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import infoproducts from "./ProductsInfo"; // ✅ shared dataset
import { useCart } from "./CartContext";
import { useWishlist } from "./WishlistContext";

const HomeProductDetailSection = () => {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const detailsRef = useRef(null);
  const navigate = useNavigate();

  const { addToCart } = useCart();
  const { wishlistItems, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // ✅ fetch latest product
  useEffect(() => {
    if (infoproducts.length > 0) {
      const latest = infoproducts[infoproducts.length - 1];
      setProduct(latest);
      setSelectedColor(latest.colors?.[0] || "");
      setSelectedSize(latest.sizes?.[0] || "");
    }
  }, []);

  if (!product) {
    return (
      <section className="py-12 bg-gray-50 flex justify-center items-center h-[500px]">
        <p className="text-gray-600">Loading latest product...</p>
      </section>
    );
  }

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  const isInWishlist = wishlistItems.some((item) => item.id === product.id);

  return (
    <section ref={sectionRef} className="py-12 bg-gray-50">
      <div className="container mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Side - Images */}
        <div ref={imageRef} className="order-1 lg:order-1">
          {/* Desktop Layout - Side by side */}
          <div className="hidden lg:flex gap-4">
            <div className="flex-1">
              <img
                src={product.images[currentImageIndex]}
                alt={product.name}
                className="w-full h-[600px] object-cover rounded-lg"
              />
            </div>

            <div className="flex flex-col gap-2 w-28">
              {product.images.slice(0, 4).map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`border-2 ${
                    currentImageIndex === index
                      ? "border-gray-800"
                      : "border-gray-200"
                  } rounded-lg overflow-hidden`}
                >
                  <img
                    src={img}
                    alt={`thumb-${index}`}
                    className="w-full h-[142px] object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Layout - Thumbnails below main image */}
          <div className="lg:hidden">
            {/* Main Image */}
            <div className="w-full mb-4">
              <img
                src={product.images[currentImageIndex]}
                alt={product.name}
                className="w-full h-[400px] md:h-[500px] object-cover rounded-lg"
              />
            </div>

            {/* Thumbnails below main image */}
            <div className="flex gap-2 justify-center overflow-x-auto px-2">
              {product.images.slice(0, 4).map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`border-2 ${
                    currentImageIndex === index
                      ? "border-gray-800"
                      : "border-gray-200"
                  } rounded-lg overflow-hidden flex-shrink-0`}
                >
                  <img
                    src={img}
                    alt={`thumb-${index}`}
                    className="w-16 h-20 sm:w-20 sm:h-24 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Details */}
        <div ref={detailsRef} className="order-2 lg:order-2 space-y-6">
          {/* Badge */}
          <div>
            <span className="bg-pink-600 text-white px-6 py-2 rounded-full text-sm font-bold uppercase">
              NEW
            </span>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-gray-800">{product.name}</h2>

          {/* Price */}
          <div className="flex items-center gap-3">
            <p className="text-2xl font-bold text-gray-800">₹{product.price}</p>
            {product.originalPrice && (
              <p className="text-xl text-gray-500 line-through">
                ₹{product.originalPrice}
              </p>
            )}
            {discount > 0 && (
              <span className="bg-pink-500 text-white text-sm px-3 py-1 rounded-full">
                {discount}% OFF
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed">{product.description}</p>

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-3">
              <p className="font-bold text-gray-800">
                Color: <span className="uppercase">{selectedColor}</span>
              </p>
              <div className="flex gap-3 flex-wrap">
                {product.colors.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedColor(c)}
                    className={`w-12 h-12 border-2 rounded-lg flex items-center justify-center ${
                      selectedColor === c ? "border-black" : "border-gray-300"
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-full"
                      style={{ backgroundColor: c }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-3">
              <p className="font-bold text-gray-800">Size: {selectedSize}</p>
              <div className="flex gap-3 flex-wrap">
                {product.sizes.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedSize(s)}
                    className={`px-4 py-2 border-2 font-medium ${
                      selectedSize === s
                        ? "bg-black text-white border-black"
                        : "bg-white text-black border-gray-300"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity + Cart + Wishlist */}
          <div className="flex gap-4 items-center">
            <div className="flex items-center border border-gray-300 rounded">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 text-lg font-medium hover:bg-gray-100"
              >
                -
              </button>
              <span className="px-4 py-2 font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 text-lg font-medium hover:bg-gray-100"
              >
                +
              </button>
            </div>

            {/* Add To Cart */}
            <button
              className="flex-1 bg-black text-white py-3 px-6 font-medium hover:bg-gray-800 transition-colors"
              onClick={() =>
                addToCart(product, quantity, selectedColor, selectedSize)
              }
            >
              Add To Cart
            </button>

            {/* Wishlist */}
            <button
              onClick={() => toggleWishlist(product)}
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

          {/* Buy It Now */}
          <div>
            <button className="w-full bg-pink-600 text-white py-3 rounded font-medium hover:bg-pink-700 transition-colors">
              Buy It Now
            </button>
          </div>

          {/* View Full Details */}
          <div>
            <button
              className="text-black font-bold text-sm"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              View Full Details &gt;&gt;
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeProductDetailSection;
