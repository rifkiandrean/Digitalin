
import React, { useState, useEffect, useRef } from 'react';
import { Mail, Calendar, MapPin, Copy, Check, UserCircle, Lock, X, Loader2 } from 'lucide-react';
import Countdown from './Countdown';
import FloatingMusic from './FloatingMusic';
import Dashboard from './Dashboard';
import ScrollReveal from './ScrollReveal';
import GuestBook from './GuestBook';
import { fetchWeddingData, getDriveMediaUrl, DEFAULT_WEDDING_DATA } from '../constants';
import { WeddingData } from '../types';
import { FloralCorner, FloralSideDecoration } from './wedding/WeddingDecorations';

const ADMIN_PIN = "hanipupud2026";

const WeddingInvitation: React.FC = () => {
  const [weddingData, setWeddingData] = useState<WeddingData | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [showPinPrompt, setShowPinPrompt] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);
  const [guestName, setGuestName] = useState('Tamu Undangan');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const giftSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const initData = async () => {
      try {
        const data = await fetchWeddingData();
        setWeddingData({
          ...DEFAULT_WEDDING_DATA,
          ...data,
          assets: { ...DEFAULT_WEDDING_DATA.assets, ...data.assets }
        });
      } catch (err) {
        setWeddingData(DEFAULT_WEDDING_DATA);
      }
    };
    initData();

    const params = new URLSearchParams(window.location.search);
    const to = params.get('to');
    if (to) setGuestName(to);
    
    if (params.get('admin') === 'true') {
      setShowPinPrompt(true);
    }
  }, []);

  useEffect(() => {
    if (!weddingData) return;
    if (!isOpen && !isDashboardOpen && !showPinPrompt) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen, isDashboardOpen, showPinPrompt, weddingData]);

  if (!weddingData) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 max-w-[480px] mx-auto shadow-2xl">
        <Loader2 className="w-10 h-10 text-blue-900 animate-spin mb-4" />
        <p className="text-blue-900 font-serif tracking-widest text-sm uppercase px-6 text-center">Menyiapkan Undangan...</p>
      </div>
    );
  }

  const handleOpenInvitation = () => {
    setIsOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === ADMIN_PIN) {
      setPinError(false);
      setShowPinPrompt(false);
      setIsDashboardOpen(true);
      setPinInput("");
    } else {
      setPinError(true);
      setPinInput("");
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const formatEventDate = (dateStr: string) => {
    if (!dateStr) return "";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    try {
      const [year, month, day] = dateStr.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    } catch (e) { return dateStr; }
  };

  const getSectionStyle = (url?: string) => {
    if (!url) return {};
    return { backgroundImage: `url('${getDriveMediaUrl(url)}')`, backgroundSize: 'cover', backgroundPosition: 'center' };
  };

  if (showPinPrompt) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
        <div className="bg-white rounded-3xl p-6 w-full max-w-[360px] shadow-2xl animate-fade-in-up">
          <div className="flex justify-between items-start mb-6">
            <div className="bg-blue-50 p-3 rounded-2xl text-blue-900"><Lock className="w-6 h-6" /></div>
            <button onClick={() => setShowPinPrompt(false)} className="text-slate-400 hover:text-slate-600"><X className="w-6 h-6" /></button>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Akses Dasbor</h2>
          <form onSubmit={handlePinSubmit} className="space-y-4">
            <input type="password" placeholder="Masukkan PIN" autoFocus value={pinInput} onChange={(e) => {setPinInput(e.target.value); setPinError(false);}} className={`w-full p-4 bg-slate-50 border ${pinError ? 'border-red-500' : 'border-slate-200'} rounded-2xl text-center text-xl tracking-widest`} />
            <button type="submit" className="w-full bg-blue-900 text-white py-4 rounded-2xl font-bold">Masuk Dasbor</button>
          </form>
        </div>
      </div>
    );
  }

  if (isDashboardOpen) {
    return <Dashboard data={weddingData} onUpdate={(newData) => setWeddingData(newData)} onClose={() => setIsDashboardOpen(false)} />;
  }

  const MobileWrapper = ({ children }: { children?: React.ReactNode }) => (
    <div className="max-w-[480px] w-full mx-auto bg-watercolor min-h-screen shadow-2xl relative overflow-x-hidden">{children}</div>
  );

  // BAGIAN AWAL (COVER / SPLASH SCREEN)
  if (!isOpen) {
    return (
      <MobileWrapper>
        {/* Background Layer - Fixed and Full Screen */}
        <div 
          className="absolute inset-0 z-0 transition-transform duration-[3s] scale-105" 
          style={{ 
            backgroundImage: `url('${getDriveMediaUrl(weddingData.assets.splashBg)}')`, 
            backgroundSize: 'cover', 
            backgroundPosition: 'center' 
          }} 
        />
        
        {/* Elegant Overlay Layer */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/60 z-0" />
        
        {/* Decorative Florals */}
        <FloralCorner position="top-left" assets={weddingData.assets} />
        <FloralCorner position="top-right" assets={weddingData.assets} />
        
        {/* Content Layer */}
        <div className="z-10 relative flex flex-col h-screen justify-end pb-20 px-8 animate-fade-in-up">
          <div className="text-white drop-shadow-lg">
            <p className="font-serif font-bold text-sm mb-2 tracking-[0.2em] opacity-90">The Wedding of</p>
            <h1 className="text-6xl font-serif mb-8 leading-none">
              {weddingData.coupleShortName.split('&')[0]} <span className="font-script text-4xl block mt-2">&</span> {weddingData.coupleShortName.split('&')[1]}
            </h1>
            
            <div className="w-full bg-white/10 backdrop-blur-md p-6 rounded-[2rem] border border-white/20 shadow-2xl">
              <p className="text-white/80 text-[10px] font-black uppercase tracking-widest mb-1">Kepada Bapak/Ibu/Saudara/i</p>
              <h2 className="text-white text-2xl font-serif mb-6 capitalize">{guestName}</h2>
              <button 
                onClick={handleOpenInvitation} 
                className="w-full flex items-center justify-center gap-3 bg-white text-blue-900 px-6 py-4 rounded-2xl shadow-xl font-black uppercase tracking-widest text-[11px] hover:bg-blue-50 transition-all active:scale-95"
              >
                <Mail className="w-4 h-4" /> Buka Undangan
              </button>
            </div>
          </div>
        </div>
      </MobileWrapper>
    );
  }

  return (
    <MobileWrapper>
      <div className="font-sans pb-24">
        <FloatingMusic audioUrl={weddingData.audioUrl} />
        
        {/* HERO SECTION (SETELAH DIBUKA) */}
        <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-12 overflow-hidden">
          {/* Subtle Background for Main Hero */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={getSectionStyle(weddingData.assets.splashBg)} />
          
          <FloralCorner position="top-left" assets={weddingData.assets} />
          <FloralCorner position="top-right" assets={weddingData.assets} />
          
          <div className="animate-fade-in-up w-full relative z-10">
            <p className="text-blue-900 font-serif tracking-[0.4em] mb-8 text-xs uppercase font-bold">Save Our Date</p>
            <div className="arched-image w-64 border-[6px] border-white shadow-xl mx-auto mb-10 overflow-hidden bg-white">
              <img src={getDriveMediaUrl(weddingData.assets.heroImage)} className="w-full h-full object-cover" />
            </div>
            <h2 className="font-script text-6xl text-blue-900 mb-6 leading-none">
              {weddingData.brideName.split(' ')[0]} <span>&</span> {weddingData.groomName.split(' ')[0]}
            </h2>
            <Countdown targetDate={weddingData.weddingDate} />
            <p className="text-blue-900 font-serif tracking-[0.2em] mt-10 text-sm font-bold uppercase">{new Date(weddingData.weddingDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </section>

        {/* COUPLE SECTION */}
        <section className="py-20 px-6 text-center relative overflow-hidden" style={getSectionStyle(weddingData.assets.coupleBg)}>
          <FloralSideDecoration side="left" top="10%" assets={weddingData.assets} />
          <FloralSideDecoration side="right" top="60%" assets={weddingData.assets} />
          <div className="relative z-10">
            <ScrollReveal>
              <div className="font-script text-4xl text-blue-900 mb-2">Assalamu'alaikum Wr. Wb.</div>
              <p className="text-slate-600 mb-16 leading-relaxed text-sm font-light px-4">Maha Suci Allah yang telah menciptakan mahluk-Nya berpasang-pasangan...</p>
            </ScrollReveal>
            <div className="flex flex-col gap-16 items-center">
              <ScrollReveal direction="left" delay={200} className="w-full text-center">
                <div className="arched-image w-56 mx-auto mb-6 border-[5px] border-white shadow-xl">
                  <img src={getDriveMediaUrl(weddingData.assets.bridePhoto)} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-script text-4xl text-blue-900 mb-2">{weddingData.brideName}</h3>
                <p className="text-slate-500 italic mb-4 text-xs">Putri dari {weddingData.brideParents}</p>
              </ScrollReveal>
              <ScrollReveal direction="right" delay={400} className="w-full text-center">
                <div className="arched-image w-56 mx-auto mb-6 border-[5px] border-white shadow-xl">
                  <img src={getDriveMediaUrl(weddingData.assets.groomPhoto)} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-script text-4xl text-blue-900 mb-2">{weddingData.groomName}</h3>
                <p className="text-slate-500 italic mb-4 text-xs">Putra dari {weddingData.groomParents}</p>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* EVENTS SECTION */}
        <section className="py-20 px-4 relative bg-white/30 backdrop-blur-sm overflow-hidden" style={getSectionStyle(weddingData.assets.eventsBg)}>
          <FloralSideDecoration side="right" top="20%" assets={weddingData.assets} />
          <FloralSideDecoration side="left" top="70%" assets={weddingData.assets} />
          <div className="w-full relative z-10">
            <ScrollReveal><h2 className="font-script text-5xl text-blue-900 text-center mb-12">Waktu & Tempat</h2></ScrollReveal>
            <div className="flex flex-col gap-8">
              {weddingData.events.map((event, idx) => (
                <ScrollReveal key={idx} delay={idx * 200} direction="up">
                  <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-blue-50 text-center">
                    <h3 className="font-serif text-2xl text-blue-900 mb-6 border-b-2 border-blue-50 pb-4 uppercase">{event.title}</h3>
                    <p className="text-slate-800 font-bold text-lg mb-2">{formatEventDate(event.date)}</p>
                    <p className="text-blue-900 font-medium mb-6 text-sm">Pukul {event.time}</p>
                    <div className="space-y-4">
                      <MapPin className="text-red-400 w-8 h-8 mx-auto animate-pulse" />
                      <h4 className="font-bold text-slate-800 text-base">{event.location}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed px-2">{event.address}</p>
                      <a href={event.mapsUrl} target="_blank" rel="noreferrer" className="block w-full bg-blue-900 text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px]">Buka Google Maps</a>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* GALLERY SECTION */}
        <section className="py-20 px-4 relative" style={getSectionStyle(weddingData.assets.galleryBg)}>
          <FloralSideDecoration side="left" top="5%" assets={weddingData.assets} />
          <div className="relative z-10 text-center">
            <ScrollReveal><h2 className="font-script text-5xl text-blue-900 mb-8">Momen Bahagia</h2></ScrollReveal>
            <div className="grid grid-cols-2 gap-3 p-2">
              {weddingData.gallery.map((img, idx) => (
                <ScrollReveal key={img.id} delay={idx * 100} direction={idx % 2 === 0 ? "left" : "right"}>
                  <div className="overflow-hidden rounded-2xl shadow-lg relative aspect-square">
                    <img src={getDriveMediaUrl(img.url)} className="w-full h-full object-cover" />
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* GIFT SECTION */}
        <section ref={giftSectionRef} className="py-20 px-6 relative bg-blue-50/50" style={getSectionStyle(weddingData.assets.giftBg)}>
          <FloralSideDecoration side="right" top="15%" assets={weddingData.assets} />
          <div className="w-full relative z-10 max-w-sm mx-auto text-center">
            <ScrollReveal><h2 className="font-script text-5xl text-blue-900 mb-10">Wedding Gift</h2></ScrollReveal>
            <div className="flex flex-col gap-10">
              {weddingData.bankAccounts.map((bank, idx) => (
                <ScrollReveal key={idx} delay={idx * 150} direction="up">
                  <div className="bg-indigo-900 p-6 rounded-[1.5rem] text-white shadow-2xl relative text-left overflow-hidden">
                    <div className="font-bold mb-8 opacity-90">{bank.bankName}</div>
                    <div className="font-mono text-xl mb-6 tracking-widest">{bank.accountNumber}</div>
                    <div className="text-[10px] uppercase opacity-60">Atas Nama</div>
                    <div className="font-bold text-sm uppercase">{bank.accountHolder}</div>
                    <button onClick={() => copyToClipboard(bank.accountNumber, idx)} className="absolute bottom-4 right-4 bg-white text-blue-900 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase shadow-lg flex items-center gap-1">
                      {copiedIndex === idx ? <Check size={12} /> : <Copy size={12} />} {copiedIndex === idx ? 'Tersalin' : 'Salin'}
                    </button>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* GUESTBOOK SECTION */}
        <GuestBook guestName={guestName} bgUrl={weddingData.assets.guestbookBg} />

        {/* FOOTER SECTION */}
        <footer className="py-12 px-6 text-center bg-white relative">
          <p className="text-slate-400 text-[10px] mb-4 tracking-[0.4em] font-bold uppercase">Kami Yang Berbahagia</p>
          <ScrollReveal><p className="font-script text-5xl text-blue-900 mb-10">{weddingData.coupleShortName}</p></ScrollReveal>
          <button onClick={() => setShowPinPrompt(true)} className="p-4 text-slate-300 hover:text-blue-900 transition-all flex flex-col items-center mx-auto">
            <UserCircle className="w-8 h-8 opacity-30" />
            <span className="text-[8px] uppercase tracking-widest mt-1 font-bold">Akses Dasbor</span>
          </button>
          <div className="text-[8px] tracking-[0.4em] text-slate-300 uppercase font-black mt-10">Digital Invitation • 2026</div>
        </footer>
      </div>
    </MobileWrapper>
  );
};

export default WeddingInvitation;
