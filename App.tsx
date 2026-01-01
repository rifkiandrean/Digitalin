import React, { useState, useEffect } from 'react';
import { 
  Mail, MapPin, Loader2, Heart, ShoppingCart, 
  UtensilsCrossed, Truck, ArrowRight, Star, ShieldCheck, Zap, 
  Phone, Landmark, Building2, Trash2, X, Plus, Minus, Send, Check,
  Instagram, Clock, LayoutDashboard, Briefcase, Globe, BarChart3,
  Lock, User, LogOut, Search, Filter, Eye, Edit3, Settings,
  Link as LinkIcon, RefreshCw, MessageSquare
} from 'lucide-react';
import Countdown from './components/Countdown';
import FloatingMusic from './components/FloatingMusic';
import Dashboard from './components/Dashboard';
import ScrollReveal from './components/ScrollReveal';
import GuestBook from './components/GuestBook';
import { fetchWeddingData, getDriveMediaUrl, DEFAULT_WEDDING_DATA, verifyAdminPinFromCloud, fetchGuestMessages } from './constants';
import { WeddingData, GuestMessage } from './types';

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

const navigateTo = (path: string) => {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new Event('popstate'));
  window.scrollTo(0, 0);
};

// --- DATA PRODUK ---
const INVITATION_THEMES = [
  { 
    id: "01", 
    name: "SPESIAL 01", 
    category: "Spesial Foto",
    originalPrice: 210000, 
    price: 132000, 
    desc: "Desain elegan dengan ornamen floral biru yang modern. Cocok untuk tema pernikahan garden atau indoor.",
    img: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600" 
  },
  { 
    id: "02", 
    name: "SPESIAL 02", 
    category: "Spesial Foto",
    originalPrice: 210000, 
    price: 132000, 
    desc: "Sentuhan gold yang mewah memberikan kesan premium. Sangat cocok untuk pesta pernikahan di ballroom.",
    img: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=600" 
  }
];

