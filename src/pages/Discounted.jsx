import React, { useState, useEffect } from 'react';
import ExperienceService from '../Admin_Pages/ExperienceService';
import ExperienceGrid from '../components/ExperienceGrid';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const Discounted = () => {
  const [discountedExperiences, setDiscountedExperiences] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDiscountedExperiences = async () => {
      try {
        setIsLoading(true);
        const data = await ExperienceService.getDiscountedExperiences();
        setDiscountedExperiences(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching discounted experiences:', err);
        setError('Failed to load discounted experiences. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiscountedExperiences();
  }, []);

  const handleExperienceClick = (experience) => {
    // Navigate to experience details or handle the click as needed
    console.log('Experience clicked:', experience);
  };

  // Page animation variants
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { duration: 0.5 }
    },
    exit: { opacity: 0 }
  };

  return (
    <motion.div
      className="container mx-auto px-6 py-14"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Set page title using document.title */}
      {useEffect(() => {
        document.title = "Discounted Experiences | Ceylonnow";
      }, [])}

      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Special Offers & Discounts</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Explore our best-value experiences with exclusive discounts. Limited time offers on unforgettable Sri Lankan adventures.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
          <span className="ml-2 text-gray-600">Loading discounted experiences...</span>
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : (
        <ExperienceGrid
          title="Discounted Experiences"
          subtitle=""
          experiences={discountedExperiences}
          layout="grid"
          columns={4}
          showPrice={true}
          showViewDetails={true}
          onExperienceClick={handleExperienceClick}
          isViewAll={true}
        />
      )}

      {!isLoading && !error && discountedExperiences.length === 0 && (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <h3 className="text-2xl font-bold text-gray-700 mb-2">No Discounted Experiences</h3>
          <p className="text-gray-600">
            There are currently no discounted experiences available. Please check back later!
          </p>
        </div>
      )}

      <div className="mt-16 bg-red-50 rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-red-800 mb-3">How Discounts Work</h2>
        <p className="text-gray-700 mb-4">
          Our discounts provide real savings on selected experiences across Sri Lanka. All discounted prices are clearly marked, showing both the original price and your savings.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-bold text-lg mb-2 text-red-700">Limited Time</h3>
            <p className="text-gray-600">All discounts are available for a limited time only. Book soon to avoid disappointment.</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-bold text-lg mb-2 text-red-700">Best Price Guarantee</h3>
            <p className="text-gray-600">We guarantee you won't find these experiences at a lower price elsewhere.</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-bold text-lg mb-2 text-red-700">No Hidden Fees</h3>
            <p className="text-gray-600">The price you see is the price you pay. No additional charges at checkout.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Discounted;