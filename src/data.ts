import { Product, BusinessProfile, Driver, Order, Chat } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    name: 'Hamburguesa Ghost Premium',
    description: 'Carne angus de 150g, queso cheddar fundido, tocineta crocante, aros de cebolla y salsa secreta Ghost.',
    category: 'Hamburguesas',
    price: 24900,
    discountPrice: 19900,
    available: true,
    quantity: 50,
    estimatedTime: '20-25 min',
    status: 'active'
  },
  {
    id: 'prod-2',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
    name: 'Pizza Pepperoni Especial',
    description: 'Masa madurada, salsa artesanal de tomate, doble queso mozzarella, pepperoni premium y aceite rústico de ajo.',
    category: 'Pizzas',
    price: 32000,
    available: true,
    quantity: 30,
    estimatedTime: '25-30 min',
    status: 'active'
  },
  {
    id: 'prod-3',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80',
    name: 'Tacos de Birria (3 und)',
    description: 'Tortillas de maíz con carne tierna desmechada de res, sazonada con chiles, cebolla, cilantro y consomé para sumergir.',
    category: 'Tacos',
    price: 18900,
    discountPrice: 16900,
    available: true,
    quantity: 40,
    estimatedTime: '15-20 min',
    status: 'active'
  },
  {
    id: 'prod-4',
    image: 'https://images.unsplash.com/photo-1626700051175-6518c4793f06?auto=format&fit=crop&w=600&q=80',
    name: 'Malteada de Nutella & Oreo',
    description: 'Crema helada de vainilla batida con Nutella original, trozos de galleta Oreo, crema batida y fudge de chocolate.',
    category: 'Bebidas',
    price: 12500,
    available: true,
    quantity: 25,
    estimatedTime: '10 min',
    status: 'active'
  },
  {
    id: 'prod-5',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    name: 'Ensalada Bowls de Salmón',
    description: 'Salmón a la plancha, quinua orgánica, aguacate, tomates cherry, espinaca tierna y aderezo sésamo-jengibre.',
    category: 'Saludable',
    price: 29900,
    available: true,
    quantity: 15,
    estimatedTime: '20 min',
    status: 'active'
  },
  {
    id: 'prod-6',
    image: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&w=600&q=80',
    name: 'Papas Rústicas de la Casa',
    description: 'Papas cortadas a mano con piel, fritas a la perfección, sazonadas con paprika y finas hierbas, acompañadas de salsa alioli.',
    category: 'Acompañamientos',
    price: 8900,
    available: false,
    quantity: 0,
    estimatedTime: '10-15 min',
    status: 'inactive'
  }
];

export const INITIAL_BUSINESS_PROFILE: BusinessProfile = {
  name: 'GHOST SHOP',
  description: 'Los mejores sabores urbanos en tiempo récord. Hamburguesas premium, pizzas artesanales y bebidas increíbles elaboradas con los ingredientes más frescos.',
  address: 'Calle 85 # 12 - 45, Bogotá, Colombia',
  phone: '+57 312 456 7890',
  whatsapp: '+57 312 456 7890',
  email: 'contacto@ghostexpress.com',
  schedule: 'Lunes a Domingo: 11:30 AM - 11:00 PM',
  category: 'Restaurante',
  logoUrl: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=200&q=80',
  coverUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
  paymentMethods: {
    nequi: true,
    daviplata: true,
    pse: true,
    creditCard: true,
    cash: true,
    bankTransfer: false
  },
  taxPercentage: 8, // Impoconsumo de comida en Colombia
  commissionPercentage: 15 // Comisión plataforma por pedido
};

