import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Bell, TrendingDown, Calendar } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { SmartList } from '../types';
import StoreMap from '../components/StoreMap';
import PriceChart from '../components/PriceChart';
import StockTimeline from '../components/StockTimeline';

const SmartListPage: React.FC = () => {
  const { smartLists, deleteSmartList, createSmartList, removeFromSmartList } = useApp();
  const [selectedListId, setSelectedListId] = useState(smartLists[0]?.id || '');
  const [showNewListModal, setShowNewListModal] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const selectedList = smartLists.find(list => list.id === selectedListId);

  const handleCreateList = () => {
    if (newListName.trim()) {
      createSmartList(newListName.trim());
      setNewListName('');
      setShowNewListModal(false);
    }
  };

  // Mock store data
  const mockStores = [
    {
      id: '1',
      name: 'Walmart Supercenter - Downtown',
      address: '123 Main St, City, State',
      distance: 0.5,
      hasItem: true,
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    {
      id: '2',
      name: 'Walmart Neighborhood Market',
      address: '456 Oak Ave, City, State',
      distance: 1.2,
      hasItem: false,
      coordinates: { lat: 40.7589, lng: -73.9851 }
    },
    {
      id: '3',
      name: 'Walmart Supercenter - North',
      address: '789 Pine Rd, City, State',
      distance: 2.1,
      hasItem: true,
      coordinates: { lat: 40.7831, lng: -73.9712 }
    }
  ];

  const getTotalPrice = (list: SmartList) => {
    return list.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'in-stock': return 'text-green-600 bg-green-50';
      case 'limited': return 'text-yellow-600 bg-yellow-50';
      case 'out-of-stock': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-8 lg:pl-64">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">SmartList+</h1>
            <button
              onClick={() => setShowNewListModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-[#0071ce] text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>New List</span>
            </button>
          </div>

          {/* List Selector */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {smartLists.map((list) => (
              <button
                key={list.id}
                onClick={() => setSelectedListId(list.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedListId === list.id
                    ? 'bg-[#0071ce] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {list.name} ({list.items.length})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {selectedList ? (
          <>
            {/* List Header */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedList.name}</h2>
                  <p className="text-gray-600">
                    {selectedList.items.length} items • Total: ${getTotalPrice(selectedList).toFixed(2)}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Edit3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => deleteSmartList(selectedList.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Created</span>
                  </div>
                  <p className="text-blue-900 font-semibold">
                    {selectedList.createdAt.toLocaleDateString()}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <TrendingDown className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Savings</span>
                  </div>
                  <p className="text-green-900 font-semibold">
                    ${selectedList.items.reduce((total, item) => {
                      if (item.product.originalPrice) {
                        return total + ((item.product.originalPrice - item.product.price) * item.quantity);
                      }
                      return total;
                    }, 0).toFixed(2)}
                  </p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Bell className="w-5 h-5 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">Price Alerts</span>
                  </div>
                  <p className="text-yellow-900 font-semibold">
                    {selectedList.items.filter(item => item.priceAlert).length} Active
                  </p>
                </div>
              </div>
            </div>

            {/* List Items */}
            <div className="space-y-4">
              {selectedList.items.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                  <div className="text-gray-400 mb-4">
                    <Plus className="w-16 h-16 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No items in this list</h3>
                  <p className="text-gray-600 mb-4">Start adding products to build your SmartList</p>
                  <button className="px-6 py-2 bg-[#0071ce] text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Browse Products
                  </button>
                </div>
              ) : (
                selectedList.items.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-4">
                      <div className="flex items-center space-x-4">
                        <img
                          src={item.product.image}
                          alt={item.product.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{item.product.title}</h3>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          {item.note && (
                            <p className="text-sm text-blue-600 italic">Note: {item.note}</p>
                          )}
                          {item.product.aisle && (
                            <p className="text-sm text-gray-500">Aisle {item.product.aisle}</p>
                          )}
                          
                          {/* Delivery Estimate */}
                          <div className="mt-2 flex items-center space-x-4 text-sm">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4 text-green-600" />
                              <span className="text-green-600 font-medium">
                                {item.product.availability === 'in-stock' 
                                  ? 'Same-day delivery' 
                                  : item.product.availability === 'limited'
                                  ? 'Next-day delivery'
                                  : 'Delivery in 3-5 days'
                                }
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-lg font-bold text-[#0071ce]">
                              ${(item.product.price * item.quantity).toFixed(2)}
                            </span>
                            {item.product.originalPrice && (
                              <span className="text-sm text-gray-500 line-through">
                                ${(item.product.originalPrice * item.quantity).toFixed(2)}
                              </span>
                            )}
                          </div>
                          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(item.product.availability)}`}>
                            {item.product.availability.replace('-', ' ')}
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <button
                            onClick={() => {/* Toggle price alert */}}
                            className={`p-2 rounded-lg transition-colors ${
                              item.priceAlert
                                ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                            }`}
                          >
                            <Bell className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                            className="p-2 text-[#0071ce] hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <TrendingDown className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeFromSmartList(selectedList.id, item.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {expandedItem === item.id && (
                      <div className="border-t border-gray-200 p-4 bg-gray-50">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Store Map */}
                          <StoreMap 
                            productName={item.product.title}
                            stores={mockStores}
                          />
                          
                          {/* Price Chart */}
                          <PriceChart 
                            productName={item.product.title}
                            currentPrice={item.product.price}
                          />
                        </div>
                        
                        {/* Stock Timeline */}
                        <div className="mt-6">
                          <StockTimeline 
                            productName={item.product.title}
                            currentStock={item.product.availability}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No SmartLists found</h3>
            <p className="text-gray-600 mb-4">Create your first SmartList to get started</p>
            <button
              onClick={() => setShowNewListModal(true)}
              className="px-6 py-2 bg-[#0071ce] text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create SmartList
            </button>
          </div>
        )}
      </div>

      {/* New List Modal */}
      {showNewListModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New SmartList</h2>
              <input
                type="text"
                placeholder="Enter list name"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0071ce] focus:border-transparent mb-4"
                onKeyPress={(e) => e.key === 'Enter' && handleCreateList()}
              />
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowNewListModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateList}
                  disabled={!newListName.trim()}
                  className="flex-1 px-4 py-2 bg-[#0071ce] text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartListPage;