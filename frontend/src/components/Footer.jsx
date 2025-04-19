import React from "react";
import {
  Facebook,
  Twitter,
  Linkedin,
  Github,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className=" bg-[#1b2028] text-white py-20 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        
        {/* Brand + Description */}
        <div>
          <h2 className="text-2xl font-semibold mb-3 text-[#00FFA3]">NuroStock</h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            AI-powered stock forecasting tool that empowers your investment journey with confidence.
          </p>
          <div className="flex gap-3 mt-6">
            <a href="#" aria-label="Facebook"><Facebook size={20} className="text-gray-400 hover:text-white" /></a>
            <a href="#" aria-label="Twitter"><Twitter size={20} className="text-gray-400 hover:text-white" /></a>
            <a href="#" aria-label="LinkedIn"><Linkedin size={20} className="text-gray-400 hover:text-white" /></a>
            <a href="#" aria-label="GitHub"><Github size={20} className="text-gray-400 hover:text-white" /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col md:flex-row md:gap-16 text-sm">
          <div>
            <h3 className="text-base font-medium mb-3">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/" className="hover:text-white">Home</a></li>
              <li><a href="/stock-prediction" className="hover:text-white">Stock Prediction</a></li>
              <li><a href="/login" className="hover:text-white">Login</a></li>
              <li><a href="/register" className="hover:text-white">Register</a></li>
            </ul>
          </div>
          <div className="mt-6 md:mt-0">
            <h3 className="text-base font-medium mb-3">More</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/market-activity" className="hover:text-white">Market Activity</a></li>
              <li><a href="/portfolio" className="hover:text-white">Portfolio</a></li>
              <li><a href="/watchlist" className="hover:text-white">Watchlist</a></li>
            </ul>
          </div>
        </div>

        {/* Newsletter / Call to action */}
        <div>
          <h3 className="text-base font-medium mb-3">Stay Updated</h3>
          <p className="text-sm text-gray-400 mb-4 leading-relaxed">Get market tips and predictions in your inbox.</p>
          <form className="flex items-center gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="px-4 py-2.5 rounded-lg bg-gray-800 text-sm text-white border border-gray-700 w-full"
            />
            <button
              type="submit"
              className="bg-[#00FFA3] text-black text-sm font-medium px-4 py-2.5 rounded-lg hover:opacity-90"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-16 pt-6 text-center text-xs text-gray-500">
        © 2025 <span className="text-[#00FFA3] font-medium">NuroStock</span>. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