// Bogotá coordinates: ~4.65 (North/South) and ~-74.06 (East/West)
export const INITIAL_DRIVERS: Driver[] = [
  {
    id: 'driver-1',
    name: 'Carlos Mendoza',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', // Male portrait placeholder
    status: 'available',
    phone: '+57 300 111 2233',
    rating: 4.8,
    lat: 4.6540,
    lng: -74.0560,
    vehicle: 'moto'
  },
  {
    id: 'driver-2',
    name: 'Andrés Felipe Restrepo',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    status: 'busy',
    phone: '+57 315 222 3344',
    rating: 4.9,
    lat: 4.6480,
    lng: -74.0620,
    vehicle: 'moto'
  },
  {
    id: 'driver-3',
    name: 'Diana Carolina Ospina',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    status: 'offline',
    phone: '+57 320 333 4455',
    rating: 4.7,
    lat: 4.6610,
    lng: -74.0510,
    vehicle: 'bici'
  },
  {
    id: 'driver-4',
    name: 'Santiago Bedoya',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    status: 'available',
    phone: '+57 310 444 5566',
    rating: 4.6,
    lat: 4.6400,
    lng: -74.0680,
    vehicle: 'carro'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'order-101',
    clientName: 'Juan Pablo Arango',
    clientPhone: '+57 311 987 6543',
    clientAddress: 'Cra. 11 # 82 - 01, Apto 402',
    items: [
      { productId: 'prod-1', name: 'Hamburguesa Ghost Premium', price: 24900, quantity: 2 },
      { productId: 'prod-4', name: 'Malteada de Nutella & Oreo', price: 12500, quantity: 1 }
    ],
    status: 'received',
    total: 62300,
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(), // 5 min ago
    lat: 4.6640,
    lng: -74.0530
  },
  {
    id: 'order-102',
    clientName: 'María Camila Silva',
    clientPhone: '+57 314 555 1234',
    clientAddress: 'Calle 90 # 15 - 32, Edificio Aluna',
    items: [
      { productId: 'prod-2', name: 'Pizza Pepperoni Especial', price: 32000, quantity: 1 },
      { productId: 'prod-3', name: 'Tacos de Birria (3 und)', price: 18900, quantity: 1 }
    ],
    status: 'preparing',
    total: 50900,
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(), // 15 min ago
    lat: 4.6720,
    lng: -74.0480
  },
  {
    id: 'order-103',
    clientName: 'Mateo Gómez',
    clientPhone: '+57 301 777 8899',
    clientAddress: 'Calle 78 # 9 - 14, Oficina 501',
    items: [
      { productId: 'prod-5', name: 'Ensalada Bowls de Salmón', price: 29900, quantity: 1 }
    ],
    status: 'delivering',
    total: 29900,
    createdAt: new Date(Date.now() - 25 * 60000).toISOString(), // 25 min ago
    deliveryPartnerId: 'driver-2',
    lat: 4.6360,
    lng: -74.0650
  },
  {
    id: 'order-104',
    clientName: 'Laura Marcela Ortiz',
    clientPhone: '+57 318 444 8877',
    clientAddress: 'Diagonal 75 # 22 - 60',
    items: [
      { productId: 'prod-1', name: 'Hamburguesa Ghost Premium', price: 24900, quantity: 1 }
    ],
    status: 'delivered',
    total: 24900,
    createdAt: new Date(Date.now() - 60 * 60000).toISOString(), // 1 hour ago
    deliveryPartnerId: 'driver-1',
    lat: 4.6450,
    lng: -74.0720
  }
];

export const INITIAL_CHATS: Chat[] = [
  {
    id: 'chat-1',
    type: 'admin-delivery',
    targetId: 'driver-1',
    targetName: 'Carlos Mendoza (Repartidor)',
    targetPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    isTyping: false,
    messages: [
      {
        id: 'msg-1',
        senderId: 'driver-1',
        senderRole: 'delivery',
        senderName: 'Carlos Mendoza',
        text: 'Hola, ya llegué al restaurante por el pedido #104. ¿Está listo para entrega?',
        createdAt: new Date(Date.now() - 40 * 60000).toISOString(),
        read: true
      },
      {
        id: 'msg-2',
        senderId: 'business-admin',
        senderRole: 'admin',
        senderName: 'Administrador',
        text: 'Hola Carlos, sí, ya te lo acaban de entregar empacado en la barra. Confírmame por favor.',
        createdAt: new Date(Date.now() - 39 * 60000).toISOString(),
        read: true
      },
      {
        id: 'msg-3',
        senderId: 'driver-1',
        senderRole: 'delivery',
        senderName: 'Carlos Mendoza',
        text: '¡Recibido! Ya voy en camino a la dirección del cliente.',
        createdAt: new Date(Date.now() - 38 * 60000).toISOString(),
        read: true
      }
    ]
  },
  {
    id: 'chat-2',
    type: 'admin-client',
    targetId: 'client-juan',
    targetName: 'Juan Pablo Arango (Cliente)',
    targetPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    isTyping: false,
    messages: [
      {
        id: 'msg-4',
        senderId: 'client-juan',
        senderRole: 'client',
        senderName: 'Juan Pablo Arango',
        text: 'Buenas tardes. Acabo de hacer un pedido de dos Hamburguesas Ghost Premium. ¿Podrían enviar salsas adicionales, por favor?',
        createdAt: new Date(Date.now() - 4 * 60000).toISOString(),
        read: false
      }
    ]
  },
  {
    id: 'chat-3',
    type: 'business-delivery',
    targetId: 'driver-2',
    targetName: 'Andrés Felipe Restrepo (Repartidor)',
    targetPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    isTyping: true,
    messages: [
      {
        id: 'msg-5',
        senderId: 'business-admin',
        senderRole: 'admin',
        senderName: 'Administrador',
        text: 'Andrés, recuerda tener mucho cuidado con el bowl de salmón de la orden #103 para que no se voltee.',
        createdAt: new Date(Date.now() - 10 * 60000).toISOString(),
        read: true
      },
      {
        id: 'msg-6',
        senderId: 'driver-2',
        senderRole: 'delivery',
        senderName: 'Andrés Felipe Restrepo',
        text: 'Entendido, lo llevo bien asegurado en la maleta térmica. Llego en 8 minutos.',
        createdAt: new Date(Date.now() - 9 * 60000).toISOString(),
        read: true
      }
    ]
  }
];
