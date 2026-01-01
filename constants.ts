
import { WeddingData, GuestMessage } from './types';

// GANTI URL INI DENGAN URL DEPLOYMENT GOOGLE APPS SCRIPT ANDA
const GOOGLE_SHEET_API_URL = "https://script.google.com/macros/s/AKfycbwEmoyg1MvbuA5s6vtCtr6OcictrH3C7luWZOVs7aHRbduLAi5C6UZ6_elRU44jeuA/exec";

// Link Embed default untuk Masjid Agung Kota Kediri
const DEFAULT_MAPS_EMBED = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.936553835694!2d112.0116847!3d-7.8176885!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e785706598379c1%3A0xe5a3637e676100a7!2sMasjid%20Agung%20Kota%20Kediri!5e0!3m2!1sid!2sid!4v1710000000000!5m2!1sid!2sid";

// Default Data untuk Hani & Pupud
export const DEFAULT_WEDDING_DATA: WeddingData = {
  groomName: "Pupud Ardianto",
  brideName: "Hani Fatimatuzzahra",
  groomParents: "Bapak & Ibu Keluarga Pria",
  brideParents: "Bapak & Ibu Keluarga Wanita",
  groomInstagram: "https://instagram.com/",
  brideInstagram: "https://instagram.com/",
  coupleShortName: "Hani & Pupud",
  weddingDate: "2026-05-16T09:00:00",
  turutMengundang: [
    "Keluarga Besar Bpk. Ahmad",
    "Keluarga Besar Bpk. Yusuf",
    "Segenap Kerabat & Sahabat"
  ],
  assets: {
    floralCorner: "https://i.ibb.co/Lz0xYm8/floral-corner-refined.png",
    floralCornerMid: "https://i.ibb.co/Lz0xYm8/floral-corner-refined.png", 
    floralCornerBack: "https://i.ibb.co/Lz0xYm8/floral-corner-refined.png", 
    floralSide: "https://i.ibb.co/Lz0xYm8/floral-corner-refined.png", 
    heroImage: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1080",
    bridePhoto: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&q=80&w=500",
    groomPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=500",
    splashBg: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=1080",
    coupleBg: "",
    eventsBg: "",
    galleryBg: "",
    giftBg: "",
    guestbookBg: ""
  },
  gallery: [
    { id: '1', url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=600', alt: 'Gallery 1' },
    { id: '2', url: 'https://images.unsplash.com/photo-1519225495810-751783d9a7a9?auto=format&fit=crop&q=80&w=600', alt: 'Gallery 2' },
    { id: '3', url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=600', alt: 'Gallery 3' },
    { id: '4', url: 'https://images.unsplash.com/photo-1522673607200-1648832cee98?auto=format&fit=crop&q=80&w=600', alt: 'Gallery 4' },
  ],
  events: [
    {
      title: 'Akad Nikah',
      date: '2026-05-16',
      time: '08.00 - 10.00 WIB',
      location: 'Masjid Raya',
      address: 'Jl. Utama No. 123, Kota Bahagia',
      mapsUrl: 'https://maps.app.goo.gl/sNJBfN491XT8BG2G6',
      mapsEmbedUrl: DEFAULT_MAPS_EMBED
    },
    {
      title: 'Resepsi Pernikahan',
      date: '2026-05-16',
      time: '11.00 - 14.00 WIB',
      location: 'Aula Serbaguna',
      address: 'Jl. Pemuda No. 45, Kota Bahagia',
      mapsUrl: 'https://maps.app.goo.gl/sNJBfN491XT8BG2G6',
      mapsEmbedUrl: DEFAULT_MAPS_EMBED
    }
  ],
  bankAccounts: [
    {
      bankName: "BCA",
      accountNumber: "1234567890",
      accountHolder: "Hani Fatimatuzzahra",
    }
  ],
  wishlist: [
    { name: "Coffee Maker", description: "Untuk menemani pagi kami" }
  ],
  audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
};

// Helper: Convert Google Drive links to usable URLs
export const getDriveMediaUrl = (url: string, type: 'image' | 'audio' = 'image'): string => {
  if (!url || !url.includes('drive.google.com')) return url;
  const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
  if (fileIdMatch && fileIdMatch[1]) {
    const fileId = fileIdMatch[1];
    if (type === 'image') return `https://lh3.googleusercontent.com/d/${fileId}`;
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  }
  return url;
};

const getLocalFallback = (): WeddingData => {
  try {
      const saved = localStorage.getItem('wedding_invitation_data');
      return saved ? JSON.parse(saved) : DEFAULT_WEDDING_DATA;
  } catch (e) {
      return DEFAULT_WEDDING_DATA;
  }
};

export const fetchWeddingData = async (): Promise<WeddingData> => {
  if (!GOOGLE_SHEET_API_URL || GOOGLE_SHEET_API_URL.includes("XXXXXXXX")) {
    return getLocalFallback();
  }

  try {
    const response = await fetch(GOOGLE_SHEET_API_URL);
    if (!response.ok) throw new Error('Network response was not ok');
    
    const data = await response.json();
    
    if (data && data.groomName) {
        return data as WeddingData;
    } else if (data && data.settings) {
        return data.settings as WeddingData;
    } else {
        return getLocalFallback();
    }
  } catch (error: any) {
    return getLocalFallback();
  }
};

export const saveWeddingDataToCloud = async (data: WeddingData) => {
  localStorage.setItem('wedding_invitation_data', JSON.stringify(data));

  if (!GOOGLE_SHEET_API_URL || GOOGLE_SHEET_API_URL.includes("XXXXXXXX")) {
    return;
  }

  try {
    const payload = {
        action: 'update_settings',
        ...data
    };

    await fetch(GOOGLE_SHEET_API_URL, {
      method: 'POST',
      mode: 'no-cors', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (error: any) {
    throw error;
  }
};

export const fetchGuestMessages = async (): Promise<GuestMessage[]> => {
    if (!GOOGLE_SHEET_API_URL || GOOGLE_SHEET_API_URL.includes("XXXXXXXX")) {
        return [];
    }

    try {
        const response = await fetch(`${GOOGLE_SHEET_API_URL}?action=get_messages`);
        if (!response.ok) return [];
        const data = await response.json();
        if (Array.isArray(data)) return data;
        if (data && data.messages) return data.messages;
        return [];
    } catch (error) {
        return [];
    }
};

export const sendGuestMessageToCloud = async (message: GuestMessage) => {
    if (!GOOGLE_SHEET_API_URL || GOOGLE_SHEET_API_URL.includes("XXXXXXXX")) {
        return;
    }

    try {
        const payload = {
            action: 'submit_message',
            ...message
        };

        await fetch(GOOGLE_SHEET_API_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    } catch (error) {
        throw error;
    }
};
