
import React, { useRef, useEffect, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // Delay dalam milidetik
  direction?: 'up' | 'down' | 'left' | 'right'; // Arah muncul
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({ 
  children, 
  className = "", 
  delay = 0,
  direction = 'up'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Jika elemen masuk viewport sekitar 10%
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Hentikan observe setelah terlihat (animasi sekali jalan)
          if (ref.current) observer.unobserve(ref.current);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px" // Offset sedikit agar animasi mulai saat elemen agak naik
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  // Menentukan posisi awal berdasarkan arah
  const getTransformClass = () => {
    if (isVisible) return 'opacity-100 translate-x-0 translate-y-0';
    
    switch (direction) {
      case 'up': return 'opacity-0 translate-y-12';
      case 'down': return 'opacity-0 -translate-y-12';
      case 'left': return 'opacity-0 -translate-x-12';
      case 'right': return 'opacity-0 translate-x-12';
      default: return 'opacity-0 translate-y-12';
    }
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${getTransformClass()} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
