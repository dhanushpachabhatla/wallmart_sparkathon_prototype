import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SmartList, Product, Order, Store } from '../types';

interface AppContextType {
  smartLists: SmartList[];
  cart: Product[];
  orders: Order[];
  currentStore: Store | null;
  addToSmartList: (listId: string, product: Product, quantity?: number, note?: string) => void;
  removeFromSmartList: (listId: string, itemId: string) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  createSmartList: (name: string) => void;
  deleteSmartList: (listId: string) => void;
  setCurrentStore: (store: Store) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [smartLists, setSmartLists] = useState<SmartList[]>([
    {
      id: '1',
      name: 'Weekly Groceries',
      items: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
  
  const [cart, setCart] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentStore, setCurrentStore] = useState<Store | null>({
    id: '1',
    name: 'Walmart Supercenter - Downtown',
    address: '123 Main St, City, State 12345',
    coordinates: { lat: 40.7128, lng: -74.0060 },
    distance: 0.5
  });

  const addToSmartList = (listId: string, product: Product, quantity = 1, note?: string) => {
    setSmartLists(prev => prev.map(list => {
      if (list.id === listId) {
        const newItem = {
          id: Date.now().toString(),
          productId: product.id,
          product,
          quantity,
          note,
          priceAlert: false,
          addedAt: new Date()
        };
        return {
          ...list,
          items: [...list.items, newItem],
          updatedAt: new Date()
        };
      }
      return list;
    }));
  };

  const removeFromSmartList = (listId: string, itemId: string) => {
    setSmartLists(prev => prev.map(list => {
      if (list.id === listId) {
        return {
          ...list,
          items: list.items.filter(item => item.id !== itemId),
          updatedAt: new Date()
        };
      }
      return list;
    }));
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (!exists) {
        return [...prev, product];
      }
      return prev;
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(p => p.id !== productId));
  };

  const createSmartList = (name: string) => {
    const newList: SmartList = {
      id: Date.now().toString(),
      name,
      items: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setSmartLists(prev => [...prev, newList]);
  };

  const deleteSmartList = (listId: string) => {
    setSmartLists(prev => prev.filter(list => list.id !== listId));
  };

  const value = {
    smartLists,
    cart,
    orders,
    currentStore,
    addToSmartList,
    removeFromSmartList,
    addToCart,
    removeFromCart,
    createSmartList,
    deleteSmartList,
    setCurrentStore
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};