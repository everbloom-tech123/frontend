import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaHeart, FaShoppingCart, FaUser, FaStar, FaGift, FaMoneyBillWave } from 'react-icons/fa';
import * as authService from '../services/AuthService';

const HomePage = () => {
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [hoveredRecipient, setHoveredRecipient] = useState(null);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const userData = JSON.parse(localStorage.getItem('user'));
    const isAuth = authService.isAuthenticated();
    
    if (isAuth && userData) {
      setUser(userData);
      // You can add role-specific content here
      if (userData.role === 'ROLE_ADMIN') {
        // Handle admin-specific content
      }
    }
    setLoading(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <motion.section 
        className="relative bg-cover bg-center h-screen pt-24"
        style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/Images/pxfuel.jpg)` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-4"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Ceylon Bucket
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl mb-8"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            Discover unforgettable adventures
          </motion.p>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <Link to="/experiences" className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 inline-block">
              Explore Experiences
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Featured Categories */}
        <motion.section 
          className="mb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Explore by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { title: 'Cultural Tours', icon: '🏛️', color: 'bg-red-100' },
              { title: 'Adventure', icon: '🏄‍♂️', color: 'bg-red-100' },
              { title: 'Culinary', icon: '🍛', color: 'bg-red-100' },
              { title: 'Wildlife', icon: '🐘', color: 'bg-red-100' },
            ].map((category, index) => (
              <motion.div 
                key={category.title}
                className={`${category.color} rounded-lg shadow-md p-6 text-center cursor-pointer transition duration-300 transform hover:scale-105`}
                variants={itemVariants}
                onMouseEnter={() => setHoveredCategory(index)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <span className="text-4xl mb-4 block">{category.icon}</span>
                <h3 className="text-lg font-semibold text-gray-800">{category.title}</h3>
                <AnimatePresence>
                  {hoveredCategory === index && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="mt-2 text-sm text-gray-600"
                    >
                      Click to explore
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Featured Experiences */}
        <motion.section 
          className="mb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Featured Experiences</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Tea Plantation Tour', image: '/path-to-image1.jpg', price: '$49', rating: 4.8 },
              { title: 'Whale Watching Adventure', image: '/path-to-image2.jpg', price: '$89', rating: 4.9 },
              { title: 'Ancient City Exploration', image: '/path-to-image3.jpg', price: '$69', rating: 4.7 },
            ].map((experience, index) => (
              <motion.div 
                key={experience.title}
                className="bg-white rounded-lg shadow-md overflow-hidden group"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <div className="relative">
                  <img src={experience.image} alt={experience.title} className="w-full h-48 object-cover" />
                  <div className="absolute top-0 right-0 bg-red-600 text-white px-2 py-1 m-2 rounded-md text-sm font-bold">
                    Best Seller
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{experience.title}</h3>
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-gray-600">Starting from {experience.price}</p>
                    <div className="flex items-center">
                      <FaStar className="text-yellow-400 mr-1" />
                      <span className="text-gray-600">{experience.rating}</span>
                    </div>
                  </div>
                  <Link to="/experience-details" className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full text-sm transition duration-300 inline-block">
                    View Details
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Shop by Recipient */}
        <motion.section 
          className="mb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Shop by Recipient</h2>
          <div className="flex flex-wrap justify-center gap-6">
            {[
              { title: 'For Couples', icon: '💑', color: 'bg-red-100' },
              { title: 'For Families', icon: '👨‍👩‍👧‍👦', color: 'bg-red-100' },
              { title: 'For Friends', icon: '🤝', color: 'bg-red-100' },
              { title: 'Solo Travelers', icon: '🏄‍♂️', color: 'bg-red-100' },
            ].map((recipient, index) => (
              <motion.div 
                key={recipient.title}
                className={`${recipient.color} rounded-full w-32 h-32 flex flex-col items-center justify-center cursor-pointer transition duration-300 transform hover:scale-110`}
                variants={itemVariants}
                onMouseEnter={() => setHoveredRecipient(index)}
                onMouseLeave={() => setHoveredRecipient(null)}
              >
                <span className="text-4xl mb-2">{recipient.icon}</span>
                <h3 className="text-sm font-semibold text-gray-800 text-center">{recipient.title}</h3>
                <AnimatePresence>
                  {hoveredRecipient === index && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      className="absolute -bottom-8 bg-white px-2 py-1 rounded-md shadow-md text-xs"
                    >
                      Explore gifts
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Shop by Price */}
        <motion.section 
          className="mb-16 bg-gradient-to-r from-red-100 to-red-200 rounded-lg shadow-md p-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Shop by Price</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {['Under $50', '$50 - $100', '$100 - $200', '$200+'].map((priceRange) => (
              <motion.button
                key={priceRange}
                className="bg-white text-gray-800 font-semibold py-2 px-4 rounded-full shadow-md hover:bg-gray-100 transition duration-300"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {priceRange}
              </motion.button>
            ))}
          </div>
        </motion.section>

        {/* Shop by Occasion */}
        <motion.section 
          className="mb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Shop by Occasion</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Birthday Gifts', image: '/path-to-birthday-image.jpg' },
              { title: 'Anniversary Gifts', image: '/path-to-anniversary-image.jpg' },
              { title: 'Wedding Gifts', image: '/path-to-wedding-image.jpg' },
            ].map((occasion, index) => (
              <motion.div 
                key={occasion.title}
                className="relative overflow-hidden rounded-lg shadow-md group cursor-pointer"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <img src={occasion.image} alt={occasion.title} className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-end p-6">
                  <h3 className="text-white text-xl font-semibold mb-2">{occasion.title}</h3>
                  <button className="bg-white text-gray-800 py-2 px-4 rounded-full text-sm font-semibold transition duration-300 hover:bg-gray-100">
                    Show all
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Why Choose Us */}
        <motion.section 
          className="mb-16 bg-white rounded-lg shadow-md p-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Why Choose Virgin Experience?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Unique Experiences', icon: '🌟', description: 'Curated selection of unforgettable adventures' },
              { title: 'Local Expertise', icon: '🌍', description: 'Led by local guides who know the ins and outs' },
              { title: 'Safety First', icon: '🔒', description: 'Your safety is our top priority' },
            ].map((reason) => (
              <motion.div 
                key={reason.title}
                className="text-center p-6"
                variants={itemVariants}
              >
                <span className="text-4xl mb-4 block">{reason.icon}</span>
                <h3 className="text-lg font-semibold text-gray-800">{reason.title}</h3>
                <p className="text-gray-600 mt-2">{reason.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Customer Reviews */}
        <motion.section 
          className="mb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'John D.', review: 'Amazing experience! The tea plantation tour was unforgettable.', rating: 5 },
              { name: 'Sarah M.', review: 'The whale watching adventure exceeded my expectations. Highly recommended!', rating: 5 },
              { name: 'Alex K.', review: 'Great service and knowledgeable guides. Will definitely book again!', rating: 4 },
            ].map((review, index) => (
              <motion.div 
                key={index}
                className="bg-white rounded-lg shadow-md p-6"
                variants={itemVariants}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{review.name}</h3>
                    <div className="flex">
                      {[...Array(review.rating)].map((_, i) => (
                        <FaStar key={i} className="text-yellow-400 mr-1" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">{review.review}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Newsletter Signup */}
        <motion.section 
          className="mb-16 bg-red-600 text-white rounded-lg shadow-md p-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-3xl font-bold mb-4 text-center">Stay Updated</h2>
          <p className="text-center mb-6">Subscribe to our newsletter for exclusive offers and travel tips</p>
          <form className="flex justify-center">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="px-4 py-2 rounded-l-full w-64 focus:outline-none text-gray-800"
            />
            <button 
              type="submit" 
              className="bg-white text-red-600 hover:bg-gray-100 px-6 py-2 rounded-r-full font-semibold transition duration-300"
            >
              Subscribe
            </button>
          </form>
        </motion.section>
      </div>
    </div>
  );
};

export default HomePage;