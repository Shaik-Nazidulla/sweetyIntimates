import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import prd1 from "../assets/products/prd1.jpg";
import prd2 from "../assets/products/prd2.jpg";
import prd3 from "../assets/products/prd3.jpg";
import prd4 from "../assets/products/prd4.jpg";
import prd5 from "../assets/products/prd5.jpg";
import prd6 from "../assets/products/prd6.jpg";
import prd7 from "../assets/products/prd7.jpg";
import prd8 from "../assets/products/prd8.jpg";
import prd9 from "../assets/products/prd9.jpg";
import prd10 from "../assets/products/prd10.jpg";

const cards = [
  { id: 1, img: prd1 },
  { id: 2, img: prd2 },
  { id: 3, img: prd3 },
  { id: 4, img: prd4 },
  { id: 5, img: prd5 },
  { id: 6, img: prd6 },
  { id: 7, img: prd7 },
  { id: 8, img: prd8 },
  { id: 9, img: prd9 },
  { id: 10, img: prd10 },
];

const HomeDailyDeals = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  // Update items per page based on screen size
  useEffect(() => {
    const updateItemsPerPage = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        setItemsPerPage(4); // Large devices
      } else if (width >= 768) {
        setItemsPerPage(3); // Medium devices
      } else {
        setItemsPerPage(2); // Small devices
      }
    };

    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);
    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);

  // Reset current index if it's out of bounds after screen resize
  useEffect(() => {
    const maxIndex = Math.max(0, cards.length - itemsPerPage);
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [itemsPerPage, currentIndex]);

  const nextSlide = () => {
    const maxIndex = cards.length - itemsPerPage;
    if (currentIndex < maxIndex) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const progressWidth = `${((currentIndex + itemsPerPage) / cards.length) * 100}%`;
  const cardWidthPercentage = 100 / itemsPerPage;

  return (
    <div className="w-full py-8 bg-white sm:py-12 px-4 lg:px-2">
      {/* Title */}
      <h2 className="text-2xl sm:text-3xl lg:text-6xl font-light text-center mb-8 sm:mb-12 text-black tracking-wide"
      style={{ fontFamily: "Montaga, serif", fontWeight: 400, fontStyle: "normal" }}>
        FEATURED PRODUCTS
      </h2>

      {/* Slider container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Left Button */}
        <button
          onClick={prevSlide}
          disabled={currentIndex === 0}
          className={`absolute left-0 sm:left-2 top-1/2 -translate-y-1/2 z-20 w-5 lg:w-8 h-12 sm:w-10 sm:h-14 rounded-sm shadow-lg transition-all duration-300 flex items-center justify-center ${
            currentIndex === 0
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-pink-400 hover:bg-pink-500 hover:shadow-xl hover:scale-105'
          }`}
        >
          <ChevronLeft className={`w-5 h-5 sm:w-6 sm:h-6 ${currentIndex === 0 ? 'text-gray-500' : 'text-white'}`} />
        </button>

        {/* Right Button */}
        <button
          onClick={nextSlide}
          disabled={currentIndex >= cards.length - itemsPerPage}
          className={`absolute right-0 sm:right-2 top-1/2 -translate-y-1/2 z-20 w-5 lg:w-8 h-12 sm:w-10 sm:h-14 rounded-sm shadow-lg transition-all duration-300 flex items-center justify-center ${
            currentIndex >= cards.length - itemsPerPage
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-pink-400 hover:bg-pink-500 hover:shadow-xl hover:scale-105'
          }`}
        >
          <ChevronRight className={`w-5 h-5 sm:w-6 sm:h-6 ${currentIndex >= cards.length - itemsPerPage ? 'text-gray-500' : 'text-white'}`} />
        </button>

        {/* Cards Container */}
        <div className="overflow-hidden mx-2 sm:mx-14">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * cardWidthPercentage}%)`,
            }}
          >
            {cards.map((card) => (
              <div
                key={card.id}
                className="flex-shrink-0 mx-1 sm:mx-2 group cursor-pointer"
                style={{ 
                  width: `calc(${cardWidthPercentage}% - ${itemsPerPage === 2 ? '8px' : '16px'})`,
                }}
              >
                <div className="bg-pink-300 overflow-hidden shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-2">
                  {/* Image with white border frame effect */}
                  <div className="p-3 sm:p-4">
                    <div className="bg-white p-1 relative overflow-hidden">
                      <img
                        src={card.img}
                        alt="deal"
                        className="w-full h-48 sm:h-56 md:h-64 lg:h-72 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
                    </div>
                  </div>
                  
                  {/* Text content */}
                  <div className="px-3 sm:px-4 pb-4 sm:pb-5 text-center">
                    <p className="font-bold text-xs sm:text-sm text-black mb-1 transition-colors duration-300 group-hover:text-gray-800">
                      UP TO 35% OFF
                    </p>
                    <p className="text-xs text-black font-medium transition-colors duration-300 group-hover:text-gray-700">
                      Shop Mists & Lotions
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-6 sm:mt-8 w-full max-w-4xl mx-auto px-4">
        <div className="h-1 bg-gray-200 relative overflow-hidden rounded-full">
          <div
            className="h-full bg-pink-500 absolute top-0 left-0 transition-all duration-500 rounded-full"
            style={{ width: progressWidth }}
          />
        </div>
      </div>
    </div>
  );
};

export default HomeDailyDeals;