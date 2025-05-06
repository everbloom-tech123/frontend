import React from 'react';
import { Link } from 'react-router-dom';
import NavbarCategories from './NavbarCategories';
import LocationDropdown from './LocationDropdown';

const NavLinks = ({ 
  categoriesOpen, 
  handleCategoriesEnter, 
  handleCategoriesLeave, 
  isLoadingCategories, 
  navbarCategories, 
  setCategoriesOpen,
  districtOpen,
  handleDistrictEnter,
  handleDistrictLeave
}) => {
  return (
    <div className="hidden md:flex items-center justify-between flex-1 pl-8">
      <div className="flex items-center space-x-8">
        <NavbarCategories 
          categoriesOpen={categoriesOpen}
          handleCategoriesEnter={handleCategoriesEnter}
          handleCategoriesLeave={handleCategoriesLeave}
          isLoadingCategories={isLoadingCategories}
          navbarCategories={navbarCategories}
          setCategoriesOpen={setCategoriesOpen}
        />

        <LocationDropdown
          districtOpen={districtOpen}
          handleDistrictEnter={handleDistrictEnter}
          handleDistrictLeave={handleDistrictLeave}
        />

        <Link
          to="/sales"
          className="text-sm font-bold tracking-wider text-gray-700 hover:text-red-600 transition-colors duration-200 flex items-center"
        >
          <span>Sales</span>
          <span className="ml-2 text-xs bg-red-600 text-white px-1.5 py-0.5 rounded-full font-bold">HOT</span>
        </Link>

        <Link
          to="/about-us"
          className="text-sm font-bold tracking-wider text-gray-700 hover:text-red-600 transition-colors duration-200"
        >
          About Us
        </Link>

        <Link
          to="/contact-us"
          className="text-sm font-bold tracking-wider text-gray-700 hover:text-red-600 transition-colors duration-200"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
};

export default NavLinks;