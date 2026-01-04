
import React, { useState, useEffect, useRef } from 'react';
import { Mail, Calendar, MapPin, Copy, Check, UserCircle, Lock, X, Loader2 } from 'lucide-react';
import Countdown from './Countdown';
import FloatingMusic from './FloatingMusic';
import Dashboard from './Dashboard';
import ScrollReveal from './ScrollReveal';
import GuestBook from './GuestBook';
import { fetchWeddingData, getDriveMediaUrl, DEFAULT_WEDDING_DATA } from '../constants';
import { WeddingData } from '../types';
import { FloralCorner, FloralSideDecoration, HeroFloralBackdrop } from './wedding/WeddingDecorations';

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
    return { 
      backgroundImage: `url('${getDriveMediaUrl(url)}')`, 
      backgroundSize: 'cover', 
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    };
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

  if (!isOpen) {
    return (
      <MobileWrapper>
        <div className="absolute inset-0 z-0" style={{ backgroundImage: `url('${getDriveMediaUrl(weddingData.assets.splashBg)}')`, backgroundSize: 'cover', backgroundPosition: 'center top' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent z-0" />
        <FloralCorner position="top-left" assets={weddingData.assets} />
        <FloralCorner position="top-right" assets={weddingData.assets} />
        <div className="z-10 relative flex flex-col h-screen justify-end pb-16 px-8 animate-fade-in-up">
          <p className="text-slate-600 font-serif font-bold text-sm mb-2 uppercase tracking-widest text-shadow-soft text-glow-white">The Wedding of</p>
          <h1 className="text-5xl font-serif text-blue-900 mb-8 leading-none text-shadow-md text-glow-white">
            {weddingData.coupleShortName.split('&')[0]} <span className="font-script text-4xl text-shadow-soft">&</span> {weddingData.coupleShortName.split('&')[1]}
          </h1>
          <div className="w-full">
            <p className="text-slate-500 text-sm font-bold mb-1 text-shadow-soft text-glow-white">Kepada Bapak/Ibu/Saudara/i</p>
            <h2 className="text-slate-800 text-2xl font-serif mb-6 capitalize text-shadow-soft text-glow-white">{guestName}</h2>
            <button onClick={handleOpenInvitation} className="flex items-center gap-3 bg-blue-900 text-white px-6 py-3 rounded-full shadow-xl font-bold text-sm"><Mail className="w-4 h-4" /> Buka Undangan</button>
          </div>
        </div>
      </MobileWrapper>
    );
  }

  return (
    <MobileWrapper>
      <div className="font-sans pb-24">
        <FloatingMusic audioUrl={weddingData.audioUrl} />
        
        {/* HERO SECTION */}
        <section 
          className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-12 overflow-visible"
          style={getSectionStyle(weddingData.assets.heroBg)}
        >
          {/* Background Decorations */}
          <FloralCorner position="top-left" assets={weddingData.assets} />
          <FloralCorner position="top-right" assets={weddingData.assets} />
          
          <div className="animate-fade-in-up w-full relative z-10 flex flex-col items-center">
            <p className="text-blue-900 font-serif tracking-[0.4em] mb-12 text-xs uppercase font-bold text-shadow-soft text-glow-white">The Wedding of</p>
            
            {/* Arched Image with Floral Backdrop Peeking Out */}
            <div className="relative w-64 mb-10 group">
               {/* Floral clusters peeking from behind */}
               <HeroFloralBackdrop assets={weddingData.assets} />
               
               {/* Central Image Frame */}
               <div className="arched-image relative z-10 w-full border-[8px] border-white shadow-[0_20px_60px_rgba(0,0,0,0.15)] mx-auto overflow-hidden bg-white ring-1 ring-slate-100/50">
                 <img src={getDriveMediaUrl(weddingData.assets.heroImage)} className="w-full h-full object-cover" />
               </div>
            </div>

            <h2 className="font-script text-6xl text-blue-900 mb-6 leading-none drop-shadow-sm text-shadow-md text-glow-white">
              {weddingData.coupleShortName.split('&')[0]} <span className="font-script text-4xl text-shadow-soft">&</span> {weddingData.coupleShortName.split('&')[1]}
            </h2>
            
            <p className="text-slate-500 text-[11px] font-medium leading-relaxed px-10 mb-8 text-shadow-soft text-glow-white">
                Kami berharap Anda menjadi bagian dari hari istimewa kami!
            </p>
            
            <Countdown targetDate={weddingData.weddingDate} />
            
            <p className="text-blue-900 font-serif tracking-[0.1em] mt-10 text-xs font-bold uppercase text-shadow-soft text-glow-white">
                {new Date(weddingData.weddingDate).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            
            <div className="mt-10">
                <button 
                  onClick={() => giftSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-blue-900 text-white px-10 py-3 rounded-full font-bold text-xs shadow-xl active:scale-95 transition-all uppercase tracking-widest"
                >
                  Save The Date
                </button>
            </div>
          </div>
        </section>

        {/* COUPLE SECTION */}
        <section className="py-20 px-6 text-center relative overflow-hidden" style={getSectionStyle(weddingData.assets.coupleBg)}>
          <FloralSideDecoration side="left" top="10%" assets={weddingData.assets} />
          <FloralSideDecoration side="right" top="60%" assets={weddingData.assets} />
          <div className="relative z-10">
            <ScrollReveal>
              <div className="font-script text-4xl text-blue-900 mb-2 text-shadow-soft text-glow-white">Assalamu'alaikum Wr. Wb.</div>
              <p className="text-slate-600 mb-16 leading-relaxed text-sm font-light text-shadow-soft text-glow-white">Maha Suci Allah yang telah menciptakan mahluk-Nya berpasang-pasangan...</p>
            </ScrollReveal>
            <div className="flex flex-col gap-16 items-center">
              <ScrollReveal direction="left" delay={200} className="w-full text-center">
                <div className="arched-image w-56 mx-auto mb-6 border-[5px] border-white shadow-xl">
                  <img src={getDriveMediaUrl(weddingData.assets.bridePhoto)} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-script text-4xl text-blue-900 mb-2 text-shadow-soft text-glow-white">{weddingData.brideName}</h3>
                <p className="text-slate-500 italic mb-4 text-xs text-shadow-soft text-glow-white">Putri dari {weddingData.brideParents}</p>
              </ScrollReveal>
              <ScrollReveal direction="right" delay={400} className="w-full text-center">
                <div className="arched-image w-56 mx-auto mb-6 border-[5px] border-white shadow-xl">
                  <img src={getDriveMediaUrl(weddingData.assets.groomPhoto)} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-script text-4xl text-blue-900 mb-2 text-shadow-soft text-glow-white">{weddingData.groomName}</h3>
                <p className="text-slate-500 italic mb-4 text-xs text-shadow-soft text-glow-white">Putra dari {weddingData.groomParents}</p>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* EVENTS SECTION */}
        <section className="py-20 px-4 relative bg-white/30 backdrop-blur-sm overflow-hidden" style={getSectionStyle(weddingData.assets.eventsBg)}>
          <FloralSideDecoration side="right" top="20%" assets={weddingData.assets} />
          <FloralSideDecoration side="left" top="70%" assets={weddingData.assets} />
          <div className="w-full relative z-10">
            <ScrollReveal><h2 className="font-script text-5xl text-blue-900 text-center mb-12 text-shadow-soft text-glow-white">Waktu & Tempat</h2></ScrollReveal>
            <div className="flex flex-col gap-8">
              {weddingData.events.map((event, idx) => (
                <ScrollReveal key={idx} delay={idx * 200} direction="up">
                  <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-blue-50 text-center">
                    <h3 className="font-serif text-2xl text-blue-900 mb-6 border-b-2 border-blue-50 pb-4 uppercase text-shadow-soft">{event.title}</h3>
                    <p className="text-slate-800 font-bold text-lg mb-2 text-shadow-soft">{formatEventDate(event.date)}</p>
                    <p className="text-blue-900 font-medium mb-6 text-sm text-shadow-soft">Pukul {event.time}</p>
                    <div className="space-y-4">
                      <MapPin className="text-red-400 w-8 h-8 mx-auto animate-pulse" />
                      <h4 className="font-bold text-slate-800 text-base text-shadow-soft">{event.location}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed px-2 text-shadow-soft">{event.address}</p>
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
            <ScrollReveal><h2 className="font-script text-5xl text-blue-900 mb-8 text-shadow-soft text-glow-white">Momen Bahagia</h2></ScrollReveal>
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
            <ScrollReveal><h2 className="font-script text-5xl text-blue-900 mb-10 text-shadow-soft text-glow-white">Wedding Gift</h2></ScrollReveal>
            <div className="flex flex-col gap-10">
              {weddingData.bankAccounts.map((bank, idx) => (
                <ScrollReveal key={idx} delay={idx * 150} direction="up">
                  <div className="bg-indigo-900 p-6 rounded-[1.5rem] text-white shadow-2xl relative text-left overflow-hidden">
                    <div className="font-bold mb-8 opacity-90 text-shadow-md">{bank.bankName}</div>
                    <div className="font-mono text-xl mb-6 tracking-widest text-shadow-md">{bank.accountNumber}</div>
                    <div className="text-[10px] uppercase opacity-60 text-shadow-soft">Atas Nama</div>
                    <div className="font-bold text-sm uppercase text-shadow-md">{bank.accountHolder}</div>
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
          <p className="text-slate-400 text-[10px] mb-4 tracking-[0.4em] font-bold uppercase text-shadow-soft text-glow-white">Kami Yang Berbahagia</p>
          <ScrollReveal><p className="font-script text-5xl text-blue-900 mb-10 text-shadow-soft text-glow-white">{weddingData.coupleShortName}</p></ScrollReveal>
          <button onClick={() => setShowPinPrompt(true)} className="p-4 text-slate-300 hover:text-blue-900 transition-all flex flex-col items-center mx-auto">
            <UserCircle className="w-8 h-8 opacity-30" />
            <span className="text-[8px] uppercase tracking-widest mt-1 font-bold text-shadow-soft text-glow-white">Akses Dasbor</span>
          </button>
          <div className="text-[8px] tracking-[0.4em] text-slate-300 uppercase font-black mt-10 text-shadow-soft text-glow-white">Digital Invitation • 2026</div>
        </footer>
      </div>
    </MobileWrapper>
  );
};

export default WeddingInvitation;
