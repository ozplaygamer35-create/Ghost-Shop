import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  User,
  Store,
  ShoppingBag,
  Clock,
  MapPin,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Activity,
  ClipboardList,
  Calculator
} from 'lucide-react';

export default function Sidebar() {
  const { currentView, setCurrentView, user, logout, orders, notifications, business } = useApp();

  const activeOrdersCount = orders.filter(o => o.status === 'received').length;

  const menuItems = [
    { id: 'inicio', label: 'Inicio', icon: LayoutDashboard },
    { id: 'pedidos', label: 'Pedidos', icon: ClipboardList, badge: activeOrdersCount },
    { id: 'caja', label: 'Caja Registradora', icon: Calculator },
    { id: 'perfil', label: 'Mi Perfil', icon: User },
    { id: 'negocio', label: 'Mi Negocio', icon: Store },
    { id: 'productos', label: 'Productos', icon: ShoppingBag },
    { id: 'chat', label: 'Canal Chat', icon: MessageSquare },
    { id: 'estadisticas', label: 'Estadísticas', icon: BarChart3 },
  ];

  return (
    <aside className="w-64 bg-[#0a0a0a] border-r border-amber-500/20 flex flex-col justify-between h-screen sticky top-0 text-white select-none">
      <div className="flex flex-col overflow-y-auto flex-1">
        {/* Brand logo */}
        <div className="p-6 border-b border-amber-500/10 flex items-center gap-3">
          {business?.logoUrl ? (
            <img
              src={business.logoUrl}
              alt="Logo"
              className="w-10 h-10 rounded-xl object-cover border border-amber-500/30 shadow-lg shadow-amber-500/10"
            />
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
              <Activity className="w-6 h-6 text-black" />
            </div>
          )}
          <div className="overflow-hidden">
            <h1 className="font-bold text-sm tracking-tight font-sans text-amber-400 truncate w-40">
              {business?.name || 'GHOST'}
            </h1>
            <span className="text-[9px] tracking-widest text-zinc-500 font-mono font-bold block uppercase">ADMINISTRACIÓN</span>
          </div>
        </div>

        {/* User Info Quick View */}
        {user && (
          <div className="p-4 mx-4 my-3 bg-zinc-900/50 rounded-xl border border-zinc-800/80 flex items-center gap-3">
            {user.photoUrl ? (
              <img
                src={user.photoUrl}
                alt="Avatar"
                className="w-9 h-9 rounded-lg object-cover border border-zinc-800 shrink-0"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-bold text-amber-400 shrink-0">
                {user.name[0]?.toUpperCase() || 'A'}
              </div>
            )}
            <div className="overflow-hidden">
              <p className="text-xs font-semibold truncate text-zinc-200">
                {user.name} {user.lastname}
              </p>
              <p className="text-[10px] text-amber-500/80 font-mono capitalize">Administrador</p>
            </div>
          </div>
        )}

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-item-${item.id}`}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500/10 to-transparent text-amber-400 border-l-2 border-amber-500 font-semibold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-amber-400' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && item.badge > 0 ? (
                  <span className="bg-amber-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg shadow-amber-500/20">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer log out button */}
      <div className="p-4 border-t border-amber-500/10 bg-[#070707]">
        <button
          id="btn-logout"
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-zinc-400 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200"
        >
          <LogOut className="w-5 h-5 text-zinc-500 group-hover:text-red-400" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
