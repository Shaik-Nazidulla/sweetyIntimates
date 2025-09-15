import React, { useEffect, useRef } from 'react';

const PerfectFitSection = () => {
  const imageRefs = useRef([]);
  const textRefs = useRef([]);

  // Sample image URLs - replace with your actual images
  const images = [
    "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=faces",
    "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=300&fit=crop&crop=entropy",
    "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=300&fit=crop&crop=faces",
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=entropy"
  ];

  useEffect(() => {
    // Add hover animations using CSS transitions
    imageRefs.current.forEach((img, index) => {
      if (img) {
        img.addEventListener('mouseenter', () => {
          img.style.transform = 'scale(1.05)';
          img.style.filter = 'brightness(1.1)';
        });
        
        img.addEventListener('mouseleave', () => {
          img.style.transform = 'scale(1)';
          img.style.filter = 'brightness(1)';
        });
      }
    });

    // Text reveal animation on scroll
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    });

    textRefs.current.forEach((ref) => {
      if (ref) {
        observer.observe(ref);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="w-full flex flex-col my-4">
      {/* Google Fonts Link */}
      <link 
        href="https://fonts.googleapis.com/css2?family=Bungee+Shade&family=ABeeZee:ital,wght@0,400;1,400&family=Abhaya+Libre:wght@800&display=swap" 
        rel="stylesheet" 
      />

      {/* Images Section - Maintains aspect ratio across devices */}
      <div className="w-full">
        {/* Desktop: 7 images in a row */}
        <div className="hidden lg:flex w-full">
          {images.map((src, index) => (
            <div 
              key={index} 
              className="flex-1"
              style={{ aspectRatio: '4/5' }}
            >
              <img
                ref={(el) => imageRefs.current[index] = el}
                src={src}
                alt={`Bra fit ${index + 1}`}
                className="w-full h-full object-cover transition-all duration-300 ease-out"
              />
            </div>
          ))}
        </div>

        {/* Tablet: 4 images on top, 3 on bottom */}
        <div className="hidden md:block lg:hidden w-full">
          <div className="flex w-full">
            {images.slice(0, 4).map((src, index) => (
              <div 
                key={index} 
                className="flex-1"
                style={{ aspectRatio: '4/5' }}
              >
                <img
                  ref={(el) => imageRefs.current[index] = el}
                  src={src}
                  alt={`Bra fit ${index + 1}`}
                  className="w-full h-full object-cover transition-all duration-300 ease-out"
                />
              </div>
            ))}
          </div>
          <div className="flex w-full">
            {images.slice(4, 7).map((src, index) => (
              <div 
                key={index + 4} 
                className="flex-1"
                style={{ aspectRatio: '4/5' }}
              >
                <img
                  ref={(el) => imageRefs.current[index + 4] = el}
                  src={src}
                  alt={`Bra fit ${index + 5}`}
                  className="w-full h-full object-cover transition-all duration-300 ease-out"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: 2 columns, multiple rows */}
        <div className="grid grid-cols-2 gap-0 md:hidden w-full">
          {images.slice(0, 6).map((src, index) => (
            <div 
              key={index}
              style={{ aspectRatio: '4/5' }}
            >
              <img
                ref={(el) => imageRefs.current[index] = el}
                src={src}
                alt={`Bra fit ${index + 1}`}
                className="w-full h-full object-cover transition-all duration-300 ease-out"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Text Section - Scales proportionally */}
      <div 
        className="flex-1 flex flex-col justify-center items-center text-center px-4 py-8 sm:py-12 lg:py-5"
        style={{ 
          backgroundColor: 'rgba(249, 231, 229, 1)',
          minHeight: 'clamp(300px, 30vh, 500px)'
        }}
      >
        {/* FIND YOUR - Bungee Shade Font */}
        <div 
          ref={(el) => textRefs.current[0] = el}
          className="mb-2 sm:mb-4 opacity-0 transition-all duration-800"
          style={{ 
            fontFamily: '"Bungee Shade", cursive',
            fontSize: 'clamp(1.5rem, 4vw, 4rem)',
            transform: 'translateY(30px)',
            lineHeight: '1.1'
          }}
        >
          FIND YOUR
        </div>

        {/* PERFECT FIT */}
        <div 
          ref={(el) => textRefs.current[1] = el}
          className="mb-4 sm:mb-6 font-bold tracking-widest opacity-0 transition-all duration-800 delay-200"
          style={{ 
            fontFamily: '"Abhaya Libre", serif',
            fontWeight: '800',
            fontSize: 'clamp(1.25rem, 3.5vw, 3rem)',
            letterSpacing: 'clamp(0.1em, 0.3em, 0.5em)',
            transform: 'translateY(30px)',
            lineHeight: '1.1'
          }}
        >
          PERFECT FIT
        </div>

        {/* Your Comfiest Bra Awaits */}
        <div 
          ref={(el) => textRefs.current[2] = el}
          className="mb-6 sm:mb-8 opacity-0 transition-all duration-800 delay-400 text-center max-w-md"
          style={{ 
            fontFamily: '"ABeeZee", sans-serif',
            fontWeight: 400,
            fontSize: 'clamp(1.1rem, 2.5vw, 1.8rem)',
            lineHeight: '1.2',
            letterSpacing: '-0.01em',
            transform: 'translateY(30px)'
          }}
        >
          Your Comfiest Bra Awaits
        </div>

        {/* SHOP NOW Button */}
        <div 
          ref={(el) => textRefs.current[3] = el}
          className="opacity-0 transition-all duration-800 delay-600"
          style={{ transform: 'translateY(30px)' }}
        >
          <button 
            className="border-2 border-black font-semibold tracking-wider hover:bg-black hover:text-white transition-all duration-300 transform hover:scale-105"
            style={{
              padding: 'clamp(0.75rem, 2vw, 1rem) clamp(1.5rem, 4vw, 2rem)',
              fontSize: 'clamp(0.9rem, 1.8vw, 1.125rem)'
            }}
          >
            SHOP NOW
          </button>
        </div>
      </div>
    </div>
  );
};

export default PerfectFitSection;