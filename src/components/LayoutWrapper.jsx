import React from 'react';

const LayoutWrapper = ({ District, CitiesList }) => {
  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-3 gap-8">
        {/* Left Column - District Component */}
        <div className="col-span-1">
          <District />
        </div>

        {/* Middle Column - CitiesList Component */}
        <div className="col-span-1">
          <CitiesList />
        </div>

        {/* Right Column - Promotional Cards */}
        <div className="col-span-1 space-y-6">
          {/* Birthday Gifts Card */}
          <div className="bg-slate-800 rounded-lg overflow-hidden relative h-72">
            <div className="absolute inset-0 flex flex-col justify-center p-6 z-10">
              <h3 className="text-3xl font-bold text-white">Birthday Gifts</h3>
              <p className="text-lg text-white mt-2">BE A GIFT HERO.</p>
              <button className="mt-4 bg-white text-gray-900 px-6 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors duration-200 w-fit">
                Shop Now
              </button>
            </div>
            <div className="absolute right-0 top-0 w-1/2 h-full">
              <img 
                src="/api/placeholder/400/320"
                alt="Birthday gifts"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Family Days Out Card */}
          <div className="bg-pink-100 rounded-lg overflow-hidden relative h-72">
            <div className="absolute inset-0 flex flex-col justify-center p-6 z-10">
              <h3 className="text-3xl font-bold text-gray-900">Family Days Out</h3>
              <p className="text-lg text-gray-900 mt-2">DAYS TO REMEMBER</p>
              <button className="mt-4 bg-red-600 text-white px-6 py-2 rounded-md font-medium hover:bg-red-700 transition-colors duration-200 w-fit">
                Shop Now
              </button>
            </div>
            <div className="absolute right-0 top-0 w-1/2 h-full">
              <img 
                src="/api/placeholder/400/320"
                alt="Family days out"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayoutWrapper;