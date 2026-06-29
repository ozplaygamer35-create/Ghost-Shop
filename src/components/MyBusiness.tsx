import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BusinessProfile } from '../types';
import {
  Store,
  Upload,
  Phone,
  MessageSquare,
  Mail,
  MapPin,
  Clock,
  Tag,
  Save,
  Check
} from 'lucide-react';

const CATEGORIES = [
  'Restaurante',
  'Heladería',
  'Tienda',
  'Farmacia',
  'Licorera',
  'Papelería',
  'Floristería',
  'Veterinaria',
  'Panadería',
  'Cafetería',
  'Carnicería'
];

export default function MyBusiness() {
  const { business, updateBusiness } = useApp();

  const [formData, setFormData] = useState<BusinessProfile>({ ...business });
  const [logoUploading, setLogoUploading] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);
  const [logoProgress, setLogoProgress] = useState(0);
  const [coverProgress, setCoverProgress] = useState(0);
  const [saved, setSaved] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  React.useEffect(() => {
    setFormData({ ...business });
  }, [business]);

  const logoInputRef = React.useRef<HTMLInputElement>(null);
  const coverInputRef = React.useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoUploading(true);
      setLogoProgress(10);
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoProgress(60);
        const base64Str = event.target?.result as string;
        setFormData(prev => ({ ...prev, logoUrl: base64Str }));
        setTimeout(() => {
          setLogoProgress(100);
          setLogoUploading(false);
        }, 400);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverUploading(true);
      setCoverProgress(10);
      const reader = new FileReader();
      reader.onload = (event) => {
        setCoverProgress(60);
        const base64Str = event.target?.result as string;
        setFormData(prev => ({ ...prev, coverUrl: base64Str }));
        setTimeout(() => {
          setCoverProgress(100);
          setCoverUploading(false);
        }, 400);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGetLocation = () => {
    setIsLocating(true);
    if (!navigator.geolocation) {
      alert('La geolocalización no está soportada en tu navegador.');
      setIsLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData(prev => ({
          ...prev,
          address: `Coordenadas GPS (Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)})`
        }));
        setIsLocating(false);
      },
      (error) => {
        alert(`Error al obtener coordenadas: ${error.message}`);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      paymentMethods: {
        ...prev.paymentMethods,
        [name]: checked
      }
    }));
  };

  const handleSimulatedUpload = (type: 'logo' | 'cover', fileUrl: string) => {
    if (type === 'logo') {
      setLogoUploading(true);
      setLogoProgress(0);
      const timer = setInterval(() => {
        setLogoProgress(prev => {
          if (prev >= 100) {
            clearInterval(timer);
            setLogoUploading(false);
            setFormData(p => ({ ...p, logoUrl: fileUrl }));
            return 100;
          }
          return prev + 25;
        });
      }, 300);
    } else {
      setCoverUploading(true);
      setCoverProgress(0);
      const timer = setInterval(() => {
        setCoverProgress(prev => {
          if (prev >= 100) {
            clearInterval(timer);
            setCoverUploading(false);
            setFormData(p => ({ ...p, coverUrl: fileUrl }));
            return 100;
          }
          return prev + 20;
        });
      }, 250);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBusiness(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="border-b border-zinc-800 pb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Store className="w-5 h-5 text-amber-500" />
          Perfil de Mi Negocio
        </h2>
        <p className="text-xs text-zinc-500 mt-1">Configura los detalles de tu establecimiento que los clientes verán en la aplicación móvil en tiempo real.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Visual covers */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#121212] border border-zinc-800 rounded-2xl p-5 space-y-5 text-center">
            <h3 className="text-xs font-bold font-mono text-zinc-400 uppercase tracking-wider text-left border-b border-zinc-800 pb-2">Multimedia</h3>

            {/* Cover photo */}
            <div className="space-y-2 text-left">
              <label className="text-xs font-medium text-zinc-400">Imagen de Portada (Fondo)</label>
              <div className="relative h-28 w-full bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden group">
                <img
                  src={formData.coverUrl}
                  alt="Business Cover"
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                  <button
                    type="button"
                    onClick={() => coverInputRef.current?.click()}
                    className="p-2 bg-amber-500 rounded-xl text-black hover:scale-105 transition-transform shadow-lg"
                    title="Elegir nueva portada de tu PC"
                  >
                    <Upload className="w-4 h-4" />
                  </button>
                </div>
                <input
                  type="file"
                  ref={coverInputRef}
                  onChange={handleCoverFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              {coverUploading && (
                <div className="space-y-1">
                  <div className="w-full bg-zinc-800 rounded-full h-1">
                    <div className="bg-amber-500 h-1 rounded-full transition-all duration-300" style={{ width: `${coverProgress}%` }} />
                  </div>
                  <p className="text-[10px] text-zinc-500 text-right font-mono">Sincronizando: {coverProgress}%</p>
                </div>
              )}
            </div>

            {/* Logo upload */}
            <div className="space-y-2 text-left flex flex-col items-center">
              <label className="text-xs font-medium text-zinc-400 self-start">Logo del Negocio</label>
              <div className="relative w-24 h-24 bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden group">
                <img
                  src={formData.logoUrl}
                  alt="Business Logo"
                  className="w-full h-full object-cover group-hover:opacity-60 transition-opacity"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    className="p-1.5 bg-amber-500 rounded-xl text-black hover:scale-105 transition-transform shadow-lg"
                    title="Elegir nuevo logo de tu PC"
                  >
                    <Upload className="w-3.5 h-3.5" />
                  </button>
                </div>
                <input
                  type="file"
                  ref={logoInputRef}
                  onChange={handleLogoFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              {logoUploading && (
                <div className="w-full space-y-1 mt-2">
                  <div className="w-full bg-zinc-800 rounded-full h-1">
                    <div className="bg-amber-500 h-1 rounded-full transition-all duration-300" style={{ width: `${logoProgress}%` }} />
                  </div>
                  <p className="text-[10px] text-zinc-500 text-center font-mono">Sincronizando: {logoProgress}%</p>
                </div>
              )}
              <p className="text-[10px] text-zinc-500 mt-2">Formatos aceptados: PNG, JPG. Almacenado en Firebase Storage.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#121212] border border-zinc-800 rounded-2xl p-6 space-y-6">
            <h3 className="text-xs font-bold font-mono text-zinc-400 uppercase tracking-wider border-b border-zinc-800 pb-2">Información del Establecimiento</h3>

            {saved && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-xl flex items-center gap-2 animate-fadeIn">
                <Check className="w-4 h-4 shrink-0" />
                Los cambios se guardaron y se sincronizaron con la app móvil en tiempo real.
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nombre del negocio */}
              <div className="space-y-1.5 col-span-1 md:col-span-2">
                <label className="text-xs font-medium text-zinc-400">Nombre del Negocio</label>
                <div className="relative">
                  <Store className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-zinc-950/60 border border-zinc-800 hover:border-zinc-700 focus:border-amber-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all"
                  />
                </div>
              </div>

              {/* Descripcion */}
              <div className="space-y-1.5 col-span-1 md:col-span-2">
                <label className="text-xs font-medium text-zinc-400">Descripción Corta</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={2}
                  className="w-full bg-zinc-950/60 border border-zinc-800 hover:border-zinc-700 focus:border-amber-500 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all resize-none"
                />
              </div>

              {/* Direccion */}
              <div className="space-y-1.5 col-span-1 md:col-span-2">
                <label className="text-xs font-medium text-zinc-400 flex justify-between items-center">
                  <span>Dirección Física</span>
                  <span className="text-[10px] text-zinc-500 italic">Haz clic para auto-rellenar por satélite</span>
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <MapPin className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full bg-zinc-950/60 border border-zinc-800 hover:border-zinc-700 focus:border-amber-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={isLocating}
                    className="px-3 bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 hover:bg-amber-500/5 text-zinc-300 hover:text-amber-400 rounded-xl flex items-center justify-center gap-1.5 transition-all text-xs font-semibold shrink-0 disabled:opacity-50"
                  >
                    <MapPin className={`w-4 h-4 ${isLocating ? 'animate-bounce text-amber-500' : ''}`} />
                    {isLocating ? 'Buscando GPS...' : 'GPS En Vivo'}
                  </button>
                </div>
              </div>

              {/* Categoria */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400">Categoría del Comercio</label>
                <div className="relative">
                  <Tag className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-zinc-950/60 border border-zinc-800 hover:border-zinc-700 focus:border-amber-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all appearance-none"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat} className="bg-zinc-950 text-white">{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Celular */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400">Teléfono Comercial</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-zinc-950/60 border border-zinc-800 hover:border-zinc-700 focus:border-amber-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all"
                  />
                </div>
              </div>

              {/* Whatsapp */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400">WhatsApp para Clientes</label>
                <div className="relative">
                  <MessageSquare className="w-4 h-4 text-emerald-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    className="w-full bg-zinc-950/60 border border-zinc-800 hover:border-zinc-700 focus:border-amber-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all"
                  />
                </div>
              </div>

              {/* Correo */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400">Correo Comercial</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-zinc-950/60 border border-zinc-800 hover:border-zinc-700 focus:border-amber-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all"
                  />
                </div>
              </div>

              {/* Horario */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400">Horario de Operación</label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="schedule"
                    value={formData.schedule}
                    onChange={handleChange}
                    className="w-full bg-zinc-950/60 border border-zinc-800 hover:border-zinc-700 focus:border-amber-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Metodos de Pago */}
            <div className="border-t border-zinc-800 pt-6 space-y-4">
              <h4 className="text-xs font-bold text-amber-500 font-mono uppercase tracking-wider">Métodos de Pago Soportados</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Object.entries(formData.paymentMethods).map(([key, value]) => {
                  const labelMap: any = {
                    nequi: 'Nequi',
                    daviplata: 'Daviplata',
                    pse: 'PSE (Débito)',
                    creditCard: 'Tarjetas de Crédito',
                    cash: 'Efectivo contra entrega',
                    bankTransfer: 'Transferencia Bancaria'
                  };
                  return (
                    <label key={key} className="flex items-center gap-2.5 p-3 bg-zinc-950/40 border border-zinc-800 hover:border-zinc-700 rounded-xl cursor-pointer select-none transition-all">
                      <input
                        type="checkbox"
                        name={key}
                        checked={value}
                        onChange={handleCheckboxChange}
                        className="rounded bg-zinc-900 border-zinc-800 text-amber-500 focus:ring-amber-500/30"
                      />
                      <span className="text-xs text-zinc-300 font-medium">{labelMap[key] || key}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-zinc-800">
              <button
                id="btn-save-business"
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-black text-xs font-semibold rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-amber-500/15"
              >
                <Save className="w-4 h-4" />
                Actualizar Establecimiento
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
