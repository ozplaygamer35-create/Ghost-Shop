import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Settings, Shield, CreditCard, Percent, Bell, Check, Key } from 'lucide-react';

export default function SettingsComponent() {
  const { business, updateBusiness, isRealtimeSyncing } = useApp();

  const [formData, setFormData] = useState({
    taxPercentage: business.taxPercentage,
    commissionPercentage: business.commissionPercentage,
    nequiActive: business.paymentMethods.nequi,
    daviplataActive: business.paymentMethods.daviplata,
    pseActive: business.paymentMethods.pse,
    creditCardActive: business.paymentMethods.creditCard,
    cashActive: business.paymentMethods.cash,
    bankTransferActive: business.paymentMethods.bankTransfer,
    // Gateway simulation
    wompiActive: false,
    mercadoPagoActive: true,
    payuActive: false,
    wompiPublicKey: 'pub_test_wompi_67890abcd',
    mercadoPagoToken: 'MP-TEST-TOKEN-123456789',
    payuMerchantId: '987654'
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : Number(value)
    }));
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBusiness({
      taxPercentage: formData.taxPercentage,
      commissionPercentage: formData.commissionPercentage,
      paymentMethods: {
        nequi: formData.nequiActive,
        daviplata: formData.daviplataActive,
        pse: formData.pseActive,
        creditCard: formData.creditCardActive,
        cash: formData.cashActive,
        bankTransfer: formData.bankTransferActive
      }
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div className="border-b border-zinc-800 pb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-amber-500" />
          Configuración de la Plataforma
        </h2>
        <p className="text-xs text-zinc-500 mt-1">Configura comisiones por pedidos, impuestos de ley, métodos de recaudo y credenciales de pasarelas de pago.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {saved && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-xl flex items-center gap-2 animate-fadeIn">
            <Check className="w-4 h-4 shrink-0" />
            Configuraciones de pasarela e impuestos actualizadas y sincronizadas con GHOST SHOP.
          </div>
        )}

        {/* Section 1: Financial parameters */}
        <div className="bg-[#121212] border border-zinc-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-xs font-bold font-mono text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <Percent className="w-4 h-4" />
            Parámetros de Liquidación & Impuestos
          </h3>
          <p className="text-[11px] text-zinc-500">Configura las tasas aplicadas por cada orden de compra realizada por el cliente móvil.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Tax */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400">Impuesto de Consumo / Ley (%)</label>
              <input
                type="number"
                name="taxPercentage"
                value={formData.taxPercentage}
                onChange={handleChange}
                min="0"
                max="50"
                className="w-full bg-zinc-950/60 border border-zinc-800 hover:border-zinc-700 focus:border-amber-500 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
              />
              <p className="text-[10px] text-zinc-500">Impoconsumo estándar en Colombia para alimentos es 8%.</p>
            </div>

            {/* Platform commission */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400">Comisión del Domicilio / Plataforma (%)</label>
              <input
                type="number"
                name="commissionPercentage"
                value={formData.commissionPercentage}
                onChange={handleChange}
                min="0"
                max="50"
                className="w-full bg-zinc-950/60 border border-zinc-800 hover:border-zinc-700 focus:border-amber-500 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
              />
              <p className="text-[10px] text-zinc-500">Margen retenido para el mantenimiento de la aplicación.</p>
            </div>
          </div>
        </div>

        {/* Section 2: Payment Gateways Integration */}
        <div className="bg-[#121212] border border-zinc-800 rounded-2xl p-6 space-y-6">
          <h3 className="text-xs font-bold font-mono text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Pasarelas de Pago (Wompi, Mercado Pago, PayU)
          </h3>
          <p className="text-[11px] text-zinc-500">Habilita y configura las API keys para recibir pagos electrónicos directos de tarjetas, PSE y Nequi.</p>

          <div className="space-y-4">
            {/* Wompi */}
            <div className="p-4 bg-zinc-950/40 border border-zinc-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center font-black text-xs text-pink-500">W</div>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-200">Wompi Colombia</h4>
                    <p className="text-[9px] text-zinc-500">Pasarela oficial del Grupo Bancolombia para PSE y tarjetas.</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name="wompiActive"
                    checked={formData.wompiActive}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-400 after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500 peer-checked:after:bg-black" />
                </label>
              </div>

              {formData.wompiActive && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div className="space-y-1">
                    <span className="text-[10px] text-zinc-500 font-mono">WOMPI PUBLIC KEY</span>
                    <div className="relative">
                      <Key className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        name="wompiPublicKey"
                        value={formData.wompiPublicKey}
                        onChange={handleTextChange}
                        className="w-full bg-zinc-950 border border-zinc-850 py-1.5 pl-9 pr-3 rounded-lg text-[10px] text-zinc-300 font-mono focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mercado Pago */}
            <div className="p-4 bg-zinc-950/40 border border-zinc-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center font-black text-xs text-blue-500">MP</div>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-200">Mercado Pago</h4>
                    <p className="text-[9px] text-zinc-500">Líder latinoamericano. Soporta PSE, Tarjetas y Saldo en cuenta.</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name="mercadoPagoActive"
                    checked={formData.mercadoPagoActive}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-400 after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500 peer-checked:after:bg-black" />
                </label>
              </div>

              {formData.mercadoPagoActive && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div className="space-y-1">
                    <span className="text-[10px] text-zinc-500 font-mono">ACCESS TOKEN (TEST / LIVE)</span>
                    <div className="relative">
                      <Key className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        name="mercadoPagoToken"
                        value={formData.mercadoPagoToken}
                        onChange={handleTextChange}
                        className="w-full bg-zinc-950 border border-zinc-850 py-1.5 pl-9 pr-3 rounded-lg text-[10px] text-zinc-300 font-mono focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* PayU */}
            <div className="p-4 bg-[#121212] border border-zinc-900 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-lime-500/10 flex items-center justify-center font-black text-xs text-lime-500">P</div>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-400">PayU Latam</h4>
                    <p className="text-[9px] text-zinc-500">Pasarela clásica para cobro recurrente e internacional.</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name="payuActive"
                    checked={formData.payuActive}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-400 after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500 peer-checked:after:bg-black" />
                </label>
              </div>

              {formData.payuActive && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div className="space-y-1">
                    <span className="text-[10px] text-zinc-500 font-mono">MERCHANT ID</span>
                    <div className="relative">
                      <Key className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        name="payuMerchantId"
                        value={formData.payuMerchantId}
                        onChange={handleTextChange}
                        className="w-full bg-zinc-950 border border-zinc-850 py-1.5 pl-9 pr-3 rounded-lg text-[10px] text-zinc-300 font-mono focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Save configurations */}
        <div className="flex justify-end pt-4">
          <button
            id="btn-save-settings"
            type="submit"
            className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-black text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-amber-500/15"
          >
            <Check className="w-4.5 h-4.5" />
            Guardar Configuración General
          </button>
        </div>
      </form>
    </div>
  );
}
