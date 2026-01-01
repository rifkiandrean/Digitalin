
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
    <div className="min-h-screen bg-white font-sans text-slate-900 pb-20">
      {/* Navbar - Refined with Brand Icon */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-slate-100 h-16 sm:h-20 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100 group">
              <Zap size={18} className="text-white fill-current group-hover:scale-110 transition-transform sm:w-[22px] sm:h-[22px]" />
            </div>
            <div>
              <span className="font-black text-base sm:text-xl tracking-tight text-slate-800 block leading-none">Vell Store</span>
              <span className="text-[8px] sm:text-[9px] font-bold text-indigo-600 uppercase tracking-widest">E-Katalog Undangan</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <a 
              href="/" 
              className="hidden sm:flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-sm transition-colors"
            >
              <ArrowLeft size={18} /> Beranda
            </a>
            <a 
              href="/undangan/admin" 
              className="bg-[#0f172a] text-white px-3 sm:px-5 py-2 sm:py-2.5 rounded-full text-[9px] sm:text-[11px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 active:scale-95"
            >
              Manage
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-28 sm:pt-48 pb-8 sm:pb-24 px-6 bg-gradient-to-b from-slate-50 to-white text-center">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-1.5 sm:py-2 bg-rose-50 text-rose-500 rounded-full text-[9px] sm:text-[11px] font-black uppercase tracking-[0.2em] mb-6 sm:mb-8 border border-rose-100/50">
              <Sparkles size={12} className="animate-pulse sm:w-[14px] sm:h-[14px]" />
              Special Occasion
            </div>
            <h1 className="text-3xl sm:text-7xl font-black text-[#1e293b] mb-4 sm:mb-6 leading-[1.2] sm:leading-[1.1]">
              Katalog <br className="sm:hidden" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-500 to-indigo-600">Undangan Digital.</span>
            </h1>
            <p className="text-slate-500 text-sm sm:text-xl max-w-2xl mx-auto leading-relaxed px-2">
              Temukan berbagai pilihan desain premium yang dirancang untuk menyampaikan kabar bahagia Anda dengan cara yang paling berkesan.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Filter Chips - Sticky behavior */}
      <div className="sticky top-16 sm:top-20 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 py-3 sm:py-5">
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto no-scrollbar flex items-center gap-2 sm:gap-3 justify-start sm:justify-center">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 sm:px-8 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl text-[9px] sm:text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all border shrink-0 ${
                selectedCategory === cat 
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl shadow-indigo-200 scale-105' 
                : 'bg-white text-slate-400 border-slate-100 hover:border-indigo-200 hover:text-indigo-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-2 sm:px-8 mt-8 sm:mt-12">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400">
            <Loader2 size={40} className="animate-spin mb-4 text-indigo-600" />
            <p className="text-sm font-bold uppercase tracking-widest">Menghubungkan ke Database...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-8">
            {filteredTemplates.map((template, idx) => (
              <ScrollReveal key={template.id} delay={idx * 50} direction="up">
                <div className="bg-white rounded-[1.5rem] sm:rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-[0_20px_50px_rgba(79,70,229,0.12)] transition-all duration-700 group flex flex-col h-full">
                  
                  {/* Media Container */}
                  <div className="aspect-[4/5] relative overflow-hidden m-1.5 sm:m-3.5 rounded-[1.2rem] sm:rounded-[2rem]">
                    <img 
                      src={template.previewImageUrl} 
                      alt={template.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms] ease-out"
                    />
                    
                    {/* Floating Labels */}
                    <div className="absolute top-2 sm:top-4 left-2 sm:left-4 flex flex-col gap-1 sm:gap-2 pointer-events-none">
                      {template.isPopular && (
                        <div className="bg-[#fbbf24] text-white px-2 sm:px-4 py-1 sm:py-2 rounded-full text-[7px] sm:text-[9px] font-black uppercase tracking-widest shadow-xl border border-white/20 flex items-center gap-1 backdrop-blur-sm bg-[#fbbf24]/90">
                          <Star size={8} fill="currentColor" className="sm:w-[10px] sm:h-[10px]" /> Best
                        </div>
                      )}
                      <div className="bg-white/95 text-slate-800 px-2 sm:px-4 py-1 sm:py-2 rounded-full text-[7px] sm:text-[9px] font-black uppercase tracking-widest shadow-md border border-slate-100/50">
                        {template.category}
                      </div>
                    </div>

                    <div className="absolute inset-0 bg-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="bg-white p-3 sm:p-5 rounded-full shadow-2xl scale-50 group-hover:scale-100 transition-transform duration-500">
                            <ShoppingBag size={18} className="text-indigo-600 sm:w-6 sm:h-6" />
                        </div>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-3 sm:p-7 pt-1 sm:pt-2 flex flex-col flex-1">
                    <div className="mb-3 sm:mb-6">
                      <h3 className="text-sm sm:text-xl font-bold text-slate-800 mb-1 sm:mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1">
                          {template.name}
                      </h3>
                      <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3.5 py-1 sm:py-1.5 bg-indigo-50/50 text-indigo-600 rounded-lg sm:rounded-xl border border-indigo-50">
                        <Tag size={10} className="opacity-70 sm:w-3 sm:h-3" />
                        <span className="font-black text-[10px] sm:text-sm tracking-tight">{formatPrice(template.price)}</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleOrder(template)}
                      className="mt-auto w-full bg-[#1e293b] text-white py-3 sm:py-4.5 rounded-xl sm:rounded-[1.5rem] font-black text-[9px] sm:text-[11px] uppercase tracking-[0.15em] sm:tracking-[0.2em] flex items-center justify-center gap-2 sm:gap-3 hover:bg-indigo-600 transition-all active:scale-[0.97] shadow-lg shadow-slate-100 group-hover:shadow-indigo-100"
                    >
                      <MessageSquare size={14} className="sm:w-[18px] sm:h-[18px]" />
                      <span className="hidden sm:inline">Pesan Sekarang</span>
                      <span className="sm:hidden">Pesan</span>
                    </button>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>

      {/* Benefits Section */}
      <section className="max-w-7xl mx-auto px-6 mt-16 sm:mt-24 mb-8 sm:mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {[
            { icon: Zap, title: "Pengerjaan Cepat", desc: "Undangan siap digunakan dalam waktu kurang dari 24 jam." },
            { icon: CheckCircle2, title: "Full Kustomisasi", desc: "Ubah teks, foto, dan lagu sesuai keinginan tanpa biaya tambahan." },
            { icon: Smartphone, title: "Mobile Optimized", desc: "Tampilan sempurna di semua jenis perangkat smartphone dan tablet." }
          ].map((benefit, i) => (
            <div key={i} className="bg-slate-50 p-6 sm:p-8 rounded-2xl sm:rounded-[2rem] border border-slate-100">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg sm:rounded-xl flex items-center justify-center text-indigo-600 mb-4 sm:mb-6 shadow-sm">
                <benefit.icon size={20} className="sm:w-6 sm:h-6" />
              </div>
              <h4 className="font-bold text-base sm:text-lg mb-1 sm:mb-2">{benefit.title}</h4>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Custom Request CTA */}
      <section className="px-4 sm:px-6 mt-12 sm:mt-24">
        <div className="max-w-7xl mx-auto bg-[#4f46e5] rounded-[2.5rem] sm:rounded-[3.5rem] p-10 sm:p-24 text-center text-white relative overflow-hidden shadow-[0_35px_60px_-15px_rgba(79,70,229,0.3)]">
           <div className="absolute top-0 right-0 w-[20rem] sm:w-[40rem] h-[20rem] sm:h-[40rem] bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[60px] sm:blur-[100px]"></div>
           <div className="absolute bottom-0 left-0 w-[15rem] sm:w-[30rem] h-[15rem] sm:h-[30rem] bg-indigo-400/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-[60px] sm:blur-[100px]"></div>
           
           <div className="relative z-10">
              <ScrollReveal>
                <div className="inline-block px-4 sm:px-5 py-1.5 sm:py-2 bg-white/10 backdrop-blur-md rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-6 sm:mb-10 border border-white/20">
                  Exclusive Services
                </div>
                <h2 className="text-2xl sm:text-6xl font-black mb-6 sm:mb-8 leading-[1.2] sm:leading-[1.15] max-w-3xl mx-auto">
                  Belum Menemukan <br />Desain yang Pas?
                </h2>
                <p className="text-indigo-100 mb-8 sm:mb-12 max-w-xl mx-auto leading-relaxed text-xs sm:text-lg font-medium px-4">
                  Jangan khawatir, tim kreatif kami siap mewujudkan konsep eksklusif Anda menjadi undangan digital yang benar-benar unik.
                </p>
                <a 
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=Halo Vell Digital, saya ingin berkonsultasi mengenai desain undangan custom.`}
                  className="inline-flex items-center gap-3 sm:gap-4 bg-white text-indigo-600 px-8 sm:px-12 py-4 sm:py-5.5 rounded-2xl sm:rounded-[2rem] font-black hover:bg-slate-50 transition-all shadow-2xl active:scale-95 uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[10px] sm:text-xs"
                >
                  <MessageSquare size={18} className="sm:w-5 sm:h-5" />
                  Mulai Konsultasi
                </a>
              </ScrollReveal>
           </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="py-12 sm:py-16 text-center border-t border-slate-100 mt-16 sm:mt-24 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-8">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
              <Zap size={16} className="text-slate-400 fill-current" />
            </div>
            <span className="font-bold text-base sm:text-lg tracking-tight text-slate-400">Vell Digital</span>
          </div>
          <p className="text-slate-300 text-[8px] sm:text-[10px] font-black uppercase tracking-[0.4em] px-4">
            © 2026 Crafted with Excellence for your moments.
          </p>
          <div className="flex gap-6">
             <a href="#" className="text-slate-400 hover:text-indigo-600 text-[9px] sm:text-[10px] font-black uppercase tracking-widest">Privacy</a>
             <a href="#" className="text-slate-400 hover:text-indigo-600 text-[9px] sm:text-[10px] font-black uppercase tracking-widest">Terms</a>
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
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;  
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default TemplateStore;
