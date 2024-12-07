import React, { useState, useEffect } from 'react';
import CategoryService from '../Admin_Pages/CategoryService';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const data = await CategoryService.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      // Keep the loading state to show loading skeleton instead of error
    } finally {
      // Add a minimum delay to make loading less jarring
      setTimeout(() => setIsLoading(false), 300);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Loading skeleton that matches the final layout
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="space-y-3">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="h-12 bg-gray-100 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4">
        <div className="space-y-2">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
            >
              <span className="text-gray-800">
                {category.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;