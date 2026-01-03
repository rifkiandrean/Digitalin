
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
    <div className="min-h-screen bg-white font-sans text-slate-900 pb-24">
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

      {/* Navbar - Centered Header Logic */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 h-16 px-6">
        <div className="max-w-6xl mx-auto h-full relative flex items-center justify-between">
          {/* Left: Sidebar Toggle */}
          <button 
            onClick={toggleSidebar}
            className="p-3 -ml-3 text-slate-800 hover:bg-slate-50 rounded-full transition-colors z-10"
          >
            <Menu size={24} />
          </button>
          
          {/* Center: Branding (Rata Tengah) */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 pointer-events-none sm:pointer-events-auto">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-100 hidden xs:flex">
              <Zap size={18} className="text-white fill-current" />
            </div>
            <div className="flex flex-col items-center">
              <span className="font-black text-sm tracking-tight text-slate-800 leading-none">Vell Store</span>
              <span className="text-[7px] font-black text-indigo-500 uppercase tracking-[0.2em] mt-0.5">Premium Design</span>
            </div>
          </div>
          
          {/* Right: Home Button */}
          <div className="flex items-center z-10">
            <a 
              href="/" 
              className="p-3 -mr-3 text-slate-400 hover:text-indigo-600 transition-colors rounded-full hover:bg-slate-50"
            >
              <Home size={20} />
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto overflow-x-hidden">
        {/* Hero Section */}
        <section className="pt-24 pb-6 px-6 text-center">
          <ScrollReveal>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[8px] font-black uppercase tracking-widest mb-3 border border-indigo-100/50">
              <Sparkles size={10} className="animate-pulse" />
              Latest Collection
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
              Katalog <br />
              <span className="text-indigo-600">Undangan Digital</span>
            </h1>
            <p className="text-slate-500 text-sm md:text-lg font-medium leading-relaxed">
              Momen indah dimulai dengan desain yang istimewa. <br/>
              Kategori: <span className="text-indigo-600 font-bold">{selectedCategory}</span>
            </p>
          </ScrollReveal>
        </section>

        {/* Filter Chip */}
        <div className="px-6 pb-2">
            <button 
                onClick={toggleSidebar}
                className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-400 hover:bg-white shadow-sm"
            >
                <Grid size={12} className="text-indigo-600" />
                Filter: {selectedCategory}
            </button>
        </div>

        {/* Catalog Grid */}
        <div className="w-full mt-4 md:px-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 text-slate-300">
              <Loader2 size={32} className="animate-spin mb-3 text-indigo-600" />
              <p className="text-[10px] font-black uppercase tracking-widest">Memuat Katalog...</p>
            </div>
          ) : filteredTemplates.length === 0 ? (
              <div className="py-24 text-center text-slate-400 bg-slate-50 mx-6 rounded-[2rem] border border-dashed border-slate-200">
                  <ShoppingBag size={36} className="mx-auto mb-3 opacity-20" />
                  <p className="text-sm font-medium">Belum ada desain di kategori ini.</p>
              </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 md:gap-8 divide-y md:divide-y-0 divide-slate-100">
              {filteredTemplates.map((template, idx) => (
                <ScrollReveal key={template.id} delay={idx * 50} direction="up" className="w-full">
                  <div className="bg-white group flex flex-col w-full md:rounded-[2.5rem] md:border md:border-slate-100 md:overflow-hidden md:shadow-sm md:hover:shadow-xl transition-all">
                    
                    {/* Media Container */}
                    <div className="aspect-[4/5] relative overflow-hidden w-full">
                      <img 
                        src={template.previewImageUrl} 
                        alt={template.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms]"
                      />
                      
                      {/* Floating Badges */}
                      <div className="absolute top-6 left-6 flex flex-col gap-2 pointer-events-none">
                        {template.isPopular && (
                          <div className="bg-amber-400 text-white px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl flex items-center gap-1.5">
                            <Star size={12} fill="currentColor" /> Terlaris
                          </div>
                        )}
                        <div className="bg-white/95 backdrop-blur-md text-slate-800 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg border border-white/20">
                          {template.category}
                        </div>
                      </div>

                      {/* Info Overlay Bottom */}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent p-8 pt-20 text-white pointer-events-none">
                         <h3 className="text-2xl font-black mb-1.5 drop-shadow-md">{template.name}</h3>
                         <div className="flex items-center gap-2 opacity-100">
                           <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg flex items-center gap-1.5">
                             <Tag size={12} className="text-indigo-300" />
                             <span className="font-black text-sm">{formatPrice(template.price)}</span>
                           </div>
                         </div>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="p-6 bg-white flex gap-3">
                      <button 
                        onClick={() => handleOrder(template)}
                        className="flex-1 bg-slate-900 text-white py-4.5 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-[0.97] transition-all shadow-xl shadow-slate-100"
                      >
                        <MessageSquare size={16} />
                        Pesan Sekarang
                      </button>
                      <button 
                         className="w-14 h-14 bg-slate-50 text-slate-800 rounded-2xl flex items-center justify-center active:bg-slate-100 transition-colors border border-slate-100"
                         onClick={() => window.open(template.previewImageUrl, '_blank')}
                      >
                        <Grid size={20} />
                      </button>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>

        {/* Benefits Section */}
        <section className="px-6 mt-16 space-y-4 md:grid md:grid-cols-3 md:gap-6 md:space-y-0">
          {[
            { icon: Zap, title: "Cepat", desc: "Selesai dalam 24 jam." },
            { icon: CheckCircle2, title: "Custom", desc: "Bisa ubah foto & lagu." },
            { icon: Smartphone, title: "Responsif", desc: "Tampil oke di semua HP." }
          ].map((benefit, i) => (
            <div key={i} className="bg-slate-50 p-6 rounded-3xl flex items-center gap-4 border border-slate-100">
              <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0">
                <benefit.icon size={22} />
              </div>
              <div>
                <h4 className="font-black text-xs uppercase text-slate-800 tracking-tight">{benefit.title}</h4>
                <p className="text-slate-500 text-[10px] font-medium leading-tight mt-1">{benefit.desc}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Footer */}
        <footer className="py-16 text-center mt-12 bg-slate-50 border-t border-slate-100 px-6">
          <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-7 h-7 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Zap size={14} className="text-indigo-600 fill-current" />
              </div>
              <span className="font-black text-sm tracking-tight text-slate-400">Vell Store</span>
          </div>
          <p className="text-slate-300 text-[7px] font-black uppercase tracking-[0.4em]">
            © 2026 Crafted with Excellence by Vell Digital
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
        @media (max-width: 400px) {
          .xs\:flex { display: flex; }
        }
      `}</style>
    </div>
  );
};

export default TemplateStore;
