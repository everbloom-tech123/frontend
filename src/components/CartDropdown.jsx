import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaTrash, FaPlus, FaMinus, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import { X } from 'lucide-react';

const CartDropdown = ({ onClose }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const loadCartItems = () => {
      const storedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
      const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
      const currentTime = Date.now();
      const filteredItems = storedCartItems.filter(item => {
        return !item.addedAt || (currentTime - item.addedAt) < TWENTY_FOUR_HOURS;
      });

      if (filteredItems.length !== storedCartItems.length) {
        localStorage.setItem('cartItems', JSON.stringify(filteredItems));
      }

      setCartItems(filteredItems);
    };

    loadCartItems();
    const cleanupInterval = setInterval(loadCartItems, 60 * 60 * 1000);
    return () => clearInterval(cleanupInterval);
  }, []);

  const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  const handleRemoveItem = (itemId) => {
    const updatedItems = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
  };

  const handleUpdateQuantity = (itemId, newQuantity) => {
    const updatedItems = cartItems.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
  };

  if (cartItems.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="absolute right-0 mt-2 w-80 z-50 bg-white rounded-md shadow-lg py-4 px-2"
      >
        <div className="flex justify-between items-center mb-4 px-2">
          <h3 className="font-bold text-gray-700">Your Cart</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="text-center py-8">
          <FaShoppingCart className="mx-auto text-gray-300 text-4xl mb-3" />
          <p className="text-gray-500">Your cart is empty</p>
          <Link
            to="/viewall"
            className="mt-4 inline-block text-sm text-red-600 hover:text-red-700"
            onClick={onClose}
          >
            Browse experiences
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="absolute right-0 mt-2 w-96 z-50 bg-white rounded-md shadow-lg py-4 px-2"
    >
      <div className="flex justify-between items-center mb-4 px-2">
        <h3 className="font-bold text-gray-700">Your Cart ({cartItems.length})</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="w-4 h-4" />
          </button>
      </div>

      <div className="max-h-80 overflow-y-auto px-2">
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-start py-3 border-b border-gray-100">
            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="h-full w-full object-cover object-center"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/150?text=Experience';
                }}
              />
            </div>
            <div className="ml-4 flex-1">
              <h3 className="text-sm font-medium text-gray-900">{item.title}</h3>
              <p className="text-xs text-gray-500 mb-1">${item.price.toFixed(2)}</p>

              {item.location && (
                <div className="flex items-center text-xs text-gray-500 mb-1">
                  <FaMapMarkerAlt className="mr-1 text-red-500" size={10} />
                  <span>{item.location}</span>
                </div>
              )}
              {item.duration && (
                <div className="flex items-center text-xs text-gray-500 mb-1">
                  <FaClock className="mr-1 text-blue-500" size={10} />
                  <span>{item.duration}</span>
                </div>
              )}

              <div className="flex items-center mt-2">
                <button
                  onClick={() => handleUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                  className="text-gray-500 hover:text-red-600 p-1"
                  disabled={item.quantity <= 1}
                >
                  <FaMinus className="w-3 h-3" />
                </button>
                <span className="mx-2 text-sm">{item.quantity}</span>
                <button
                  onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                  className="text-gray-500 hover:text-red-600 p-1"
                >
                  <FaPlus className="w-3 h-3" />
                </button>
              </div>
            </div>
            <div className="ml-4 text-right">
              <p className="text-sm font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
              <button
                onClick={() => handleRemoveItem(item.id)}
                className="mt-1 text-red-500 hover:text-red-700"
              >
                <FaTrash className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 px-2">
        <div className="flex justify-between items-center font-medium mb-2">
          <span>Subtotal:</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>

        <div className="text-xs text-gray-500 mb-4">
          Taxes and shipping calculated at checkout
        </div>

        <Link
          to="/booking"
          className="block w-full bg-red-600 hover:bg-red-700 text-white text-center font-bold py-2 px-4 rounded-lg transition duration-300"
          onClick={onClose}
        >
          Checkout
        </Link>

        <button
          onClick={onClose}
          className="block w-full mt-2 border border-gray-300 text-gray-700 text-center font-medium py-2 px-4 rounded-lg hover:bg-gray-50 transition duration-300"
        >
          Continue Shopping
        </button>
      </div>
    </motion.div>
  );
};

export default CartDropdown;