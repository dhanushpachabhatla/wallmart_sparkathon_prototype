import React from 'react';
import { Home, ListChecks as ListCheck, Camera, Bot, Truck, User } from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, onNavigate }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'smartlist', label: 'SmartList+', icon: ListCheck },
    { id: 'snap', label: 'Snap & Go', icon: Camera },
    { id: 'assistant', label: 'WallyAI', icon: Bot },
    { id: 'orders', label: 'Orders', icon: Truck },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:fixed lg:left-0 lg:top-0 lg:h-full lg:w-64 lg:bg-white lg:border-r lg:border-gray-200 lg:z-40">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-[#0071ce]">SmartCart+</h1>
          <p className="text-sm text-gray-600">Snap, Shop, Go</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all ${
                currentPage === id
                  ? 'bg-[#0071ce] text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="grid grid-cols-6 h-16">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`flex flex-col items-center justify-center space-y-1 transition-all ${
                currentPage === id
                  ? 'text-[#0071ce] bg-blue-50'
                  : 'text-gray-600'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default Navigation;