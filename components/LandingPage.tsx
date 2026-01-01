
import React from 'react';
import { 
  Globe, 
  Building2, 
  ShoppingCart, 
  QrCode, 
  Heart, 
  Cake, 
  Store, 
  Truck, 
  ChevronRight,
  Zap,
  ShieldCheck,
  Smartphone
} from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export const services = [
  {
    id: "website-perusahaan",
    title: "Website Perusahaan",
    desc: "Profil profesional untuk meningkatkan kredibilitas bisnis Anda di dunia digital.",
    icon: Building2,
    color: "bg-blue-500",
    path: "/website-perusahaan"
  },
  {
    id: "website-pemerintahan",
    title: "Website Pemerintahan",
    desc: "Solusi web informatif dan transparan untuk instansi pemerintah & desa.",
    icon: Globe,
    color: "bg-indigo-600",
    path: "/website-pemerintahan"
  },
  {
    id: "retail-pos",
    title: "Retail/Mesin Kasir",
    desc: "Sistem POS modern untuk pengelolaan stok and penjualan yang lebih efisien.",
    icon: Store,
    color: "bg-emerald-600",
    path: "/retail-pos"
  },
  {
    id: "qr-menu",
    title: "Menu Digital/QR Menu",
    desc: "Transformasi menu fisik ke digital untuk restoran dan kafe kekinian.",
    icon: QrCode,
    color: "bg-orange-500",
    path: "/qr-menu"
  },
  {
    id: "undangan",
    title: "Undangan Pernikahan",
    desc: "Undangan digital elegan dengan fitur RSVP, musik, dan navigasi peta.",
    icon: Heart,
    color: "bg-rose-500",
    path: "/undangan"
  },
  {
    id: "ulang-tahun",
    title: "Undangan Ulang Tahun",
    desc: "Buat perayaan hari lahir lebih ceria dengan undangan digital kustom.",
    icon: Cake,
    color: "bg-purple-500",
    path: "/ulang-tahun"
  },
  {
    id: "e-commerce",
    title: "Aplikasi Jual Beli",
    desc: "Platform e-commerce kustom untuk jangkauan pasar yang lebih luas.",
    icon: ShoppingCart,
    color: "bg-cyan-600",
    path: "/e-commerce"
  },
  {
    id: "food-delivery",
    title: "Aplikasi Antar Makanan",
    desc: "Sistem pemesanan dan pengantaran makanan terpadu untuk bisnis kuliner.",
    icon: Truck,
    color: "bg-amber-500",
    path: "/food-delivery"
  }
];

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 w-full">
      {/* Navbar - Fixed centering for Desktop */}
      <nav className="fixed top-0 left-0 right-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Zap size={18} className="text-white fill-current" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800">Vell Digital</span>
          </div>
          <a 
            href="https://wa.me/628123456789" 
            className="bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-indigo-700 transition-all shadow-md"
          >
            Konsultasi
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <ScrollReveal>
            <span className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
              Modern Digital Agency
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-tight">
              Wujudkan Ide Digital Anda <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">Menjadi Realita.</span>
            </h1>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              Kami menyediakan berbagai solusi teknologi kustom untuk membantu bisnis, instansi, dan momen spesial Anda bersinar di dunia digital.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#services" className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                Lihat Layanan <ChevronRight size={18} />
              </a>
              <button className="bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all">
                Portfolio Kami
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-slate-50 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <ScrollReveal>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Layanan Kami</h2>
              <div className="w-20 h-1.5 bg-indigo-600 mx-auto rounded-full mb-6"></div>
              <p className="text-slate-500">Pilih solusi digital yang sesuai dengan kebutuhan Anda saat ini.</p>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, idx) => (
              <ScrollReveal key={idx} delay={idx * 100} direction="up">
                <a 
                  href={service.path}
                  className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group h-full flex flex-col block text-left"
                >
                  <div className={`w-14 h-14 ${service.color} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                    <service.icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">{service.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1">
                    {service.desc}
                  </p>
                  <div className="text-indigo-600 font-bold text-xs uppercase tracking-widest flex items-center gap-2 group/btn">
                    Info Detail <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                  </div>
                </a>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-indigo-900 text-white">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          <ScrollReveal>
            <div className="text-4xl font-black mb-2">100+</div>
            <div className="text-indigo-200 text-xs uppercase tracking-widest font-bold">Proyek Selesai</div>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <div className="text-4xl font-black mb-2">50+</div>
            <div className="text-indigo-200 text-xs uppercase tracking-widest font-bold">Klien Puas</div>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <div className="text-4xl font-black mb-2">24/7</div>
            <div className="text-indigo-200 text-xs uppercase tracking-widest font-bold">Support Ramah</div>
          </ScrollReveal>
          <ScrollReveal delay={300}>
            <div className="text-4xl font-black mb-2">5+</div>
            <div className="text-indigo-200 text-xs uppercase tracking-widest font-bold">Tahun Pengalaman</div>
          </ScrollReveal>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
            <ScrollReveal direction="left">
              <h2 className="text-4xl font-bold text-slate-900 mb-8 leading-tight">Mengapa Memilih <br />Vell Digital Service?</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="mt-1 bg-green-100 text-green-600 p-1.5 rounded-full h-fit">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 mb-1">Kualitas Terjamin</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">Setiap baris kode kami tulis dengan teliti untuk memastikan performa maksimal dan keamanan data.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="mt-1 bg-blue-100 text-blue-600 p-1.5 rounded-full h-fit">
                    <Smartphone size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 mb-1">Mobile Friendly</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">Semua produk kami dioptimalkan untuk tampilan di perangkat seluler agar mudah diakses siapa saja.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="mt-1 bg-indigo-100 text-indigo-600 p-1.5 rounded-full h-fit">
                    <Zap size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 mb-1">Pengerjaan Cepat</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">Kami menghargai waktu Anda. Proses pengembangan yang terstruktur menjamin ketepatan waktu.</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
          <div className="flex-1 w-full">
            <ScrollReveal direction="right">
              <div className="relative">
                <div className="absolute -inset-4 bg-indigo-100 rounded-[3rem] rotate-3 -z-10"></div>
                <img 
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800" 
                  alt="Modern Office" 
                  className="w-full rounded-[3rem] shadow-2xl"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 border-t py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Zap size={18} className="text-white fill-current" />
            </div>
            <span className="font-bold text-xl text-slate-800">Vell Digital</span>
          </div>
          <div className="flex gap-8 text-slate-500 text-sm font-medium">
            <a href="#" className="hover:text-indigo-600 transition-colors">Layanan</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Portfolio</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Tentang</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Kontak</a>
          </div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
            © 2026 Vell Digital Service. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
