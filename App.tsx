
import React, { useState, useEffect, useRef } from 'react';
import { Mail, Calendar, MapPin, Instagram, Video, Gift, ChevronDown, Copy, Check, ShoppingBag, UserCircle, Lock, X, Loader2, Users, CreditCard } from 'lucide-react';
import Countdown from './components/Countdown';
import FloatingMusic from './components/FloatingMusic';
import Dashboard from './components/Dashboard';
import ScrollReveal from './components/ScrollReveal';
import GuestBook from './components/GuestBook';
import { fetchWeddingData, getDriveMediaUrl, DEFAULT_WEDDING_DATA } from './constants';
import { WeddingData } from './types';

const ADMIN_PIN = "hanipupud2026";

// Helper to format date string from YYYY-MM-DD to Indonesian Long Date
const formatEventDate = (dateStr: string) => {
  if (!dateStr) return "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    
    return date.toLocaleDateString('id-ID', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  } catch (e) {
    return dateStr;
  }
};

// Helper to get Bank Logo based on name
const getBankLogo = (bankName: string) => {
  const name = bankName.toLowerCase();
  if (name.includes('bca')) return "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Bank_Central_Asia.svg/1200px-Bank_Central_Asia.svg.png";
  if (name.includes('mandiri')) return "https://upload.wikimedia.org/wikipedia/id/thumb/a/ad/Bank_Mandiri_logo_2016.svg/2560px-Bank_Mandiri_logo_2016.svg.png";
  if (name.includes('bni')) return "https://upload.wikimedia.org/wikipedia/id/thumb/5/55/BNI_logo.svg/1200px-BNI_logo.svg.png";
  if (name.includes('bri')) return "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/BRI_Logo.svg/1200px-BRI_Logo.svg.png";
  if (name.includes('dana')) return "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Logo_dana_blue.svg/1200px-Logo_dana_blue.svg.png";
  if (name.includes('bsi') || name.includes('syariah indonesia')) return "https://upload.wikimedia.org/wikipedia/id/thumb/a/a2/Logo_Bank_Syariah_Indonesia.svg/1200px-Logo_Bank_Syariah_Indonesia.svg.png";
  if (name.includes('bjb')) return "https://upload.wikimedia.org/wikipedia/id/thumb/b/b5/Bank_bjb_logo.svg/1200px-Bank_bjb_logo.svg.png";
  return null;
};

