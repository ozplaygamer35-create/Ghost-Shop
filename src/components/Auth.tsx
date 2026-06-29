import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Mail,
  Lock,
  User,
  Phone,
  Activity,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

export default function Auth() {
  const { login, register } = useApp();

  const [mode, setMode] = useState<'login' | 'register' | 'recover'>('login');
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const ok = await login(formData.email, formData.password);
        if (!ok) {
          setErrorMsg('Credenciales inválidas. Por favor intenta de nuevo (min. 6 caracteres).');
        }
      } else if (mode === 'register') {
        if (!formData.name || !formData.lastname || !formData.email || !formData.phone || !formData.password) {
          setErrorMsg('Por favor completa todos los campos obligatorios.');
          setLoading(false);
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          setErrorMsg('Las contraseñas no coinciden.');
          setLoading(false);
          return;
        }
        const ok = await register(formData);
        if (!ok) {
          setErrorMsg('Error al registrar la cuenta. Intenta otro correo.');
        }
      } else {
        // Recover password
        if (!formData.email) {
          setErrorMsg('Por favor ingresa un correo válido.');
          setLoading(false);
          return;
        }
        setSuccessMsg('Se ha enviado un enlace de recuperación de contraseña a tu correo.');
      }
    } catch (err) {
      setErrorMsg('Ocurrió un error inesperado al procesar la autenticación.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#0e0e0e] border border-zinc-850 p-8 rounded-3xl shadow-2xl relative space-y-6">
        {/* Brand identity */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Activity className="w-7 h-7 text-black" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-white font-sans">GHOST SHOP ADMIN</h1>
            <span className="text-[9px] tracking-widest text-amber-500 font-mono font-bold uppercase">Consola de Negocios</span>
          </div>
        </div>

        {/* Form panel */}
        <form onSubmit={handleFormSubmit} className="space-y-4 pt-2">
          {errorMsg && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-semibold animate-fadeIn">
              ⚠️ {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-semibold animate-fadeIn flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" /> {successMsg}
            </div>
          )}

          {mode === 'register' && (
            <div className="grid grid-cols-2 gap-3">
              {/* Name */}
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Nombre</label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-zinc-600 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleTextChange}
                    className="w-full bg-zinc-950 border border-zinc-850 rounded-xl py-2 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-amber-500 font-medium"
                  />
                </div>
              </div>

              {/* Lastname */}
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Apellidos</label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-zinc-600 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleTextChange}
                    className="w-full bg-zinc-950 border border-zinc-850 rounded-xl py-2 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-amber-500 font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Email */}
          <div className="space-y-1">
            <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Correo Electrónico</label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-zinc-600 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                name="email"
                placeholder="ejemplo@ghost.com"
                value={formData.email}
                onChange={handleTextChange}
                className="w-full bg-zinc-950 border border-zinc-850 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
          </div>

          {mode === 'register' && (
            /* Phone number */
            <div className="space-y-1">
              <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Celular</label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-zinc-600 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  name="phone"
                  placeholder="+57 300 000 0000"
                  value={formData.phone}
                  onChange={handleTextChange}
                  className="w-full bg-zinc-950 border border-zinc-850 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            </div>
          )}

          {mode !== 'recover' && (
            <div className={mode === 'register' ? 'grid grid-cols-2 gap-3' : 'space-y-1'}>
              {/* Password */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Contraseña</label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setMode('recover')}
                      className="text-[9px] text-amber-500 hover:underline"
                    >
                      ¿Olvidó clave?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-zinc-600 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleTextChange}
                    className="w-full bg-zinc-950 border border-zinc-850 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Confirm password */}
              {mode === 'register' && (
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Confirmar</label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-zinc-600 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      name="confirmPassword"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleTextChange}
                      className="w-full bg-zinc-950 border border-zinc-850 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3 bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-black font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 transition-transform active:scale-95"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : mode === 'login' ? (
              <>
                Ingresar al Panel <ArrowRight className="w-4 h-4" />
              </>
            ) : mode === 'register' ? (
              'Crear Cuenta Administrativa'
            ) : (
              'Enviar Enlace de Recuperación'
            )}
          </button>
        </form>

        {/* Change auth mode */}
        <div className="text-center text-xs text-zinc-500 border-t border-zinc-900 pt-4">
          {mode === 'login' ? (
            <p>
              ¿No tienes cuenta administrativa?{' '}
              <button onClick={() => setMode('register')} className="text-amber-500 font-semibold hover:underline">
                Registrarse aquí
              </button>
            </p>
          ) : (
            <p>
              ¿Ya tienes cuenta?{' '}
              <button onClick={() => setMode('login')} className="text-amber-500 font-semibold hover:underline">
                Iniciar Sesión
              </button>
            </p>
          )}
        </div>

        {/* Admin note */}
        <div className="flex gap-2 p-3 bg-zinc-950 rounded-xl border border-zinc-900 text-[10px] text-zinc-500 leading-relaxed justify-center items-center">
          <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
          <span>Acceso encriptado SSL. Sincronización en tiempo real vía Firebase Auth.</span>
        </div>
      </div>
    </div>
  );
}
