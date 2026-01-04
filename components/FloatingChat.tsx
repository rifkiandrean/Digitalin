
import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Loader2, Zap, Image as ImageIcon, Trash2 } from 'lucide-react';

// URL Webhook n8n Anda.
const N8N_WEBHOOK_URL = "https://rifkiandrean.app.n8n.cloud/webhook/dbe7703b-2c15-460f-a686-742123170a3c/chat";

interface Message {
  role: 'user' | 'model';
  text?: string;
  image?: string; // Menyimpan URL atau Base64 gambar
}

const FloatingChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Halo! Saya asisten virtual Vell Digital. Ada yang bisa saya bantu? Saya sekarang bisa menerima dan menganalisis gambar loh!' }
  ]);
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let sId = localStorage.getItem('vell_chat_session');
    if (!sId) {
      sId = 'sess_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('vell_chat_session', sId);
    }
    setSessionId(sId);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Ukuran gambar terlalu besar (Maks 5MB)");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && !selectedImage) || isLoading) return;

    const userMessage = input.trim();
    const userImage = selectedImage;
    const currentHistory = [...messages];
    
    // Reset inputs
    setInput('');
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";

    // Update UI Local
    setMessages(prev => [...prev, { 
      role: 'user', 
      text: userMessage || undefined, 
      image: userImage || undefined 
    }]);
    
    setIsLoading(true);

    try {
      const payload = {
        chatInput: userMessage,
        message: userMessage,
        sessionId: sessionId,
        // Kirim gambar dalam format base64 (tanpa prefix data:image/...) jika diperlukan, 
        // tapi biasanya n8n bisa handle full data URI.
        image: userImage, 
        chatHistory: currentHistory.map(m => ({
          role: m.role === 'model' ? 'assistant' : 'user',
          content: m.text || "",
          image: m.image || null
        })),
        metadata: {
          source: window.location.pathname,
          timestamp: new Date().toISOString(),
        }
      };

      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`HTTP_${response.status}`);

      const data = await response.json();
      
      // Ekstraksi jawaban teks dan gambar dari AI (jika AI mengirim gambar balik)
      let aiText = "";
      let aiImage = "";

      if (Array.isArray(data)) {
        const item = data[0];
        aiText = item?.output || item?.text || item?.message;
        aiImage = item?.image || item?.imageUrl;
      } else {
        aiText = data.output || data.text || data.message || data.response;
        aiImage = data.image || data.imageUrl;
      }

      if (!aiText && !aiImage) {
        aiText = "Maaf, saya tidak menerima respon yang valid dari server.";
      }

      setMessages(prev => [...prev, { 
        role: 'model', 
        text: aiText ? String(aiText) : undefined,
        image: aiImage || undefined
      }]);
    } catch (error: any) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: "Koneksi terganggu. Pastikan workflow n8n Anda mendukung input gambar." 
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
        className={`fixed bottom-6 right-6 z-[150] w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95 ${
          isOpen ? 'bg-slate-800 text-white rotate-90' : 'bg-indigo-600 text-white animate-bounce-subtle'
        }`}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-24 right-6 z-[150] w-[calc(100vw-48px)] sm:w-[380px] h-[550px] max-h-[80vh] bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-100 flex flex-col overflow-hidden transition-all duration-500 origin-bottom-right ${
          isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-0 opacity-0 translate-y-10 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 text-white flex items-center gap-4">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
            <Zap size={20} className="fill-current" />
          </div>
          <div>
            <h3 className="font-black text-sm uppercase tracking-widest leading-none">Vell AI Assistant</h3>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold opacity-80 uppercase tracking-tighter">Vision Enabled</span>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50 scroll-smooth">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
              <div className={`max-w-[85%] p-3 rounded-2xl shadow-sm space-y-2 ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
              }`}>
                {msg.image && (
                  <div className="rounded-xl overflow-hidden border border-white/20">
                    <img src={msg.image} alt="Sent attachment" className="w-full h-auto max-h-60 object-cover" />
                  </div>
                )}
                {msg.text && (
                  <p className="text-xs leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                )}
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

        {/* Preview Image */}
        {selectedImage && (
          <div className="px-4 py-2 bg-slate-100 border-t flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-lg overflow-hidden border-2 border-white shadow-sm">
              <img src={selectedImage} className="w-full h-full object-cover" />
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl-lg"
              >
                <X size={10} />
              </button>
            </div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Siap dikirim...</span>
          </div>
        )}

        {/* Input Area */}
        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-100 flex gap-2 items-center">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
          >
            <ImageIcon size={20} />
          </button>
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tulis pesan..."
            className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
          
          <button
            type="submit"
            disabled={(!input.trim() && !selectedImage) || isLoading}
            className="w-11 h-11 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-all active:scale-90 disabled:opacity-50"
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
