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
    <div className="relative w-full h-screen bg-gradient-to-br from-red-50 via-white to-gray-50">
      <div className="container mx-auto h-full px-4 lg:px-8 py-12 lg:py-24">
        <div className="relative flex flex-col lg:flex-row items-center justify-between h-full">
          {/* Left Content Section */}
          <div className="w-full lg:w-1/3 pr-0 lg:pr-12 space-y-6 lg:space-y-10 mb-8 lg:mb-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6 lg:space-y-8"
            >
              <h1 className="text-4xl lg:text-6xl font-black leading-tight text-gray-800">
                Make Beautiful
                <span className="text-red-500"> Travel</span>
                <br />
                <span className="text-2xl lg:text-4xl italic font-semibold mt-2 block">
                  in the world!
                </span>
              </h1>

              <p className="text-gray-600 text-base lg:text-lg font-medium leading-relaxed">
                If diving has always been your dream, then you are in the right
                place! We will help your dreams come true by sparking the
                wonderful in the world!
              </p>

              <button className="bg-red-500 text-white px-8 lg:px-12 py-4 lg:py-5 rounded-xl inline-flex items-center space-x-4 group hover:shadow-xl transition-all hover:bg-red-600 border border-red-400 transform hover:-translate-y-0.5">
                <span className="font-semibold text-base lg:text-lg">EXPLORE</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </motion.div>
          </div>

          {/* Right Gallery Section */}
          <div className="w-full lg:w-2/3 h-[50vh] lg:h-full lg:pl-12">
            <div className="relative flex lg:space-x-3 h-full">
              {/* Navigation Buttons */}
              <button
                onClick={handlePrev}
                className="absolute -left-3 lg:-left-6 top-1/2 -translate-y-1/2 z-20 bg-red-500 p-3 lg:p-4 rounded-xl shadow-lg hover:shadow-xl transition-all hover:bg-red-600 border border-red-400 transform hover:-translate-y-0.5"
              >
                <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </button>
              <button
                onClick={handleNext}
                className="absolute -right-3 lg:-right-6 top-1/2 -translate-y-1/2 z-20 bg-white p-3 lg:p-4 rounded-xl shadow-lg hover:shadow-xl transition-all hover:bg-gray-50 border border-gray-200 transform hover:-translate-y-0.5"
              >
                <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6 text-red-500" />
              </button>

              {/* Main Image */}
              <div className="w-full lg:w-2/3 h-full rounded-2xl overflow-hidden shadow-2xl relative">
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
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>
              </div>

              {/* Side Images - Hidden on mobile */}
              <div className="hidden lg:block w-1/3 h-full space-y-8">
                {[1, 2].map((offset) => (
                  <motion.div
                    key={getImageIndex(offset)}
                    layoutId={`image-${getImageIndex(offset)}`}
                    onClick={() => setActiveIndex(getImageIndex(offset))}
                    className="relative h-[calc(50%-1rem)] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all group cursor-pointer"
                  >
                    <img
                      src={images[getImageIndex(offset)].url}
                      alt={images[getImageIndex(offset)].title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
                      <p className="text-white text-lg font-bold">
                        {images[getImageIndex(offset)].title}
                      </p>
                      <p className="text-gray-200 text-base mt-1">
                        {images[getImageIndex(offset)].location}
                      </p>
                      <p className="text-gray-300 text-base mt-2 group-hover:text-red-300 transition-colors">
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
    </div>
  );
};

export default Header;