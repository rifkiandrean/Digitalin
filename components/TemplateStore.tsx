
import React, { useState, useEffect } from 'react';
import { ShoppingBag, Star, ChevronRight, ArrowLeft, MessageSquare, Tag, Zap, Sparkles, Smartphone, CheckCircle2, Loader2, Menu, X, Home, Shield, Grid, Filter, ArrowUpDown, SortAsc, SortDesc, Eye, CreditCard, Wallet, QrCode, ClipboardCheck, LayoutGrid, List } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import { InvitationTemplate } from '../types';
import { fetchTemplateCatalog } from '../constants';

const WHATSAPP_NUMBER = "6282115123431";

const DEFAULT_TEMPLATES: InvitationTemplate[] = [
  {
    id: '1',
    name: 'Eternal Rose Gold',
    price: 150000,
    category: 'Elegant',
    previewImageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
    demoUrl: '/undangan/hani-pupud',
    isPopular: true
  },
  {
    id: '2',
    name: 'Botanical Garden',
    price: 125000,
    category: 'Floral',
    previewImageUrl: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=800',
    demoUrl: '/undangan/hani-pupud'
  },
  {
    id: '3',
    name: 'Minimalist Slate',
    price: 100000,
    category: 'Minimalist',
    previewImageUrl: 'https://images.unsplash.com/photo-1522673607200-1648832cee98?auto=format&fit=crop&q=80&w=800',
    demoUrl: '/undangan/hani-pupud'
  },
  {
    id: '4',
    name: 'Midnight Luxury',
    price: 200000,
    category: 'Elegant',
    previewImageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800',
    demoUrl: '/undangan/hani-pupud',
    isPopular: true
  },
  {
    id: '5',
    name: 'Modern Marble',
    price: 135000,
    category: 'Modern',
    previewImageUrl: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&q=80&w=800',
    demoUrl: '/undangan/hani-pupud'
  },
  {
    id: '6',
    name: 'Rustic Autumn',
    price: 120000,
    category: 'Floral',
    previewImageUrl: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=800',
    demoUrl: '/undangan/hani-pupud'
  }
];

// Defined missing categories constant for filtering
const categories = ['All', 'Modern', 'Floral', 'Minimalist', 'Elegant'];

