import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../contexts/AppContext';

interface AddToListModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

const AddToListModal: React.FC<AddToListModalProps> = ({ isOpen, onClose, product }) => {
  const { smartLists, addToSmartList, createSmartList } = useApp();
  const [selectedListId, setSelectedListId] = useState(smartLists[0]?.id || '');
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');
  const [newListName, setNewListName] = useState('');
  const [showNewList, setShowNewList] = useState(false);

  if (!isOpen) return null;

  const handleAddToList = () => {
    if (selectedListId) {
      addToSmartList(selectedListId, product, quantity, note);
      onClose();
      setQuantity(1);
      setNote('');
    }
  };

  const handleCreateAndAdd = () => {
    if (newListName.trim()) {
      createSmartList(newListName.trim());
      // Get the new list ID (in a real app, this would return the ID)
      const newListId = Date.now().toString();
      addToSmartList(newListId, product, quantity, note);
      onClose();
      setNewListName('');
      setShowNewList(false);
      setQuantity(1);
      setNote('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Add to SmartList</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product Info */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <img
              src={product.image}
              alt={product.title}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 line-clamp-2">{product.title}</h3>
              <p className="text-lg font-bold text-[#0071ce]">${product.price.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="p-4 space-y-4">
          {/* List Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose SmartList
            </label>
            {!showNewList ? (
              <div className="space-y-2">
                <select
                  value={selectedListId}
                  onChange={(e) => setSelectedListId(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0071ce] focus:border-transparent"
                >
                  {smartLists.map((list) => (
                    <option key={list.id} value={list.id}>
                      {list.name} ({list.items.length} items)
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setShowNewList(true)}
                  className="flex items-center space-x-2 text-[#0071ce] text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New List</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Enter list name"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0071ce] focus:border-transparent"
                />
                <button
                  onClick={() => setShowNewList(false)}
                  className="text-gray-600 text-sm"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                -
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 text-center p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0071ce] focus:border-transparent"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Note (optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note..."
              rows={2}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0071ce] focus:border-transparent resize-none"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-gray-200 flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={showNewList ? handleCreateAndAdd : handleAddToList}
            disabled={showNewList ? !newListName.trim() : !selectedListId}
            className="flex-1 px-4 py-2 bg-[#0071ce] text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {showNewList ? 'Create & Add' : 'Add to List'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddToListModal;