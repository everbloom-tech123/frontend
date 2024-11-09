import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, LayoutGrid, ListTodo, Users, Settings, HelpCircle, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';

const Sidebar = () => {
  const [isMinimized, setIsMinimized] = useState(false);

  const navItems = [
    { icon: Home, text: 'Home', link: '/' },
    { icon: LayoutGrid, text: 'Projects', link: '/projects' },
    { icon: ListTodo, text: 'Tasks', link: '/tasks' },
    { icon: Users, text: 'Team', link: '/team' },
    { icon: Settings, text: 'Settings', link: '/settings' },
    { icon: HelpCircle, text: 'Help & information', link: '/help' },
    { icon: LogOut, text: 'Log out', link: '/logout' },
  ];

  const toggleSidebar = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <aside 
      className={`
        bg-white h-screen flex flex-col justify-between shadow-xl rounded-r-3xl
        transition-all duration-300 ease-in-out
        ${isMinimized ? 'w-16' : 'w-64'}
      `}
    >
      <div>
        <div className={`p-4 flex items-center justify-between ${isMinimized ? 'justify-center' : ''}`}>
          {!isMinimized && <h1 className="text-2xl font-bold text-indigo-900">logip</h1>}
          <button 
            onClick={toggleSidebar} 
            className="p-2 rounded-full hover:bg-indigo-100 transition-colors duration-200"
          >
            {isMinimized ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
        <nav>
          <ul className="space-y-2 p-2">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link 
                  to={item.link} 
                  className={`
                    flex items-center py-3 px-4 rounded-xl transition-all duration-200
                    hover:bg-indigo-100 hover:shadow-md hover:-translate-y-0.5
                    text-gray-600 hover:text-indigo-900 group
                    ${index === 0 ? 'bg-indigo-100 text-indigo-900 font-semibold' : ''}
                    ${isMinimized ? 'justify-center' : ''}
                  `}
                >
                  <item.icon className={`w-5 h-5 ${isMinimized ? '' : 'mr-3'}`} />
                  {!isMinimized && (
                    <>
                      <span>{item.text}</span>
                      {(index === 1 || index === 2) && (
                        <span className="ml-auto text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">+</span>
                      )}
                    </>
                  )}
                  {isMinimized && (
                    <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {item.text}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className={`mt-auto p-2 ${isMinimized ? 'hidden' : ''}`}>
        <Link 
          to="/help" 
          className="flex items-center py-3 px-4 text-gray-600 hover:text-indigo-900 transition-colors duration-200"
        >
          <HelpCircle className="w-5 h-5 mr-3" />
          <span>Help & information</span>
        </Link>
        <Link 
          to="/logout" 
          className="flex items-center py-3 px-4 text-gray-600 hover:text-indigo-900 transition-colors duration-200"
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span>Log out</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;