const TemplateStore: React.FC = () => {
  const [templates, setTemplates] = useState<InvitationTemplate[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('default');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Checkout States
  const [checkoutItem, setCheckoutItem] = useState<InvitationTemplate | null>(null);
  const [paymentStep, setPaymentStep] = useState<'summary' | 'method' | 'processing' | 'success'>('summary');
  const [selectedMethod, setSelectedMethod] = useState<string>('');

  useEffect(() => {
    const loadTemplates = async () => {
      setIsLoading(true);
      try {
        const cloudTemplates = await fetchTemplateCatalog();
        if (cloudTemplates && cloudTemplates.length > 0) {
          setTemplates(cloudTemplates);
        } else {
          setTemplates(DEFAULT_TEMPLATES);
        }
      } catch (error) {
        setTemplates(DEFAULT_TEMPLATES);
      } finally {
        setIsLoading(false);
      }
    };
    loadTemplates();
  }, []);

  const processedTemplates = (() => {
    let filtered = selectedCategory === 'All' 
      ? [...templates] 
      : templates.filter(t => t.category === selectedCategory);

    if (sortBy === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    
    return filtered;
  })();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
  };

  const handleStartCheckout = (template: InvitationTemplate) => {
    setCheckoutItem(template);
    setPaymentStep('summary');
  };

  const handleProcessPayment = () => {
    if (!selectedMethod) {
      alert("Pilih metode pembayaran terlebih dahulu!");
      return;
    }
    setPaymentStep('processing');
    // Simulasi integrasi Midtrans/Xendit
    setTimeout(() => {
      setPaymentStep('success');
    }, 3000);
  };

  const handleCloseCheckout = () => {
    setCheckoutItem(null);
    setSelectedMethod('');
    setPaymentStep('summary');
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 pb-24 w-full overflow-x-hidden">
      {/* Checkout Modal Overlay */}
      {checkoutItem && (
        <div className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl animate-fade-in-up">
            {/* Header Modal */}
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="font-black text-slate-800 uppercase tracking-widest text-xs">
                {paymentStep === 'success' ? 'Pembayaran Berhasil' : 'Checkout Pesanan'}
              </h2>
              {paymentStep !== 'processing' && (
                <button onClick={handleCloseCheckout} className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400">
                  <X size={20} />
                </button>
              )}
            </div>

            {/* Content Modal */}
            <div className="p-8">
              {paymentStep === 'summary' && (
                <div className="space-y-6">
                  <div className="flex gap-4 items-center p-4 bg-slate-50 rounded-2xl">
                    <img src={checkoutItem.previewImageUrl} className="w-16 h-20 object-cover rounded-xl" />
                    <div>
                      <h3 className="font-black text-slate-800">{checkoutItem.name}</h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{checkoutItem.category}</p>
                      <p className="text-indigo-600 font-black mt-1">{formatPrice(checkoutItem.price)}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs font-bold text-slate-400">
                      <span>Harga Desain</span>
                      <span>{formatPrice(checkoutItem.price)}</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold text-slate-400">
                      <span>Biaya Layanan</span>
                      <span>{formatPrice(2500)}</span>
                    </div>
                    <div className="h-px bg-slate-100 my-2" />
                    <div className="flex justify-between items-center">
                      <span className="font-black text-slate-800">Total Bayar</span>
                      <span className="text-xl font-black text-indigo-600">{formatPrice(checkoutItem.price + 2500)}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setPaymentStep('method')}
                    className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl hover:bg-indigo-600 transition-all"
                  >
                    Lanjut ke Pembayaran
                  </button>
                </div>
              )}

              {paymentStep === 'method' && (
                <div className="space-y-6">
                  <h3 className="text-sm font-black text-slate-800 mb-2">Pilih Metode Pembayaran</h3>
                  <div className="space-y-2">
                    {[
                      { id: 'qris', label: 'QRIS (Gopay, OVO, ShopeePay)', icon: QrCode },
                      { id: 'va', label: 'Virtual Account (BCA, Mandiri)', icon: CreditCard },
                      { id: 'wallet', label: 'DANA / LinkAja', icon: Wallet },
                    ].map(method => (
                      <button
                        key={method.id}
                        onClick={() => setSelectedMethod(method.id)}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                          selectedMethod === method.id ? 'border-indigo-600 bg-indigo-50' : 'border-slate-50 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${selectedMethod === method.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                            <method.icon size={18} />
                          </div>
                          <span className="text-xs font-bold text-slate-700">{method.label}</span>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedMethod === method.id ? 'border-indigo-600' : 'border-slate-200'}`}>
                           {selectedMethod === method.id && <div className="w-2 h-2 bg-indigo-600 rounded-full" />}
                        </div>
                      </button>
                    ))}
                  </div>
                  <button 
                    onClick={handleProcessPayment}
                    className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl hover:bg-indigo-700 transition-all"
                  >
                    Bayar Sekarang
                  </button>
                  <button onClick={() => setPaymentStep('summary')} className="w-full text-slate-400 font-bold text-[10px] uppercase tracking-widest">Kembali</button>
                </div>
              )}

              {paymentStep === 'processing' && (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <Loader2 size={64} className="text-indigo-600 animate-spin mb-6" />
                  <h3 className="text-xl font-black text-slate-800 mb-2">Memproses Transaksi</h3>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed px-4">
                    Mohon jangan tutup jendela ini. Kami sedang melakukan sinkronisasi dengan payment gateway aman kami.
                  </p>
                </div>
              )}

              {paymentStep === 'success' && (
                <div className="py-6 flex flex-col items-center justify-center text-center animate-fade-in-up">
                  <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 size={48} className="text-green-500" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 mb-2">Transaksi Sukses!</h3>
                  <div className="bg-slate-50 p-4 rounded-2xl mb-8 w-full border border-slate-100">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">ID Transaksi</p>
                    <p className="font-mono text-sm font-bold text-slate-700">VELL-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                  </div>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed mb-10 px-4">
                    Pesanan Anda telah dikonfirmasi. Dashboard pengelolaan undangan Anda sekarang telah **Aktif Otomatis**.
                  </p>
                  <a 
                    href="/undangan/admin"
                    className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all"
                  >
                    <ClipboardCheck size={18} /> Kelola Undangan Anda
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sidebar - Mobile */}
      <div className={`fixed inset-0 z-[100] transition-visibility duration-300 lg:hidden ${isSidebarOpen ? 'visible' : 'invisible'}`}>
        <div 
          className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={toggleSidebar}
        />
        <div className={`absolute top-0 left-0 w-[280px] h-full bg-white shadow-2xl transition-transform duration-300 ease-out transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
          <div className="p-6 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap size={20} className="text-indigo-600 fill-current" />
              <span className="font-black text-lg tracking-tight">Vell Menu</span>
            </div>
            <button onClick={toggleSidebar} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
              <X size={20} className="text-slate-400" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
            <div className="space-y-1">
              <h3 className="px-4 text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3">Navigasi Utama</h3>
              <a href="/" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-2xl transition-colors font-bold text-sm">
                <Home size={18} /> Beranda
              </a>
              <a href="/undangan/admin" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-2xl transition-colors font-bold text-sm">
                <Shield size={18} /> Area Admin
              </a>
            </div>
            
            <div className="space-y-1">
              <h3 className="px-4 text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3">Tampilan</h3>
              <div className="grid grid-cols-2 gap-2 px-4">
                  <button onClick={() => { setViewMode('grid'); toggleSidebar(); }} className={`flex items-center justify-center gap-2 py-3 rounded-2xl border transition-all font-bold text-xs ${viewMode === 'grid' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                      <LayoutGrid size={16} /> Grid
                  </button>
                  <button onClick={() => { setViewMode('list'); toggleSidebar(); }} className={`flex items-center justify-center gap-2 py-3 rounded-2xl border transition-all font-bold text-xs ${viewMode === 'list' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                      <List size={16} /> List
                  </button>
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="px-4 text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3">Kategori</h3>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setSelectedCategory(cat); toggleSidebar(); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold text-sm ${
                    selectedCategory === cat ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Grid size={18} /> {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navbar Desktop */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-slate-100 h-16 md:h-20">
        <div className="max-w-[1600px] mx-auto h-full px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4 lg:gap-8">
            <button onClick={toggleSidebar} className="p-2 lg:hidden text-slate-800">
              <Menu size={24} />
            </button>
            
            <a href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
                <Zap size={20} className="text-white fill-current md:w-6 md:h-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-sm md:text-lg tracking-tight text-slate-800 leading-none">Vell Store</span>
                <span className="text-[7px] md:text-[9px] font-black text-indigo-500 uppercase tracking-[0.2em] mt-0.5">Premium Invitations</span>
              </div>
            </a>

            <div className="hidden lg:flex items-center gap-4 ml-4">
              <div className="flex items-center gap-1 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      selectedCategory === cat 
                      ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' 
                      : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              
              <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    title="Grid View"
                  >
                    <LayoutGrid size={18} />
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    title="List View"
                  >
                    <List size={18} />
                  </button>
              </div>

              <div className="relative">
                <button 
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="flex items-center gap-2 px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-100 transition-all"
                >
                  <ArrowUpDown size={14} className="text-indigo-600" />
                  <span>Urutkan: {sortBy === 'price-asc' ? 'Termurah' : sortBy === 'price-desc' ? 'Termahal' : 'Default'}</span>
                </button>
                {isSortOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsSortOpen(false)}></div>
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-2xl z-20 overflow-hidden py-2 animate-fade-in-up">
                      {[
                        { id: 'default', label: 'Default', icon: ArrowUpDown },
                        { id: 'price-asc', label: 'Harga Termurah', icon: SortAsc },
                        { id: 'price-desc', label: 'Harga Termahal', icon: SortDesc },
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => { setSortBy(opt.id); setIsSortOpen(false); }}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest transition-all ${
                            sortBy === opt.id ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'
                          }`}
                        >
                          <opt.icon size={14} />
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            <a href="/undangan/admin" className="hidden sm:flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-indigo-600 transition-colors text-xs font-bold uppercase tracking-widest">
                <Shield size={16} /> Admin
            </a>
            <a href="/" className="p-3 text-slate-400 hover:text-indigo-600 transition-colors rounded-full hover:bg-slate-50">
              <Home size={20} />
            </a>
          </div>
        </div>
      </nav>

      <main className="w-full max-w-[1600px] mx-auto pt-24 md:pt-32">
        <section className="pb-12 px-6 text-center lg:text-left lg:flex lg:items-end lg:justify-between lg:pb-16">
          <ScrollReveal className="lg:max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[9px] font-black uppercase tracking-widest mb-4 border border-indigo-100/50">
              <Sparkles size={12} className="animate-pulse" />
              Automated Payment Gateway Ready
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-tight">
              Desain Undangan <br />
              <span className="text-indigo-600 italic">Bisa Langsung Aktif.</span>
            </h1>
            <p className="text-slate-500 text-sm md:text-xl font-medium leading-relaxed">
              Pilih desain favorit Anda, bayar melalui sistem otomatis, dan mulai kustomisasi undangan Anda secara instan tanpa menunggu konfirmasi admin.
            </p>
          </ScrollReveal>
        </section>

        <section className="px-0 md:px-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 text-slate-300">
              <Loader2 size={48} className="animate-spin mb-4 text-indigo-600" />
              <p className="text-xs font-black uppercase tracking-[0.3em]">Syncing Catalog...</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-0 md:gap-8 lg:gap-10">
              {processedTemplates.map((template, idx) => (
                <ScrollReveal key={template.id} delay={idx * 50} direction="up">
                  <div className="bg-white group flex flex-col w-full md:rounded-[3rem] md:border md:border-slate-100 md:overflow-hidden md:shadow-sm md:hover:shadow-2xl transition-all duration-500">
                    <div className="aspect-[3/4] md:aspect-[4/5] relative overflow-hidden w-full">
                      <img src={template.previewImageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3000ms] ease-out" />
                      <div className="absolute top-6 left-6 flex flex-col gap-2 pointer-events-none">
                        {template.isPopular && (
                          <div className="bg-amber-400 text-white px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl flex items-center gap-1.5">
                            <Star size={12} fill="currentColor" /> Terlaris
                          </div>
                        )}
                        <div className="bg-white/95 backdrop-blur-md text-slate-800 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg">
                          {template.category}
                        </div>
                      </div>
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent p-8 pt-24 text-white">
                         <h3 className="text-2xl font-black mb-2 tracking-tight">{template.name}</h3>
                         <div className="bg-white/10 backdrop-blur-xl px-4 py-1.5 rounded-xl inline-flex items-center gap-2 border border-white/10">
                           <Tag size={12} className="text-indigo-300" />
                           <span className="font-black text-sm">{formatPrice(template.price)}</span>
                         </div>
                      </div>
                    </div>

                    <div className="p-6 md:p-8 bg-white flex flex-col gap-3">
                      <button 
                        onClick={() => window.open(template.demoUrl || template.previewImageUrl, '_blank')}
                        className="w-full bg-white text-indigo-600 border border-indigo-100 py-4 rounded-[1.2rem] font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-50 transition-all shadow-sm"
                      >
                        <Eye size={16} /> Lihat Contoh
                      </button>
                      <button 
                        onClick={() => handleStartCheckout(template)}
                        className="w-full bg-slate-900 text-white py-4 rounded-[1.2rem] font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all shadow-xl shadow-slate-100"
                      >
                        <ShoppingBag size={16} /> Pilih Desain
                      </button>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          ) : (
            /* LIST VIEW MODE */
            <div className="flex flex-col gap-4 px-6 md:px-0">
              {processedTemplates.map((template, idx) => (
                <ScrollReveal key={template.id} delay={idx * 50} direction="up">
                  <div className="bg-white p-4 md:p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all flex flex-col md:flex-row gap-6 md:items-center">
                    {/* List Image */}
                    <div className="w-full md:w-32 lg:w-48 aspect-video md:aspect-[3/4] rounded-2xl overflow-hidden relative group shrink-0">
                        <img src={template.previewImageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        {template.isPopular && (
                          <div className="absolute top-2 left-2 bg-amber-400 text-white p-1 rounded-full shadow-lg">
                            <Star size={12} fill="currentColor" />
                          </div>
                        )}
                    </div>

                    {/* List Content */}
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[8px] font-black uppercase tracking-widest">
                                {template.category}
                            </span>
                            {template.isPopular && (
                                <span className="text-[8px] font-black uppercase text-amber-500 tracking-widest">
                                    Pilihan Terpopuler
                                </span>
                            )}
                        </div>
                        <h3 className="text-xl md:text-2xl font-black text-slate-800">{template.name}</h3>
                        <p className="text-slate-400 text-xs font-medium leading-relaxed max-w-lg">
                            Desain eksklusif dengan fitur RSVP otomatis, galeri momen bahagia, dan navigasi peta interaktif untuk memudahkan tamu Anda.
                        </p>
                    </div>

                    {/* List Actions */}
                    <div className="md:w-64 space-y-3">
                        <div className="flex flex-col items-start md:items-end mb-4">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Harga Desain</span>
                            <span className="text-xl font-black text-indigo-600">{formatPrice(template.price)}</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
                            <button 
                                onClick={() => window.open(template.demoUrl || template.previewImageUrl, '_blank')}
                                className="w-full bg-slate-50 text-slate-600 border border-slate-100 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-100 transition-all"
                            >
                                <Eye size={14} /> Lihat
                            </button>
                            <button 
                                onClick={() => handleStartCheckout(template)}
                                className="w-full bg-slate-900 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all shadow-lg"
                            >
                                <ShoppingBag size={14} /> Pilih
                            </button>
                        </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </section>

        <section className="px-6 md:px-8 mt-24 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center md:text-left">
            {[
              { icon: Zap, title: "Aktivasi Instan", desc: "Begitu bayar, dashboard undangan Anda langsung bisa digunakan." },
              { icon: CheckCircle2, title: "Keamanan Terjamin", desc: "Transaksi dienkripsi menggunakan standar keamanan industri." },
              { icon: Smartphone, title: "PWA Support", desc: "Kelola undangan Anda langsung dari smartphone seperti aplikasi native." },
              { icon: Shield, title: "Data Privasi", desc: "Kami menjamin kerahasiaan data tamu dan RSVP pernikahan Anda." }
            ].map((benefit, i) => (
              <ScrollReveal key={i} delay={i * 100} direction="up">
                <div className="bg-slate-50 p-8 rounded-[2.5rem] h-full flex flex-col items-center md:items-start gap-4 border border-slate-100">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
                    <benefit.icon size={28} />
                  </div>
                  <div>
                    <h4 className="font-black text-sm uppercase text-slate-800 mb-2">{benefit.title}</h4>
                    <p className="text-slate-500 text-xs leading-relaxed">{benefit.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>
      </main>

      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
        .transition-visibility { transition-property: visibility; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default TemplateStore;