const App: React.FC = () => {
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
            assets: {
                ...DEFAULT_WEDDING_DATA.assets,
                ...data.assets
            }
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

  const getSectionStyle = (url?: string) => {
    if (!url) return {};
    return {
      backgroundImage: `url('${getDriveMediaUrl(url)}')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    };
  };

  const FloralCorner = ({ position }: { position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' }) => {
    const styles: Record<string, string> = {
      'top-left': '-top-10 -left-10',
      'top-right': '-top-10 -right-10 scale-x-[-1]',
      'bottom-left': '-bottom-10 -left-10 scale-y-[-1]',
      'bottom-right': '-bottom-10 -right-10 scale-x-[-1] scale-y-[-1]',
    };

    const internalOrigin: React.CSSProperties = { transformOrigin: 'top left' };

    return (
      <div className={`absolute pointer-events-none select-none z-30 w-48 h-48 md:w-64 md:h-64 ${styles[position]}`}>
        <div className="absolute inset-0 transform scale-x-[-1.25] scale-y-125 translate-x-4 translate-y-4 opacity-30">
            <img 
              src={getDriveMediaUrl(weddingData.assets.floralCornerBack || weddingData.assets.floralCorner)} 
              alt="floral-back" 
              className="w-full h-full object-contain animate-floral-sway blur-[1px]"
              style={{ ...internalOrigin, animationDuration: '10s', animationDelay: '0s' }}
            />
        </div>
        <div className="absolute inset-0 transform scale-110 -translate-x-2 -translate-y-2 opacity-60 rotate-6">
            <img 
              src={getDriveMediaUrl(weddingData.assets.floralCornerMid || weddingData.assets.floralCorner)} 
              alt="floral-mid" 
              className="w-full h-full object-contain animate-floral-sway"
              style={{ ...internalOrigin, animationDuration: '7s', animationDelay: '1s' }}
            />
        </div>
        <div className="absolute inset-0 opacity-100 drop-shadow-sm">
            <img 
              src={getDriveMediaUrl(weddingData.assets.floralCorner)} 
              alt="floral-front" 
              className="w-full h-full object-contain animate-floral-sway"
              style={{ ...internalOrigin, animationDuration: '5s', animationDelay: '0.5s' }}
              onError={(e) => {
                e.currentTarget.src = "https://www.transparentpng.com/download/floral/wedding-invitation-flower-png-30.png";
              }}
            />
        </div>
      </div>
    );
  };

  const FloralSide = ({ position, className = "" }: { position: 'left' | 'right', className?: string }) => {
    const hStyle = position === 'left' 
        ? 'left-0 -translate-x-1/3' 
        : 'right-0 translate-x-1/3 scale-x-[-1]';

    const originStyle: React.CSSProperties = {
        transformOrigin: 'center left' 
    };

    return (
        <div className={`absolute pointer-events-none select-none z-20 w-24 h-96 opacity-60 ${hStyle} ${className}`}>
            <img 
              src={getDriveMediaUrl(weddingData.assets.floralSide || weddingData.assets.floralCorner)} 
              alt="floral-side" 
              className="w-full h-full object-contain animate-floral-sway-gentle"
              style={{ ...originStyle, animationDuration: '12s' }}
            />
        </div>
    );
  };

  const BgOverlay = ({ hasImage }: { hasImage: boolean }) => {
    if (!hasImage) return null;
    return <div className="absolute inset-0 bg-white/85 pointer-events-none z-0"></div>;
  };

  if (showPinPrompt) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
        <div className="bg-white rounded-3xl p-6 w-full max-w-[360px] shadow-2xl animate-fade-in-up">
          <div className="flex justify-between items-start mb-6">
            <div className="bg-blue-50 p-3 rounded-2xl text-blue-900">
              <Lock className="w-6 h-6" />
            </div>
            <button onClick={() => setShowPinPrompt(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-6 h-6" />
            </button>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Akses Dasbor</h2>
          <p className="text-slate-500 text-sm mb-6">Masukkan PIN keamanan untuk mengelola data undangan pernikahan Anda.</p>
          
          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <input 
                type="password" 
                placeholder="Masukkan PIN" 
                autoFocus
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                className={`w-full p-4 bg-slate-50 border ${pinError ? 'border-red-500' : 'border-slate-200'} rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-center text-xl tracking-widest`}
              />
              {pinError && <p className="text-red-500 text-xs mt-2 text-center font-bold">PIN yang Anda masukkan salah!</p>}
            </div>
            <button 
              type="submit"
              className="w-full bg-blue-900 text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-blue-800 transition-all shadow-lg active:scale-95"
            >
              Masuk Dasbor
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (isDashboardOpen) {
    return (
      <Dashboard 
        data={weddingData} 
        onUpdate={(newData) => {
          setWeddingData(newData);
        }} 
        onClose={() => setIsDashboardOpen(false)} 
      />
    );
  }

  const MobileWrapper = ({ children, className = "" }: { children?: React.ReactNode, className?: string }) => (
    <div className={`max-w-[480px] w-full mx-auto bg-watercolor min-h-screen shadow-2xl relative overflow-x-hidden ${className}`}>
      {children}
    </div>
  );

  if (!isOpen) {
    return (
      <MobileWrapper className="flex flex-col relative h-screen overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{ 
            backgroundImage: `url('${getDriveMediaUrl(weddingData.assets.splashBg)}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent z-0"></div>
        <button 
          onClick={() => setShowPinPrompt(true)}
          className="absolute top-4 right-4 z-[60] p-2 text-blue-900/50 hover:text-blue-900 transition-colors"
          title="Login Admin"
        >
          <UserCircle size={24} />
        </button>
        <FloralCorner position="top-left" />
        <FloralCorner position="top-right" />
        <FloralCorner position="bottom-right" />
        <div className="z-10 relative flex flex-col h-full justify-end pb-16 px-8 w-full animate-fade-in-up items-start">
            <p className="text-slate-600 font-serif font-bold text-sm mb-2">The Wedding of</p>
            <h1 className="text-5xl font-serif text-blue-900 mb-8 leading-none">
              {weddingData.coupleShortName.split('&')[0]} <span className="font-script text-4xl italic font-light">&</span> {weddingData.coupleShortName.split('&')[1]}
            </h1>
            <div className="w-full text-left">
                <p className="text-slate-500 text-sm font-bold mb-1">Kepada Bapak/Ibu/Saudara/i</p>
                <h2 className="text-slate-800 text-2xl font-serif mb-6 capitalize">{guestName}</h2>
                <button 
                    onClick={handleOpenInvitation}
                    className="flex items-center gap-3 bg-blue-900 text-white px-6 py-3 rounded-full transition-all duration-300 shadow-xl hover:bg-blue-800 active:scale-95 font-bold text-sm"
                >
                    <Mail className="w-4 h-4" />
                    <span>Buka Undangan</span>
                </button>
            </div>
        </div>
      </MobileWrapper>
    );
  }

  return (
    <MobileWrapper>
      <div className="font-sans selection:bg-blue-900 selection:text-white pb-24">
        <FloatingMusic audioUrl={weddingData.audioUrl} />
        
        {/* Hero Section */}
        <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-12">
          <FloralCorner position="top-left" />
          <FloralCorner position="top-right" />
          
          <div className="animate-fade-in-up w-full">
            <p className="text-blue-900 font-serif tracking-[0.4em] mb-8 text-xs uppercase font-bold">Save Our Date</p>
            <div className="relative mb-10">
                <div className="arched-image w-64 border-[6px] border-white shadow-xl mx-auto overflow-hidden bg-white">
                    <img src={getDriveMediaUrl(weddingData.assets.heroImage)} alt="Couple" className="w-full h-full object-cover" />
                </div>
            </div>
            <h2 className="font-script text-6xl text-blue-900 mb-6 leading-none">
              {weddingData.brideName.split(' ')[0]} <span className="text-4xl">&</span> {weddingData.groomName.split(' ')[0]}
            </h2>
            <Countdown targetDate={weddingData.weddingDate} />
            <p className="text-blue-900 font-serif tracking-[0.2em] mt-10 text-sm font-bold px-4 leading-relaxed">
              {new Date(weddingData.weddingDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase()}
            </p>
            <div className="mt-16 animate-bounce opacity-40">
                <ChevronDown className="text-blue-900 w-8 h-8 mx-auto" />
            </div>
          </div>
        </section>

        {/* Couple Section */}
        <section 
          className="py-20 px-6 text-center relative overflow-hidden"
          style={getSectionStyle(weddingData.assets.coupleBg)}
        >
          <BgOverlay hasImage={!!weddingData.assets.coupleBg} />
          <FloralSide position="left" className="top-20" />
          <FloralSide position="right" className="bottom-32" />
          <div className="relative z-10">
            <ScrollReveal>
                <div className="font-script text-4xl text-blue-900 mb-2">Assalamu'alaikum Wr. Wb.</div>
                {guestName && guestName !== 'Tamu Undangan' && (
                  <div className="text-lg font-bold text-blue-900 mb-6 animate-fade-in-up capitalize">
                     Kepada Yth. {guestName}
                  </div>
                )}
                <p className="text-slate-600 mb-16 leading-relaxed text-sm font-light">
                    Maha Suci Allah yang telah menciptakan mahluk-Nya berpasang-pasangan. Ya Allah, perkenankanlah kami merangkaikan kasih sayang-Mu dalam ikatan pernikahan:
                </p>
            </ScrollReveal>
            <div className="flex flex-col gap-16 items-center">
                <ScrollReveal direction="left" delay={200} className="w-full">
                    <div className="group relative w-full">
                        <div className="arched-image w-56 mx-auto mb-6 border-[5px] border-white shadow-xl">
                            <img src={getDriveMediaUrl(weddingData.assets.bridePhoto)} alt="Bride" className="w-full h-full object-cover" />
                        </div>
                        <h3 className="font-script text-4xl text-blue-900 mb-2">{weddingData.brideName}</h3>
                        <div className="w-12 h-0.5 bg-blue-100 mx-auto mb-3"></div>
                        <p className="text-slate-500 italic mb-4 text-xs">Putri dari {weddingData.brideParents}</p>
                        {weddingData.brideInstagram && (
                          <a href={weddingData.brideInstagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 text-blue-900 hover:bg-blue-900 hover:text-white transition-all shadow-md">
                              <Instagram className="w-5 h-5" />
                          </a>
                        )}
                    </div>
                </ScrollReveal>
                <ScrollReveal direction="right" delay={400} className="w-full">
                    <div className="group relative w-full">
                        <div className="arched-image w-56 mx-auto mb-6 border-[5px] border-white shadow-xl">
                            <img src={getDriveMediaUrl(weddingData.assets.groomPhoto)} alt="Groom" className="w-full h-full object-cover" />
                        </div>
                        <h3 className="font-script text-4xl text-blue-900 mb-2">{weddingData.groomName}</h3>
                        <div className="w-12 h-0.5 bg-blue-100 mx-auto mb-3"></div>
                        <p className="text-slate-500 italic mb-4 text-xs">Putra dari {weddingData.groomParents}</p>
                        {weddingData.groomInstagram && (
                          <a href={weddingData.groomInstagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 text-blue-900 hover:bg-blue-900 hover:text-white transition-all shadow-md">
                              <Instagram className="w-5 h-5" />
                          </a>
                        )}
                    </div>
                </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Events Section */}
        <section 
          className={`py-20 px-4 relative overflow-hidden ${!weddingData.assets.eventsBg ? 'bg-white/30 backdrop-blur-sm' : ''}`}
          style={getSectionStyle(weddingData.assets.eventsBg)}
        >
          <BgOverlay hasImage={!!weddingData.assets.eventsBg} />
          <FloralSide position="left" className="bottom-10" />
          <FloralSide position="right" className="top-10" />
          <div className="w-full relative z-10">
              <ScrollReveal>
                <h2 className="font-script text-5xl text-blue-900 text-center mb-12">Waktu & Tempat</h2>
              </ScrollReveal>
              <div className="flex flex-col gap-8">
                  {weddingData.events.map((event, idx) => (
                      <ScrollReveal key={idx} delay={idx * 200} direction="up">
                        <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-blue-50 text-center relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <Calendar className="w-12 h-12 text-blue-900" />
                            </div>
                            <h3 className="font-serif text-2xl text-blue-900 mb-6 border-b-2 border-blue-50 pb-4 uppercase tracking-wider">{event.title}</h3>
                            <p className="text-slate-800 font-bold text-lg mb-2">{formatEventDate(event.date)}</p>
                            <p className="text-blue-900 font-medium mb-6 text-sm">Pukul {event.time}</p>
                            <div className="space-y-4">
                                <MapPin className="text-red-400 w-8 h-8 mx-auto animate-pulse" />
                                <div>
                                  <h4 className="font-bold text-slate-800 text-base mb-2">{event.location}</h4>
                                  <p className="text-xs text-slate-500 leading-relaxed px-2">{event.address}</p>
                                </div>
                            </div>
                            <div className="space-y-4 mt-8">
                                <a href={event.mapsUrl} target="_blank" rel="noreferrer" className="block w-full bg-blue-900 text-white px-6 py-3 rounded-xl hover:bg-blue-800 transition-all shadow-lg font-bold uppercase tracking-widest text-[10px] text-center">
                                    Buka Google Maps
                                </a>
                                {event.mapsEmbedUrl && (
                                    <div className="w-full h-48 rounded-2xl overflow-hidden border-2 border-blue-50 shadow-inner">
                                        <iframe 
                                            src={event.mapsEmbedUrl} 
                                            width="100%" 
                                            height="100%" 
                                            style={{ border: 0 }} 
                                            allowFullScreen={true} 
                                            loading="lazy" 
                                            referrerPolicy="no-referrer-when-downgrade"
                                        ></iframe>
                                    </div>
                                )}
                            </div>
                        </div>
                      </ScrollReveal>
                  ))}
              </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section 
            className="py-20 px-4 relative overflow-hidden"
            style={getSectionStyle(weddingData.assets.galleryBg)}
        >
          <BgOverlay hasImage={!!weddingData.assets.galleryBg} />
          <div className="relative z-10">
            <ScrollReveal>
                <div className="text-center mb-12">
                    <h2 className="font-script text-5xl text-blue-900 mb-4">Momen Bahagia</h2>
                </div>
            </ScrollReveal>
            <div className="grid grid-cols-2 gap-3 p-2">
                {weddingData.gallery.map((img, idx) => (
                    <ScrollReveal key={img.id} delay={idx * 100} direction={idx % 2 === 0 ? "left" : "right"}>
                        <div className={`overflow-hidden rounded-2xl shadow-lg relative aspect-square`}>
                            <img 
                                src={getDriveMediaUrl(img.url)} 
                                alt={img.alt} 
                                className="w-full h-full object-cover transition-transform duration-1000" 
                            />
                        </div>
                    </ScrollReveal>
                ))}
            </div>
          </div>
        </section>

        {/* Gift Section - Kartu ATM Style with Auto Logo */}
        <section 
            ref={giftSectionRef} 
            className={`py-20 px-6 relative overflow-hidden ${!weddingData.assets.giftBg ? 'bg-blue-50/50 backdrop-blur-sm' : ''}`}
            style={getSectionStyle(weddingData.assets.giftBg)}
        >
          <BgOverlay hasImage={!!weddingData.assets.giftBg} />
          <FloralSide position="left" className="bottom-20" />
          <FloralSide position="right" className="top-0" />
          <div className="w-full relative z-10 max-w-sm mx-auto">
              <ScrollReveal>
                <h2 className="font-script text-5xl text-blue-900 mb-2 text-center">Wedding Gift</h2>
                <p className="text-slate-500 text-[10px] text-center mb-10 uppercase tracking-widest font-bold">Doa restu Anda merupakan hadiah terindah bagi kami. Namun jika Anda ingin memberikan hadiah fisik, Anda dapat menyalurkannya melalui:</p>
              </ScrollReveal>
              
              <div className="flex flex-col gap-10">
                {weddingData.bankAccounts.map((bank, idx) => {
                  const logoUrl = getBankLogo(bank.bankName);
                  return (
                    <ScrollReveal key={idx} delay={idx * 150} direction="up">
                        <div className="relative group">
                            {/* ATM Card Design */}
                            <div className="aspect-[1.6/1] w-full rounded-[1.5rem] p-6 text-white shadow-2xl overflow-hidden relative transition-transform duration-500 group-hover:scale-[1.02]"
                                style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)' }}>
                                
                                {/* Texture Overlay */}
                                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                                
                                {/* Bank Logo or Name */}
                                <div className="absolute top-6 right-6 flex items-center justify-end">
                                    {logoUrl ? (
                                        <div className="bg-white/90 p-1.5 rounded-lg shadow-sm">
                                            <img src={logoUrl} alt={bank.bankName} className="h-6 object-contain" />
                                        </div>
                                    ) : (
                                        <div className="font-bold italic text-lg tracking-wider opacity-90">{bank.bankName}</div>
                                    )}
                                </div>
                                
                                {/* Card Chip Simulation */}
                                <div className="w-12 h-9 bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-md relative overflow-hidden shadow-inner mb-8">
                                    <div className="absolute inset-0 flex flex-wrap p-1">
                                        {[...Array(6)].map((_, i) => (
                                            <div key={i} className="w-1/2 h-1/3 border-[0.5px] border-black/10"></div>
                                        ))}
                                    </div>
                                </div>
                                
                                {/* Account Number */}
                                <div className="font-mono text-xl md:text-2xl mb-6 tracking-[0.2em] drop-shadow-md text-white/90">
                                    {bank.accountNumber.match(/.{1,4}/g)?.join(' ') || bank.accountNumber}
                                </div>
                                
                                {/* Account Holder */}
                                <div className="flex justify-between items-end">
                                    <div className="space-y-1">
                                        <div className="text-[8px] uppercase tracking-widest text-white/60">Account Holder</div>
                                        <div className="font-bold text-sm uppercase tracking-wide truncate max-w-[180px]">{bank.accountHolder}</div>
                                    </div>
                                    <div className="bg-white/20 p-2 rounded-full">
                                        <CreditCard className="w-5 h-5 text-white/80" />
                                    </div>
                                </div>
                            </div>

                            {/* Copy Button Floating */}
                            <button 
                                onClick={() => copyToClipboard(bank.accountNumber, idx)}
                                className={`absolute -bottom-5 right-6 flex items-center gap-2 px-6 py-2.5 rounded-full shadow-lg font-bold text-[10px] uppercase tracking-widest transition-all ${
                                    copiedIndex === idx 
                                    ? 'bg-green-500 text-white' 
                                    : 'bg-white text-blue-900 hover:bg-blue-50 active:scale-90'
                                }`}
                            >
                                {copiedIndex === idx ? (
                                    <><Check size={14} /> <span>Tersalin</span></>
                                ) : (
                                    <><Copy size={14} /> <span>Salin No. Rek</span></>
                                )}
                            </button>
                        </div>
                    </ScrollReveal>
                  );
                })}
              </div>
          </div>
        </section>

        {/* Turut Mengundang Section */}
        {weddingData.turutMengundang && weddingData.turutMengundang.length > 0 && (
          <section className="py-20 px-6 bg-slate-50 relative overflow-hidden">
            <FloralSide position="left" className="top-0 opacity-20" />
            <div className="relative z-10 max-w-md mx-auto text-center">
              <ScrollReveal>
                <Users className="w-10 h-10 mx-auto mb-4 text-blue-900 opacity-20" />
                <h2 className="font-script text-4xl text-blue-900 mb-8">Turut Mengundang</h2>
                <div className="space-y-4">
                  {weddingData.turutMengundang.map((name, idx) => (
                    <ScrollReveal key={idx} delay={idx * 100} direction="up">
                      <p className="text-slate-600 font-serif text-lg italic">{name}</p>
                    </ScrollReveal>
                  ))}
                </div>
              </ScrollReveal>
            </div>
          </section>
        )}

        <GuestBook guestName={guestName} />

        {/* Footer Section */}
        <footer className="py-12 px-6 text-center bg-white relative">
          <p className="text-slate-400 text-[10px] mb-4 tracking-[0.4em] font-bold uppercase">Kami Yang Berbahagia</p>
          <ScrollReveal>
            <p className="font-script text-5xl text-blue-900 mb-10">{weddingData.coupleShortName}</p>
          </ScrollReveal>
          
          <div className="flex flex-col items-center gap-6">
            <button 
              onClick={() => setShowPinPrompt(true)}
              className="p-4 text-slate-300 hover:text-blue-900 transition-all group flex flex-col items-center mx-auto"
              title="Login ke Dasbor"
            >
              <UserCircle className="w-8 h-8 opacity-30 group-hover:opacity-100 transition-opacity" />
              <span className="text-[8px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity mt-1 font-bold">Akses Dasbor</span>
            </button>
            
            <div className="space-y-2">
              <div className="text-[8px] tracking-[0.4em] text-slate-300 uppercase font-black">Digital Invitation • 2025</div>
              <a 
                href="https://www.vell.web.id" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block text-[10px] tracking-[0.2em] text-blue-900/40 hover:text-blue-900 font-bold uppercase transition-colors"
              >
                Powered by Vell
              </a>
            </div>
          </div>
        </footer>
      </div>
    </MobileWrapper>
  );
};

export default App;
