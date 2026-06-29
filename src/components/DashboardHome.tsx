import React from 'react';
import { useApp } from '../context/AppContext';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  DollarSign,
  AlertCircle,
  Play,
  RotateCw,
  Clock,
  ArrowRight,
  Sparkles,
  MapPin,
  Bell,
  Store
} from 'lucide-react';

export default function DashboardHome() {
  const {
    orders,
    products,
    drivers,
    simulateNewOrder,
    simulateDriverMovement,
    notifications,
    clearNotifications,
    isRealtimeSyncing,
    setCurrentView,
    business
  } = useApp();

  // Calculations
  const receivedOrders = orders.filter(o => o.status === 'received');
  const activeOrders = orders.filter(o => o.status !== 'delivered' && o.status !== 'canceled');
  const completedOrdersCount = orders.filter(o => o.status === 'delivered').length;

  const totalSalesToday = orders
    .filter(o => o.status === 'delivered')
    .reduce((sum, o) => sum + o.total, 0);

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Upper Welcome Banner */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-950 to-zinc-900 border border-amber-500/10 p-6 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -z-10" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-amber-500 font-mono tracking-wider uppercase mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Sincronización Activa en Tiempo Real
            </div>
            <h2 className="text-2xl font-bold font-sans text-white">¡Hola, {business.name}!</h2>
            <p className="text-zinc-400 text-sm mt-1">Este es el panel principal de {business.name}. Gestiona tus productos, perfiles, estadísticas y comunícate vía chat.</p>
          </div>
        </div>
      </div>

      {/* Main Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Products Card */}
        <div className="bg-[#121212] border border-zinc-800/80 p-5 rounded-2xl flex items-center justify-between group hover:border-amber-500/30 transition-all">
          <div className="space-y-1">
            <span className="text-xs font-medium text-zinc-500">Productos del Menú</span>
            <p className="text-xl font-bold font-mono text-white">{products.length}</p>
            <span className="text-[10px] text-zinc-400">
              {products.filter(p => p.available).length} disponibles en carta
            </span>
          </div>
          <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-500/20 text-amber-400">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Active Team/Drivers Card */}
        <div className="bg-[#121212] border border-zinc-800/80 p-5 rounded-2xl flex items-center justify-between group hover:border-amber-500/30 transition-all">
          <div className="space-y-1">
            <span className="text-xs font-medium text-zinc-500">Canales de Chat Activos</span>
            <p className="text-xl font-bold font-mono text-white">
              {drivers.length}
            </p>
            <span className="text-[10px] text-zinc-400">
              Repartidores y equipo listos
            </span>
          </div>
          <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20 text-emerald-400">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Sync Status Card */}
        <div className="bg-[#121212] border border-zinc-800/80 p-5 rounded-2xl flex items-center justify-between group hover:border-amber-500/30 transition-all">
          <div className="space-y-1">
            <span className="text-xs font-medium text-zinc-500">Estado Firebase Cloud</span>
            <p className="text-sm font-bold text-white flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isRealtimeSyncing ? 'bg-emerald-500' : 'bg-amber-400'}`} />
              {isRealtimeSyncing ? 'Conectado a la Nube' : 'Modo Simulación'}
            </p>
            <span className="text-[10px] text-zinc-500">Sincronización móvil activa</span>
          </div>
          <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center border border-purple-500/20 text-purple-400">
            <RotateCw className="w-5 h-5 animate-spin-slow" />
          </div>
        </div>
      </div>

      {/* Main Grid: Shortcuts & notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Quick Panel Actions */}
        <div className="bg-[#121212] border border-zinc-800 p-6 rounded-2xl lg:col-span-7 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-base text-zinc-100 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                Accesos Rápidos del Negocio
              </h3>
            </div>

            <p className="text-xs text-zinc-400 mb-4">
              Gestiona los diferentes módulos de {business.name} de forma rápida y eficiente:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
              <button
                onClick={() => setCurrentView('productos')}
                className="bg-zinc-900/60 border border-zinc-800/80 hover:border-amber-500/20 rounded-xl p-4 flex items-center gap-3 transition-all text-left group"
              >
                <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center text-amber-400 group-hover:bg-amber-500/20">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-200">Menú de Productos</h4>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Crear, editar y organizar</p>
                </div>
              </button>

              <button
                onClick={() => setCurrentView('negocio')}
                className="bg-zinc-900/60 border border-zinc-800/80 hover:border-amber-500/20 rounded-xl p-4 flex items-center gap-3 transition-all text-left group"
              >
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-400 group-hover:bg-blue-500/20">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-200">Perfil de Negocio</h4>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Horarios, logo y coberturas</p>
                </div>
              </button>

              <button
                onClick={() => setCurrentView('chat')}
                className="bg-zinc-900/60 border border-zinc-800/80 hover:border-amber-500/20 rounded-xl p-4 flex items-center gap-3 transition-all text-left group"
              >
                <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/20">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-200">Canal de Chat</h4>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Mensajería activa</p>
                </div>
              </button>

              <button
                onClick={() => setCurrentView('estadisticas')}
                className="bg-zinc-900/60 border border-zinc-800/80 hover:border-amber-500/20 rounded-xl p-4 flex items-center gap-3 transition-all text-left group"
              >
                <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-400 group-hover:bg-purple-500/20">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-200">Estadísticas</h4>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Métricas de rendimiento</p>
                </div>
              </button>
            </div>
          </div>

          <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-800/50 mt-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
            <p className="text-xs text-zinc-400 leading-relaxed">
              La base de datos de Firebase Firestore está conectada para sincronizar todos tus cambios de productos y configuraciones en vivo con tus clientes.
            </p>
          </div>
        </div>

        {/* Right Side: Log feed Notifications */}
        <div className="bg-[#121212] border border-zinc-800 p-6 rounded-2xl lg:col-span-5 flex flex-col h-[380px]">
          <div className="flex justify-between items-center border-b border-zinc-800 pb-3 mb-3">
            <h3 className="font-semibold text-base text-zinc-100 flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-500" />
              Sincronización en Vivo (Logs)
            </h3>
            {notifications.length > 0 && (
              <button
                onClick={clearNotifications}
                className="text-zinc-500 hover:text-zinc-300 text-xs font-medium"
              >
                Limpiar
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="h-full flex items-center justify-center text-center text-zinc-500">
                <p className="text-xs leading-relaxed">No hay eventos recientes.<br />Haz algún cambio en productos o chatea para ver logs en tiempo real.</p>
              </div>
            ) : (
              notifications.map((notif, idx) => (
                <div key={idx} className="bg-zinc-950/80 border border-zinc-900/50 p-2.5 rounded-lg flex items-start gap-2.5 animate-fadeIn">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <p className="text-xs text-zinc-300 font-mono leading-relaxed select-all">{notif}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
