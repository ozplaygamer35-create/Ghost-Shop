import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Order, OrderStatus } from '../types';
import {
  Clock,
  Check,
  X,
  MapPin,
  Phone,
  MessageSquare,
  ChevronRight,
  TrendingUp,
  Package,
  Bike,
  Smile,
  AlertTriangle
} from 'lucide-react';

export default function Orders() {
  const { orders, updateOrderStatus, drivers, setCurrentView, startCall } = useApp();

  const [activeTab, setActiveTab] = useState<'pending' | 'preparing' | 'transit' | 'completed'>('pending');

  const filteredOrders = orders.filter(o => {
    if (activeTab === 'pending') return o.status === 'received';
    if (activeTab === 'preparing') return o.status === 'preparing' || o.status === 'ready';
    if (activeTab === 'transit') return o.status === 'assigned' || o.status === 'delivering';
    if (activeTab === 'completed') return o.status === 'delivered' || o.status === 'canceled';
    return true;
  });

  const getStatusStyle = (status: OrderStatus) => {
    switch (status) {
      case 'received': return 'bg-amber-500/15 text-amber-400 border border-amber-500/30';
      case 'preparing': return 'bg-blue-500/15 text-blue-400 border border-blue-500/30';
      case 'ready': return 'bg-purple-500/15 text-purple-400 border border-purple-500/30';
      case 'assigned': return 'bg-pink-500/15 text-pink-400 border border-pink-500/30';
      case 'delivering': return 'bg-teal-500/15 text-teal-400 border border-teal-500/30';
      case 'delivered': return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30';
      case 'canceled': return 'bg-red-500/15 text-red-400 border border-red-500/30';
    }
  };

  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case 'received': return 'Recibido';
      case 'preparing': return 'Preparando';
      case 'ready': return 'Listo para Despacho';
      case 'assigned': return 'Repartidor Asignado';
      case 'delivering': return 'En camino';
      case 'delivered': return 'Entregado';
      case 'canceled': return 'Cancelado';
    }
  };

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-zinc-800 pb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-500" />
          Pedidos en Tiempo Real (En Vivo)
        </h2>
        <p className="text-xs text-zinc-500 mt-1">Monitorea y cambia el estado de tus pedidos. Los repartidores y clientes recibirán las alertas inmediatamente.</p>
      </div>

      {/* Tabs Row */}
      <div className="flex border-b border-zinc-800 gap-1 overflow-x-auto select-none">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-5 py-3 text-xs font-semibold border-b-2 transition-all shrink-0 ${
            activeTab === 'pending'
              ? 'border-amber-500 text-amber-400 font-bold bg-amber-500/5'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          Nuevos Entrantes ({orders.filter(o => o.status === 'received').length})
        </button>
        <button
          onClick={() => setActiveTab('preparing')}
          className={`px-5 py-3 text-xs font-semibold border-b-2 transition-all shrink-0 ${
            activeTab === 'preparing'
              ? 'border-amber-500 text-amber-400 font-bold bg-amber-500/5'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          En Cocina ({orders.filter(o => o.status === 'preparing' || o.status === 'ready').length})
        </button>
        <button
          onClick={() => setActiveTab('transit')}
          className={`px-5 py-3 text-xs font-semibold border-b-2 transition-all shrink-0 ${
            activeTab === 'transit'
              ? 'border-amber-500 text-amber-400 font-bold bg-amber-500/5'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          En Camino ({orders.filter(o => o.status === 'assigned' || o.status === 'delivering').length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-5 py-3 text-xs font-semibold border-b-2 transition-all shrink-0 ${
            activeTab === 'completed'
              ? 'border-amber-500 text-amber-400 font-bold bg-amber-500/5'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          Historial / Finalizados ({orders.filter(o => o.status === 'delivered' || o.status === 'canceled').length})
        </button>
      </div>

      {/* Orders list wrapper */}
      {filteredOrders.length === 0 ? (
        <div className="bg-[#121212] border border-zinc-800 rounded-2xl p-16 text-center text-zinc-500">
          <Package className="w-12 h-12 text-zinc-700 mx-auto mb-3 animate-pulse" />
          <h3 className="text-sm font-semibold text-zinc-300">No hay pedidos en esta sección</h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto leading-relaxed">
            {activeTab === 'pending'
              ? 'Todos tus pedidos han sido procesados. Presiona "Simular Pedido de Cliente 📱" arriba en el inicio para generar nuevos pedidos de prueba.'
              : 'No hay pedidos activos que coincidan con este filtro en este momento.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const assignedDriver = order.deliveryPartnerId
              ? drivers.find(d => d.id === order.deliveryPartnerId)
              : null;

            return (
              <div
                key={order.id}
                className="bg-[#121212] border border-zinc-800/80 rounded-2xl p-6 hover:border-amber-500/20 transition-all flex flex-col lg:flex-row gap-6 justify-between items-start"
              >
                {/* Left Section: Details */}
                <div className="space-y-4 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm font-black font-mono text-white">#{order.id.replace('order-', '')}</span>
                    <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full uppercase ${getStatusStyle(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                    <span className="text-xs text-zinc-500 font-mono">
                      Recibido: {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Client card */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-zinc-950/40 p-4 rounded-xl border border-zinc-800/60 text-xs">
                    <div className="space-y-1.5">
                      <p className="text-[10px] text-zinc-500 font-mono uppercase">Cliente</p>
                      <p className="font-semibold text-zinc-200">{order.clientName}</p>
                      <p className="text-zinc-400 flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-zinc-500" /> {order.clientPhone}
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-[10px] text-zinc-500 font-mono uppercase">Dirección de Entrega</p>
                      <p className="text-zinc-300 font-medium flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-amber-500" /> {order.clientAddress}
                      </p>
                    </div>
                  </div>

                  {/* Products list */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold font-mono text-zinc-400 uppercase tracking-wider">Productos en la Orden</p>
                    <div className="space-y-1.5 pl-1">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs font-mono text-zinc-300">
                          <span className="flex items-center gap-2">
                            <span className="text-amber-500 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded text-[10px]">
                              {item.quantity}x
                            </span>
                            <span>{item.name}</span>
                          </span>
                          <span className="text-zinc-400">{formatCOP(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Section: Actions & Drivers & Price */}
                <div className="w-full lg:w-72 flex flex-col justify-between self-stretch bg-zinc-950/20 lg:bg-transparent border-t lg:border-t-0 lg:border-l border-zinc-800 lg:pl-6 pt-4 lg:pt-0">
                  <div className="space-y-3">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs text-zinc-500">Monto Neto Facturado</span>
                      <span className="text-lg font-black font-mono text-white">{formatCOP(order.total)}</span>
                    </div>

                    {assignedDriver && (
                      <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800/80 flex items-center gap-3">
                        <img
                          src={assignedDriver.photo}
                          alt={assignedDriver.name}
                          className="w-10 h-10 rounded-xl object-cover"
                        />
                        <div className="text-xs">
                          <p className="text-[10px] text-zinc-500 font-mono flex items-center gap-1">
                            <Bike className="w-3 h-3 text-amber-500" /> REPARTIDOR ASIGNADO
                          </p>
                          <p className="font-bold text-zinc-200 truncate max-w-[130px]">{assignedDriver.name}</p>
                          <p className="text-[10px] text-zinc-400">{assignedDriver.phone}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Operational Flow Actions */}
                  <div className="mt-4 space-y-2">
                    {order.status === 'received' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateOrderStatus(order.id, 'preparing')}
                          className="flex-1 bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-black font-semibold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-amber-500/10"
                        >
                          <Check className="w-4 h-4" /> Aceptar Pedido 🍳
                        </button>
                        <button
                          onClick={() => updateOrderStatus(order.id, 'canceled')}
                          className="px-3 py-2.5 bg-red-500/5 border border-red-500/20 hover:bg-red-500/10 text-red-400 rounded-xl transition-all"
                          title="Rechazar Pedido"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    {order.status === 'preparing' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'ready')}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
                      >
                        <Package className="w-4 h-4" /> Terminar Preparación (Listo) 📦
                      </button>
                    )}

                    {order.status === 'ready' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'assigned')}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
                      >
                        <Bike className="w-4 h-4" /> Asignar Repartidor Cercano 🚴
                      </button>
                    )}

                    {order.status === 'assigned' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'delivering')}
                        className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
                      >
                        <Bike className="w-4 h-4" /> Despachar / En camino 🗺️
                      </button>
                    )}

                    {order.status === 'delivering' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'delivered')}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
                      >
                        <Smile className="w-4 h-4" /> Confirmar Entrega Realizada ✅
                      </button>
                    )}

                    {/* Chat quick launchers */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setCurrentView('chat');
                        }}
                        className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs py-2 rounded-lg border border-zinc-800/80 transition-all flex items-center justify-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5" /> Abrir Chat
                      </button>
                      <button
                        onClick={() => {
                          startCall('voice', order.deliveryPartnerId || 'client-juan');
                        }}
                        className="px-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 rounded-lg border border-zinc-800/80 transition-all text-xs flex items-center justify-center"
                        title="Llamar"
                      >
                        📞
                      </button>
                    </div>

                    {order.status !== 'delivered' && order.status !== 'canceled' && order.status !== 'received' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'canceled')}
                        className="w-full text-zinc-600 hover:text-red-400 text-[10px] text-center transition-all mt-2 font-mono"
                      >
                        ¿Problemas? Cancelar pedido #{(order.id).replace('order-','')}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
