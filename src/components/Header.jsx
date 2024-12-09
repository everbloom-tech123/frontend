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
            Experience Sri Lanka
            <br />
            <span className="flex items-center gap-2">
              like never <span className="italic">before!</span>
            </span>
          </h1>
          
          <p className="text-gray-500 mb-8">
            Discover the incredible wonders of Sri Lanka, from ancient temples
            to pristine beaches. Let us guide you through unforgettable
            experiences in this tropical paradise!
          </p>

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/explore')}
              className="bg-gray-800 text-white px-8 py-3 uppercase text-sm tracking-wider hover:bg-gray-700 transition-all duration-300 flex items-center"
            >
              Explore
            </button>
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-red-500"
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
                src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/33/fc/f0/sigiriya.jpg?w=1200&h=800"
                alt="Sigiriya Rock Fortress"
                className="w-full h-80 object-cover rounded-lg"
              />
            </div>
            
            {/* Two smaller images */}
            <div>
              <img
                src="https://www.srilankatravelandtourism.com/places-sri-lanka/kandy/kandy-images/kandy-7-sri-lanka.jpg"
                alt="Temple of the Sacred Tooth Relic"
                className="w-full h-48 object-cover rounded-lg"
              />
              <p className="mt-2 text-sm text-gray-600">
                Temple of the Sacred Tooth
                <br />
                Kandy, Sri Lanka
              </p>
            </div>
            <div>
              <img
                src="https://www.seek-safari.com/wp-content/uploads/2023/01/yala-national-park-sri-lanka.jpg"
                alt="Yala National Park"
                className="w-full h-48 object-cover rounded-lg"
              />
              <p className="mt-2 text-sm text-gray-600">
                Yala National Park
                <br />
                Sri Lanka
              </p>
            </div>

            {/* Navigation arrows */}
            <button className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-red-400 text-white rounded-full flex items-center justify-center">
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