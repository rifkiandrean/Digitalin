
import React, { useState, useEffect } from 'react';
import { ShoppingBag, Star, ChevronRight, ArrowLeft, MessageSquare, Tag, Zap, Sparkles, Smartphone, CheckCircle2, Loader2, CloudIcon } from 'lucide-react';
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

  useEffect(() => {
    const loadTemplates = async () => {
      setIsLoading(true);
      try {
        const cloudTemplates = await fetchTemplateCatalog();
        if (cloudTemplates && cloudTemplates.length > 0) {
          setTemplates(cloudTemplates);
        } else {
          // Check local storage if cloud is empty
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

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* Navbar - Refined for single column focus */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-slate-100 h-16 sm:h-20 px-4 sm:px-8">
        <div className="max-w-md mx-auto h-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-100 group">
              <Zap size={18} className="text-white fill-current group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <span className="font-black text-sm sm:text-lg tracking-tight text-slate-800 block leading-none">Vell Store</span>
              <span className="text-[8px] font-bold text-indigo-600 uppercase tracking-widest">Premium Invitation</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <a 
              href="/" 
              className="p-2 text-slate-500 hover:text-indigo-600 transition-colors"
              title="Beranda"
            >
              <ArrowLeft size={18} />
            </a>
            <a 
              href="/undangan/admin" 
              className="bg-slate-900 text-white px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all active:scale-95"
            >
              Admin
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-8 px-6 text-center">
        <div className="max-w-md mx-auto">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-rose-50 text-rose-500 rounded-full text-[9px] font-black uppercase tracking-[0.2em] mb-4 border border-rose-100/50">
              <Sparkles size={12} className="animate-pulse" />
              Special Occasion
            </div>
            <h1 className="text-3xl font-black text-slate-800 mb-3 leading-tight">
              Katalog <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">Undangan Digital</span>
            </h1>
            <p className="text-slate-400 text-xs leading-relaxed px-4">
              Pilih desain premium favoritmu dan buat momen bahagiamu semakin berkesan.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Filter Chips - Center Aligned */}
      <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 py-3">
        <div className="max-w-md mx-auto px-4 overflow-x-auto no-scrollbar flex items-center gap-2 justify-start sm:justify-center">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all border shrink-0 ${
                selectedCategory === cat 
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' 
                : 'bg-white text-slate-400 border-slate-100 hover:border-indigo-200 hover:text-indigo-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid - Single Column Focused */}
      <div className="max-w-md mx-auto px-6 mt-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400">
            <Loader2 size={32} className="animate-spin mb-4 text-indigo-600" />
            <p className="text-[10px] font-black uppercase tracking-widest">Loading Catalog...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-10">
            {filteredTemplates.map((template, idx) => (
              <ScrollReveal key={template.id} delay={idx * 50} direction="up">
                <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group flex flex-col h-full">
                  
                  {/* Media Container */}
                  <div className="aspect-[4/5] relative overflow-hidden m-3.5 rounded-[2rem]">
                    <img 
                      src={template.previewImageUrl} 
                      alt={template.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms] ease-out"
                    />
                    
                    {/* Floating Labels */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
                      {template.isPopular && (
                        <div className="bg-[#fbbf24] text-white px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl border border-white/20 flex items-center gap-1 backdrop-blur-sm bg-[#fbbf24]/90">
                          <Star size={10} fill="currentColor" /> Best
                        </div>
                      )}
                      <div className="bg-white/95 text-slate-800 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest shadow-md border border-slate-100/50">
                        {template.category}
                      </div>
                    </div>

                    <div className="absolute inset-0 bg-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="bg-white p-5 rounded-full shadow-2xl scale-50 group-hover:scale-100 transition-transform duration-500">
                            <ShoppingBag size={24} className="text-indigo-600" />
                        </div>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-7 pt-2 flex flex-col flex-1">
                    <div className="mb-6 text-center">
                      <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
                          {template.name}
                      </h3>
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50/50 text-indigo-600 rounded-xl border border-indigo-50">
                        <Tag size={12} className="opacity-70" />
                        <span className="font-black text-sm tracking-tight">{formatPrice(template.price)}</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleOrder(template)}
                      className="mt-auto w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all active:scale-[0.97] shadow-lg shadow-slate-100 group-hover:shadow-indigo-100"
                    >
                      <MessageSquare size={18} />
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
      <section className="max-w-md mx-auto px-6 mt-16">
        <div className="space-y-4">
          {[
            { icon: Zap, title: "Pengerjaan Cepat", desc: "Undangan siap digunakan dalam waktu kurang dari 24 jam." },
            { icon: CheckCircle2, title: "Full Kustomisasi", desc: "Ubah teks, foto, dan lagu sesuai keinginan tanpa biaya tambahan." },
            { icon: Smartphone, title: "Mobile Optimized", desc: "Tampilan sempurna di semua jenis perangkat smartphone." }
          ].map((benefit, i) => (
            <div key={i} className="bg-white p-6 rounded-[1.8rem] border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
                <benefit.icon size={22} />
              </div>
              <div>
                <h4 className="font-bold text-sm mb-0.5">{benefit.title}</h4>
                <p className="text-slate-400 text-[10px] leading-relaxed">{benefit.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 text-center border-t border-slate-100 mt-16 px-6">
        <div className="max-w-md mx-auto flex flex-col items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
              <Zap size={16} className="text-slate-400 fill-current" />
            </div>
            <span className="font-bold text-base tracking-tight text-slate-400">Vell Digital</span>
          </div>
          <p className="text-slate-300 text-[8px] font-black uppercase tracking-[0.4em]">
            © 2026 Premium Wedding Service
          </p>
        </div>
      </footer>
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default TemplateStore;
