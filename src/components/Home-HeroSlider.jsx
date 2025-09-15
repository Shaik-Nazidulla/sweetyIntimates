import React, { useState, useEffect } from "react";
import HeroImg1 from "../assets/hero/HeroImg1.png";

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [textColor, setTextColor] = useState('white'); // Default to white
  
  // Using a proper background image that matches your reference
  const heroImage = "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=800&fit=crop&crop=center";
  
  const slides = [
    {
      image: HeroImg1,
      title: "HUGE RANGE OF BEAUTIFUL BRAS",
      subtitle: "From ₹ 499/-",
      buttonText: "SHOP NOW"
    },
    {
      image: heroImage,
      title: "FEMINITY IS THE ULTIMATE FORM OF SOPHESTICATION",
      subtitle: "From ₹ 599/-",
      buttonText: "SHOP NOW"
    },
    {
      image: heroImage,
      title: "THE MOST BEAUTIFUL CLOTHES THAT CAN DRESS A WOMAN ARE THE ARMS OF THE MAN SHE LOVES",
      subtitle: "From ₹ 699/-",
      buttonText: "SHOP NOW"
    },
    {
      image: heroImage,
      title: "A WOMAN SHOULD ALWAYS DRESS TO BE REMEMBERED. NOT SIMPLY TO BE NOTICED",
      subtitle: "From ₹ 799/-",
      buttonText: "SHOP NOW"
    },
    {
      image: heroImage,
      title: "WE DESIGN FOR EVERYDAY, SO THERE ARE NO BELLS AND WHISTLES IN OUR PIECES",
      subtitle: "From ₹ 999/-",
      buttonText: "SHOP NOW"
    }
  ];

  // Function to detect image brightness and set text color
  const detectImageBrightness = (imageSrc) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      
      ctx.drawImage(img, 0, 0);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      let brightness = 0;
      
      // Calculate average brightness
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        brightness += (r * 0.299 + g * 0.587 + b * 0.114);
      }
      
      brightness = brightness / (data.length / 4);
      
      // Set text color based on brightness (threshold of 128)
      setTextColor(brightness > 128 ? 'black' : 'white');
    };
    img.src = imageSrc;
  };

  // Auto-slide functionality with circular transition
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => {
        const nextSlide = (prev + 1) % slides.length;
        return nextSlide;
      });
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Detect image brightness when component mounts
  useEffect(() => {
    detectImageBrightness(heroImage);
  }, [heroImage]);

  const nextSlide = () => {
    setCurrentSlide((prev) => {
      const next = (prev + 1) % slides.length;
      return next;
    });
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => {
      const previous = prev === 0 ? slides.length - 1 : prev - 1;
      return previous;
    });
  };

  return (
    <div className="relative w-full h-[50vh] min-h-[400px] sm:h-[60vh] sm:min-h-[500px] md:h-[70vh] md:min-h-[600px] lg:h-[80vh] lg:min-h-[700px] xl:h-[85vh] xl:min-h-[750px] overflow-hidden">
      {/* Slide Images */}
      <div 
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={index} className="min-w-full h-full relative">
            <img
              src={slide.image}
              alt={`Hero ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-between">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 h-full flex flex-col justify-between">
          
          {/* Main Title - Top Section */}
          <div className="flex items-start pt-8 sm:pt-12 md:pt-16 lg:pt-20">
            <div className="w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl">
              <h1 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight tracking-wider ${textColor === 'white' ? 'text-white' : 'text-pink-600'}`}>
                {slides[currentSlide].title}
              </h1>
            </div>
          </div>
          
          {/* Best Offers & Button - Bottom Section */}
          <div className="flex flex-col items-center sm:items-end pb-8 sm:pb-12 md:pb-16 lg:pb-20">
            {/* Best Offers Box */}
            <div className="mb-0">
              <div className={`${textColor === 'white' ? 'bg-transparent bg-opacity-50' : 'bg-transparent bg-opacity-50'} border-t-2 border-b-2 ${textColor === 'white' ? 'border-white' : 'border-white'} p-4 sm:p-5 md:p-6 lg:p-8`}>
                <h2 className={`text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 tracking-wider text-center sm:text-right ${textColor === 'white' ? 'text-white' : 'text-pink-600'}`}>
                  BEST OFFERS
                </h2>
                <p className={`text-sm sm:text-base md:text-lg lg:text-xl font-medium tracking-wide text-center sm:text-right ${textColor === 'white' ? 'text-white' : 'text-pink-600'}`}>
                  {slides[currentSlide].subtitle}
                </p>
              </div>
            </div>

            {/* Shop Now Button */}
            <button className="bg-pink-600 hover:bg-pink-700 text-white border-2 border-white px-6 py-2 sm:px-7 sm:py-3 md:px-8 md:py-3 lg:px-10 lg:py-4 text-sm sm:text-base md:text-lg font-bold tracking-wider transition-colors duration-300 shadow-lg hover:shadow-xl">
              {slides[currentSlide].buttonText}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className={`absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 hover:text-pink-300 transition-colors duration-300 z-10 ${textColor === 'white' ? 'text-white' : 'text-black'} p-2`}
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className={`absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 hover:text-pink-300 transition-colors duration-300 z-10 ${textColor === 'white' ? 'text-white' : 'text-black'} p-2`}
        aria-label="Next slide"
      >
        <svg className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default HeroSlider;