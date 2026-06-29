import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Chat, Message } from '../types';
import {
  MessageSquare,
  Phone,
  Video,
  Send,
  Paperclip,
  Image,
  MapPin,
  Smile,
  CheckCheck,
  MoreVertical,
  Activity,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff
} from 'lucide-react';

export default function ChatCalls() {
  const {
    chats,
    sendMessage,
    startCall,
    activeCall,
    endCall,
    user
  } = useApp();

  const [activeChatId, setActiveChatId] = useState<string>(chats[0]?.id || '');
  const [inputText, setInputText] = useState('');
  const [micMuted, setMicMuted] = useState(false);
  const [videoDisabled, setVideoDisabled] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeChat = chats.find(c => c.id === activeChatId) || chats[0];

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages?.length, activeChat?.isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(activeChatId, inputText);
    setInputText('');
  };

  // Attachments simulation
  const handleSimulatedAttachment = (type: 'photo' | 'file' | 'location') => {
    if (type === 'photo') {
      sendMessage(
        activeChatId,
        undefined,
        'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80',
        undefined,
        undefined
      );
    } else if (type === 'file') {
      sendMessage(
        activeChatId,
        undefined,
        undefined,
        '#',
        'recibo_pago_orden.pdf'
      );
    } else if (type === 'location') {
      sendMessage(
        activeChatId,
        '📍 Ubicación física compartida',
        undefined,
        undefined,
        undefined,
        { lat: 4.6540, lng: -74.0560 }
      );
    }
  };

  const getSenderStyle = (msg: Message) => {
    const isMe = msg.senderId === user?.uid || msg.senderRole === 'admin';
    if (isMe) {
      return 'bg-amber-500 text-black rounded-tr-none ml-auto';
    }
    return 'bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-tl-none mr-auto';
  };

  return (
    <div className="space-y-6 relative h-[calc(100vh-140px)] flex flex-col justify-between">
      {/* Page Title */}
      <div className="border-b border-zinc-800 pb-4 shrink-0 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-amber-500" />
            Comunicaciones Unificadas
          </h2>
          <p className="text-xs text-zinc-500 mt-1">Canal de atención y logística en tiempo real. Soporte para chat, intercambio de archivos y llamadas WebRTC.</p>
        </div>
      </div>

      {/* Main chat window split screen */}
      <div className="flex-1 bg-[#121212] border border-zinc-800 rounded-2xl overflow-hidden flex h-full">
        {/* Left pane: Chats list */}
        <div className="w-full md:w-80 border-r border-zinc-800 flex flex-col justify-between shrink-0 h-full">
          <div className="p-4 border-b border-zinc-800 bg-zinc-950/40">
            <p className="text-[10px] font-bold font-mono text-zinc-400 uppercase tracking-widest">Chats Activos</p>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5 custom-scrollbar">
            {chats.map(c => {
              const isActive = activeChatId === c.id;
              const lastMsg = c.messages[c.messages.length - 1];
              return (
                <div
                  key={c.id}
                  onClick={() => setActiveChatId(c.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3 relative ${
                    isActive
                      ? 'bg-amber-500/5 border-amber-500/80 text-white'
                      : 'bg-zinc-950/20 border-zinc-900 text-zinc-400 hover:border-zinc-850 hover:bg-zinc-900/10'
                  }`}
                >
                  <div className="relative">
                    <img src={c.targetPhoto} alt={c.targetName} className="w-10 h-10 rounded-xl object-cover" />
                    {c.isTyping && (
                      <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500" />
                      </span>
                    )}
                  </div>
                  <div className="overflow-hidden flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-zinc-200 truncate">{c.targetName.split(' ')[0]}</p>
                      <span className="text-[8px] text-zinc-500 font-mono">
                        {lastMsg ? new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                    <p className="text-[10px] text-zinc-400 truncate mt-0.5">
                      {c.isTyping ? (
                        <span className="text-amber-500 font-medium italic animate-pulse">Escribiendo...</span>
                      ) : (
                        lastMsg?.text || 'Archivo adjunto'
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right pane: Chat details */}
        {activeChat ? (
          <div className="flex-1 flex flex-col justify-between h-full bg-[#0d0d0d]">
            {/* Chat header */}
            <div className="p-4 bg-zinc-950/60 border-b border-zinc-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <img src={activeChat.targetPhoto} alt={activeChat.targetName} className="w-10 h-10 rounded-xl object-cover" />
                <div>
                  <h4 className="text-xs font-bold text-zinc-100">{activeChat.targetName}</h4>
                  <p className="text-[9px] text-zinc-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    En línea • GHOST SHOP Network
                  </p>
                </div>
              </div>

              {/* WebRTC calling triggers */}
              <div className="flex items-center gap-2">
                <button
                  id="btn-voice-call"
                  onClick={() => startCall('voice', activeChat.targetId)}
                  className="w-9 h-9 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-xl border border-zinc-800 flex items-center justify-center transition-all"
                  title="Llamada de voz WebRTC"
                >
                  <Phone className="w-4 h-4" />
                </button>
                <button
                  id="btn-video-call"
                  onClick={() => startCall('video', activeChat.targetId)}
                  className="w-9 h-9 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-xl border border-zinc-800 flex items-center justify-center transition-all"
                  title="Videollamada WebRTC"
                >
                  <Video className="w-4 h-4" />
                </button>
                <button className="w-9 h-9 bg-zinc-900 hover:bg-zinc-800 text-zinc-500 rounded-xl border border-zinc-800 flex items-center justify-center">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Messages area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-950/20 custom-scrollbar">
              {activeChat.messages.map((m) => {
                const isMe = m.senderId === user?.uid || m.senderRole === 'admin';
                return (
                  <div key={m.id} className={`flex max-w-[80%] flex-col ${isMe ? 'items-end ml-auto' : 'items-start mr-auto'}`}>
                    <span className="text-[9px] text-zinc-500 font-mono mb-1">{m.senderName}</span>
                    <div className={`p-3.5 rounded-2xl text-xs space-y-2 leading-relaxed ${getSenderStyle(m)}`}>
                      {/* Text content */}
                      {m.text && <p>{m.text}</p>}

                      {/* Photo attachment representation */}
                      {m.photo && (
                        <div className="rounded-xl overflow-hidden border border-zinc-800 max-w-[240px]">
                          <img src={m.photo} alt="Adjunto" className="w-full h-auto object-cover" />
                        </div>
                      )}

                      {/* File attachment */}
                      {m.file && (
                        <a
                          href="#"
                          className="flex items-center gap-2 p-2 bg-black/40 border border-zinc-800 rounded-xl text-zinc-300 font-mono text-[10px]"
                        >
                          <Paperclip className="w-3.5 h-3.5 text-amber-500" />
                          <span className="truncate max-w-[120px]">{m.fileName || 'document.pdf'}</span>
                        </a>
                      )}

                      {/* Location Coordinates Card */}
                      {m.location && (
                        <div className="p-3 bg-black/40 border border-zinc-800 rounded-xl text-[10px] font-mono text-zinc-300 flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-amber-500" />
                          <div>
                            <p className="font-bold">Coordenadas GPS</p>
                            <p className="text-zinc-500">{m.location.lat}, {m.location.lng}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-[8px] text-zinc-500 mt-1 font-mono">
                      <span>{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {isMe && <CheckCheck className="w-3.5 h-3.5 text-sky-500" />}
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {activeChat.isTyping && (
                <div className="flex flex-col items-start mr-auto max-w-[80%]">
                  <span className="text-[9px] text-zinc-500 font-mono mb-1">{activeChat.targetName.split(' ')[0]}</span>
                  <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input form */}
            <form onSubmit={handleSend} className="p-4 bg-zinc-950/60 border-t border-zinc-800 shrink-0">
              {/* Accessory upload bar */}
              <div className="flex items-center gap-3 mb-3 border-b border-zinc-900 pb-2.5">
                <button
                  type="button"
                  onClick={() => handleSimulatedAttachment('photo')}
                  className="text-zinc-500 hover:text-zinc-300 text-xs flex items-center gap-1 transition-all"
                  title="Adjuntar Imagen de Producto"
                >
                  <Image className="w-4 h-4 text-zinc-500" />
                  <span>Foto</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSimulatedAttachment('file')}
                  className="text-zinc-500 hover:text-zinc-300 text-xs flex items-center gap-1 transition-all"
                  title="Adjuntar PDF o Documento"
                >
                  <Paperclip className="w-4 h-4 text-zinc-500" />
                  <span>Archivo</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSimulatedAttachment('location')}
                  className="text-zinc-500 hover:text-zinc-300 text-xs flex items-center gap-1 transition-all"
                  title="Adjuntar Ubicación de Tienda"
                >
                  <MapPin className="w-4 h-4 text-zinc-500" />
                  <span>Ubicación GPS</span>
                </button>
              </div>

              {/* Message field */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={`Escribe un mensaje para ${activeChat.targetName.split(' ')[0]}...`}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 bg-zinc-950 border border-zinc-850 focus:border-amber-500 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <button
                  type="submit"
                  className="w-10 h-10 bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-black rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/10 shrink-0 active:scale-95 transition-transform"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center text-zinc-500">
            <p className="text-sm">Selecciona una conversación para iniciar.</p>
          </div>
        )}
      </div>

      {/* WebRTC active calling portal overlay overlay */}
      {activeCall && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="w-full max-w-sm bg-[#121212] border border-zinc-800 rounded-3xl overflow-hidden p-6 text-center space-y-6 shadow-2xl relative">
            {/* Sound Wave elements representation */}
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
                  <span className="animate-pulse">Marcando vía WebRTC peer connection... 📞</span>
                ) : activeCall.status === 'connected' ? (
                  <span className="font-mono text-emerald-400 font-semibold">
                    Conectado: {Math.floor(activeCall.duration / 60).toString().padStart(2, '0')}:{(activeCall.duration % 60).toString().padStart(2, '0')}
                  </span>
                ) : (
                  <span className="text-red-500">Llamada finalizada</span>
                )}
              </p>
            </div>

            {/* Video stream rendering mockup if video call */}
            {activeCall.type === 'video' && activeCall.status === 'connected' && !videoDisabled && (
              <div className="h-40 w-full bg-zinc-950 rounded-2xl relative border border-zinc-850 overflow-hidden">
                <img src={activeCall.targetPhoto} alt="Stream" className="w-full h-full object-cover opacity-60" />
                <div className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur px-2.5 py-1 rounded-lg text-[9px] text-zinc-300 border border-zinc-800">
                  {activeCall.targetName} Cam
                </div>
                {/* Self camera thumbnail stream */}
                <div className="absolute top-2.5 right-2.5 h-16 w-12 bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden shadow">
                  <div className="w-full h-full bg-gradient-to-tr from-zinc-950 to-zinc-900 flex items-center justify-center text-[8px] text-zinc-500 font-mono text-center">
                    Mi Cam
                  </div>
                </div>
              </div>
            )}

            {/* Controls */}
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
