import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryService from '../Admin_Pages/CategoryService';

const ITEMS_PER_PAGE = 7;

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const data = await CategoryService.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setTimeout(() => setIsLoading(false), 300);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const filteredAndPaginatedCategories = useMemo(() => {
    const filtered = categories.filter(category =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    return {
      displayedCategories: filtered.slice(startIndex, endIndex),
      totalPages: Math.ceil(filtered.length / ITEMS_PER_PAGE),
      totalResults: filtered.length
    };
  }, [categories, searchQuery, currentPage]);

  if (isLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <h2 className="text-xl font-semibold">Loading Categories</h2>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="h-14 bg-gray-100 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold mb-4">Categories</h2>
        
        <div className="relative">
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
          />
          <svg
            className="absolute right-3 top-2.5 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        
        <div className="mt-2 text-sm text-gray-500">
          Showing {filteredAndPaginatedCategories.displayedCategories.length} of {filteredAndPaginatedCategories.totalResults} categories
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-2">
          {filteredAndPaginatedCategories.displayedCategories.map((category) => (
            <div
              key={category.id}
              className="group relative overflow-hidden"
              onMouseEnter={() => setHoveredId(category.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => navigate(`/viewby/${category.id}`)}
            >
              <div
                className={`
                  flex items-center justify-between p-4 
                  rounded-lg cursor-pointer
                  transition-all duration-200 ease-in-out
                  ${hoveredId === category.id ? 'bg-blue-50' : 'bg-gray-50 hover:bg-gray-100'}
                `}
              >
                <div className="flex items-center gap-3">
                  <svg
                    className={`w-5 h-5 transition-colors duration-200 ${
                      hoveredId === category.id ? 'text-blue-500' : 'text-gray-400'
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                    />
                  </svg>
                  <span
                    className={`font-medium transition-colors duration-200 ${
                      hoveredId === category.id ? 'text-blue-700' : 'text-gray-700'
                    }`}
                  >
                    {category.name}
                  </span>
                </div>
                <ChevronIcon 
                  hoveredId={hoveredId} 
                  categoryId={category.id} 
                />
              </div>
            </div>
          ))}
        </div>

        {filteredAndPaginatedCategories.totalPages > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
              }`}
            >
              Previous
            </button>
            
            <div className="flex gap-1">
              {[...Array(filteredAndPaginatedCategories.totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`w-8 h-8 rounded-md ${
                    currentPage === index + 1
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, filteredAndPaginatedCategories.totalPages))}
              disabled={currentPage === filteredAndPaginatedCategories.totalPages}
              className={`px-3 py-1 rounded-md ${
                currentPage === filteredAndPaginatedCategories.totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Separate component for the chevron icon
const ChevronIcon = ({ hoveredId, categoryId }) => (
  <svg
    className={`w-5 h-5 transition-all duration-200 ${
      hoveredId === categoryId ? 'text-blue-500 translate-x-1' : 'text-gray-400'
    }`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
);

export default Categories;