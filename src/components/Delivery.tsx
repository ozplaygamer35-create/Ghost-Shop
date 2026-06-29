import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Driver, DriverStatus } from '../types';
import {
  MapPin,
  Bike,
  ShieldAlert,
  Star,
  Compass,
  Zap,
  Phone,
  Check,
  Navigation,
  Store
} from 'lucide-react';

export default function Delivery() {
  const { drivers, setDriverStatus, orders } = useApp();

  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(drivers[0]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // Default coordinate center (Bogota, near Calle 85)
  const mapCenter = { lat: 4.6540, lng: -74.0560 };

  const getStatusBadge = (status: DriverStatus) => {
    switch (status) {
      case 'available': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'busy': return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'offline': return 'bg-zinc-800 text-zinc-500 border border-zinc-700/50';
    }
  };

  const getStatusLabel = (status: DriverStatus) => {
    switch (status) {
      case 'available': return 'Disponible';
      case 'busy': return 'En Entrega';
      case 'offline': return 'Desconectado';
    }
  };

  // Select driver automatically on load if none selected
  useEffect(() => {
    if (!selectedDriver && drivers.length > 0) {
      setSelectedDriver(drivers[0]);
    }
  }, [drivers]);

  // Find active orders in transit to track
  const trackingOrders = orders.filter(o => o.status === 'assigned' || o.status === 'delivering');

  // Simple coordinate distance calculation
  const calculateDistanceKm = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Radius of Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Number((R * c).toFixed(1));
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="border-b border-zinc-800 pb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Navigation className="w-5 h-5 text-amber-500" />
          Monitoreo Georreferenciado & Delivery Maps
        </h2>
        <p className="text-xs text-zinc-500 mt-1">Ubicación satelital en vivo de tus repartidores en Bogotá. Sigue rutas, distancias y tiempos de entrega.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Drivers list */}
        <div className="lg:col-span-4 bg-[#121212] border border-zinc-800 rounded-2xl p-5 flex flex-col h-[520px] justify-between">
          <div className="space-y-4 overflow-hidden flex flex-col flex-1">
            <h3 className="text-xs font-bold font-mono text-zinc-400 uppercase tracking-wider border-b border-zinc-800 pb-2">
              Flota de Repartidores ({drivers.length})
            </h3>

            <div className="space-y-2 overflow-y-auto flex-1 pr-1 custom-scrollbar">
              {drivers.map(d => {
                const isSelected = selectedDriver?.id === d.id;
                return (
                  <div
                    key={d.id}
                    onClick={() => {
                      setSelectedDriver(d);
                      setSelectedOrder(null);
                    }}
                    className={`p-3 rounded-xl border cursor-pointer select-none transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-amber-500/5 border-amber-500 text-white'
                        : 'bg-zinc-950/40 border-zinc-900 text-zinc-400 hover:border-zinc-800 hover:bg-zinc-900/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img src={d.photo} alt={d.name} className="w-10 h-10 rounded-xl object-cover" />
                        <span className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ring-2 ring-[#121212] ${
                          d.status === 'available' ? 'bg-emerald-500' : d.status === 'busy' ? 'bg-amber-500' : 'bg-zinc-500'
                        }`} />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold truncate text-zinc-200">{d.name}</p>
                        <p className="text-[10px] text-zinc-500 capitalize">{d.vehicle} • 📞 {d.phone}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full ${getStatusBadge(d.status)}`}>
                        {getStatusLabel(d.status)}
                      </span>
                      <div className="flex items-center gap-0.5 text-amber-500 text-[10px] justify-end mt-1 font-bold">
                        <Star className="w-3 h-3 fill-amber-500" /> {d.rating}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick status controller */}
          {selectedDriver && (
            <div className="border-t border-zinc-800 pt-4 mt-4 space-y-2">
              <p className="text-[10px] font-bold font-mono text-amber-500">CONTROL DE ESTADO: {selectedDriver.name.toUpperCase()}</p>
              <div className="grid grid-cols-3 gap-1.5">
                {(['available', 'busy', 'offline'] as DriverStatus[]).map(st => (
                  <button
                    key={st}
                    onClick={() => {
                      setDriverStatus(selectedDriver.id, st);
                      setSelectedDriver(p => p ? { ...p, status: st } : null);
                    }}
                    className={`py-1.5 rounded-lg text-[10px] font-bold transition-all border ${
                      selectedDriver.status === st
                        ? 'bg-amber-500 border-amber-500 text-black'
                        : 'bg-zinc-950 border-zinc-900 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {st === 'available' ? 'Libre' : st === 'busy' ? 'Ocupado' : 'Fuera'}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Maps tracking */}
        <div className="lg:col-span-8 bg-[#121212] border border-zinc-800 rounded-2xl overflow-hidden h-[520px] flex flex-col justify-between relative">
          {/* Map Controls Header */}
          <div className="p-4 bg-zinc-950/80 border-b border-zinc-800 flex flex-wrap gap-4 items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-amber-500 animate-spin-slow" />
              <div>
                <h4 className="text-xs font-bold text-zinc-200">Mapa de Domicilios Bogotá</h4>
                <p className="text-[10px] text-zinc-500">Presiona un pedido para simular su despacho rústico</p>
              </div>
            </div>

            {/* Quick order tracker dropdown */}
            {trackingOrders.length > 0 ? (
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-zinc-400">Rastrear Entrega:</span>
                <select
                  onChange={(e) => {
                    const ord = orders.find(o => o.id === e.target.value);
                    setSelectedOrder(ord || null);
                    if (ord && ord.deliveryPartnerId) {
                      const drv = drivers.find(d => d.id === ord.deliveryPartnerId);
                      if (drv) setSelectedDriver(drv);
                    }
                  }}
                  className="bg-zinc-900 border border-zinc-800 text-[10px] text-amber-400 py-1 px-2.5 rounded-lg focus:outline-none focus:border-amber-500"
                >
                  <option value="">Selecciona Pedido Activo</option>
                  {trackingOrders.map(o => (
                    <option key={o.id} value={o.id}>Orden #{o.id.replace('order-','')} ({o.clientName})</option>
                  ))}
                </select>
              </div>
            ) : (
              <span className="text-[10px] text-zinc-500 bg-zinc-900/50 border border-zinc-800 px-3 py-1 rounded-full">
                No hay pedidos en despacho
              </span>
            )}
          </div>

          {/* Interactive stylized high-fidelity Map canvas mockup */}
          <div className="flex-1 bg-zinc-950 relative overflow-hidden flex items-center justify-center p-4 group">
            {/* Grid line mapping patterns representing streets */}
            <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:30px_30px]" />

            {/* Simulated streets / roads network SVG */}
            <svg className="absolute inset-0 w-full h-full text-zinc-800" xmlns="http://www.w3.org/2000/svg">
              {/* Main avenues */}
              <line x1="10%" y1="0" x2="10%" y2="100%" stroke="currentColor" strokeWidth="3" />
              <line x1="50%" y1="0" x2="50%" y2="100%" stroke="currentColor" strokeWidth="4" strokeDasharray="5,5" />
              <line x1="90%" y1="0" x2="90%" y2="100%" stroke="currentColor" strokeWidth="3" />
              <line x1="0" y1="30%" x2="100%" y2="30%" stroke="currentColor" strokeWidth="3" />
              <line x1="0" y1="70%" x2="100%" y2="70%" stroke="currentColor" strokeWidth="3" />

              {/* Diagonal Calle 85 */}
              <path d="M 0,100 L 400,200 L 800,350" fill="none" stroke="#222" strokeWidth="6" />
              <path d="M 0,100 L 400,200 L 800,350" fill="none" stroke="currentColor" strokeWidth="2" />

              {/* Draw simulated route if an order is highlighted */}
              {selectedOrder && (
                <>
                  {/* Draw neon gold glowing line from business location (center: 50%, 45%) to order destination */}
                  <path
                    d={`M 350,220 L 480,180 L ${selectedOrder.id === 'order-101' ? '580,120' : selectedOrder.id === 'order-102' ? '620,290' : '220,180'}`}
                    fill="none"
                    stroke="#D4AF37"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeDasharray="8,5"
                    className="animate-pulse"
                  />
                </>
              )}
            </svg>

            {/* Central landmark: Restaurant (Ghost Express Headquarters) */}
            <div className="absolute left-[340px] top-[200px] flex flex-col items-center group/hq cursor-pointer z-10">
              <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center border-2 border-black shadow-lg shadow-amber-500/40 relative animate-bounce">
                <Store className="w-4 h-4 text-black" />
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-black" />
                </span>
              </div>
              <span className="bg-black text-[9px] text-amber-400 font-mono font-bold px-1.5 py-0.5 rounded border border-amber-500/30 mt-1 select-none">
                GHOST HQ
              </span>
            </div>

            {/* Drivers markers */}
            {drivers.map(d => {
              if (d.status === 'offline') return null;

              // Map coordinates to simple CSS offsets
              // Bogota coordinate anchors around: lat 4.65, lng -74.06
              const latDiff = (d.lat - 4.6540) * 1500;
              const lngDiff = (d.lng + -74.0560) * 1500;

              const xOffset = Math.min(Math.max(350 + lngDiff, 30), 750);
              const yOffset = Math.min(Math.max(220 - latDiff, 30), 450);

              const isSelected = selectedDriver?.id === d.id;

              return (
                <div
                  key={d.id}
                  onClick={() => setSelectedDriver(d)}
                  style={{ left: `${xOffset}px`, top: `${yOffset}px` }}
                  className={`absolute flex flex-col items-center cursor-pointer transition-all duration-1000 z-20`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 shadow-md relative ${
                    isSelected
                      ? 'bg-amber-400 border-black ring-4 ring-amber-500/20 scale-110'
                      : 'bg-[#121212] border-amber-500/60'
                  }`}>
                    <img src={d.photo} alt="" className="w-full h-full rounded-full object-cover" />
                    <span className="absolute -bottom-1 -right-1 bg-black text-[8px] p-0.5 rounded-full border border-zinc-800">
                      {d.vehicle === 'moto' ? '🏍️' : d.vehicle === 'bici' ? '🚴' : '🚗'}
                    </span>
                  </div>
                  <span className="bg-black/90 text-[8px] text-zinc-300 font-bold px-1 py-0.5 rounded border border-zinc-800/80 mt-1 shadow truncate max-w-[80px]">
                    {d.name.split(' ')[0]}
                  </span>
                </div>
              );
            })}

            {/* Targeted destination marker for active tracked order */}
            {selectedOrder && (
              <div
                style={{
                  left: `${selectedOrder.id === 'order-101' ? '580' : selectedOrder.id === 'order-102' ? '620' : '220'}px`,
                  top: `${selectedOrder.id === 'order-101' ? '120' : selectedOrder.id === 'order-102' ? '290' : '180'}px`
                }}
                className="absolute flex flex-col items-center z-10"
              >
                <div className="w-7 h-7 rounded-full bg-red-500 flex items-center justify-center border-2 border-black text-white animate-pulse shadow-lg shadow-red-500/30">
                  📍
                </div>
                <span className="bg-red-500 text-black text-[8px] font-bold px-1.5 py-0.5 rounded border border-black mt-1">
                  Cliente #{selectedOrder.id.replace('order-', '')}
                </span>
              </div>
            )}
          </div>

          {/* Map stats banner footer */}
          <div className="p-4 bg-zinc-950 border-t border-zinc-800 grid grid-cols-3 gap-4 text-center">
            <div>
              <span className="text-[10px] text-zinc-500 font-mono">REPARTIDOR SELECCIONADO</span>
              <p className="text-xs font-bold text-white mt-0.5">{selectedDriver?.name || 'Ninguno'}</p>
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 font-mono">COORDENADAS LIVE GPS</span>
              <p className="text-xs font-mono font-bold text-amber-500 mt-0.5">
                {selectedDriver?.lat ? `${selectedDriver.lat}, ${selectedDriver.lng}` : '---'}
              </p>
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 font-mono">ESTADÍSTICAS RUTA</span>
              <p className="text-xs font-bold text-white mt-0.5">
                {selectedOrder
                  ? `${calculateDistanceKm(mapCenter.lat, mapCenter.lng, selectedOrder.lat, selectedOrder.lng)} km • ~15 min`
                  : 'Fija un pedido para medir'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
