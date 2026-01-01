import React, { useState, useEffect, useRef } from 'react';
import { 
  Mail, Calendar, MapPin, Instagram, Gift, ChevronDown, Copy, Check, 
  UserCircle, Lock, X, Loader2, Users, CreditCard, 
  Globe, Building2, Landmark, Heart, ShoppingCart, UtensilsCrossed, 
  Truck, ArrowRight, Star, ShieldCheck, Zap
} from 'lucide-react';
import Countdown from './components/Countdown';
import FloatingMusic from './components/FloatingMusic';
import Dashboard from './components/Dashboard';
import ScrollReveal from './components/ScrollReveal';
import GuestBook from './components/GuestBook';
import { fetchWeddingData, getDriveMediaUrl, DEFAULT_WEDDING_DATA } from './constants';
import { WeddingData } from './types';

const ADMIN_PIN = "hanipupud2026";

// --- HELPERS ---
const formatEventDate = (dateStr: string) => {
  if (!dateStr) return "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('id-ID', { 
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' 
    });
  } catch (e) { return dateStr; }
};

const getBankLogo = (bankName: string) => {
  const name = bankName.toLowerCase();
  if (name.includes('bca')) return "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Bank_Central_Asia.svg/1200px-Bank_Central_Asia.svg.png";
  if (name.includes('mandiri')) return "https://upload.wikimedia.org/wikipedia/id/thumb/a/ad/Bank_Mandiri_logo_2016.svg/2560px-Bank_Mandiri_logo_2016.svg.png";
  if (name.includes('dana')) return "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Logo_dana_blue.svg/1200px-Logo_dana_blue.svg.png";
  return null;
};

// --- LANDING PAGE COMPONENT ---
const LandingPage: React.FC = () => {
  useEffect(() => {
    document.title = "Vell Digital - Solusi Transformasi Digital Terpercaya";
  }, []);

  const services = [
    { icon: Building2, title: "Website Perusahaan", desc: "Company profile profesional untuk meningkatkan kredibilitas bisnis Anda." },
    { icon: Landmark, title: "Sistem Pemerintahan", desc: "Portal informasi dan layanan publik yang transparan serta efisien." },
    { icon: Heart, title: "Undangan Pernikahan", desc: "Undangan digital eksklusif dengan fitur RSVP, musik, dan navigasi.", link: "/undangan/hani-pupud" },
    { icon: ShoppingCart, title: "Sistem Ritel & POS", desc: "Kelola stok dan penjualan Anda dengan sistem inventaris modern." },
    { icon: UtensilsCrossed, title: "Menu Digital", desc: "QR Code menu untuk restoran dan kafe yang interaktif dan higienis." },
    { icon: Truck, title: "Aplikasi Pesan Antar", desc: "Solusi logistik dan delivery untuk menjangkau pelanggan lebih luas." }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold tracking-tighter flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">V</div>
            <span>VELL<span className="text-blue-500">DIGITAL</span></span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
            <a href="#" className="hover:text-white transition-colors">Beranda</a>
            <a href="#services" className="hover:text-white transition-colors">Layanan</a>
            <a href="#portfolio" className="hover:text-white transition-colors">Portofolio</a>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-bold transition-all">
            Mulai Proyek
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/20 blur-[120px] rounded-full -z-10 opacity-30"></div>
        <div className="max-w-7xl mx-auto text-center">
          <ScrollReveal direction="up">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-xs font-bold text-blue-400 mb-8 uppercase tracking-widest">
              <Zap size={14} /> Solusi Digital Masa Depan
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
              Transformasi Bisnis Anda <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Menuju Era Digital</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
              Kami membantu Anda membangun ekosistem digital yang kuat, mulai dari profil perusahaan hingga sistem kustom yang kompleks.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 group">
                Konsultasi Sekarang <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all">
                Lihat Karya Kami
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 px-6 bg-slate-950/50">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal direction="up" className="text-center mb-20">
            <h2 className="text-sm font-bold text-blue-500 uppercase tracking-[0.3em] mb-4">Layanan Kami</h2>
            <p className="text-3xl md:text-4xl font-bold mb-6">Solusi IT Terintegrasi untuk Segala Kebutuhan</p>
            <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full"></div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <ScrollReveal key={i} delay={i * 100} direction="up">
                <div className="group bg-slate-900 border border-white/5 p-8 rounded-[2.5rem] hover:border-blue-500/50 transition-all hover:bg-slate-900/50 h-full flex flex-col">
                  <div className="w-14 h-14 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
                    <s.icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold mb-4">{s.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-grow">{s.desc}</p>
                  {s.link ? (
                    <a href={s.link} className="flex items-center gap-2 text-blue-500 font-bold text-sm hover:underline">
                      Lihat Contoh <ArrowRight size={16} />
                    </a>
                  ) : (
                    <div className="text-slate-600 text-xs italic font-medium">Coming Soon</div>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Markers */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: ShieldCheck, label: "Keamanan Terjamin" },
            { icon: Zap, label: "Performa Cepat" },
            { icon: Star, label: "Desain Eksklusif" },
            { icon: Globe, label: "Skalabilitas Global" }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <item.icon className="w-10 h-10 text-blue-500 mb-4 opacity-50" />
              <span className="font-bold text-slate-300">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 text-center text-slate-500 text-sm">
        <p>&copy; 2025 Vell Digital. All rights reserved.</p>
        <div className="mt-4 flex justify-center gap-6">
          <a href="#" className="hover:text-white">Terms</a>
          <a href="#" className="hover:text-white">Privacy</a>
          <a href="#" className="hover:text-white">Contact</a>
        </div>
      </footer>
    </div>
  );
};

// --- WEDDING INVITATION PAGE ---
const WeddingInvitation: React.FC = () => {
  const [weddingData, setWeddingData] = useState<WeddingData | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [showPinPrompt, setShowPinPrompt] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);
  const [guestName, setGuestName] = useState('Tamu Undangan');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    const initData = async () => {
      try {
        const data = await fetchWeddingData();
        const finalData = { ...DEFAULT_WEDDING_DATA, ...data };
        setWeddingData(finalData);
        document.title = `Undangan Pernikahan ${finalData.coupleShortName}`;
      } catch (err) { setWeddingData(DEFAULT_WEDDING_DATA); }
    };
    initData();

    const params = new URLSearchParams(window.location.search);
    const to = params.get('to');
    if (to) setGuestName(to);
    if (params.get('admin') === 'true') setShowPinPrompt(true);
  }, []);

  useEffect(() => {
    if (!weddingData) return;
    document.body.style.overflow = (!isOpen && !isDashboardOpen && !showPinPrompt) ? 'hidden' : 'auto';
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

  const FloralCorner = ({ position }: { position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' }) => {
    const styles: Record<string, string> = {
      'top-left': '-top-10 -left-10',
      'top-right': '-top-10 -right-10 scale-x-[-1]',
      'bottom-left': '-bottom-10 -left-10 scale-y-[-1]',
      'bottom-right': '-bottom-10 -right-10 scale-x-[-1] scale-y-[-1]',
    };
    return (
      <div className={`absolute pointer-events-none select-none z-30 w-48 h-48 md:w-64 md:h-64 ${styles[position]}`}>
        <div className="absolute inset-0 opacity-100 drop-shadow-sm">
            <img 
              src={getDriveMediaUrl(weddingData.assets.floralCorner)} 
              alt="floral" 
              className="w-full h-full object-contain animate-floral-sway"
              style={{ transformOrigin: 'top left', animationDuration: '5s' }}
            />
        </div>
      </div>
    );
  };

  const MobileWrapper = ({ children, className = "" }: { children?: React.ReactNode, className?: string }) => (
    <div className={`max-w-[480px] w-full mx-auto bg-watercolor min-h-screen shadow-2xl relative overflow-x-hidden ${className}`}>
      {children}
    </div>
  );

  if (isDashboardOpen) return <Dashboard data={weddingData} onUpdate={setWeddingData} onClose={() => setIsDashboardOpen(false)} />;

  if (showPinPrompt) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
        <div className="bg-white rounded-3xl p-6 w-full max-w-[360px] shadow-2xl animate-fade-in-up">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Akses Dasbor</h2>
          <form onSubmit={handlePinSubmit} className="space-y-4">
            <input type="password" placeholder="Masukkan PIN" autoFocus value={pinInput} onChange={e => setPinInput(e.target.value)} className="w-full p-4 bg-slate-50 border rounded-2xl text-center text-xl tracking-widest outline-none focus:ring-2 focus:ring-blue-500" />
            <button type="submit" className="w-full bg-blue-900 text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-sm shadow-lg">Masuk Dasbor</button>
            <button onClick={() => setShowPinPrompt(false)} className="w-full text-slate-400 text-xs mt-2">Batal</button>
          </form>
        </div>
      </div>
    );
  }

  if (!isOpen) {
    return (
      <MobileWrapper className="flex flex-col relative h-screen overflow-hidden">
        <div className="absolute inset-0 z-0" style={{ backgroundImage: `url('${getDriveMediaUrl(weddingData.assets.splashBg)}')`, backgroundSize: 'cover', backgroundPosition: 'center top' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent z-0"></div>
        <FloralCorner position="top-left" />
        <FloralCorner position="top-right" />
        <div className="z-10 relative flex flex-col h-full justify-end pb-16 px-8 w-full animate-fade-in-up">
            <p className="text-slate-600 font-serif font-bold text-sm mb-2">The Wedding of</p>
            <h1 className="text-5xl font-serif text-blue-900 mb-8 leading-none">{weddingData.coupleShortName}</h1>
            <h2 className="text-slate-800 text-2xl font-serif mb-6 capitalize">{guestName}</h2>
            <button onClick={handleOpenInvitation} className="flex items-center gap-3 bg-blue-900 text-white px-6 py-3 rounded-full shadow-xl font-bold text-sm"><Mail size={16} /> Buka Undangan</button>
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
            <div className="arched-image w-64 border-[6px] border-white shadow-xl mx-auto mb-10 overflow-hidden"><img src={getDriveMediaUrl(weddingData.assets.heroImage)} className="w-full h-full object-cover" /></div>
            <h2 className="font-script text-6xl text-blue-900 mb-6">{weddingData.coupleShortName}</h2>
            <Countdown targetDate={weddingData.weddingDate} />
          </div>
        </section>

        {/* Info & Events */}
        <section className="py-20 px-6 text-center bg-white/30 backdrop-blur-sm">
            <ScrollReveal><div className="font-script text-4xl text-blue-900 mb-8">Assalamu'alaikum Wr. Wb.</div></ScrollReveal>
            <div className="flex flex-col gap-16 items-center">
                <ScrollReveal direction="left" className="w-full">
                    <div className="arched-image w-56 mx-auto mb-6 border-[5px] border-white shadow-xl"><img src={getDriveMediaUrl(weddingData.assets.bridePhoto)} className="w-full h-full object-cover" /></div>
                    <h3 className="font-script text-4xl text-blue-900 mb-2">{weddingData.brideName}</h3>
                    <p className="text-slate-500 italic text-xs">Putri dari {weddingData.brideParents}</p>
                </ScrollReveal>
                <ScrollReveal direction="right" className="w-full">
                    <div className="arched-image w-56 mx-auto mb-6 border-[5px] border-white shadow-xl"><img src={getDriveMediaUrl(weddingData.assets.groomPhoto)} className="w-full h-full object-cover" /></div>
                    <h3 className="font-script text-4xl text-blue-900 mb-2">{weddingData.groomName}</h3>
                    <p className="text-slate-500 italic text-xs">Putra dari {weddingData.groomParents}</p>
                </ScrollReveal>
            </div>
        </section>

        {/* Events Cards */}
        <section className="py-20 px-4">
            <h2 className="font-script text-5xl text-blue-900 text-center mb-12">Waktu & Tempat</h2>
            <div className="space-y-8">
                {weddingData.events.map((event, idx) => (
                    <ScrollReveal key={idx} direction="up">
                        <div className="bg-white p-8 rounded-[2rem] shadow-xl text-center">
                            <h3 className="font-serif text-2xl text-blue-900 mb-4 uppercase">{event.title}</h3>
                            <p className="text-slate-800 font-bold mb-2">{formatEventDate(event.date)}</p>
                            <p className="text-blue-900 font-medium mb-6 text-sm">Pukul {event.time}</p>
                            <MapPin className="text-red-400 w-8 h-8 mx-auto mb-4" />
                            <h4 className="font-bold text-slate-800 text-base mb-2">{event.location}</h4>
                            <p className="text-xs text-slate-500 mb-8">{event.address}</p>
                            <a href={event.mapsUrl} target="_blank" className="block w-full bg-blue-900 text-white py-3 rounded-xl font-bold uppercase text-[10px]">Navigasi Peta</a>
                        </div>
                    </ScrollReveal>
                ))}
            </div>
        </section>

        <GuestBook guestName={guestName} />

        {/* Footer */}
        <footer className="py-20 text-center">
            <p className="font-script text-5xl text-blue-900 mb-10">{weddingData.coupleShortName}</p>
            <div className="text-[10px] tracking-widest text-slate-300 font-bold">POWERED BY VELL DIGITAL</div>
        </footer>
      </div>
    </MobileWrapper>
  );
};

// --- MAIN ROUTER APP ---
const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Simplified Router
  if (currentPath === '/undangan/hani-pupud') {
    return <WeddingInvitation />;
  }

  // Default is Landing Page
  return <LandingPage />;
};

export default App;