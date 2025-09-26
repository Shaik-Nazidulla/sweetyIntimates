// AboutUs.jsx
import React from 'react';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-white to-pink-50">
      {/* Hero Section */}
      <div className="relative px-6 py-12 lg:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            {/* Left side - About Us Circle and Image */}
            <div className="relative flex-shrink-0">
              <div className="relative">
                {/* Main profile image */}
                <div className="w-64 h-64 rounded-full overflow-hidden border-8 border-white shadow-xl">
                  <img 
                    src="https://images.unsplash.com/photo-1594736797933-d0b22d8c7c3e?w=400&h=400&fit=crop&crop=face" 
                    alt="About Us" 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* About Us circular badge */}
                <div className="absolute -top-6 -left-6 w-36 h-36 bg-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl text-center leading-tight">
                    ABOUT US
                  </span>
                </div>
              </div>
            </div>

            {/* Right side - Mission Content */}
            <div className="flex-1 text-left">
              <div className="bg-pink-200 rounded-[2rem] p-8 lg:p-12 shadow-lg relative">
                <h2 className="text-purple-600 text-lg font-medium mb-4">Our Mission</h2>
                <h1 className="text-3xl lg:text-4xl font-bold text-purple-700 mb-6">
                  ARE YOU LOOKING FOR TUTORIAL VIDEOS?
                </h1>
                <p className="text-purple-600 text-lg leading-relaxed mb-8">
                  If you're looking to do more than watch a simple video, we're here for it! Our 
                  manager, Tess, eagerly awaits assisting you with any of your needs. So send us your 
                  ideas about events, brand partnerships, or if you have any feedback for us. We can't 
                  wait to hear from you!
                </p>
                
                {/* Social Media Icons */}
                <div className="flex justify-start space-x-4">
                  <a href="#" className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white hover:bg-purple-700 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                  <a href="#" className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white hover:bg-purple-700 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a href="#" className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white hover:bg-purple-700 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.098.119.112.224.083.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                    </svg>
                  </a>
                  <a href="#" className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white hover:bg-purple-700 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hair Highlight Section */}
      <div className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
            {/* Left side - Content */}
            <div className="flex-1">
              <h2 className="text-2xl lg:text-3xl font-bold text-purple-700 mb-6 leading-tight">
                HOW DO I KNOW WHETHER TO PICK A FULL HIGHLIGHT SERVICE OR A PARTIAL?
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                How do I make the distinction between full and partial? A good starting question is how "light" do 
                you want your hair to be at the end of the service. If it is an all over brightening you are definitely 
                going to want a full highlight, even if you want to do a more "ombre" look but are wanting it to be 
                a lot of brightness on the bottom of your hair that would be a full highlight service! A partial 
                highlight is for clients who have already been in for a full highlight appointment and want to cover 
                any regrowth that is on the crown of the head or if you want to do a more sun kissed look but 
                keeping your natural as being the main base color!
              </p>
            </div>

            {/* Right side - Image */}
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="w-80 h-80 rounded-full overflow-hidden border-4 border-pink-200 shadow-xl">
                  <img 
                    src="https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=400&fit=crop&crop=face" 
                    alt="Hair highlight example" 
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
          <h2 className="text-3xl font-bold text-purple-700 text-center mb-16">THE TEAMS</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Team Images */}
            <div className="flex flex-col items-center space-y-8">
              {/* Lisa Chen */}
              <div className="relative">
                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-pink-200 shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1594736797933-d0b22d8c7c3e?w=200&h=200&fit=crop&crop=face" 
                    alt="Lisa Chen" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-pink-300 px-4 py-1 rounded-full">
                  <span className="text-purple-700 font-semibold text-sm">Lisa Chen</span>
                </div>
              </div>

              {/* Maria Garcia */}
              <div className="relative lg:ml-16">
                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-pink-200 shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face" 
                    alt="Maria Garcia" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-pink-300 px-4 py-1 rounded-full">
                  <span className="text-purple-700 font-semibold text-sm">Maria Garcia</span>
                </div>
                {/* Pink circular background */}
                <div className="absolute -top-4 -right-4 w-32 h-32 bg-pink-200 rounded-full -z-10"></div>
              </div>

              {/* Sara Peter */}
              <div className="relative lg:-ml-8">
                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-pink-200 shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face" 
                    alt="Sara Peter" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-pink-300 px-4 py-1 rounded-full">
                  <span className="text-purple-700 font-semibold text-sm">Sara Peter</span>
                </div>
                {/* Pink circular background */}
                <div className="absolute -top-8 -left-8 w-24 h-24 bg-pink-200 rounded-full -z-10"></div>
              </div>
            </div>

            {/* Team Descriptions */}
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-bold text-purple-700 mb-3">
                  1: <span className="text-pink-500">Sara Peter</span> is one of our talented and experienced makeup artists.
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  She has been working in the beauty industry for over 10 years and has a passion for creating 
                  stunning looks for different occasions. She specializes in bridal, glam, and natural 
                  makeup styles. She also loves to teach and share her tips and tricks with our viewers.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-purple-700 mb-3">
                  2: <span className="text-pink-500">Lisa Chen</span> is our amazing and creative content writer.
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  She has a degree in journalism and a flair for writing engaging and informative articles. She covers topics 
                  such as makeup trends, product reviews, celebrity news, and more. She also edits and 
                  proofreads our content to ensure quality and accuracy. You can read her articles on 
                  our website and get inspired by her insights. Lisa Chen is a key member of our team 
                  and we appreciate her work.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-purple-700 mb-3">
                  3: <span className="text-pink-500">Maria Garcia</span> is our wonderful and friendly community manager.
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  She has a background in social media and customer service and a love for makeup and beauty. 
                  She manages our online platforms and interacts with our users. She answers 
                  questions, provides feedback, organizes contests, and hosts events. She also creates 
                  and posts original and fun content to keep our community engaged and entertained.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Services Section */}
      <div className="px-6 py-16 bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-purple-700 text-center mb-16">OUR SERVIS</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Video Tutorials */}
            <div className="bg-white rounded-3xl p-8 shadow-lg text-center hover:shadow-xl transition-shadow">
              <div className="w-20 h-20 mx-auto mb-6 bg-pink-200 rounded-2xl flex items-center justify-center">
                <div className="w-12 h-12 bg-pink-300 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-purple-700 mb-4">Video Tutorials</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Learn how to apply makeup for different occasions, skin types, and preferences. Our 
                video tutorials are easy to follow, fun to watch, and suitable for all levels of 
                experience
              </p>
              <button className="bg-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-purple-700 transition-colors">
                Read More
              </button>
            </div>

            {/* News Articles */}
            <div className="bg-white rounded-3xl p-8 shadow-lg text-center hover:shadow-xl transition-shadow">
              <div className="w-20 h-20 mx-auto mb-6 bg-pink-200 rounded-2xl flex items-center justify-center">
                <div className="relative">
                  <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                  <div className="w-8 h-2 bg-pink-300 rounded-full mt-1"></div>
                  <div className="w-6 h-2 bg-pink-300 rounded-full mt-1"></div>
                  <div className="w-10 h-2 bg-pink-300 rounded-full mt-1"></div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-purple-700 mb-4">News Articles</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Learn how to apply makeup for different occasions, skin types, and preferences. Our 
                video tutorials are easy to follow, fun to watch, and suitable for all levels of 
                experience
              </p>
              <button className="bg-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-purple-700 transition-colors">
                Read More
              </button>
            </div>

            {/* Community */}
            <div className="bg-white rounded-3xl p-8 shadow-lg text-center hover:shadow-xl transition-shadow">
              <div className="w-20 h-20 mx-auto mb-6 bg-pink-200 rounded-2xl flex items-center justify-center">
                <svg className="w-12 h-12 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-purple-700 mb-4">Community</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Learn how to apply makeup for different occasions, skin types, and preferences. Our 
                video tutorials are easy to follow, fun to watch, and suitable for all levels of 
                experience
              </p>
              <button className="bg-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-purple-700 transition-colors">
                Read More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;