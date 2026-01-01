
import React from 'react';
import { ArrowLeft, MessageSquare, CheckCircle2, Zap } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import { services } from './LandingPage';

interface ServiceDetailProps {
  path: string;
}

const ServiceDetail: React.FC<ServiceDetailProps> = ({ path }) => {
  const service = services.find(s => s.path === path);

  if (!service) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
       <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Halaman Tidak Ditemukan</h1>
          <a href="/" className="text-indigo-600 font-bold hover:underline">Kembali ke Beranda</a>
       </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Navbar Minimalis */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors">
            <ArrowLeft size={20} />
            <span className="font-bold text-sm">Kembali</span>
          </a>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center">
              <Zap size={14} className="text-white fill-current" />
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-800">Vell Digital</span>
          </div>
        </div>
      </nav>

      {/* Hero Service */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <div className={`w-20 h-20 ${service.color} rounded-3xl flex items-center justify-center text-white mb-8 shadow-xl`}>
              <service.icon size={40} />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
              {service.title}
            </h1>
            <p className="text-slate-500 text-xl leading-relaxed mb-10">
              {service.desc} Kami memberikan solusi terbaik yang dirancang khusus untuk memenuhi ekspektasi dan kebutuhan bisnis Anda di era digital.
            </p>
          </ScrollReveal>

          {/* Features / Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {[
              "Desain Eksklusif & Modern",
              "Optimasi Performa & Kecepatan",
              "SEO Friendly & Responsif",
              "Dukungan Teknis Prioritas",
              "Keamanan Data Terjamin",
              "Integrasi Sistem Kustom"
            ].map((feature, idx) => (
              <ScrollReveal key={idx} delay={idx * 50} direction="up">
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <CheckCircle2 size={24} className="text-indigo-600 flex-shrink-0" />
                  <span className="font-bold text-slate-700">{feature}</span>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* CTA Section */}
          <ScrollReveal direction="up" delay={300}>
            <div className="bg-indigo-900 rounded-[3rem] p-10 md:p-16 text-center text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
               <div className="relative z-10">
                  <h2 className="text-3xl font-bold mb-6">Siap Memulai Proyek Anda?</h2>
                  <p className="text-indigo-200 mb-10 max-w-lg mx-auto leading-relaxed">
                    Konsultasikan ide Anda secara gratis dengan tim ahli kami dan dapatkan penawaran harga terbaik.
                  </p>
                  <a 
                    href="https://wa.me/628123456789" 
                    className="inline-flex items-center gap-3 bg-white text-indigo-900 px-10 py-5 rounded-3xl font-black hover:bg-indigo-50 transition-all shadow-2xl active:scale-95 uppercase tracking-widest text-sm"
                  >
                    <MessageSquare size={20} />
                    Hubungi WhatsApp
                  </a>
               </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer Minimalis */}
      <footer className="py-12 border-t mt-12">
         <div className="max-w-4xl mx-auto px-6 text-center">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">© 2026 Vell Digital Service</p>
            <div className="flex justify-center gap-6">
               <a href="/" className="text-slate-500 hover:text-indigo-600 text-sm font-medium">Beranda</a>
               <a href="/undangan" className="text-slate-500 hover:text-indigo-600 text-sm font-medium">Layanan</a>
               <a href="https://wa.me/628123456789" className="text-slate-500 hover:text-indigo-600 text-sm font-medium">Kontak</a>
            </div>
         </div>
      </footer>
    </div>
  );
};

export default ServiceDetail;
