import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Header = () => {
  const navigate = useNavigate();

  // Stagger animation for text
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 relative">
      {/* Fun background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-full -z-10 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-50 rounded-full -z-10 blur-3xl" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Left side - Text Content */}
        <motion.div 
          className="flex flex-col justify-center"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div 
            className="inline-block bg-gradient-to-r from-red-500 to-orange-500 text-transparent bg-clip-text"
            variants={item}
          >
            <h1 className="text-5xl font-bold mb-2">
              Experience Sri Lanka
            </h1>
          </motion.div>
          <motion.div 
            className="text-4xl font-bold mb-6 text-gray-800"
            variants={item}
          >
            like never before!
          </motion.div>
          
          <motion.p 
            className="text-gray-600 mb-8 text-lg leading-relaxed"
            variants={item}
          >
            Discover the incredible wonders of Sri Lanka, from ancient temples
            to pristine beaches. Let us guide you through unforgettable
            experiences in this tropical paradise! ✨
          </motion.p>

          <motion.div 
            className="flex items-center space-x-6"
            variants={item}
          >
            <motion.button 
              onClick={() => navigate('/viewall')}
              className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-4 rounded-xl uppercase text-sm tracking-wider transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Now
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Right side - Image Grid with Hover Effects */}
        <motion.div 
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid grid-cols-2 gap-6">
            {/* Main large image */}
            <div className="col-span-2 overflow-hidden rounded-2xl shadow-xl transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
              <motion.img
                src="https://www.holidify.com/images/bgImages/SIGIRIYA.jpg"
                alt="Sigiriya Rock Fortress"
                className="w-full h-80 object-cover transition-transform duration-700"
                whileHover={{ scale: 1.05 }}
              />
            </div>
            
            {/* Two smaller images with hover effects */}
            <div className="group overflow-hidden rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
              <motion.div className="relative">
                <motion.img
                  src="https://media-cdn.tripadvisor.com/media/photo-s/16/7e/f8/66/temple-of-the-sacred.jpg"
                  alt="Temple of the Sacred Tooth Relic"
                  className="w-full h-48 object-cover transition-transform duration-700"
                  whileHover={{ scale: 1.05 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
              <p className="mt-3 text-sm font-medium text-gray-700 px-3 py-2 bg-white/90 backdrop-blur-sm">
                Temple of the Sacred Tooth
                <br />
                <span className="text-red-500">Kandy, Sri Lanka</span>
              </p>
            </div>
            <div className="group overflow-hidden rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
              <motion.div className="relative">
                <motion.img
                  src="https://srilankabasecamp.com/wp-content/uploads/2024/02/exciting_wildlife_adventure_awaits.jpg"
                  alt="Yala National Park"
                  className="w-full h-48 object-cover transition-transform duration-700"
                  whileHover={{ scale: 1.05 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
              <p className="mt-3 text-sm font-medium text-gray-700 px-3 py-2 bg-white/90 backdrop-blur-sm">
                Yala National Park
                <br />
                <span className="text-red-500">Sri Lanka</span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Header;