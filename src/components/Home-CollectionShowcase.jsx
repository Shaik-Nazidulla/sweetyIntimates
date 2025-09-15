import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const intimateCards = [
  { 
    id: 1, 
    img: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop&crop=center",
    category: "Bikini",
    text: "Shop Mists & Lotions"
  },
  { 
    id: 2, 
    img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=500&fit=crop&crop=center",
    category: "Sports wear",
    text: "Shop Mists & Lotions"
  },
  { 
    id: 3, 
    img: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=500&fit=crop&crop=center",
    category: "Gym wear",
    text: "Shop Mists & Lotions"
  },
  { 
    id: 4, 
    img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=500&fit=crop&crop=center",
    category: "Bras",
    text: "Shop Mists & Lotions"
  },
  { 
    id: 5, 
    img: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop&crop=center",
    category: "Lingerie",
    text: "Shop Mists & Lotions"
  },
  { 
    id: 6, 
    img: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=500&fit=crop&crop=center",
    category: "Sleepwear",
    text: "Shop Mists & Lotions"
  },
  { 
    id: 7, 
    img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=500&fit=crop&crop=center",
    category: "Panties",
    text: "Shop Mists & Lotions"
  },
  { 
    id: 8, 
    img: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop&crop=center",
    category: "Shapewear",
    text: "Shop Mists & Lotions"
  },
  { 
    id: 9, 
    img: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=500&fit=crop&crop=center",
    category: "Activewear",
    text: "Shop Mists & Lotions"
  },
  { 
    id: 10, 
    img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=500&fit=crop&crop=center",
    category: "Bodysuits",
    text: "Shop Mists & Lotions"
  },
  { 
    id: 11, 
    img: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop&crop=center",
    category: "Camisoles",
    text: "Shop Mists & Lotions"
  },
  { 
    id: 12, 
    img: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=500&fit=crop&crop=center",
    category: "Robes",
    text: "Shop Mists & Lotions"
  }
];

const IntimatesCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const containerRef = useRef(null);
  const cardsRef = useRef([]);

  // Responsive items per page
  useEffect(() => {
    const updateItemsPerPage = () => {
      const width = window.innerWidth;
      if (width < 768) setItemsPerPage(2);      // Mobile: 2 cards
      else if (width < 1024) setItemsPerPage(3); // Medium: 3 cards  
      else setItemsPerPage(4);                   // Large: 4 cards
    };

    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);
    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);

  // Load GSAP and setup animations
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
    script.onload = () => {
      // GSAP loaded
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);


  const nextSlide = () => {
    if (currentIndex < intimateCards.length - itemsPerPage) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const progressWidth = `${((currentIndex + itemsPerPage) / intimateCards.length) * 100}%`;

  return (
    <div className="w-full py-8 sm:py-12 bg-white px-4 lg:px-2">
      {/* Title */}
      <h2 className="text-2xl sm:text-3xl lg:text-6xl font-light text-center mb-8 sm:mb-12 text-gray-800 tracking-wide"
      style={{ fontFamily: "Montaga, serif", fontWeight: 400, fontStyle: "normal" }}>
        There's More to explore
      </h2>

      {/* Carousel Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          disabled={currentIndex === 0}
          className="absolute left-0 sm:left-2 top-1/2 -translate-y-1/2 z-20 w-5 lg:w-8 h-12 sm:w-10 sm:h-14 bg-pink-400 hover:bg-pink-500 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-sm shadow-lg transition-all duration-300 flex items-center justify-center"
        >
          <ChevronLeft className="text-white w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <button
          onClick={nextSlide}
          disabled={currentIndex >= intimateCards.length - itemsPerPage}
          className="absolute right-0 sm:right-2 top-1/2 -translate-y-1/2 z-20 w-5 lg:w-8 h-12 sm:w-10 sm:h-14 bg-pink-400 hover:bg-pink-500 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-sm shadow-lg transition-all duration-300 flex items-center justify-center"
        >
          <ChevronRight className="text-white w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Cards Container */}
        <div className="overflow-hidden mx-2 sm:mx-14">
          <div 
            ref={containerRef}
            className={`grid gap-3 sm:gap-4 lg:gap-6 ${
              itemsPerPage === 2 ? 'grid-cols-2' : 
              itemsPerPage === 3 ? 'grid-cols-3' : 
              'grid-cols-4'
            }`}
          >
            {intimateCards.slice(currentIndex, currentIndex + itemsPerPage).map((card, index) => (
              <div
                key={`${card.id}-${currentIndex}`}
                className="card-item  overflow-hidden  hover:shadow-xl transition-all duration-300 cursor-pointer group"
              >
                {/* Image Container with Text Overlay */}
                <div className="relative overflow-hidden ">
                  <img
                    src={card.img}
                    alt={card.category}
                    className="w-full h-48 sm:h-56 md:h-64 lg:h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  
                  {/* Category Text Overlay */}
                  <div className="absolute bottom-4 left-4 z-10">
                    <h3 className="text-white text-lg sm:text-xl lg:text-2xl font-light tracking-wide drop-shadow-lg"
                    style={{
                         fontFamily: "Montaga, serif",
                         fontWeight: 400,
                        }}>
                      {card.category}
                    </h3>
                  </div>
                  
                  {/* Gradient Overlay for Text Readability */}
                  <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
                
                {/* Bottom Text */}
                <div className="px-2 py-4 text-left bg-white">
                  <p className="text-xs sm:text-sm text-gray-700 font-medium border-b border-gray-400 pb-1 inline-block">
                    {card.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-8 sm:mt-12 w-full max-w-4xl mx-auto px-4">
        <div className="h-1 bg-gray-300 rounded-full overflow-hidden">
          <div
            className="h-full bg-pink-400 rounded-full transition-all duration-500 ease-out"
            style={{ width: progressWidth }}
          />
        </div>
      </div>
    </div>
  );
};

export default IntimatesCarousel;