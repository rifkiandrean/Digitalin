
import React, { useState, useEffect } from 'react';
import { ShoppingBag, Star, ChevronRight, ArrowLeft, MessageSquare, Tag, Zap, Sparkles, Smartphone, CheckCircle2 } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import { InvitationTemplate } from '../types';

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
    const message = `Halo Vell Digital, saya ingin memesan Undangan Digital dengan desain: *${template.name}* (Kategori: ${template.category}). Mohon info langkah selanjutnya.`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 pb-20">
      {/* Navbar - Refined with Brand Icon */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-slate-100 h-16 sm:h-20 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100 group">
              <Zap size={22} className="text-white fill-current group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <span className="font-black text-xl tracking-tight text-slate-800 block leading-none">Vell Store</span>
              <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest">E-Katalog Undangan</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <a 
              href="/" 
              className="hidden sm:flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-sm transition-colors"
            >
              <ArrowLeft size={18} /> Beranda
            </a>
            <a 
              href="/undangan/admin" 
              className="bg-[#0f172a] text-white px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 active:scale-95"
            >
              Manage
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 sm:pt-48 pb-12 sm:pb-24 px-6 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-5xl mx-auto text-center">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 px-6 py-2 bg-rose-50 text-rose-500 rounded-full text-[11px] font-black uppercase tracking-[0.2em] mb-8 border border-rose-100/50">
              <Sparkles size={14} className="animate-pulse" />
              Special Occasion
            </div>
            <h1 className="text-4xl sm:text-7xl font-black text-[#1e293b] mb-6 leading-[1.1]">
              Katalog <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-500 to-indigo-600">Undangan Digital.</span>
            </h1>
            <p className="text-slate-500 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed px-4">
              Temukan berbagai pilihan desain premium yang dirancang untuk menyampaikan kabar bahagia Anda dengan cara yang paling berkesan.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Filter Chips - Sticky behavior */}
      <div className="sticky top-16 sm:top-20 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 py-5">
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto no-scrollbar flex items-center gap-3 justify-start sm:justify-center">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-8 py-3.5 rounded-2xl text-[10px] sm:text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all border shrink-0 ${
                selectedCategory === cat 
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xl shadow-indigo-200 scale-105' 
                : 'bg-white text-slate-400 border-slate-100 hover:border-indigo-200 hover:text-indigo-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredTemplates.map((template, idx) => (
          <ScrollReveal key={template.id} delay={idx * 50} direction="up">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-[0_20px_50px_rgba(79,70,229,0.12)] transition-all duration-700 group flex flex-col h-full">
              
              {/* Media Container */}
              <div className="aspect-[4/5] relative overflow-hidden m-3.5 rounded-[2rem]">
                <img 
                  src={template.previewImageUrl} 
                  alt={template.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms] ease-out"
                />
                
                {/* Floating Labels */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
                  {template.isPopular && (
                    <div className="bg-[#fbbf24] text-white px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl border border-white/20 flex items-center gap-1.5 backdrop-blur-sm bg-[#fbbf24]/90">
                      <Star size={10} fill="currentColor" /> Best Choice
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
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
                      {template.name}
                  </h3>
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-indigo-50/50 text-indigo-600 rounded-xl border border-indigo-50">
                    <Tag size={12} className="opacity-70" />
                    <span className="font-black text-sm tracking-tight">{formatPrice(template.price)}</span>
                  </div>
                </div>

                <button 
                  onClick={() => handleOrder(template)}
                  className="mt-auto w-full bg-[#1e293b] text-white py-4.5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all active:scale-[0.97] shadow-lg shadow-slate-100 group-hover:shadow-indigo-100"
                >
                  <MessageSquare size={18} />
                  Pesan Sekarang
                </button>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* Benefits Section */}
      <section className="max-w-7xl mx-auto px-6 mt-24 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Zap, title: "Pengerjaan Cepat", desc: "Undangan siap digunakan dalam waktu kurang dari 24 jam." },
            { icon: CheckCircle2, title: "Full Kustomisasi", desc: "Ubah teks, foto, dan lagu sesuai keinginan tanpa biaya tambahan." },
            { icon: Smartphone, title: "Mobile Optimized", desc: "Tampilan sempurna di semua jenis perangkat smartphone dan tablet." }
          ].map((benefit, i) => (
            <div key={i} className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-indigo-600 mb-6 shadow-sm">
                <benefit.icon size={24} />
              </div>
              <h4 className="font-bold text-lg mb-2">{benefit.title}</h4>
              <p className="text-slate-500 text-sm leading-relaxed">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Custom Request CTA */}
      <section className="px-6 mt-16 sm:mt-24">
        <div className="max-w-7xl mx-auto bg-[#4f46e5] rounded-[3.5rem] p-12 sm:p-24 text-center text-white relative overflow-hidden shadow-[0_35px_60px_-15px_rgba(79,70,229,0.3)]">
           <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px]"></div>
           <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-indigo-400/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-[100px]"></div>
           
           <div className="relative z-10">
              <ScrollReveal>
                <div className="inline-block px-5 py-2 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-10 border border-white/20">
                  Exclusive Services
                </div>
                <h2 className="text-3xl sm:text-6xl font-black mb-8 leading-[1.15] max-w-3xl mx-auto">
                  Belum Menemukan <br />Desain yang Pas?
                </h2>
                <p className="text-indigo-100 mb-12 max-w-xl mx-auto leading-relaxed text-sm sm:text-lg font-medium">
                  Jangan khawatir, tim kreatif kami siap mewujudkan konsep eksklusif Anda menjadi undangan digital yang benar-benar unik.
                </p>
                <a 
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=Halo Vell Digital, saya ingin berkonsultasi mengenai desain undangan custom.`}
                  className="inline-flex items-center gap-4 bg-white text-indigo-600 px-12 py-5.5 rounded-[2rem] font-black hover:bg-slate-50 transition-all shadow-2xl active:scale-95 uppercase tracking-[0.2em] text-[11px] sm:text-xs"
                >
                  <MessageSquare size={20} />
                  Mulai Konsultasi
                </a>
              </ScrollReveal>
           </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="py-16 text-center border-t border-slate-100 mt-24 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
              <Zap size={16} className="text-slate-400 fill-current" />
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-400">Vell Digital</span>
          </div>
          <p className="text-slate-300 text-[10px] font-black uppercase tracking-[0.4em]">
            © 2026 Crafted with Excellence for your moments.
          </p>
          <div className="flex gap-6">
             <a href="#" className="text-slate-400 hover:text-indigo-600 text-[10px] font-black uppercase tracking-widest">Privacy</a>
             <a href="#" className="text-slate-400 hover:text-indigo-600 text-[10px] font-black uppercase tracking-widest">Terms</a>
          </div>
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
