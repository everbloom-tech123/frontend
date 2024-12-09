import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Header = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Left side - Text Content */}
        <motion.div 
          className="flex flex-col justify-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Experience Sri Lanka
            <br />
            <span className="flex items-center gap-2">
              like never <span className="text-red-600">before!</span>
            </span>
          </h1>
          
          <p className="text-gray-600 mb-8 text-base leading-relaxed">
            Discover the incredible wonders of Sri Lanka, from ancient temples
            to pristine beaches. Let us guide you through unforgettable
            experiences in this tropical paradise!
          </p>

          <div className="flex items-center space-x-6">
            <motion.button 
              onClick={() => navigate('/viewall')}
              className="bg-red-600 text-white px-8 py-3 rounded-full uppercase text-sm tracking-wider hover:bg-red-700 transition-all duration-300 flex items-center shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Now
            </motion.button>
          </div>
        </motion.div>

        {/* Right side - Image Grid */}
        <motion.div 
          className="relative"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid grid-cols-2 gap-6">
            {/* Main large image */}
            <div className="col-span-2 overflow-hidden rounded-2xl shadow-xl">
              <motion.img
                src="https://www.holidify.com/images/bgImages/SIGIRIYA.jpg"
                alt="Sigiriya Rock Fortress"
                className="w-full h-80 object-cover hover:scale-105 transition-transform duration-700"
                whileHover={{ scale: 1.05 }}
              />
            </div>
            
            {/* Two smaller images */}
            <div className="overflow-hidden rounded-xl shadow-lg">
              <motion.img
                src="https://media-cdn.tripadvisor.com/media/photo-s/16/7e/f8/66/temple-of-the-sacred.jpg"
                alt="Temple of the Sacred Tooth Relic"
                className="w-full h-48 object-cover hover:scale-105 transition-transform duration-700"
                whileHover={{ scale: 1.05 }}
              />
              <p className="mt-3 text-sm font-medium text-gray-700 px-2">
                Temple of the Sacred Tooth
                <br />
                <span className="text-red-600">Kandy, Sri Lanka</span>
              </p>
            </div>
            <div className="overflow-hidden rounded-xl shadow-lg">
              <motion.img
                src="https://srilankabasecamp.com/wp-content/uploads/2024/02/exciting_wildlife_adventure_awaits.jpg"
                alt="Yala National Park"
                className="w-full h-48 object-cover hover:scale-105 transition-transform duration-700"
                whileHover={{ scale: 1.05 }}
              />
              <p className="mt-3 text-sm font-medium text-gray-700 px-2">
                Yala National Park
                <br />
                <span className="text-red-600">Sri Lanka</span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Header;