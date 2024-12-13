import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [[page, direction], setPage] = useState([0, 0]);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const handleNext = () => {
    setPage([page + 1, 1]);
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setPage([page - 1, -1]);
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const getImageIndex = (offset) => {
    return (activeIndex + offset + images.length) % images.length;
  };

  return (
    <div className="relative w-full overflow-hidden bg-white p-16">
      <div className="max-w-[1400px] mx-auto">
        {/* Main content container with enhanced 3D effect */}
        <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.05)] p-12 min-h-[650px] border border-gray-100 hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] transition-all transform hover:-translate-y-1">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-white to-gray-50 rounded-3xl opacity-50" />
          
          {/* Content wrapper with flex layout */}
          <div className="relative z-10 flex items-center justify-between">
            {/* Text Content */}
            <div className="w-[35%] pr-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-6xl font-black mb-8 leading-tight text-gray-800">
                  Make Beautiful <span className="text-red-500">Travel</span>
                  <br />
                  <span className="text-4xl italic font-semibold">in the world!</span>
                </h1>
                
                <p className="text-gray-600 mb-10 text-lg font-medium leading-relaxed">
                  If diving has always been your dream, then you are in the right
                  place! We will help your dreams come true by sparking the
                  wonderful in the world!
                </p>

                <button className="bg-red-500 text-white px-10 py-4 rounded-xl inline-flex items-center space-x-3 group hover:shadow-xl transition-all hover:bg-red-600 border border-red-400 transform hover:-translate-y-0.5">
                  <span className="font-semibold text-lg">EXPLORE</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </motion.div>
            </div>

            {/* Image Gallery */}
            <div className="w-[65%]">
              <div className="relative flex space-x-8">
                {/* Navigation Buttons */}
                <button 
                  onClick={handlePrev}
                  className="absolute -left-6 top-1/2 -translate-y-1/2 z-20 bg-red-500 p-3 rounded-xl shadow-lg hover:shadow-xl transition-all hover:bg-red-600 border border-red-400 transform hover:-translate-y-0.5"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button 
                  onClick={handleNext}
                  className="absolute -right-6 top-1/2 -translate-y-1/2 z-20 bg-white p-3 rounded-xl shadow-lg hover:shadow-xl transition-all hover:bg-gray-50 border border-gray-200 transform hover:-translate-y-0.5"
                >
                  <ChevronRight className="w-6 h-6 text-red-500" />
                </button>

                {/* Main Image */}
                <div className="w-[60%] h-[520px] rounded-2xl overflow-hidden shadow-xl relative ring-1 ring-gray-100 transform hover:-translate-y-1 transition-transform">
                  <AnimatePresence initial={false} custom={direction}>
                    <motion.img
                      key={page}
                      src={images[activeIndex].url}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 }
                      }}
                      className="w-full h-full object-cover absolute top-0 left-0"
                    />
                  </AnimatePresence>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                
                {/* Side Images */}
                <div className="flex flex-col space-y-8 w-[40%]">
                  {[1, 2].map((offset) => (
                    <motion.div 
                      key={getImageIndex(offset)}
                      layoutId={`image-${getImageIndex(offset)}`}
                      onClick={() => setActiveIndex(getImageIndex(offset))}
                      className="relative group cursor-pointer rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all border border-gray-100 hover:border-red-200 transform hover:-translate-y-1"
                    >
                      <img
                        src={images[getImageIndex(offset)].url}
                        alt={images[getImageIndex(offset)].title}
                        className="w-full h-[250px] object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/70 to-transparent">
                        <p className="text-white text-lg font-bold">
                          {images[getImageIndex(offset)].title}
                        </p>
                        <p className="text-gray-200 text-base font-medium">
                          {images[getImageIndex(offset)].location}
                        </p>
                        <p className="text-gray-300 text-base font-medium mt-1 group-hover:text-red-300 transition-colors">
                          {images[getImageIndex(offset)].explore}
                        </p>
                      </div>
                      <div className="absolute inset-0 bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;