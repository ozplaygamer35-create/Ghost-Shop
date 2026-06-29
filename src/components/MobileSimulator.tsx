import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Smartphone,
  Wifi,
  Battery,
  Search,
  ShoppingBag,
  Clock,
  ChevronRight,
  ArrowLeft,
  Bike,
  Compass,
  MessageCircle,
  Activity,
  Heart
} from 'lucide-react';

export default function MobileSimulator() {
  const { products, orders, drivers, chats, business } = useApp();

  const [simView, setSimView] = useState<'store'>('store');
  const [pulseProduct, setPulseProduct] = useState<string | null>(null);
  const [prevProducts, setPrevProducts] = useState<any[]>([]);

  // Detect price changes or additions to flash a gold pulse effect on the phone screen!
  useEffect(() => {
    if (prevProducts.length > 0 && products.length > 0) {
      products.forEach(p => {
        const prev = prevProducts.find(old => old.id === p.id);
        if (prev && (prev.price !== p.price || prev.discountPrice !== p.discountPrice || prev.available !== p.available)) {
          // Flash a pulse animation on the mobile UI to demonstrate active real-time sync!
          setPulseProduct(p.id);
          const t = setTimeout(() => setPulseProduct(null), 1500);
          return () => clearTimeout(t);
        }
      });
    }
    setPrevProducts(products);
  }, [products]);

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="w-[320px] shrink-0 hidden xl:flex flex-col select-none">
      {/* Device wrapper */}
      <div className="border-[8px] border-zinc-900 bg-[#070707] rounded-[44px] h-[640px] w-[310px] shadow-2xl relative overflow-hidden flex flex-col justify-between border-slate-900/40 ring-4 ring-zinc-950">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-zinc-900 rounded-b-2xl z-30 flex items-center justify-center">
          <div className="w-16 h-1.5 bg-black rounded-full" />
        </div>

        {/* Status Bar */}
        <div className="pt-7 px-6 pb-2 bg-zinc-950 flex justify-between items-center text-[10px] text-zinc-400 font-semibold font-mono z-20 shrink-0">
          <span>04:20 PM</span>
          <div className="flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-[8px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 px-1 rounded">5G</span>
            <Battery className="w-4 h-4 text-zinc-400" />
          </div>
        </div>

        {/* Main Phone Screen View Router */}
        <div className="flex-1 overflow-y-auto bg-[#0a0a0a] flex flex-col custom-scrollbar relative">
          
          {/* Header depending on view */}
          <div className="p-4 bg-zinc-950 border-b border-zinc-900 space-y-3 shrink-0">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-amber-400 font-mono tracking-wide uppercase">APP CLIENTE</span>
              </div>
              <ShoppingBag className="w-4 h-4 text-zinc-400" />
            </div>

            {/* Business Name Header */}
            <div className="flex items-center gap-2.5">
              <img src={business.logoUrl} alt="" className="w-8 h-8 rounded-lg object-cover" />
              <div className="overflow-hidden">
                <h4 className="text-xs font-black text-white truncate">{business.name}</h4>
                <p className="text-[8px] text-zinc-500 truncate">{business.schedule}</p>
              </div>
            </div>

            {/* Mini Search Bar mockup */}
            <div className="relative">
              <Search className="w-3 h-3 text-zinc-600 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <div className="w-full bg-zinc-900 rounded-lg py-1.5 pl-7 pr-3 text-[9px] text-zinc-500 font-medium">
                Buscar en el menú...
              </div>
            </div>
          </div>

          {/* View: Products Store list */}
          <div className="p-3 space-y-3 flex-1">
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-black text-zinc-400 uppercase tracking-wider font-mono">Menú en Vivo</span>
            </div>

            {/* Dynamic list of products from parent state */}
            <div className="space-y-2">
              {products.filter(p => p.status === 'active' && p.available).map((p) => {
                const isPulsing = pulseProduct === p.id;
                return (
                  <div
                    key={p.id}
                    className={`bg-zinc-950 border p-2 rounded-xl flex items-center gap-3 transition-all duration-300 ${
                      isPulsing ? 'border-amber-400 shadow-lg shadow-amber-500/10 scale-[1.02]' : 'border-zinc-900'
                    }`}
                  >
                    <img src={p.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1 overflow-hidden">
                      <h5 className="text-[10px] font-bold text-zinc-100 truncate">{p.name}</h5>
                      <p className="text-[8px] text-zinc-500 truncate leading-relaxed">{p.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {p.discountPrice ? (
                          <>
                            <span className="text-[10px] font-bold font-mono text-amber-400">{formatCOP(p.discountPrice)}</span>
                            <span className="text-[8px] text-zinc-600 font-mono line-through">{formatCOP(p.price)}</span>
                          </>
                        ) : (
                          <span className="text-[10px] font-bold font-mono text-white">{formatCOP(p.price)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Home Button Indicator */}
        <div className="p-2 bg-zinc-950 border-t border-zinc-900 flex justify-center shrink-0">
          <button
            className="w-20 h-1 bg-zinc-800 hover:bg-zinc-700 rounded-full transition-colors"
          />
        </div>
      </div>
    </div>
  );
}
