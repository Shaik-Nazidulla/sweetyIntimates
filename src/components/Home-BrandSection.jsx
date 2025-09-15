import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

import prd3 from "../assets/products/prd3.jpg";
import prd12 from "../assets/products/prd12.png";

const LingerieHeroSection = () => {
  const categoryStripRef = useRef(null);
  const leftSectionRef = useRef(null);
  const rightSectionRef = useRef(null);
  const readMoreBtnRef = useRef(null);
  const shopNowBtnRef = useRef(null);

  const categories = [
    'SWIM WEAR',
    'SPORTS BRA',
    'TIGHTS',
    'BRA SET',
    'LINGERIE',
    'SLEEPWEAR',
    'ACTIVEWEAR',
    'SHAPEWEAR'
  ];

  useEffect(() => {
    // Category strip scroll animation
    const categoryStrip = categoryStripRef.current;
    if (categoryStrip) {
      gsap.to(categoryStrip, {
        x: -200,
        duration: 20,
        repeat: -1,
        ease: "none"
      });
    }

    // Hover animations for buttons
    const readMoreBtn = readMoreBtnRef.current;
    const shopNowBtn = shopNowBtnRef.current;

    if (readMoreBtn) {
      readMoreBtn.addEventListener('mouseenter', () => {
        gsap.to(readMoreBtn, {
          scale: 1.05,
          duration: 0.3,
          ease: "power2.out"
        });
      });

      readMoreBtn.addEventListener('mouseleave', () => {
        gsap.to(readMoreBtn, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out"
        });
      });
    }

    if (shopNowBtn) {
      shopNowBtn.addEventListener('mouseenter', () => {
        gsap.to(shopNowBtn, {
          scale: 1.05,
          boxShadow: "0 10px 25px rgba(237, 29, 121, 0.3)",
          duration: 0.3,
          ease: "power2.out"
        });
      });

      shopNowBtn.addEventListener('mouseleave', () => {
        gsap.to(shopNowBtn, {
          scale: 1,
          boxShadow: "0 0px 0px rgba(237, 29, 121, 0)",
          duration: 0.3,
          ease: "power2.out"
        });
      });
    }

    // Entry animations
    gsap.fromTo(leftSectionRef.current, 
      { opacity: 0, x: -50 },
      { opacity: 1, x: 0, duration: 1, ease: "power3.out" }
    );

    gsap.fromTo(rightSectionRef.current,
      { opacity: 0, x: 50 },
      { opacity: 1, x: 0, duration: 1, delay: 0.2, ease: "power3.out" }
    );

    // Cleanup
    return () => {
      if (readMoreBtn) {
        readMoreBtn.removeEventListener('mouseenter', () => {});
        readMoreBtn.removeEventListener('mouseleave', () => {});
      }
      if (shopNowBtn) {
        shopNowBtn.removeEventListener('mouseenter', () => {});
        shopNowBtn.removeEventListener('mouseleave', () => {});
      }
    };
  }, []);

  return (
    <div className="w-full bg-gray-50">
      {/* Category Strip */}
      <div className="w-full bg-gray-700 text-white overflow-hidden py-2 sm:py-3 md:py-4">
        <div 
          ref={categoryStripRef}
          className="flex whitespace-nowrap gap-4 sm:gap-6 md:gap-8 lg:gap-12 xl:gap-16"
          style={{ width: 'max-content' }}
        >
          {[...categories, ...categories, ...categories].map((category, index) => (
            <button 
              key={index}
              className="text-xs sm:text-sm md:text-base lg:text-lg font-medium hover:text-pink-400 transition-colors duration-300 cursor-pointer flex-shrink-0"
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Section */}
      <div className="flex flex-col md:flex-row w-full">
        {/* Left Section - Responsive width */}
        <div 
          ref={leftSectionRef}
          className="w-full md:w-[70%] relative flex items-center justify-center 
                     min-h-[50vh] sm:min-h-[60vh] md:min-h-[70vh] lg:min-h-[80vh] xl:min-h-[90vh]
                     px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-12 lg:py-12 xl:px-16 xl:py-16"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img 
              src={prd3}
              alt="Lingerie Background"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0  bg-opacity-20 md:bg-transparent"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-full w-full">
            {/* Main Heading */}
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl 
                           font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6 lg:mb-8 
                           leading-tight tracking-wide">
              <span className="block">STYLISH AND</span>
              <span className="block">COMFORTABLE BRAS</span>
            </h1>

            {/* Description */}
            <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 
                          text-gray-600 font-medium mb-4 sm:mb-6 md:mb-8 lg:mb-12 
                          leading-relaxed max-w-none sm:max-w-lg md:max-w-xl lg:max-w-2xl">
              At Sweety Intimates, we believe lingerie is more than just fabric – it's a celebration of confidence, comfort, and femininity. Our mission is to design pieces that make every woman feel beautiful in her own skin, whether it's for everyday wear or special moments.
            </p>

            {/* Read More Button */}
            <button 
              ref={readMoreBtnRef}
              className="border-2 border-gray-400 bg-transparent text-gray-700 
                         px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-3 lg:px-8 lg:py-4 xl:px-10 xl:py-4
                         text-xs sm:text-sm md:text-base font-medium 
                         hover:border-gray-600 hover:text-gray-900 transition-all duration-300
                         min-w-[100px] sm:min-w-[120px] md:min-w-[140px]"
            >
              READ MORE
            </button>
          </div>
        </div>

        {/* Right Section - Responsive width */}
        <div 
          ref={rightSectionRef}
          className="w-full md:w-[30%] relative flex flex-col justify-end 
                     min-h-[40vh] sm:min-h-[50vh] md:min-h-[70vh] lg:min-h-[80vh] xl:min-h-[90vh]
                     px-4 py-6 sm:px-6 sm:py-8 md:px-6 md:py-8 lg:px-8 lg:py-10 xl:px-12 xl:py-12"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img 
              src={prd12}
              alt="Lingerie Background"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0  bg-opacity-40 md:bg-opacity-60"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 text-white mb-4 sm:mb-6 md:mb-8 lg:mb-12">
            <h2 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 
                           font-bold mb-3 sm:mb-4 md:mb-6 lg:mb-8 
                           leading-tight tracking-wide">
              <span className="block">DESIGNED TO</span>
              <span className="block">FLATTER YOUR SHAPE</span>
            </h2>
            
            <button 
              ref={shopNowBtnRef}
              className="w-full px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4 lg:px-8 lg:py-4
                         text-xs sm:text-sm md:text-base font-bold text-white 
                         transition-all duration-300 min-h-[40px] sm:min-h-[44px] md:min-h-[48px]"
              style={{ backgroundColor: 'rgba(237, 29, 121, 1)' }}
            >
              SHOP NOW
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LingerieHeroSection;