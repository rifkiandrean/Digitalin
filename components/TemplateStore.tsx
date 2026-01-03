
import React, { useState, useEffect } from 'react';
import { ShoppingBag, Star, ChevronRight, ArrowLeft, MessageSquare, Tag, Zap, Sparkles, Smartphone, CheckCircle2, Loader2, Menu, X, Home, Shield, Grid } from 'lucide-react';
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
    previewImageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600',
    isPopular: true
  },
  {
    id: '2',
    name: 'Botanical Garden',
    price: 125000,
    category: 'Floral',
    previewImageUrl: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '3',
    name: 'Minimalist Slate',
    price: 100000,
    category: 'Minimalist',
    previewImageUrl: 'https://images.unsplash.com/photo-1522673607200-1648832cee98?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '4',
    name: 'Midnight Luxury',
    price: 200000,
    category: 'Elegant',
    previewImageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=600',
    isPopular: true
  },
  {
    id: '5',
    name: 'Modern Marble',
    price: 135000,
    category: 'Modern',
    previewImageUrl: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '6',
    name: 'Rustic Autumn',
    price: 120000,
    category: 'Floral',
    previewImageUrl: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=600'
  }
];

const TemplateStore: React.FC = () => {
  const [templates, setTemplates] = useState<InvitationTemplate[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const loadTemplates = async () => {
      setIsLoading(true);
      try {
        const cloudTemplates = await fetchTemplateCatalog();
        if (cloudTemplates && cloudTemplates.length > 0) {
          setTemplates(cloudTemplates);
        } else {
          const saved = localStorage.getItem('vell_invitation_templates');
          if (saved) {
            setTemplates(JSON.parse(saved));
          } else {
            setTemplates(DEFAULT_TEMPLATES);
          }
        }
      } catch (error) {
        console.error("Failed to load templates:", error);
        setTemplates(DEFAULT_TEMPLATES);
      } finally {
        setIsLoading(false);
      }
    };

    loadTemplates();
  }, []);

  const categories = ['All', 'Modern', 'Floral', 'Minimalist', 'Elegant'];
  const filteredTemplates = selectedCategory === 'All' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
  };

  const handleOrder = (template: InvitationTemplate) => {
    const message = `Halo Vell Digital, saya ingin memesan Undangan Digital dengan desain: *${template.name}* (Kategori: ${template.category}). Mohon info langkah selanjutnya.`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-24">
      {/* Sidebar / Navigation Drawer */}
      <div className={`fixed inset-0 z-[100] transition-visibility duration-300 ${isSidebarOpen ? 'visible' : 'invisible'}`}>
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={toggleSidebar}
        />
        
        {/* Sidebar Content */}
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
            {/* Navigation Links */}
            <div className="space-y-1">
              <h3 className="px-4 text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3">Navigasi Utama</h3>
              <a href="/" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-2xl transition-colors font-bold text-sm">
                <Home size={18} /> Beranda
              </a>
              <a href="/undangan/admin" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-2xl transition-colors font-bold text-sm">
                <Shield size={18} /> Area Admin
              </a>
            </div>

            {/* Categories Filter */}
            <div className="space-y-1">
              <h3 className="px-4 text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3">Kategori Desain</h3>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    toggleSidebar();
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold text-sm ${
                    selectedCategory === cat 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                    : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Grid size={18} />
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 border-t">
            <p className="text-[10px] font-black uppercase text-slate-300 tracking-[0.2em] text-center">Vell Digital Service</p>
          </div>
        </div>
      </div>

      {/* Navbar - Tight Padding (px-4) for full screen feel */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 h-16 px-4">
        <div className="max-w-md mx-auto h-full flex items-center justify-between">
          <button 
            onClick={toggleSidebar}
            className="p-2 text-slate-800 hover:bg-slate-50 rounded-full transition-colors"
          >
            <Menu size={22} />
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-100">
              <Zap size={16} className="text-white fill-current" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-sm tracking-tight text-slate-800 leading-none">Vell Store</span>
              <span className="text-[7px] font-black text-indigo-500 uppercase tracking-[0.2em] mt-0.5">Premium Design</span>
            </div>
          </div>
          
          <div className="flex items-center">
            <a 
              href="/" 
              className="p-2 text-slate-400 hover:text-indigo-600 transition-colors rounded-full hover:bg-slate-50"
              title="Beranda"
            >
              <Home size={18} />
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-md mx-auto">
        {/* Hero Section */}
        <section className="pt-24 pb-6 px-4 text-center">
          <ScrollReveal>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[8px] font-black uppercase tracking-widest mb-3 border border-indigo-100/50">
              <Sparkles size={10} className="animate-pulse" />
              Latest Collection
            </div>
            <h1 className="text-2xl font-black text-slate-800 mb-2 leading-tight">
              Katalog <br />
              <span className="text-indigo-600">Undangan Digital</span>
            </h1>
            <p className="text-slate-400 text-[10px] font-medium leading-relaxed">
              Momen indah dimulai dengan desain yang istimewa. <br/>
              Kategori: <span className="text-indigo-600 font-bold">{selectedCategory}</span>
            </p>
          </ScrollReveal>
        </section>

        {/* Selected Category Chip - Visual Feedback */}
        <div className="px-4 pb-2">
            <button 
                onClick={toggleSidebar}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 shadow-sm"
            >
                <Grid size={12} className="text-indigo-600" />
                Filter: {selectedCategory}
            </button>
        </div>

        {/* Catalog Grid - Tight Padding (px-4) */}
        <div className="px-4 mt-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-300">
              <Loader2 size={28} className="animate-spin mb-3 text-indigo-600" />
              <p className="text-[9px] font-black uppercase tracking-widest">Memuat Katalog...</p>
            </div>
          ) : filteredTemplates.length === 0 ? (
              <div className="py-20 text-center text-slate-400 bg-white rounded-[2rem] border border-dashed border-slate-200">
                  <ShoppingBag size={32} className="mx-auto mb-3 opacity-20" />
                  <p className="text-xs font-medium">Belum ada desain di kategori ini.</p>
              </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {filteredTemplates.map((template, idx) => (
                <ScrollReveal key={template.id} delay={idx * 50} direction="up">
                  <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group flex flex-col h-full">
                    
                    {/* Media Container */}
                    <div className="aspect-[4/5] relative overflow-hidden m-2 rounded-[1.8rem]">
                      <img 
                        src={template.previewImageUrl} 
                        alt={template.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1500ms]"
                      />
                      
                      {/* Status Labels */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
                        {template.isPopular && (
                          <div className="bg-amber-400 text-white px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1">
                            <Star size={10} fill="currentColor" /> Terlaris
                          </div>
                        )}
                        <div className="bg-white/90 backdrop-blur-sm text-slate-800 px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest shadow-sm border border-slate-100/50">
                          {template.category}
                        </div>
                      </div>

                      {/* Quick Preview Hover */}
                      <div className="absolute inset-0 bg-indigo-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                          <div className="bg-white/30 backdrop-blur-md p-4 rounded-full border border-white/40 scale-50 group-hover:scale-100 transition-transform duration-500">
                              <ShoppingBag size={20} className="text-white" />
                          </div>
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="p-6 pt-2 flex flex-col flex-1">
                      <div className="mb-5 text-center">
                        <h3 className="text-lg font-black text-slate-800 mb-1.5 group-hover:text-indigo-600 transition-colors">
                            {template.name}
                        </h3>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-600 rounded-xl border border-slate-100">
                          <Tag size={10} className="opacity-50" />
                          <span className="font-black text-xs tracking-tight">{formatPrice(template.price)}</span>
                        </div>
                      </div>

                      <button 
                        onClick={() => handleOrder(template)}
                        className="mt-auto w-full bg-slate-900 text-white py-4.5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all active:scale-[0.98] shadow-lg shadow-slate-100"
                      >
                        <MessageSquare size={14} />
                        Pesan Sekarang
                      </button>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>

        {/* Benefits Section */}
        <section className="px-4 mt-12 space-y-3">
          {[
            { icon: Zap, title: "Cepat", desc: "Selesai dalam 24 jam." },
            { icon: CheckCircle2, title: "Custom", desc: "Bisa ubah foto & lagu." },
            { icon: Smartphone, title: "Responsif", desc: "Tampil oke di semua HP." }
          ].map((benefit, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl flex items-center gap-4 border border-slate-100 shadow-sm">
              <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500 shrink-0">
                <benefit.icon size={16} />
              </div>
              <div>
                <h4 className="font-black text-[10px] uppercase text-slate-800 tracking-tight">{benefit.title}</h4>
                <p className="text-slate-400 text-[9px] font-medium leading-none mt-0.5">{benefit.desc}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Footer */}
        <footer className="py-12 text-center mt-12 px-4">
          <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-6 h-6 bg-slate-200 rounded-lg flex items-center justify-center">
                <Zap size={12} className="text-slate-400 fill-current" />
              </div>
              <span className="font-black text-xs tracking-tight text-slate-400">Vell Store</span>
          </div>
          <p className="text-slate-300 text-[7px] font-black uppercase tracking-[0.4em]">
            © 2026 Crafted with Excellence
          </p>
        </footer>
      </main>
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .transition-visibility {
          transition-property: visibility;
        }
      `}</style>
    </div>
  );
};

export default TemplateStore;
