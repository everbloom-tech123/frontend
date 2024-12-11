import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

const ModernHero = () => {
  // Array of image sources
  const images = [
    "https://images.pexels.com/photos/14925309/pexels-photo-14925309.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",  // Replace with actual image URLs
    "https://images.pexels.com/photos/11267363/pexels-photo-11267363.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/3171815/pexels-photo-3171815.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Image rotation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative mx-auto max-w-7xl overflow-visible bg-white px-6 pt-6">
      <div className="relative mb-16">
        {/* Background Image Container with transition */}
        <div className="relative h-[550px] w-full overflow-visible rounded-[2rem]">
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Adventure ${index + 1}`}
              className={`absolute h-full w-full rounded-[2rem] object-cover transition-opacity duration-1000
                ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
            />
          ))}
          
          {/* Content Overlay */}
          <div className="absolute inset-0 rounded-[2rem] bg-black/20">
            {/* Hero Text */}
            <div className="flex h-full flex-col items-start justify-center p-10">
              <div className="max-w-xl space-y-4 animate-[fadeIn_1s_ease-out]">
                <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl animate-[slideDown_0.8s_ease-out]">
                  Life Is Adventure
                  <br />
                  Make The Best Of It
                </h1>
                <p className="text-base text-white/90 md:text-lg animate-[slideUp_0.8s_ease-out]">
                  Planning for a trip? we will organize your best trip with the best destination and
                  within the best budgets!
                </p>
              </div>
            </div>

            {/* Image Indicators */}
            <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 transform space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`h-2 w-2 rounded-full transition-all duration-300
                    ${index === currentImageIndex ? 'bg-white w-6' : 'bg-white/60'}`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Vertical 3D Image Card */}
            <div className="absolute right-10 top-10 w-44 animate-[fadeIn_1s_ease-out_0.3s] transform-gpu">
              <div className="group overflow-hidden rounded-[1.2rem] bg-white shadow-[8px_8px_24px_rgb(0,0,0,0.2),_-8px_-8px_20px_rgba(255,255,255,0.1)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[12px_12px_32px_rgb(0,0,0,0.25),_-8px_-8px_20px_rgba(255,255,255,0.1)]"
                   style={{
                     transform: 'perspective(1000px) rotateX(5deg)',
                   }}>
                <div className="relative h-68 w-full">
                  <img
                    src="https://images.pexels.com/photos/10642719/pexels-photo-10642719.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                    alt="Featured destination"
                    className="h-full w-full rounded-[1.2rem] object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute -bottom-2 left-0 right-0 h-6 rounded-b-[1.2rem] bg-white/90 backdrop-blur-sm"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Search Card */}
          <div className="absolute bottom-0 left-1/2 w-full max-w-2xl -translate-x-1/2 translate-y-1/2 px-6 animate-[floatUp_1s_ease-out]">
            <div className="group rounded-2xl bg-gray-900/95 p-8 shadow-[0_12px_24px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center space-x-6">
                  <Search className="h-6 w-6 text-gray-400 transition-transform duration-300 group-hover:scale-110" />
                  <input
                    type="text"
                    placeholder="Where would you like to go?"
                    className="w-full bg-transparent text-lg text-gray-200 placeholder-gray-400 focus:outline-none"
                  />
                </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideDown {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes floatUp {
          from { transform: translate(-50%, calc(50% + 20px)); opacity: 0; }
          to { transform: translate(-50%, 50%); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default ModernHero;