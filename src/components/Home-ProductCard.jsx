import { useState } from 'react';

const HomeProductCard = ({ 
  image, 
  title, 
  price, 
  originalPrice, 
  rating = 5, 
  reviews = 0,
  colors = [],
  sizes = [],
  badge = null,
  onQuickView = () => {},
  onAddToCart = () => {}
}) => {
  const [selectedColor, setSelectedColor] = useState(colors[0] || '');
  const [selectedSize, setSelectedSize] = useState(sizes[0] || '');
  const [isHovered, setIsHovered] = useState(false);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <span 
        key={i} 
        className={`text-sm ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        ★
      </span>
    ));
  };

  return (
    <div 
      className="group relative bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badge */}
      {badge && (
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold">
            {badge}
          </span>
        </div>
      )}

      {/* Product Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-secondary to-accent">
        <img 
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Quick Actions Overlay */}
        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-all duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="space-y-3">
            <button 
              onClick={onQuickView}
              className="block w-full bg-white text-foreground px-6 py-2 rounded-full font-medium hover:bg-secondary transition-colors"
            >
              Quick View
            </button>
            <button 
              onClick={onAddToCart}
              className="block w-full bg-primary text-primary-foreground px-6 py-2 rounded-full font-medium hover:bg-primary/90 transition-colors"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6 space-y-4">
        {/* Title and Rating */}
        <div>
          <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors mb-2">
            {title}
          </h3>
          <div className="flex items-center space-x-2">
            <div className="flex">
              {renderStars(rating)}
            </div>
            {reviews > 0 && (
              <span className="text-sm text-muted-foreground">({reviews})</span>
            )}
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold text-primary">${price}</span>
          {originalPrice && originalPrice > price && (
            <span className="text-sm text-muted-foreground line-through">${originalPrice}</span>
          )}
        </div>

        {/* Colors */}
        {colors.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Colors:</p>
            <div className="flex space-x-2">
              {colors.map((color, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedColor(color)}
                  className={`w-6 h-6 rounded-full border-2 transition-all duration-200 ${
                    selectedColor === color ? 'border-primary scale-110' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        )}

        {/* Sizes */}
        {sizes.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Sizes:</p>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-3 py-1 text-xs font-medium rounded-md border transition-all duration-200 ${
                    selectedSize === size 
                      ? 'bg-primary text-primary-foreground border-primary' 
                      : 'bg-background text-foreground border-border hover:border-primary'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeProductCard;