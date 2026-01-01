
import { WeddingData, GuestMessage } from './types';

const GOOGLE_SHEET_API_URL = "https://script.google.com/macros/s/AKfycbwEmoyg1MvbuA5s6vtCtr6OcictrH3C7luWZOVs7aHRbduLAi5C6UZ6_elRU44jeuA/exec";
const DEFAULT_MAPS_EMBED = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.936553835694!2d112.0116847!3d-7.8176885!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e785706598379c1%3A0xe5a3637e676100a7!2sMasjid%20Agung%20Kota%20Kediri!5e0!3m2!1sid!2sid!4v1710000000000!5m2!1sid!2sid";

export const DEFAULT_WEDDING_DATA: WeddingData = {
  groomName: "Rizky Ramadhan",
  brideName: "Amanda Syifa Putri",
  groomParents: "Bapak & Ibu Keluarga Pria",
  brideParents: "Bapak & Ibu Keluarga Wanita",
  coupleShortName: "Rizky & Amanda",
  weddingDate: "2025-10-12T09:00:00",
  turutMengundang: ["Segenap Kerabat & Sahabat"],
  assets: {
    floralCorner: "https://i.ibb.co/Lz0xYm8/floral-corner-refined.png",
    floralCornerMid: "https://i.ibb.co/Lz0xYm8/floral-corner-refined.png", 
    floralCornerBack: "https://i.ibb.co/Lz0xYm8/floral-corner-refined.png", 
    floralSide: "https://i.ibb.co/Lz0xYm8/floral-corner-refined.png", 
    heroImage: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800",
    bridePhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=500",
    groomPhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=500",
    splashBg: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1080",
    coupleBg: "", eventsBg: "", galleryBg: "", giftBg: ""
  },
  gallery: [],
  events: [
    {
      title: 'Akad Nikah',
      date: '2025-10-12',
      time: '08.00 WIB',
      location: 'Masjid Agung',
      address: 'Kediri',
      mapsUrl: '',
      mapsEmbedUrl: DEFAULT_MAPS_EMBED
    }
  ],
  bankAccounts: [],
  wishlist: [],
  audioUrl: "/musik.mp3",
  catalogConfig: {
    heroTitle: "Undangan Digital",
    heroSubtitle: "Berbagi momen spesial dengan Murah !",
    heroImages: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=400"
    ],
    categories: ["Spesial Foto", "Spesial Tanpa Foto", "Minimalist Luxury", "Adat"],
    themes: [
      {
        id: "theme-1",
        name: "SPESIAL 01",
        category: "Spesial Foto",
        originalPrice: 210000,
        price: 132000,
        desc: "Desain floral biru modern.",
        img: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600",
        previewUrl: "/undangan/hani-pupud"
      }
    ]
  }
};

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

export const verifyAdminPinFromCloud = async (pin: string): Promise<boolean> => {
  return pin === "admin123";
};

export const fetchWeddingData = async (): Promise<WeddingData> => {
  try {
    const response = await fetch(GOOGLE_SHEET_API_URL);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return { ...DEFAULT_WEDDING_DATA, ...(data.settings || data) };
  } catch (error) {
    const saved = localStorage.getItem('wedding_invitation_data');
    return saved ? JSON.parse(saved) : DEFAULT_WEDDING_DATA;
  }
};

export const saveWeddingDataToCloud = async (data: WeddingData) => {
  localStorage.setItem('wedding_invitation_data', JSON.stringify(data));
  if (!GOOGLE_SHEET_API_URL) return;
  try {
    await fetch(GOOGLE_SHEET_API_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update_settings', ...data })
    });
  } catch (e) { console.error(e); }
};

export const fetchGuestMessages = async (): Promise<GuestMessage[]> => {
  try {
    const response = await fetch(`${GOOGLE_SHEET_API_URL}?action=get_messages`);
    const data = await response.json();
    return Array.isArray(data) ? data : (data.messages || []);
  } catch (e) { return []; }
};

export const sendGuestMessageToCloud = async (message: GuestMessage) => {
  try {
    await fetch(GOOGLE_SHEET_API_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'submit_message', ...message })
    });
  } catch (e) { console.error(e); }
};
