
import React, { useState, useEffect } from 'react';
import { User, MessageCircle, CheckCircle, XCircle, HelpCircle, Send, Lock, Loader2, RefreshCw } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import { GuestMessage } from '../types';
import { fetchGuestMessages, sendGuestMessageToCloud } from '../constants';

interface GuestBookProps {
  guestName: string;
}

const GuestBook: React.FC<GuestBookProps> = ({ guestName }) => {
  const [messages, setMessages] = useState<GuestMessage[]>([]);
  const [attendance, setAttendance] = useState<'hadir' | 'tidak' | 'ragu'>('hadir');
  const [inputMessage, setInputMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);

  // Cek apakah tamu valid (bukan default)
  const isGuestValid = guestName && guestName.toLowerCase() !== 'tamu undangan';

  const loadMessages = async () => {
    setIsLoadingMessages(true);
    try {
        const data = await fetchGuestMessages();
        // Urutkan dari yang terbaru (asumsi id adalah timestamp atau urutan masuk)
        const sortedData = data.sort((a, b) => Number(b.id) - Number(a.id));
        setMessages(sortedData);
    } catch (e) {
        console.error("Error loading messages");
    } finally {
        setIsLoadingMessages(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isGuestValid || !inputMessage.trim()) return;

    setIsSubmitting(true);

    const newMessage: GuestMessage = {
      id: Date.now().toString(),
      name: guestName,
      attendance: attendance,
      message: inputMessage,
      timestamp: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
    };

    try {
      // Optimistic UI Update: Tampilkan dulu sebelum sukses fetch
      setMessages([newMessage, ...messages]);
      setHasSubmitted(true);
      setInputMessage('');
      
      // Kirim ke Database
      await sendGuestMessageToCloud(newMessage);
      
    } catch (error) {
      alert("Gagal mengirim pesan. Silakan coba lagi.");
      // Rollback jika gagal (opsional, tapi untuk UX lebih baik biarkan dulu)
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAttendanceIcon = (status: string) => {
    switch (status) {
      case 'hadir': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'tidak': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <HelpCircle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getAttendanceLabel = (status: string) => {
    switch (status) {
      case 'hadir': return 'Hadir';
      case 'tidak': return 'Berhalangan';
      default: return 'Masih Ragu';
    }
  };

  return (
    <section className="py-20 px-6 bg-white relative">
      <div className="relative z-10 max-w-md mx-auto">
        <ScrollReveal>
          <div className="text-center mb-10">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-blue-900 opacity-20" />
            <h2 className="font-script text-5xl text-blue-900 mb-4 animate-fade-in-up">Kehadiran & Ucapan</h2>
            <p className="text-slate-500 text-xs animate-fade-in-up" style={{ animationDelay: '0.2s' }}>Mohon konfirmasi kehadiran dan berikan doa restu Anda.</p>
          </div>
        </ScrollReveal>

        {/* Form Section */}
        <ScrollReveal delay={200}>
          <div className="bg-slate-50 p-6 rounded-[2rem] shadow-lg border border-blue-50 mb-12">
            {!isGuestValid ? (
              <div className="text-center py-6 px-2">
                <Lock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="font-bold text-slate-700 mb-2">Akses Terbatas</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Mohon maaf, fitur pengisian buku tamu hanya tersedia bagi tamu yang menerima tautan undangan personal (dengan nama yang tercantum).
                </p>
              </div>
            ) : hasSubmitted ? (
              <div className="text-center py-8 animate-fade-in-up">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-serif text-xl text-blue-900 mb-2">Terima Kasih!</h3>
                <p className="text-xs text-slate-500">Konfirmasi kehadiran dan ucapan Anda telah kami terima.</p>
                <button 
                  onClick={() => setHasSubmitted(false)}
                  className="mt-6 text-[10px] font-bold text-blue-900 underline uppercase tracking-widest"
                >
                  Kirim Ucapan Lagi
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400 ml-2">Nama Tamu</label>
                  <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200">
                    <User className="w-5 h-5 text-blue-900/50" />
                    <span className="font-bold text-slate-700 capitalize">{guestName}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400 ml-2">Konfirmasi Kehadiran</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['hadir', 'ragu', 'tidak'].map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setAttendance(status as any)}
                        className={`p-2 rounded-xl border text-[10px] font-bold uppercase transition-all flex flex-col items-center gap-1 ${
                          attendance === status 
                            ? 'bg-blue-900 text-white border-blue-900 shadow-md transform scale-105' 
                            : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {status === 'hadir' && <CheckCircle size={14} />}
                        {status === 'ragu' && <HelpCircle size={14} />}
                        {status === 'tidak' && <XCircle size={14} />}
                        <span>{status === 'tidak' ? 'Maaf' : status}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400 ml-2">Ucapan & Doa</label>
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Tuliskan ucapan dan doa restu Anda di sini..."
                    className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm min-h-[120px] resize-none placeholder:text-slate-300"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !inputMessage.trim()}
                  className="w-full bg-blue-900 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-blue-800 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2"><Loader2 className="animate-spin" size={16} /> Mengirim...</span>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Kirim Ucapan</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </ScrollReveal>

        {/* List Ucapan */}
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-center font-serif text-lg text-slate-800">Doa & Ucapan Terbaru</h3>
                <button 
                    onClick={loadMessages} 
                    className="p-2 text-blue-900 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors"
                    disabled={isLoadingMessages}
                >
                    <RefreshCw size={14} className={isLoadingMessages ? 'animate-spin' : ''} />
                </button>
            </div>
            
            {isLoadingMessages ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 opacity-50" />
                    Memuat ucapan...
                </div>
            ) : messages.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs italic bg-slate-50 rounded-xl border border-dashed">
                    Belum ada ucapan. Jadilah yang pertama memberikan doa restu!
                </div>
            ) : (
                messages.map((msg, idx) => (
                    <ScrollReveal key={msg.id || idx} delay={idx * 50} direction="up">
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex gap-4 transition-transform hover:scale-[1.01]">
                            <div className="flex-shrink-0">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-lg ${
                                    msg.attendance === 'hadir' ? 'bg-blue-900' : 
                                    msg.attendance === 'ragu' ? 'bg-yellow-500' : 'bg-slate-400'
                                }`}>
                                    {(msg.name || 'A').charAt(0).toUpperCase()}
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-bold text-slate-800 text-sm capitalize animate-fade-in-up">{msg.name}</h4>
                                    <div className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100 animate-fade-in-up">
                                        {getAttendanceIcon(msg.attendance)}
                                        <span className="text-[8px] uppercase font-bold text-slate-500">{getAttendanceLabel(msg.attendance)}</span>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-600 leading-relaxed mb-2 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>{msg.message}</p>
                                <span className="text-[10px] text-slate-300 block animate-fade-in-up" style={{ animationDelay: '0.2s' }}>{msg.timestamp}</span>
                            </div>
                        </div>
                    </ScrollReveal>
                ))
            )}
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f5f9;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 10px;
        }
      `}</style>
    </section>
  );
};

export default GuestBook;
