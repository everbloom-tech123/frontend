import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch } from 'react-icons/fa';
import axios from 'axios';

const SearchBar = ({ searchOpen, setSearchOpen }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const searchProducts = async () => {
      if (query.trim()) {
        setIsLoading(true);
        setError(null);
        try {
          const response = await axios.get(`/public/api/products/search?query=${query}`);
          setResults(Array.isArray(response.data) ? response.data : []);
          setShowDropdown(true);
        } catch (error) {
          console.error('Search failed:', error);
          setError('An error occurred while searching. Please try again.');
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
        setShowDropdown(false);
      }
    };

    const timeoutId = setTimeout(searchProducts, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleItemClick = (product) => {
    if (product && product.id) {
      setShowDropdown(false);
      setQuery('');
      setSearchOpen(false);
      navigate(`/experience/${product.id}`);
    } else {
      console.error('Invalid product or product ID:', product);
    }
  };

  const truncateDescription = (description, maxLength = 100) => {
    if (description.length <= maxLength) return description;
    return description.substr(0, maxLength) + '...';
  };

  return (
    <motion.div
      ref={searchRef}
      initial={false}
      animate={searchOpen ? "open" : "closed"}
      variants={{
        open: { width: "300px" },
        closed: { width: "40px" }
      }}
      transition={{ duration: 0.3 }}
      className="relative h-10"
    >
      <motion.input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        className="w-full h-full pl-10 pr-4 rounded-full border border-ceylon-pink-300 focus:outline-none focus:ring-2 focus:ring-ceylon-pink-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: searchOpen ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setSearchOpen(!searchOpen)}
        className="absolute left-0 top-0 h-full px-3 flex items-center justify-center text-ceylon-pink-600"
      >
        <FaSearch />
      </motion.button>
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 bg-white rounded-md shadow-lg max-h-96 overflow-y-auto"
          >
            {isLoading ? (
              <div className="p-4 text-center">Loading...</div>
            ) : error ? (
              <div className="p-4 text-center text-red-500">{error}</div>
            ) : results.length > 0 ? (
              <div>
                {results.slice(0, 5).map((product) => (
                  <div
                    key={product.id}
                    className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
                    onClick={() => handleItemClick(product)}
                  >
                    <img
                      src={`/public/api/products/files/${product.firstImageUrl}`}
                      alt={product.title}
                      className="w-16 h-16 object-cover rounded-md mr-3"
                    />
                    <div>
                      <p className="text-sm font-medium">{product.title}</p>
                      <p className="text-xs text-gray-500">${product.price.toFixed(2)}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {truncateDescription(product.description)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">No results found</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SearchBar;