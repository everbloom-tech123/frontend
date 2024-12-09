import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Header = () => {
  const images = [
    {
      url: "https://www.travejar.com/images/uploads/customupload/Rhythm-and-Blues-Colombo.png",
      title: "Spiral viaduct Brusio",
      location: "Switzerland",
      explore: "explore →"
    },
    {
      url: "https://5.imimg.com/data5/VG/TT/VD/GLADMIN-7767282/ayurvedic-massage-500x500.jpg",
      title: "Temple of Sacred Tooth",
      location: "Kandy, Sri Lanka",
      explore: "explore →"
    },
    {
      url: "https://www.passportandpixels.com/wp-content/uploads/2022/02/Bentota-244_pp.jpg",
      title: "Golden Gate Bridge",
      location: "France",
      explore: "explore →"
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
    <div className="relative w-full overflow-hidden">
      <div className="max-w-[1400px] mx-auto relative">
        {/* Text Content - Positioned to overlap */}
        <div className="absolute z-10 top-20 left-8 max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-7xl font-bold mb-6 leading-tight">
              Make Beautiful <span className="font-extrabold">Travel</span>
              <br />
              <span className="text-5xl italic font-normal">in the world!</span>
            </h1>
            
            <p className="text-gray-600 mb-8 text-lg font-light leading-relaxed pr-12">
              If diving has always been your dream, then you are in the right
              place! We will help your dreams come true by sparking the
              wonderful in the world!
            </p>

            <button className="bg-gray-700 text-white px-8 py-3 rounded inline-flex items-center space-x-2 group">
              <span>EXPLORE</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </motion.div>
        </div>

        {/* Image Gallery - Full width section */}
        <div className="ml-auto w-[65%] pl-4">
          <div className="relative flex space-x-6">
            {/* Navigation Buttons */}
            <button 
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-red-500 p-2 rounded-md"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button 
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-md"
            >
              <ChevronRight className="w-6 h-6 text-red-500" />
            </button>

            {/* Main Image */}
            <motion.div 
              className="w-[60%] h-[600px]"
              layoutId={`image-${activeIndex}`}
            >
              <img
                src={images[activeIndex].url}
                alt={images[activeIndex].title}
                className="w-full h-full object-cover"
              />
            </motion.div>
            
            {/* Side Images with Minimal Info */}
            <div className="flex flex-col space-y-6 w-[40%]">
              {[1, 2].map((offset) => (
                <motion.div 
                  key={getImageIndex(offset)}
                  layoutId={`image-${getImageIndex(offset)}`}
                  onClick={() => setActiveIndex(getImageIndex(offset))}
                  className="relative group cursor-pointer"
                >
                  <img
                    src={images[getImageIndex(offset)].url}
                    alt={images[getImageIndex(offset)].title}
                    className="w-full h-[290px] object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
                    <p className="text-white text-lg font-light">
                      {images[getImageIndex(offset)].title}
                    </p>
                    <p className="text-gray-200 text-sm">
                      {images[getImageIndex(offset)].location}
                    </p>
                    <p className="text-gray-300 text-sm mt-1">
                      {images[getImageIndex(offset)].explore}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;