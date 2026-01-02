
import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import ServiceDetail from './components/ServiceDetail';
import TemplateStore from './components/TemplateStore';
import UndanganAdmin from './components/UndanganAdmin';
import Portfolio from './components/Portfolio';
import WeddingInvitation from './components/WeddingInvitation';
import GuestGenerator from './components/wedding/GuestGenerator';

// Daftar rute layanan yang didukung
const GENERAL_SERVICE_PATHS = [
  "/website-perusahaan",
  "/website-pemerintahan",
  "/retail-pos",
  "/qr-menu",
  "/ulang-tahun",
  "/e-commerce",
  "/food-delivery"
];

const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handleLocationChange);
    
    // Set dynamic titles based on path
    if (currentPath === '/undangan/hani-pupud') {
      document.title = "Undangan Hani & Pupud";
    } else if (currentPath === '/undangan/hani-pupud/tamugenerator') {
      document.title = "WhatsApp Guest Generator - Hani & Pupud";
    } else if (currentPath === '/undangan') {
      document.title = "Katalog Undangan Digital - Vell Digital";
    } else if (currentPath === '/undangan/admin') {
      document.title = "Admin Katalog Undangan";
    } else if (currentPath === '/portfolio') {
      document.title = "Portfolio Kami - Vell Digital";
    } else if (GENERAL_SERVICE_PATHS.includes(currentPath)) {
      document.title = "Layanan Kami - Vell Digital";
    } else {
      document.title = "Vell Digital Service - Modern Digital Solution";
    }

    return () => window.removeEventListener('popstate', handleLocationChange);
  }, [currentPath]);

  // Main Routing Logic
  if (currentPath === '/undangan/hani-pupud') {
    return <WeddingInvitation />;
  }

  if (currentPath === '/undangan/hani-pupud/tamugenerator') {
    return <GuestGenerator />;
  }
  
  if (currentPath === '/undangan') {
    return <TemplateStore />;
  }
  
  if (currentPath === '/undangan/admin') {
    return <UndanganAdmin />;
  }
  
  if (currentPath === '/portfolio') {
    return <Portfolio />;
  }
  
  if (GENERAL_SERVICE_PATHS.includes(currentPath)) {
    return <ServiceDetail path={currentPath} />;
  }
  
  return <LandingPage />;
};

export default App;
