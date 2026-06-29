import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import DashboardHome from './components/DashboardHome';
import Profile from './components/Profile';
import MyBusiness from './components/MyBusiness';
import Products from './components/Products';
import ChatCalls from './components/ChatCalls';
import Stats from './components/Stats';
import SettingsComponent from './components/Settings';
import Auth from './components/Auth';
import Orders from './components/Orders';
import Caja from './components/Caja';
import { PhoneOff, Mic, MicOff, VideoOff, Phone, Activity } from 'lucide-react';

export default function App() {
  const { user, currentView, activeCall, endCall } = useApp();

  const [micMuted, setMicMuted] = useState(false);
  const [videoDisabled, setVideoDisabled] = useState(false);

  // If user is not logged in, render the Auth view
  if (!user) {
    return <Auth />;
  }

  // Active view router render helper
  const renderView = () => {
    switch (currentView) {
      case 'home':
      case 'inicio':
        return <DashboardHome />;
      case 'profile':
      case 'perfil':
        return <Profile />;
      case 'business':
      case 'negocio':
        return <MyBusiness />;
      case 'products':
      case 'productos':
        return <Products />;
      case 'orders':
      case 'pedidos':
        return <Orders />;
      case 'caja':
        return <Caja />;
      case 'chat':
        return <ChatCalls />;
      case 'stats':
      case 'estadisticas':
        return <Stats />;
      case 'settings':
      case 'configuracion':
        return <SettingsComponent />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-300 font-sans flex flex-col md:flex-row antialiased select-none">
      {/* 1. Left Persistent Navigation Sidebar */}
      <Sidebar />

      {/* 2. Main content container */}
      <div className="flex-1 flex flex-col gap-6 p-4 md:p-6 lg:p-8 overflow-hidden">
        {/* Core dynamic content window */}
        <main className="flex-1 bg-[#090909] border border-zinc-900 rounded-[28px] p-6 lg:p-8 min-h-[500px] shadow-2xl overflow-y-auto custom-scrollbar">
          {renderView()}
        </main>
      </div>

      {/* 3. Global Full-screen WebRTC Call Overlay Portal */}
      {activeCall && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="w-full max-w-sm bg-[#121212] border border-zinc-800 rounded-3xl overflow-hidden p-6 text-center space-y-6 shadow-2xl relative">
            <div className="absolute top-4 right-4 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-[8px] font-mono text-zinc-500 tracking-wider">WebRTC STREAM</span>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] font-bold font-mono text-amber-500 uppercase tracking-widest">
                {activeCall.type === 'video' ? 'VIDEOLLAMADA ENTRANTE' : 'LLAMADA DE VOZ'}
              </p>
              <div className="relative mx-auto w-24 h-24 rounded-full border-2 border-amber-500/40 p-1 flex items-center justify-center">
                <img src={activeCall.targetPhoto} alt="" className="w-full h-full rounded-full object-cover" />
                {activeCall.status === 'connected' && (
                  <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#121212] animate-pulse" />
                )}
              </div>
              <h3 className="font-bold text-base text-zinc-100">{activeCall.targetName}</h3>
              <p className="text-xs text-zinc-500">
                {activeCall.status === 'ringing' ? (
                  <span className="animate-pulse font-medium text-amber-500">Marcando vía WebRTC peer connection... 📞</span>
                ) : activeCall.status === 'connected' ? (
                  <span className="font-mono text-emerald-400 font-semibold">
                    Conectado: {Math.floor(activeCall.duration / 60).toString().padStart(2, '0')}:{(activeCall.duration % 60).toString().padStart(2, '0')}
                  </span>
                ) : (
                  <span className="text-red-500">Llamada finalizada</span>
                )}
              </p>
            </div>

            {/* Video stream rendering mockup if video call is active */}
            {activeCall.type === 'video' && activeCall.status === 'connected' && !videoDisabled && (
              <div className="h-40 w-full bg-zinc-950 rounded-2xl relative border border-zinc-850 overflow-hidden">
                <img src={activeCall.targetPhoto} alt="Stream" className="w-full h-full object-cover opacity-60" />
                <div className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur px-2.5 py-1 rounded-lg text-[9px] text-zinc-300 border border-zinc-800">
                  {activeCall.targetName} Cam
                </div>
                <div className="absolute top-2.5 right-2.5 h-16 w-12 bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden shadow">
                  <div className="w-full h-full bg-gradient-to-tr from-zinc-950 to-zinc-900 flex items-center justify-center text-[8px] text-zinc-500 font-mono text-center">
                    Mi Cam
                  </div>
                </div>
              </div>
            )}

            {/* Calling Control layout */}
            <div className="flex items-center justify-center gap-4 border-t border-zinc-900 pt-6">
              <button
                onClick={() => setMicMuted(!micMuted)}
                className={`w-11 h-11 rounded-2xl flex items-center justify-center border transition-all ${
                  micMuted
                    ? 'bg-red-500/10 border-red-500/20 text-red-500'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                }`}
                title="Silenciar micrófono"
              >
                <Mic className="w-5 h-5" />
              </button>

              {activeCall.type === 'video' && (
                <button
                  onClick={() => setVideoDisabled(!videoDisabled)}
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center border transition-all ${
                    videoDisabled
                      ? 'bg-red-500/10 border-red-500/20 text-red-500'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                  title="Apagar Cámara"
                >
                  <VideoOff className="w-5 h-5" />
                </button>
              )}

              <button
                onClick={endCall}
                className="w-12 h-12 rounded-2xl bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg shadow-red-600/30 active:scale-95 transition-transform"
                title="Colgar"
              >
                <PhoneOff className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
