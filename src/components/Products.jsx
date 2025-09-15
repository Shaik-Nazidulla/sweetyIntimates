//Products.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { gsap } from 'gsap';
import infoproducts from './ProductsInfo';
import {useCart} from "./CartContext";

const Products = () => {
  const navigate = useNavigate();
  const { category: urlCategory } = useParams();
  const { addToCart } = useCart();
  
  const [filters, setFilters] = useState({
    brand: '',
    style: '',
    color: '',
    promotions: '',
    collection: '',
    pantyWaist: '',
    subCategory: ''
  });
  const [sortBy, setSortBy] = useState('Recommended');
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(urlCategory?.toUpperCase() || 'BRAS');
  
  const itemsPerPage = 12;

  // Get unique values for filter options based on current category
  const getUniqueValues = (key) => {
    const values = infoproducts
      .filter(product => product.category === currentCategory)
      .map(product => {
        if (key === 'subCategory') return product.subCategory;
        if (key === 'colors') return product.colors;
        return product[key];
      })
      .flat()
      .filter(Boolean);
    return [...new Set(values)];
  };

  // Filter and sort products
  useEffect(() => {
    // Only show products from the current category
    let filtered = infoproducts.filter(product => product.category === currentCategory);

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        if (key === 'color') {
          filtered = filtered.filter(product => 
            product.colors.some(color => 
              color.toLowerCase().includes(value.toLowerCase())
            )
          );
        } else if (key === 'subCategory') {
          filtered = filtered.filter(product => product.subCategory === value);
        } else {
          // For other filters, you can add more specific logic here
          // For now, keeping it simple
        }
      }
    });

    // Sort products
    switch (sortBy) {
      case 'Price: Low to High':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'Price: High to Low':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'Newest First':
        filtered.sort((a, b) => b.id - a.id);
        break;
      default:
        // Keep original order for 'Recommended'
        break;
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [filters, sortBy, currentCategory]);

  // Update category when URL parameter changes
  useEffect(() => {
    if (urlCategory) {
      setCurrentCategory(urlCategory.toUpperCase());
      // Reset filters when category changes
      setFilters({
        brand: '',
        style: '',
        color: '',
        promotions: '',
        collection: '',
        pantyWaist: '',
        subCategory: ''
      });
    }
  }, [urlCategory]);

  // GSAP animations
  useEffect(() => {
    gsap.fromTo('.product-card', 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
    );

    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, { scale: 1.02, duration: 0.3, ease: 'power2.out' });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { scale: 1, duration: 0.3, ease: 'power2.out' });
      });
    });

    return () => {
      productCards.forEach(card => {
        card.removeEventListener('mouseenter', () => {});
        card.removeEventListener('mouseleave', () => {});
      });
    };
  }, [filteredProducts]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const FilterDropdown = ({ label, options, value, onChange }) => (
    <div className="relative flex-1 min-w-[100px] sm:min-w-[120px]">
      <select 
        className={`appearance-none bg-white px-2 sm:px-4 py-2 pr-5 sm:pr-7 focus:outline-none w-full text-xs sm:text-base transition-colors ${
          value ? 'text-pink-600' : 'text-gray-700'
        }`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">{label}</option>
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1 sm:pr-2 text-gray-700">
        <svg className="fill-current h-3 w-3 sm:h-4 sm:w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
        </svg>
      </div>
    </div>
  );

  const ColorCircle = ({ color, size = 'w-3 h-3 sm:w-4 sm:h-4' }) => {
    const colorMap = {
      black: '#000000',
      red: '#FF0000',
      blue: '#0066CC',
      navy: '#000080',
      'navy blue': '#000080',
      pink: '#FF69B4',
      white: '#FFFFFF',
      grey: '#808080',
      gray: '#808080',
      beige: '#F5F5DC',
      nude: '#D4A574',
      peach: '#FFCBA4',
      yellow: '#FFFF00',
      green: '#008000',
      rose: '#FF007F',
      wine: '#722F37',
      'wine red': '#722F37',
      multi: 'linear-gradient(45deg, #FF0000, #00FF00, #0000FF)'
    };

    const colorValue = colorMap[color.toLowerCase()] || color;
    
    return (
      <div 
        className={`${size} rounded-full border border-gray-300 flex-shrink-0`}
        style={{ 
          background: colorValue.includes('linear-gradient') ? colorValue : colorValue 
        }}
      />
    );
  };

  const ProductCard = ({ product }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handleProductClick = () => {
      navigate(`/product/${product.id}`);
      window.scrollTo({top: 30, behavior: "smooth"});
    };

    const discount = product.originalPrice 
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

    return (
      <div 
        className="product-card bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer"
        onClick={handleProductClick}
      >
        <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
          <img 
            src={product.images[currentImageIndex]} 
            alt={product.name}
            className="w-full h-full object-cover transition-opacity duration-300"
            onMouseEnter={() => product.images[1] && setCurrentImageIndex(1)}
            onMouseLeave={() => setCurrentImageIndex(0)}
          />
          {discount > 0 && (
            <span className="absolute top-1 sm:top-2 left-1 sm:left-2 bg-pink-500 text-white text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
              {discount}% OFF
            </span>
          )}
        </div>
        
        <div className="p-2 sm:p-3 md:p-4">
          <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
            <div className="flex gap-0.5 sm:gap-1">
              {product.colors.slice(0, 4).map((color, index) => (
                <ColorCircle key={index} color={color} />
              ))}
            </div>
            {product.colors.length > 4 && (
              <span className="text-gray-500 text-xs sm:text-sm">+{product.colors.length - 4}</span>
            )}
          </div>
          
          <h3 className="text-gray-800 font-medium mb-1 text-xs sm:text-sm md:text-base line-clamp-2">{product.name}</h3>
          
          <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
            <span className="text-sm sm:text-lg font-bold text-gray-900">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-xs sm:text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
            )}
          </div>
          
          <p className="text-gray-600 text-xs mb-1 line-clamp-1">{product.subCategory}</p>
          
          {discount > 0 && (
            <p className="text-pink-600 text-xs sm:text-sm font-medium">Save ₹{product.originalPrice - product.price}</p>
          )}
        </div>
      </div>
    );
  };

  const Pagination = () => {
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    
    const handlePageChange = (page) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    const getVisiblePages = () => {
      const delta = 1; // Reduced for mobile
      const range = [];
      const rangeWithDots = [];

      for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
        range.push(i);
      }

      if (currentPage - delta > 2) {
        rangeWithDots.push(1, '...');
      } else if (totalPages > 1) {
        rangeWithDots.push(1);
      }

      rangeWithDots.push(...range);

      if (currentPage + delta < totalPages - 1) {
        rangeWithDots.push('...', totalPages);
      } else if (totalPages > 1 && !rangeWithDots.includes(totalPages)) {
        rangeWithDots.push(totalPages);
      }

      return rangeWithDots;
    };

    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-center gap-1 sm:gap-2 mt-8 sm:mt-12 font-bold" style={{fontFamily:"Montserrat"}}>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-2 sm:px-3 py-1 sm:py-2 text-sm sm:text-base text-gray-950 hover:text-gray-900 disabled:text-gray-300 disabled:cursor-not-allowed"
        >
          Back
        </button>

        {getVisiblePages().map((page, index) => (
          <div key={index}>
            {page === '...' ? (
              <span className="px-2 sm:px-3 py-1 sm:py-2 text-sm sm:text-base text-gray-500">...</span>
            ) : (
              <button
                onClick={() => handlePageChange(page)}
                className={`px-2 sm:px-3 py-1 sm:py-2 text-sm sm:text-base border rounded-xl transition-all ${
                  currentPage === page
                    ? 'border-gray-900 bg-white text-gray-900 transform -translate-y-1 shadow-md'
                    : 'border-gray-300 bg-white text-gray-600 hover:border-gray-500 hover:text-gray-900'
                }`}
              >
                {page}
              </button>
            )}
          </div>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-2 sm:px-3 py-1 sm:py-2 text-sm sm:text-base text-gray-950 hover:text-gray-900 disabled:text-gray-300 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    );
  };

  // Get current page products
  const getCurrentPageProducts = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  };

  // Category display names
  const categoryDisplayNames = {
    'BRAS': 'Bras',
    'PANTIES': 'Panties', 
    'LINGERIE': 'Sleep & Lingerie',
    'APPAREL': 'Apparel',
    'BEAUTY': 'Beauty',
    'CLEARANCE': 'Clearance'
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-3">
          <div className="flex items-center text-xs sm:text-sm text-gray-600">
            <button onClick={handleBackClick} className="hover:text-gray-900 flex items-center">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
              </svg>
              Back
            </button>
            <span className="mx-1 sm:mx-2">/</span>
            <span className="text-gray-900">{categoryDisplayNames[currentCategory] || currentCategory}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Page Title */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
            {categoryDisplayNames[currentCategory] || currentCategory}
            <span className="text-gray-500 font-normal text-sm sm:text-base"> ({filteredProducts.length} items)</span>
          </h1>
        </div>

        {/* Filters */}
        <div className="mb-4 sm:mb-6">
          {/* Mobile Filter Layout */}
          <div className="block md:hidden">
            <span className="font-bold text-lg text-gray-900 block mb-2">FILTERS</span>
            <div className="bg-white rounded-sm border flex-1 p-3">
              <div className="grid grid-cols-2 gap-2 mb-3">
                <FilterDropdown 
                  label="Sub Category" 
                  options={getUniqueValues('subCategory')}
                  value={filters.subCategory}
                  onChange={(value) => handleFilterChange('subCategory', value)}
                />
                <FilterDropdown 
                  label="Color" 
                  options={getUniqueValues('colors')}
                  value={filters.color}
                  onChange={(value) => handleFilterChange('color', value)}
                />
              </div>
              <FilterDropdown 
                label="Size" 
                options={getUniqueValues('sizes')}
                value={filters.size}
                onChange={(value) => handleFilterChange('size', value)}
              />
            </div>
            <div className="flex items-center justify-between mt-3">
              <span className="text-gray-700 text-sm font-medium">SORT BY</span>
              <div className="relative">
                <select 
                  className={`appearance-none bg-white rounded px-3 py-1 pr-6 text-sm transition-colors ${
                    sortBy !== 'Recommended' ? 'text-pink-600' : 'text-gray-700'
                  }`}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="Recommended">Recommended</option>
                  <option value="Price: Low to High">Price: Low to High</option>
                  <option value="Price: High to Low">Price: High to Low</option>
                  <option value="Newest First">Newest First</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-gray-700">
                  <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Filter Layout */}
          <div className="hidden md:block">
            <div className="flex items-center">
              <span className="font-bold text-l lg:text-2xl pr-2 text-gray-900">FILTERS</span>
              <div className="bg-white rounded-sm border-1 flex-1">
                <div className="flex justify-evenly flex-wrap gap-2">
                  <FilterDropdown 
                    label="Sub Category" 
                    options={getUniqueValues('subCategory')}
                    value={filters.subCategory}
                    onChange={(value) => handleFilterChange('subCategory', value)}
                  />
                  <FilterDropdown 
                    label="Color" 
                    options={getUniqueValues('colors')}
                    value={filters.color}
                    onChange={(value) => handleFilterChange('color', value)}
                  />
                  <FilterDropdown 
                    label="Size" 
                    options={getUniqueValues('sizes')}
                    value={filters.size}
                    onChange={(value) => handleFilterChange('size', value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <div className="flex items-center gap-4">
                <span className="text-gray-700 text-sm lg:text-base">SORT BY</span>
                <div className="relative">
                  <select 
                    className={`appearance-none bg-white rounded px-4 py-2 pr-8 transition-colors ${
                      sortBy !== 'Recommended' ? 'text-pink-600' : 'text-gray-700'
                    }`}
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="Recommended">Recommended</option>
                    <option value="Price: Low to High">Price: Low to High</option>
                    <option value="Price: High to Low">Price: High to Low</option>
                    <option value="Newest First">Newest First</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {getCurrentPageProducts().map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* No products message */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <p className="text-gray-500 text-base sm:text-lg">No products found matching your filters.</p>
            <button 
              onClick={() => setFilters({
                brand: '',
                style: '',
                color: '',
                promotions: '',
                collection: '',
                pantyWaist: '',
                subCategory: ''
              })}
              className="mt-4 px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors text-sm sm:text-base"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Pagination */}
        <Pagination />
      </div>
    </div>
  );
};

export default Products;