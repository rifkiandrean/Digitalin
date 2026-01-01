
import React, { useState, useEffect } from 'react';
import { ShoppingBag, Star, ChevronRight, ArrowLeft, MessageSquare, Tag, Zap, Sparkles } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import { InvitationTemplate } from '../types';

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
  }
];

const TemplateStore: React.FC = () => {
  const [templates, setTemplates] = useState<InvitationTemplate[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    const saved = localStorage.getItem('vell_invitation_templates');
    if (saved) {
      setTemplates(JSON.parse(saved));
    } else {
      setTemplates(DEFAULT_TEMPLATES);
      localStorage.setItem('vell_invitation_templates', JSON.stringify(DEFAULT_TEMPLATES));
    }
  }, []);

  const categories = ['All', 'Modern', 'Floral', 'Minimalist', 'Elegant'];
  const filteredTemplates = selectedCategory === 'All' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
  };

  const handleOrder = (template: InvitationTemplate) => {
    const message = `Halo Vell Digital, saya ingin memesan Undangan Digital dengan desain: ${template.name} (${template.category})`;
    window.open(`https://wa.me/628123456789?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* Navbar - Mobile Optimized */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-lg border-b border-slate-100 h-16 sm:h-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
          <a href="/" className="flex items-center gap-1.5 text-slate-600 hover:text-indigo-600 transition-all group">
            <div className="p-2 hover:bg-slate-100 rounded-full">
              <ArrowLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
            </div>
            <span className="hidden sm:inline font-bold text-sm">Beranda</span>
          </a>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <Zap size={18} className="text-white fill-current sm:scale-110" />
            </div>
            <span className="font-black text-base sm:text-xl tracking-tight text-slate-800">Vell Store</span>
          </div>
          
          <a 
            href="/undangan/admin" 
            className="bg-slate-900 text-white px-4 py-2 sm:px-6 sm:py-2.5 rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-md active:scale-95"
          >
            Admin
          </a>
        </div>
      </nav>

      {/* Hero Section - Responsive Typography */}
      <section className="pt-28 sm:pt-40 pb-10 sm:pb-20 px-4 sm:px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] mb-6">
              <Sparkles size={12} />
              Premium Templates
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 mb-6 leading-[1.15]">
              Katalog <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">Undangan Digital.</span>
            </h1>
            <p className="text-slate-500 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed px-2">
              Pilih desain eksklusif yang modern dan responsif untuk momen paling berharga dalam hidup Anda.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Sticky Categories - Better Touch Interaction */}
      <div className="sticky top-16 sm:top-20 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 py-3 sm:py-5">
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto scrollbar-hide flex justify-start sm:justify-center gap-2 sm:gap-4 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2.5 sm:py-3 rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all border shrink-0 ${
                selectedCategory === cat 
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl shadow-indigo-100 scale-105' 
                : 'bg-white text-slate-400 border-slate-100 hover:border-indigo-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid - Adaptive Columns & Gaps */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
        {filteredTemplates.map((template, idx) => (
          <ScrollReveal key={template.id} delay={idx * 50} direction="up">
            <div className="bg-white p-3 sm:p-4 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 group h-full flex flex-col">
              
              {/* Card Media */}
              <div className="aspect-[3/4] sm:aspect-[4/5] relative overflow-hidden rounded-[1.8rem] sm:rounded-[2rem] mb-5 sm:mb-6">
                <img 
                  src={template.previewImageUrl} 
                  alt={template.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                />
                
                {/* Visual Overlays */}
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex flex-col gap-2 pointer-events-none">
                  {template.isPopular && (
                    <div className="bg-amber-400/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-xl text-[9px] font-black uppercase flex items-center gap-1.5 shadow-lg border border-white/20">
                      <Star size={10} fill="currentColor" /> Popular
                    </div>
                  )}
                  <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl text-[9px] font-black uppercase text-slate-800 shadow-sm border border-slate-100/50">
                    {template.category}
                  </div>
                </div>

                <div className="absolute inset-0 bg-indigo-900/5 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex items-center justify-center">
                    <div className="bg-white/95 text-indigo-600 p-4 rounded-full shadow-2xl scale-50 group-hover:scale-100 transition-transform duration-500">
                        <ShoppingBag size={24} />
                    </div>
                </div>
              </div>

              {/* Card Details */}
              <div className="px-2 pb-2 flex-1 flex flex-col">
                <div className="mb-4">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-1.5 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                      {template.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-lg">
                      <Tag size={12} className="opacity-70" />
                      <span className="font-black text-xs sm:text-sm tracking-tight">{formatPrice(template.price)}</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => handleOrder(template)}
                  className="mt-auto w-full bg-slate-900 text-white py-4 sm:py-4.5 rounded-[1.25rem] sm:rounded-[1.5rem] font-black text-[10px] sm:text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-2.5 hover:bg-indigo-600 transition-all active:scale-[0.97] shadow-lg shadow-slate-100 group-hover:shadow-indigo-100"
                >
                  <MessageSquare size={16} />
                  Pesan Desain
                </button>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* No Results Illustration */}
      {filteredTemplates.length === 0 && (
        <div className="max-w-sm mx-auto text-center py-20 px-6">
          <div className="w-24 h-24 bg-slate-100 rounded-[2.5rem] flex items-center justify-center text-slate-300 mx-auto mb-8 animate-pulse">
            <ShoppingBag size={48} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-3">Tidak Menemukan Apapun</h3>
          <p className="text-slate-500 text-sm leading-relaxed mb-10">Kategori ini sedang kosong, silakan telusuri desain luar biasa kami lainnya.</p>
          <button 
            onClick={() => setSelectedCategory('All')}
            className="px-8 py-4 bg-white text-indigo-600 border-2 border-indigo-100 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-sm"
          >
            Tampilkan Semua
          </button>
        </div>
      )}

      {/* Promotional Footer Banner */}
      <section className="px-4 sm:px-6 mt-10">
        <div className="max-w-7xl mx-auto bg-slate-900 rounded-[3rem] p-8 sm:p-20 text-center text-white relative overflow-hidden shadow-2xl">
           <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px]"></div>
           <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-[100px]"></div>
           
           <div className="relative z-10">
              <ScrollReveal>
                <div className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-[9px] font-black uppercase tracking-[0.3em] mb-8">
                  Custom Request
                </div>
                <h2 className="text-3xl sm:text-5xl font-black mb-8 leading-tight max-w-2xl mx-auto">Butuh Desain yang Berbeda?</h2>
                <p className="text-slate-400 mb-12 max-w-xl mx-auto leading-relaxed text-sm sm:text-lg">
                  Konsultasikan konsep pernikahan impian Anda, dan biarkan tim kreatif kami mewujudkannya menjadi undangan digital yang tak terlupakan.
                </p>
                <a 
                  href="https://wa.me/628123456789" 
                  className="inline-flex items-center gap-3 bg-indigo-600 text-white px-8 sm:px-12 py-4 sm:py-5 rounded-2xl sm:rounded-3xl font-black hover:bg-indigo-500 transition-all shadow-xl active:scale-95 uppercase tracking-widest text-[10px] sm:text-xs"
                >
                  <MessageSquare size={18} />
                  Hubungi Kreatif Kami
                </a>
              </ScrollReveal>
           </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="py-12 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-6 h-6 bg-slate-200 rounded-lg flex items-center justify-center">
            <Zap size={14} className="text-slate-400" />
          </div>
          <span className="font-black text-sm tracking-tight text-slate-400">Vell Digital</span>
        </div>
        <p className="text-slate-300 text-[9px] font-black uppercase tracking-[0.4em]">© 2026 Crafted with Excellence</p>
      </footer>
      
      {/* Mobile Custom Scroll Style */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @media (max-width: 640px) {
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default TemplateStore;
