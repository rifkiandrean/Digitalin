
import React, { useState, useEffect } from 'react';
import { User, MessageCircle, CheckCircle, XCircle, HelpCircle, Send, Lock, Loader2, RefreshCw } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import { GuestMessage } from '../types';
import { fetchGuestMessages, sendGuestMessageToCloud, getDriveMediaUrl } from '../constants';

interface GuestBookProps {
  guestName: string;
  bgUrl?: string;
}

const GuestBook: React.FC<GuestBookProps> = ({ guestName, bgUrl }) => {
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
        // Urutkan dari yang terbaru berdasarkan timestamp/id
        const sortedData = [...data].sort((a, b) => {
            const idA = parseInt(a.id) || 0;
            const idB = parseInt(b.id) || 0;
            return idB - idA;
        });
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
      timestamp: new Date().toLocaleString('id-ID', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric',
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };

    try {
      // Kirim ke Database (Sheet guestbook)
      await sendGuestMessageToCloud(newMessage);
      
      // Update UI
      setMessages(prev => [newMessage, ...prev]);
      setHasSubmitted(true);
      setInputMessage('');
    } catch (error) {
      alert("Gagal mengirim pesan. Silakan coba lagi.");
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

  const sectionStyle = bgUrl ? { 
    backgroundImage: `url('${getDriveMediaUrl(bgUrl)}')`, 
    backgroundSize: 'cover', 
    backgroundPosition: 'center' 
  } : {};

  return (
    <section className={`py-20 px-6 relative overflow-hidden ${bgUrl ? '' : 'bg-white'}`} style={sectionStyle}>
      {bgUrl && <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-0" />}
      <div className="relative z-10 max-w-md mx-auto">
        <ScrollReveal>
          <div className="text-center mb-10">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-blue-900 opacity-20" />
            <h2 className="font-script text-5xl text-blue-900 mb-4 animate-fade-in-up">Kehadiran & Ucapan</h2>
            <p className="text-slate-500 text-xs animate-fade-in-up">Mohon konfirmasi kehadiran dan berikan doa restu Anda.</p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <div className="bg-white/80 backdrop-blur-md p-6 rounded-[2rem] shadow-lg border border-blue-50 mb-12">
            {!isGuestValid ? (
              <div className="text-center py-6 px-2">
                <Lock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="font-bold text-slate-700 mb-2 text-sm">Akses Terbatas</h3>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Fitur buku tamu tersedia melalui tautan undangan personal.
                </p>
              </div>
            ) : hasSubmitted ? (
              <div className="text-center py-8 animate-fade-in-up">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-serif text-xl text-blue-900 mb-2">Terima Kasih!</h3>
                <p className="text-xs text-slate-500">Ucapan Anda telah tersimpan di buku tamu kami.</p>
                <button 
                  onClick={() => setHasSubmitted(false)}
                  className="mt-6 text-[10px] font-black text-blue-900 underline uppercase tracking-widest"
                >
                  Kirim Ucapan Lain
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Nama Anda</label>
                  <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                    <User className="w-4 h-4 text-blue-900/50" />
                    <span className="font-bold text-slate-700 capitalize text-sm">{guestName}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Kehadiran</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['hadir', 'ragu', 'tidak'].map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setAttendance(status as any)}
                        className={`p-3 rounded-2xl border text-[9px] font-black uppercase transition-all flex flex-col items-center gap-1.5 ${
                          attendance === status 
                            ? 'bg-blue-900 text-white border-blue-900 shadow-lg' 
                            : 'bg-white text-slate-400 border-slate-100 hover:bg-slate-50'
                        }`}
                      >
                        {status === 'hadir' && <CheckCircle size={14} />}
                        {status === 'ragu' && <HelpCircle size={14} />}
                        {status === 'tidak' && <XCircle size={14} />}
                        <span>{status === 'tidak' ? 'Absen' : status}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Ucapan & Doa</label>
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Tuliskan doa restu Anda..."
                    className="w-full p-5 bg-white border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-900/20 outline-none text-sm min-h-[140px] resize-none shadow-sm"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !inputMessage.trim()}
                  className="w-full bg-blue-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-blue-800 transition-all shadow-xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <Send size={16} />
                  )}
                  {isSubmitting ? 'Mengirim...' : 'Kirim Sekarang'}
                </button>
              </form>
            )}
          </div>
        </ScrollReveal>

        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar pb-10">
            <div className="flex items-center justify-between mb-8 px-2">
                <h3 className="font-serif text-xl text-slate-800">Buku Tamu</h3>
                <button 
                    onClick={loadMessages} 
                    className="p-2.5 text-blue-900 bg-blue-50 rounded-full hover:bg-blue-100 transition-all active:rotate-180 duration-500"
                    disabled={isLoadingMessages}
                >
                    <RefreshCw size={14} className={isLoadingMessages ? 'animate-spin' : ''} />
                </button>
            </div>
            
            {isLoadingMessages ? (
                <div className="text-center py-10 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 opacity-20" />
                    Memperbarui Daftar...
                </div>
            ) : messages.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs italic bg-white/40 rounded-[2rem] border border-dashed border-slate-200">
                    Belum ada ucapan. Jadilah yang pertama!
                </div>
            ) : (
                messages.map((msg, idx) => (
                    <ScrollReveal key={msg.id || idx} delay={idx * 50} direction="up">
                        <div className="bg-white/90 backdrop-blur-md p-5 rounded-[2rem] shadow-sm border border-slate-50 flex gap-4 hover:shadow-md transition-all">
                            <div className="flex-shrink-0">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white text-xl shadow-inner ${
                                    msg.attendance === 'hadir' ? 'bg-blue-900' : 
                                    msg.attendance === 'ragu' ? 'bg-amber-500' : 'bg-slate-400'
                                }`}>
                                    {(msg.name || 'A').charAt(0).toUpperCase()}
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-black text-slate-800 text-xs capitalize truncate pr-2">{msg.name}</h4>
                                    <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100 flex-shrink-0">
                                        {getAttendanceIcon(msg.attendance)}
                                        <span className="text-[7px] uppercase font-black text-slate-500 tracking-tighter">{getAttendanceLabel(msg.attendance)}</span>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-600 leading-relaxed mb-3 italic">"{msg.message}"</p>
                                <div className="flex items-center justify-end">
                                    <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">{msg.timestamp}</span>
                                </div>
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
            background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #e2e8f0;
            border-radius: 10px;
        }
      `}</style>
    </section>
  );
};

export default GuestBook;
