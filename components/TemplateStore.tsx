
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
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-24">
      {/* Navbar - Matched with Landing Page */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-all group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold text-sm">Beranda</span>
          </a>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Zap size={18} className="text-white fill-current" />
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-800">Vell Store</span>
          </div>
          <a 
            href="/undangan/admin" 
            className="bg-slate-100 text-slate-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
          >
            Manage
          </a>
        </div>
      </nav>

      {/* Hero Section - Matched with Landing Page */}
      <section className="pt-32 pb-12 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <ScrollReveal>
            <span className="inline-block px-4 py-1.5 bg-rose-50 text-rose-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
              Premium Templates
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
              Katalog Desain <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-indigo-600">Undangan Digital.</span>
            </h1>
            <p className="text-slate-500 text-base max-w-xl mx-auto leading-relaxed">
              Pilih desain eksklusif yang mencerminkan kisah cinta Anda. Semua template dapat dikustomisasi penuh dengan fitur modern.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Filters - Modern Chips Style */}
      <div className="sticky top-16 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 py-4 px-6 overflow-x-auto scrollbar-hide">
        <div className="max-w-6xl mx-auto flex justify-center gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
                selectedCategory === cat 
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200 scale-105' 
                : 'bg-white text-slate-400 border-slate-100 hover:border-indigo-200 hover:text-indigo-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid - Styled as Service Cards */}
      <div className="max-w-6xl mx-auto px-6 mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredTemplates.map((template, idx) => (
          <ScrollReveal key={template.id} delay={idx * 100} direction="up">
            <div className="bg-white p-4 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group h-full flex flex-col">
              {/* Image Container */}
              <div className="aspect-[4/5] relative overflow-hidden rounded-[2rem] mb-6">
                <img 
                  src={template.previewImageUrl} 
                  alt={template.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                
                {/* Floating Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {template.isPopular && (
                    <div className="bg-amber-400 text-white px-3 py-1.5 rounded-xl text-[9px] font-black uppercase flex items-center gap-1 shadow-lg backdrop-blur-sm bg-amber-400/90">
                      <Sparkles size={10} fill="currentColor" /> Best Seller
                    </div>
                  )}
                  <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-[9px] font-black uppercase text-slate-800 shadow-sm border border-slate-100/50">
                    {template.category}
                  </div>
                </div>

                {/* Hover Overlay Button */}
                <div className="absolute inset-0 bg-indigo-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="bg-white text-indigo-600 p-4 rounded-full shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <ShoppingBag size={24} />
                    </div>
                </div>
              </div>

              {/* Content */}
              <div className="px-2 pb-2 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
                    {template.name}
                </h3>
                
                <div className="flex items-center gap-2 text-indigo-600 mb-6">
                  <div className="p-1.5 bg-indigo-50 rounded-lg">
                    <Tag size={14} className="fill-indigo-600/10" />
                  </div>
                  <span className="font-black text-sm tracking-tight">{formatPrice(template.price)}</span>
                </div>

                <button 
                  onClick={() => handleOrder(template)}
                  className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all active:scale-95 shadow-lg shadow-slate-200 group-hover:shadow-indigo-100"
                >
                  <MessageSquare size={16} />
                  Pesan Sekarang
                </button>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="max-w-md mx-auto text-center py-24 px-6">
          <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-300 mx-auto mb-6">
            <ShoppingBag size={40} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Belum Tersedia</h3>
          <p className="text-slate-500 text-sm">Maaf, kategori ini belum memiliki pilihan desain. Silakan cek kategori lainnya.</p>
          <button 
            onClick={() => setSelectedCategory('All')}
            className="mt-8 text-indigo-600 font-black text-xs uppercase tracking-widest border-b-2 border-indigo-600 pb-1"
          >
            Lihat Semua Desain
          </button>
        </div>
      )}

      {/* Bottom Footer Section */}
      <section className="mt-20 px-6">
        <div className="max-w-6xl mx-auto bg-indigo-600 rounded-[3rem] p-10 md:p-16 text-center text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
           <div className="relative z-10">
              <h2 className="text-3xl font-black mb-6">Ingin Desain Custom?</h2>
              <p className="text-indigo-100 mb-10 max-w-lg mx-auto leading-relaxed text-sm font-medium">
                Punya konsep sendiri yang ingin diwujudkan? Tim kreatif kami siap membantu membuat undangan yang 100% unik untuk Anda.
              </p>
              <a 
                href="https://wa.me/628123456789" 
                className="inline-flex items-center gap-3 bg-white text-indigo-600 px-10 py-5 rounded-[2rem] font-black hover:bg-indigo-50 transition-all shadow-xl active:scale-95 uppercase tracking-widest text-[11px]"
              >
                <Zap size={18} className="fill-indigo-600" />
                Konsultasi Custom
              </a>
           </div>
        </div>
      </section>
    </div>
  );
};

export default TemplateStore;
