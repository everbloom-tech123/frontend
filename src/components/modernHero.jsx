import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ExperienceService from '../Admin_Pages/ExperienceService';
import SearchCard from './SearchCard.jsx';

const ModernHero = () => {
    // Array of background images for the carousel
    const images = [
        "https://images.pexels.com/photos/14925309/pexels-photo-14925309.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        "https://images.pexels.com/photos/11267363/pexels-photo-11267363.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        "https://images.pexels.com/photos/3171815/pexels-photo-3171815.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    ];

    // State management for component functionality
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    
    // Refs for managing search functionality and click outside behavior
    const searchRef = useRef(null);
    const searchTimeoutRef = useRef(null);
    const navigate = useNavigate();

    // Image carousel rotation effect
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 10000); // Rotate every 10 seconds

        return () => clearInterval(interval);
    }, []);

    // Search functionality with debouncing
    useEffect(() => {
        // Clear any existing timeout to prevent multiple searches
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        const performSearch = async () => {
            // Don't search if query is empty
            if (!searchQuery.trim()) {
                setSearchResults([]);
                setShowDropdown(false);
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                // Perform the search using the ExperienceService
                const results = await ExperienceService.searchExperiences(searchQuery);

                // Process and normalize the search results
                const processedResults = results.map(result => ({
                    id: result.id,
                    title: result.title,
                    description: result.description,
                    price: result.price,
                    discount: result.discount,
                    imageUrl: result.imageUrls?.[0] || null,
                    location: {
                        city: result.cityName,
                        district: result.districtName
                    },
                    tags: result.tags || [],
                    subcategories: result.subcategoryNames || [],
                    additionalInfo: result.additionalInfo,
                    special: result.special,
                    mostPopular: result.most_popular
                }));

                setSearchResults(processedResults);
                setShowDropdown(true);
            } catch (err) {
                console.error('Search failed:', err);
                setError('Failed to search experiences. Please try again.');
                setSearchResults([]);
            } finally {
                setIsLoading(false);
            }
        };

        // Set a timeout for debouncing
        searchTimeoutRef.current = setTimeout(performSearch, 300);

        // Cleanup function
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [searchQuery]);

    // Handle clicks outside the search component
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Handle experience selection
    const handleExperienceClick = (experience) => {
        if (!experience?.id) {
            console.error('Invalid experience object:', experience);
            return;
        }

        setShowDropdown(false);
        setSearchQuery('');
        navigate(`/experience/${experience.id}`);
    };

    // Handle search input changes with validation
    const handleSearchInputChange = (e) => {
        const value = e.target.value;
        if (value.length <= 100) { // Limit input length
            setSearchQuery(value);
        }
    };

    return (
        <div className="relative mx-auto overflow-visible bg-white px-4 sm:px-6 pt-4 sm:pt-6 pb-4">
            {/* Hero Section with Image Carousel */}
            <div className="relative mb-8 sm:mb-16">
                <div className="relative h-[400px] sm:h-[500px] w-full overflow-visible rounded-xl sm:rounded-[2rem]">
                    {/* Carousel Images */}
                    {images.map((img, index) => (
                        <img
                            key={index}
                            src={img}
                            alt={`Adventure ${index + 1}`}
                            className={`absolute h-full w-full rounded-xl sm:rounded-[2rem] object-cover transition-opacity duration-1000
                                ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
                        />
                    ))}

                    {/* Overlay with Hero Content */}
                    <div className="absolute inset-0 rounded-xl sm:rounded-[2rem] bg-black/20">
                        <div className="flex h-full flex-col items-start justify-center p-4 sm:p-10">
                            <div className="max-w-xl space-y-3 sm:space-y-4 animate-[fadeIn_1s_ease-out]">
                                <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight text-white animate-[slideDown_0.8s_ease-out]">
                                    Life Is Adventure
                                    <br className="hidden sm:block" />
                                    Make The Best Of It
                                </h1>
                                <p className="text-sm sm:text-base text-white/90 md:text-lg animate-[slideUp_0.8s_ease-out]">
                                    Planning for a trip? we will organize your best trip with the best destination and
                                    within the best budgets!
                                </p>
                            </div>
                        </div>

                        {/* Search Section */}
                        <div className="absolute bottom-0 left-1/2 w-full max-w-2xl -translate-x-1/2 translate-y-1/2 px-4 sm:px-6 animate-[floatUp_1s_ease-out]">
                            <div ref={searchRef} className="relative">
                                {/* Search Input Container */}
                                <motion.div
                                    className="group rounded-xl sm:rounded-2xl bg-gray-900/95 p-4 sm:p-8 shadow-[0_12px_24px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1"
                                    initial={false}
                                    animate={{ y: showDropdown && searchResults.length ? 0 : 0 }}
                                >
                                    <div className="flex items-center space-x-4 sm:space-x-6">
                                        <Search className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 transition-transform duration-300 group-hover:scale-110" />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={handleSearchInputChange}
                                            placeholder="Where would you like to go?"
                                            className="w-full bg-transparent text-base sm:text-lg text-gray-200 placeholder-gray-400 focus:outline-none"
                                        />
                                        {isLoading && (
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent"/>
                                        )}
                                    </div>
                                </motion.div>

                                {/* Search Results Dropdown */}
                                <AnimatePresence>
                                    {showDropdown && (searchResults.length > 0 || error || isLoading) && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-full left-0 right-0 mt-2 rounded-xl bg-gray-900/95 backdrop-blur-sm shadow-lg overflow-hidden z-50"
                                        >
                                            {isLoading ? (
                                                <div className="p-6 text-center text-gray-300">
                                                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-400 border-t-transparent mx-auto mb-2" />
                                                    Searching for adventures...
                                                </div>
                                            ) : error ? (
                                                <div className="p-6 text-center text-red-400">{error}</div>
                                            ) : (
                                                <div className="grid grid-cols-1 gap-4 p-4 max-h-[60vh] overflow-y-auto">
                                                    {searchResults.map((experience) => (
                                                        <SearchCard
                                                            key={experience.id}
                                                            experience={experience}
                                                            onClick={() => handleExperienceClick(experience)}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Animation Styles */}
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