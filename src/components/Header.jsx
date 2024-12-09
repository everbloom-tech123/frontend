import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left side - Text Content */}
        <div className="flex flex-col justify-center">
          <h1 className="text-5xl font-bold mb-4">
            Make Beautiful Travel
            <br />
            <span className="flex items-center gap-2">
              in the <span className="italic">world!</span>
            </span>
          </h1>
          
          <p className="text-gray-500 mb-8">
            If diving has always been your dream, then you are in the right
            place. We will help your dreams come true by opening the
            wonderful in the world!
          </p>

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/explore')}
              className="bg-gray-800 text-white px-8 py-3 uppercase text-sm tracking-wider hover:bg-gray-700 transition-all duration-300 flex items-center"
            >
              Explore
            </button>
            <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-teal-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Right side - Image Grid */}
        <div className="relative">
          <div className="grid grid-cols-2 gap-4">
            {/* Main large image */}
            <div className="col-span-2">
              <img
                src="/images/building.jpg" // Replace with your actual image path
                alt="Historical Building"
                className="w-full h-80 object-cover rounded-lg"
              />
            </div>
            
            {/* Two smaller images */}
            <div>
              <img
                src="https://www.holidify.com/collections/beautiful-places-in-sri-lanka" // Replace with your actual image path
                alt="Spiral viaduct Brusio"
                className="w-full h-48 object-cover rounded-lg"
              />
              <p className="mt-2 text-sm text-gray-600">
                Spiral viaduct Brusio
                <br />
                Switzerland
              </p>
            </div>
            <div>
              <img
                src="https://www.seal-superyachts.com/superyacht-agent-sri-lanka/" // Replace with your actual image path
                alt="Golden Gate Bridge"
                className="w-full h-48 object-cover rounded-lg"
              />
              <p className="mt-2 text-sm text-gray-600">
                Golden Gate Bridge
                <br />
                France
              </p>
            </div>

            {/* Navigation arrows */}
            <button className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-teal-400 text-white rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-gray-800 text-white rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;