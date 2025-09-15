import { useEffect, useRef } from "react";
import { Facebook, Instagram, Youtube } from "lucide-react";
import gsap from "gsap";
import Logo from '/LOGO.png'

const Footer = () => {
  const footerRef = useRef(null);

  useEffect(() => {
    if (footerRef.current) {
      gsap.fromTo(
        footerRef.current.querySelectorAll(".footer-col"),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.2, duration: 0.8, ease: "power3.out" }
      );
    }
  }, []);

  return (
    <footer className="bg-gray-100 mt-8 md:mt-12">
      <div
        ref={footerRef}
        className="container mx-auto px-4 sm:px-6 lg:px-16 py-8 sm:py-10 md:py-12"
      >
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
          
          {/* Brand + Signup - Takes full width on mobile, spans 2 cols on sm screens */}
          <div className="footer-col sm:col-span-2 lg:col-span-1 flex flex-col gap-4 sm:gap-6">
            <img
              src={Logo}
              alt="Sweety Intimates"
              className="h-4 w-8 sm:h-5 sm:w-10"
            />

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Customer Services
              </h3>
              <button className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 border border-black rounded hover:bg-black hover:text-white transition text-xs sm:text-sm font-medium">
                SIGN UP TO STAY IN THE KNOW
              </button>
            </div>

            <div className="flex gap-4 mt-2">
              <Facebook className="w-5 h-5 cursor-pointer text-black hover:opacity-70 transition-opacity" />
              <Instagram className="w-5 h-5 cursor-pointer text-black hover:opacity-70 transition-opacity" />
              <Youtube className="w-5 h-5 cursor-pointer text-black hover:opacity-70 transition-opacity" />
            </div>
          </div>

          {/* Help */}
          <div className="footer-col">
            <h3 className="font-semibold text-black mb-3 sm:mb-4 tracking-wide uppercase text-xs sm:text-sm">
              HELP
            </h3>
            <ul className="space-y-1.5 sm:space-y-2">
              <li>
                <a href="#" className="text-gray-500 hover:text-black text-xs sm:text-sm transition-colors">
                  Customer Services
                </a>
              </li>
            </ul>
          </div>

          {/* Orders & Returns */}
          <div className="footer-col">
            <h3 className="font-semibold text-black mb-3 sm:mb-4 tracking-wide uppercase text-xs sm:text-sm">
              ORDERS & RETURNS
            </h3>
            <ul className="space-y-1.5 sm:space-y-2">
              <li>
                <a href="#" className="text-gray-500 hover:text-black text-xs sm:text-sm transition-colors">
                  Order Status
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-black text-xs sm:text-sm transition-colors">
                  Shipping Information
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-black text-xs sm:text-sm transition-colors">
                  Return Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-black text-xs sm:text-sm transition-colors">
                  Refund Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="footer-col">
            <h3 className="font-semibold text-black mb-3 sm:mb-4 tracking-wide uppercase text-xs sm:text-sm">
              SERVICES
            </h3>
            <ul className="space-y-1.5 sm:space-y-2">
              <li>
                <a href="#" className="text-gray-500 hover:text-black text-xs sm:text-sm transition-colors">
                  Store Offers & Events
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-black text-xs sm:text-sm transition-colors">
                  Store Location
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-black text-xs sm:text-sm transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-black text-xs sm:text-sm transition-colors">
                  Track Order
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-black text-xs sm:text-sm transition-colors">
                  Book an Appointment
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 py-3 sm:py-4 px-4 sm:px-6 lg:px-16 text-center sm:text-left">
        <p className="text-xs sm:text-sm text-gray-600 flex items-center justify-center sm:justify-start gap-2">
          <span>©</span> 2025 Sweety Intimates. All rights reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;