import React, { useState, useRef } from 'react';
import { Camera, Scan, ShoppingCart, X, Check, Plus } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Product } from '../types';

const SnapCheckoutPage: React.FC = () => {
  const { cart, addToCart, removeFromCart } = useApp();
  const [isScanning, setIsScanning] = useState(false);
  const [detectedProducts, setDetectedProducts] = useState<Product[]>([]);
  const [showDetectedModal, setShowDetectedModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock detected products
  const mockDetectedProducts: Product[] = [
    {
      id: 'detected-1',
      title: 'Coca-Cola Classic, 12 pack',
      price: 5.48,
      image: 'https://images.pexels.com/photos/50593/coca-cola-cold-drink-soft-drink-coke-50593.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2',
      availability: 'in-stock',
      rating: 4.5,
      aisle: '4',
      category: 'Beverages'
    },
    {
      id: 'detected-2',
      title: 'Doritos Nacho Cheese',
      price: 3.98,
      image: 'https://images.pexels.com/photos/6287523/pexels-photo-6287523.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2',
      availability: 'in-stock',
      rating: 4.3,
      aisle: '6',
      category: 'Snacks'
    }
  ];

  const handleCameraCapture = () => {
    // Simulate camera capture and product detection
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setDetectedProducts(mockDetectedProducts);
      setShowDetectedModal(true);
    }, 2000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simulate image processing
      setIsScanning(true);
      setTimeout(() => {
        setIsScanning(false);
        setDetectedProducts(mockDetectedProducts);
        setShowDetectedModal(true);
      }, 1500);
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, product) => total + product.price, 0);
  };

  const handleCheckout = () => {
    alert(`Checkout successful! Total: $${getTotalPrice().toFixed(2)}`);
    // In a real app, this would process the payment
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-8 lg:pl-64">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Snap & Checkout</h1>
          <p className="text-gray-600">Scan products to add them to your cart instantly</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Scanning Section */}
          <div className="space-y-6">
            {/* Camera View */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Scanner</h2>
              
              <div className="relative">
                {isScanning ? (
                  <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Scan className="w-16 h-16 text-[#0071ce] mx-auto mb-4 animate-pulse" />
                      <p className="text-[#0071ce] font-medium">Scanning for products...</p>
                      <div className="mt-4 flex justify-center">
                        <div className="w-8 h-8 border-4 border-[#0071ce] border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                    <div className="text-center">
                      <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">Point camera at products to scan</p>
                      <div className="space-y-3">
                        <button
                          onClick={handleCameraCapture}
                          className="block w-full px-6 py-3 bg-[#0071ce] text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Start Camera Scan
                        </button>
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="block w-full px-6 py-3 border border-[#0071ce] text-[#0071ce] rounded-lg hover:bg-blue-50 transition-colors"
                        >
                          Upload Photo
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Scan Tips */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">Scanning Tips</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Ensure good lighting for better detection</li>
                <li>• Keep products clearly visible in frame</li>
                <li>• Scan barcodes when possible for accuracy</li>
                <li>• Multiple products can be detected at once</li>
              </ul>
            </div>
          </div>

          {/* SmartCart Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">SmartCart</h2>
              <div className="flex items-center space-x-2">
                <ShoppingCart className="w-5 h-5 text-[#0071ce]" />
                <span className="font-medium text-[#0071ce]">{cart.length} items</span>
              </div>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-600">Start scanning products to add them here</p>
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {cart.map((product) => (
                    <div key={product.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">{product.title}</h4>
                        <p className="text-[#0071ce] font-bold">${product.price.toFixed(2)}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-semibold text-gray-900">Total:</span>
                    <span className="text-2xl font-bold text-[#0071ce]">${getTotalPrice().toFixed(2)}</span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Checkout Now
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Detected Products Modal */}
      {showDetectedModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Products Detected!</h2>
                <button
                  onClick={() => setShowDetectedModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4 space-y-4">
              {detectedProducts.map((product) => (
                <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{product.title}</h3>
                      <p className="text-lg font-bold text-[#0071ce]">${product.price.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">Aisle {product.aisle}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-[#0071ce] text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-200">
              <button
                onClick={() => setShowDetectedModal(false)}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Continue Scanning
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SnapCheckoutPage;