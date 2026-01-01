
import React, { useState, useEffect } from 'react';
import { ShoppingBag, Star, ChevronRight, ArrowLeft, Filter, MessageSquare, Tag } from 'lucide-react';
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
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors">
            <ArrowLeft size={20} />
            <span className="font-bold text-sm">Kembali</span>
          </a>
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-indigo-600" />
            <span className="font-bold text-lg tracking-tight">Katalog Undangan</span>
          </div>
          <a href="/undangan/admin" className="text-[10px] font-bold uppercase text-slate-400 hover:text-indigo-600">Admin</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-12 px-6 bg-white border-b">
        <div className="max-w-6xl mx-auto text-center">
          <ScrollReveal>
            <h1 className="text-4xl font-black text-slate-900 mb-4">Pilih Desain Impian Anda</h1>
            <p className="text-slate-500 max-w-xl mx-auto text-sm leading-relaxed">
              Temukan berbagai pilihan desain undangan digital premium yang bisa dikustomisasi sesuai tema pernikahan Anda.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Filters */}
      <div className="sticky top-16 z-40 bg-white/60 backdrop-blur-sm border-b py-4 px-6 mb-8 overflow-x-auto">
        <div className="max-w-6xl mx-auto flex gap-3">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                selectedCategory === cat 
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' 
                : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredTemplates.map((template, idx) => (
          <ScrollReveal key={template.id} delay={idx * 100} direction="up">
            <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 group">
              <div className="aspect-[4/5] relative overflow-hidden">
                <img 
                  src={template.previewImageUrl} 
                  alt={template.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {template.isPopular && (
                  <div className="absolute top-4 left-4 bg-amber-400 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1 shadow-lg">
                    <Star size={10} fill="currentColor" /> Terpopuler
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-slate-800 shadow-sm border border-slate-100">
                  {template.category}
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg text-slate-800 mb-1">{template.name}</h3>
                <div className="flex items-center gap-2 text-indigo-600 font-black text-sm mb-6">
                  <Tag size={14} />
                  {formatPrice(template.price)}
                </div>
                <button 
                  onClick={() => handleOrder(template)}
                  className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all active:scale-95 text-xs uppercase tracking-widest shadow-lg"
                >
                  <MessageSquare size={16} />
                  Pesan Desain
                </button>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-20">
          <p className="text-slate-400 italic">Belum ada template untuk kategori ini.</p>
        </div>
      )}
    </div>
  );
};

export default TemplateStore;
