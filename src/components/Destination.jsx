import React, { useState, useEffect } from 'react';
import { MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

const DestinationExplorer = ({ destinations }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const defaultDestinations = [
    {
      id: 1,
      country: 'Colombo',
      description: "Sri Lanka's urban hub with culture and commerce.",
      image: 'https://pbs.twimg.com/media/EElvb4TUUAALikF?format=jpg&name=large'
    },
    {
      id: 2,
      country: 'Gall',
      description: 'A historic coastal city with beaches and the iconic Galle Fort.',
      image: 'https://static.saltinourhair.com/wp-content/uploads/2016/11/23154307/galle-dutch-fort-sri-lanka-header-1440x1440.jpg'
    },
    {
      id: 3,
      country: 'Kandy',
      description: 'A cultural hub, home to the Sacred Temple of the Tooth.',
      image: 'https://twogetlost.com/wp-content/uploads/2019/10/5-days.jpg'
    },
    {
      id: 4,
      country: 'Nuwara Eliya',
      description: ' A scenic hill town known for tea estates and cool climates.',
      image: 'https://tripjive.com/wp-content/uploads/2024/10/Best-time-to-visit-Nuwara-Eliya-for-comfortable-weather.jpg'
    },
    {
      id: 5,
      country: 'Anuradhapura',
      description: 'Ancient city famed for sacred stupas and the Jaya Sri Maha Bodhi.',
      image: 'https://st2.depositphotos.com/1803840/8114/i/450/depositphotos_81144250-stock-photo-mahatupa-big-dagoba-in-anuradhapura.jpg'
    }
  ];

  const items = destinations || defaultDestinations;
  const extendedItems = [...items, ...items, ...items];

  const nextSlide = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const prevSlide = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        if (currentIndex >= items.length) {
          setCurrentIndex(0);
        } else if (currentIndex < 0) {
          setCurrentIndex(items.length - 1);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, items.length, isTransitioning]);

  return (
    <div className="w-full bg-[#FAF9F6] py-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-start">
          {/* Left Content Area */}
          <div className="w-1/3 h-[450px] flex flex-col justify-between px-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-6 h-6" strokeWidth={1.5} />
                <p className="text-xl" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                  Cherished your memories
                </p>
              </div>
              <h1 className="text-5xl font-extrabold mb-6 leading-tight tracking-tight">
                Explore the Best Locations
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                Discover Sri Lanka's top destinations, from ancient cities 
                and cultural landmarks to stunning beaches and lush tea plantations. 
                Visit the Temple of the Tooth in Kandy, the Sigiriya Rock Fortress, 
                and the colonial Galle Fort. Enjoy city life in Colombo, the cool climates of 
                Nuwara Eliya, and wildlife safaris in Yala. These locations offer 
                unforgettable experiences for every traveler.
              </p>
            </div>
          </div>

          {/* Right Section with Images and Navigation */}
          <div className="w-2/3 flex flex-col px-8">
            {/* Images Container */}
            <div className="relative overflow-hidden mb-8">
              <div 
                className="flex gap-6 transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(${-currentIndex * (320 + 24)}px)`
                }}
              >
                {extendedItems.map((destination, index) => (
                  <div 
                    key={`${destination.id}-${index}`}
                    className="relative w-80 h-[450px] shrink-0"
                    style={{
                      borderRadius: '130px',
                    }}
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center w-full h-full"
                      style={{ 
                        backgroundImage: `url(${destination.image})`,
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40" />
                    <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center p-8">
                      <h3 className="text-4xl font-bold mb-6">{destination.country}</h3>
                      <p className="text-lg px-4 leading-relaxed">
                        {destination.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-center gap-4">
              <button 
                onClick={prevSlide}
                className="w-12 h-12 rounded-full border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors duration-300"
                aria-label="Previous destination"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={nextSlide}
                className="w-12 h-12 rounded-full border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors duration-300"
                aria-label="Next destination"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationExplorer;