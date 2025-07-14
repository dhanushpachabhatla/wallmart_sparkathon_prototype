// src/pages/HomePage.tsx
import React, { useState } from 'react';
import { Search, Filter, TrendingUp, Heart, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const { smartLists, currentStore } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  // ... (mock data and handleCardClick function remain the same) ...
  const products: Product[] = [
    {
      id: '1',
      title: 'Great Value Whole Milk, 1 Gallon',
      price: 3.68,
      originalPrice: 4.28,
      image: 'https://images.pexels.com/photos/416946/pexels-photo-416946.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2',
      availability: 'in-stock',
      rating: 4.5,
      brand: 'Great Value',
      aisle: '12',
      category: 'Dairy'
    },
    {
      id: '2',
      title: 'Bananas, 3 lbs',
      price: 1.48,
      image: 'https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2',
      availability: 'in-stock',
      rating: 4.2,
      aisle: '1',
      category: 'Produce'
    },
    {
      id: '3',
      title: 'Wonder Classic White Bread',
      price: 1.28,
      image: 'https://images.pexels.com/photos/1586947/pexels-photo-1586947.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2',
      availability: 'limited',
      rating: 4.0,
      brand: 'Wonder',
      aisle: '8',
      category: 'Bakery'
    },
    {
      id: '4',
      title: 'Fresh Ground Beef, 80/20, 1 lb',
      price: 5.98,
      image: 'https://images.pexels.com/photos/361184/asparagus-steak-veal-steak-veal-361184.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2',
      availability: 'in-stock',
      rating: 4.3,
      aisle: '15',
      category: 'Meat'
    },
    {
      id: '5',
      title: 'Tide Laundry Detergent, 50 oz',
      price: 11.97,
      originalPrice: 13.97,
      image: 'https://images.pexels.com/photos/1121796/pexels-photo-1121796.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2',
      availability: 'in-stock',
      rating: 4.8,
      brand: 'Tide',
      aisle: '3',
      category: 'Household'
    },
    {
      id: '6',
      title: 'Organic Eggs, 12 count',
      price: 4.98,
      image: 'https://images.pexels.com/photos/162712/egg-white-food-protein-162712.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2',
      availability: 'out-of-stock',
      rating: 4.6,
      aisle: '12',
      category: 'Dairy'
    }
  ];

  const quickAccessCards = [
    { title: 'Start New SmartList', icon: '🧾', color: 'bg-blue-100 text-blue-700', action: 'smartlist' },
    { title: 'Snap & Checkout', icon: '📷', color: 'bg-green-100 text-green-700', action: 'snap' },
    { title: 'Ask WallyAI', icon: '🤖', color: 'bg-purple-100 text-purple-700', action: 'assistant' }
  ];

  const trendingCategories = [
    { name: 'Fresh Produce', image: 'https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg?auto=compress&cs=tinysrgb&w=200&h=150&dpr=2' },
    { name: 'Dairy & Eggs', image: 'https://images.pexels.com/photos/164005/pexels-photo-164005.jpeg?auto=compress&cs=tinysrgb&w=200&h=150&dpr=2' },
    { name: 'Meat & Seafood', image: 'https://images.pexels.com/photos/361184/asparagus-steak-veal-steak-veal-361184.jpeg?auto=compress&cs=tinysrgb&w=200&h=150&dpr=2' },
    { name: 'Bakery', image: 'https://images.pexels.com/photos/1586947/pexels-photo-1586947.jpeg?auto=compress&cs=tinysrgb&w=200&h=150&dpr=2' }
  ];

  const handleCardClick = (action: string) => {
    switch (action) {
      case 'smartlist':
        navigate('/smart-list');
        break;
      case 'snap':
        navigate('/snap-checkout');
        break;
      case 'assistant':
        navigate('/wally-ai');
        break;
      default:
        console.warn('Unknown action:', action);
    }
  };

  return (
    // REMOVE lg:pl-64 from here. This component should just be the page content.
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-8 lg:ml-60"> {/* Removed lg:pl-64 */}
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Hi {user?.name?.split(' ')[0] || 'there'} 👋
              </h1>
              <p className="text-gray-600">{currentStore?.name}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">SmartList Summary</p>
              <p className="text-lg font-bold text-[#0071ce]">
                {smartLists.reduce((total, list) => total + list.items.length, 0)} items
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products, brands, or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0071ce] focus:border-transparent"
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
            >
              <Filter className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Quick Access Cards */}
          <div className="grid grid-cols-3 gap-3">
            {quickAccessCards.map((card, index) => (
              <div
                key={index}
                className={`${card.color} p-4 rounded-lg text-center cursor-pointer hover:scale-105 transition-transform`}
                onClick={() => handleCardClick(card.action)}
              >
                <div className="text-2xl mb-1">{card.icon}</div>
                <p className="text-sm font-medium">{card.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Featured Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            <h2 className="text-xl font-bold text-gray-900">Featured Products</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* Trending Categories */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <h2 className="text-xl font-bold text-gray-900">Trending Categories</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {trendingCategories.map((category, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-32 object-cover"
                />
                <div className="p-3">
                  <h3 className="font-medium text-gray-900 text-center">{category.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Products */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Heart className="w-5 h-5 text-red-500" />
            <h2 className="text-xl font-bold text-gray-900">Recommended for You</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
            {products.slice(2).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;