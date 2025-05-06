import React from 'react';
import { Menu, X } from 'lucide-react';
import ShoppingCart from './ShoppingCart';
import ProfileDropdown from './profileDropdown';

const RightSideIcons = ({
  user,
  dropdownOpen,
  setDropdownOpen,
  handleLogout,
  isMenuOpen,
  toggleMenu
}) => {
  return (
    <div className="flex items-center space-x-4 md:space-x-6">
      <ShoppingCart user={user} />
      
      <ProfileDropdown 
        user={user}
        dropdownOpen={dropdownOpen}
        setDropdownOpen={setDropdownOpen}
        handleLogout={handleLogout}
      />

      {/* Mobile Menu Button */}
      <button
        onClick={toggleMenu}
        className="md:hidden text-gray-700 hover:text-red-600 transition-colors duration-200"
      >
        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>
    </div>
  );
};

export default RightSideIcons;