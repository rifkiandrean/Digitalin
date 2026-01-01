import React, { useState, useEffect } from 'react';
import { 
  Mail, MapPin, Loader2, Heart, ShoppingCart, 
  UtensilsCrossed, Truck, ArrowRight, Star, ShieldCheck, Zap, 
  Phone, Landmark, Building2, Trash2, X, Plus, Minus, Send, Check,
  Instagram, Clock, LayoutDashboard, Briefcase, Globe, BarChart3,
  Lock, User, LogOut, Search, Filter, Eye, Edit3, Settings,
  Link as LinkIcon, RefreshCw, MoreVertical, CreditCard, ChevronRight
} from 'lucide-react';
import Countdown from './components/Countdown';
import FloatingMusic from './components/FloatingMusic';
import Dashboard from './components/Dashboard';
import ScrollReveal from './components/ScrollReveal';
import GuestBook from './components/GuestBook';
import { fetchWeddingData, getDriveMediaUrl, DEFAULT_WEDDING_DATA, verifyAdminPinFromCloud } from './constants';
import { WeddingData } from './types';

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
  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'settings'>('overview');
  const [productCategory, setProductCategory] = useState('Semua');

  useEffect(() => {
    document.title = "Admin Panel - Punakawan Digital";
    const auth = sessionStorage.getItem('vell_admin_auth');
    if (auth === 'true') setIsLoggedIn(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Memanggil fungsi verify dari constants.ts yang terhubung ke spreadsheet
      const isValid = await verifyAdminPinFromCloud(pin);
      if (isValid) {
        setIsLoggedIn(true);
        sessionStorage.setItem('vell_admin_auth', 'true');
      } else {
        alert("Akses Ditolak: PIN Salah atau tidak terdaftar di database spreadsheet.");
      }
    } catch (err) {
      alert("Terjadi kesalahan koneksi ke database spreadsheet. Pastikan URL API sudah benar.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('vell_admin_auth');
    setIsLoggedIn(false);
    navigateTo('/');
  };

  const serviceItems = [
    { title: 'Premium Wedding Invitation', price: '132.000', sales: 124, icon: Heart, color: 'rose', category: 'Undangan', desc: 'Sistem manajemen undangan digital dengan RSVP cloud.' },
    { title: 'Portal E-Gov & Layanan Publik', price: '15.000.000', sales: 4, icon: Landmark, color: 'blue', category: 'Pemerintah', desc: 'Dashboard transparansi dan layanan administrasi terintegrasi.' },
    { title: 'Exclusive Company Profile', price: '2.500.000', sales: 18, icon: Building2, color: 'indigo', category: 'Perusahaan', desc: 'Branding bisnis profesional dengan optimasi SEO.' },
    { title: 'Food Delivery Platform', price: '7.500.000', sales: 7, icon: Truck, color: 'amber', category: 'Pesan Antar', desc: 'Aplikasi kurir dan pemesanan makanan kustom.' },
    { title: 'Digital QR Menu', price: '850.000', sales: 32, icon: UtensilsCrossed, color: 'emerald', category: 'Pesan Antar', desc: 'Menu interaktif nirsentuh untuk resto dan kafe.' },
    { title: 'Sistem Inventory & POS', price: '5.000.000', sales: 12, icon: ShoppingCart, color: 'violet', category: 'Perusahaan', desc: 'Pengelolaan stok dan kasir online real-time.' },
  ];

  const filteredServices = productCategory === 'Semua' 
    ? serviceItems 
    : serviceItems.filter(s => s.category === productCategory);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-10 text-center animate-fade-in-up">
          <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-8 shadow-xl shadow-blue-500/20">
            <Lock size={40} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Punakawan <span className="text-blue-600">Admin</span></h1>
          <p className="text-slate-500 text-sm mb-10 font-medium">Hubungkan ke database spreadsheet dengan memasukkan PIN Otoritas Anda.</p>
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="relative">
              <input 
                type="password" 
                placeholder="••••••" 
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-center text-3xl tracking-[0.6em] focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold text-slate-800"
                autoFocus
              />
            </div>
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : <ShieldCheck />}
              Autentikasi Sekarang
            </button>
          </form>
          <div className="mt-10 pt-8 border-t border-slate-100">
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
              { id: 'settings', label: 'Koneksi Cloud', icon: RefreshCw },
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
              <p className="text-sm font-black">Main Admin</p>
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
            <h2 className="text-5xl font-black text-slate-900 capitalize tracking-tight">{activeTab}</h2>
          </div>
          <div className="flex items-center gap-4 bg-white p-3 rounded-2xl shadow-sm border border-slate-100 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
             <div className="hidden sm:flex px-4 py-2 items-center gap-3 text-slate-400 group">
                <Search size={18} className="group-focus-within:text-blue-600 transition-colors" />
                <input type="text" placeholder="Cari data klien..." className="bg-transparent border-none outline-none text-sm text-slate-800 font-bold w-48 placeholder:text-slate-300" />
             </div>
             <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black border border-blue-100">A</div>
          </div>
        </header>

        {activeTab === 'overview' && (
          <div className="space-y-16 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
               {[
                 { label: 'Revenue Hari Ini', value: 'Rp 1.45M', icon: BarChart3, color: 'blue', trend: '+14%', desc: '6 Transaksi baru' },
                 { label: 'Total Pesanan', value: '156', icon: ShoppingCart, color: 'emerald', trend: '+12', desc: 'Bulan ini' },
                 { label: 'Proyek Aktif', value: '24', icon: Globe, color: 'indigo', trend: 'Stabil', desc: 'Sesuai timeline' },
                 { label: 'Buku Tamu Baru', value: '89', icon: Mail, color: 'amber', trend: '+45', desc: 'Last 24h' },
               ].map((stat, i) => (
                 <div key={i} className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-2xl hover:shadow-blue-900/5 transition-all cursor-default">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 group-hover:bg-blue-50 transition-colors duration-500"></div>
                    <div className={`w-16 h-16 bg-${stat.color}-50 text-${stat.color}-600 rounded-[1.5rem] flex items-center justify-center mb-8 relative z-10 shadow-sm`}>
                      <stat.icon size={32} />
                    </div>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2 relative z-10">{stat.label}</p>
                    <div className="flex items-end justify-between relative z-10 mb-4">
                      <h4 className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</h4>
                      <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">{stat.trend}</span>
                    </div>
                    <p className="text-slate-400 text-xs font-medium relative z-10">{stat.desc}</p>
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
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-slate-300 text-[10px] uppercase font-black border-b border-slate-50 tracking-[0.2em]">
                          <th className="pb-8 font-black">Klien & Service</th>
                          <th className="pb-8 font-black">Timeline</th>
                          <th className="pb-8 font-black">Billing</th>
                          <th className="pb-8 font-black">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        {[
                          { id: '#PK-105', name: 'Rizky & Amanda', service: 'Wedding Invitation', status: 'Selesai', color: 'emerald', date: '12 Okt 2025' },
                          { id: '#PK-104', name: 'Kec. Mantrijeron', service: 'E-Gov Portal', status: 'Produksi', color: 'blue', date: 'Estimasi 2mgg' },
                          { id: '#PK-103', name: 'Kedai Kopi 48', service: 'QR Digital Menu', status: 'Pending', color: 'amber', date: 'Menunggu Payment' },
                        ].map((row, i) => (
                          <tr key={i} className="border-b border-slate-50 last:border-none group hover:bg-slate-50/50 transition-colors">
                            <td className="py-7">
                               <p className="font-black text-slate-800 text-base">{row.name}</p>
                               <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase mt-1">
                                 <span className="text-blue-500">{row.id}</span>
                                 <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                 <span>{row.service}</span>
                               </div>
                            </td>
                            <td className="py-7">
                              <div className="flex flex-col">
                                <span className="text-slate-600 font-bold text-xs">{row.date}</span>
                                <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                                  <div className={`h-full bg-${row.color}-500 w-3/4`}></div>
                                </div>
                              </div>
                            </td>
                            <td className="py-7">
                              <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase bg-${row.color}-50 text-${row.color}-600 border border-${row.color}-100 shadow-sm`}>{row.status}</span>
                            </td>
                            <td className="py-7">
                               <div className="flex gap-3">
                                 <button className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center border border-slate-100"><Eye size={18} /></button>
                                 <button className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl hover:text-emerald-600 hover:bg-emerald-50 transition-all flex items-center justify-center border border-slate-100"><Edit3 size={18} /></button>
                               </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                 </div>
               </div>

               <div className="bg-white rounded-[3rem] border border-slate-100 p-12 shadow-sm flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-blue-50/30 blur-[60px] rounded-full -mr-24 -mt-24"></div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2 relative z-10">Distribusi Produk</h3>
                  <p className="text-sm text-slate-400 mb-12 font-medium relative z-10">Berdasarkan revenue per kategori.</p>
                  
                  <div className="space-y-10 flex-grow relative z-10">
                    {[
                      { label: 'Undangan Digital', percentage: 65, color: 'rose', icon: Heart },
                      { label: 'Web Perusahaan', percentage: 20, color: 'blue', icon: Building2 },
                      { label: 'Sistem Pemerintah', percentage: 10, color: 'indigo', icon: Landmark },
                      { label: 'Pesan Antar', percentage: 5, color: 'amber', icon: Truck },
                    ].map((p, i) => (
                      <div key={i} className="space-y-4">
                        <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 bg-${p.color}-50 text-${p.color}-600 rounded-lg flex items-center justify-center border border-${p.color}-100`}>
                              <p.icon size={16} />
                            </div>
                            <span className="text-slate-700">{p.label}</span>
                          </div>
                          <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">{p.percentage}%</span>
                        </div>
                        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-1">
                          <div className={`h-full bg-${p.color}-500 rounded-full transition-all duration-1000`} style={{ width: `${p.percentage}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-16 p-8 bg-slate-900 text-white rounded-[2.5rem] shadow-2xl relative z-10">
                     <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-2">Target Monthly Revenue</p>
                     <div className="flex items-center justify-between">
                        <p className="text-2xl font-black tracking-tight">Rp 250.000.000</p>
                        <Zap size={20} className="text-amber-400 fill-amber-400" />
                     </div>
                     <div className="w-full h-1.5 bg-white/10 rounded-full mt-6 overflow-hidden">
                       <div className="h-full bg-blue-500 w-[72%]"></div>
                     </div>
                     <p className="text-[9px] text-white/40 mt-3 font-bold">Progress: 72% dari target pengerjaan proyek.</p>
                  </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="bg-white rounded-[4rem] border border-slate-100 p-12 md:p-20 animate-fade-in-up shadow-sm">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-16">
              <div className="flex flex-wrap gap-4 w-full lg:w-auto overflow-x-auto pb-4 custom-scrollbar">
                {['Semua', 'Undangan', 'Pemerintah', 'Perusahaan', 'Pesan Antar'].map((cat, i) => (
                  <button 
                    key={i} 
                    onClick={() => setProductCategory(cat)}
                    className={`px-8 py-4 rounded-[1.5rem] text-xs font-black whitespace-nowrap transition-all border-2 ${
                      productCategory === cat 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xl shadow-blue-200 -translate-y-1' 
                        : 'bg-white text-slate-400 border-slate-100 hover:border-blue-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <button className="w-full lg:w-auto px-10 py-5 bg-blue-600 text-white rounded-[1.5rem] font-black text-sm flex items-center justify-center gap-3 hover:bg-blue-700 shadow-2xl shadow-blue-200 transition-all active:scale-95 group">
                <Plus size={20} className="group-hover:rotate-90 transition-transform" /> Tambah Layanan Baru
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
              {filteredServices.map((prod, i) => (
                <div key={i} className="p-10 border-2 border-slate-50 rounded-[3rem] hover:border-blue-500 transition-all group bg-white hover:shadow-2xl hover:shadow-blue-900/5 cursor-pointer flex flex-col animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className={`w-20 h-20 bg-${prod.color}-50 text-${prod.color}-600 rounded-[2rem] flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500 shadow-sm border border-${prod.color}-100`}>
                    <prod.icon size={36} />
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-[8px] font-black uppercase tracking-widest bg-${prod.color}-50 text-${prod.color}-600 px-3 py-1 rounded-full`}>{prod.category}</span>
                    </div>
                    <h4 className="font-black text-slate-900 text-2xl mb-4 leading-tight">{prod.title}</h4>
                    <p className="text-slate-400 text-sm leading-relaxed mb-8 font-medium">{prod.desc}</p>
                  </div>
                  <div className="pt-10 border-t border-slate-50">
                    <div className="flex justify-between items-end mb-8">
                      <div>
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Price Point</p>
                        <p className="text-blue-600 font-black text-2xl">Rp {prod.price}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Total Sales</p>
                        <p className="text-slate-900 font-black text-lg">{prod.sales}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <button className="py-4 bg-slate-50 text-slate-600 rounded-2xl font-black text-xs hover:bg-blue-50 hover:text-blue-600 transition-all flex items-center justify-center gap-2 border border-slate-100"><Edit3 size={16} /> Edit Data</button>
                       <button className="py-4 bg-slate-50 text-slate-400 rounded-2xl font-black text-xs hover:bg-red-50 hover:text-red-500 transition-all flex items-center justify-center gap-2 border border-slate-100"><Trash2 size={16} /> Hapus</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-4xl animate-fade-in-up space-y-12">
             <div className="bg-white rounded-[4rem] border border-slate-100 p-16 shadow-sm">
               <div className="flex items-center gap-4 mb-12">
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                    <RefreshCw size={28} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-slate-900">Konfigurasi Cloud</h3>
                    <p className="text-sm text-slate-400 font-medium">Sinkronisasi database spreadsheet Punakawan Digital.</p>
                  </div>
               </div>

               <div className="space-y-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3 ml-2">
                      <LinkIcon size={14} /> Google Apps Script Web App Endpoint
                    </label>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <input 
                        type="text" 
                        placeholder="https://script.google.com/macros/s/..." 
                        className="flex-1 p-6 bg-slate-50 border-2 border-slate-100 rounded-3xl text-sm font-mono focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                      />
                      <button className="px-10 py-6 bg-blue-600 text-white rounded-3xl font-black text-sm shadow-2xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95">Update Endpoint</button>
                    </div>
                  </div>
                  
                  <div className="p-10 bg-slate-50 rounded-[3rem] border-2 border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-emerald-600 font-black text-xs uppercase tracking-widest">
                        <Check size={18} /> Database Online
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed font-medium">Sheet Utama: <strong className="text-slate-900">Punakawan_Central_DB</strong></p>
                      <p className="text-xs text-slate-400">Menyimpan data client, order, dan setting undangan digital.</p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-blue-600 font-black text-xs uppercase tracking-widest">
                        <Zap size={18} fill="currentColor" /> Real-time Sync
                      </div>
                      <p className="text-sm text-slate-600 font-medium">Update Terakhir: <strong className="text-slate-900">4 menit yang lalu</strong></p>
                      <p className="text-xs text-slate-400">Seluruh data terenkripsi end-to-end via HTTPS.</p>
                    </div>
                  </div>

                  <div className="pt-10 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                        <ShieldCheck size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900">Admin PIN Access</p>
                        <p className="text-xs text-slate-400 font-medium">Ganti PIN otoritas masuk sistem.</p>
                      </div>
                    </div>
                    <button className="px-8 py-4 bg-white border-2 border-slate-100 rounded-2xl font-black text-xs text-slate-600 hover:border-blue-600 hover:text-blue-600 transition-all">Ganti PIN Sekarang</button>
                  </div>
               </div>
             </div>
             
             <div className="bg-slate-900 rounded-[4rem] p-16 shadow-2xl flex flex-col md:flex-row items-center gap-10">
                <div className="w-20 h-20 bg-white/10 rounded-[2rem] flex items-center justify-center text-blue-400">
                  <RefreshCw size={36} />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-black text-white mb-3">Backup Data Central</h3>
                  <p className="text-white/40 text-sm font-medium mb-0">Unduh seluruh salinan database Punakawan Studio dalam format JSON atau CSV untuk arsip manual.</p>
                </div>
                <button className="flex items-center gap-4 px-10 py-6 bg-white text-slate-900 rounded-[1.5rem] font-black text-sm hover:bg-blue-400 hover:text-white transition-all shadow-xl shadow-white/5 active:scale-95">
                  Download All Archives
                </button>
             </div>
          </div>
        )}
      </main>
      
      {/* Mobile Footer Navigation - Centered Pill */}
      <nav className="lg:hidden fixed bottom-8 left-1/2 -translate-x-1/2 w-[85%] bg-white/90 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] p-3 flex justify-between items-center z-50 shadow-[0_25px_50px_-12px_rgba(59,130,246,0.3)]">
        {[
          { id: 'overview', icon: LayoutDashboard },
          { id: 'products', icon: Briefcase },
          { id: 'orders', icon: ShoppingCart },
          { id: 'settings', icon: Settings },
        ].map((item) => (
          <button 
            key={item.id}
            onClick={() => setActiveTab(item.id as any)}
            className={`p-5 rounded-[1.5rem] transition-all relative ${activeTab === item.id ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/40' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <item.icon size={22} />
            {activeTab === item.id && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>}
          </button>
        ))}
      </nav>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
            height: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f5f9;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 10px;
        }
      `}</style>
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
      {/* Hero Section */}
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

      {/* Theme Selection */}
      <section id="catalog-themes" className="mt-32 px-6 max-w-5xl mx-auto">
        <ScrollReveal direction="up">
          <h2 className="text-3xl font-bold text-[#8B4C50] text-center mb-4">Pilihan Tema</h2>
          <p className="text-center text-slate-500 text-sm mb-10 italic">Silahkan klik tombol dibawah ini untuk melihat contoh</p>
        </ScrollReveal>

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

        <div className="bg-[#C07E81] text-white py-3 px-6 rounded-xl font-bold text-center mb-8 shadow-md">
          {activeCategory}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {INVITATION_THEMES.map((theme, i) => (
            <ScrollReveal key={i} delay={i * 100} direction="up">
              <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-lg border border-[#F2D7D9] flex flex-col h-full group">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <div className="absolute top-0 right-0 z-20 bg-red-600 text-white text-[10px] font-bold px-8 py-1 rotate-45 translate-x-6 translate-y-2 shadow-lg">
                    DISC. 40%
                  </div>
                  <img src={theme.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={theme.name} />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button 
                      onClick={() => navigateTo("/undangan/hani-pupud")}
                      className="bg-white text-[#8B4C50] p-3 rounded-full hover:bg-[#FFE5E0] transition-colors"
                      title="Preview"
                    >
                      <Zap size={20} />
                    </button>
                    <button 
                      onClick={() => addToCart(theme)}
                      className="bg-[#C07E81] text-white p-3 rounded-full hover:bg-[#8B4C50] transition-colors"
                      title="Tambah ke Keranjang"
                    >
                      <ShoppingCart size={20} />
                    </button>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow text-center">
                  <h3 className="text-[#8B4C50] font-bold text-lg mb-4">{theme.name}</h3>
                  <div className="mb-6">
                    <p className="text-red-400 line-through text-xs">Rp {theme.originalPrice.toLocaleString('id-ID')}</p>
                    <p className="text-[#8B4C50] font-bold text-2xl">Rp {theme.price.toLocaleString('id-ID')}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => navigateTo("/undangan/hani-pupud")}
                      className="py-3 border border-[#C07E81] text-[#C07E81] rounded-2xl font-bold text-[10px] uppercase hover:bg-[#FFE5E0] transition-all"
                    >
                      Contoh
                    </button>
                    <button 
                      onClick={() => addToCart(theme)}
                      className="py-3 bg-[#C07E81] text-white rounded-2xl font-bold text-[10px] uppercase shadow-md hover:bg-[#8B4C50] transition-all"
                    >
                      Pesan
                    </button>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* --- CONTACT FOOTER SECTION --- */}
      <section className="mt-24 pb-12 bg-gradient-to-t from-[#C07E81] to-[#E8A5A9] text-white px-6">
        <div className="max-w-4xl mx-auto pt-16">
          <ScrollReveal direction="up" className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-8">Hubungi Kami</h2>
            
            {/* Map Card */}
            <div className="bg-white p-4 rounded-[2.5rem] shadow-2xl overflow-hidden mb-12 group transition-transform hover:scale-[1.02]">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.825121406691!2d110.35415307584557!3d-7.808331977524584!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a5796f7c35583%3A0x673c683883a62883!2sUndangan%20Punakawan%20Digital!5e0!3m2!1sid!2sid!4v1711234567890!5m2!1sid!2sid" 
                className="w-full h-[300px] md:h-[400px] rounded-[2rem] border-none" 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-left px-4">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                   <div className="bg-white/20 p-2 rounded-lg"><MapPin size={24} /></div>
                   <div>
                     <h3 className="font-bold text-lg mb-1">Alamat :</h3>
                     <p className="text-sm opacity-90 leading-relaxed">
                       Jl. Sugeng Jeroni No.48A, Gedongkiwo, Kec. Mantrijeron, Kota Yogyakarta, Daerah Istimewa Yogyakarta 55142
                     </p>
                   </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                   <div className="bg-white/20 p-2 rounded-lg"><Clock size={24} /></div>
                   <div>
                     <h3 className="font-bold text-lg mb-1">Jam Buka :</h3>
                     <div className="text-sm opacity-90 space-y-1">
                       <p>Senin – Jum’at : 08.00 – 21.00 WIB</p>
                       <p>Sabtu : 09.00 – 20.00 WIB</p>
                       <p>Minggu / Hari Libur : Slow Respon</p>
                     </div>
                   </div>
                </div>
              </div>
            </div>

            {/* Social Media & Copyright */}
            <div className="mt-16 flex flex-col items-center border-t border-white/20 pt-10">
              <div className="flex flex-wrap justify-center gap-8 mb-8">
                <a href="https://instagram.com/punakawandigital" target="_blank" className="flex items-center gap-2 hover:scale-110 transition-transform">
                   <Instagram size={20} />
                   <span className="text-sm font-bold">Punakawan Digital</span>
                </a>
                <a href="https://tiktok.com/@punakawandigital" target="_blank" className="flex items-center gap-2 hover:scale-110 transition-transform">
                   <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                     <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/>
                   </svg>
                   <span className="text-sm font-bold">Punakawan Digital</span>
                </a>
              </div>
              <p className="text-[10px] opacity-60 font-bold uppercase tracking-widest">Copyright ©2024 Punakawan Digital</p>
              <button onClick={() => navigateTo('/admin')} className="mt-8 text-white/20 text-[8px] hover:text-white transition-colors">Admin Login</button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-fade-in-left">
            <div className="p-6 border-b flex justify-between items-center bg-[#C07E81] text-white">
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-6 h-6" />
                <h2 className="text-xl font-bold">Pesanan Anda</h2>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                  <ShoppingCart size={64} strokeWidth={1} className="mb-4 opacity-20" />
                  <p className="text-sm font-medium">Keranjang masih kosong</p>
                  <button onClick={() => setIsCartOpen(false)} className="mt-4 text-[#C07E81] font-bold text-sm underline">Mulai Belanja</button>
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div key={idx} className="flex gap-4 p-4 bg-slate-50 rounded-[1.5rem] border border-slate-100 group">
                    <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={item.item.img} className="w-full h-full object-cover" alt={item.item.name} />
                    </div>
                    <div className="flex-1 flex flex-col text-left">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-slate-800 text-sm">{item.item.name}</h4>
                        <button onClick={() => removeFromCart(item.item.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-[#C07E81] font-bold text-sm mb-3">Rp {item.item.price.toLocaleString('id-ID')}</p>
                      <div className="flex items-center gap-4 mt-auto">
                        <div className="flex items-center border rounded-lg bg-white overflow-hidden">
                          <button onClick={() => updateQty(item.item.id, -1)} className="p-1 hover:bg-slate-50 border-r"><Minus size={14} /></button>
                          <span className="px-3 text-xs font-bold">{item.qty}</span>
                          <button onClick={() => updateQty(item.item.id, 1)} className="p-1 hover:bg-slate-50 border-l"><Plus size={14} /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t bg-slate-50">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-slate-500 font-medium text-sm uppercase font-bold tracking-widest">Subtotal</span>
                  <span className="text-2xl font-bold text-[#8B4C50]">Rp {totalPrice.toLocaleString('id-ID')}</span>
                </div>
                <button 
                  onClick={checkoutWhatsApp}
                  className="w-full bg-[#25D366] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg hover:bg-[#128C7E] transition-all"
                >
                  <Send size={18} /> Checkout via WhatsApp
                </button>
              </div>
            )}
          </div>
        </div>
      )}
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