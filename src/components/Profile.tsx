import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  Mail,
  Phone,
  Lock,
  Save,
  ShieldCheck,
  Building,
  Upload,
  Image as ImageIcon,
  MapPin,
  Check
} from 'lucide-react';

const LOGO_PRESETS = [
  'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=200&q=80'
];

export default function Profile() {
  const { user, business, updateBusiness, updateUser } = useApp();

  const [activeTab, setActiveTab] = useState<'user' | 'business'>('user');

  // User form state
  const [userForm, setUserForm] = useState({
    name: user?.name || '',
    lastname: user?.lastname || '',
    email: user?.email || '',
    phone: user?.phone || '',
    password: '',
    confirmPassword: ''
  });

  const [userPhoto, setUserPhoto] = useState(user?.photoUrl || '');
  const [isDraggingUser, setIsDraggingUser] = useState(false);
  const userPhotoInputRef = useRef<HTMLInputElement>(null);

  // Business form state
  const [businessName, setBusinessName] = useState(business?.name || '');
  const [businessLogo, setBusinessLogo] = useState(business?.logoUrl || '');
  const [businessCover, setBusinessCover] = useState(business?.coverUrl || '');
  const [businessAddress, setBusinessAddress] = useState(business?.address || '');
  const [businessWhatsapp, setBusinessWhatsapp] = useState(business?.whatsapp || '');
  const [isLocating, setIsLocating] = useState(false);
  
  const [businessError, setBusinessError] = useState('');
  const [businessSuccess, setBusinessSuccess] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingCover, setIsDraggingCover] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverFileInputRef = useRef<HTMLInputElement>(null);

  const [userMessage, setUserMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Synchronize local state with AppContext in real-time
  React.useEffect(() => {
    if (user) {
      setUserForm(prev => ({
        ...prev,
        name: user.name || '',
        lastname: user.lastname || '',
        email: user.email || '',
        phone: user.phone || '',
      }));
      setUserPhoto(user.photoUrl || '');
    }
  }, [user]);

  React.useEffect(() => {
    if (business) {
      setBusinessName(business.name || '');
      setBusinessLogo(business.logoUrl || '');
      setBusinessCover(business.coverUrl || '');
      setBusinessAddress(business.address || '');
      setBusinessWhatsapp(business.whatsapp || '');
    }
  }, [business]);

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleUserPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserMessage(null);
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setUserMessage({ text: 'La imagen de perfil es muy grande. Máximo 2MB.', type: 'error' });
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Str = event.target?.result as string;
        setUserPhoto(base64Str);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUserDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingUser(true);
  };

  const handleUserDragLeave = () => {
    setIsDraggingUser(false);
  };

  const handleUserDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingUser(false);
    setUserMessage(null);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setUserMessage({ text: 'La imagen de perfil es muy grande. Máximo 2MB.', type: 'error' });
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Str = event.target?.result as string;
        setUserPhoto(base64Str);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUserMessage(null);

    if (!userForm.name || !userForm.lastname || !userForm.email || !userForm.phone) {
      setUserMessage({ text: 'Por favor, completa todos los campos requeridos.', type: 'error' });
      return;
    }

    if (userForm.password) {
      if (userForm.password.length < 6) {
        setUserMessage({ text: 'La nueva contraseña debe tener al menos 6 caracteres.', type: 'error' });
        return;
      }
      if (userForm.password !== userForm.confirmPassword) {
        setUserMessage({ text: 'Las contraseñas no coinciden.', type: 'error' });
        return;
      }
    }

    updateUser({
      name: userForm.name,
      lastname: userForm.lastname,
      email: userForm.email,
      phone: userForm.phone,
      photoUrl: userPhoto
    });

    setUserMessage({ text: 'Perfil administrativo actualizado con éxito.', type: 'success' });
  };

  const handleBusinessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBusinessError('');
    setBusinessSuccess('');

    if (!businessName.trim()) {
      setBusinessError('El nombre de la empresa es obligatorio.');
      return;
    }

    updateBusiness({
      name: businessName,
      logoUrl: businessLogo,
      coverUrl: businessCover,
      address: businessAddress,
      whatsapp: businessWhatsapp
    });

    setBusinessSuccess('¡Datos de la empresa actualizados con éxito en tiempo real!');
    setTimeout(() => setBusinessSuccess(''), 4000);
  };

  // Geolocation Handler
  const handleGetLocation = () => {
    setIsLocating(true);
    setBusinessError('');
    if (!navigator.geolocation) {
      setBusinessError('La geolocalización no está soportada en tu navegador.');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setBusinessAddress(`Coordenadas GPS (Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)})`);
        setIsLocating(false);
        setBusinessSuccess('¡Ubicación GPS detectada con éxito en tiempo real!');
        setTimeout(() => setBusinessSuccess(''), 4000);
        
        // Also update actual coordinate properties in business profile if they are used by maps
        updateBusiness({
          address: `Coordenadas GPS (Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)})`
        });
      },
      (error) => {
        setBusinessError(`Error al obtener coordenadas: ${error.message}`);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Image upload handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusinessError('');
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setBusinessError('La imagen del logo es muy grande. Máximo 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Str = event.target?.result as string;
        setBusinessLogo(base64Str);
      };
      reader.onerror = () => {
        setBusinessError('Error al leer el archivo.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusinessError('');
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setBusinessError('La imagen de portada es muy grande. Máximo 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Str = event.target?.result as string;
        setBusinessCover(base64Str);
      };
      reader.onerror = () => {
        setBusinessError('Error al leer el archivo.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setBusinessError('');
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setBusinessError('La imagen es muy grande. Máximo 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Str = event.target?.result as string;
        setBusinessLogo(base64Str);
      };
      reader.onerror = () => {
        setBusinessError('Error al leer el archivo.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOverCover = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingCover(true);
  };

  const handleDragLeaveCover = () => {
    setIsDraggingCover(false);
  };

  const handleDropCover = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingCover(false);
    setBusinessError('');
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setBusinessError('La imagen de portada es muy grande. Máximo 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Str = event.target?.result as string;
        setBusinessCover(base64Str);
      };
      reader.onerror = () => {
        setBusinessError('Error al leer el archivo.');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="border-b border-zinc-800 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <User className="w-5 h-5 text-amber-500" />
            Configuración de Perfil
          </h2>
          <p className="text-xs text-zinc-500 mt-1">Administra tus datos personales y los de la empresa.</p>
        </div>

        {/* Tab switchers */}
        <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-900 self-start">
          <button
            onClick={() => setActiveTab('user')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'user'
                ? 'bg-amber-500 text-black shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Datos Personales
          </button>
          <button
            onClick={() => setActiveTab('business')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'business'
                ? 'bg-amber-500 text-black shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            Datos de la Empresa
          </button>
        </div>
      </div>

      {activeTab === 'user' ? (
        <div className="bg-[#121212] border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-6 bg-gradient-to-r from-amber-500/5 to-transparent border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {userPhoto ? (
                <img
                  src={userPhoto}
                  alt="Foto de Perfil"
                  className="w-14 h-14 rounded-2xl object-cover border border-amber-500/30 shadow-lg shadow-amber-500/10"
                />
              ) : (
                <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center text-black font-bold text-xl shadow-lg shadow-amber-500/10">
                  {userForm.name[0]?.toUpperCase() || 'A'}
                </div>
              )}
              <div>
                <h3 className="font-bold text-base text-zinc-100">{userForm.name} {userForm.lastname}</h3>
                <p className="text-xs text-amber-500 font-mono flex items-center gap-1.5 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Administrador General (Rol: {user?.role})
                </p>
              </div>
            </div>
            <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono px-2 py-1 rounded-lg">
              CUENTA ACTIVA
            </span>
          </div>

          <form onSubmit={handleUserSubmit} className="p-6 space-y-6">
            {userMessage && (
              <div className={`p-4 rounded-xl text-xs font-semibold ${
                userMessage.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'
              }`}>
                {userMessage.text}
              </div>
            )}

            {/* Foto de Perfil */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-amber-500 font-mono uppercase tracking-wider block">Foto de Perfil del Administrador</label>
              <div
                onDragOver={handleUserDragOver}
                onDragLeave={handleUserDragLeave}
                onDrop={handleUserDrop}
                onClick={() => userPhotoInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                  isDraggingUser
                    ? 'border-amber-500 bg-amber-500/5'
                    : 'border-zinc-800 hover:border-zinc-700 bg-zinc-950/40'
                }`}
              >
                <input
                  type="file"
                  ref={userPhotoInputRef}
                  onChange={handleUserPhotoChange}
                  accept="image/*"
                  className="hidden"
                />

                {userPhoto ? (
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-zinc-800 shadow-xl">
                    <img
                      src={userPhoto}
                      alt="Avatar de perfil"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                      <p className="text-[9px] text-white font-bold uppercase">Subir otra</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-zinc-900 rounded-xl">
                    <Upload className="w-5 h-5 text-amber-500 animate-pulse" />
                  </div>
                )}

                <div className="space-y-1">
                  <p className="text-[11px] text-zinc-300 font-medium">
                    {userPhoto ? '¡Foto de perfil cargada!' : 'Elegir foto del computador'}
                  </p>
                  <p className="text-[9px] text-zinc-500">
                    Arrastra tu archivo o haz clic para subir foto. ¡Se sincronizará con el logo del negocio!
                  </p>
                </div>
              </div>
              
              {/* Presets for user avatar */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block">O elige un preset de alta calidad:</span>
                <div className="grid grid-cols-4 gap-2">
                  {LOGO_PRESETS.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setUserPhoto(url)}
                      className={`relative h-11 rounded-lg overflow-hidden border transition-all ${
                        userPhoto === url
                          ? 'border-amber-500 ring-2 ring-amber-500/40'
                          : 'border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <img src={url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nombre */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400">Nombre</label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="name"
                    value={userForm.name}
                    onChange={handleUserChange}
                    className="w-full bg-zinc-950/60 border border-zinc-800 hover:border-zinc-700 focus:border-amber-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all"
                  />
                </div>
              </div>

              {/* Apellidos */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400">Apellidos</label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="lastname"
                    value={userForm.lastname}
                    onChange={handleUserChange}
                    className="w-full bg-zinc-950/60 border border-zinc-800 hover:border-zinc-700 focus:border-amber-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all"
                  />
                </div>
              </div>

              {/* Correo */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400">Correo Electrónico</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    name="email"
                    value={userForm.email}
                    onChange={handleUserChange}
                    className="w-full bg-zinc-950/60 border border-zinc-800 hover:border-zinc-700 focus:border-amber-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all"
                  />
                </div>
              </div>

              {/* Celular */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400">Número de Celular</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    name="phone"
                    value={userForm.phone}
                    onChange={handleUserChange}
                    className="w-full bg-zinc-950/60 border border-zinc-800 hover:border-zinc-700 focus:border-amber-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-zinc-800 pt-6 space-y-4">
              <h4 className="text-xs font-bold text-amber-500 font-mono uppercase tracking-wider">Cambiar Contraseña (Opcional)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nueva Contraseña */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400">Nueva Contraseña</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      name="password"
                      value={userForm.password}
                      onChange={handleUserChange}
                      placeholder="Dejar vacío para no cambiar"
                      className="w-full bg-zinc-950/60 border border-zinc-800 hover:border-zinc-700 focus:border-amber-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all"
                    />
                  </div>
                </div>

                {/* Confirmar Contraseña */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400">Confirmar Contraseña</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={userForm.confirmPassword}
                      onChange={handleUserChange}
                      placeholder="Repite la contraseña"
                      className="w-full bg-zinc-950/60 border border-zinc-800 hover:border-zinc-700 focus:border-amber-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                id="btn-save-profile"
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-black text-xs font-semibold rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-amber-500/15 animate-fadeIn"
              >
                <Save className="w-4 h-4" />
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-[#121212] border border-zinc-800 rounded-2xl overflow-hidden shadow-xl animate-fadeIn">
          <div className="p-6 bg-gradient-to-r from-amber-500/5 to-transparent border-b border-zinc-800">
            <h3 className="font-bold text-base text-zinc-100 flex items-center gap-2">
              <Building className="w-5 h-5 text-amber-500" />
              Datos de la Empresa / Establecimiento
            </h3>
            <p className="text-xs text-zinc-500 mt-1">Configura el nombre, portada, logo, WhatsApp y coordenadas GPS en tiempo real de tu comercio.</p>
          </div>

          <form onSubmit={handleBusinessSubmit} className="p-6 space-y-6">
            {businessError && (
              <div className="p-4 rounded-xl text-xs font-semibold bg-red-500/10 border border-red-500/20 text-red-400 font-mono">
                {businessError}
              </div>
            )}

            {businessSuccess && (
              <div className="p-4 rounded-xl text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                {businessSuccess}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name of business */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-medium text-zinc-400">Nombre de la Empresa *</label>
                <div className="relative">
                  <Building className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Ej: Hamburguesas El Ghost, Pizzería Celestial"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full bg-zinc-950/60 border border-zinc-800 hover:border-zinc-700 focus:border-amber-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all"
                  />
                </div>
              </div>

              {/* Physical Address with GPS Option */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400 flex items-center justify-between">
                  <span>Dirección Física de la Empresa</span>
                  <span className="text-[10px] text-zinc-500 italic">Presiona para auto-rellenar con GPS</span>
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <MapPin className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Dirección o coordenadas GPS"
                      value={businessAddress}
                      onChange={(e) => setBusinessAddress(e.target.value)}
                      className="w-full bg-zinc-950/60 border border-zinc-800 hover:border-zinc-700 focus:border-amber-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={isLocating}
                    className="px-3 bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 hover:bg-amber-500/5 text-zinc-300 hover:text-amber-400 rounded-xl flex items-center justify-center gap-1.5 transition-all text-xs font-semibold shrink-0 disabled:opacity-50"
                    title="Obtener ubicación por satélite GPS en tiempo real"
                  >
                    <MapPin className={`w-4 h-4 ${isLocating ? 'animate-bounce text-amber-500' : ''}`} />
                    {isLocating ? 'Cargando...' : 'GPS En Vivo'}
                  </button>
                </div>
              </div>

              {/* WhatsApp with Direct Link launcher */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400 flex items-center justify-between">
                  <span>WhatsApp para Clientes</span>
                  <span className="text-[10px] text-zinc-500 italic">Número de contacto directo</span>
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Phone className="w-4 h-4 text-emerald-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      placeholder="Ej: +573001234567"
                      value={businessWhatsapp}
                      onChange={(e) => setBusinessWhatsapp(e.target.value)}
                      className="w-full bg-zinc-950/60 border border-zinc-800 hover:border-zinc-700 focus:border-amber-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all"
                    />
                  </div>
                  {businessWhatsapp && (
                    <a
                      href={`https://wa.me/${businessWhatsapp.replace(/[^\d]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-black rounded-xl flex items-center justify-center gap-1 transition-all text-xs font-bold shrink-0 shadow-lg shadow-emerald-500/5"
                      title="Probar chat directo de WhatsApp"
                    >
                      📱 Chatear
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Logo upload block */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-amber-500 font-mono uppercase tracking-wider block">1. Logo Oficial de tu Comercio</label>
                
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                    isDragging
                      ? 'border-amber-500 bg-amber-500/5'
                      : 'border-zinc-800 hover:border-zinc-700 bg-zinc-950/40'
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />

                  {businessLogo ? (
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-zinc-800 shadow-xl">
                      <img
                        src={businessLogo}
                        alt="Logo de la empresa"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                        <p className="text-[9px] text-white font-bold uppercase">Subir otro</p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-zinc-900 rounded-xl">
                      <Upload className="w-5 h-5 text-amber-500 animate-pulse" />
                    </div>
                  )}

                  <div className="space-y-1">
                    <p className="text-[11px] text-zinc-300 font-medium">
                      {businessLogo ? '¡Logo del PC cargado!' : 'Elegir logo del computador'}
                    </p>
                    <p className="text-[9px] text-zinc-500">
                      Arrastra tu archivo o haz clic para subir logo
                    </p>
                  </div>
                </div>

                {/* Logo presets library */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block">O un preset de alta calidad:</span>
                  <div className="grid grid-cols-4 gap-2">
                    {LOGO_PRESETS.map((url, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setBusinessLogo(url)}
                        className={`relative h-11 rounded-lg overflow-hidden border transition-all ${
                          businessLogo === url
                            ? 'border-amber-500 ring-2 ring-amber-500/40'
                            : 'border-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        <img src={url} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Cover photo upload block */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-amber-500 font-mono uppercase tracking-wider block">2. Imagen de Portada (Fondo)</label>
                
                <div
                  onDragOver={handleDragOverCover}
                  onDragLeave={handleDragLeaveCover}
                  onDrop={handleDropCover}
                  onClick={() => coverFileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                    isDraggingCover
                      ? 'border-amber-500 bg-amber-500/5'
                      : 'border-zinc-800 hover:border-zinc-700 bg-zinc-950/40'
                  }`}
                >
                  <input
                    type="file"
                    ref={coverFileInputRef}
                    onChange={handleCoverFileChange}
                    accept="image/*"
                    className="hidden"
                  />

                  {businessCover ? (
                    <div className="relative w-full h-24 rounded-xl overflow-hidden border border-zinc-800 shadow-xl">
                      <img
                        src={businessCover}
                        alt="Portada de la empresa"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                        <p className="text-[9px] text-white font-bold uppercase">Subir otra portada</p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-zinc-900 rounded-xl">
                      <ImageIcon className="w-5 h-5 text-amber-500 animate-pulse" />
                    </div>
                  )}

                  <div className="space-y-1">
                    <p className="text-[11px] text-zinc-300 font-medium">
                      {businessCover ? '¡Portada del PC cargada!' : 'Elegir portada del computador'}
                    </p>
                    <p className="text-[9px] text-zinc-500">
                      Arrastra tu portada o haz clic para seleccionarla
                    </p>
                  </div>
                </div>

                {/* Cover presets library */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block">O un preset de alta calidad:</span>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80',
                      'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=200&q=80',
                      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=200&q=80',
                      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=200&q=80'
                    ].map((url, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setBusinessCover(url)}
                        className={`relative h-11 rounded-lg overflow-hidden border transition-all ${
                          businessCover === url
                            ? 'border-amber-500 ring-2 ring-amber-500/40'
                            : 'border-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        <img src={url} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Fallback URL Input */}
            <details className="cursor-pointer text-[10px] text-zinc-500 hover:text-zinc-400 select-none pt-2">
              <summary className="font-medium">¿Prefieres pegar direcciones web (URLs) personalizadas directamente? Clic aquí</summary>
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[9px] text-zinc-400">URL del Logo:</span>
                  <input
                    type="text"
                    placeholder="Enlace directo al Logo"
                    value={businessLogo}
                    onChange={(e) => setBusinessLogo(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 hover:border-zinc-700 focus:border-amber-500 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] text-zinc-400">URL de la Portada:</span>
                  <input
                    type="text"
                    placeholder="Enlace directo a la Portada"
                    value={businessCover}
                    onChange={(e) => setBusinessCover(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 hover:border-zinc-700 focus:border-amber-500 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>
            </details>

            <div className="flex justify-end pt-4 border-t border-zinc-800">
              <button
                id="btn-save-business-profile"
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-black text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-amber-500/15"
              >
                <Save className="w-4 h-4" />
                Actualizar Empresa
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
