import { Home, Calendar, BookOpen } from 'lucide-react';
import { useGlobalContext } from './GlobalProvider';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const pathfinder = {
    "/home": "Home",
    "/events": "Events",
  };
  const location = useLocation();
  
  const { user } = useGlobalContext();
  const [activeItem, setActiveItem] = useState(pathfinder[location.pathname]);

  const navItems = [
    { name: 'Home', icon: Home, href:"/home"},
    { name: 'Events', icon: Calendar, href:"/events" },
    { name: 'Bookings', icon: BookOpen, href:"/home" },
  ];

  return (
    <div className="bg-white shadow-sm">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-blue-600 font-bold text-xl">Dashboard</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link to={item.href}>
                <button
                  key={item.name}
                  className={`flex items-center px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    activeItem === item.name
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                  onClick={() => setActiveItem(item.name)}
                >
                  <Icon className="mr-1" size={18} />
                  {item.name}
                </button>
                </Link>
              );
            })}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
              <span className="sr-only">Open main menu</span>
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* User profile */}
          <div className="hidden md:flex items-center">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                  {user?.name.split(' ').map((name: string) => name[0]).join('')}
                </div>
              </div>
              <div className="ml-3">
                <div className="text-sm font-medium text-gray-700">{user?.name}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className="md:hidden hidden">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.name}
                href="#"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  activeItem === item.name
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => setActiveItem(item.name)}
              >
                <div className="flex items-center">
                  <Icon className="mr-3" size={20} />
                  {item.name}
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Navbar;