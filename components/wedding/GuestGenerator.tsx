
import React, { useState, useEffect } from 'react';
import { 
  Send, 
  UserPlus, 
  ArrowLeft, 
  MessageSquare, 
  Copy, 
  Check, 
  Phone, 
  Settings2, 
  ExternalLink,
  Loader2,
  Trash2
} from 'lucide-react';
import { fetchWeddingData, getDriveMediaUrl, DEFAULT_WEDDING_DATA } from '../../constants';
import { WeddingData } from '../../types';

const GuestGenerator: React.FC = () => {
  const [weddingData, setWeddingData] = useState<WeddingData | null>(null);
  const [guestName, setGuestName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [messageTemplate, setMessageTemplate] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initData = async () => {
      try {
        const data = await fetchWeddingData();
        const mergedData = { ...DEFAULT_WEDDING_DATA, ...data };
        setWeddingData(mergedData);
        
        // Format Initial Template
        const firstEvent = mergedData.events[0];
        const dateStr = firstEvent.date.includes('-') 
          ? new Date(firstEvent.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
          : firstEvent.date;

        const defaultMsg = `Assalamu’alaikum Warahmatullahi Wabarakatuh / Salam Sejahtera,\n\nTanpa mengurangi rasa hormat, izinkan kami mengundang Bapak/Ibu/Saudara/i [Nama Tamu] untuk hadir di acara pernikahan kami:\n\n*${mergedData.groomName} & ${mergedData.brideName}*\n\nWaktu: ${dateStr}\nPukul: ${firstEvent.time}\nTempat: ${firstEvent.location}\nLink Lokasi: ${firstEvent.mapsUrl}\n\nLink Undangan Digital:\n[Link Undangan]\n\nMerupakan suatu kehormatan bagi kami apabila Bapak/Ibu berkenan hadir untuk memberikan doa restu bagi kami berdua.\n\nTerima kasih atas perhatiannya. Kami yang berbahagia,\n*${mergedData.coupleShortName} & Keluarga Besar*`;
        
        setMessageTemplate(defaultMsg);
      } catch (err) {
        console.error("Failed to fetch wedding data", err);
      } finally {
        setIsLoading(false);
      }
    };
    initData();
  }, []);

  const getProcessedMessage = (name: string) => {
    const baseUrl = window.location.origin + '/undangan/hani-pupud';
    const guestLink = `${baseUrl}?to=${encodeURIComponent(name || "Tamu Undangan")}`;
    
    return messageTemplate
      .replace(/\[Nama Tamu\]/g, name || "Bapak/Ibu/Saudara/i")
      .replace(/\[Link Undangan\]/g, guestLink);
  };

  const handlePickContact = async () => {
    // Check if Contact Picker API is available
    if ('contacts' in navigator && 'select' in (navigator as any).contacts) {
      try {
        const props = ['name', 'tel'];
        const opts = { multiple: false };
        const contacts = await (navigator as any).contacts.select(props, opts);
        
        if (contacts.length > 0) {
          const contact = contacts[0];
          if (contact.name && contact.name[0]) setGuestName(contact.name[0]);
          if (contact.tel && contact.tel[0]) {
            // Clean phone number (remove spaces, dashes, etc)
            const cleanNum = contact.tel[0].replace(/[^0-9+]/g, '');
            setPhoneNumber(cleanNum);
          }
        }
      } catch (err) {
        console.log("Contact picker cancelled or failed", err);
      }
    } else {
      alert("Browser Anda tidak mendukung pengambilan kontak otomatis. Silakan masukkan secara manual.");
    }
  };

  const handleSendWhatsApp = () => {
    if (!phoneNumber) {
      alert("Mohon masukkan nomor WhatsApp tamu.");
      return;
    }

    const finalMessage = getProcessedMessage(guestName);
    // Format phone number (ensure starts with country code or clear digits)
    let formattedPhone = phoneNumber.replace(/[^0-9]/g, '');
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '62' + formattedPhone.substring(1);
    }
    
    const waUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(finalMessage)}`;
    window.open(waUrl, '_blank');
  };

  const handleCopyMessage = () => {
    const finalMessage = getProcessedMessage(guestName);
    navigator.clipboard.writeText(finalMessage);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Menghubungkan Database...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[480px] mx-auto min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 pb-20 shadow-2xl">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4 sticky top-0 z-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => window.history.back()} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <div>
            <h1 className="font-black text-lg text-slate-800 leading-none">Guest Generator</h1>
            <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-1">Hani & Pupud Wedding</p>
          </div>
        </div>
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
          <MessageSquare size={16} />
        </div>
      </header>

      <main className="p-6 space-y-8">
        {/* Step 1: Guest Info */}
        <section className="space-y-4 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black uppercase text-slate-400 tracking-widest">1. Data Tamu</h2>
            <button 
              onClick={handlePickContact}
              className="flex items-center gap-1.5 text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-all"
            >
              <UserPlus size={12} /> Ambil Kontak
            </button>
          </div>
          
          <div className="space-y-4 bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Nama Tamu</label>
              <input 
                placeholder="Contoh: Bapak Ahmad" 
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-bold"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Nomor WhatsApp</label>
              <div className="relative">
                <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                <input 
                  placeholder="081234..." 
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full p-4 pl-12 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-mono"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Step 2: Template Config */}
        <section className="space-y-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black uppercase text-slate-400 tracking-widest">2. Edit Template</h2>
            <div className="p-1.5 bg-slate-100 rounded-lg text-slate-400">
              <Settings2 size={14} />
            </div>
          </div>
          <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm">
            <textarea 
              value={messageTemplate}
              onChange={(e) => setMessageTemplate(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-xs leading-relaxed min-h-[240px] font-medium text-slate-600"
              placeholder="Tulis template pesan di sini..."
            />
            <p className="mt-3 text-[9px] text-slate-400 italic">
              Gunakan <b>[Nama Tamu]</b> untuk menyisipkan nama & <b>[Link Undangan]</b> untuk link personal.
            </p>
          </div>
        </section>

        {/* Step 3: Preview & Send */}
        <section className="space-y-4 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <h2 className="text-xs font-black uppercase text-slate-400 tracking-widest">3. Preview & Kirim</h2>
          <div className="bg-indigo-50 p-6 rounded-[2rem] border border-indigo-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
            
            <div className="relative z-10">
              <p className="text-[11px] text-slate-700 leading-relaxed font-medium whitespace-pre-wrap line-clamp-6 mb-6 opacity-70 italic">
                {getProcessedMessage(guestName)}
              </p>
              
              <div className="flex gap-2">
                <button 
                  onClick={handleSendWhatsApp}
                  disabled={!phoneNumber}
                  className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50"
                >
                  <Send size={16} /> Kirim WhatsApp
                </button>
                <button 
                  onClick={handleCopyMessage}
                  className="bg-white text-slate-700 p-4 rounded-2xl border border-slate-200 shadow-sm hover:bg-slate-50 transition-all flex items-center justify-center min-w-[56px]"
                  title="Salin Pesan"
                >
                  {isCopied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Tips Section */}
        <section className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <h3 className="text-[10px] font-black uppercase text-slate-800 tracking-widest mb-3 flex items-center gap-2">
            <ExternalLink size={12} className="text-indigo-600" /> Tips Mengirim
          </h3>
          <ul className="space-y-2 text-[10px] text-slate-500 leading-relaxed list-disc ml-4">
            <li>Gunakan <b>Pengambil Kontak</b> untuk mempercepat proses input.</li>
            <li>Pastikan nomor dimulai dengan 0 atau 62 (Kode Negara).</li>
            <li>Setelah klik kirim, WhatsApp akan terbuka secara otomatis.</li>
            <li>Anda bisa kembali ke halaman ini untuk tamu berikutnya.</li>
          </ul>
        </section>
      </main>

      <footer className="mt-auto py-8 text-center text-[9px] font-black uppercase tracking-[0.4em] text-slate-300">
        Vell Digital • Guest Management
      </footer>
      
      <style>{`
        .line-clamp-6 {
          display: -webkit-box;
          -webkit-line-clamp: 6;
          -webkit-box-orient: vertical;  
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default GuestGenerator;
