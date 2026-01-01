import React, { useState, useEffect } from 'react';
import { 
  Mail, MapPin, Loader2, Heart, ShoppingCart, 
  UtensilsCrossed, Truck, ArrowRight, ShieldCheck, Zap, 
  Landmark, Building2, Trash2, X, Plus, Minus, Send, Check,
  Instagram, Clock, LayoutDashboard, Briefcase, Globe, BarChart3,
  Lock, User, LogOut, Search, Settings, RefreshCw, MessageSquare,
  Edit3, Eye, Copy, Link as LinkIcon,
  // Fix: Added missing Save icon import
  Save
} from 'lucide-react';
import Countdown from './components/Countdown';
import FloatingMusic from './components/FloatingMusic';
import Dashboard from './components/Dashboard';
import ScrollReveal from './components/ScrollReveal';
import GuestBook from './components/GuestBook';
import { fetchWeddingData, getDriveMediaUrl, DEFAULT_WEDDING_DATA, fetchGuestMessages, saveWeddingDataToCloud } from './constants';
import { WeddingData, GuestMessage, InvitationTheme } from './types';

// --- HELPERS ---
const navigateTo = (path: string) => {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new Event('popstate'));
  window.scrollTo(0, 0);
};

// --- ADMIN PAGE COMPONENT ---
const AdminPage: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'catalog' | 'messages' | 'settings'>('overview');
  const [fullData, setFullData] = useState<WeddingData>(DEFAULT_WEDDING_DATA);
  const [guestMessages, setGuestMessages] = useState<GuestMessage[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    document.title = "Admin Panel - Punakawan Digital";
    const auth = sessionStorage.getItem('vell_admin_auth');
    if (auth === 'true') setIsLoggedIn(true);
    
    const loadAll = async () => {
      const data = await fetchWeddingData();
      setFullData(data);
      const msgs = await fetchGuestMessages();
      setGuestMessages(msgs);
    };
    loadAll();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      if (email === "rifkiandrean@gmail.com" && password === "sawaludin22") {
        setIsLoggedIn(true);
        sessionStorage.setItem('vell_admin_auth', 'true');
      } else { alert("Login Gagal!"); }
      setIsLoading(false);
    }, 800);
  };

  const handleSaveCatalog = async () => {
    setIsSaving(true);
    try {
      await saveWeddingDataToCloud(fullData);
      alert("Katalog Berhasil Diperbarui!");
    } catch (e) { alert("Gagal menyimpan!"); }
    finally { setIsSaving(false); }
  };

  const updateCatalogConfig = (field: string, value: any) => {
    setFullData(prev => ({
      ...prev,
      catalogConfig: {
        ...prev.catalogConfig!,
        [field]: value
      }
    }));
  };

  const addTheme = () => {
    const newTheme: InvitationTheme = {
      id: Date.now().toString(),
      name: "Tema Baru",
      category: fullData.catalogConfig?.categories[0] || "General",
      originalPrice: 200000,
      price: 150000,
      desc: "Deskripsi tema baru",
      img: "",
      previewUrl: "/undangan/hani-pupud"
    };
    updateCatalogConfig('themes', [...(fullData.catalogConfig?.themes || []), newTheme]);
  };

  const removeTheme = (id: string) => {
    updateCatalogConfig('themes', fullData.catalogConfig?.themes.filter(t => t.id !== id));
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-10">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-blue-500/20">
              <ShieldCheck size={40} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Punakawan <span className="text-blue-600">Admin</span></h1>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none font-bold" required />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none font-bold" required />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl flex items-center justify-center gap-3">
              {isLoading ? <Loader2 className="animate-spin" /> : <Zap size={20} />} Masuk Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans">
      <aside className="hidden lg:flex w-80 bg-[#0f172a] text-white flex-col sticky top-0 h-screen shadow-2xl z-50">
        <div className="p-10">
          <div className="flex items-center gap-4 mb-16">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center font-black text-2xl">P</div>
            <span className="font-black text-xl">PUNAKAWAN</span>
          </div>
          <nav className="space-y-4">
            {[
              { id: 'overview', label: 'Overview', icon: LayoutDashboard },
              { id: 'catalog', label: 'Edit Katalog', icon: Briefcase },
              { id: 'messages', label: 'Buku Tamu', icon: MessageSquare },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map((item) => (
              <button key={item.id} onClick={() => setActiveTab(item.id as any)} className={`w-full flex items-center gap-4 px-6 py-5 rounded-2xl text-sm font-bold transition-all ${activeTab === item.id ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-400 hover:text-white'}`}>
                <item.icon size={20} /> {item.label}
              </button>
            ))}
          </nav>
        </div>
        <button onClick={() => { sessionStorage.removeItem('vell_admin_auth'); setIsLoggedIn(false); }} className="mt-auto p-10 flex items-center gap-4 text-red-400 font-bold"><LogOut size={20} /> Logout</button>
      </aside>

      <main className="flex-1 p-8 md:p-14 lg:p-20 overflow-y-auto">
        <header className="flex justify-between items-center mb-16">
          <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight">{activeTab}</h2>
          {activeTab === 'catalog' && (
            <button onClick={handleSaveCatalog} disabled={isSaving} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl flex items-center gap-2">
              {/* Fix: Save is now correctly imported */}
              {isSaving ? <Loader2 className="animate-spin" /> : <Save size={20} />} Simpan Katalog
            </button>
          )}
        </header>

        {activeTab === 'catalog' && (
          <div className="space-y-12 animate-fade-in-up">
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
              <h3 className="text-xl font-black border-b pb-4">Hero Section Katalog</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Judul Utama</label>
                  <input value={fullData.catalogConfig?.heroTitle} onChange={e => updateCatalogConfig('heroTitle', e.target.value)} className="w-full p-4 bg-slate-50 border rounded-2xl font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Sub-judul</label>
                  <input value={fullData.catalogConfig?.heroSubtitle} onChange={e => updateCatalogConfig('heroSubtitle', e.target.value)} className="w-full p-4 bg-slate-50 border rounded-2xl font-bold" />
                </div>
              </div>
            </div>

            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
              <div className="flex justify-between items-center border-b pb-4">
                <h3 className="text-xl font-black">Daftar Tema Undangan</h3>
                <button onClick={addTheme} className="bg-emerald-50 text-emerald-600 p-3 rounded-xl border border-emerald-100"><Plus /></button>
              </div>
              <div className="grid lg:grid-cols-2 gap-8">
                {fullData.catalogConfig?.themes.map((theme, idx) => (
                  <div key={theme.id} className="p-6 border rounded-[2rem] bg-slate-50 relative group">
                    <button onClick={() => removeTheme(theme.id)} className="absolute top-4 right-4 text-red-400"><Trash2 size={20} /></button>
                    <div className="grid grid-cols-3 gap-6">
                      <div className="space-y-4">
                         <div className="aspect-[3/4] bg-white rounded-2xl overflow-hidden border">
                           {theme.img ? <img src={getDriveMediaUrl(theme.img)} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-200"><Briefcase /></div>}
                         </div>
                         <input placeholder="Link Gambar" value={theme.img} onChange={e => {
                           const themes = [...fullData.catalogConfig!.themes];
                           themes[idx].img = e.target.value;
                           updateCatalogConfig('themes', themes);
                         }} className="w-full p-2 text-[10px] border rounded-lg bg-white" />
                      </div>
                      <div className="col-span-2 space-y-4">
                        <input placeholder="Nama Tema" value={theme.name} onChange={e => {
                           const themes = [...fullData.catalogConfig!.themes];
                           themes[idx].name = e.target.value;
                           updateCatalogConfig('themes', themes);
                         }} className="w-full p-3 border rounded-xl font-bold" />
                        <div className="grid grid-cols-2 gap-3">
                           <input type="number" placeholder="Harga" value={theme.price} onChange={e => {
                             const themes = [...fullData.catalogConfig!.themes];
                             themes[idx].price = Number(e.target.value);
                             updateCatalogConfig('themes', themes);
                           }} className="w-full p-3 border rounded-xl" />
                           <input type="number" placeholder="Asli" value={theme.originalPrice} onChange={e => {
                             const themes = [...fullData.catalogConfig!.themes];
                             themes[idx].originalPrice = Number(e.target.value);
                             updateCatalogConfig('themes', themes);
                           }} className="w-full p-3 border rounded-xl" />
                        </div>
                        <select value={theme.category} onChange={e => {
                           const themes = [...fullData.catalogConfig!.themes];
                           themes[idx].category = e.target.value;
                           updateCatalogConfig('themes', themes);
                         }} className="w-full p-3 border rounded-xl">
                          {fullData.catalogConfig?.categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <input placeholder="Link Preview" value={theme.previewUrl} onChange={e => {
                           const themes = [...fullData.catalogConfig!.themes];
                           themes[idx].previewUrl = e.target.value;
                           updateCatalogConfig('themes', themes);
                         }} className="w-full p-3 border rounded-xl" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// --- INVITATION CATALOG PAGE (DYNAMIC) ---
const InvitationCatalog: React.FC = () => {
  const [data, setData] = useState<WeddingData | null>(null);
  const [activeCategory, setActiveCategory] = useState("");
  const [cart, setCart] = useState<{item: InvitationTheme, qty: number}[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      const d = await fetchWeddingData();
      setData(d);
      if (d.catalogConfig?.categories.length) {
        setActiveCategory(d.catalogConfig.categories[0]);
      }
    };
    load();
    const saved = localStorage.getItem('vell_cart');
    if (saved) setCart(JSON.parse(saved));
  }, []);

  useEffect(() => { localStorage.setItem('vell_cart', JSON.stringify(cart)); }, [cart]);

  if (!data) return <div className="h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-blue-900" /></div>;

  const config = data.catalogConfig!;
  const addToCart = (theme: InvitationTheme) => {
    const existing = cart.find(c => c.item.id === theme.id);
    if (existing) setCart(cart.map(c => c.item.id === theme.id ? { ...c, qty: c.qty + 1 } : c));
    else setCart([...cart, { item: theme, qty: 1 }]);
    setIsCartOpen(true);
  };

  const totalPrice = cart.reduce((acc, curr) => acc + (curr.item.price * curr.qty), 0);

  return (
    <div className="min-h-screen bg-[#FDF2F0] font-sans relative overflow-x-hidden">
      <section className="relative min-h-[85vh] bg-gradient-to-b from-[#C07E81] to-[#E8A5A9] text-white px-6 pt-6 flex flex-col items-center">
        <div className="w-full max-w-7xl flex justify-between items-center mb-16 relative z-20">
          <div className="flex flex-col items-start cursor-pointer" onClick={() => navigateTo('/')}>
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#C07E81] font-bold text-2xl shadow-lg">P</div>
            <span className="text-[8px] font-bold mt-1 uppercase tracking-widest">Punakawan Digital</span>
          </div>
          <button onClick={() => setIsCartOpen(true)} className="bg-[#FFE5E0] text-[#C07E81] px-6 py-2 rounded-full font-bold flex items-center gap-2 relative">
            <ShoppingCart size={18} /> Pesan {cart.length > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">{cart.length}</span>}
          </button>
        </div>

        <div className="text-center z-10">
          <ScrollReveal direction="up">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">{config.heroTitle}</h1>
            <p className="text-lg md:text-xl opacity-90 mb-10">{config.heroSubtitle}</p>
          </ScrollReveal>
        </div>

        <div className="flex gap-4 md:gap-8 justify-center items-end mt-auto -mb-16">
          {config.heroImages.map((img, i) => (
            <div key={i} className={`w-40 h-80 md:w-56 md:h-[450px] bg-white rounded-[2rem] p-3 shadow-2xl border-[6px] border-[#333] transform ${i === 0 ? 'rotate-[-5deg]' : 'rotate-[5deg]'}`}>
              <img src={getDriveMediaUrl(img)} className="w-full h-full object-cover rounded-[1.5rem]" alt="Preview" />
            </div>
          ))}
        </div>
      </section>

      <section id="catalog-themes" className="mt-32 px-6 max-w-5xl mx-auto">
        <div className="flex flex-wrap gap-3 mb-12 justify-center">
          {config.categories.map((cat, i) => (
            <button key={i} onClick={() => setActiveCategory(cat)} className={`py-3 px-6 rounded-full border border-[#C07E81] text-xs font-bold transition-all ${activeCategory === cat ? 'bg-[#C07E81] text-white' : 'bg-white text-[#C07E81]'}`}>
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          {config.themes.filter(t => t.category === activeCategory).map((theme, i) => (
            <ScrollReveal key={theme.id} delay={i * 100} direction="up">
              <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-lg border border-[#F2D7D9] flex flex-col h-full group">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <div className="absolute top-0 right-0 z-20 bg-red-600 text-white text-[10px] font-bold px-8 py-1 rotate-45 translate-x-6 translate-y-2">DISC. {Math.round((1 - theme.price/theme.originalPrice) * 100)}%</div>
                  <img src={getDriveMediaUrl(theme.img)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={theme.name} />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button onClick={() => navigateTo(theme.previewUrl)} className="bg-white text-[#8B4C50] p-3 rounded-full"><Eye size={20} /></button>
                    <button onClick={() => addToCart(theme)} className="bg-[#C07E81] text-white p-3 rounded-full"><ShoppingCart size={20} /></button>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow text-center">
                  <h3 className="text-[#8B4C50] font-bold text-lg mb-2">{theme.name}</h3>
                  <div className="mb-6">
                    <p className="text-red-400 line-through text-xs">Rp {theme.originalPrice.toLocaleString('id-ID')}</p>
                    <p className="text-[#8B4C50] font-bold text-2xl">Rp {theme.price.toLocaleString('id-ID')}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-auto">
                    <button onClick={() => navigateTo(theme.previewUrl)} className="py-3 border border-[#C07E81] text-[#C07E81] rounded-2xl font-bold text-xs">Contoh</button>
                    <button onClick={() => addToCart(theme)} className="py-3 bg-[#C07E81] text-white rounded-2xl font-bold text-xs">Pesan</button>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </div>
  );
};

// --- LANDING PAGE COMPONENT ---
// Fix: Added missing LandingPage component
const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center font-sans">
      <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Punakawan <span className="text-blue-600">Digital</span></h1>
      <p className="text-xl text-slate-600 mb-10 max-w-md font-medium">Platform Undangan Digital Modern dengan Fitur Terlengkap dan Termurah.</p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button 
          onClick={() => navigateTo('/undangan')}
          className="bg-blue-600 text-white px-10 py-5 rounded-[2rem] font-black text-lg shadow-xl shadow-blue-200 flex items-center justify-center gap-3 transform hover:scale-105 transition-all"
        >
          Lihat Katalog <ArrowRight size={22} />
        </button>
        <button 
          onClick={() => navigateTo('/admin')}
          className="bg-white text-slate-900 border-2 border-slate-100 px-10 py-5 rounded-[2rem] font-black text-lg shadow-sm hover:bg-slate-50 transition-all"
        >
          Admin Login
        </button>
      </div>
    </div>
  );
};

// --- WEDDING INVITATION PAGE COMPONENT ---
// Fix: Added missing WeddingInvitation component
const WeddingInvitation: React.FC = () => {
  const [data, setData] = useState<WeddingData | null>(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const [to, setTo] = useState("Tamu Undangan");

  useEffect(() => {
    const load = async () => {
      const d = await fetchWeddingData();
      setData(d);
    };
    load();
    const params = new URLSearchParams(window.location.search);
    const guestName = params.get('to');
    if (guestName) setTo(guestName);
  }, []);

  if (!data) return <div className="h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-blue-900" /></div>;

  return (
    <div className="min-h-screen bg-white relative font-sans">
      {/* Hero Section */}
      <section className="h-screen relative flex items-center justify-center text-white overflow-hidden">
        <img src={getDriveMediaUrl(data.assets.heroImage)} className="absolute inset-0 w-full h-full object-cover" alt="Hero" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center px-6">
          <ScrollReveal direction="up">
            <p className="text-sm uppercase tracking-[0.4em] font-bold mb-6 opacity-80">The Wedding of</p>
            <h1 className="text-6xl md:text-8xl font-black mb-10 tracking-tighter drop-shadow-2xl">{data.coupleShortName}</h1>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-[3rem] inline-block max-w-sm w-full shadow-2xl">
               <p className="text-xs uppercase tracking-widest font-bold mb-4 opacity-70">Kepada Yth. Bapak/Ibu/Saudara/i</p>
               <h2 className="text-3xl font-black mb-2 capitalize">{to}</h2>
               <p className="text-[10px] opacity-60">Tanpa Mengurangi Rasa Hormat, Kami Mengundang Anda Untuk Hadir Di Acara Pernikahan Kami.</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Mempelai Section */}
      <section className="py-24 px-6 max-w-4xl mx-auto text-center">
        <ScrollReveal direction="up">
          <Heart className="w-10 h-10 text-red-500 mx-auto mb-8 animate-pulse" />
          <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Kedua Mempelai</h2>
          <p className="text-slate-500 max-w-lg mx-auto mb-16 font-medium">Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan. Ya Allah, perkenankanlah kami merangkai kasih sayang yang Kau ciptakan dalam ikatan pernikahan.</p>
          
          <div className="grid md:grid-cols-2 gap-16 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-7xl font-black text-slate-100 hidden md:block">&</div>
            <div className="space-y-6">
              <div className="w-64 h-64 mx-auto rounded-full overflow-hidden border-8 border-slate-50 shadow-2xl">
                <img src={getDriveMediaUrl(data.assets.groomPhoto)} className="w-full h-full object-cover" alt="Groom" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">{data.groomName}</h3>
                <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mb-4">Putra Dari:</p>
                <p className="text-slate-600 font-medium">{data.groomParents}</p>
                {data.groomInstagram && (
                  <a href={data.groomInstagram} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 mt-4 text-blue-600 font-bold hover:underline">
                    <Instagram size={18} /> @{data.groomName.split(' ')[0].toLowerCase()}
                  </a>
                )}
              </div>
            </div>
            <div className="space-y-6">
              <div className="w-64 h-64 mx-auto rounded-full overflow-hidden border-8 border-slate-50 shadow-2xl">
                <img src={getDriveMediaUrl(data.assets.bridePhoto)} className="w-full h-full object-cover" alt="Bride" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">{data.brideName}</h3>
                <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mb-4">Putri Dari:</p>
                <p className="text-slate-600 font-medium">{data.brideParents}</p>
                {data.brideInstagram && (
                  <a href={data.brideInstagram} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 mt-4 text-blue-600 font-bold hover:underline">
                    <Instagram size={18} /> @{data.brideName.split(' ')[0].toLowerCase()}
                  </a>
                )}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Acara Section */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="grid grid-cols-6 h-full border-l border-white/20">
            {Array.from({length: 6}).map((_, i) => <div key={i} className="border-r border-white/20" />)}
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <ScrollReveal direction="up">
            <h2 className="text-4xl font-black mb-4 tracking-tight">Hari Bahagia</h2>
            <p className="opacity-60 mb-16 max-w-md mx-auto">Kami mengundang Anda untuk merayakan momen bersejarah dalam hidup kami.</p>
            
            <Countdown targetDate={data.weddingDate} />

            <div className="grid md:grid-cols-2 gap-8 mt-20">
              {data.events.map((event, i) => (
                <div key={i} className="p-10 bg-white/5 backdrop-blur-sm border border-white/10 rounded-[3rem] text-left hover:bg-white/10 transition-all group">
                  <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                    <Calendar className="text-white" size={28} />
                  </div>
                  <h3 className="text-3xl font-black mb-4">{event.title}</h3>
                  <div className="space-y-3 opacity-80 mb-10">
                    <div className="flex items-center gap-3 font-bold"><Clock size={18} className="text-blue-500" /> {event.time}</div>
                    <div className="flex items-center gap-3 font-bold"><Calendar size={18} className="text-blue-500" /> {event.date}</div>
                    <div className="flex items-start gap-3 font-bold"><MapPin size={18} className="text-blue-500 shrink-0 mt-1" /> {event.address}</div>
                  </div>
                  <a href={event.mapsUrl} target="_blank" rel="noreferrer" className="w-full bg-white text-slate-900 py-5 rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl">
                    <MapPin size={20} /> Lihat Lokasi
                  </a>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Guest Book */}
      <GuestBook guestName={to} />

      {/* Gift Section */}
      <section className="py-24 bg-white px-6">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal direction="up">
            <Gift className="w-12 h-12 text-blue-600 mx-auto mb-6" />
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Kirim Kado Digital</h2>
            <p className="text-slate-500 max-w-md mx-auto mb-16 font-medium">Doa restu Anda merupakan hadiah terindah bagi kami. Namun jika ingin memberi kado, silakan melalui rekening di bawah ini.</p>
            
            <div className="grid sm:grid-cols-2 gap-6">
              {data.bankAccounts.map((bank, i) => (
                <div key={i} className="p-10 bg-slate-50 border border-slate-100 rounded-[3rem] text-center group hover:bg-blue-600 hover:text-white transition-all">
                  <p className="text-xs font-black uppercase tracking-[0.2em] mb-4 opacity-50 group-hover:opacity-100">{bank.bankName}</p>
                  <h4 className="text-2xl font-black mb-4 tracking-tight">{bank.accountNumber}</h4>
                  <p className="text-sm font-bold opacity-70 group-hover:opacity-100 mb-8">a.n {bank.accountHolder}</p>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(bank.accountNumber);
                      alert('Nomor rekening disalin!');
                    }}
                    className="bg-white text-slate-900 px-8 py-3 rounded-xl font-black text-xs shadow-md"
                  >
                    Salin Rekening
                  </button>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <FloatingMusic audioUrl={data.audioUrl} />
      
      {/* Admin Quick Settings Access */}
      <button 
        onClick={() => setShowDashboard(true)}
        className="fixed top-6 left-6 z-50 p-4 bg-white/80 backdrop-blur-xl rounded-[1.5rem] shadow-2xl border border-white/50 hover:scale-110 transition-all text-slate-900"
      >
        <Settings size={22} />
      </button>

      {showDashboard && (
        <Dashboard 
          data={data} 
          onUpdate={(newData) => setData(newData)} 
          onClose={() => setShowDashboard(false)} 
        />
      )}
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

  if (currentPath === '/admin') return <AdminPage />;
  if (currentPath === '/undangan') return <InvitationCatalog />;
  if (currentPath === '/undangan/hani-pupud') return <WeddingInvitation />;
  return <LandingPage />;
};

export default App;