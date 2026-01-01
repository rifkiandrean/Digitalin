import React, { useState, useEffect, useRef } from 'react';
import { 
  Mail, Calendar, MapPin, Instagram, Gift, ChevronDown, Copy, Check, 
  UserCircle, Lock, X, Loader2, Users, CreditCard, 
  Globe, Building2, Landmark, Heart, ShoppingCart, UtensilsCrossed, 
  Truck, ArrowRight, Star, ShieldCheck, Zap, MessageCircle, Phone
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

// --- INVITATION CATALOG PAGE ---
const InvitationCatalog: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("Spesial Foto");

  useEffect(() => {
    document.title = "Katalog Undangan Digital - Vell Digital";
  }, []);

  const categories = [
    "Spesial Foto", "Spesial Tanpa Foto",
    "Minimalist Luxury Foto", "Minimalist Luxury Tanpa Foto",
    "Premium Vintage Foto", "Premium Vintage Tanpa Foto",
    "Adat Foto", "Adat Tanpa Foto"
  ];

  const themes = [
    { id: "01", name: "SPESIAL 01", originalPrice: "210.000", discountedPrice: "132.000", img: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600" },
    { id: "02", name: "SPESIAL 02", originalPrice: "210.000", discountedPrice: "132.000", img: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=600" },
    { id: "03", name: "SPESIAL 03", originalPrice: "210.000", discountedPrice: "132.000", img: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=600" },
    { id: "04", name: "SPESIAL 04", originalPrice: "210.000", discountedPrice: "132.000", img: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=600" }
  ];

  const navigateToInvite = (path: string) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new Event('popstate'));
  };

  return (
    <div className="min-h-screen bg-[#FDF2F0] font-sans pb-20">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] bg-gradient-to-b from-[#C07E81] to-[#E8A5A9] text-white px-6 pt-6 overflow-hidden flex flex-col items-center">
        {/* Top Header */}
        <div className="w-full max-w-7xl flex justify-between items-center mb-16">
          <div className="flex flex-col items-start cursor-pointer" onClick={() => navigateToInvite('/')}>
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#C07E81] font-bold text-2xl shadow-lg">V</div>
            <span className="text-[8px] font-bold mt-1 tracking-widest uppercase">Vell Digital</span>
          </div>
          <button className="bg-[#FFE5E0] text-[#C07E81] px-6 py-2 rounded-full font-bold flex items-center gap-2 shadow-lg hover:bg-white transition-all">
            <ShoppingCart size={18} /> Pesan
          </button>
        </div>

        {/* Hero Content */}
        <div className="text-center z-10">
          <ScrollReveal direction="up">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">Undangan <span className="text-[#FFE5E0]">Digital</span></h1>
            <p className="text-lg md:text-xl opacity-90 mb-10">Berbagi momen spesial dengan <span className="font-bold">Murah !</span></p>
            <button className="bg-[#FFE5E0] text-[#8B4C50] px-8 py-4 rounded-full font-bold flex items-center gap-2 mx-auto shadow-xl hover:scale-105 transition-transform mb-16">
              <ArrowRight size={20} /> Lihat Katalog
            </button>
          </ScrollReveal>
        </div>

        {/* Device Mockups */}
        <div className="flex gap-4 md:gap-8 justify-center items-end mt-auto -mb-16">
          <div className="w-40 h-80 md:w-56 md:h-[450px] bg-white rounded-[2rem] p-3 shadow-2xl rotate-[-5deg] transform border-[6px] border-[#333]">
             <img src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover rounded-[1.5rem]" />
          </div>
          <div className="w-40 h-80 md:w-56 md:h-[450px] bg-white rounded-[2rem] p-3 shadow-2xl rotate-[5deg] transform border-[6px] border-[#333]">
             <img src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover rounded-[1.5rem]" />
          </div>
        </div>
      </section>

      {/* Theme Selection */}
      <section className="mt-32 px-6 max-w-5xl mx-auto">
        <ScrollReveal direction="up">
          <h2 className="text-3xl font-bold text-[#8B4C50] text-center mb-4">Pilihan Tema</h2>
          <p className="text-center text-slate-500 text-sm mb-10 italic">Silahkan klik tombol dibawah ini untuk melihat contoh</p>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-2 gap-3 mb-12">
          {categories.map((cat, i) => (
            <button
              key={i}
              onClick={() => setActiveCategory(cat)}
              className={`py-3 px-4 rounded-full border border-[#C07E81] text-[10px] md:text-xs font-bold transition-all ${
                activeCategory === cat ? 'bg-[#C07E81] text-white shadow-md' : 'bg-white text-[#C07E81]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="bg-[#C07E81] text-white py-3 px-6 rounded-xl font-bold text-center mb-8 shadow-md">
          {activeCategory}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-8">
          {themes.map((theme, i) => (
            <ScrollReveal key={i} delay={i * 100} direction="up">
              <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-[#F2D7D9] flex flex-col h-full group">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <div className="absolute top-0 right-0 z-20 bg-red-600 text-white text-[10px] font-bold px-8 py-1 rotate-45 translate-x-6 translate-y-2 shadow-lg">
                    DISC. 40%
                  </div>
                  <img src={theme.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-slate-700 font-bold text-sm mb-3">{theme.name}</h3>
                  <div className="mb-4">
                    <p className="text-red-400 line-through text-[10px]">Rp. {theme.originalPrice}</p>
                    <p className="text-[#8B4C50] font-bold text-lg">Rp. {theme.discountedPrice}</p>
                  </div>
                  <button 
                    onClick={() => navigateToInvite("/undangan/hani-pupud")}
                    className="w-full py-2.5 bg-[#C07E81] text-white rounded-xl font-bold text-xs uppercase shadow-md hover:bg-[#8B4C50] transition-colors mt-auto"
                  >
                    Lihat Contoh
                  </button>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <a href="https://wa.me/6281234567890" target="_blank" className="fixed bottom-6 right-6 w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all z-50 border-4 border-white">
        <Phone size={24} fill="currentColor" />
      </a>
    </div>
  );
};

// --- LANDING PAGE COMPONENT ---
const LandingPage: React.FC = () => {
  useEffect(() => {
    document.title = "Vell Digital - Solusi Transformasi Digital Terpercaya";
  }, []);

  const services = [
    { icon: Building2, title: "Website Perusahaan", desc: "Company profile profesional untuk meningkatkan kredibilitas bisnis Anda." },
    { icon: Landmark, title: "Sistem Pemerintahan", desc: "Portal informasi dan layanan publik yang transparan serta efisien.", link: "https://elearning-school-mocha.vercel.app" },
    { icon: Heart, title: "Undangan Pernikahan", desc: "Undangan digital eksklusif dengan fitur RSVP, musik, dan navigasi.", link: "/undangan" },
    { icon: ShoppingCart, title: "Sistem Ritel & POS", desc: "Kelola stok dan penjualan Anda dengan sistem inventaris modern." },
    { icon: UtensilsCrossed, title: "Menu Digital", desc: "QR Code menu untuk restoran dan kafe yang interaktif dan higienis." },
    { icon: Truck, title: "Aplikasi Pesan Antar", desc: "Solusi logistik dan delivery untuk menjangkau pelanggan lebih luas.", link: "https://www.lapeerin.vercel.app" }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans overflow-x-hidden">
      <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold tracking-tighter flex items-center gap-2 cursor-pointer" onClick={() => window.location.pathname = "/"}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">V</div>
            <span>VELL<span className="text-blue-500">DIGITAL</span></span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
            <a href="#" className="hover:text-white transition-colors">Beranda</a>
            <a href="#services" className="hover:text-white transition-colors">Layanan</a>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-bold transition-all">
            Mulai Proyek
          </button>
        </div>
      </nav>

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
              <button className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all" onClick={() => {
                const el = document.getElementById('services');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}>
                Lihat Karya Kami
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>

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
                    <a 
                      href={s.link} 
                      target={s.link.startsWith('http') ? "_blank" : "_self"}
                      rel={s.link.startsWith('http') ? "noopener noreferrer" : ""}
                      onClick={(e) => {
                        if (!s.link.startsWith('http')) {
                          e.preventDefault();
                          window.history.pushState({}, '', s.link);
                          window.dispatchEvent(new Event('popstate'));
                        }
                      }}
                      className="flex items-center gap-2 text-blue-500 font-bold text-sm hover:underline cursor-pointer"
                    >
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

      <footer className="py-12 border-t border-white/5 text-center text-slate-500 text-sm">
        <p>&copy; 2025 Vell Digital. All rights reserved.</p>
      </footer>
    </div>
  );
};

// --- WEDDING INVITATION PAGE ---
const WeddingInvitation: React.FC = () => {
  const [weddingData, setWeddingData] = useState<WeddingData | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [guestName, setGuestName] = useState('Tamu Undangan');

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
  }, []);

  if (!weddingData) return <div className="h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-blue-900" /></div>;

  const FloralCorner = ({ position }: { position: string }) => {
    const styles: any = {
      'top-left': '-top-10 -left-10',
      'top-right': '-top-10 -right-10 scale-x-[-1]',
      'bottom-left': '-bottom-10 -left-10 scale-y-[-1]',
      'bottom-right': '-bottom-10 -right-10 scale-x-[-1] scale-y-[-1]',
    };
    return (
      <div className={`absolute z-30 w-48 h-48 ${styles[position]}`}>
        <img src={getDriveMediaUrl(weddingData.assets.floralCorner)} className="w-full h-full object-contain animate-floral-sway" />
      </div>
    );
  };

  if (isDashboardOpen) return <Dashboard data={weddingData} onUpdate={setWeddingData} onClose={() => setIsDashboardOpen(false)} />;

  if (!isOpen) {
    return (
      <div className="max-w-[480px] w-full mx-auto h-screen bg-watercolor relative overflow-hidden flex flex-col justify-end pb-16 px-8">
        <div className="absolute inset-0 z-0" style={{ backgroundImage: `url('${getDriveMediaUrl(weddingData.assets.splashBg)}')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent"></div>
        <FloralCorner position="top-left" />
        <FloralCorner position="top-right" />
        <div className="z-10 animate-fade-in-up">
            <p className="text-slate-600 font-serif font-bold text-sm mb-2">The Wedding of</p>
            <h1 className="text-5xl font-serif text-blue-900 mb-8">{weddingData.coupleShortName}</h1>
            <h2 className="text-slate-800 text-2xl font-serif mb-6 capitalize">{guestName}</h2>
            <button onClick={() => setIsOpen(true)} className="flex items-center gap-3 bg-blue-900 text-white px-6 py-3 rounded-full shadow-xl font-bold text-sm"><Mail size={16} /> Buka Undangan</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[480px] w-full mx-auto bg-watercolor min-h-screen shadow-2xl pb-24 font-sans">
      <FloatingMusic audioUrl={weddingData.audioUrl} />
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6">
        <FloralCorner position="top-left" />
        <FloralCorner position="top-right" />
        <div className="animate-fade-in-up">
          <p className="text-blue-900 font-serif tracking-widest mb-8 text-xs uppercase font-bold">Save Our Date</p>
          <div className="arched-image w-64 border-[6px] border-white shadow-xl mx-auto mb-10 overflow-hidden"><img src={getDriveMediaUrl(weddingData.assets.heroImage)} className="w-full h-full object-cover" /></div>
          <h2 className="font-script text-6xl text-blue-900 mb-6">{weddingData.coupleShortName}</h2>
          <Countdown targetDate={weddingData.weddingDate} />
        </div>
      </section>
      <GuestBook guestName={guestName} />
      <footer className="py-20 text-center">
          <p className="font-script text-5xl text-blue-900 mb-10">{weddingData.coupleShortName}</p>
          <div className="text-[10px] tracking-widest text-slate-300 font-bold">POWERED BY VELL DIGITAL</div>
      </footer>
    </div>
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

  if (currentPath === '/undangan') {
    return <InvitationCatalog />;
  }
  if (currentPath === '/undangan/hani-pupud') {
    return <WeddingInvitation />;
  }

  return <LandingPage />;
};

export default App;