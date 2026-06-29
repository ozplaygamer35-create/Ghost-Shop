import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar as CalendarIcon,
  Calculator as CalculatorIcon,
  PlusCircle,
  MinusCircle,
  DollarSign,
  User,
  TrendingUp,
  TrendingDown,
  Lock,
  Unlock,
  Clipboard,
  Check,
  Briefcase,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { CashRegister, CashTransaction } from '../types';

export default function Caja() {
  const {
    registers,
    createCashRegister,
    addRegisterTransaction,
    closeCashRegister,
    orders
  } = useApp();

  // Calendar State (Defaults to June 2026)
  const [selectedDateStr, setSelectedDateStr] = useState<string>('2026-06-28');
  
  // New Cash Register Form States
  const [showOpenForm, setShowOpenForm] = useState(false);
  const [newRegName, setNewRegName] = useState('Caja Principal');
  const [newRegWorker, setNewRegWorker] = useState('');
  const [newRegBase, setNewRegBase] = useState('150000');
  
  // New Manual Transaction Form States
  const [txType, setTxType] = useState<'income' | 'expense'>('expense');
  const [txAmount, setTxAmount] = useState('');
  const [txDesc, setTxDesc] = useState('');

  // Closing Note State
  const [closingNotes, setClosingNotes] = useState('');
  const [showCloseModal, setShowCloseModal] = useState<string | null>(null);

  // Calculator State
  const [calcDisplay, setCalcDisplay] = useState('0');
  const [calcMemory, setCalcMemory] = useState<string | null>(null);
  const [calcOp, setCalcOp] = useState<string | null>(null);
  const [calcClearOnNext, setCalcClearOnNext] = useState(false);

  // Colombia Holidays in June 2026
  const COLOMBIA_HOLIDAYS_JUNE_2026: { [day: number]: string } = {
    8: 'Corpus Christi',
    15: 'Sagrado Corazón de Jesús',
    29: 'San Pedro y San Pablo'
  };

  // Generate June 2026 Days (June 1st, 2026 was a Monday, June has 30 days)
  const juneDays = Array.from({ length: 30 }, (_, i) => i + 1);

  // Filter registers for the selected date
  const selectedRegisters = registers.filter(r => r.date === selectedDateStr);
  
  // Find currently selected active register in detail view (defaults to the first one on the selected day or any active open register)
  const [activeTabRegId, setActiveTabRegId] = useState<string | null>(() => {
    const openReg = registers.find(r => r.status === 'open');
    return openReg ? openReg.id : (registers[0]?.id || null);
  });

  const selectedRegister = registers.find(r => r.id === activeTabRegId) || registers.find(r => r.date === selectedDateStr) || registers[0];

  // Quick balancing calculation helper for a register
  const getRegisterStats = (reg: CashRegister) => {
    if (!reg) return { sales: 0, incomes: 0, expenses: 0, total: 0 };
    const sales = reg.transactions
      .filter(t => t.type === 'sale')
      .reduce((sum, t) => sum + t.amount, 0);
    const incomes = reg.transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = reg.transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const total = reg.baseCash + sales + incomes - expenses;
    return { sales, incomes, expenses, total };
  };

  const regStats = selectedRegister ? getRegisterStats(selectedRegister) : { sales: 0, incomes: 0, expenses: 0, total: 0 };

  // Calculator logic
  const handleCalcNum = (num: string) => {
    if (calcDisplay === '0' || calcClearOnNext) {
      setCalcDisplay(num);
      setCalcClearOnNext(false);
    } else {
      setCalcDisplay(calcDisplay + num);
    }
  };

  const handleCalcOp = (op: string) => {
    setCalcMemory(calcDisplay);
    setCalcOp(op);
    setCalcClearOnNext(true);
  };

  const handleCalcEqual = () => {
    if (!calcOp || !calcMemory) return;
    const prev = parseFloat(calcMemory);
    const current = parseFloat(calcDisplay);
    let result = 0;
    switch (calcOp) {
      case '+': result = prev + current; break;
      case '-': result = prev - current; break;
      case '*': result = prev * current; break;
      case '/': result = current !== 0 ? prev / current : 0; break;
    }
    setCalcDisplay(String(result));
    setCalcOp(null);
    setCalcMemory(null);
    setCalcClearOnNext(true);
  };

  const handleCalcClear = () => {
    setCalcDisplay('0');
    setCalcOp(null);
    setCalcMemory(null);
  };

  // Quick copy from calculator directly into manual transaction amount input
  const copyCalcToAmount = () => {
    const numericValue = parseFloat(calcDisplay);
    if (!isNaN(numericValue) && numericValue > 0) {
      setTxAmount(String(Math.floor(numericValue)));
    }
  };

  // Form Handlers
  const handleOpenRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRegWorker.trim()) {
      alert('Por favor ingresa el nombre de la persona encargada.');
      return;
    }
    const baseVal = parseFloat(newRegBase) || 0;
    createCashRegister(newRegName, newRegWorker, baseVal, selectedDateStr);
    setShowOpenForm(false);
    setNewRegWorker('');
    // Switch view tab to the newly created register
    setTimeout(() => {
      const updatedOpen = registers.find(r => r.status === 'open');
      if (updatedOpen) {
        setActiveTabRegId(updatedOpen.id);
      } else {
        // Fallback to latest
        setActiveTabRegId('reg-' + Date.now());
      }
    }, 100);
  };

  const handleAddTxSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRegister) return;
    const amt = parseFloat(txAmount) || 0;
    if (amt <= 0) {
      alert('Ingresa un monto válido mayor a 0 COP');
      return;
    }
    if (!txDesc.trim()) {
      alert('Por favor escribe una descripción clara de la transacción.');
      return;
    }
    addRegisterTransaction(selectedRegister.id, txType, amt, txDesc);
    setTxAmount('');
    setTxDesc('');
  };

  const handleCloseRegisterSubmit = () => {
    if (!showCloseModal) return;
    closeCashRegister(showCloseModal, closingNotes);
    setShowCloseModal(null);
    setClosingNotes('');
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Global Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-900 pb-5">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2 tracking-tight">
            <Sparkles className="w-5 h-5 text-amber-500 animate-pulse shrink-0" />
            CAJA & CONTROL DIARIO
          </h1>
          <p className="text-zinc-500 text-xs mt-1">
            Gestión de turnos de trabajadores, bases, gastos y balances automáticos integrados con pedidos.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowOpenForm(!showOpenForm)}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold text-xs rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-amber-500/10 shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            Abrir Nueva Caja
          </button>
        </div>
      </div>

      {/* Grid Layout for Main Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COL 1: 2026 Calendar (Colombia) & Caja Selection list */}
        <div className="space-y-6 lg:col-span-1">
          {/* Colombia 2026 June Calendar Card */}
          <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-4 space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
              <span className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                <CalendarIcon className="w-4 h-4 text-amber-500" />
                Junio 2026 (Colombia)
              </span>
              <span className="text-[10px] text-zinc-500 font-mono italic">Zona Horaria: COT</span>
            </div>

            {/* Days Grid Headers */}
            <div className="grid grid-cols-7 text-center text-[10px] text-zinc-600 font-semibold">
              <span>L</span>
              <span>M</span>
              <span>M</span>
              <span>J</span>
              <span>V</span>
              <span>S</span>
              <span>D</span>
            </div>

            {/* Calendar grid cells */}
            <div className="grid grid-cols-7 gap-1">
              {juneDays.map(day => {
                const dateStr = `2026-06-${day.toString().padStart(2, '0')}`;
                const isSelected = selectedDateStr === dateStr;
                const isHoliday = !!COLOMBIA_HOLIDAYS_JUNE_2026[day];
                
                // Count registers on this day
                const countOnThisDay = registers.filter(r => r.date === dateStr).length;

                return (
                  <button
                    key={day}
                    onClick={() => {
                      setSelectedDateStr(dateStr);
                      // Auto-select first register of this day if available
                      const regsOnDay = registers.filter(r => r.date === dateStr);
                      if (regsOnDay.length > 0) {
                        setActiveTabRegId(regsOnDay[0].id);
                      }
                    }}
                    type="button"
                    className={`h-9 relative rounded-lg flex flex-col items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-amber-500 text-black font-bold border border-amber-400'
                        : isHoliday
                        ? 'bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20'
                        : 'bg-zinc-900/40 border border-zinc-850 hover:border-zinc-700 text-zinc-400'
                    }`}
                    title={isHoliday ? `Festivo: ${COLOMBIA_HOLIDAYS_JUNE_2026[day]}` : undefined}
                  >
                    <span className="text-xs">{day}</span>
                    {countOnThisDay > 0 && !isSelected && (
                      <span className="absolute bottom-1 w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    )}
                    {isHoliday && !isSelected && (
                      <span className="absolute top-1 right-1 w-1 h-1 bg-red-500 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="text-[9px] text-zinc-500 space-y-1 pt-1.5 font-mono border-t border-zinc-900/60">
              <p className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded bg-red-500/10 border border-red-500/20 block" />
                Festivo nacional (Colombia 2026)
              </p>
              <p className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 block" />
                Cajas guardadas el día seleccionado
              </p>
            </div>
          </div>

          {/* List of Multiple registers on selected date */}
          <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-4 space-y-3">
            <h3 className="text-xs font-bold text-zinc-400 flex items-center justify-between">
              <span>Cajas de: {selectedDateStr}</span>
              <span className="text-[10px] text-zinc-500 font-mono">Total: {selectedRegisters.length}</span>
            </h3>

            {selectedRegisters.length === 0 ? (
              <div className="p-4 bg-zinc-900/30 border border-dashed border-zinc-800 rounded-xl text-center space-y-2">
                <p className="text-[11px] text-zinc-500">No hay cajas registradas para esta fecha.</p>
                <button
                  type="button"
                  onClick={() => {
                    setNewRegName(`Caja de Turno - ${selectedDateStr}`);
                    setShowOpenForm(true);
                  }}
                  className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 hover:border-amber-500/30 text-zinc-400 hover:text-amber-500 rounded-lg text-[10px] font-semibold transition-all"
                >
                  Abrir Primera Caja
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {selectedRegisters.map(reg => {
                  const isActive = activeTabRegId === reg.id;
                  const stats = getRegisterStats(reg);
                  return (
                    <button
                      key={reg.id}
                      onClick={() => setActiveTabRegId(reg.id)}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex justify-between items-center ${
                        isActive
                          ? 'bg-zinc-900 border-amber-500/30 shadow'
                          : 'bg-zinc-900/40 border-zinc-850/60 hover:bg-zinc-900/80 hover:border-zinc-700'
                      }`}
                    >
                      <div className="space-y-1 overflow-hidden pr-2">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${reg.status === 'open' ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-500'}`} />
                          <p className="text-xs font-bold text-white truncate">{reg.name}</p>
                        </div>
                        <p className="text-[10px] text-zinc-400 flex items-center gap-1 truncate">
                          <User className="w-3 h-3 text-zinc-500" />
                          Encargado: {reg.workerName}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs font-black text-amber-500">${stats.total.toLocaleString('es-CO')}</p>
                        <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-mono font-bold uppercase ${reg.status === 'open' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-zinc-800 text-zinc-500'}`}>
                          {reg.status === 'open' ? 'ABIERTA' : 'CERRADA'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* COL 2: Selected Cash Register Detailed Balance & Transactions */}
        <div className="space-y-6 lg:col-span-2">
          
          {/* Modal/Form to Open a New Cash Register */}
          {showOpenForm && (
            <div className="bg-zinc-900 border border-amber-500/20 rounded-2xl p-4 space-y-4 animate-fadeIn">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Unlock className="w-4 h-4 text-emerald-500" />
                  Abrir Nueva Caja para: {selectedDateStr}
                </span>
                <button
                  onClick={() => setShowOpenForm(false)}
                  className="text-zinc-500 hover:text-white text-xs font-bold font-mono"
                >
                  [Cerrar]
                </button>
              </div>

              <form onSubmit={handleOpenRegisterSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400">Nombre de la Caja</label>
                  <input
                    type="text"
                    value={newRegName}
                    onChange={(e) => setNewRegName(e.target.value)}
                    className="w-full bg-zinc-950/80 border border-zinc-850 hover:border-zinc-700 focus:border-amber-500 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all"
                    placeholder="Ej. Caja Mañana, Caja Juan"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400">Trabajador Encargado</label>
                  <input
                    type="text"
                    value={newRegWorker}
                    onChange={(e) => setNewRegWorker(e.target.value)}
                    className="w-full bg-zinc-950/80 border border-zinc-850 hover:border-zinc-700 focus:border-amber-500 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all"
                    placeholder="Nombre del cajero"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400">Base en Efectivo ($ COP)</label>
                  <div className="relative">
                    <span className="text-zinc-600 text-xs absolute left-3 top-1/2 -translate-y-1/2">$</span>
                    <input
                      type="number"
                      value={newRegBase}
                      onChange={(e) => setNewRegBase(e.target.value)}
                      className="w-full bg-zinc-950/80 border border-zinc-850 hover:border-zinc-700 focus:border-amber-500 rounded-xl py-2 pl-6 pr-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all"
                      placeholder="Ej. 150000"
                    />
                  </div>
                </div>
                <div className="col-span-1 md:col-span-3 pt-2">
                  <button
                    type="submit"
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs py-2 rounded-xl transition-all"
                  >
                    Confirmar e Iniciar Turno de Caja
                  </button>
                </div>
              </form>
            </div>
          )}

          {selectedRegister ? (
            <div className="space-y-6">
              
              {/* Detailed Balancing Summary Card */}
              <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-5 space-y-5">
                
                {/* Header detail */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-zinc-900 pb-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${selectedRegister.status === 'open' ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-500'}`} />
                      <h2 className="text-base font-black text-white">{selectedRegister.name}</h2>
                    </div>
                    <p className="text-zinc-500 text-[11px] flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      Encargado: <strong className="text-zinc-300 font-semibold">{selectedRegister.workerName}</strong> | Fecha: <strong className="text-zinc-300 font-semibold">{selectedRegister.date}</strong>
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    {selectedRegister.status === 'open' ? (
                      <button
                        onClick={() => setShowCloseModal(selectedRegister.id)}
                        className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 hover:bg-red-500 hover:text-white text-red-400 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        Cerrar Turno de Caja
                      </button>
                    ) : (
                      <div className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-500 text-xs font-bold rounded-lg flex items-center gap-1.5 font-mono">
                        <Lock className="w-3.5 h-3.5" />
                        Caja Cerrada
                      </div>
                    )}
                  </div>
                </div>

                {/* Grid stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  
                  {/* Base Cash */}
                  <div className="bg-zinc-900/40 border border-zinc-850 rounded-xl p-3">
                    <p className="text-[10px] text-zinc-500 font-semibold">1. BASE DIARIA</p>
                    <p className="text-sm font-bold text-white mt-1">${selectedRegister.baseCash.toLocaleString('es-CO')}</p>
                    <span className="text-[8px] text-zinc-600 font-mono block mt-0.5">Dinero inicial dejado</span>
                  </div>

                  {/* Orders sales */}
                  <div className="bg-zinc-900/40 border border-zinc-850 rounded-xl p-3">
                    <p className="text-[10px] text-zinc-500 font-semibold flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-emerald-500" />
                      2. VENTAS PEDIDOS
                    </p>
                    <p className="text-sm font-bold text-emerald-400 mt-1">${regStats.sales.toLocaleString('es-CO')}</p>
                    <span className="text-[8px] text-zinc-600 font-mono block mt-0.5">Sincronizado de ventas</span>
                  </div>

                  {/* Manual incomes & expenses */}
                  <div className="bg-zinc-900/40 border border-zinc-850 rounded-xl p-3">
                    <p className="text-[10px] text-zinc-500 font-semibold flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-amber-500" />
                      3. TRANSACORES (+/-)
                    </p>
                    <p className="text-sm font-bold text-zinc-300 mt-1">
                      +${regStats.incomes.toLocaleString('es-CO')} / -${regStats.expenses.toLocaleString('es-CO')}
                    </p>
                    <span className="text-[8px] text-zinc-600 font-mono block mt-0.5">Ingresos/Egresos manuales</span>
                  </div>

                  {/* Expected balancing Cash */}
                  <div className="bg-zinc-900/40 border border-amber-500/10 rounded-xl p-3">
                    <p className="text-[10px] text-amber-500 font-semibold">4. TOTAL EN EFECTIVO</p>
                    <p className="text-sm font-black text-amber-500 mt-1">${regStats.total.toLocaleString('es-CO')}</p>
                    <span className="text-[8px] text-zinc-600 font-mono block mt-0.5">Dinero real que debe haber</span>
                  </div>

                </div>

                {/* Show closing remarks if closed */}
                {selectedRegister.status === 'closed' && (
                  <div className="p-3 bg-zinc-900/60 border border-zinc-850 rounded-xl space-y-1 flex gap-2.5 items-start">
                    <Info className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Notas del Cierre:</p>
                      <p className="text-xs text-zinc-500 italic">"{selectedRegister.notes || 'Cierre completado sin notas adicionales.'}"</p>
                      {selectedRegister.closedAt && (
                        <span className="text-[8px] font-mono text-zinc-600 block mt-1">
                          Cerrada el: {new Date(selectedRegister.closedAt).toLocaleString('es-CO')}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Interactive Split View: Transactions list (LEFT) vs. Calculator & New Transactions (RIGHT) */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                
                {/* Left pane: Transactions history (3/5 width) */}
                <div className="md:col-span-3 space-y-4">
                  <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-4 space-y-3">
                    <h3 className="text-xs font-bold text-white flex justify-between items-center pb-2 border-b border-zinc-900">
                      <span>Historial de Transacciones</span>
                      <span className="text-[10px] text-zinc-500 font-mono">Movimientos: {selectedRegister.transactions.length}</span>
                    </h3>

                    {selectedRegister.transactions.length === 0 ? (
                      <div className="py-10 text-center text-zinc-600">
                        <Clipboard className="w-8 h-8 mx-auto text-zinc-700 mb-2" />
                        <p className="text-xs">No hay movimientos registrados.</p>
                        <p className="text-[10px] text-zinc-700 mt-0.5">Los pedidos completados o gastos aparecerán aquí.</p>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                        {selectedRegister.transactions.map((tx) => {
                          const isSale = tx.type === 'sale';
                          const isIncome = tx.type === 'income';
                          const isExpense = tx.type === 'expense';
                          return (
                            <div
                              key={tx.id}
                              className="p-3 bg-zinc-900/40 border border-zinc-850 hover:border-zinc-800 rounded-xl flex justify-between items-center transition-all"
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-1.5">
                                  {isSale && <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />}
                                  {isIncome && <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />}
                                  {isExpense && <MinusCircle className="w-3.5 h-3.5 text-red-500" />}
                                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono font-semibold uppercase ${
                                    isSale ? 'bg-emerald-500/10 text-emerald-400' :
                                    isIncome ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                                  }`}>
                                    {isSale ? 'VENTA' : isIncome ? 'INGRESO' : 'GASTO'}
                                  </span>
                                </div>
                                <p className="text-xs text-white font-medium">{tx.description}</p>
                                <span className="text-[8px] text-zinc-600 font-mono block">
                                  {new Date(tx.createdAt).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <div className="text-right shrink-0">
                                <p className={`text-xs font-black ${isExpense ? 'text-red-400' : 'text-emerald-400'}`}>
                                  {isExpense ? '-' : '+'}${tx.amount.toLocaleString('es-CO')}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right pane: Manual Transaction addition & Calculator (2/5 width) */}
                <div className="md:col-span-2 space-y-4">
                  
                  {/* Calculator Widget */}
                  <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-4 space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <CalculatorIcon className="w-4 h-4 text-amber-500" />
                        Calculadora de Caja
                      </span>
                      <button
                        onClick={copyCalcToAmount}
                        disabled={selectedRegister.status !== 'open'}
                        className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500 text-amber-400 hover:text-black text-[9px] font-bold rounded transition-all disabled:opacity-50"
                        title="Usa el valor de la calculadora en el formulario de abajo"
                      >
                        Copiar a Monto
                      </button>
                    </div>

                    {/* Display */}
                    <div className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-850 text-right font-mono text-base font-black text-amber-500 truncate min-h-[40px] flex items-center justify-end">
                      {calcDisplay}
                    </div>

                    {/* Keypad */}
                    <div className="grid grid-cols-4 gap-1 text-xs font-bold">
                      <button onClick={handleCalcClear} className="p-2 bg-zinc-900 hover:bg-zinc-800 rounded-lg text-red-400">C</button>
                      <button onClick={() => handleCalcOp('/')} className="p-2 bg-zinc-900 hover:bg-zinc-800 rounded-lg text-amber-400">/</button>
                      <button onClick={() => handleCalcOp('*')} className="p-2 bg-zinc-900 hover:bg-zinc-800 rounded-lg text-amber-400">*</button>
                      <button onClick={() => handleCalcOp('-')} className="p-2 bg-zinc-900 hover:bg-zinc-800 rounded-lg text-amber-400">-</button>

                      <button onClick={() => handleCalcNum('7')} className="p-2 bg-zinc-900/60 hover:bg-zinc-800 rounded-lg text-zinc-300">7</button>
                      <button onClick={() => handleCalcNum('8')} className="p-2 bg-zinc-900/60 hover:bg-zinc-800 rounded-lg text-zinc-300">8</button>
                      <button onClick={() => handleCalcNum('9')} className="p-2 bg-zinc-900/60 hover:bg-zinc-800 rounded-lg text-zinc-300">9</button>
                      <button onClick={() => handleCalcOp('+')} className="p-2 bg-zinc-900 hover:bg-zinc-800 rounded-lg text-amber-400 row-span-2 flex items-center justify-center h-full">+</button>

                      <button onClick={() => handleCalcNum('4')} className="p-2 bg-zinc-900/60 hover:bg-zinc-800 rounded-lg text-zinc-300">4</button>
                      <button onClick={() => handleCalcNum('5')} className="p-2 bg-zinc-900/60 hover:bg-zinc-800 rounded-lg text-zinc-300">5</button>
                      <button onClick={() => handleCalcNum('6')} className="p-2 bg-zinc-900/60 hover:bg-zinc-800 rounded-lg text-zinc-300">6</button>

                      <button onClick={() => handleCalcNum('1')} className="p-2 bg-zinc-900/60 hover:bg-zinc-800 rounded-lg text-zinc-300">1</button>
                      <button onClick={() => handleCalcNum('2')} className="p-2 bg-zinc-900/60 hover:bg-zinc-800 rounded-lg text-zinc-300">2</button>
                      <button onClick={() => handleCalcNum('3')} className="p-2 bg-zinc-900/60 hover:bg-zinc-800 rounded-lg text-zinc-300">3</button>
                      <button onClick={handleCalcEqual} className="p-2 bg-amber-500 text-black hover:bg-amber-600 rounded-lg row-span-2 flex items-center justify-center h-full">=</button>

                      <button onClick={() => handleCalcNum('0')} className="p-2 bg-zinc-900/60 hover:bg-zinc-800 rounded-lg text-zinc-300 col-span-2">0</button>
                      <button onClick={() => handleCalcNum('.')} className="p-2 bg-zinc-900/60 hover:bg-zinc-800 rounded-lg text-zinc-300">.</button>
                    </div>
                  </div>

                  {/* Add Manual Transaction (Only if active register is OPEN) */}
                  <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-4 space-y-3">
                    <h3 className="text-xs font-bold text-white pb-2 border-b border-zinc-900">
                      Registrar Ingreso / Egreso
                    </h3>

                    {selectedRegister.status !== 'open' ? (
                      <div className="p-3 bg-zinc-900/40 border border-zinc-850 text-zinc-500 rounded-xl text-center text-[10px]">
                        Para añadir ingresos o egresos, debes tener una caja abierta de turno.
                      </div>
                    ) : (
                      <form onSubmit={handleAddTxSubmit} className="space-y-3">
                        {/* Transaction Type Selection */}
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setTxType('expense')}
                            className={`py-1.5 rounded-lg border text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 ${
                              txType === 'expense'
                                ? 'bg-red-500/10 border-red-500/40 text-red-400'
                                : 'bg-zinc-900 border-zinc-850 hover:border-zinc-750 text-zinc-500'
                            }`}
                          >
                            <MinusCircle className="w-3.5 h-3.5" />
                            Egreso / Gasto
                          </button>
                          <button
                            type="button"
                            onClick={() => setTxType('income')}
                            className={`py-1.5 rounded-lg border text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 ${
                              txType === 'income'
                                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                                : 'bg-zinc-900 border-zinc-850 hover:border-zinc-750 text-zinc-500'
                            }`}
                          >
                            <PlusCircle className="w-3.5 h-3.5" />
                            Ingreso Extra
                          </button>
                        </div>

                        {/* Amount & Description fields */}
                        <div className="space-y-2">
                          <div className="relative">
                            <span className="text-zinc-500 text-xs absolute left-3 top-1/2 -translate-y-1/2">$</span>
                            <input
                              type="number"
                              value={txAmount}
                              onChange={(e) => setTxAmount(e.target.value)}
                              className="w-full bg-zinc-950/80 border border-zinc-850 hover:border-zinc-700 focus:border-amber-500 rounded-xl py-2 pl-6 pr-3 text-xs text-white focus:outline-none"
                              placeholder="Monto COP"
                            />
                          </div>
                          <input
                            type="text"
                            value={txDesc}
                            onChange={(e) => setTxDesc(e.target.value)}
                            className="w-full bg-zinc-950/80 border border-zinc-850 hover:border-zinc-700 focus:border-amber-500 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                            placeholder="Descripción (ej. Compra servilletas)"
                          />
                        </div>

                        <button
                          type="submit"
                          className={`w-full text-black font-bold text-xs py-2 rounded-xl transition-all ${
                            txType === 'expense' ? 'bg-red-400 hover:bg-red-500' : 'bg-emerald-400 hover:bg-emerald-500'
                          }`}
                        >
                          Confirmar Movimiento
                        </button>
                      </form>
                    )}
                  </div>

                </div>

              </div>

            </div>
          ) : (
            <div className="p-8 bg-zinc-950/40 border border-zinc-900 border-dashed rounded-2xl text-center space-y-3">
              <Clipboard className="w-12 h-12 text-zinc-700 mx-auto" />
              <p className="text-sm text-zinc-400">Selecciona o crea una caja del calendario para ver el balance.</p>
              <button
                type="button"
                onClick={() => setShowOpenForm(true)}
                className="px-4 py-2 bg-amber-500 text-black font-bold text-xs rounded-xl"
              >
                Abrir Caja de Turno Inicial
              </button>
            </div>
          )}

        </div>

      </div>

      {/* Turn Closing Modal Dialog Confirmation */}
      {showCloseModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 max-w-md w-full space-y-4 shadow-2xl animate-scaleUp">
            <div className="flex gap-2.5 items-start">
              <div className="w-10 h-10 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white">Cerrar Caja de Turno</h3>
                <p className="text-zinc-500 text-xs">
                  Esto bloqueará el registro de transacciones para este turno de caja. Asegúrate que todo el efectivo coincida con el saldo esperado.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Observaciones / Descuadres</label>
              <textarea
                value={closingNotes}
                onChange={(e) => setClosingNotes(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-850 hover:border-zinc-700 focus:border-amber-500 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                placeholder="Ej. Cierra todo cuadrado perfecto. / Descuadre de $200 COP."
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowCloseModal(null);
                  setClosingNotes('');
                }}
                className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-semibold rounded-xl hover:bg-zinc-850 transition-all"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleCloseRegisterSubmit}
                className="px-4 py-2 bg-red-500 text-white text-xs font-semibold rounded-xl hover:bg-red-600 transition-all"
              >
                Confirmar Cierre de Caja
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
