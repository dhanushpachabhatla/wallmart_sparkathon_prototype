import React, { useState } from 'react';
import { User, Mail, Bell, Shield, CreditCard, MapPin, Settings, Edit3, Save, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  const [preferences, setPreferences] = useState({
    notifications: {
      priceAlerts: true,
      orderUpdates: true,
      promotions: false,
      wallyAI: true
    },
    dietary: {
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      dairyFree: false,
      nutFree: false
    },
    aiAssistant: {
      voiceEnabled: true,
      proactiveHelp: true,
      personalizedRecommendations: true
    }
  });

  const handleSaveProfile = () => {
    // In a real app, this would update the user profile
    console.log('Saving profile:', editedUser);
    setIsEditing(false);
  };

  const handlePreferenceChange = (category: string, key: string, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
  };

  const profileSections = [
    {
      id: 'personal',
      title: 'Personal Information',
      icon: User,
      content: (
        <div className="space-y-4">
          {isEditing ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editedUser.name}
                  onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0071ce] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={editedUser.email}
                  onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0071ce] focus:border-transparent"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleSaveProfile}
                  className="flex items-center space-x-2 px-4 py-2 bg-[#0071ce] text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedUser({ name: user?.name || '', email: user?.email || '' });
                  }}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center space-x-4">
                <img
                  src={user?.profileImage || `https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2`}
                  alt={user?.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{user?.name}</h3>
                  <p className="text-gray-600">{user?.email}</p>
                  <p className="text-sm text-green-600">Verified Account</p>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Edit3 className="w-5 h-5" />
                </button>
              </div>
            </>
          )}
        </div>
      )
    },
    {
      id: 'notifications',
      title: 'Notification Preferences',
      icon: Bell,
      content: (
        <div className="space-y-4">
          {Object.entries(preferences.notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">
                  {key === 'priceAlerts' && 'Price Alerts'}
                  {key === 'orderUpdates' && 'Order Updates'}
                  {key === 'promotions' && 'Promotions & Deals'}
                  {key === 'wallyAI' && 'WallyAI Suggestions'}
                </h4>
                <p className="text-sm text-gray-600">
                  {key === 'priceAlerts' && 'Get notified when items in your lists drop in price'}
                  {key === 'orderUpdates' && 'Receive updates about your order status'}
                  {key === 'promotions' && 'Special offers and promotional content'}
                  {key === 'wallyAI' && 'Personalized recommendations from WallyAI'}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => handlePreferenceChange('notifications', key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0071ce]"></div>
              </label>
            </div>
          ))}
        </div>
      )
    },
    {
      id: 'dietary',
      title: 'Dietary Restrictions',
      icon: Settings,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">
            Help us personalize your shopping experience by selecting your dietary preferences.
          </p>
          {Object.entries(preferences.dietary).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">
                  {key === 'vegetarian' && 'Vegetarian'}
                  {key === 'vegan' && 'Vegan'}
                  {key === 'glutenFree' && 'Gluten-Free'}
                  {key === 'dairyFree' && 'Dairy-Free'}
                  {key === 'nutFree' && 'Nut-Free'}
                </h4>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => handlePreferenceChange('dietary', key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0071ce]"></div>
              </label>
            </div>
          ))}
        </div>
      )
    },
    {
      id: 'ai-assistant',
      title: 'AI Assistant Behavior',
      icon: Settings,
      content: (
        <div className="space-y-4">
          {Object.entries(preferences.aiAssistant).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">
                  {key === 'voiceEnabled' && 'Voice Interaction'}
                  {key === 'proactiveHelp' && 'Proactive Assistance'}
                  {key === 'personalizedRecommendations' && 'Personalized Recommendations'}
                </h4>
                <p className="text-sm text-gray-600">
                  {key === 'voiceEnabled' && 'Enable voice commands and responses'}
                  {key === 'proactiveHelp' && 'Allow WallyAI to offer helpful suggestions'}
                  {key === 'personalizedRecommendations' && 'Receive recommendations based on your shopping history'}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => handlePreferenceChange('aiAssistant', key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0071ce]"></div>
              </label>
            </div>
          ))}
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-8 lg:pl-64">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Profile & Settings</h1>
          <p className="text-gray-600">Manage your account and preferences</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {profileSections.map((section) => {
            const IconComponent = section.icon;
            return (
              <div key={section.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[#0071ce] bg-opacity-10 rounded-full flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-[#0071ce]" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">{section.title}</h2>
                  </div>
                </div>
                <div className="p-6">
                  {section.content}
                </div>
              </div>
            );
          })}

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <button className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <CreditCard className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-900">Payment Methods</span>
              </button>
              <button className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <MapPin className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-900">Addresses</span>
              </button>
              <button className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Shield className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-900">Privacy & Security</span>
              </button>
            </div>
          </div>

          {/* Account Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Account</h2>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="font-medium text-gray-900">Download My Data</span>
                <p className="text-sm text-gray-600">Get a copy of your account data</p>
              </button>
              <button className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="font-medium text-gray-900">Deactivate Account</span>
                <p className="text-sm text-gray-600">Temporarily disable your account</p>
              </button>
              <button
                onClick={logout}
                className="w-full text-left px-4 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                <span className="font-medium">Sign Out</span>
                <p className="text-sm text-red-500">Sign out of your account</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;