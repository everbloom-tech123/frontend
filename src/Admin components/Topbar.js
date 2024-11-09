import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../services/AuthService';

const Topbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
    };
    
    fetchUser();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Admin Dashboard</h2>
        <div className="flex items-center space-x-4">
          {user && (
            <span className="font-semibold text-gray-700">
              Welcome, {user.username}!
            </span>
          )}
          <input
            type="text"
            placeholder="Search..."
            className="border rounded px-2 py-1"
          />
          <button
            onClick={handleLogout}
            className="bg-purple-600 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
