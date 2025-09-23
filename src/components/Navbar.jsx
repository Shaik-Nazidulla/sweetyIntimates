// Navbar.jsx - Consolidated version
import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { 
  searchProducts, 
  setSearchQuery, 
  clearSearchResults 
} from '../Redux/slices/productsSlice';
import { 
  searchCategories,
  getCategories 
} from '../Redux/slices/categorySlice';
import { searchSubcategories } from '../Redux/slices/subcategorySlice';
import { getCategoryPath, getSubcategoryPath } from '../utils/categoryUtils';
import Logo from "/LOGO.png";
import Banner from "../components/Banner";

const Navbar = () => {
  // State management
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [activeSearchTab, setActiveSearchTab] = useState('products');
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const { isAuthenticated, user } = useSelector(state => state.auth);
  
  // Refs
  const searchRef = useRef(null);
  
  // Hooks
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const { 
    searchResults: productResults, 
    searchLoading: productLoading 
  } = useSelector(state => state.products);
  
  const { 
    categories,
    searchResults: categoryResults, 
    searchLoading: categoryLoading 
  } = useSelector(state => state.categories);
  
  const { 
    searchResults: subcategoryResults, 
    searchLoading: subcategoryLoading 
  } = useSelector(state => state.subcategories);

  // Load categories on mount
  useEffect(() => {
    if (categories.length === 0) {
      dispatch(getCategories());
    }
  }, [dispatch, categories.length]);

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim() && searchQuery.length > 2) {
        performSearch(searchQuery.trim());
        setIsSearchDropdownOpen(true);
      } else {
        setIsSearchDropdownOpen(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const performSearch = (query) => {
    dispatch(searchProducts({ query, page: 1, limit: 5 }));
    dispatch(searchCategories(query));
    dispatch(searchSubcategories(query));
  };

  // Handle search submit (when pressing Enter)
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      dispatch(setSearchQuery(searchQuery.trim()));
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchDropdownOpen(false);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  // Handle search input change
  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
    setIsSearchDropdownOpen(false);
    dispatch(clearSearchResults());
  };

  // Navigation handlers
  const handleProductClick = (product) => {
    navigate(`/product/${product._id}`);
    setIsSearchDropdownOpen(false);
    setSearchOpen(false);
    setSearchQuery("");
  };

  const handleCategoryClick = (category) => {
    navigate(getCategoryPath(category));
    setIsSearchDropdownOpen(false);
    setSearchOpen(false);
    setSearchQuery("");
    if (mobileMenuOpen) setMobileMenuOpen(false);
  };

  const handleSubcategoryClick = (subcategory, category) => {
    navigate(getSubcategoryPath(category, subcategory));
    setIsSearchDropdownOpen(false);
    setSearchOpen(false);
    setSearchQuery("");
    if (mobileMenuOpen) setMobileMenuOpen(false);
  };

  const handleViewAllResults = () => {
    if (searchQuery.trim()) {
      dispatch(setSearchQuery(searchQuery.trim()));
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchDropdownOpen(false);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  // Check if current page is active
  const isActivePage = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  // Search results helpers
  const hasSearchResults = productResults.length > 0 || categoryResults.length > 0 || subcategoryResults.length > 0;
  const isSearchLoading = productLoading || categoryLoading || subcategoryLoading;

  return (
    <>
      {/* Navbar - Logo & Search */}
      <div className="bg-white border-b border-gray-200 shadow-sm relative">
        <div className="flex items-center px-4 sm:px-6 py-4">
          {/* Mobile Menu Button */}
          <div className="flex-1 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors duration-200"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>

          {/* Logo */}
          <div className="flex-1 lg:flex-none flex justify-center lg:justify-start">
            <Link
              to="/"
              className="flex items-center hover:scale-105 transition-transform duration-200"
            >
              <img src={Logo} alt="Sweety Intimate" className="h-12 sm:h-15 w-auto" />
            </Link>
          </div>

          {/* Desktop Search */}
          <div className="flex-1 flex justify-end items-center relative" ref={searchRef}>
            <form
              onSubmit={handleSearch}
              className="hidden lg:flex items-center bg-gray-50 border border-gray-300 rounded-md px-4 py-2 w-80 hover:border-pink-300 transition-colors duration-200 focus-within:border-pink-500 focus-within:ring-2 focus-within:ring-pink-200 relative"
            >
              <svg
                className="w-5 h-5 text-pink-500 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search products, categories..."
                value={searchQuery}
                onChange={handleInputChange}
                onFocus={() => searchQuery.length > 2 && setIsSearchDropdownOpen(true)}
                className="flex-1 text-sm focus:outline-none bg-transparent placeholder-gray-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="ml-2 text-gray-400 hover:text-pink-500 transition-colors duration-200 p-1 hover:bg-white rounded"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </form>

            {/* Search Results Dropdown */}
            {isSearchDropdownOpen && searchQuery.length > 2 && (
              <div className="hidden lg:block absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-hidden">
                {isSearchLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500"></div>
                    <span className="ml-2 text-gray-600">Searching...</span>
                  </div>
                ) : hasSearchResults ? (
                  <>
                    {/* Tabs */}
                    <div className="flex border-b border-gray-200">
                      {productResults.length > 0 && (
                        <button
                          onClick={() => setActiveSearchTab('products')}
                          className={`px-4 py-2 text-sm font-medium ${
                            activeSearchTab === 'products'
                              ? 'text-pink-600 border-b-2 border-pink-600'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          Products ({productResults.length})
                        </button>
                      )}
                      {categoryResults.length > 0 && (
                        <button
                          onClick={() => setActiveSearchTab('categories')}
                          className={`px-4 py-2 text-sm font-medium ${
                            activeSearchTab === 'categories'
                              ? 'text-pink-600 border-b-2 border-pink-600'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          Categories ({categoryResults.length})
                        </button>
                      )}
                      {subcategoryResults.length > 0 && (
                        <button
                          onClick={() => setActiveSearchTab('subcategories')}
                          className={`px-4 py-2 text-sm font-medium ${
                            activeSearchTab === 'subcategories'
                              ? 'text-pink-600 border-b-2 border-pink-600'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          Subcategories ({subcategoryResults.length})
                        </button>
                      )}
                    </div>

                    {/* Results Content */}
                    <div className="max-h-80 overflow-y-auto">
                      {/* Products Tab */}
                      {activeSearchTab === 'products' && productResults.length > 0 && (
                        <div>
                          {productResults.slice(0, 5).map((product) => (
                            <div
                              key={product._id}
                              onClick={() => handleProductClick(product)}
                              className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                            >
                              <img
                                src={product.images?.[0]}
                                alt={product.name}
                                className="w-12 h-12 object-cover rounded-md mr-3"
                              />
                              <div className="flex-1">
                                <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
                                  {product.name}
                                </h4>
                                <p className="text-sm text-pink-600 font-semibold">₹{product.price}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Categories Tab */}
                      {activeSearchTab === 'categories' && categoryResults.length > 0 && (
                        <div>
                          {categoryResults.map((category) => (
                            <div
                              key={category._id}
                              onClick={() => handleCategoryClick(category)}
                              className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                            >
                              <div className="w-12 h-12 bg-pink-100 rounded-md mr-3 flex items-center justify-center">
                                <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-4l-3 3.5L16 11m3-4l-3 3.5L16 11" />
                                </svg>
                              </div>
                              <div className="flex-1">
                                <h4 className="text-sm font-medium text-gray-900">
                                  {category.name}
                                </h4>
                                {category.description && (
                                  <p className="text-xs text-gray-600 line-clamp-1">
                                    {category.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Subcategories Tab */}
                      {activeSearchTab === 'subcategories' && subcategoryResults.length > 0 && (
                        <div>
                          {subcategoryResults.map((subcategory) => (
                            <div
                              key={subcategory._id}
                              onClick={() => handleSubcategoryClick(subcategory)}
                              className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                            >
                              <div className="w-12 h-12 bg-purple-100 rounded-md mr-3 flex items-center justify-center">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                              </div>
                              <div className="flex-1">
                                <h4 className="text-sm font-medium text-gray-900">
                                  {subcategory.name}
                                </h4>
                                {subcategory.description && (
                                  <p className="text-xs text-gray-600 line-clamp-1">
                                    {subcategory.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* View All Results */}
                    <div className="p-3 border-t border-gray-200">
                      <button
                        onClick={handleViewAllResults}
                        className="w-full text-center text-sm font-medium text-pink-600 hover:text-pink-800"
                      >
                        View all results for "{searchQuery}"
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <p>No results found for "{searchQuery}"</p>
                    <p className="text-xs mt-1">Try searching for something else</p>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Search Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-md transition-colors duration-200 ml-2"
              aria-label="Toggle search"
            >
              <svg
                className="w-6 h-6 text-pink-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {searchOpen && (
          <form
            onSubmit={handleSearch}
            className="lg:hidden px-4 pb-4 border-t border-gray-100 animate-slideDown relative"
          >
            <div className="flex items-center bg-gray-50 border border-gray-300 rounded-md px-4 py-3 hover:border-pink-300 focus-within:border-pink-500 focus-within:ring-2 focus-within:ring-pink-200 relative">
              <svg
                className="w-5 h-5 text-pink-500 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search products, categories..."
                value={searchQuery}
                onChange={handleInputChange}
                className="flex-1 text-sm focus:outline-none bg-transparent placeholder-gray-500"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="ml-2 text-gray-400 hover:text-pink-500 transition-colors duration-200 p-1 hover:bg-white rounded"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Desktop Navigation with Dropdowns */}
      <div className="hidden lg:block bg-white border-b border-gray-200 shadow-sm relative">
        <div className="px-6 py-3">
          <ul className="flex justify-center space-x-8 xl:space-x-12 text-sm font-medium text-gray-700">
            <li>
              <Link
                to="/products"
                className={`relative hover:text-pink-600 transition-all duration-300 uppercase tracking-wide pb-2 px-2 group hover:scale-105 ${
                  isActivePage('/products')
                    ? "text-pink-600 border-b-2 border-pink-600"
                    : "hover:border-b-2 hover:border-pink-300"
                }`}
              >
                All Products
                <span
                  className={`absolute bottom-0 left-0 w-full h-0.5 bg-pink-600 transform origin-left transition-transform duration-300 ${
                    isActivePage('/products')
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                ></span>
              </Link>
            </li>
            
            {categories.map((category) => (
              <li 
                key={category._id}
                className="relative"
                onMouseEnter={() => setHoveredCategory(category._id)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <Link
                  to={getCategoryPath(category)}
                  className={`relative hover:text-pink-600 transition-all duration-300 uppercase tracking-wide pb-2 px-2 group hover:scale-105 flex items-center ${
                    isActivePage(getCategoryPath(category))
                      ? "text-pink-600 border-b-2 border-pink-600"
                      : "hover:border-b-2 hover:border-pink-300"
                  }`}
                >
                  {category.name}
                  {category.subcategories && category.subcategories.length > 0 && (
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  )}
                  <span
                    className={`absolute bottom-0 left-0 w-full h-0.5 bg-pink-600 transform origin-left transition-transform duration-300 ${
                      isActivePage(getCategoryPath(category))
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  ></span>
                </Link>

                {/* Dropdown for subcategories */}
                {category.subcategories && category.subcategories.length > 0 && hoveredCategory === category._id && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-48 animate-slideDown">
                    <Link
                      to={getCategoryPath(category)}
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors duration-200 first:rounded-t-md border-b border-gray-100 font-medium"
                    >
                      All {category.name}
                    </Link>
                    {category.subcategories.map((subcategory) => (
                      <Link
                        key={subcategory._id}
                        to={getSubcategoryPath(category, subcategory)}
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors duration-200 last:rounded-b-md"
                      >
                        {subcategory.name}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Mobile Navigation with Expandable Categories */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg animate-slideDown z-50 max-h-96 overflow-y-auto">
          <div className="px-4 py-4 space-y-2">
            <Link
              to="/products"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 text-base font-medium uppercase tracking-wide rounded-md transition-all duration-200 hover:bg-pink-50 hover:text-pink-600 hover:translate-x-2 hover:shadow-sm ${
                isActivePage('/products')
                  ? "text-pink-600 bg-pink-50 border-l-4 border-pink-600"
                  : "text-gray-700 hover:border-l-4 hover:border-pink-300"
              }`}
            >
              All Products
            </Link>
            
            {categories.map((category) => (
              <MobileCategoryMenu 
                key={category._id} 
                category={category} 
                isActive={isActivePage(getCategoryPath(category))}
                onLinkClick={() => setMobileMenuOpen(false)}
                onCategoryClick={handleCategoryClick}
                onSubcategoryClick={handleSubcategoryClick}
              />
            ))}
          </div>
        </div>
      )}

      <Banner />

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  );
};

// Mobile Category Menu Component with Expand/Collapse
const MobileCategoryMenu = ({ category, isActive, onLinkClick, onCategoryClick, onSubcategoryClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasSubcategories = category.subcategories && category.subcategories.length > 0;

  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <div className="flex items-center justify-between">
        <button
          onClick={() => onCategoryClick(category)}
          className={`flex-1 px-4 py-3 text-left text-base font-medium uppercase tracking-wide rounded-md transition-all duration-200 hover:bg-pink-50 hover:text-pink-600 hover:translate-x-2 hover:shadow-sm ${
            isActive
              ? "text-pink-600 bg-pink-50 border-l-4 border-pink-600"
              : "text-gray-700 hover:border-l-4 hover:border-pink-300"
          }`}
        >
          {category.name}
        </button>
        {hasSubcategories && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-gray-500 hover:text-pink-600 transition-colors duration-200"
          >
            <svg
              className={`w-5 h-5 transform transition-transform duration-200 ${
                isExpanded ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        )}
      </div>
      
      {hasSubcategories && isExpanded && (
        <div className="pl-6 pb-2 space-y-1">
          {category.subcategories.map((subcategory) => (
            <button
              key={subcategory._id}
              onClick={() => onSubcategoryClick(subcategory, category)}
              className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-pink-600 hover:bg-pink-50 rounded-md transition-all duration-200"
            >
              {subcategory.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Navbar;