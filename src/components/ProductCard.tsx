import React, { useState } from 'react';
import { Heart, ShoppingCart, Plus, Star } from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../contexts/AppContext';
import AddToListModal from './AddToListModal';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, compact = false }) => {
  const { addToCart } = useApp();
  const [isLiked, setIsLiked] = useState(false);
  const [showAddToList, setShowAddToList] = useState(false);

  const getAvailabilityColor = () => {
    switch (product.availability) {
      case 'in-stock': return 'text-green-600 bg-green-50';
      case 'limited': return 'text-yellow-600 bg-yellow-50';
      case 'out-of-stock': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getAvailabilityText = () => {
    switch (product.availability) {
      case 'in-stock': return 'In Stock';
      case 'limited': return 'Limited';
      case 'out-of-stock': return 'Out of Stock';
      default: return 'Unknown';
    }
  };

  return (
    <>
      <div className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ${compact ? 'p-3' : 'p-4'}`}>
        {/* Product Image */}
        <div className="relative mb-3">
          <img
            src={product.image}
            alt={product.title}
            className={`w-full object-cover rounded-lg ${compact ? 'h-32' : 'h-40'}`}
          />
          {product.originalPrice && product.originalPrice > product.price && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
              SALE
            </div>
          )}
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
          </button>
        </div>

        {/* Product Info */}
        <div className="space-y-2">
          <h3 className={`font-semibold text-gray-900 line-clamp-2 ${compact ? 'text-sm' : 'text-base'}`}>
            {product.title}
          </h3>

          {/* Price */}
          <div className="flex items-center space-x-2">
            <span className={`font-bold text-[#0071ce] ${compact ? 'text-lg' : 'text-xl'}`}>
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Availability */}
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor()}`}>
            {getAvailabilityText()}
          </div>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm text-gray-600">{product.rating.toFixed(1)}</span>
            </div>
          )}

          {/* Aisle Info */}
          {product.aisle && (
            <p className="text-xs text-gray-500">Aisle {product.aisle}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className={`flex space-x-2 ${compact ? 'mt-3' : 'mt-4'}`}>
          <button
            onClick={() => setShowAddToList(true)}
            className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 border border-[#0071ce] text-[#0071ce] rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">List</span>
          </button>
          <button
            onClick={() => addToCart(product)}
            disabled={product.availability === 'out-of-stock'}
            className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-[#0071ce] text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="text-sm font-medium">Cart</span>
          </button>
        </div>
      </div>

      <AddToListModal
        isOpen={showAddToList}
        onClose={() => setShowAddToList(false)}
        product={product}
      />
    </>
  );
};

export default ProductCard;