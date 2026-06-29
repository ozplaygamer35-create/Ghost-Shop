import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  User,
  BusinessProfile,
  Product,
  Order,
  OrderStatus,
  Driver,
  Chat,
  Message,
  ActiveCall,
  CashRegister,
  CashTransaction
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_BUSINESS_PROFILE,
  INITIAL_DRIVERS,
  INITIAL_ORDERS,
  INITIAL_CHATS
} from '../data';
import { audioCall } from '../utils/audioCall';

interface AppContextType {
  user: User | null;
  business: BusinessProfile;
  products: Product[];
  orders: Order[];
  drivers: Driver[];
  chats: Chat[];
  activeCall: ActiveCall | null;
  currentView: string;
  setCurrentView: (view: string) => void;
  login: (email: string, pass: string) => Promise<boolean>;
  register: (data: any) => Promise<boolean>;
  logout: () => void;
  updateUser: (profile: Partial<User>) => void;
  updateBusiness: (profile: Partial<BusinessProfile>) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  duplicateProduct: (id: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  sendMessage: (chatId: string, text?: string, photo?: string, file?: string, fileName?: string, location?: { lat: number; lng: number }) => void;
  setChatTyping: (chatId: string, isTyping: boolean) => void;
  startCall: (type: 'voice' | 'video', targetId: string) => void;
  endCall: () => void;
  setDriverStatus: (driverId: string, status: 'available' | 'busy' | 'offline') => void;
  simulateNewOrder: () => void;
  simulateDriverMovement: () => void;
  isRealtimeSyncing: boolean;
  notifications: string[];
  clearNotifications: () => void;
  registers: CashRegister[];
  createCashRegister: (name: string, workerName: string, baseCash: number, date: string) => void;
  addRegisterTransaction: (registerId: string, type: 'income' | 'expense', amount: number, description: string) => void;
  closeCashRegister: (registerId: string, notes?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Robust local storage parser helper to prevent any runtime syntax or type crash
function safeJsonParse<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item || item === 'undefined' || item === 'null') {
      return defaultValue;
    }
    const parsed = JSON.parse(item);
    if (parsed === null || parsed === undefined) {
      return defaultValue;
    }
    return parsed as T;
  } catch (error) {
    console.error(`Error parsing localStorage key "${key}":`, error);
    return defaultValue;
  }
}

function getStoredProfiles(): Record<string, User> {
  const profiles = safeJsonParse<Record<string, User>>('ge_user_profiles', {});
  const defaultUser: User = {
    uid: 'user-default',
    name: 'Oz',
    lastname: 'Express',
    email: 'ozplay40@gmail.com',
    phone: '+57 312 456 7890',
    role: 'admin'
  };
  const adminUser: User = {
    uid: 'user-admin',
    name: 'Andrés',
    lastname: 'Restrepo',
    email: 'admin@ghostexpress.com',
    phone: '+57 312 456 7890',
    role: 'admin'
  };
  
  let modified = false;
  if (!profiles[defaultUser.email.toLowerCase()]) {
    profiles[defaultUser.email.toLowerCase()] = defaultUser;
    modified = true;
  }
  if (!profiles[adminUser.email.toLowerCase()]) {
    profiles[adminUser.email.toLowerCase()] = adminUser;
    modified = true;
  }
  
  if (modified) {
    saveStoredProfiles(profiles);
  }
  
  return profiles;
}

