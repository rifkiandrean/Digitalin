
import React, { useState, useEffect, useRef } from 'react';
import { Mail, Calendar, MapPin, Instagram, Video, Gift, ChevronDown, Copy, Check, ShoppingBag, UserCircle, Lock, X, Loader2, Users, CreditCard, Landmark, Wallet, Smartphone } from 'lucide-react';
import Countdown from './components/Countdown';
import FloatingMusic from './components/FloatingMusic';
import Dashboard from './components/Dashboard';
import ScrollReveal from './components/ScrollReveal';
import GuestBook from './components/GuestBook';
import LandingPage from './components/LandingPage';
import ServiceDetail from './components/ServiceDetail';
import TemplateStore from './components/TemplateStore';
import UndanganAdmin from './components/UndanganAdmin';
import Portfolio from './components/Portfolio';
import { fetchWeddingData, getDriveMediaUrl, DEFAULT_WEDDING_DATA } from './constants';
import { WeddingData } from './types';

const ADMIN_PIN = "hanipupud2026";

const GENERAL_SERVICE_PATHS = [
  "/website-perusahaan",
  "/website-pemerintahan",
  "/retail-pos",
  "/qr-menu",
  "/ulang-tahun",
  "/e-commerce",
  "/food-delivery"
];

const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
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
    const handleLocationChange = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handleLocationChange);
    
    if (window.location.pathname === '/undangan/hani-pupud') {
      document.title = "Undangan Hani & Pupud";
      fetchWeddingData().then(data => {
        setWeddingData({ ...DEFAULT_WEDDING_DATA, ...data });
      }).catch(() => setWeddingData(DEFAULT_WEDDING_DATA));

      const to = new URLSearchParams(window.location.search).get('to');
      if (to) setGuestName(to);
      if (new URLSearchParams(window.location.search).get('admin') === 'true') setShowPinPrompt(true);
    } else if (window.location.pathname === '/undangan') {
      document.title = "Katalog Undangan Digital";
    } else if (window.location.pathname === '/portfolio') {
      document.title = "Portfolio - Vell Digital";
    }

    return () => window.removeEventListener('popstate', handleLocationChange);
  }, [currentPath]);

  // Handle Body Scroll for Invitation
  useEffect(() => {
    if (currentPath === '/undangan/hani-pupud') {
      if (!isOpen && !isDashboardOpen && !showPinPrompt) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }
    }
  }, [isOpen, isDashboardOpen, showPinPrompt, currentPath]);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === ADMIN_PIN) {
      setShowPinPrompt(false);
      setIsDashboardOpen(true);
      setPinInput("");
    } else {
      setPinError(true);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Floral Components with Correct Pivot Points
  const FloralCorner = ({ position }: { position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' }) => {
    const posClasses: Record<string, string> = {
      'top-left': '-top-10 -left-10',
      'top-right': '-top-10 -right-10',
      'bottom-left': '-bottom-10 -left-10',
      'bottom-right': '-bottom-10 -right-10'
    };
    const imgClasses: Record<string, string> = {
      'top-left': 'origin-top-left',
      'top-right': 'scale-x-[-1] origin-top-right',
      'bottom-left': 'scale-y-[-1] origin-bottom-left',
      'bottom-right': 'scale-x-[-1] scale-y-[-1] origin-bottom-right'
    };
    return (
      <div className={`absolute pointer-events-none select-none z-30 w-52 h-52 md:w-64 md:h-64 ${posClasses[position]}`}>
        <div className={`absolute inset-0 opacity-20 blur-[1.5px] scale-[1.2] ${imgClasses[position]}`}>
          <img src={getDriveMediaUrl(weddingData?.assets.floralCornerBack || "")} className={`w-full h-full object-contain animate-floral-sway-gentle rotate-[10deg] ${imgClasses[position]}`} />
        </div>
        <div className={`absolute inset-0 opacity-100 drop-shadow-xl ${imgClasses[position]}`}>
          <img src={getDriveMediaUrl(weddingData?.assets.floralCorner || "")} className={`w-full h-full object-contain animate-floral-sway ${imgClasses[position]}`} />
        </div>
      </div>
    );
  };

  const FloralSide = ({ side, top }: { side: 'left' | 'right', top: string }) => (
    <div className={`absolute z-20 w-32 h-32 pointer-events-none select-none ${side === 'left' ? '-left-8' : '-right-8'}`} style={{ top }}>
      <img 
        src={getDriveMediaUrl(weddingData?.assets.floralSide || "")} 
        className={`w-full h-full object-contain opacity-70 drop-shadow-md animate-floral-sway-gentle ${side === 'left' ? 'rotate-[90deg] origin-left' : '-rotate-[90deg] scale-x-[-1] origin-right'}`} 
      />
    </div>
  );

  const BankLogo = ({ name }: { name: string }) => {
    const lower = name.toLowerCase();
    let bg = 'bg-slate-700', Icon = Landmark;
    if (lower.includes('bca')) bg = 'bg-blue-600';
    else if (lower.includes('mandiri')) bg = 'bg-blue-800';
    else if (lower.includes('bni')) bg = 'bg-orange-600';
    else if (lower.includes('bri')) bg = 'bg-blue-500';
    else if (lower.includes('gopay') || lower.includes('ovo')) { bg = 'bg-emerald-500'; Icon = Smartphone; }
    return <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center border border-white/20 shadow-inner`}><Icon size={20} className="text-white" /></div>;
  };

  // Main Router
  if (currentPath === '/undangan') return <TemplateStore />;
  if (currentPath === '/undangan/admin') return <UndanganAdmin />;
  if (currentPath === '/portfolio') return <Portfolio />;
  if (GENERAL_SERVICE_PATHS.includes(currentPath)) return <ServiceDetail path={currentPath} />;
  if (currentPath !== '/undangan/hani-pupud') return <LandingPage />;

  // Specific Invitation View
  if (!weddingData) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-blue-900 mb-4" /><p className="text-xs font-bold uppercase tracking-widest text-blue-900">Memuat Undangan...</p></div>
  );

  return (
    <div className="max-w-[480px] w-full mx-auto bg-watercolor min-h-screen shadow-2xl relative overflow-x-hidden">
      {!isOpen ? (
        <div className="relative h-screen flex flex-col justify-end pb-16 px-8 animate-fade-in-up">
          <div className="absolute inset-0 z-0" style={{ backgroundImage: `url('${getDriveMediaUrl(weddingData.assets.splashBg)}')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent z-0" />
          <FloralCorner position="top-left" />
          <FloralCorner position="top-right" />
          <div className="relative z-10">
            <p className="text-slate-600 font-serif font-bold text-sm mb-2">The Wedding of</p>
            <h1 className="text-5xl font-serif text-blue-900 mb-8 leading-none">{weddingData.coupleShortName}</h1>
            <p className="text-slate-500 text-sm font-bold mb-1">Kepada Bapak/Ibu/Saudara/i</p>
            <h2 className="text-slate-800 text-2xl font-serif mb-6 capitalize">{guestName}</h2>
            <button onClick={() => setIsOpen(true)} className="flex items-center gap-3 bg-blue-900 text-white px-6 py-3 rounded-full shadow-xl font-bold text-sm"><Mail className="w-4 h-4" /> Buka Undangan</button>
          </div>
        </div>
      ) : (
        <div className="font-sans pb-24">
          <FloatingMusic audioUrl={weddingData.audioUrl} />
          <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-12">
            <FloralCorner position="top-left" />
            <FloralCorner position="top-right" />
            <ScrollReveal>
              <p className="text-blue-900 font-serif tracking-[0.4em] mb-8 text-xs uppercase font-bold">Save Our Date</p>
              <div className="arched-image w-64 border-[6px] border-white shadow-xl mx-auto mb-10 overflow-hidden bg-white">
                <img src={getDriveMediaUrl(weddingData.assets.heroImage)} className="w-full h-full object-cover" />
              </div>
              <h2 className="font-script text-6xl text-blue-900 mb-6 leading-none">{weddingData.coupleShortName}</h2>
              <Countdown targetDate={weddingData.weddingDate} />
            </ScrollReveal>
          </section>

          <section className="py-20 px-6 text-center relative overflow-hidden">
            <FloralSide side="left" top="10%" />
            <FloralSide side="right" top="60%" />
            <ScrollReveal className="relative z-10">
              <div className="font-script text-4xl text-blue-900 mb-2">Assalamu'alaikum Wr. Wb.</div>
              <p className="text-slate-600 mb-16 leading-relaxed text-sm font-light px-4">Maha Suci Allah yang telah menciptakan mahluk-Nya berpasang-pasangan...</p>
              <div className="flex flex-col gap-12">
                <div>
                  <div className="arched-image w-52 mx-auto mb-4 border-[5px] border-white shadow-lg"><img src={getDriveMediaUrl(weddingData.assets.bridePhoto)} className="w-full h-full object-cover" /></div>
                  <h3 className="font-script text-4xl text-blue-900 mb-1">{weddingData.brideName}</h3>
                  <p className="text-slate-500 text-xs italic">Putri dari {weddingData.brideParents}</p>
                </div>
                <div>
                  <div className="arched-image w-52 mx-auto mb-4 border-[5px] border-white shadow-lg"><img src={getDriveMediaUrl(weddingData.assets.groomPhoto)} className="w-full h-full object-cover" /></div>
                  <h3 className="font-script text-4xl text-blue-900 mb-1">{weddingData.groomName}</h3>
                  <p className="text-slate-500 text-xs italic">Putra dari {weddingData.groomParents}</p>
                </div>
              </div>
            </ScrollReveal>
          </section>

          <section className="py-20 px-4 relative bg-white/30 backdrop-blur-sm">
            <FloralSide side="right" top="20%" />
            <div className="relative z-10">
              <ScrollReveal><h2 className="font-script text-5xl text-blue-900 text-center mb-12">Waktu & Tempat</h2></ScrollReveal>
              <div className="flex flex-col gap-6">
                {weddingData.events.map((ev, i) => (
                  <ScrollReveal key={i} delay={i*100} className="bg-white p-6 rounded-[2rem] shadow-xl border border-blue-50 text-center">
                    <h3 className="font-serif text-xl text-blue-900 mb-4 border-b pb-2 uppercase">{ev.title}</h3>
                    <p className="font-bold text-slate-800 mb-1">{ev.date}</p>
                    <p className="text-blue-900 text-xs mb-4">{ev.time}</p>
                    <div className="space-y-3">
                      <MapPin size={24} className="mx-auto text-red-400 animate-bounce" />
                      <p className="font-bold text-slate-800 text-sm">{ev.location}</p>
                      <p className="text-[10px] text-slate-500 px-4">{ev.address}</p>
                      <a href={ev.mapsUrl} target="_blank" className="block w-full bg-blue-900 text-white py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest">Buka Google Maps</a>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>

          <section className="py-20 px-6 bg-blue-50/50 relative">
            <FloralSide side="left" top="40%" />
            <div className="relative z-10 text-center">
              <ScrollReveal><h2 className="font-script text-5xl text-blue-900 mb-10">Wedding Gift</h2></ScrollReveal>
              <div className="flex flex-col gap-6 max-w-sm mx-auto">
                {weddingData.bankAccounts.map((bank, i) => (
                  <ScrollReveal key={i} className="bg-[#0f172a] p-6 rounded-[1.5rem] text-white shadow-2xl relative text-left overflow-hidden border border-white/5">
                    <div className="flex justify-between items-start mb-6">
                      <BankLogo name={bank.bankName} />
                      <span className="text-[10px] font-black uppercase opacity-40">{bank.bankName}</span>
                    </div>
                    <div className="font-mono text-xl mb-4 tracking-widest">{bank.accountNumber}</div>
                    <div className="text-[10px] uppercase opacity-40 font-bold mb-1">Atas Nama</div>
                    <div className="font-bold text-sm uppercase">{bank.accountHolder}</div>
                    <button onClick={() => copyToClipboard(bank.accountNumber, i)} className="absolute bottom-6 right-6 bg-white/10 p-2 rounded-full hover:bg-white/20">
                      {copiedIndex === i ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                    </button>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>

          <GuestBook guestName={guestName} bgUrl={weddingData.assets.guestbookBg} />

          <footer className="py-12 text-center bg-white relative">
            <FloralCorner position="bottom-left" />
            <FloralCorner position="bottom-right" />
            <p className="text-slate-400 text-[10px] mb-4 tracking-[0.4em] font-bold uppercase">Kami Yang Berbahagia</p>
            <p className="font-script text-5xl text-blue-900 mb-10">{weddingData.coupleShortName}</p>
            <button onClick={() => setShowPinPrompt(true)} className="p-4 text-slate-300 hover:text-blue-900 flex flex-col items-center mx-auto">
              <UserCircle size={24} className="opacity-30" /><span className="text-[8px] uppercase font-bold mt-1">Akses Admin</span>
            </button>
          </footer>
        </div>
      )}

      {showPinPrompt && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-[360px] shadow-2xl">
            <div className="flex justify-between mb-4"><Lock className="text-blue-900" /><button onClick={() => setShowPinPrompt(false)}><X /></button></div>
            <h2 className="text-2xl font-bold mb-4">Akses Dasbor</h2>
            <form onSubmit={handlePinSubmit} className="space-y-4">
              <input type="password" placeholder="PIN" value={pinInput} onChange={e => {setPinInput(e.target.value); setPinError(false);}} className={`w-full p-4 border rounded-2xl text-center text-xl tracking-widest ${pinError ? 'border-red-500' : ''}`} />
              <button type="submit" className="w-full bg-blue-900 text-white py-4 rounded-2xl font-bold">Masuk</button>
            </form>
          </div>
        </div>
      )}

      {isDashboardOpen && <Dashboard data={weddingData} onUpdate={setWeddingData} onClose={() => setIsDashboardOpen(false)} />}
    </div>
  );
};

export default App;
