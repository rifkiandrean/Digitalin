
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
    <div className="min-h-screen bg-white font-sans text-slate-900 pb-20">
      {/* Navbar - Refined to match image */}
      <nav className="fixed top-0 w-full z-50 bg-white border-b border-slate-100 h-16 sm:h-20 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
              <Zap size={22} className="text-white fill-current" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800">Vell Store</span>
          </div>
          
          <a 
            href="/undangan/admin" 
            className="bg-[#0f172a] text-white px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 active:scale-95"
          >
            Admin
          </a>
        </div>
      </nav>

      {/* Hero Section - Matched to provided layout image */}
      <section className="pt-32 sm:pt-44 pb-12 sm:pb-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 px-6 py-2 bg-rose-50 text-rose-500 rounded-full text-[11px] font-black uppercase tracking-[0.2em] mb-8 border border-rose-100/50">
              <Sparkles size={14} className="animate-pulse" />
              Premium Templates
            </div>
            <h1 className="text-4xl sm:text-6xl font-black text-[#1e293b] mb-6 leading-tight">
              Katalog <span className="text-[#4f46e5]">Undangan Digital.</span>
            </h1>
            <p className="text-slate-500 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed px-4">
              Desain eksklusif yang modern dan responsif untuk momen paling berharga dalam hidup Anda.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Filter Section - Clean horizontal scroll matching the image */}
      <div className="sticky top-16 sm:top-20 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 py-4 mb-8">
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto no-scrollbar flex items-center gap-3 justify-start sm:justify-center">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all border shrink-0 ${
                selectedCategory === cat 
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl shadow-indigo-100 scale-105' 
                : 'bg-white text-slate-400 border-slate-100 hover:border-indigo-600 hover:text-indigo-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product List - Better mobile handling */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
        {filteredTemplates.map((template, idx) => (
          <ScrollReveal key={template.id} delay={idx * 50} direction="up">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group flex flex-col h-full">
              
              {/* Media Part */}
              <div className="aspect-[4/5] relative overflow-hidden m-3 rounded-[2rem]">
                <img 
                  src={template.previewImageUrl} 
                  alt={template.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                />
                
                {/* Floating Badges - Pill Style from Image */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
                  {template.isPopular && (
                    <div className="bg-[#fbbf24] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg border border-white/20 flex items-center gap-1.5">
                      Popular
                    </div>
                  )}
                  <div className="bg-white text-slate-800 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md border border-slate-100">
                    {template.category}
                  </div>
                </div>

                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="bg-white p-4 rounded-full shadow-2xl scale-50 group-hover:scale-100 transition-transform duration-500">
                        <ShoppingBag size={24} className="text-indigo-600" />
                    </div>
                </div>
              </div>

              {/* Content Part */}
              <div className="p-6 pt-2 flex flex-col flex-1">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
                      {template.name}
                  </h3>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 text-indigo-600 rounded-xl">
                    <Tag size={12} className="opacity-70" />
                    <span className="font-black text-sm tracking-tight">{formatPrice(template.price)}</span>
                  </div>
                </div>

                <button 
                  onClick={() => handleOrder(template)}
                  className="mt-auto w-full bg-[#1e293b] text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all active:scale-[0.98] shadow-lg shadow-slate-200"
                >
                  <MessageSquare size={18} />
                  Pesan Sekarang
                </button>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* No Results Handling */}
      {filteredTemplates.length === 0 && (
        <div className="max-w-md mx-auto text-center py-24 px-6">
          <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-200 mx-auto mb-8">
            <ShoppingBag size={48} />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-4">Belum Ada Desain</h3>
          <p className="text-slate-500 leading-relaxed mb-10">Kategori ini belum memiliki pilihan desain. Kami sedang menyiapkan template baru untuk Anda.</p>
          <button 
            onClick={() => setSelectedCategory('All')}
            className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all"
          >
            Kembali Ke Semua
          </button>
        </div>
      )}

      {/* Custom Bottom CTA */}
      <section className="px-6 mt-16 sm:mt-24">
        <div className="max-w-7xl mx-auto bg-[#4f46e5] rounded-[3rem] p-10 sm:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-indigo-200/50">
           <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[120px]"></div>
           <div className="relative z-10">
              <ScrollReveal>
                <h2 className="text-3xl sm:text-5xl font-black mb-8 leading-tight max-w-2xl mx-auto">Mewujudkan Undangan <br />Impian Anda.</h2>
                <p className="text-indigo-100 mb-12 max-w-xl mx-auto leading-relaxed text-sm sm:text-lg">
                  Tim desainer profesional kami siap membantu Anda menciptakan undangan yang unik dan tak terlupakan.
                </p>
                <a 
                  href="https://wa.me/628123456789" 
                  className="inline-flex items-center gap-3 bg-white text-indigo-600 px-10 py-5 rounded-[1.5rem] font-black hover:bg-slate-50 transition-all shadow-2xl active:scale-95 uppercase tracking-[0.15em] text-[11px] sm:text-xs"
                >
                  <MessageSquare size={20} />
                  Hubungi Konsultan Kami
                </a>
              </ScrollReveal>
           </div>
        </div>
      </section>

      {/* Footer Branding */}
      <footer className="py-16 text-center border-t border-slate-100 mt-20">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
            <Zap size={16} className="text-slate-400 fill-current" />
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-400">Vell Digital</span>
        </div>
        <p className="text-slate-300 text-[10px] font-black uppercase tracking-[0.4em]">© 2026 Crafted with Passion</p>
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
