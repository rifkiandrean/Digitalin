
import React, { useState } from 'react';
import { ArrowLeft, ExternalLink, Zap, Smartphone, Globe, Layers, Filter } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import { PortfolioItem } from '../types';

const PORTFOLIO_DATA: PortfolioItem[] = [
  {
    id: '1',
    title: 'Website Profil Desa Wisata',
    category: 'Website',
    client: 'Pemerintah Desa Sumberjo',
    description: 'Platform informasi pariwisata terpadu dengan sistem booking homestay dan integrasi peta wisata interaktif.',
    imageUrl: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&q=80&w=800',
    tags: ['React', 'Leaflet JS', 'Tailwind']
  },
  {
    id: '2',
    title: 'Vell Coffee POS System',
    category: 'Sistem',
    client: 'Vell Coffee & Roastery',
    description: 'Sistem manajemen inventaris dan kasir berbasis cloud dengan laporan penjualan real-time dan manajemen stok otomatis.',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-04ff4361cc56?auto=format&fit=crop&q=80&w=800',
    tags: ['Next.js', 'Firebase', 'PWA']
  },
  {
    id: '3',
    title: 'Eternal Love - Premium Wedding',
    category: 'Undangan',
    client: 'Hani & Pupud',
    description: 'Undangan digital eksklusif dengan fitur dashboard pengelolaan tamu, RSVP otomatis via WA, dan galeri interaktif.',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
    tags: ['Custom Design', 'WhatsApp API']
  },
  {
    id: '4',
    title: 'E-Commerce Fashion Local',
    category: 'Website',
    client: 'Urban Style ID',
    description: 'Toko online modern dengan sistem pembayaran otomatis, integrasi kurir, dan panel admin yang user-friendly.',
    imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800',
    tags: ['React', 'Node.js', 'Stripe']
  },
  {
    id: '5',
    title: 'Digital Menu & Ordering',
    category: 'Sistem',
    client: 'The Gourmet Kitchen',
    description: 'Scan QR menu dengan fitur pesan langsung ke dapur untuk mengurangi antrean dan meningkatkan efisiensi resto.',
    imageUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=800',
    tags: ['Mobile First', 'Real-time DB']
  },
  {
    id: '6',
    title: 'Botanical Garden Series',
    category: 'Undangan',
    client: 'Rizky & Amanda',
    description: 'Seri undangan bertema alam dengan animasi scroll yang smooth dan integrasi playlist musik khusus.',
    imageUrl: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=800',
    tags: ['Animation', 'Sound JS']
  }
];

const Portfolio: React.FC = () => {
  const [filter, setFilter] = useState<'All' | 'Website' | 'Undangan' | 'Sistem'>('All');

  const filteredItems = filter === 'All' 
    ? PORTFOLIO_DATA 
    : PORTFOLIO_DATA.filter(item => item.category === filter);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 h-16 sm:h-20 px-6">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
             <a href="/" className="p-2 hover:bg-slate-100 rounded-full transition-colors mr-2">
                <ArrowLeft size={20} className="text-slate-600" />
             </a>
             <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-100">
                    <Zap size={18} className="text-white fill-current" />
                </div>
                <span className="font-bold text-lg tracking-tight text-slate-800">Vell Portfolio</span>
             </div>
          </div>
          <a 
            href="https://wa.me/628123456789" 
            className="bg-slate-900 text-white px-5 py-2 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 active:scale-95"
          >
            Mulai Proyek
          </a>
        </div>
      </nav>

      {/* Hero Header */}
      <section className="pt-32 sm:pt-48 pb-12 sm:pb-24 px-6 text-center bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
             <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-indigo-100">
                <Layers size={14} />
                Selected Works
             </div>
             <h1 className="text-4xl sm:text-6xl font-black text-slate-900 mb-6 leading-tight">
               Karya Digital <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">Penuh Makna.</span>
             </h1>
             <p className="text-slate-500 text-sm sm:text-xl leading-relaxed max-w-2xl mx-auto font-medium">
               Melihat bagaimana kami membantu bisnis dan individu bertransformasi melalui solusi teknologi yang inovatif dan desain yang memukau.
             </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Filtering */}
      <div className="sticky top-16 sm:top-20 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-3 overflow-x-auto no-scrollbar justify-start sm:justify-center">
          <div className="flex items-center gap-2 mr-4 text-slate-400">
            <Filter size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">Filter:</span>
          </div>
          {['All', 'Website', 'Undangan', 'Sistem'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat as any)}
              className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                filter === cat 
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' 
                : 'bg-white text-slate-500 border-slate-100 hover:border-indigo-200 hover:text-indigo-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Project Grid */}
      <section className="max-w-7xl mx-auto px-6 py-12 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((project, idx) => (
            <ScrollReveal key={project.id} delay={idx * 100} direction="up">
              <div className="group relative bg-white rounded-[2rem] border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-500 h-full flex flex-col">
                {/* Image Container */}
                <div className="aspect-video overflow-hidden relative">
                  <img 
                    src={project.imageUrl} 
                    alt={project.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-md text-slate-800 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg border border-white/20">
                      {project.category}
                    </span>
                  </div>
                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-indigo-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                     <div className="bg-white p-4 rounded-full text-indigo-600 scale-50 group-hover:scale-100 transition-transform duration-500">
                        <ExternalLink size={24} />
                     </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 flex-1 flex flex-col">
                  <div className="text-[10px] font-black uppercase text-indigo-600 tracking-widest mb-2">
                    Client: {project.client}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-indigo-600 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="mt-auto flex flex-wrap gap-2">
                    {project.tags.map(tag => (
                      <span key={tag} className="bg-slate-50 text-slate-400 px-3 py-1 rounded-md text-[9px] font-bold uppercase tracking-tighter">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
        
        {filteredItems.length === 0 && (
          <div className="py-32 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <Layers size={32} />
            </div>
            <p className="text-slate-400 font-medium">Belum ada karya untuk kategori ini.</p>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <div className="bg-[#1e293b] rounded-[3.5rem] p-12 sm:p-24 text-center text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-indigo-600/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px]"></div>
           <div className="relative z-10">
              <ScrollReveal>
                <h2 className="text-3xl sm:text-5xl font-black mb-8 leading-tight">Mulai Transformasi <br />Digital Bisnis Anda Sekarang</h2>
                <p className="text-slate-400 mb-12 max-w-xl mx-auto text-sm sm:text-lg">
                  Bergabunglah dengan ratusan klien sukses kami. Mari buat sesuatu yang luar biasa bersama tim ahli Vell Digital.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="https://wa.me/628123456789"
                    className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-900/20"
                  >
                    Konsultasi Gratis
                  </a>
                  <button className="bg-white/5 border border-white/10 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-white/10 transition-all">
                    Unduh Katalog PDF
                  </button>
                </div>
              </ScrollReveal>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100 text-center">
         <p className="text-slate-300 text-[10px] font-black uppercase tracking-[0.4em] mb-4">
           © 2026 Crafted with Excellence by Vell Digital.
         </p>
      </footer>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;  
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Portfolio;