function saveStoredProfiles(profiles: Record<string, User>) {
  try {
    localStorage.setItem('ge_user_profiles', JSON.stringify(profiles));
  } catch (e) {
    console.error("Error saving ge_user_profiles to localStorage", e);
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Navigation state
  const [currentView, setCurrentView] = useState<string>('inicio');

  // Core Data States (Load from sessionStorage for tab/reopen prompt login)
  const [user, setUser] = useState<User | null>(() => {
    try {
      const cached = sessionStorage.getItem('ge_user');
      if (cached && cached !== 'undefined' && cached !== 'null') {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.email) {
          const profiles = getStoredProfiles();
          const storedProfile = profiles[parsed.email.toLowerCase()];
          if (storedProfile) {
            return { ...parsed, ...storedProfile };
          }
        }
        return parsed;
      }
    } catch (e) {
      console.error("Error loading cached user", e);
    }
    
    // We default to null so the login screen is shown initially when opening the app
    return null;
  });

  const [business, setBusiness] = useState<BusinessProfile>(() => {
    const loaded = safeJsonParse<BusinessProfile>('ge_business', INITIAL_BUSINESS_PROFILE);
    if (loaded && (loaded.name === 'Ghost Express Burgers & More' || !loaded.name)) {
      loaded.name = 'GHOST SHOP';
      try {
        localStorage.setItem('ge_business', JSON.stringify(loaded));
      } catch (e) {
        console.error("Error updating migrated business name", e);
      }
    }
    return loaded;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    return safeJsonParse('ge_products', INITIAL_PRODUCTS);
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    return safeJsonParse('ge_orders', INITIAL_ORDERS);
  });

  const [drivers, setDrivers] = useState<Driver[]>(() => {
    return safeJsonParse('ge_drivers', INITIAL_DRIVERS);
  });

  const [chats, setChats] = useState<Chat[]>(() => {
    return safeJsonParse('ge_chats', INITIAL_CHATS);
  });

  const [registers, setRegisters] = useState<CashRegister[]>(() => {
    try {
      const cached = localStorage.getItem('ge_registers');
      if (cached && cached !== 'undefined' && cached !== 'null') {
        const parsed = JSON.parse(cached);
        if (parsed && Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Error parsing ge_registers", e);
    }
    return [
      {
        id: 'reg-1',
        name: 'Caja Mañana',
        workerName: 'Juan Gómez',
        date: '2026-06-26',
        baseCash: 100000,
        status: 'closed',
        createdAt: '2026-06-26T13:00:00.000Z',
        closedAt: '2026-06-26T21:00:00.000Z',
        notes: 'Caja cerrada sin descuadres.',
        transactions: [
          { id: 'tx-1', type: 'sale', amount: 45000, description: 'Venta Pedido #102', createdAt: '2026-06-26T14:30:00.000Z' },
          { id: 'tx-2', type: 'sale', amount: 78000, description: 'Venta Pedido #103', createdAt: '2026-06-26T15:15:00.000Z' },
          { id: 'tx-3', type: 'expense', amount: 15000, description: 'Compra de hielo para gaseosas', createdAt: '2026-06-26T16:00:00.000Z' },
          { id: 'tx-4', type: 'income', amount: 20000, description: 'Reembolso caja menor', createdAt: '2026-06-26T17:00:00.000Z' },
          { id: 'tx-5', type: 'sale', amount: 65000, description: 'Venta Pedido #104', createdAt: '2026-06-26T18:30:00.000Z' }
        ]
      },
      {
        id: 'reg-2',
        name: 'Caja Principal',
        workerName: 'María Camila',
        date: '2026-06-27',
        baseCash: 120000,
        status: 'closed',
        createdAt: '2026-06-27T14:00:00.000Z',
        closedAt: '2026-06-27T22:30:00.000Z',
        notes: 'Cierre exitoso sin inconvenientes.',
        transactions: [
          { id: 'tx-6', type: 'sale', amount: 110000, description: 'Venta Pedido #105', createdAt: '2026-06-27T19:20:00.000Z' },
          { id: 'tx-7', type: 'sale', amount: 89000, description: 'Venta Pedido #106', createdAt: '2026-06-27T20:10:00.000Z' }
        ]
      },
      {
        id: 'reg-3',
        name: 'Caja de Turno',
        workerName: 'Andrés Restrepo',
        date: '2026-06-28',
        baseCash: 150000,
        status: 'open',
        createdAt: '2026-06-28T11:00:00.000Z',
        transactions: [
          { id: 'tx-8', type: 'sale', amount: 54000, description: 'Venta Pedido #107', createdAt: '2026-06-28T12:30:00.000Z' },
          { id: 'tx-9', type: 'expense', amount: 12000, description: 'Pago de transporte moto', createdAt: '2026-06-28T13:00:00.000Z' }
        ]
      }
    ];
  });

  const [activeCall, setActiveCall] = useState<ActiveCall | null>(null);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [isRealtimeSyncing, setIsRealtimeSyncing] = useState<boolean>(false);

  // Persistence Cache
  useEffect(() => {
    if (user) {
      sessionStorage.setItem('ge_user', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('ge_user');
    }
    // Remove from localStorage as well to avoid stale persistence
    localStorage.removeItem('ge_user');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('ge_business', JSON.stringify(business));
  }, [business]);

  useEffect(() => {
    localStorage.setItem('ge_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('ge_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('ge_drivers', JSON.stringify(drivers));
  }, [drivers]);

  useEffect(() => {
    localStorage.setItem('ge_chats', JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    localStorage.setItem('ge_registers', JSON.stringify(registers));
  }, [registers]);

  // Local only mode, no cloud syncing listeners needed
  useEffect(() => {
    setIsRealtimeSyncing(false);
  }, [user]);

  // Simulation: Move drivers slowly around Bogotá every 4 seconds to simulate deliveries on maps
  useEffect(() => {
    const interval = setInterval(() => {
      setDrivers(prevDrivers =>
        prevDrivers.map(d => {
          if (d.status === 'offline') return d;
          // Slowly adjust coordinates
          const dLat = (Math.random() - 0.5) * 0.0015;
          const dLng = (Math.random() - 0.5) * 0.0015;
          return {
            ...d,
            lat: Number((d.lat + dLat).toFixed(6)),
            lng: Number((d.lng + dLng).toFixed(6))
          };
        })
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Notifications
  const addNotification = (msg: string) => {
    setNotifications(prev => [msg, ...prev].slice(0, 20));
  };

  const clearNotifications = () => setNotifications([]);

  // Auth Operations
  const login = async (email: string, pass: string): Promise<boolean> => {
    // In simulation mode we accept any correct formatted login
    if (email && pass.length >= 6) {
      const profiles = getStoredProfiles();
      const lowerEmail = email.toLowerCase();
      
      let newUser: User;
      if (profiles[lowerEmail]) {
        newUser = profiles[lowerEmail];
      } else {
        newUser = {
          uid: 'user-' + Date.now(),
          name: email.split('@')[0],
          lastname: 'Express',
          email: email,
          phone: '+57 300 123 4567',
          role: 'admin'
        };
        profiles[lowerEmail] = newUser;
        saveStoredProfiles(profiles);
      }

      setUser(newUser);

      // Synchronize photoUrl with business logoUrl
      if (newUser.photoUrl && business && business.logoUrl !== newUser.photoUrl) {
        setBusiness(prev => {
          const updated = { ...prev, logoUrl: newUser.photoUrl! };
          localStorage.setItem('ge_business', JSON.stringify(updated));
          return updated;
        });
      } else if (business?.logoUrl && !newUser.photoUrl) {
        newUser.photoUrl = business.logoUrl;
        profiles[lowerEmail] = newUser;
        saveStoredProfiles(profiles);
        setUser({ ...newUser });
      }

      addNotification('Sesión iniciada correctamente');
      return true;
    }
    return false;
  };

  const register = async (data: any): Promise<boolean> => {
    if (data.email && data.password === data.confirmPassword) {
      const profiles = getStoredProfiles();
      const lowerEmail = data.email.toLowerCase();

      let newUser: User = {
        uid: 'user-' + Date.now(),
        name: data.name,
        lastname: data.lastname,
        email: data.email,
        phone: data.phone,
        role: 'admin'
      };

      if (profiles[lowerEmail]) {
        newUser = {
          ...profiles[lowerEmail],
          ...newUser
        };
      }

      if (!newUser.photoUrl && business?.logoUrl) {
        newUser.photoUrl = business.logoUrl;
      }

      profiles[lowerEmail] = newUser;
      saveStoredProfiles(profiles);

      setUser(newUser);
      addNotification(`Cuenta creada para ${data.name}`);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setCurrentView('inicio');
    addNotification('Sesión cerrada');
  };

  const updateUser = async (profileData: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...profileData };
    setUser(updatedUser);
    
    // Save to profiles map
    const profiles = getStoredProfiles();
    profiles[updatedUser.email.toLowerCase()] = updatedUser;
    saveStoredProfiles(profiles);

    // Keep business logo in sync with profile image
    if (profileData.photoUrl && business && business.logoUrl !== profileData.photoUrl) {
      setBusiness(prev => {
        const updatedBiz = { ...prev, logoUrl: profileData.photoUrl! };
        localStorage.setItem('ge_business', JSON.stringify(updatedBiz));
        
        // Local only, no firebase sync
        return updatedBiz;
      });
    }

    addNotification('Perfil administrativo actualizado');

    // Local only, no firebase sync
  };

  // Business Profile Operations
  const updateBusiness = async (profile: Partial<BusinessProfile>) => {
    const updated = { ...business, ...profile };
    setBusiness(updated);
    addNotification('Perfil de negocio actualizado');

    // Sync business logoUrl changes to current user's photoUrl
    if (profile.logoUrl && user && user.photoUrl !== profile.logoUrl) {
      const updatedUser = { ...user, photoUrl: profile.logoUrl };
      setUser(updatedUser);

      const profiles = getStoredProfiles();
      profiles[updatedUser.email.toLowerCase()] = updatedUser;
      saveStoredProfiles(profiles);

      // Local only, no firebase sync
    }

    // Local only, no firebase sync
  };

  // Product Operations
  const addProduct = async (prod: Omit<Product, 'id'>) => {
    const id = 'prod-' + Date.now();
    const newProduct: Product = { ...prod, id };
    setProducts(prev => [newProduct, ...prev]);
    addNotification(`Producto agregado: ${prod.name}`);

    // Local only, no firebase sync
  };

  const updateProduct = async (id: string, prod: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...prod } : p));
    addNotification(`Producto actualizado`);

    // Local only, no firebase sync
  };

  const deleteProduct = async (id: string) => {
    const target = products.find(p => p.id === id);
    setProducts(prev => prev.filter(p => p.id !== id));
    addNotification(`Producto eliminado: ${target?.name}`);

    // Local only, no firebase sync
  };

  const duplicateProduct = async (id: string) => {
    const target = products.find(p => p.id === id);
    if (target) {
      const duplicated: Product = {
        ...target,
        id: 'prod-' + Date.now(),
        name: `${target.name} (Copia)`
      };
      setProducts(prev => [duplicated, ...prev]);
      addNotification(`Producto duplicado: ${target.name}`);

      // Local only, no firebase sync
    }
  };

  // Order Operations
  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    // Determine assigned delivery partner if transitioning to assigned
    let deliveryId: string | undefined = undefined;
    if (status === 'assigned' || status === 'delivering') {
      const availableDriver = drivers.find(d => d.status === 'available');
      deliveryId = availableDriver?.id || 'driver-1';
      // Mark driver as busy
      setDrivers(prev => prev.map(d => d.id === deliveryId ? { ...d, status: 'busy' } : d));
    }

    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const updateObj: Partial<Order> = { status };
        if (deliveryId) updateObj.deliveryPartnerId = deliveryId;
        return { ...o, ...updateObj };
      }
      return o;
    }));

    if (status === 'delivered') {
      const targetOrder = orders.find(o => o.id === orderId);
      if (targetOrder) {
        setRegisters(prevRegs => {
          const openRegister = prevRegs.find(r => r.status === 'open');
          if (openRegister) {
            const alreadyExists = openRegister.transactions.some(t => t.orderId === orderId);
            if (!alreadyExists) {
              const saleTx: CashTransaction = {
                id: 'tx-sale-' + Date.now(),
                type: 'sale',
                amount: targetOrder.total,
                description: `Venta Pedido #${orderId.replace('order-', '')} (${targetOrder.clientName})`,
                createdAt: new Date().toISOString(),
                orderId: orderId
              };
              return prevRegs.map(r => r.id === openRegister.id ? { ...r, transactions: [...r.transactions, saleTx] } : r);
            }
          }
          return prevRegs;
        });
      }
    }

    // Trigger state/driver mapping feedback text
    const orderTitle = `Pedido #${orderId.replace('order-', '')}`;
    let statusText = 'cambió de estado';
    switch(status) {
      case 'preparing': statusText = 'está preparándose 🍳'; break;
      case 'ready': statusText = 'está listo para retirar 📦'; break;
      case 'assigned': statusText = 'tiene repartidor asignado 🚴'; break;
      case 'delivering': statusText = 'está en camino al destino 🗺️'; break;
      case 'delivered': statusText = 'entregado con éxito ✅'; break;
      case 'canceled': statusText = 'ha sido cancelado ❌'; break;
    }
    addNotification(`${orderTitle} ${statusText}`);

    // Local only, no firebase sync
  };

  // Chat Operations
  const sendMessage = async (
    chatId: string,
    text?: string,
    photo?: string,
    file?: string,
    fileName?: string,
    location?: { lat: number; lng: number }
  ) => {
    const newMessage: Message = {
      id: 'msg-' + Date.now(),
      senderId: user?.uid || 'user-default',
      senderRole: 'admin',
      senderName: user ? `${user.name} ${user.lastname}` : 'Administrador',
      text,
      photo,
      file,
      fileName,
      location,
      createdAt: new Date().toISOString(),
      read: false
    };

    setChats(prev => prev.map(c => {
      if (c.id === chatId) {
        return {
          ...c,
          messages: [...c.messages, newMessage]
        };
      }
      return c;
    }));

    // Local only, no firebase sync

    // Simulate real-time driver reply inside the chat after 3 seconds for active simulation
    setTimeout(() => {
      setChats(prev => prev.map(c => {
        if (c.id === chatId) {
          const reply: Message = {
            id: 'msg-reply-' + Date.now(),
            senderId: c.targetId,
            senderRole: c.type === 'admin-delivery' || c.type === 'business-delivery' ? 'delivery' : 'client',
            senderName: c.targetName.split(' ')[0],
            text: text ? `Recibido! Procesando tu mensaje: "${text.substring(0, 15)}..."` : 'Entendido, muchas gracias.',
            createdAt: new Date().toISOString(),
            read: false
          };
          addNotification(`Nuevo mensaje de ${c.targetName.split(' ')[0]}`);
          return {
            ...c,
            isTyping: false,
            messages: [...c.messages, reply]
          };
        }
        return c;
      }));
    }, 3000);
  };

  const setChatTyping = (chatId: string, isTyping: boolean) => {
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, isTyping } : c));
  };

  // Call Operations
  const startCall = (type: 'voice' | 'video', targetId: string) => {
    // Find target
    let targetName = 'Usuario';
    let targetPhoto = '';

    const driver = drivers.find(d => d.id === targetId);
    if (driver) {
      targetName = driver.name;
      targetPhoto = driver.photo;
    } else {
      const chat = chats.find(c => c.targetId === targetId);
      if (chat) {
        targetName = chat.targetName;
        targetPhoto = chat.targetPhoto;
      }
    }

    const newCall: ActiveCall = {
      id: 'call-' + Date.now(),
      type,
      targetId,
      targetName,
      targetPhoto,
      status: 'ringing',
      duration: 0
    };

    setActiveCall(newCall);
    addNotification(`Llamando a ${targetName} (${type === 'video' ? 'Video' : 'Voz'})...`);
    audioCall.startRinging();

    // Simulate auto-connect after 3 seconds
    setTimeout(() => {
      setActiveCall(prev => {
        if (prev && prev.id === newCall.id && prev.status === 'ringing') {
          addNotification(`Llamada con ${targetName} establecida`);
          audioCall.startConnectedTone();
          return { ...prev, status: 'connected' };
        }
        return prev;
      });
    }, 3000);
  };

  // Call duration counter
  useEffect(() => {
    let callTimer: any;
    if (activeCall && activeCall.status === 'connected') {
      callTimer = setInterval(() => {
        setActiveCall(prev => prev ? { ...prev, duration: prev.duration + 1 } : null);
      }, 1000);
    }
    return () => clearInterval(callTimer);
  }, [activeCall?.status]);

  const endCall = () => {
    if (activeCall) {
      addNotification(`Llamada con ${activeCall.targetName} finalizada`);
      audioCall.playHangupTone();
      setActiveCall(prev => prev ? { ...prev, status: 'ended' } : null);
      setTimeout(() => {
        setActiveCall(null);
      }, 1500);
    }
  };

  const setDriverStatus = (driverId: string, status: 'available' | 'busy' | 'offline') => {
    setDrivers(prev => prev.map(d => d.id === driverId ? { ...d, status } : d));
    addNotification(`Repartidor ${drivers.find(d=>d.id===driverId)?.name} ahora está ${status}`);
  };

  const createCashRegister = (name: string, workerName: string, baseCash: number, date: string) => {
    const newReg: CashRegister = {
      id: 'reg-' + Date.now(),
      name,
      workerName,
      date,
      baseCash,
      status: 'open',
      createdAt: new Date().toISOString(),
      transactions: []
    };
    // Close other open registers automatically
    setRegisters(prev => [
      newReg,
      ...prev.map(r => r.status === 'open' ? { ...r, status: 'closed' as const, closedAt: new Date().toISOString(), notes: 'Cierre automático al abrir nueva caja.' } : r)
    ]);
    addNotification(`Caja "${name}" abierta por ${workerName} con base de $${baseCash.toLocaleString('es-CO')}`);
  };

  const addRegisterTransaction = (registerId: string, type: 'income' | 'expense', amount: number, description: string) => {
    const newTx: CashTransaction = {
      id: 'tx-' + Date.now(),
      type,
      amount,
      description,
      createdAt: new Date().toISOString()
    };
    setRegisters(prev => prev.map(r => {
      if (r.id === registerId) {
        return {
          ...r,
          transactions: [...r.transactions, newTx]
        };
      }
      return r;
    }));
    addNotification(`Transacción registrada: ${type === 'income' ? 'Ingreso' : 'Egreso'} de $${amount.toLocaleString('es-CO')}`);
  };

  const closeCashRegister = (registerId: string, notes?: string) => {
    setRegisters(prev => prev.map(r => {
      if (r.id === registerId) {
        return {
          ...r,
          status: 'closed',
          closedAt: new Date().toISOString(),
          notes: notes || 'Cierre de caja manual.'
        };
      }
      return r;
    }));
    addNotification(`Caja cerrada exitosamente`);
  };

  // Simulation: Trigger incoming new order from mobile mockup
  const simulateNewOrder = () => {
    // Pick 1 or 2 products at random
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    const orderProds = shuffled.slice(0, Math.min(2, shuffled.length));

    if (orderProds.length === 0) return;

    const items = orderProds.map(p => ({
      productId: p.id,
      name: p.name,
      price: p.discountPrice || p.price,
      quantity: Math.floor(Math.random() * 2) + 1
    }));

    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderId = 'order-' + (Math.floor(Math.random() * 900) + 200);

    // Random location in Bogota
    const lat = 4.6500 + (Math.random() - 0.5) * 0.03;
    const lng = -74.0600 + (Math.random() - 0.5) * 0.03;

    const newOrder: Order = {
      id: orderId,
      clientName: ['Santiago Castro', 'Sofía Guerrero', 'Valentina Ruiz', 'Daniela Jaramillo', 'Sebastián Pinzón'][Math.floor(Math.random() * 5)],
      clientPhone: '+57 313 ' + Math.floor(Math.random() * 9000000 + 1000000),
      clientAddress: `Calle ${Math.floor(Math.random() * 100) + 1} # ${Math.floor(Math.random() * 15) + 1} - ${Math.floor(Math.random() * 80) + 1}`,
      items,
      status: 'received',
      total,
      createdAt: new Date().toISOString(),
      lat,
      lng
    };

    setOrders(prev => [newOrder, ...prev]);
    addNotification(`🔔 NUEVO PEDIDO RECIBIDO #${orderId.replace('order-', '')} de ${newOrder.clientName}!`);

    // Local only, no firebase sync
  };

  // Trigger simulated mobile driver moving
  const simulateDriverMovement = () => {
    setDrivers(prevDrivers =>
      prevDrivers.map(d => {
        if (d.status === 'offline') return d;
        // Large movement jump to simulate active riding
        const dLat = (Math.random() - 0.5) * 0.005;
        const dLng = (Math.random() - 0.5) * 0.005;
        return {
          ...d,
          lat: Number((d.lat + dLat).toFixed(6)),
          lng: Number((d.lng + dLng).toFixed(6))
        };
      })
    );
    addNotification('📍 Geolocalización de repartidores actualizada en vivo');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        business,
        products,
        orders,
        drivers,
        chats,
        activeCall,
        currentView,
        setCurrentView,
        login,
        register,
        logout,
        updateUser,
        updateBusiness,
        addProduct,
        updateProduct,
        deleteProduct,
        duplicateProduct,
        updateOrderStatus,
        sendMessage,
        setChatTyping,
        startCall,
        endCall,
        setDriverStatus,
        simulateNewOrder,
        simulateDriverMovement,
        isRealtimeSyncing,
        notifications,
        clearNotifications,
        registers,
        createCashRegister,
        addRegisterTransaction,
        closeCashRegister
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
}
