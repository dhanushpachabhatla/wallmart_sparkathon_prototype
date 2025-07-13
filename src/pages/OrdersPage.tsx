import React, { useState } from 'react';
import { Package, Truck, Clock, CheckCircle, MapPin, Calendar } from 'lucide-react';
import { Order } from '../types';

const OrdersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

  // Mock orders data
  const mockOrders: Order[] = [
    {
      id: 'ORD-001',
      items: [],
      total: 47.83,
      status: 'shipped',
      orderDate: new Date('2024-01-15'),
      deliveryDate: new Date('2024-01-17'),
      trackingNumber: 'WM1234567890'
    },
    {
      id: 'ORD-002',
      items: [],
      total: 23.45,
      status: 'processing',
      orderDate: new Date('2024-01-16')
    },
    {
      id: 'ORD-003',
      items: [],
      total: 156.78,
      status: 'delivered',
      orderDate: new Date('2024-01-10'),
      deliveryDate: new Date('2024-01-12')
    }
  ];

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'processing': return <Package className="w-5 h-5 text-blue-500" />;
      case 'shipped': return <Truck className="w-5 h-5 text-purple-500" />;
      case 'delivered': return <CheckCircle className="w-5 h-5 text-green-500" />;
      default: return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'processing': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'shipped': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'delivered': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const activeOrders = mockOrders.filter(order => order.status !== 'delivered');
  const orderHistory = mockOrders.filter(order => order.status === 'delivered');

  const currentOrders = activeTab === 'active' ? activeOrders : orderHistory;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-8 lg:pl-64">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Deliveries & Orders</h1>
          <p className="text-gray-600">Track your orders and manage deliveries</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('active')}
            className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'active'
                ? 'bg-white text-[#0071ce] shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Active Orders ({activeOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'history'
                ? 'bg-white text-[#0071ce] shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Order History ({orderHistory.length})
          </button>
        </div>

        {/* Delivery Optimization Banner */}
        {activeTab === 'active' && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Truck className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Eco-Friendly Delivery</h3>
                <p className="text-gray-600">
                  Choose consolidated delivery slots to reduce carbon footprint and save on delivery fees.
                </p>
              </div>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Optimize Schedule
              </button>
            </div>
          </div>
        )}

        {/* Orders List */}
        <div className="space-y-4">
          {currentOrders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {activeTab === 'active' ? 'No Active Orders' : 'No Order History'}
              </h3>
              <p className="text-gray-600 mb-4">
                {activeTab === 'active'
                  ? 'You don\'t have any active orders at the moment.'
                  : 'Your past orders will appear here.'}
              </p>
              <button className="px-6 py-2 bg-[#0071ce] text-white rounded-lg hover:bg-blue-700 transition-colors">
                Start Shopping
              </button>
            </div>
          ) : (
            currentOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Order Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(order.status)}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Order {order.id}</h3>
                        <p className="text-sm text-gray-600">
                          Placed on {order.orderDate.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-[#0071ce]">${order.total.toFixed(2)}</p>
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </div>
                    </div>
                  </div>

                  {/* Delivery Info */}
                  {order.deliveryDate && (
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {order.status === 'delivered' ? 'Delivered' : 'Expected'}: {order.deliveryDate.toLocaleDateString()}
                        </span>
                      </div>
                      {order.trackingNumber && (
                        <div className="flex items-center space-x-2">
                          <Package className="w-4 h-4" />
                          <span>Tracking: {order.trackingNumber}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Order Progress */}
                {order.status !== 'delivered' && (
                  <div className="p-6">
                    <div className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">Order Progress</span>
                        <span className="text-sm text-gray-600">
                          {order.status === 'pending' && '25%'}
                          {order.status === 'processing' && '50%'}
                          {order.status === 'shipped' && '75%'}
                          {order.status === 'delivered' && '100%'}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-[#0071ce] h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${
                              order.status === 'pending' ? '25' :
                              order.status === 'processing' ? '50' :
                              order.status === 'shipped' ? '75' : '100'
                            }%` 
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-2 text-xs text-gray-500">
                        <span>Confirmed</span>
                        <span>Processing</span>
                        <span>Shipped</span>
                        <span>Delivered</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="bg-gray-50 px-6 py-4">
                  <div className="flex flex-wrap gap-3">
                    <button className="px-4 py-2 bg-[#0071ce] text-white rounded-lg hover:bg-blue-700 transition-colors">
                      View Details
                    </button>
                    {order.trackingNumber && (
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        Track Package
                      </button>
                    )}
                    {order.status === 'delivered' && (
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        Reorder Items
                      </button>
                    )}
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      Receipt
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Schedule Delivery</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Choose your preferred delivery time slots and optimize for eco-friendly options.
            </p>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Manage Schedule
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Delivery Addresses</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Manage your delivery locations and set default preferences.
            </p>
            <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Edit Addresses
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <Truck className="w-5 h-5 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Delivery Preferences</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Set your delivery preferences and notification settings.
            </p>
            <button className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
              Update Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;