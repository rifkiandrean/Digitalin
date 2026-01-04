
import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Loader2, Zap } from 'lucide-react';

// URL Webhook n8n Anda. Ganti dengan URL produksi n8n Anda jika berbeda.
const N8N_WEBHOOK_URL = "https://rifkiandrean.app.n8n.cloud/webhook/dbe7703b-2c15-460f-a686-742123170a3c/chat";

interface Message {
  role: 'user' | 'model';
  text: string;
}

const FloatingChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Halo! Saya asisten virtual Vell Digital. Ada yang bisa saya bantu terkait layanan website, sistem kasir, atau undangan digital kami?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    // Gunakan salinan history untuk dikirim
    const currentHistory = [...messages];
    
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      // Mengirim data ke n8n melalui Webhook
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          message: userMessage,
          // Format history yang lebih umum digunakan di n8n AI Nodes
          chat_history: currentHistory.map(m => ({
            role: m.role === 'model' ? 'assistant' : 'user',
            message: m.text
          })),
          source: window.location.pathname,
          timestamp: new Date().toISOString(),
        }),
      });

      // Jika server memberikan error 500 (Workflow Error di n8n)
      if (response.status === 500) {
        const errorJson = await response.json().catch(() => ({}));
        console.error("n8n Workflow Error:", errorJson);
        throw new Error("SERVER_WORKFLOW_ERROR");
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Webhook Error (${response.status}):`, errorText);
        throw new Error(`HTTP_${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      let aiText = "";

      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        // Cek berbagai kemungkinan path output dari n8n
        aiText = data.output || data.text || data.message || data.response || 
                 (Array.isArray(data) ? (data[0]?.output || data[0]?.text) : null);
      } else {
        aiText = await response.text();
      }

      if (!aiText || aiText === "undefined") {
        aiText = "Maaf, sistem AI sedang tidak memberikan respon. Silakan coba tanyakan hal lain.";
      }

      setMessages(prev => [...prev, { role: 'model', text: String(aiText) }]);
    } catch (error: any) {
      console.error("Chat Webhook Error Detail:", error);
      
      let errorMessage = "Maaf, terjadi gangguan pada koneksi chat. Silakan coba lagi beberapa saat lagi.";
      
      if (error.message === "SERVER_WORKFLOW_ERROR") {
        errorMessage = "Waduh, otak digital saya sedang mengalami gangguan teknis (Workflow Error). Tim kami sedang memperbaikinya. Silakan hubungi WA 0821-1512-3431 untuk respon cepat.";
      } else if (error.message.includes("HTTP_404")) {
        errorMessage = "Alamat asisten digital tidak ditemukan. Mohon periksa konfigurasi webhook.";
      }

      setMessages(prev => [...prev, { 
        role: 'model', 
        text: errorMessage 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Buka Chat"
        className={`fixed bottom-6 right-6 z-[150] w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95 ${
          isOpen ? 'bg-slate-800 text-white rotate-90' : 'bg-indigo-600 text-white animate-bounce-subtle'
        }`}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
        )}
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-24 right-6 z-[150] w-[calc(100vw-48px)] sm:w-[380px] h-[500px] max-h-[70vh] bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-100 flex flex-col overflow-hidden transition-all duration-500 origin-bottom-right ${
          isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-0 opacity-0 translate-y-10 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 text-white flex items-center gap-4">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
            <Zap size={20} className="fill-current" />
          </div>
          <div>
            <h3 className="font-black text-sm uppercase tracking-widest leading-none">Vell Assistant</h3>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold opacity-80 uppercase tracking-tighter">Online • n8n Connected</span>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50 scroll-smooth">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
              <div className={`max-w-[85%] p-4 rounded-2xl text-xs leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start animate-fade-in-up">
              <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-100 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tulis pesan..."
            className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-11 h-11 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-90 disabled:opacity-50"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </form>
      </div>

      <style>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 3s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

export default FloatingChat;
