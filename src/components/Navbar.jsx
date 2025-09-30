// components/Navbar.jsx
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
import { 
  getAllSubcategories,
  searchSubcategories 
} from '../Redux/slices/subcategorySlice';
import Logo from "/LOGO.png";
import Banner from "../components/Banner";
import SignIn from "../pages/SignIn";
import { useCart } from "./CartContext";

const Navbar = () => {
  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [activeSearchTab, setActiveSearchTab] = useState('products');
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  
  // Redux state
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const { cartItems } = useCart();
  const { count: wishlistCount } = useSelector(state => state.wishlist);
  
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
    subcategories,
    searchResults: subcategoryResults, 
    searchLoading: subcategoryLoading 
  } = useSelector(state => state.subcategories);

  // Load categories and subcategories on mount
  useEffect(() => {
    if (categories.length === 0) {
      dispatch(getCategories());
    }
    if (subcategories.length === 0) {
      dispatch(getAllSubcategories());
    }
  }, [dispatch, categories.length, subcategories.length]);

  // Map subcategories to categories for dropdown display
  const categoriesWithSubcategories = React.useMemo(() => {
    return categories.map(category => ({
      ...category,
      subcategories: subcategories.filter(sub => 
        sub.category === category._id || sub.category?._id === category._id
      )
    }));
  }, [categories, subcategories]);

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

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuOpen && !event.target.closest('.mobile-menu-container')) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

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

  // Handle search submit
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      dispatch(setSearchQuery(searchQuery.trim()));
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchDropdownOpen(false);
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
    setSearchQuery("");
  };

  const handleCategoryClick = (category) => {
    const categorySlug = category.name.toLowerCase().replace(/\s+/g, '-');
    navigate(`/products/${categorySlug}`);
    setIsSearchDropdownOpen(false);
    setSearchQuery("");
    if (mobileMenuOpen) setMobileMenuOpen(false);
  };

  const handleSubcategoryClick = (subcategory, category) => {
    const categorySlug = category.name.toLowerCase().replace(/\s+/g, '-');
    const subcategorySlug = subcategory.name.toLowerCase().replace(/\s+/g, '-');
    navigate(`/products/${categorySlug}/${subcategorySlug}`);
    setIsSearchDropdownOpen(false);
    setSearchQuery("");
    if (mobileMenuOpen) setMobileMenuOpen(false);
  };

  const handleViewAllResults = () => {
    if (searchQuery.trim()) {
      dispatch(setSearchQuery(searchQuery.trim()));
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchDropdownOpen(false);
      setSearchQuery("");
    }
  };

  // Check if current page is active
  const isActivePage = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  // Helper function to get category path
  const getCategoryPath = (category) => {
    const categorySlug = category.name.toLowerCase().replace(/\s+/g, '-');
    return `/products/${categorySlug}`;
  };

  // Helper function to get subcategory path
  const getSubcategoryPath = (category, subcategory) => {
    const categorySlug = category.name.toLowerCase().replace(/\s+/g, '-');
    const subcategorySlug = subcategory.name.toLowerCase().replace(/\s+/g, '-');
    return `/products/${categorySlug}/${subcategorySlug}`;
  };

  // Modal handlers
  const openSignIn = () => setIsSignInOpen(true);
  const closeSignIn = () => setIsSignInOpen(false);

  // Search results helpers
  const hasSearchResults = productResults.length > 0 || categoryResults.length > 0 || subcategoryResults.length > 0;
  const isSearchLoading = productLoading || categoryLoading || subcategoryLoading;

  return (
    <>
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden animate-fadeIn" />
      )}

      {/* Main Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm relative">
        <div className="w-full px-4 sm:px-6 py-4">
          <div className="flex items-center">
            {/* Left Section - Mobile Menu + About Us & Contact Us */}
            <div className="flex items-center space-x-6 flex-1">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-md transition-all duration-200"
                aria-label="Toggle menu"
              >
                <div className="relative w-6 h-6">
                  <span
                    className={`absolute block w-6 h-0.5 bg-gray-700 transform transition-all duration-300 ${
                      mobileMenuOpen ? 'rotate-45 top-2.5' : 'top-1'
                    }`}
                  />
                  <span
                    className={`absolute block w-6 h-0.5 bg-gray-700 transform transition-all duration-300 top-2.5 ${
                      mobileMenuOpen ? 'opacity-0' : 'opacity-100'
                    }`}
                  />
                  <span
                    className={`absolute block w-6 h-0.5 bg-gray-700 transform transition-all duration-300 ${
                      mobileMenuOpen ? '-rotate-45 top-2.5' : 'top-4'
                    }`}
                  />
                </div>
              </button>

              {/* About Us & Contact Us - Desktop only */}
              <div className="hidden lg:flex items-center space-x-6 text-md text-gray-600 ">
                <button 
                  onClick={() => {
                    navigate('/about');
                    setMobileMenuOpen(false);
                  }}
                  className="hover:text-pink-500 transition-colors                 duration-200 py-2"
                >
                  About Us
                </button>
                <a href="#" className="hover:underline hover:text-pink-500 transition-all duration-200 hover:scale-105 transform py-1">
                  Contact Us
                </a>
              </div>
            </div>

            {/* Center Section - Logo (Absolute center) */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <Link
                to="/"
                className="flex items-center hover:scale-105 transition-transform duration-200"
              >
                <img src={Logo} alt="Sweety Intimate" className="h-12 sm:h-15 w-auto" />
              </Link>
            </div>

            {/* Right Section - Search + Icons */}
            <div className="flex items-center space-x-4 flex-1 justify-end">
              {/* Search Bar */}
              <div className="hidden lg:flex items-center relative" ref={searchRef}>
                <form
                  onSubmit={handleSearch}
                  className="flex items-center bg-gray-50 border border-gray-300 rounded-md px-3 py-2 w-64 hover:border-pink-300 transition-colors duration-200 focus-within:border-pink-500 focus-within:ring-2 focus-within:ring-pink-200 relative"
                >
                  <svg
                    className="w-4 h-4 text-pink-500 mr-2"
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
                    placeholder="Search products..."
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
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-hidden">
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
                                    src={product.colors?.[0]?.images?.[0] || product.images?.[0]}
                                    alt={product.name}
                                    className="w-12 h-12 object-cover rounded-md mr-3"
                                    onError={(e) => {
                                      e.target.src = '/placeholder-image.jpg';
                                    }}
                                  />
                                  <div className="flex-1">
                                    <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
                                      {product.name}
                                    </h4>
                                    <p className="text-sm text-pink-600 font-semibold">₹{product.price?.toLocaleString('en-IN')}</p>
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
                              {subcategoryResults.map((subcategory) => {
                                const parentCategory = categories.find(cat => 
                                  cat._id === subcategory.category || cat._id === subcategory.category?._id
                                );
                                
                                return (
                                  <div
                                    key={subcategory._id}
                                    onClick={() => handleSubcategoryClick(subcategory, parentCategory)}
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
                                      {parentCategory && (
                                        <p className="text-xs text-gray-500">
                                          in {parentCategory.name}
                                        </p>
                                      )}
                                      {subcategory.description && (
                                        <p className="text-xs text-gray-600 line-clamp-1">
                                          {subcategory.description}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
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
              </div>

              {/* User Icons - Icons only with tooltips */}
              <div className="flex items-center space-x-3">
                {/* Profile/Sign In */}
                {isAuthenticated ? (
                  <div className="relative group">
                    <button 
                      onClick={() => navigate('/profile')}
                      className="p-1 text-pink-500 hover:text-pink-600 hover:bg-pink-50 rounded-md transition-all duration-200 hover:scale-105"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </button>
                    {/* Tooltip */}
                    <div className="absolute top-full mb-2 left-1/2 transform -translate-x-1/2 px-2 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                      Profile
                    </div>
                  </div>
                ) : (
                  <div className="relative group">
                    <button 
                      onClick={openSignIn}
                      className="p-1 text-pink-500 hover:text-pink-600 hover:bg-pink-50 rounded-md transition-all duration-200 hover:scale-105"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </button>
                    {/* Tooltip */}
                    <div className="absolute top-full mb-2 left-1/2 transform -translate-x-1/2 px-2  bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                      Sign In
                    </div>
                  </div>
                )}

                {/* Wishlist */}
                <div className="relative group">
                  <button 
                    onClick={() => navigate("/Wishlist")}
                    className="p-1 text-pink-500 hover:text-pink-600 hover:bg-pink-50 rounded-md transition-all duration-200 hover:scale-105 relative"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    
                    {/* Wishlist Count Badge - ADD THIS */}
                    {wishlistCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-3 h-3 flex items-center justify-center">
                        {wishlistCount}
                      </span>
                    )}
                  </button>
                  {/* Tooltip - UPDATE THIS */}
                  <div className="absolute top-full mb-2 left-1/2 transform -translate-x-1/2 px-2 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                    Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
                  </div>
                </div>

                {/* Cart */}
                <div className="relative group">
                  <button
                    onClick={() => navigate("/cart")}
                    className="p-1 text-pink-500 hover:text-pink-600 hover:bg-pink-50 rounded-md transition-all duration-200 hover:scale-105 relative"
                  >
                    <svg
                      className="w-5 h-5"
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
                    
                    {/* Cart Count Badge */}
                    {cartItems.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-3 h-3 flex items-center justify-center">
                        {cartItems.length}
                      </span>
                    )}
                  </button>
                  {/* Tooltip */}
                  <div className="absolute top-full mb-2 left-1/2 transform -translate-x-1/2 px-2  bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                    Cart {cartItems.length > 0 && `(${cartItems.length})`}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Navigation Row */}
      <div className="hidden lg:block bg-white border-b border-gray-200 shadow-sm relative">
        <div className="w-full px-6 py-3">
          <ul className="flex justify-center space-x-8 xl:space-x-12 text-sm font-medium text-gray-700">
            {categoriesWithSubcategories.map((category) => (
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

      {/* Enhanced Mobile Navigation Slide-out Menu */}
      <div className={`mobile-menu-container fixed top-0 left-0 h-full w-80 max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 lg:hidden ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-pink-50 to-purple-50">
            <div className="flex items-center">
              <img src={Logo} alt="Sweety Intimate" className="h-8 w-auto mr-2" />
              <span className="text-lg font-semibold text-gray-800">Menu</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 hover:bg-pink-100 rounded-full transition-colors duration-200"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Mobile Search */}
          <div className="p-4 border-b border-gray-200">
            <form onSubmit={handleSearch} className="relative">
              <div className="flex items-center bg-gray-50 border border-gray-300 rounded-md px-4 py-3 hover:border-pink-300 focus-within:border-pink-500 focus-within:ring-2 focus-within:ring-pink-200">
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
              </div>
            </form>
          </div>

          {/* About Us & Contact Us - Mobile */}
          <div className="px-4 py-2 border-b border-gray-200 bg-gray-50">
            <div className="flex space-x-4 text-xs text-gray-900">
              <button 
               onClick={() => navigate('/about')}
               className="hover:underline hover:text-pink-500              transition-all duration-200 hover:scale-105              transform py-1"
             >
               About Us
             </button>
              <a href="#" className="hover:text-pink-500 transition-colors duration-200 py-2">
                Contact Us
              </a>
            </div>
          </div>

          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto py-4">
            <div className="px-4 space-y-2">
              {categoriesWithSubcategories.map((category) => (
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

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-500 text-center">© 2024 Sweety Intimate</p>
          </div>
        </div>
      </div>

      <Banner />
      
      {/* SignIn Modal */}
      <SignIn isOpen={isSignInOpen} onClose={closeSignIn} />

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
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
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

// Enhanced Mobile Category Menu Component
const MobileCategoryMenu = ({ category, isActive, onLinkClick, onCategoryClick, onSubcategoryClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasSubcategories = category.subcategories && category.subcategories.length > 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex items-center">
        <button
          onClick={() => onCategoryClick(category)}
          className={`flex-1 px-4 py-4 text-left font-medium transition-all duration-200 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 ${
            isActive
              ? "text-pink-600 bg-gradient-to-r from-pink-50 to-purple-50 border-l-4 border-pink-500"
              : "text-gray-800 hover:text-pink-600"
          }`}
        >
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-3 ${isActive ? 'bg-pink-500' : 'bg-gray-300'}`}></div>
            <span className="text-sm uppercase tracking-wide">{category.name}</span>
            {isActive && (
              <svg className="w-4 h-4 ml-2 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
          </div>
        </button>
        
        {hasSubcategories && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-4 text-gray-500 hover:text-pink-600 hover:bg-pink-50 transition-all duration-200 border-l border-gray-100"
          >
            <svg
              className={`w-5 h-5 transform transition-transform duration-300 ${
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
      
      {/* Subcategories with smooth animation */}
      {hasSubcategories && (
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="border-t border-gray-100 bg-gradient-to-r from-gray-50 to-pink-50">
            {category.subcategories.map((subcategory, index) => (
              <button
                key={subcategory._id}
                onClick={() => onSubcategoryClick(subcategory, category)}
                className="w-full text-left px-6 py-3 text-sm text-gray-700 hover:text-pink-600 hover:bg-white hover:shadow-sm transition-all duration-200 border-b border-gray-100 last:border-b-0 flex items-center group"
              >
                <div className="w-2 h-2 rounded-full bg-gray-300 mr-3 group-hover:bg-pink-400 transition-colors duration-200"></div>
                <span className="flex-1">{subcategory.name}</span>
                <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;