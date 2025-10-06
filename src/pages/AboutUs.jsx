import React from 'react';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-white to-pink-50">
      {/* Hero Section */}
      <div className="relative px-4 py-8 sm:px-6 sm:py-12 lg:px-6 lg:py-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8 lg:gap-12">
          {/* Left side - About Us Circle and Image */}
          <div className="relative flex-shrink-0 w-full flex justify-center lg:block lg:w-auto">
            <div className="relative">
              {/* Main profile image */}
              <div className="w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 rounded-full overflow-hidden border-4 sm:border-6 lg:border-8 border-white shadow-xl pt-10">
                <img 
                  src="https://res.cloudinary.com/dwqyjytaw/image/upload/v1759745924/LOGO_jiupar.png" 
                  alt="About Us" 
                  className="w-fit object-cover p-5 sm:p-6 lg:p-7"
                />
              </div>
              
              {/* About Us circular badge */}
              <div className="absolute -top-8 -left-8 sm:-top-10 sm:-left-10 lg:-top-30 lg:-left-6 w-24 h-24 sm:w-28 sm:h-28 lg:w-36 lg:h-36 bg-pink-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-base sm:text-lg lg:text-xl text-center leading-tight px-2">
                  ABOUT US
                </span>
              </div>
            </div>
          </div>

          {/* Right side - Mission Content */}
          <div className="flex-1 w-full text-left">
            <div className="bg-pink-200 p-6 sm:p-8 lg:p-12 shadow-lg relative rounded-lg lg:rounded-none">
              <h2 className="text-pink-600 text-base sm:text-lg font-medium mb-3 sm:mb-4">
                Our Mission
              </h2>
              <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-pink-700 mb-4 sm:mb-5 lg:mb-6 leading-tight">
                LOOKING FOR COMFORT AND CONFIDENCE IN INTIMATE WEAR?
              </h1>
              <p className="text-pink-600 text-sm sm:text-base lg:text-lg leading-relaxed mb-6 sm:mb-7 lg:mb-8">
                At Sweety Intimates, we believe every woman deserves to feel comfortable and confident in her own skin. We offer a premium collection of ladies' undergarments including bras, panties, camisoles, and shorts designed with the finest fabrics and perfect fit in mind. Have questions about sizing, fit, or our products? Our team is here to help! Reach out to us with your queries, feedback, or partnership opportunities. We're excited to hear from you!
              </p>
              
              {/* Social Media Icons */}
              <div className="flex justify-start gap-3 sm:gap-3.5 lg:gap-4">
                <a href="#" className="w-9 h-9 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-pink-600 rounded-full flex items-center justify-center text-white hover:bg-pink-700 transition-colors" aria-label="Twitter">
                  <svg className="w-4 h-4 sm:w-4 sm:h-4 lg:w-5 lg:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="w-9 h-9 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-pink-600 rounded-full flex items-center justify-center text-white hover:bg-pink-700 transition-colors" aria-label="Facebook">
                  <svg className="w-4 h-4 sm:w-4 sm:h-4 lg:w-5 lg:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="w-9 h-9 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-pink-600 rounded-full flex items-center justify-center text-white hover:bg-pink-700 transition-colors" aria-label="Pinterest">
                  <svg className="w-4 h-4 sm:w-4 sm:h-4 lg:w-5 lg:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.098.119.112.224.083.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                  </svg>
                </a>
                <a href="#" className="w-9 h-9 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-pink-600 rounded-full flex items-center justify-center text-white hover:bg-pink-700 transition-colors" aria-label="YouTube">
                  <svg className="w-4 h-4 sm:w-4 sm:h-4 lg:w-5 lg:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

      {/* Product Information Section */}
      <div className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
            {/* Left side - Content */}
            <div className="flex-1">
              <h2 className="text-2xl lg:text-3xl font-bold text-pink-700 mb-6 leading-tight">
                HOW DO I CHOOSE THE RIGHT BRA SIZE AND STYLE FOR ME?
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                Finding the perfect bra is all about understanding your unique measurements and comfort preferences. Start by getting professionally measured or use our comprehensive size guide to determine your band and cup size. Consider your lifestyle needs - do you need everyday comfort, sports support, or special occasion elegance? Our collection includes t-shirt bras for seamless wear, push-up bras for enhanced lift, sports bras for active days, and delicate lace styles for special moments. Remember, the right fit means the band sits snugly without riding up, the cups fully contain without spillage, and the straps stay in place comfortably. Don't hesitate to reach out to our team for personalized fitting advice!
              </p>
            </div>

            {/* Right side - Image */}
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="w-80 h-80 rounded-full overflow-hidden border-4 border-pink-200 shadow-xl">
                  <img 
                    src="https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=400&fit=crop&crop=face" 
                    alt="Intimate wear collection" 
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Pink circular background accent */}
                <div className="absolute -top-8 -right-8 w-64 h-64 bg-pink-200 rounded-full -z-10"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* The Teams Section */}
      <div className="px-6 py-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-pink-700 text-center mb-16">THE TEAM</h2>
          
          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Team Images */}
            <div className="relative flex items-center justify-center h-full">
              {/* Rajesh Kumar - Top Left */}
              <div className="absolute top-0 left-8">
                <div className="w-44 h-44 rounded-full overflow-hidden border-4 border-pink-300 shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face" 
                    alt="Rajesh Kumar" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-pink-300 px-3 py-1 rounded-full whitespace-nowrap">
                  <span className="text-pink-700 font-semibold text-sm">Rajesh Kumar</span>
                </div>
              </div>

              {/* Arjun Mehta - Center Right with pink background */}
              <div className="absolute top-16 right-0">
                <div className="relative">
                  <div className="absolute -top-8 -right-8 w-64 h-64 bg-pink-200 rounded-full -z-10"></div>
                  <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-pink-300 shadow-lg">
                    <img 
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face" 
                      alt="Arjun Mehta" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-pink-300 px-3 py-1 rounded-full whitespace-nowrap">
                    <span className="text-pink-700 font-semibold text-sm">Arjun Mehta</span>
                  </div>
                </div>
              </div>

              {/* Vikram Shah - Bottom Left with pink background */}
              <div className="absolute bottom-0 left-5">
                <div className="relative">
                  <div className="absolute -top-6 -left-8 w-48 h-48 bg-pink-200 rounded-full -z-10"></div>
                  <div className="w-44 h-44 rounded-full overflow-hidden border-4 border-pink-300 shadow-lg">
                    <img 
                      src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face" 
                      alt="Vikram Shah" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-pink-300 px-3 py-1 rounded-full whitespace-nowrap">
                    <span className="text-pink-700 font-semibold text-sm">Vikram Shah</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Descriptions - Desktop */}
            <div className="space-y-8 flex flex-col justify-center">
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-3">
                  1: <span className="text-pink-700">Vikram Shah</span> is our founder and product design specialist.
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm">
                  With over 12 years of experience in the intimate apparel industry, Vikram has a keen eye for quality and comfort. He works closely with manufacturers to ensure every piece meets the highest standards of craftsmanship. His expertise in fabric technology and ergonomic design has helped Sweety Intimates create products that truly prioritize women's comfort and confidence.
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-gray-900 mb-3">
                  2: <span className="text-pink-700">Rajesh Kumar</span> is our operations manager and customer experience lead.
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm">
                  Rajesh brings a decade of retail and e-commerce experience to our team. He oversees our supply chain, inventory management, and ensures smooth order fulfillment. More importantly, Rajesh is passionate about customer satisfaction and personally reviews feedback to continuously improve our service. His dedication to understanding customer needs has shaped our sizing guides and product recommendations. You can always count on Rajesh and his team for expert fitting advice.
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-gray-900 mb-3">
                  3: <span className="text-pink-700">Arjun Mehta</span> is our digital marketing strategist and brand manager.
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm">
                  Arjun has a background in digital marketing and brand development with a special focus on women's fashion. He manages our online presence, creates engaging content, and builds meaningful connections with our community. Arjun handles our social media platforms, organizes promotional campaigns, and ensures our brand message of comfort and confidence reaches the right audience. His creative approach keeps our community informed and engaged.
                </p>
              </div>
            </div>
          </div>

          {/* Mobile Layout - Photo then Description */}
          <div className="lg:hidden space-y-12">
            {/* Vikram Shah */}
            <div className="flex flex-col items-center">
              <div className="relative mb-6">
                <div className="w-56 h-56 rounded-full overflow-hidden border-4 border-pink-300 shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face" 
                    alt="Vikram Shah" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-pink-300 px-4 py-1 rounded-full">
                  <span className="text-pink-700 font-semibold text-sm">Vikram Shah</span>
                </div>
              </div>
              <div className="text-center px-4">
                <h3 className="text-base font-bold text-gray-900 mb-3">
                  1: <span className="text-pink-700">Vikram Shah</span> is our founder and product design specialist.
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm">
                  With over 12 years of experience in the intimate apparel industry, Vikram has a keen eye for quality and comfort. He works closely with manufacturers to ensure every piece meets the highest standards of craftsmanship. His expertise in fabric technology and ergonomic design has helped Sweety Intimates create products that truly prioritize women's comfort and confidence.
                </p>
              </div>
            </div>

            {/* Rajesh Kumar */}
            <div className="flex flex-col items-center">
              <div className="relative mb-6">
                <div className="w-56 h-56 rounded-full overflow-hidden border-4 border-pink-300 shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face" 
                    alt="Rajesh Kumar" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-pink-300 px-4 py-1 rounded-full">
                  <span className="text-pink-700 font-semibold text-sm">Rajesh Kumar</span>
                </div>
              </div>
              <div className="text-center px-4">
                <h3 className="text-base font-bold text-gray-900 mb-3">
                  2: <span className="text-pink-700">Rajesh Kumar</span> is our operations manager and customer experience lead.
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm">
                  Rajesh brings a decade of retail and e-commerce experience to our team. He oversees our supply chain, inventory management, and ensures smooth order fulfillment. More importantly, Rajesh is passionate about customer satisfaction and personally reviews feedback to continuously improve our service. His dedication to understanding customer needs has shaped our sizing guides and product recommendations. You can always count on Rajesh and his team for expert fitting advice.
                </p>
              </div>
            </div>

            {/* Arjun Mehta */}
            <div className="flex flex-col items-center">
              <div className="relative mb-6">
                <div className="w-56 h-56 rounded-full overflow-hidden border-4 border-pink-300 shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face" 
                    alt="Arjun Mehta" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-pink-300 px-4 py-1 rounded-full">
                  <span className="text-pink-700 font-semibold text-sm">Arjun Mehta</span>
                </div>
              </div>
              <div className="text-center px-4">
                <h3 className="text-base font-bold text-gray-900 mb-3">
                  3: <span className="text-pink-700">Arjun Mehta</span> is our digital marketing strategist and brand manager.
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm">
                  Arjun has a background in digital marketing and brand development with a special focus on women's fashion. He manages our online presence, creates engaging content, and builds meaningful connections with our community. Arjun handles our social media platforms, organizes promotional campaigns, and ensures our brand message of comfort and confidence reaches the right audience. His creative approach keeps our community informed and engaged.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Services Section */}
      <div className="px-6 py-16 bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-pink-700 text-center mb-16">OUR SERVICES</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Size Guide & Fitting Help */}
            <div className="bg-white rounded-3xl p-8 shadow-lg text-center hover:shadow-xl transition-shadow">
              <div className="w-20 h-20 mx-auto mb-6 bg-pink-200 rounded-2xl flex items-center justify-center">
                <div className="w-12 h-12 bg-pink-300 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-pink-700 mb-4">Size Guide & Fitting Help</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Get personalized assistance with our comprehensive size guides and virtual fitting consultations. Our experts help you find the perfect fit for your body type, ensuring maximum comfort and confidence in every piece you choose.
              </p>
            </div>

            {/* Premium Quality Products */}
            <div className="bg-white rounded-3xl p-8 shadow-lg text-center hover:shadow-xl transition-shadow">
              <div className="w-20 h-20 mx-auto mb-6 bg-pink-200 rounded-2xl flex items-center justify-center">
                <div className="relative">
                  <div className="w-3 h-3 bg-pink-600 rounded-full"></div>
                  <div className="w-8 h-2 bg-pink-300 rounded-full mt-1"></div>
                  <div className="w-6 h-2 bg-pink-300 rounded-full mt-1"></div>
                  <div className="w-10 h-2 bg-pink-300 rounded-full mt-1"></div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-pink-700 mb-4">Premium Quality Products</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Discover our curated collection of high-quality intimate wear made from breathable, skin-friendly fabrics. From everyday essentials to special occasion pieces, each product is designed with your comfort and style in mind.
              </p>
            </div>

            {/* Customer Support */}
            <div className="bg-white rounded-3xl p-8 shadow-lg text-center hover:shadow-xl transition-shadow">
              <div className="w-20 h-20 mx-auto mb-6 bg-pink-200 rounded-2xl flex items-center justify-center">
                <svg className="w-12 h-12 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-pink-700 mb-4">Customer Support</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Our dedicated team is always ready to assist you with product queries, order tracking, returns, and exchanges. We're committed to ensuring your shopping experience is smooth, secure, and satisfying from start to finish.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;