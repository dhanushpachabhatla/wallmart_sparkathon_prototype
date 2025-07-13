import React from 'react';
import { MapPin, Navigation, Store } from 'lucide-react';

interface StoreLocation {
  id: string;
  name: string;
  address: string;
  distance: number;
  hasItem: boolean;
  coordinates: { lat: number; lng: number };
}

interface StoreMapProps {
  productName: string;
  stores: StoreLocation[];
}

const StoreMap: React.FC<StoreMapProps> = ({ productName, stores }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center space-x-2 mb-4">
        <MapPin className="w-5 h-5 text-[#0071ce]" />
        <h3 className="font-semibold text-gray-900">Store Availability</h3>
      </div>
      
      {/* Mock Map View */}
      <div className="relative bg-gray-100 rounded-lg h-48 mb-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
          {/* Mock map background */}
          <div className="absolute inset-4">
            {/* Roads */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-300"></div>
            <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-gray-300"></div>
            
            {/* Store markers */}
            {stores.map((store, index) => (
              <div
                key={store.id}
                className={`absolute w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer transform hover:scale-110 transition-transform ${
                  store.hasItem ? 'bg-green-500' : 'bg-red-500'
                }`}
                style={{
                  left: `${20 + (index * 25)}%`,
                  top: `${30 + (index % 2) * 40}%`
                }}
                title={`${store.name} - ${store.hasItem ? 'In Stock' : 'Out of Stock'}`}
              >
                <Store className="w-3 h-3" />
              </div>
            ))}
            
            {/* User location */}
            <div className="absolute bottom-4 left-4 w-4 h-4 bg-blue-600 rounded-full border-2 border-white">
              <div className="absolute -top-1 -left-1 w-6 h-6 bg-blue-600 bg-opacity-30 rounded-full animate-ping"></div>
            </div>
          </div>
        </div>
        
        {/* Map controls */}
        <div className="absolute top-2 right-2 flex flex-col space-y-1">
          <button className="w-8 h-8 bg-white rounded shadow-md flex items-center justify-center text-gray-600 hover:bg-gray-50">
            +
          </button>
          <button className="w-8 h-8 bg-white rounded shadow-md flex items-center justify-center text-gray-600 hover:bg-gray-50">
            -
          </button>
        </div>
      </div>
      
      {/* Store List */}
      <div className="space-y-2">
        {stores.map((store) => (
          <div key={store.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${store.hasItem ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <div>
                <h4 className="font-medium text-gray-900">{store.name}</h4>
                <p className="text-sm text-gray-600">{store.distance} miles away</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-medium ${store.hasItem ? 'text-green-600' : 'text-red-600'}`}>
                {store.hasItem ? 'In Stock' : 'Out of Stock'}
              </span>
              {store.hasItem && (
                <button className="p-1 text-[#0071ce] hover:bg-blue-50 rounded">
                  <Navigation className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoreMap;