import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";

const SignIn = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    homeAddress: "",
    officeAddress: "",
  });
  const [error, setError] = useState("");

  const modalRef = useRef(null);
  const overlayRef = useRef(null);

  // Load saved user data on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("userData");
    if (savedUser) {
      setFormData(JSON.parse(savedUser));
    }
  }, []);

  // Modal animation
  useEffect(() => {
    if (isOpen) {
      gsap.set(modalRef.current, { scale: 0.8, opacity: 0 });
      gsap.set(overlayRef.current, { opacity: 0 });

      gsap.to(overlayRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      });
      gsap.to(modalRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        ease: "back.out(1.7)",
        delay: 0.1,
      });
    }
  }, [isOpen]);

  const handleClose = () => {
    gsap.to(modalRef.current, {
      scale: 0.8,
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
    });
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: onClose,
    });
  };

  // Input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validation helper
  const validateForm = () => {
    if (!formData.name.trim()) return "Name is required.";
    if (!formData.email.includes("@")) return "Valid email is required.";
    if (formData.mobile.length < 10) return "Mobile number is too short.";
    return "";
  };

  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");

    // Save to localStorage
    localStorage.setItem("userData", JSON.stringify(formData));

    console.log("✅ User signed in:", formData);

    handleClose();
  };

  const handleGoogleLogin = () => {
    console.log("Google login clicked");
    // Here you’d integrate Firebase / Google Auth
    const fakeGoogleUser = {
      name: "Google User",
      email: "googleuser@example.com",
      mobile: "9876543210",
      homeAddress: "",
      officeAddress: "",
    };
    setFormData(fakeGoogleUser);
    localStorage.setItem("userData", JSON.stringify(fakeGoogleUser));
    handleClose();
  };

  const handleContinueAsGuest = () => {
    console.log("Continue as guest clicked");
    const guestUser = { name: "Guest", email: "", mobile: "" };
    localStorage.setItem("userData", JSON.stringify(guestUser));
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-transparent flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold z-10"
        >
          ×
        </button>

        <div className="flex">
          {/* Left Section - Account Details */}
          <div className="flex-1 p-8 border-r border-gray-200">
            <h2 className="text-2xl font-bold mb-8 text-center">
              Account Details
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <p className="text-red-500 text-sm font-medium">{error}</p>
              )}

              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-mail
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="example1234@gmail.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Mobile Number Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile number
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  placeholder="+91 96969696996"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* OR Separator */}
              <div className="flex items-center justify-center my-6">
                <div className="border-t border-gray-300 flex-1"></div>
                <span className="mx-4 text-gray-500 font-medium">OR</span>
                <div className="border-t border-gray-300 flex-1"></div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={handleContinueAsGuest}
                  className="w-full py-3 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-all duration-200 hover:scale-105"
                >
                  Continue as a Guest
                </button>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full py-3 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-all duration-200 hover:scale-105 flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Login with Google
                </button>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-3 bg-pink-500 text-white rounded-md font-medium hover:bg-pink-600 transition-all duration-200 hover:scale-105"
                >
                  Save & Continue
                </button>
              </div>
            </form>
          </div>

          {/* Right Section - Saved Address */}
          <div className="flex-1 p-8">
            <h2 className="text-2xl font-bold mb-8 text-center">
              Saved Address
            </h2>

            <div className="space-y-6">
              {/* Home Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Home
                </label>
                <textarea
                  name="homeAddress"
                  value={formData.homeAddress}
                  onChange={handleInputChange}
                  placeholder="example"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md h-32 resize-none focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Office Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Office
                </label>
                <textarea
                  name="officeAddress"
                  value={formData.officeAddress}
                  onChange={handleInputChange}
                  placeholder="example"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md h-32 resize-none focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Add More Button */}
              <div className="text-right">
                <button
                  type="button"
                  className="text-pink-600 font-medium hover:text-pink-700 transition-colors duration-200 hover:scale-105"
                >
                  Add More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
