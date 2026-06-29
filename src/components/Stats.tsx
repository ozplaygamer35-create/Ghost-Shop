import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Activity,
  ShoppingBag,
  UserCheck,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export default function Stats() {
  const { orders } = useApp();

  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month' | 'year'>('week');

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(val);
  };

  // Calculations based on orders
  const totalOrdersCount = orders.length;
  const deliveredOrders = orders.filter(o => o.status === 'delivered');
  const deliveredOrdersCount = deliveredOrders.length;
  const canceledOrdersCount = orders.filter(o => o.status === 'canceled').length;

  const totalRevenue = deliveredOrders.reduce((sum, o) => sum + o.total, 0);
  const platformCommissions = totalRevenue * 0.15; // 15% platform commission
  const netEarnings = totalRevenue - platformCommissions;

  // Static stats dataset for timeframe toggling
  const statsData = {
    day: {
      sales: 320000,
      orders: 14,
      avgTicket: 22800,
      chartValues: [45, 78, 52, 90, 110, 85, 120],
      chartLabels: ['8am', '10am', '12pm', '2pm', '4pm', '6pm', '8pm']
    },
    week: {
      sales: totalRevenue || 2240000,
      orders: totalOrdersCount || 82,
      avgTicket: 27300,
      chartValues: [120, 240, 180, 310, 290, 420, 380],
      chartLabels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
    },
    month: {
      sales: 9800000,
      orders: 345,
      avgTicket: 28400,
      chartValues: [310, 450, 620, 780, 890, 1100],
      chartLabels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6']
    },
    year: {
      sales: 118000000,
      orders: 4120,
      avgTicket: 28600,
      chartValues: [24, 38, 51, 62, 58, 75, 89, 95, 110, 125, 140, 160],
      chartLabels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
    }
  };

  const activeData = statsData[timeframe];

  // Custom high-fidelity interactive SVG chart rendering helpers
  const maxVal = Math.max(...activeData.chartValues);
  const chartHeight = 160;
  const chartWidth = 500;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber-500" />
            Centro de Estadísticas & Inteligencia
          </h2>
          <p className="text-xs text-zinc-500 mt-1">Análisis profundo de tus ventas, tasas de entrega, clientes frecuentes y comisiones de GHOST SHOP.</p>
        </div>

        {/* Timeframe selector */}
        <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800 select-none">
          {(['day', 'week', 'month', 'year'] as const).map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                timeframe === tf
                  ? 'bg-amber-500 text-black shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {tf === 'day' ? 'Hoy' : tf === 'week' ? 'Semana' : tf === 'month' ? 'Mes' : 'Año'}
            </button>
          ))}
        </div>
      </div>

      {/* Numerical Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Total revenue */}
        <div className="bg-[#121212] border border-zinc-800/80 p-5 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl" />
          <div className="space-y-2">
            <span className="text-xs text-zinc-500 font-medium">Ingresos Brutos ({timeframe})</span>
            <p className="text-2xl font-black font-mono text-white">{formatCOP(activeData.sales)}</p>
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold">
              <ArrowUpRight className="w-4 h-4" /> +18.2% incremento semanal
            </div>
          </div>
        </div>

        {/* Platform commissions */}
        <div className="bg-[#121212] border border-zinc-800/80 p-5 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl" />
          <div className="space-y-2">
            <span className="text-xs text-zinc-500 font-medium">Comisión de Plataforma (15%)</span>
            <p className="text-2xl font-black font-mono text-amber-500">{formatCOP(activeData.sales * 0.15)}</p>
            <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
              Retenido automáticamente en pasarela
            </div>
          </div>
        </div>

        {/* Net earnings */}
        <div className="bg-[#121212] border border-zinc-800/80 p-5 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl" />
          <div className="space-y-2">
            <span className="text-xs text-zinc-500 font-medium">Ganancias Netas para Ti</span>
            <p className="text-2xl font-black font-mono text-emerald-400">{formatCOP(activeData.sales * 0.85)}</p>
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold">
              <CheckCircle className="w-3.5 h-3.5" /> Transferible a Nequi / Bancolombia
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Daily sales line/area SVG chart */}
        <div className="bg-[#121212] border border-zinc-800 p-6 rounded-2xl lg:col-span-8 space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-850 pb-3">
            <h3 className="font-semibold text-sm text-zinc-100 flex items-center gap-2">
              <TrendingUp className="w-4.5 h-4.5 text-amber-400" />
              Tendencia de Ventas Facturadas
            </h3>
            <span className="text-[10px] text-zinc-400 bg-zinc-950 px-2 py-1 rounded border border-zinc-800 font-mono">
              Expresado en COP
            </span>
          </div>

          {/* Render Area SVG Chart */}
          <div className="h-52 w-full flex items-end justify-center pt-4 relative">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Grid Background lines */}
              <line x1="0" y1={chartHeight * 0.25} x2={chartWidth} y2={chartHeight * 0.25} stroke="#1f1f1f" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="0" y1={chartHeight * 0.5} x2={chartWidth} y2={chartHeight * 0.5} stroke="#1f1f1f" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="0" y1={chartHeight * 0.75} x2={chartWidth} y2={chartHeight * 0.75} stroke="#1f1f1f" strokeWidth="1" strokeDasharray="3,3" />

              {/* Draw area filled polygon */}
              <polygon
                points={`
                  0,${chartHeight}
                  ${activeData.chartValues.map((v, i) => {
                    const x = (i / (activeData.chartValues.length - 1)) * chartWidth;
                    const y = chartHeight - (v / maxVal) * (chartHeight - 20);
                    return `${x},${y}`;
                  }).join(' ')}
                  ${chartWidth},${chartHeight}
                `}
                fill="url(#chartGrad)"
              />

              {/* Draw upper stroke path line */}
              <polyline
                fill="none"
                stroke="#D4AF37"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={activeData.chartValues.map((v, i) => {
                  const x = (i / (activeData.chartValues.length - 1)) * chartWidth;
                  const y = chartHeight - (v / maxVal) * (chartHeight - 20);
                  return `${x},${y}`;
                }).join(' ')}
              />

              {/* Draw dot markers on points */}
              {activeData.chartValues.map((v, i) => {
                const x = (i / (activeData.chartValues.length - 1)) * chartWidth;
                const y = chartHeight - (v / maxVal) * (chartHeight - 20);
                return (
                  <g key={i} className="group/dot cursor-pointer">
                    <circle cx={x} cy={y} r="5" fill="#D4AF37" stroke="#121212" strokeWidth="2" />
                    <circle cx={x} cy={y} r="9" fill="#D4AF37" className="opacity-0 group-hover/dot:opacity-20 transition-opacity" />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Chart X Labels bar */}
          <div className="flex justify-between px-2 text-[10px] text-zinc-500 font-mono">
            {activeData.chartLabels.map((lbl, idx) => (
              <span key={idx}>{lbl}</span>
            ))}
          </div>
        </div>

        {/* Top items & client statistics */}
        <div className="bg-[#121212] border border-zinc-800 p-6 rounded-2xl lg:col-span-4 space-y-6">
          <h3 className="font-semibold text-sm text-zinc-100 border-b border-zinc-850 pb-3 flex items-center gap-2">
            <ShoppingBag className="w-4.5 h-4.5 text-amber-500" />
            Los Más Vendidos 🔥
          </h3>

          <div className="space-y-4">
            {/* Mock sold item progress loops */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-zinc-300">Hamburguesa Ghost Premium</span>
                <span className="text-amber-400 font-mono">145 pedidos</span>
              </div>
              <div className="w-full bg-zinc-950 rounded-full h-2 border border-zinc-900">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '85%' }} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-zinc-300">Pizza Pepperoni Especial</span>
                <span className="text-amber-400 font-mono">92 pedidos</span>
              </div>
              <div className="w-full bg-zinc-950 rounded-full h-2 border border-zinc-900">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '60%' }} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-zinc-300">Tacos de Birria</span>
                <span className="text-amber-400 font-mono">78 pedidos</span>
              </div>
              <div className="w-full bg-zinc-950 rounded-full h-2 border border-zinc-900">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '48%' }} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-zinc-300">Malteada de Nutella & Oreo</span>
                <span className="text-amber-400 font-mono">35 pedidos</span>
              </div>
              <div className="w-full bg-zinc-950 rounded-full h-2 border border-zinc-900">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '22%' }} />
              </div>
            </div>
          </div>

          {/* Frequent / loyal clients widget */}
          <div className="border-t border-zinc-850 pt-4 space-y-3">
            <h4 className="text-[10px] font-bold font-mono text-zinc-500 uppercase tracking-widest">Tasa de Fidelización</h4>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">Clientes Nuevos</span>
              <span className="font-bold text-white font-mono">24%</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">Clientes Recurrentes</span>
              <span className="font-bold text-amber-400 font-mono">76%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Operational Efficiency metrics */}
      <div className="bg-[#121212] border border-zinc-800 p-6 rounded-2xl">
        <h3 className="font-semibold text-sm text-zinc-100 border-b border-zinc-850 pb-3 mb-4 flex items-center gap-2">
          <Activity className="w-4.5 h-4.5 text-emerald-400" />
          Eficiencia de Entregas & Logística Domiciliaria
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-zinc-950/40 border border-zinc-900 rounded-xl space-y-1">
            <p className="text-[10px] text-zinc-500 font-mono uppercase">Tiempo Promedio de Entrega</p>
            <p className="text-lg font-black font-mono text-white">28 min</p>
            <p className="text-[10px] text-emerald-400 flex items-center gap-0.5"><TrendingUp className="w-3 h-3" /> -3 min vs mes pasado</p>
          </div>

          <div className="p-4 bg-zinc-950/40 border border-zinc-900 rounded-xl space-y-1">
            <p className="text-[10px] text-zinc-500 font-mono uppercase">Tasa de Entrega Exitosa</p>
            <p className="text-lg font-black font-mono text-white">98.4%</p>
            <p className="text-[10px] text-emerald-400 flex items-center gap-0.5"><CheckCircle className="w-3 h-3" /> Máxima eficiencia</p>
          </div>

          <div className="p-4 bg-zinc-950/40 border border-zinc-900 rounded-xl space-y-1">
            <p className="text-[10px] text-zinc-500 font-mono uppercase">Pedidos Entregados ({timeframe})</p>
            <p className="text-lg font-black font-mono text-amber-500">{deliveredOrdersCount || 12}</p>
            <p className="text-[10px] text-zinc-500">Completados sin anomalía</p>
          </div>

          <div className="p-4 bg-zinc-950/40 border border-zinc-900 rounded-xl space-y-1">
            <p className="text-[10px] text-zinc-500 font-mono uppercase">Pedidos Cancelados ({timeframe})</p>
            <p className="text-lg font-black font-mono text-red-400">{canceledOrdersCount || 1}</p>
            <p className="text-[10px] text-zinc-500">Tasa de cancelación: 1.2%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
