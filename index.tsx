
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Zap } from 'lucide-react';

const BootLoader = () => {
  const [loading, setLoading] = useState(true);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpacity(0);
      setTimeout(() => setLoading(false), 500); // Wait for fade out
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  if (!loading) return <App />;

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-slate-50 flex flex-col items-center justify-center transition-opacity duration-500 ease-in-out"
      style={{ opacity }}
    >
      <div className="relative group">
        {/* Animated Rings */}
        <div className="absolute -inset-8 bg-indigo-500/10 rounded-full animate-[ping_3s_linear_infinite]" />
        <div className="absolute -inset-4 bg-indigo-500/5 rounded-full animate-[ping_2s_linear_infinite]" />
        
        {/* Logo Container */}
        <div className="relative w-20 h-20 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center shadow-[0_20px_50px_rgba(79,70,229,0.3)] transform hover:scale-105 transition-transform duration-500">
          <Zap size={40} className="text-white fill-current animate-pulse" />
        </div>
      </div>

      {/* Brand Name Animation */}
      <div className="mt-12 text-center">
        <div className="flex items-center justify-center gap-0.5 mb-2">
          {['V', 'E', 'L', 'L'].map((char, i) => (
            <span 
              key={i} 
              className="text-2xl font-black text-slate-800 tracking-tight animate-[fade-in-up_1s_ease-out_forwards]"
              style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}
            >
              {char}
            </span>
          ))}
          <span className="w-2" />
          {['D', 'I', 'G', 'I', 'T', 'A', 'L'].map((char, i) => (
            <span 
              key={i} 
              className="text-2xl font-black text-indigo-600 tracking-tight animate-[fade-in-up_1s_ease-out_forwards]"
              style={{ animationDelay: `${(i + 4) * 0.1}s`, opacity: 0 }}
            >
              {char}
            </span>
          ))}
        </div>
        
        {/* Progress Bar */}
        <div className="w-32 h-1 bg-slate-200 rounded-full mx-auto mt-4 overflow-hidden">
          <div className="h-full bg-indigo-600 w-0 animate-[loading-bar_1.5s_ease-in-out_forwards]" />
        </div>
      </div>

      {/* Footer Tagline */}
      <div className="absolute bottom-12 flex flex-col items-center gap-2">
        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-300">
          Digital Solutions • Premium Service
        </p>
      </div>

      <style>{`
        @keyframes loading-bar {
          0% { width: 0; }
          100% { width: 100%; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <BootLoader />
  </React.StrictMode>
);
