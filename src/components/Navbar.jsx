// Navbar.jsx
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "/LOGO.png";
import Banner from "../components/Banner";
import infoproducts from "./ProductsInfo";

const Navbar = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  // Handle manual search submit (when pressing Enter)
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      setSuggestions([]);
      setSearchOpen(false);
    }
  };

  // Handle real-time suggestions
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.trim() === "") {
      setSuggestions([]);
      return;
    }

    const filtered = infoproducts.filter(
      (p) =>
        p.name.toLowerCase().includes(value.toLowerCase()) ||
        p.category.toLowerCase().includes(value.toLowerCase())
    );

    setSuggestions(filtered.slice(0, 6));
  };

  // Check if current page is active
  const isActivePage = (path) => location.pathname === path;

  const navigationItems = [
    { path: "/products/bras", label: "BRAS" },
    { path: "/products/panties", label: "PANTIES" },
    { path: "/products/lingerie", label: "SLEEP & LINGERIE" },
    { path: "/products/apparel", label: "APPAREL" },
    { path: "/products/beauty", label: "BEAUTY" },
    { path: "/products/clearance", label: "CLEARANCE" },
  ];

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
          <div className="flex-1 flex justify-end items-center relative">
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
                placeholder="SEARCH"
                value={searchQuery}
                onChange={handleInputChange}
                className="flex-1 text-sm focus:outline-none bg-transparent placeholder-gray-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSuggestions([]);
                  }}
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
              {/* Suggestions dropdown */}
              {suggestions.length > 0 && (
                <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-50">
                  {suggestions.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        navigate(`/product/${item.id}`);
                        setSearchQuery("");
                        setSuggestions([]);
                      }}
                      className="flex items-center px-4 py-2 w-full text-left text-sm hover:bg-pink-50"
                    >
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="w-10 h-10 object-cover rounded mr-3"
                      />
                      <div>
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.category}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </form>

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
                placeholder="SEARCH"
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

            {/* Suggestions dropdown (mobile) */}
            {suggestions.length > 0 && (
              <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                {suggestions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      navigate(`/product/${item.id}`);
                      setSearchQuery("");
                      setSuggestions([]);
                      setSearchOpen(false);
                    }}
                    className="flex items-center px-4 py-2 w-full text-left text-sm hover:bg-pink-50"
                  >
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-10 h-10 object-cover rounded mr-3"
                    />
                    <div>
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.category}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </form>
        )}
      </div>

      {/* Desktop Navigation */}
      <div className="hidden lg:block bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-3">
          <ul className="flex justify-center space-x-8 xl:space-x-12 text-sm font-medium text-gray-700">
            {navigationItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`relative hover:text-pink-600 transition-all duration-300 uppercase tracking-wide pb-2 px-2 group hover:scale-105 ${
                    isActivePage(item.path)
                      ? "text-pink-600 border-b-2 border-pink-600"
                      : "hover:border-b-2 hover:border-pink-300"
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute bottom-0 left-0 w-full h-0.5 bg-pink-600 transform origin-left transition-transform duration-300 ${
                      isActivePage(item.path)
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  ></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg animate-slideDown z-50">
          <div className="px-4 py-4 space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 text-base font-medium uppercase tracking-wide rounded-md transition-all duration-200 hover:bg-pink-50 hover:text-pink-600 hover:translate-x-2 hover:shadow-sm ${
                  isActivePage(item.path)
                    ? "text-pink-600 bg-pink-50 border-l-4 border-pink-600"
                    : "text-gray-700 hover:border-l-4 hover:border-pink-300"
                }`}
              >
                {item.label}
              </Link>
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
      `}</style>
    </>
  );
};

export default Navbar;
