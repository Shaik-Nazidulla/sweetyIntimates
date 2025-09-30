// src/pages/Blogs.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllBlogs,
  selectBlogs,
  selectBlogsLoading,
  selectBlogsError
} from "../Redux/slices/blogsSlice";
import { X, Calendar, ArrowRight, Clock } from "lucide-react";

const Blogs = () => {
  const dispatch = useDispatch();
  const blogs = useSelector(selectBlogs);
  const loading = useSelector(selectBlogsLoading);
  const error = useSelector(selectBlogsError);

  const [overlay, setOverlay] = useState({ open: false, blog: null });
  const [imageLoaded, setImageLoaded] = useState({});

  useEffect(() => {
    dispatch(getAllBlogs());
  }, [dispatch]);

  const openOverlay = (blog) => {
    setOverlay({ open: true, blog });
    document.body.style.overflow = 'hidden';
  };
  
  const closeOverlay = () => {
    setOverlay({ open: false, blog: null });
    document.body.style.overflow = 'unset';
  };

  const handleImageLoad = (blogId) => {
    setImageLoaded(prev => ({ ...prev, [blogId]: true }));
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-pink-600 text-lg font-semibold">Loading articles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl border-2 border-red-200 shadow-xl max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => dispatch(getAllBlogs())}
            className="mt-6 px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full hover:shadow-lg transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-20 px-4 md:px-8 lg:px-16">
        {/* Header */}
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4 animate-fadeIn">
            Our Blog
          </h1>
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
            Discover insights, tips, and stories from Sweety Intimate
          </p>
        </div>

        {/* Blog Grid */}
        <div className="max-w-7xl mx-auto">
          {blogs.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No articles available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog, index) => (
                <article
                  key={blog._id}
                  className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                  onClick={() => openOverlay(blog)}
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    animation: 'fadeInUp 0.6s ease-out forwards'
                  }}
                >
                  {/* Image Container */}
                  <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-pink-100 to-purple-100">
                    {!imageLoaded[blog._id] && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 border-3 border-pink-400 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                    <img
                      src={blog.blogImgUrl?.url}
                      alt={blog.title}
                      className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
                        imageLoaded[blog._id] ? 'opacity-100' : 'opacity-0'
                      }`}
                      onLoad={() => handleImageLoad(blog._id)}
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Hover Icon */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 transform scale-75 group-hover:scale-100 transition-transform duration-300 shadow-xl">
                        <ArrowRight className="w-6 h-6 text-pink-600" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Date */}
                    <div className="flex items-center text-pink-600 text-sm font-medium mb-3">
                      <Calendar className="w-4 h-4 mr-2" />
                      <time>
                        {new Date(blog.createdAt).toLocaleDateString('en-US', {
                          day: 'numeric', 
                          month: 'long', 
                          year: 'numeric'
                        })}
                      </time>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-pink-600 transition-colors duration-300">
                      {blog.title}
                    </h3>

                    {/* Read More Button */}
                    <div className="flex items-center text-pink-600 font-semibold group-hover:gap-2 transition-all">
                      <span>Read More</span>
                      <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modal Overlay */}
      {overlay.open && overlay.blog && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="relative bg-white rounded-2xl max-w-6xl w-full shadow-2xl animate-slideIn overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Close Button */}
            <button
              onClick={closeOverlay}
              className="absolute top-4 right-4 z-10 text-gray-600 hover:text-gray-900 transition-colors duration-300 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[60vh] flex-1">
              {/* Left: Image */}
              <div className="relative overflow-hidden bg-gradient-to-br from-pink-100 to-purple-100">
                <img
                  src={overlay.blog.blogImgUrl?.url}
                  alt={overlay.blog.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Right: Content */}
              <div className="p-8 lg:p-12 overflow-y-auto bg-white">
                {/* Date */}
                <div className="flex items-center text-pink-600 text-sm font-medium mb-6">
                  <Calendar className="w-4 h-4 mr-2" />
                  <time>
                    {new Date(overlay.blog.createdAt).toLocaleDateString('en-US', {
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric'
                    })}
                  </time>
                </div>
                
                {/* Title */}
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8 leading-tight">
                  {overlay.blog.title}
                </h2>
                
                {/* Content */}
                <div
                  className="prose prose-lg max-w-none text-gray-700 leading-relaxed prose-headings:text-gray-900 prose-headings:font-bold prose-a:text-pink-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-p:mb-4"
                  dangerouslySetInnerHTML={{
                    __html: overlay.blog.blogContent?.markup || overlay.blog.content
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        
        .animate-slideIn {
          animation: slideIn 0.4s ease-out;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  );
};

export default Blogs;