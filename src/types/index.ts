export interface User {
  id: string;
  email: string;
  name: string;
  profileImage?: string;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  availability: 'in-stock' | 'limited' | 'out-of-stock';
  rating?: number;
  brand?: string;
  aisle?: string;
  category: string;
}

export interface SmartListItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  note?: string;
  priceAlert: boolean;
  addedAt: Date;
}

export interface SmartList {
  id: string;
  name: string;
  items: SmartListItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  items: SmartListItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  orderDate: Date;
  deliveryDate?: Date;
  trackingNumber?: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  productCards?: Product[];
  mapData?: StoreMapData;
}

export interface StoreMapData {
  storeId: string;
  layout: string;
  items: Array<{
    productId: string;
    aisle: string;
    coordinates: { x: number; y: number };
  }>;
  userLocation?: { x: number; y: number };
  path?: Array<{ x: number; y: number }>;
}

export interface Store {
  id: string;
  name: string;
  address: string;
  coordinates: { lat: number; lng: number };
  distance?: number;
}