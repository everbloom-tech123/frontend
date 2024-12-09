import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();
  
  const images = [
    {
      url: "https://www.holidify.com/images/bgImages/SIGIRIYA.jpg",
      title: "Temple of the Sacred Tooth",
      location: "Kandy, Sri Lanka"
    },
    {
      url: "https://media-cdn.tripadvisor.com/media/photo-s/16/7e/f8/66/temple-of-the-sacred.jpg",
      title: "Spiral viaduct Brusio",
      location: "Switzerland"
    },
    {
      url: "https://srilankabasecamp.com/wp-content/uploads/2024/02/exciting_wildlife_adventure_awaits.jpg",
      title: "Golden Gate Bridge",
      location: "France"
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const getImageIndex = (offset) => {
    return (activeIndex + offset + images.length) % images.length;
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
        {/* Left side - Text Content */}
        <motion.div 
          className="flex flex-col justify-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-6xl font-bold mb-8 leading-tight tracking-tight">
            Experience Sri Lanka
            <br />
            <span className="flex items-center gap-2 mt-2">
              like never <span className="text-red-600 font-extrabold">before!</span>
            </span>
          </h1>
          
          <p className="text-gray-600 mb-10 text-lg leading-relaxed font-light">
            Discover the incredible wonders of Sri Lanka, from ancient temples
            to pristine beaches. Let us guide you through unforgettable
            experiences in this tropical paradise!
          </p>

          <div className="flex items-center space-x-6">
            <motion.button 
              onClick={() => navigate('/viewall')}
              className="bg-red-600 text-white px-10 py-4 rounded-full uppercase text-sm tracking-widest hover:bg-red-700 transition-all duration-300 flex items-center shadow-lg hover:shadow-xl font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Now
            </motion.button>
          </div>
        </motion.div>

        {/* Right side - Image Gallery */}
        <motion.div 
          className="relative"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex space-x-8 relative px-12">
            {/* Navigation Buttons */}
            <button 
              onClick={handlePrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 bg-red-600 p-3 rounded-full z-10 shadow-lg hover:bg-red-700 transition-colors duration-300"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button 
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 bg-white p-3 rounded-full z-10 shadow-lg hover:bg-gray-50 transition-colors duration-300"
            >
              <ChevronRight className="w-6 h-6 text-red-600" />
            </button>

            {/* Main Image */}
            <motion.div 
              className="w-1/2"
              layoutId={`image-${activeIndex}`}
            >
              <img
                src={images[activeIndex].url}
                alt={images[activeIndex].title}
                className="w-full h-[32rem] object-cover rounded-2xl cursor-pointer shadow-xl"
              />
            </motion.div>
            
            {/* Side Images */}
            <motion.div 
              className="w-1/4"
              layoutId={`image-${getImageIndex(1)}`}
              onClick={() => setActiveIndex(getImageIndex(1))}
            >
              <div className="h-full">
                <img
                  src={images[getImageIndex(1)].url}
                  alt={images[getImageIndex(1)].title}
                  className="w-full h-96 object-cover rounded-2xl cursor-pointer shadow-lg hover:shadow-xl transition-shadow duration-300"
                />
                <p className="mt-4 text-sm font-medium">
                  <span className="text-gray-800 text-base font-semibold tracking-wide">
                    {images[getImageIndex(1)].title}
                  </span>
                  <br />
                  <span className="text-red-600 tracking-wide">{images[getImageIndex(1)].location}</span>
                </p>
              </div>
            </motion.div>
            <motion.div 
              className="w-1/4"
              layoutId={`image-${getImageIndex(2)}`}
              onClick={() => setActiveIndex(getImageIndex(2))}
            >
              <div className="h-full">
                <img
                  src={images[getImageIndex(2)].url}
                  alt={images[getImageIndex(2)].title}
                  className="w-full h-96 object-cover rounded-2xl cursor-pointer shadow-lg hover:shadow-xl transition-shadow duration-300"
                />
                <p className="mt-4 text-sm font-medium">
                  <span className="text-gray-800 text-base font-semibold tracking-wide">
                    {images[getImageIndex(2)].title}
                  </span>
                  <br />
                  <span className="text-red-600 tracking-wide">{images[getImageIndex(2)].location}</span>
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Header;