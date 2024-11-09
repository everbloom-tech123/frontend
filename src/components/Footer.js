import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white shadow-lg py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="text-xl font-bold text-red-600">Ceylon Bucket</span>
            <p className="text-gray-600 mt-2">© 2024 All rights reserved.</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/about" className="text-gray-600 hover:text-red-600 transition-colors">
              About Us
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-red-600 transition-colors">
              Contact
            </Link>
            <Link to="/privacy" className="text-gray-600 hover:text-red-600 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-600 hover:text-red-600 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;