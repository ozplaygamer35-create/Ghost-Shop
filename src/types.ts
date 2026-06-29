export interface User {
  uid: string;
  name: string;
  lastname: string;
  email: string;
  phone: string;
  role: 'admin' | 'business' | 'delivery' | 'client';
  photoUrl?: string;
}

export interface BusinessProfile {
  name: string;
  description: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  schedule: string;
  category: string;
  logoUrl: string;
  coverUrl: string;
  paymentMethods: {
    nequi: boolean;
    daviplata: boolean;
    pse: boolean;
    creditCard: boolean;
    cash: boolean;
    bankTransfer: boolean;
  };
  taxPercentage: number;
  commissionPercentage: number;
}

export interface Product {
  id: string;
  image: string;
  name: string;
  description: string;
  category: string;
  price: number;
  discountPrice?: number;
  available: boolean;
  quantity: number;
  estimatedTime: string; // e.g. "20-30 min"
  status: 'active' | 'inactive';
}

export type OrderStatus =
  | 'received'     // Pedido recibido
  | 'preparing'    // Preparando
  | 'ready'        // Listo
  | 'assigned'     // Delivery asignado
  | 'delivering'   // En camino
  | 'delivered'    // Entregado
  | 'canceled';    // Cancelado

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  clientName: string;
  clientPhone: string;
  clientAddress: string;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  createdAt: string;
  deliveryPartnerId?: string;
  lat: number;
  lng: number;
}

export type DriverStatus = 'available' | 'busy' | 'offline';

export interface Driver {
  id: string;
  name: string;
  photo: string;
  status: DriverStatus;
  phone: string;
  rating: number;
  lat: number; // For map location simulation
  lng: number;
  vehicle: 'moto' | 'bici' | 'carro';
}

export interface Message {
  id: string;
  senderId: string;
  senderRole: 'admin' | 'business' | 'delivery' | 'client';
  senderName: string;
  text?: string;
  photo?: string;
  file?: string;
  fileName?: string;
  location?: { lat: number; lng: number };
  createdAt: string;
  read: boolean;
}

export interface Chat {
  id: string;
  type: 'admin-delivery' | 'admin-client' | 'business-delivery';
  targetName: string; // The person we are talking to
  targetPhoto: string;
  targetId: string;
  isTyping?: boolean;
  messages: Message[];
}

export interface ActiveCall {
  id: string;
  type: 'voice' | 'video';
  targetId: string;
  targetName: string;
  targetPhoto: string;
  status: 'ringing' | 'connected' | 'ended';
  duration: number;
}

export interface CashTransaction {
  id: string;
  type: 'income' | 'expense' | 'sale';
  amount: number;
  description: string;
  createdAt: string;
  orderId?: string;
}

export interface CashRegister {
  id: string;
  name: string;
  workerName: string;
  date: string; // "YYYY-MM-DD"
  baseCash: number;
  status: 'open' | 'closed';
  createdAt: string;
  closedAt?: string;
  transactions: CashTransaction[];
  notes?: string;
}