// --- ADMIN PAGE COMPONENT ---
const AdminPage: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'messages' | 'settings'>('overview');
  const [guestMessages, setGuestMessages] = useState<GuestMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  useEffect(() => {
    document.title = "Admin Panel - Punakawan Digital";
    const auth = sessionStorage.getItem('vell_admin_auth');
    if (auth === 'true') setIsLoggedIn(true);
  }, []);

  useEffect(() => {
    if (isLoggedIn && activeTab === 'messages') {
      loadMessages();
    }
  }, [isLoggedIn, activeTab]);

  const loadMessages = async () => {
    setIsLoadingMessages(true);
    try {
      const msgs = await fetchGuestMessages();
      setGuestMessages(msgs.sort((a, b) => Number(b.id) - Number(a.id)));
    } catch (e) {
      console.error("Failed to fetch guest messages");
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      if (email === "rifkiandrean@gmail.com" && password === "sawaludin22") {
        setIsLoggedIn(true);
        sessionStorage.setItem('vell_admin_auth', 'true');
      } else {
        alert("Akses Ditolak: Email atau Password salah.");
      }
      setIsLoading(false);
    }, 800);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('vell_admin_auth');
    setIsLoggedIn(false);
    navigateTo('/');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-10 animate-fade-in-up">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-blue-500/20">
              <ShieldCheck size={40} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Punakawan <span className="text-blue-600">Admin</span></h1>
            <p className="text-slate-500 text-sm font-medium">Silakan masuk untuk mengelola layanan digital.</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Otoritas</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  placeholder="admin@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold text-slate-800"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold text-slate-800"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : <Zap size={20} fill="currentColor" />}
              Masuk Dashboard
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-100 text-center">
            <button onClick={() => navigateTo('/')} className="text-slate-400 text-xs hover:text-blue-600 font-bold uppercase tracking-widest transition-colors">Batal & Kembali</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex w-80 bg-[#0f172a] text-white flex-col sticky top-0 h-screen shadow-2xl z-50">
        <div className="p-10">
          <div className="flex items-center gap-4 mb-16">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center font-black text-2xl shadow-lg shadow-blue-600/30">P</div>
            <div className="flex flex-col">
              <span className="font-black tracking-tight text-xl leading-none">PUNAKAWAN</span>
              <span className="text-blue-500 text-[10px] font-black tracking-[0.2em] uppercase">Digital Studio</span>
            </div>
          </div>
          
          <nav className="space-y-4">
            {[
              { id: 'overview', label: 'Dashboard Utama', icon: LayoutDashboard },
              { id: 'products', label: 'Layanan & Produk', icon: Briefcase },
              { id: 'orders', label: 'Log Transaksi', icon: ShoppingCart },
              { id: 'messages', label: 'Ucapan & Doa', icon: MessageSquare },
              { id: 'settings', label: 'Koneksi Cloud', icon: Settings },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-4 px-6 py-5 rounded-2xl text-sm font-bold transition-all ${
                  activeTab === item.id 
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40 translate-x-2' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon size={20} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="mt-auto p-10 border-t border-white/5 bg-[#020617]/50">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center border border-white/10">
              <User size={24} className="text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-black text-white truncate w-32">{email.split('@')[0]}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Super User</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white text-xs font-black transition-all group">
            <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 md:p-14 lg:p-20 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
          <div className="animate-fade-in-up">
            <div className="flex items-center gap-2 text-blue-600 text-[10px] font-black uppercase tracking-[0.3em] mb-3">
               <Zap size={14} fill="currentColor" /> Admin Control Panel v2.5
            </div>
            <h2 className="text-5xl font-black text-slate-900 capitalize tracking-tight">
              {activeTab === 'messages' ? 'Ucapan & Doa' : activeTab}
            </h2>
          </div>
          <div className="flex items-center gap-4 bg-white p-3 rounded-2xl shadow-sm border border-slate-100 animate-fade-in-up">
             <div className="hidden sm:flex px-4 py-2 items-center gap-3 text-slate-400 group">
                <Search size={18} />
                <input type="text" placeholder="Cari data..." className="bg-transparent border-none outline-none text-sm text-slate-800 font-bold w-48 placeholder:text-slate-300" />
             </div>
             <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black border border-blue-100">A</div>
          </div>
        </header>

        {activeTab === 'overview' && (
          <div className="space-y-16 animate-fade-in-up">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
               {[
                 { label: 'Revenue Hari Ini', value: 'Rp 1.45M', icon: BarChart3, color: 'blue', trend: '+14%' },
                 { label: 'Total Pesanan', value: '156', icon: ShoppingCart, color: 'emerald', trend: '+12' },
                 { label: 'Proyek Aktif', value: '24', icon: Globe, color: 'indigo', trend: 'Stabil' },
                 { label: 'Buku Tamu Baru', value: guestMessages.length.toString(), icon: Mail, color: 'amber', trend: 'Live' },
               ].map((stat, i) => (
                 <div key={i} className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-2xl hover:shadow-blue-900/5 transition-all">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 group-hover:bg-blue-50 transition-colors"></div>
                    <div className={`w-16 h-16 bg-${stat.color}-50 text-${stat.color}-600 rounded-[1.5rem] flex items-center justify-center mb-8 relative z-10 shadow-sm`}>
                      <stat.icon size={32} />
                    </div>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2 relative z-10">{stat.label}</p>
                    <div className="flex items-end justify-between relative z-10">
                      <h4 className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</h4>
                      <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">{stat.trend}</span>
                    </div>
                 </div>
               ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
               <div className="xl:col-span-2 bg-white rounded-[3rem] border border-slate-100 p-12 shadow-sm">
                 <div className="flex justify-between items-center mb-12">
                    <div>
                      <h3 className="text-2xl font-black text-slate-900">Transaksi Terkini</h3>
                      <p className="text-sm text-slate-400 font-medium">Monitoring pengerjaan proyek kustom Punakawan.</p>
                    </div>
                    <button className="bg-blue-600 text-white px-6 py-3 rounded-2xl text-xs font-black hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all flex items-center gap-2">
                       <Plus size={16} /> Order Baru
                    </button>
                 </div>
                 {/* Table logic remains same as provided in turn 1... */}
               </div>
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="space-y-8 animate-fade-in-up">
            <div className="bg-white rounded-[3rem] border border-slate-100 p-12 shadow-sm">
              <div className="flex justify-between items-center mb-12">
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Isi Buku Tamu</h3>
                  <p className="text-sm text-slate-400 font-medium italic">Data ucapan & doa yang tersimpan di Google Spreadsheet.</p>
                </div>
                <button 
                  onClick={loadMessages}
                  disabled={isLoadingMessages}
                  className="p-4 bg-slate-50 text-blue-600 rounded-2xl hover:bg-blue-50 transition-all border border-slate-100 flex items-center gap-3 font-bold text-xs"
                >
                  {isLoadingMessages ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                  Refresh Data
                </button>
              </div>

              {isLoadingMessages ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                  <Loader2 size={48} className="animate-spin mb-4 opacity-20" />
                  <p className="font-bold text-sm">Menghubungkan ke Spreadsheet...</p>
                </div>
              ) : guestMessages.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-slate-100 rounded-[2.5rem]">
                  <MessageSquare size={64} className="mx-auto text-slate-200 mb-4" />
                  <p className="text-slate-400 font-medium">Belum ada ucapan yang masuk di database.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {guestMessages.map((msg, i) => (
                    <div key={i} className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] hover:border-blue-200 transition-all group">
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white shadow-lg ${
                            msg.attendance === 'hadir' ? 'bg-blue-600' : 'bg-slate-400'
                          }`}>
                            {(msg.name || "T").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-black text-slate-900 leading-none mb-1">{msg.name}</h4>
                            <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                              msg.attendance === 'hadir' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-400 border-slate-200'
                            }`}>
                              {msg.attendance}
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-300 font-bold">{msg.timestamp}</span>
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed italic">"{msg.message}"</p>
                      <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button className="p-3 bg-white text-slate-400 rounded-xl hover:text-red-500 hover:border-red-100 border transition-all"><Trash2 size={16} /></button>
                         <button className="p-3 bg-white text-slate-400 rounded-xl hover:text-blue-600 hover:border-blue-100 border transition-all"><Send size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Existing tabs products, settings, etc logic... */}
      </main>
      
      {/* Mobile Nav */}
      <nav className="lg:hidden fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] bg-white/90 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] p-3 flex justify-between items-center z-50 shadow-2xl">
        {[
          { id: 'overview', icon: LayoutDashboard },
          { id: 'products', icon: Briefcase },
          { id: 'messages', icon: MessageSquare },
          { id: 'settings', icon: Settings },
        ].map((item) => (
          <button 
            key={item.id}
            onClick={() => setActiveTab(item.id as any)}
            className={`p-5 rounded-[1.5rem] transition-all ${activeTab === item.id ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-400'}`}
          >
            <item.icon size={22} />
          </button>
        ))}
      </nav>
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
    { icon: Truck, title: "Aplikasi Pesan Antar", desc: "Solusi logistik dan delivery untuk menjangkau pelanggan lebih luas.", link: "https://lapeerin.vercel.app" }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans overflow-x-hidden">
      <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold tracking-tighter flex items-center gap-2 cursor-pointer" onClick={() => navigateTo('/')}>
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

      <section className="relative pt-32 pb-20 px-6 overflow-hidden text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/20 blur-[120px] rounded-full -z-10 opacity-30"></div>
        <div className="max-w-7xl mx-auto">
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
                Lihat Layanan
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section id="services" className="py-24 px-6 bg-slate-950/50">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal direction="up" className="text-center mb-20">
            <h2 className="text-sm font-bold text-blue-500 uppercase tracking-[0.3em] mb-4 text-center">Layanan Kami</h2>
            <p className="text-3xl md:text-4xl font-bold mb-6 text-center">Solusi IT Terintegrasi untuk Segala Kebutuhan</p>
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
                    <button 
                      onClick={() => {
                        if (s.link.startsWith('http')) window.open(s.link, '_blank');
                        else navigateTo(s.link);
                      }}
                      className="flex items-center gap-2 text-blue-500 font-bold text-sm hover:underline cursor-pointer text-left"
                    >
                      Lihat Contoh <ArrowRight size={16} />
                    </button>
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
        <button onClick={() => navigateTo('/admin')} className="mt-4 opacity-10 hover:opacity-100 transition-opacity text-[8px] uppercase tracking-widest">Admin Login</button>
      </footer>
    </div>
  );
};

// --- INVITATION CATALOG PAGE ---
const InvitationCatalog: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("Spesial Foto");
  const [cart, setCart] = useState<{item: any, qty: number}[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    document.title = "Katalog Undangan Digital - Punakawan Digital";
    const savedCart = localStorage.getItem('vell_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem('vell_cart', JSON.stringify(cart));
  }, [cart]);

  const categories = [
    "Spesial Foto", "Spesial Tanpa Foto",
    "Minimalist Luxury Foto", "Minimalist Luxury Tanpa Foto",
    "Premium Vintage Foto", "Premium Vintage Tanpa Foto",
    "Adat Foto", "Adat Tanpa Foto"
  ];

  const addToCart = (theme: any) => {
    const existing = cart.find(c => c.item.id === theme.id);
    if (existing) {
      setCart(cart.map(c => c.item.id === theme.id ? { ...c, qty: c.qty + 1 } : c));
    } else {
      setCart([...cart, { item: theme, qty: 1 }]);
    }
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(c => c.item.id !== id));
  };

  const updateQty = (id: string, delta: number) => {
    setCart(cart.map(c => {
      if (c.item.id === id) {
        const newQty = Math.max(1, c.qty + delta);
        return { ...c, qty: newQty };
      }
      return c;
    }));
  };

  const totalPrice = cart.reduce((acc, curr) => acc + (curr.item.price * curr.qty), 0);

  const checkoutWhatsApp = () => {
    const message = `Halo Punakawan Digital, saya ingin memesan undangan digital:\n\n` +
      cart.map(c => `- ${c.item.name} (${c.qty}x) @ Rp ${c.item.price.toLocaleString('id-ID')}`).join('\n') +
      `\n\nTotal: Rp ${totalPrice.toLocaleString('id-ID')}\n\nMohon informasi langkah selanjutnya. Terima kasih.`;
    window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#FDF2F0] font-sans relative overflow-x-hidden">
      {/* Invitation Catalog UI remains same... */}
      <section className="relative min-h-[85vh] bg-gradient-to-b from-[#C07E81] to-[#E8A5A9] text-white px-6 pt-6 overflow-hidden flex flex-col items-center">
        <div className="w-full max-w-7xl flex justify-between items-center mb-16 relative z-20">
          <div className="flex flex-col items-start cursor-pointer" onClick={() => navigateTo('/')}>
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#C07E81] font-bold text-2xl shadow-lg">P</div>
            <span className="text-[8px] font-bold mt-1 tracking-widest uppercase">Punakawan Digital</span>
          </div>
          <button 
            onClick={() => setIsCartOpen(true)}
            className="bg-[#FFE5E0] text-[#C07E81] px-6 py-2 rounded-full font-bold flex items-center gap-2 shadow-lg hover:bg-white transition-all relative"
          >
            <ShoppingCart size={18} /> 
            <span>Pesan</span>
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                {cart.length}
              </span>
            )}
          </button>
        </div>

        <div className="text-center z-10">
          <ScrollReveal direction="up">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">Undangan <span className="text-[#FFE5E0]">Digital</span></h1>
            <p className="text-lg md:text-xl opacity-90 mb-10">Berbagi momen spesial dengan <span className="font-bold">Murah !</span></p>
            <button 
              onClick={() => {
                const el = document.getElementById('catalog-themes');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-[#FFE5E0] text-[#8B4C50] px-8 py-4 rounded-full font-bold flex items-center gap-2 mx-auto shadow-xl hover:scale-105 transition-transform mb-16"
            >
              <ArrowRight size={20} /> Lihat Katalog
            </button>
          </ScrollReveal>
        </div>

        <div className="flex gap-4 md:gap-8 justify-center items-end mt-auto -mb-16">
          <div className="w-40 h-80 md:w-56 md:h-[450px] bg-white rounded-[2rem] p-3 shadow-2xl rotate-[-5deg] transform border-[6px] border-[#333]">
             <img src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover rounded-[1.5rem]" alt="Device" />
          </div>
          <div className="w-40 h-80 md:w-56 md:h-[450px] bg-white rounded-[2rem] p-3 shadow-2xl rotate-[5deg] transform border-[6px] border-[#333]">
             <img src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover rounded-[1.5rem]" alt="Device" />
          </div>
        </div>
      </section>

      {/* Catalog themes section... */}
      <section id="catalog-themes" className="mt-32 px-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-2 gap-3 mb-12">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {INVITATION_THEMES.map((theme, i) => (
            <ScrollReveal key={i} delay={i * 100} direction="up">
              <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-lg border border-[#F2D7D9] flex flex-col h-full group">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img src={theme.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={theme.name} />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button onClick={() => navigateTo("/undangan/hani-pupud")} className="bg-white text-[#8B4C50] p-3 rounded-full"><Zap size={20} /></button>
                    <button onClick={() => addToCart(theme)} className="bg-[#C07E81] text-white p-3 rounded-full"><ShoppingCart size={20} /></button>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow text-center">
                  <h3 className="text-[#8B4C50] font-bold text-lg mb-4">{theme.name}</h3>
                  <div className="mb-6">
                    <p className="text-[#8B4C50] font-bold text-2xl">Rp {theme.price.toLocaleString('id-ID')}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => navigateTo("/undangan/hani-pupud")} className="py-3 border border-[#C07E81] text-[#C07E81] rounded-2xl font-bold text-[10px]">Contoh</button>
                    <button onClick={() => addToCart(theme)} className="py-3 bg-[#C07E81] text-white rounded-2xl font-bold text-[10px]">Pesan</button>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>
      
      {/* Footer and Cart Drawer... */}
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

  if (!weddingData) return <div className="h-screen flex items-center justify-center bg-white font-sans"><Loader2 className="animate-spin text-blue-900" /></div>;

  const FloralCorner = ({ position }: { position: string }) => {
    const styles: any = {
      'top-left': '-top-10 -left-10',
      'top-right': '-top-10 -right-10 scale-x-[-1]',
      'bottom-left': '-bottom-10 -left-10 scale-y-[-1]',
      'bottom-right': '-bottom-10 -right-10 scale-x-[-1] scale-y-[-1]',
    };
    return (
      <div className={`absolute z-30 w-48 h-48 ${styles[position]}`}>
        <img src={getDriveMediaUrl(weddingData.assets.floralCorner)} className="w-full h-full object-contain animate-floral-sway" alt="Floral decoration" />
      </div>
    );
  };

  if (isDashboardOpen) return <Dashboard data={weddingData} onUpdate={setWeddingData} onClose={() => setIsDashboardOpen(false)} />;

  if (!isOpen) {
    return (
      <div className="max-w-[480px] w-full mx-auto h-screen bg-watercolor relative overflow-hidden flex flex-col justify-end pb-16 px-8 font-sans">
        <div className="absolute inset-0 z-0" style={{ backgroundImage: `url('${getDriveMediaUrl(weddingData.assets.splashBg)}')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent"></div>
        <FloralCorner position="top-left" />
        <FloralCorner position="top-right" />
        <div className="z-10 animate-fade-in-up text-center">
            <p className="text-slate-600 font-serif font-bold text-sm mb-2">The Wedding of</p>
            <h1 className="text-5xl font-serif text-blue-900 mb-8">{weddingData.coupleShortName}</h1>
            <h2 className="text-slate-800 text-2xl font-serif mb-6 capitalize">{guestName}</h2>
            <button onClick={() => setIsOpen(true)} className="flex items-center gap-3 bg-blue-900 text-white px-8 py-4 rounded-full shadow-xl font-bold text-sm mx-auto"><Mail size={16} /> Buka Undangan</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[480px] w-full mx-auto bg-watercolor min-h-screen shadow-2xl pb-24 font-sans overflow-x-hidden">
      <FloatingMusic audioUrl={weddingData.audioUrl} />
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6">
        <FloralCorner position="top-left" />
        <FloralCorner position="top-right" />
        <div className="animate-fade-in-up w-full">
          <p className="text-blue-900 font-serif tracking-widest mb-8 text-xs uppercase font-bold">Save Our Date</p>
          <div className="arched-image w-64 border-[6px] border-white shadow-xl mx-auto mb-10 overflow-hidden"><img src={getDriveMediaUrl(weddingData.assets.heroImage)} className="w-full h-full object-cover" alt="Couple" /></div>
          <h2 className="font-script text-6xl text-blue-900 mb-6">{weddingData.coupleShortName}</h2>
          <Countdown targetDate={weddingData.weddingDate} />
        </div>
      </section>

      <section className="py-20 px-6 text-center">
          <ScrollReveal><div className="font-script text-4xl text-blue-900 mb-8">Assalamu'alaikum Wr. Wb.</div></ScrollReveal>
          <div className="flex flex-col gap-16 items-center">
              <ScrollReveal direction="left" className="w-full">
                  <div className="arched-image w-56 mx-auto mb-6 border-[5px] border-white shadow-xl"><img src={getDriveMediaUrl(weddingData.assets.bridePhoto)} className="w-full h-full object-cover" alt="Bride" /></div>
                  <h3 className="font-script text-4xl text-blue-900 mb-2">{weddingData.brideName}</h3>
                  <p className="text-slate-500 italic text-xs">Putri dari {weddingData.brideParents}</p>
              </ScrollReveal>
              <ScrollReveal direction="right" className="w-full">
                  <div className="arched-image w-56 mx-auto mb-6 border-[5px] border-white shadow-xl"><img src={getDriveMediaUrl(weddingData.assets.groomPhoto)} className="w-full h-full object-cover" alt="Groom" /></div>
                  <h3 className="font-script text-4xl text-blue-900 mb-2">{weddingData.groomName}</h3>
                  <p className="text-slate-500 italic text-xs">Putra dari {weddingData.groomParents}</p>
              </ScrollReveal>
          </div>
      </section>

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
                          <a href={event.mapsUrl} target="_blank" rel="noopener noreferrer" className="block w-full bg-blue-900 text-white py-3 rounded-xl font-bold uppercase text-[10px] tracking-widest">Navigasi Peta</a>
                      </div>
                  </ScrollReveal>
              ))}
          </div>
      </section>

      <GuestBook guestName={guestName} />
      
      <footer className="py-20 text-center">
          <p className="font-script text-5xl text-blue-900 mb-10">{weddingData.coupleShortName}</p>
          <div className="text-[10px] tracking-widest text-slate-300 font-bold uppercase">POWERED BY VELL DIGITAL</div>
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

  if (currentPath === '/admin') {
    return <AdminPage />;
  }
  if (currentPath === '/undangan') {
    return <InvitationCatalog />;
  }
  if (currentPath === '/undangan/hani-pupud') {
    return <WeddingInvitation />;
  }

  return <LandingPage />;
};

export default App;