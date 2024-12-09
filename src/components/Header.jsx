import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // Add animation

const Header = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 py-20"> {/* Increased padding */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16"> {/* Increased gap */}
        {/* Left side - Text Content */}
        <motion.div 
          className="flex flex-col justify-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-6xl font-bold mb-6 leading-tight"> {/* Increased size and spacing */}
            Experience Sri Lanka
            <br />
            <span className="flex items-center gap-2">
              like never{' '}
              <span className="italic text-red-600">before!</span> {/* Added color */}
            </span>
          </h1>
          
          <p className="text-gray-600 mb-10 text-lg leading-relaxed"> {/* Enhanced text */}
            Discover the incredible wonders of Sri Lanka, from ancient temples
            to pristine beaches. Let us guide you through unforgettable
            experiences in this tropical paradise!
          </p>

          <div className="flex items-center space-x-6"> {/* Increased spacing */}
            <motion.button 
              onClick={() => navigate('/viewall')}
              className="bg-red-600 text-white px-10 py-4 rounded-full uppercase text-sm tracking-wider hover:bg-red-700 transition-all duration-300 flex items-center shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Now
            </motion.button>
            <motion.div 
              className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center cursor-pointer"
              whileHover={{ scale: 1.1, backgroundColor: '#FEE2E2' }}
            >
              <svg
                className="w-6 h-6 text-red-500"
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
            </motion.div>
          </div>
        </motion.div>

        {/* Right side - Image Grid */}
        <motion.div 
          className="relative"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid grid-cols-2 gap-6"> {/* Increased gap */}
            {/* Main large image */}
            <div className="col-span-2 overflow-hidden rounded-2xl shadow-xl"> {/* Enhanced shadow and rounded corners */}
              <motion.img
                src="https://www.holidify.com/images/bgImages/SIGIRIYA.jpg"
                alt="Sigiriya Rock Fortress"
                className="w-full h-80 object-cover hover:scale-105 transition-transform duration-700"
                whileHover={{ scale: 1.05 }}
              />
            </div>
            
            {/* Two smaller images */}
            <div className="overflow-hidden rounded-xl shadow-lg"> {/* Added shadow */}
              <motion.img
                src="https://media-cdn.tripadvisor.com/media/photo-s/16/7e/f8/66/temple-of-the-sacred.jpg"
                alt="Temple of the Sacred Tooth Relic"
                className="w-full h-48 object-cover hover:scale-105 transition-transform duration-700"
                whileHover={{ scale: 1.05 }}
              />
              <p className="mt-3 text-sm font-medium text-gray-700 px-2"> {/* Enhanced text */}
                Temple of the Sacred Tooth
                <br />
                <span className="text-red-600">Kandy, Sri Lanka</span>
              </p>
            </div>
            <div className="overflow-hidden rounded-xl shadow-lg"> {/* Added shadow */}
              <motion.img
                src="https://srilankabasecamp.com/wp-content/uploads/2024/02/exciting_wildlife_adventure_awaits.jpg"
                alt="Yala National Park"
                className="w-full h-48 object-cover hover:scale-105 transition-transform duration-700"
                whileHover={{ scale: 1.05 }}
              />
              <p className="mt-3 text-sm font-medium text-gray-700 px-2"> {/* Enhanced text */}
                Yala National Park
                <br />
                <span className="text-red-600">Sri Lanka</span>
              </p>
            </div>

            {/* Navigation arrows */}
            <motion.button 
              className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
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
            </motion.button>
            <motion.button 
              className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
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
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Header;